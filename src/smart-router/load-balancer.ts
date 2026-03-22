import type {
  ILoadBalancer,
  AgentConfig,
  SelectionCriteria,
  LoadBalancingResult,
  IScoringStrategy,
  AgentScore,
  ScoringResult
} from './registry-types';

export class ScoreBasedBalancer implements ILoadBalancer {
  constructor(private readonly scorer: IScoringStrategy) {}

  selectAgent(agents: ReadonlyArray<AgentConfig>, criteria: SelectionCriteria): LoadBalancingResult | null {
    const filteredAgents = this.applySelectionConstraints(agents, criteria);
    
    if (filteredAgents.length === 0) {
      return null;
    }

    // Score all agents
    const scoredAgents: ScoringResult[] = filteredAgents.map(agent => {
      const score = this.scorer.calculate(agent, criteria);
      const breakdown = this.scorer.explain(agent, criteria);
      
      return {
        agent_id: agent.id,
        score: score,
        reasoning: this.generateScoringReasoning(agent, breakdown, score),
        breakdown: breakdown
      };
    });

    // Sort by score (highest first)
    scoredAgents.sort((a, b) => b.score - a.score);
    
    const bestAgent = filteredAgents.find(agent => agent.id === scoredAgents[0].agent_id)!;
    const alternatives = scoredAgents.slice(1); // All except the selected one

    return {
      selected_agent: bestAgent,
      score: scoredAgents[0].score,
      alternatives: alternatives,
      selection_reasoning: this.generateSelectionReasoning(bestAgent, scoredAgents[0], criteria)
    };
  }

  selectMultipleAgents(
    agents: ReadonlyArray<AgentConfig>, 
    criteria: SelectionCriteria, 
    count: number
  ): ReadonlyArray<AgentConfig> {
    const filteredAgents = this.applySelectionConstraints(agents, criteria);
    
    if (filteredAgents.length === 0) {
      return [];
    }

    // Score all agents and sort by score
    const scoredAgents = filteredAgents
      .map(agent => ({
        agent,
        score: this.scorer.calculate(agent, criteria)
      }))
      .sort((a, b) => b.score - a.score);

    // Return top N agents
    return scoredAgents
      .slice(0, Math.min(count, scoredAgents.length))
      .map(item => item.agent);
  }

  private applySelectionConstraints(
    agents: ReadonlyArray<AgentConfig>, 
    criteria: SelectionCriteria
  ): ReadonlyArray<AgentConfig> {
    return agents.filter(agent => {
      // Exclude busy agents if requested
      if (criteria.exclude_busy && agent.availability === 'busy') {
        return false;
      }

      // Exclude offline agents always
      if (agent.availability === 'offline') {
        return false;
      }

      // Apply max workload constraint
      if (criteria.max_workload !== undefined && 
          agent.performance_metrics.current_workload > criteria.max_workload) {
        return false;
      }

      // Apply team preference (if specified, prefer that team but don't exclude others entirely)
      // This is handled in scoring rather than filtering

      return true;
    });
  }

  private generateScoringReasoning(
    agent: AgentConfig, 
    breakdown: any, 
    score: AgentScore
  ): string {
    const reasons: string[] = [];
    
    if (breakdown.expertise_match > 70) {
      reasons.push('strong expertise match');
    } else if (breakdown.expertise_match > 40) {
      reasons.push('moderate expertise match');
    }

    if (breakdown.availability_score === 100) {
      reasons.push('immediately available');
    } else if (breakdown.availability_score > 0) {
      reasons.push('currently busy but accessible');
    }

    if (breakdown.performance_score > 80) {
      reasons.push('excellent performance history');
    } else if (breakdown.performance_score > 60) {
      reasons.push('good performance history');
    }

    if (breakdown.workload_penalty < -10) {
      reasons.push('high current workload');
    } else if (breakdown.workload_penalty === 0) {
      reasons.push('low current workload');
    }

    if (breakdown.preference_bonus > 0) {
      reasons.push('preferred agent');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'baseline scoring';
  }

  private generateSelectionReasoning(
    agent: AgentConfig, 
    result: ScoringResult, 
    criteria: SelectionCriteria
  ): string {
    let reasoning = `Selected ${agent.name} with highest score of ${result.score}`;
    
    if (result.breakdown.expertise_match > 70) {
      reasoning += ' due to strong expertise match';
    }

    if (criteria.team_preference && agent.team === criteria.team_preference) {
      reasoning += ` and preferred team (${agent.team})`;
    }

    if (agent.availability === 'available') {
      reasoning += ' with immediate availability';
    }

    return reasoning;
  }
}

export class RoundRobinBalancer implements ILoadBalancer {
  private currentIndex = 0;

  selectAgent(agents: ReadonlyArray<AgentConfig>, criteria: SelectionCriteria): LoadBalancingResult | null {
    const filteredAgents = this.applySelectionConstraints(agents, criteria);
    
    if (filteredAgents.length === 0) {
      return null;
    }

    // Select agent using round-robin
    const selectedAgent = filteredAgents[this.currentIndex % filteredAgents.length];
    this.currentIndex = (this.currentIndex + 1) % filteredAgents.length;

    // Create alternatives list (all other agents)
    const alternatives: ScoringResult[] = filteredAgents
      .filter(agent => agent.id !== selectedAgent.id)
      .map(agent => ({
        agent_id: agent.id,
        score: 50 as AgentScore, // Neutral score for round-robin
        reasoning: 'round-robin selection',
        breakdown: {
          expertise_match: 50,
          availability_score: agent.availability === 'available' ? 100 : 30,
          performance_score: 50,
          workload_penalty: 0,
          preference_bonus: 0
        }
      }));

    return {
      selected_agent: selectedAgent,
      score: 50 as AgentScore, // Neutral score for round-robin
      alternatives: alternatives,
      selection_reasoning: `Round-robin selection (position ${this.currentIndex})`
    };
  }

  selectMultipleAgents(
    agents: ReadonlyArray<AgentConfig>, 
    criteria: SelectionCriteria, 
    count: number
  ): ReadonlyArray<AgentConfig> {
    const filteredAgents = this.applySelectionConstraints(agents, criteria);
    
    if (filteredAgents.length === 0) {
      return [];
    }

    const selectedAgents: AgentConfig[] = [];
    const maxSelections = Math.min(count, filteredAgents.length);
    
    for (let i = 0; i < maxSelections; i++) {
      const agentIndex = (this.currentIndex + i) % filteredAgents.length;
      const agent = filteredAgents[agentIndex];
      
      // Avoid duplicates in case count > filteredAgents.length
      if (!selectedAgents.find(selected => selected.id === agent.id)) {
        selectedAgents.push(agent);
      }
    }
    
    // Update current index for next selection
    this.currentIndex = (this.currentIndex + maxSelections) % filteredAgents.length;
    
    return selectedAgents;
  }

  private applySelectionConstraints(
    agents: ReadonlyArray<AgentConfig>, 
    criteria: SelectionCriteria
  ): ReadonlyArray<AgentConfig> {
    return agents.filter(agent => {
      // Exclude busy agents if requested
      if (criteria.exclude_busy && agent.availability === 'busy') {
        return false;
      }

      // Exclude offline agents always
      if (agent.availability === 'offline') {
        return false;
      }

      // Apply max workload constraint
      if (criteria.max_workload !== undefined && 
          agent.performance_metrics.current_workload > criteria.max_workload) {
        return false;
      }

      return true;
    });
  }
}