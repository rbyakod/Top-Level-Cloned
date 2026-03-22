import { ScoreBasedBalancer, RoundRobinBalancer } from '../load-balancer';
import { CapabilityScorer } from '../scoring-engine';
import type { 
  AgentConfig, 
  SelectionCriteria,
  LoadBalancingResult,
  RegistryId 
} from '../registry-types';

describe('LoadBalancer', () => {
  let scoreBasedBalancer: ScoreBasedBalancer;
  let roundRobinBalancer: RoundRobinBalancer;
  let mockAgents: ReadonlyArray<AgentConfig>;
  let mockCriteria: SelectionCriteria;

  beforeEach(() => {
    const scorer = new CapabilityScorer();
    scoreBasedBalancer = new ScoreBasedBalancer(scorer);
    roundRobinBalancer = new RoundRobinBalancer();

    mockAgents = [
      {
        id: 'backend-engineer' as RegistryId,
        name: 'Backend Engineer',
        team: 'engineering',
        specializations: ['apis', 'databases', 'debugging'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.94,
          avg_response_time: '2.3 minutes',
          current_workload: 2,
          completed_tasks: 150,
          last_seen: '2025-08-27T14:25:00Z'
        },
        metadata: {}
      },
      {
        id: 'frontend-engineer' as RegistryId,
        name: 'Frontend Engineer',
        team: 'engineering',
        specializations: ['react', 'typescript', 'css', 'ui'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.91,
          avg_response_time: '1.8 minutes',
          current_workload: 1,
          completed_tasks: 200,
          last_seen: '2025-08-27T14:30:00Z'
        },
        metadata: {}
      },
      {
        id: 'qa-engineer' as RegistryId,
        name: 'QA Engineer',
        team: 'quality',
        specializations: ['testing', 'automation', 'debugging'],
        availability: 'busy',
        performance_metrics: {
          success_rate: 0.96,
          avg_response_time: '3.0 minutes',
          current_workload: 5,
          completed_tasks: 120,
          last_seen: '2025-08-27T14:20:00Z'
        },
        metadata: {}
      }
    ];

    mockCriteria = {
      expertise_areas: ['apis', 'databases'],
      urgency: 'medium',
      complexity_level: 5,
      exclude_busy: false,
      max_workload: 10,
      team_preference: 'engineering'
    };
  });

  describe('ScoreBasedBalancer', () => {
    it('should select highest scoring agent', () => {
      const result = scoreBasedBalancer.selectAgent(mockAgents, mockCriteria);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.selected_agent.id).toBe('backend-engineer' as RegistryId);
        expect(result.score).toBeGreaterThan(0);
        expect(result.selection_reasoning).toContain('highest score');
      }
    });

    it('should exclude busy agents when specified', () => {
      const criteriaExcludeBusy: SelectionCriteria = {
        ...mockCriteria,
        exclude_busy: true
      };

      const result = scoreBasedBalancer.selectAgent(mockAgents, criteriaExcludeBusy);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.selected_agent.availability).not.toBe('busy');
      }
    });

    it('should respect max workload constraint', () => {
      const criteriaLowWorkload: SelectionCriteria = {
        ...mockCriteria,
        max_workload: 3 // Should exclude qa-engineer with workload 5
      };

      const result = scoreBasedBalancer.selectAgent(mockAgents, criteriaLowWorkload);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.selected_agent.performance_metrics.current_workload).toBeLessThanOrEqual(3);
      }
    });

    it('should prefer agents from specified team', () => {
      const criteriaTeamPreference: SelectionCriteria = {
        expertise_areas: ['testing'], // QA specialty
        urgency: 'low',
        complexity_level: 2,
        team_preference: 'quality'
      };

      const result = scoreBasedBalancer.selectAgent(mockAgents, criteriaTeamPreference);
      
      expect(result).not.toBeNull();
      if (result) {
        // Should prefer quality team even if busy
        expect(result.selected_agent.team).toBe('quality');
      }
    });

    it('should provide alternatives in result', () => {
      const result = scoreBasedBalancer.selectAgent(mockAgents, mockCriteria);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.alternatives.length).toBeGreaterThan(0);
        expect(result.alternatives.length).toBeLessThan(mockAgents.length); // Should not include selected agent
      }
    });

    it('should return null for empty agent list', () => {
      const result = scoreBasedBalancer.selectAgent([], mockCriteria);
      
      expect(result).toBeNull();
    });

    it('should handle single agent selection', () => {
      const singleAgent = [mockAgents[0]];
      const result = scoreBasedBalancer.selectAgent(singleAgent, mockCriteria);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.selected_agent).toBe(mockAgents[0]);
        expect(result.alternatives).toHaveLength(0);
      }
    });

    it('should select multiple agents correctly', () => {
      const selectedAgents = scoreBasedBalancer.selectMultipleAgents(mockAgents, mockCriteria, 2);
      
      expect(selectedAgents).toHaveLength(2);
      expect(selectedAgents[0].id).not.toBe(selectedAgents[1].id);
    });

    it('should limit multiple selection to available agents', () => {
      const selectedAgents = scoreBasedBalancer.selectMultipleAgents(mockAgents, mockCriteria, 10);
      
      expect(selectedAgents.length).toBeLessThanOrEqual(mockAgents.length);
    });

    it('should provide detailed selection reasoning', () => {
      const result = scoreBasedBalancer.selectAgent(mockAgents, mockCriteria);
      
      expect(result).not.toBeNull();
      if (result) {
        expect(result.selection_reasoning).toContain('expertise match');
        expect(typeof result.selection_reasoning).toBe('string');
        expect(result.selection_reasoning.length).toBeGreaterThan(0);
      }
    });
  });

  describe('RoundRobinBalancer', () => {
    it('should select agents in round-robin fashion', () => {
      const firstSelection = roundRobinBalancer.selectAgent(mockAgents, mockCriteria);
      const secondSelection = roundRobinBalancer.selectAgent(mockAgents, mockCriteria);
      const thirdSelection = roundRobinBalancer.selectAgent(mockAgents, mockCriteria);
      
      expect(firstSelection?.selected_agent.id).not.toBe(secondSelection?.selected_agent.id);
      expect(secondSelection?.selected_agent.id).not.toBe(thirdSelection?.selected_agent.id);
      expect(firstSelection?.selected_agent.id).not.toBe(thirdSelection?.selected_agent.id);
    });

    it('should cycle through all agents', () => {
      const selections = [];
      
      // Select more times than agents to test cycling
      for (let i = 0; i < mockAgents.length + 2; i++) {
        const selection = roundRobinBalancer.selectAgent(mockAgents, mockCriteria);
        if (selection) {
          selections.push(selection.selected_agent.id);
        }
      }
      
      expect(selections.length).toBe(mockAgents.length + 2);
      // Should see repeated agents after full cycle
      expect(selections[0]).toBe(selections[mockAgents.length]);
    });

    it('should handle empty agent list', () => {
      const result = roundRobinBalancer.selectAgent([], mockCriteria);
      
      expect(result).toBeNull();
    });

    it('should maintain internal state correctly', () => {
      const balancer1 = new RoundRobinBalancer();
      const balancer2 = new RoundRobinBalancer();
      
      const selection1a = balancer1.selectAgent(mockAgents, mockCriteria);
      const selection2a = balancer2.selectAgent(mockAgents, mockCriteria);
      const selection1b = balancer1.selectAgent(mockAgents, mockCriteria);
      
      // Both balancers should start from same position
      expect(selection1a?.selected_agent.id).toBe(selection2a?.selected_agent.id);
      // First balancer should move to next agent
      expect(selection1a?.selected_agent.id).not.toBe(selection1b?.selected_agent.id);
    });

    it('should select multiple agents without repetition', () => {
      const selectedAgents = roundRobinBalancer.selectMultipleAgents(mockAgents, mockCriteria, 2);
      
      expect(selectedAgents).toHaveLength(2);
      expect(selectedAgents[0].id).not.toBe(selectedAgents[1].id);
    });

    it('should handle multiple selection larger than agent pool', () => {
      const selectedAgents = roundRobinBalancer.selectMultipleAgents(mockAgents, mockCriteria, 5);
      
      expect(selectedAgents.length).toBe(mockAgents.length); // Can't select more than available
      // Should contain all unique agents
      const uniqueIds = new Set(selectedAgents.map(agent => agent.id));
      expect(uniqueIds.size).toBe(selectedAgents.length);
    });
  });

  describe('load balancer comparison', () => {
    it('should have different selection strategies', () => {
      // Reset round robin state for fair comparison
      const freshRoundRobin = new RoundRobinBalancer();
      
      const scoreBasedSelection = scoreBasedBalancer.selectAgent(mockAgents, mockCriteria);
      const roundRobinSelection = freshRoundRobin.selectAgent(mockAgents, mockCriteria);
      
      expect(scoreBasedSelection).not.toBeNull();
      expect(roundRobinSelection).not.toBeNull();
      
      // They might select the same agent by chance, but for different reasons
      if (scoreBasedSelection && roundRobinSelection) {
        if (scoreBasedSelection.selected_agent.id === roundRobinSelection.selected_agent.id) {
          expect(scoreBasedSelection.selection_reasoning).not.toBe(roundRobinSelection.selection_reasoning);
        }
      }
    });

    it('should both handle constraints appropriately', () => {
      const constrainedCriteria: SelectionCriteria = {
        ...mockCriteria,
        exclude_busy: true,
        max_workload: 3
      };

      const scoreBasedSelection = scoreBasedBalancer.selectAgent(mockAgents, constrainedCriteria);
      const roundRobinSelection = roundRobinBalancer.selectAgent(mockAgents, constrainedCriteria);
      
      // Both should respect constraints
      if (scoreBasedSelection) {
        expect(scoreBasedSelection.selected_agent.availability).not.toBe('busy');
        expect(scoreBasedSelection.selected_agent.performance_metrics.current_workload).toBeLessThanOrEqual(3);
      }
      
      if (roundRobinSelection) {
        expect(roundRobinSelection.selected_agent.availability).not.toBe('busy');
        expect(roundRobinSelection.selected_agent.performance_metrics.current_workload).toBeLessThanOrEqual(3);
      }
    });
  });
});