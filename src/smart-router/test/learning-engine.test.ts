// Learning Engine Tests

import { jest } from '@jest/globals';
import { LearningEngine } from '../learning-engine';
import type { UserFeedback } from '../feedback-collector';
import type { AgentConfig } from '../registry-types';
import * as fs from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('LearningEngine', () => {
  let learningEngine: LearningEngine;
  const testDirectory = '/test/learning';

  beforeEach(() => {
    jest.clearAllMocks();
    learningEngine = new LearningEngine(testDirectory);
  });

  describe('loadLearningData', () => {
    it('should load existing learning data successfully', async () => {
      const mockLearningData = {
        last_updated: new Date(),
        agents: [
          {
            agent_id: 'test-agent-1' as any,
            total_assignments: 10,
            successful_completions: 8,
            average_rating: 4.2,
            satisfaction_rate: 85,
            common_task_types: ['build', 'test'],
            performance_trends: [],
            last_updated: new Date()
          }
        ]
      };

      jest.spyOn(mockedFs, 'readFile').mockResolvedValue(`
last_updated: 2024-01-01T00:00:00.000Z
agents:
  - agent_id: test-agent-1
    total_assignments: 10
    successful_completions: 8
    average_rating: 4.2
    satisfaction_rate: 85
    common_task_types:
      - build
      - test
    performance_trends: []
    last_updated: 2024-01-01T00:00:00.000Z
      `);

      const result = await learningEngine.loadLearningData();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.size).toBe(1);
      expect(result.data!.has('test-agent-1' as any)).toBe(true);
    });

    it('should handle non-existent file gracefully', async () => {
      const error = new Error('File not found') as any;
      error.code = 'ENOENT';
      jest.spyOn(mockedFs, 'readFile').mockRejectedValue(error);

      const result = await learningEngine.loadLearningData();

      expect(result.success).toBe(true);
      expect(result.data!.size).toBe(0);
    });

    it('should handle file read errors', async () => {
      jest.spyOn(mockedFs, 'readFile').mockRejectedValue(new Error('Permission denied'));

      const result = await learningEngine.loadLearningData();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('LEARNING_DATA_LOAD_ERROR');
    });
  });

  describe('updateFromFeedback', () => {
    it('should update learning data from feedback', async () => {
      const mockFeedback: UserFeedback[] = [
        {
          feedback_id: 'feedback-1',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: {
            agents_involved: ['test-agent-1' as any],
            workflow_type: 'build'
          }
        },
        {
          feedback_id: 'feedback-2',
          feedback_type: 'agent',
          rating: 5,
          satisfaction: 'very_satisfied',
          created_at: new Date(),
          context: {
            agents_involved: ['test-agent-1' as any],
            workflow_type: 'test'
          }
        }
      ];

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await learningEngine.updateFromFeedback(mockFeedback);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should handle feedback without agent context', async () => {
      const mockFeedback: UserFeedback[] = [
        {
          feedback_id: 'feedback-1',
          feedback_type: 'general',
          rating: 3,
          satisfaction: 'neutral',
          created_at: new Date()
        }
      ];

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await learningEngine.updateFromFeedback(mockFeedback);

      expect(result.success).toBe(true);
    });
  });

  describe('generateScoreImprovements', () => {
    it('should generate score improvements for agents with sufficient data', async () => {
      // Load mock learning data first
      await learningEngine.loadLearningData();
      
      // Mock the learning data internally
      const mockAgents: AgentConfig[] = [
        {
          id: 'test-agent-1' as any,
          name: 'Test Agent 1',
          description: 'Test agent',
          capabilities: ['build'],
          priority_score: 5,
          max_concurrent_tasks: 3,
          estimated_task_duration: 30,
          agent_type: 'specialized'
        }
      ];

      // Manually add learning data
      await learningEngine.updateFromFeedback([
        {
          feedback_id: 'fb-1',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { agents_involved: ['test-agent-1' as any] }
        },
        {
          feedback_id: 'fb-2',
          feedback_type: 'workflow',
          rating: 5,
          satisfaction: 'very_satisfied',
          created_at: new Date(),
          context: { agents_involved: ['test-agent-1' as any] }
        },
        {
          feedback_id: 'fb-3',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { agents_involved: ['test-agent-1' as any] }
        },
        {
          feedback_id: 'fb-4',
          feedback_type: 'workflow',
          rating: 5,
          satisfaction: 'very_satisfied',
          created_at: new Date(),
          context: { agents_involved: ['test-agent-1' as any] }
        },
        {
          feedback_id: 'fb-5',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { agents_involved: ['test-agent-1' as any] }
        }
      ]);

      const result = await learningEngine.generateScoreImprovements(mockAgents);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should skip agents with insufficient data', async () => {
      const mockAgents: AgentConfig[] = [
        {
          id: 'new-agent' as any,
          name: 'New Agent',
          description: 'New agent with no history',
          capabilities: ['test'],
          priority_score: 5,
          max_concurrent_tasks: 2,
          estimated_task_duration: 20,
          agent_type: 'general'
        }
      ];

      const result = await learningEngine.generateScoreImprovements(mockAgents);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(0);
    });
  });

  describe('getTopAgentsForTask', () => {
    beforeEach(async () => {
      // Set up learning data for multiple agents with enough feedback (minimum 3)
      await learningEngine.updateFromFeedback([
        {
          feedback_id: 'fb-1',
          feedback_type: 'workflow',
          rating: 5,
          satisfaction: 'very_satisfied',
          created_at: new Date(),
          context: { 
            agents_involved: ['build-expert' as any],
            workflow_type: 'build-feature'
          }
        },
        {
          feedback_id: 'fb-2',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { 
            agents_involved: ['build-expert' as any],
            workflow_type: 'build-ui'
          }
        },
        {
          feedback_id: 'fb-3',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { 
            agents_involved: ['build-expert' as any],
            workflow_type: 'build-mvp'
          }
        },
        {
          feedback_id: 'fb-4',
          feedback_type: 'workflow',
          rating: 3,
          satisfaction: 'neutral',
          created_at: new Date(),
          context: { 
            agents_involved: ['test-expert' as any],
            workflow_type: 'build-api'
          }
        },
        {
          feedback_id: 'fb-5',
          feedback_type: 'workflow',
          rating: 3,
          satisfaction: 'neutral',
          created_at: new Date(),
          context: { 
            agents_involved: ['test-expert' as any],
            workflow_type: 'build-test'
          }
        },
        {
          feedback_id: 'fb-6',
          feedback_type: 'workflow',
          rating: 3,
          satisfaction: 'neutral',
          created_at: new Date(),
          context: { 
            agents_involved: ['test-expert' as any],
            workflow_type: 'build-automation'
          }
        }
      ]);
    });

    it('should return top agents for specific task type', async () => {
      const result = await learningEngine.getTopAgentsForTask('build', 3);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBeGreaterThan(0);
      
      // Check that results are sorted by score
      const scores = result.data!.map(agent => agent.score);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });

    it('should limit results correctly', async () => {
      const result = await learningEngine.getTopAgentsForTask('build', 1);

      expect(result.success).toBe(true);
      expect(result.data!.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for unknown task types', async () => {
      const result = await learningEngine.getTopAgentsForTask('unknown-task');

      expect(result.success).toBe(true);
      expect(result.data!.length).toBe(0);
    });
  });

  describe('getLearningStatistics', () => {
    it('should return learning statistics', async () => {
      // Add some learning data
      await learningEngine.updateFromFeedback([
        {
          feedback_id: 'stat-1',
          feedback_type: 'workflow',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { agents_involved: ['agent-1' as any] }
        },
        {
          feedback_id: 'stat-2',
          feedback_type: 'workflow',
          rating: 3,
          satisfaction: 'neutral',
          created_at: new Date(),
          context: { agents_involved: ['agent-2' as any] }
        }
      ]);

      const result = await learningEngine.getLearningStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(typeof result.data!.totalAgents).toBe('number');
      expect(typeof result.data!.totalAssignments).toBe('number');
      expect(typeof result.data!.averageSatisfaction).toBe('number');
      expect(typeof result.data!.improvementOpportunities).toBe('number');
    });

    it('should handle empty learning data', async () => {
      const result = await learningEngine.getLearningStatistics();

      expect(result.success).toBe(true);
      expect(result.data!.totalAgents).toBe(0);
    });
  });

  describe('getAgentLearningData', () => {
    it('should return learning data for specific agent', async () => {
      await learningEngine.updateFromFeedback([
        {
          feedback_id: 'agent-fb-1',
          feedback_type: 'agent',
          rating: 4,
          satisfaction: 'satisfied',
          created_at: new Date(),
          context: { agents_involved: ['specific-agent' as any] }
        }
      ]);

      const result = await learningEngine.getAgentLearningData('specific-agent' as any);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.agent_id).toBe('specific-agent');
    });

    it('should return undefined for unknown agent', async () => {
      const result = await learningEngine.getAgentLearningData('unknown-agent' as any);

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });
  });
});