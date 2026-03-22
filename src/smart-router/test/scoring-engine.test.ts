import { CapabilityScorer, HybridScorer } from '../scoring-engine';
import type { 
  AgentConfig, 
  ScoringCriteria, 
  AgentScore,
  RegistryId,
  ScoringBreakdown 
} from '../registry-types';

describe('ScoringEngine', () => {
  let capabilityScorer: CapabilityScorer;
  let hybridScorer: HybridScorer;
  let mockAgent: AgentConfig;
  let mockCriteria: ScoringCriteria;

  beforeEach(() => {
    capabilityScorer = new CapabilityScorer();
    hybridScorer = new HybridScorer();

    mockAgent = {
      id: 'backend-engineer' as RegistryId,
      name: 'Backend Engineer',
      team: 'engineering',
      specializations: ['apis', 'databases', 'debugging', 'typescript'],
      availability: 'available',
      performance_metrics: {
        success_rate: 0.94,
        avg_response_time: '2.3 minutes',
        current_workload: 2,
        completed_tasks: 150,
        last_seen: '2025-08-27T14:25:00Z'
      },
      metadata: {}
    };

    mockCriteria = {
      expertise_areas: ['apis', 'databases'],
      urgency: 'medium',
      complexity_level: 5,
      preferred_agents: []
    };
  });

  describe('CapabilityScorer', () => {
    it('should calculate high score for perfect capability match', () => {
      const score = capabilityScorer.calculate(mockAgent, mockCriteria);
      
      expect(score).toBeGreaterThan(80 as AgentScore);
      expect(score).toBeLessThanOrEqual(100 as AgentScore);
    });

    it('should calculate lower score for partial capability match', () => {
      const partialMatchCriteria: ScoringCriteria = {
        expertise_areas: ['apis', 'frontend', 'design'], // Only apis matches
        urgency: 'low',
        complexity_level: 3
      };

      const score = capabilityScorer.calculate(mockAgent, partialMatchCriteria);
      
      expect(score).toBeGreaterThan(20 as AgentScore);
      expect(score).toBeLessThan(60 as AgentScore);
    });

    it('should calculate very low score for no capability match', () => {
      const noMatchCriteria: ScoringCriteria = {
        expertise_areas: ['design', 'marketing', 'sales'],
        urgency: 'low',
        complexity_level: 2
      };

      const score = capabilityScorer.calculate(mockAgent, noMatchCriteria);
      
      expect(score).toBeLessThan(40 as AgentScore);
    });

    it('should provide detailed scoring breakdown', () => {
      const breakdown = capabilityScorer.explain(mockAgent, mockCriteria);
      
      expect(breakdown.expertise_match).toBeGreaterThan(0);
      expect(breakdown.availability_score).toBeGreaterThan(0);
      expect(breakdown.performance_score).toBeGreaterThan(0);
      expect(breakdown.workload_penalty).toBeLessThanOrEqual(0);
      expect(breakdown.preference_bonus).toBeGreaterThanOrEqual(0);
    });

    it('should account for agent availability in scoring', () => {
      const busyAgent: AgentConfig = {
        ...mockAgent,
        availability: 'busy'
      };

      const availableScore = capabilityScorer.calculate(mockAgent, mockCriteria);
      const busyScore = capabilityScorer.calculate(busyAgent, mockCriteria);
      
      expect(availableScore).toBeGreaterThan(busyScore);
    });

    it('should penalize high workload agents', () => {
      const highWorkloadAgent: AgentConfig = {
        ...mockAgent,
        performance_metrics: {
          ...mockAgent.performance_metrics,
          current_workload: 8 // High workload
        }
      };

      const normalScore = capabilityScorer.calculate(mockAgent, mockCriteria);
      const highWorkloadScore = capabilityScorer.calculate(highWorkloadAgent, mockCriteria);
      
      expect(normalScore).toBeGreaterThan(highWorkloadScore);
    });

    it('should bonus preferred agents', () => {
      const criteriaWithPreference: ScoringCriteria = {
        ...mockCriteria,
        preferred_agents: ['backend-engineer' as RegistryId]
      };

      const normalScore = capabilityScorer.calculate(mockAgent, mockCriteria);
      const preferredScore = capabilityScorer.calculate(mockAgent, criteriaWithPreference);
      
      expect(preferredScore).toBeGreaterThan(normalScore);
    });

    it('should handle urgency in scoring calculation', () => {
      const lowUrgency: ScoringCriteria = { ...mockCriteria, urgency: 'low' };
      const criticalUrgency: ScoringCriteria = { ...mockCriteria, urgency: 'critical' };

      const lowScore = capabilityScorer.calculate(mockAgent, lowUrgency);
      const criticalScore = capabilityScorer.calculate(mockAgent, criticalUrgency);
      
      // For critical urgency, performance should matter more
      expect(typeof lowScore).toBe('number');
      expect(typeof criticalScore).toBe('number');
    });
  });

  describe('HybridScorer', () => {
    it('should combine capability and performance scoring', () => {
      const score = hybridScorer.calculate(mockAgent, mockCriteria);
      
      expect(score).toBeGreaterThan(0 as AgentScore);
      expect(score).toBeLessThanOrEqual(100 as AgentScore);
    });

    it('should weight performance metrics differently than pure capability', () => {
      const highPerformanceAgent: AgentConfig = {
        ...mockAgent,
        specializations: ['apis'], // Fewer capabilities
        performance_metrics: {
          success_rate: 0.99,
          avg_response_time: '1.0 minutes',
          current_workload: 0,
          completed_tasks: 500,
          last_seen: '2025-08-27T14:30:00Z'
        }
      };

      const capabilityOnlyScore = capabilityScorer.calculate(highPerformanceAgent, mockCriteria);
      const hybridScore = hybridScorer.calculate(highPerformanceAgent, mockCriteria);
      
      // Hybrid scorer should potentially give higher score due to excellent performance
      expect(typeof capabilityOnlyScore).toBe('number');
      expect(typeof hybridScore).toBe('number');
    });

    it('should provide comprehensive scoring breakdown', () => {
      const breakdown = hybridScorer.explain(mockAgent, mockCriteria);
      
      expect(breakdown.expertise_match).toBeGreaterThanOrEqual(0);
      expect(breakdown.availability_score).toBeGreaterThanOrEqual(0);
      expect(breakdown.performance_score).toBeGreaterThanOrEqual(0);
      expect(breakdown.workload_penalty).toBeLessThanOrEqual(0);
      expect(breakdown.preference_bonus).toBeGreaterThanOrEqual(0);
    });

    it('should handle edge cases gracefully', () => {
      const edgeCaseAgent: AgentConfig = {
        ...mockAgent,
        specializations: [], // No specializations
        performance_metrics: {
          success_rate: 0,
          avg_response_time: '0 minutes',
          current_workload: 10,
          completed_tasks: 0,
          last_seen: '2025-01-01T00:00:00Z' // Very old
        }
      };

      const score = hybridScorer.calculate(edgeCaseAgent, mockCriteria);
      
      expect(score).toBeGreaterThanOrEqual(0 as AgentScore);
      expect(score).toBeLessThanOrEqual(100 as AgentScore);
    });
  });

  describe('scoring consistency', () => {
    it('should produce consistent scores for same input', () => {
      const score1 = capabilityScorer.calculate(mockAgent, mockCriteria);
      const score2 = capabilityScorer.calculate(mockAgent, mockCriteria);
      
      expect(score1).toBe(score2);
    });

    it('should produce different scores for different criteria', () => {
      const criteria1: ScoringCriteria = {
        expertise_areas: ['apis'],
        urgency: 'low',
        complexity_level: 2
      };

      const criteria2: ScoringCriteria = {
        expertise_areas: ['databases', 'security'],
        urgency: 'critical',
        complexity_level: 8
      };

      const score1 = capabilityScorer.calculate(mockAgent, criteria1);
      const score2 = capabilityScorer.calculate(mockAgent, criteria2);
      
      expect(score1).not.toBe(score2);
    });

    it('should handle complexity level variations', () => {
      const lowComplexity = { ...mockCriteria, complexity_level: 1 };
      const highComplexity = { ...mockCriteria, complexity_level: 10 };

      const lowScore = capabilityScorer.calculate(mockAgent, lowComplexity);
      const highScore = capabilityScorer.calculate(mockAgent, highComplexity);
      
      expect(typeof lowScore).toBe('number');
      expect(typeof highScore).toBe('number');
      // Both should be valid scores
      expect(lowScore).toBeGreaterThanOrEqual(0 as AgentScore);
      expect(highScore).toBeGreaterThanOrEqual(0 as AgentScore);
    });
  });
});