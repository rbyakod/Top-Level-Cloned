import type {
  IScoringStrategy,
  AgentConfig,
  ScoringCriteria,
  AgentScore,
  ScoringBreakdown
} from './registry-types';

export class CapabilityScorer implements IScoringStrategy {
  private readonly urgencyWeights = {
    low: 0.8,
    medium: 1.0,
    high: 1.2,
    critical: 1.5
  };

  calculate(agent: AgentConfig, criteria: ScoringCriteria): AgentScore {
    const breakdown = this.explain(agent, criteria);
    
    // Combine all scoring components
    let totalScore = 0;
    
    // Expertise match is the primary factor (40% weight)
    totalScore += breakdown.expertise_match * 0.4;
    
    // Availability is crucial (30% weight)
    totalScore += breakdown.availability_score * 0.3;
    
    // Performance history matters (20% weight)
    totalScore += breakdown.performance_score * 0.2;
    
    // Apply penalties and bonuses (10% weight)
    totalScore += (breakdown.workload_penalty + breakdown.preference_bonus) * 0.1;
    
    // Apply urgency multiplier
    totalScore *= this.urgencyWeights[criteria.urgency];
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, Math.round(totalScore))) as AgentScore;
  }

  explain(agent: AgentConfig, criteria: ScoringCriteria): ScoringBreakdown {
    return {
      expertise_match: this.calculateExpertiseMatch(agent, criteria),
      availability_score: this.calculateAvailabilityScore(agent),
      performance_score: this.calculatePerformanceScore(agent),
      workload_penalty: this.calculateWorkloadPenalty(agent),
      preference_bonus: this.calculatePreferenceBonus(agent, criteria)
    };
  }

  private calculateExpertiseMatch(agent: AgentConfig, criteria: ScoringCriteria): number {
    if (criteria.expertise_areas.length === 0) {
      return 50; // Neutral score if no specific expertise required
    }

    const agentSpecializations = new Set(agent.specializations.map(s => s.toLowerCase()));
    const requiredExpertise = criteria.expertise_areas.map(e => e.toLowerCase());
    
    let matchCount = 0;
    let partialMatchCount = 0;
    
    for (const required of requiredExpertise) {
      if (agentSpecializations.has(required)) {
        matchCount++;
      } else {
        // Check for partial matches (e.g., 'api' matches 'apis')
        for (const specialization of agentSpecializations) {
          if (specialization.includes(required) || required.includes(specialization)) {
            partialMatchCount++;
            break;
          }
        }
      }
    }
    
    const fullMatchRatio = matchCount / requiredExpertise.length;
    const partialMatchRatio = partialMatchCount / requiredExpertise.length;
    
    // Full matches worth more than partial matches
    const expertiseScore = (fullMatchRatio * 100) + (partialMatchRatio * 30);
    
    return Math.min(100, expertiseScore);
  }

  private calculateAvailabilityScore(agent: AgentConfig): number {
    switch (agent.availability) {
      case 'available':
        return 100;
      case 'busy':
        return 30; // Can still be selected but with penalty
      case 'offline':
        return 0;
      default:
        return 0;
    }
  }

  private calculatePerformanceScore(agent: AgentConfig): number {
    const metrics = agent.performance_metrics;
    
    // Success rate (40% of performance score)
    const successScore = metrics.success_rate * 100 * 0.4;
    
    // Response time (30% of performance score)
    // Parse response time string to get numerical value
    const responseTimeMatch = metrics.avg_response_time.match(/(\d+\.?\d*)/);
    const responseTimeMinutes = responseTimeMatch ? parseFloat(responseTimeMatch[1]) : 5;
    
    // Better scores for faster response times (inverse relationship)
    const responseScore = Math.max(0, 100 - (responseTimeMinutes * 10)) * 0.3;
    
    // Task completion count (20% of performance score)
    // Normalize completed tasks (assuming 100+ tasks is excellent)
    const completionScore = Math.min(100, (metrics.completed_tasks / 100) * 100) * 0.2;
    
    // Recency bonus (10% of performance score)
    const lastSeen = new Date(metrics.last_seen);
    const hoursSinceLastSeen = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 100 - hoursSinceLastSeen) * 0.1;
    
    return Math.min(100, successScore + responseScore + completionScore + recencyScore);
  }

  private calculateWorkloadPenalty(agent: AgentConfig): number {
    const workload = agent.performance_metrics.current_workload;
    
    // Linear penalty: each workload point reduces score
    // Workload of 5+ starts significant penalties
    if (workload <= 2) return 0;
    if (workload <= 5) return -(workload - 2) * 5; // -5 to -15
    
    return -(workload * 8); // Heavy penalty for high workload
  }

  private calculatePreferenceBonus(agent: AgentConfig, criteria: ScoringCriteria): number {
    if (!criteria.preferred_agents || criteria.preferred_agents.length === 0) {
      return 0;
    }
    
    const isPreferred = criteria.preferred_agents.includes(agent.id);
    return isPreferred ? 15 : 0; // 15 point bonus for preferred agents
  }
}

export class HybridScorer implements IScoringStrategy {
  private readonly capabilityScorer = new CapabilityScorer();

  calculate(agent: AgentConfig, criteria: ScoringCriteria): AgentScore {
    const breakdown = this.explain(agent, criteria);
    
    // Hybrid scoring gives more weight to performance than pure capability scoring
    let totalScore = 0;
    
    // Expertise match (30% weight - reduced from capability scorer)
    totalScore += breakdown.expertise_match * 0.3;
    
    // Performance is more important in hybrid (40% weight - increased)
    totalScore += breakdown.performance_score * 0.4;
    
    // Availability (20% weight - reduced)
    totalScore += breakdown.availability_score * 0.2;
    
    // Penalties and bonuses (10% weight)
    totalScore += (breakdown.workload_penalty + breakdown.preference_bonus) * 0.1;
    
    // Apply complexity adjustment
    const complexityFactor = this.calculateComplexityFactor(criteria.complexity_level);
    totalScore *= complexityFactor;
    
    return Math.max(0, Math.min(100, Math.round(totalScore))) as AgentScore;
  }

  explain(agent: AgentConfig, criteria: ScoringCriteria): ScoringBreakdown {
    // Use base capability scorer for individual components
    const baseBreakdown = this.capabilityScorer.explain(agent, criteria);
    
    // Enhance performance scoring for hybrid approach
    const enhancedPerformanceScore = this.calculateEnhancedPerformanceScore(agent, criteria);
    
    return {
      ...baseBreakdown,
      performance_score: enhancedPerformanceScore
    };
  }

  private calculateEnhancedPerformanceScore(agent: AgentConfig, criteria: ScoringCriteria): number {
    const metrics = agent.performance_metrics;
    
    // Base performance calculation
    const basePerformance = this.capabilityScorer.explain(agent, criteria).performance_score;
    
    // Additional factors for hybrid scoring
    
    // Consistency bonus - agents with steady performance
    const consistencyBonus = metrics.success_rate > 0.9 ? 10 : 0;
    
    // Experience bonus - agents with more completed tasks
    const experienceBonus = Math.min(15, metrics.completed_tasks / 20);
    
    // Complexity handling - higher complexity tasks favor more experienced agents
    const complexityBonus = criteria.complexity_level > 6 ? (metrics.completed_tasks / 50) : 0;
    
    return Math.min(100, basePerformance + consistencyBonus + experienceBonus + complexityBonus);
  }

  private calculateComplexityFactor(complexityLevel: number): number {
    // For complex tasks, slightly favor experienced agents
    if (complexityLevel >= 8) return 1.1;
    if (complexityLevel >= 6) return 1.05;
    if (complexityLevel <= 2) return 0.95; // Simple tasks don't need as much experience
    
    return 1.0; // Neutral for medium complexity
  }
}