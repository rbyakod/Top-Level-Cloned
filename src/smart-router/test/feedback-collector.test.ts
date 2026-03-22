// Feedback Collector Tests

import { jest } from '@jest/globals';
import { FeedbackCollector } from '../feedback-collector';
import type { UserFeedback, FeedbackIssue } from '../feedback-collector';
import * as fs from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FeedbackCollector', () => {
  let feedbackCollector: FeedbackCollector;
  const testDirectory = '/test/feedback';

  beforeEach(() => {
    jest.clearAllMocks();
    feedbackCollector = new FeedbackCollector(testDirectory);
  });

  describe('collectFeedback', () => {
    it('should collect valid feedback successfully', async () => {
      const mockFeedback = {
        workflow_id: 'test-workflow' as any,
        feedback_type: 'workflow' as const,
        rating: 4 as const,
        satisfaction: 'satisfied' as const,
        feedback_text: 'Great workflow experience'
      };

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await feedbackCollector.collectFeedback(mockFeedback);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.feedback_id).toMatch(/^feedback-/);
      expect(result.data!.workflow_id).toBe('test-workflow');
      expect(result.data!.rating).toBe(4);
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should reject invalid feedback', async () => {
      const invalidFeedback = {
        feedback_type: '' as any,
        rating: 10 as any, // Invalid rating
        satisfaction: 'invalid' as any
      };

      const result = await feedbackCollector.collectFeedback(invalidFeedback);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_FEEDBACK');
      expect(mockedFs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle file write errors', async () => {
      const validFeedback = {
        feedback_type: 'general' as const,
        rating: 3 as const,
        satisfaction: 'neutral' as const
      };

      jest.spyOn(mockedFs, 'writeFile').mockRejectedValue(new Error('Permission denied'));

      const result = await feedbackCollector.collectFeedback(validFeedback);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FEEDBACK_COLLECTION_ERROR');
    });

    it('should include all feedback properties', async () => {
      const comprehensiveFeedback = {
        workflow_id: 'complex-workflow' as any,
        user_id: 'user-123',
        feedback_type: 'workflow' as const,
        rating: 5 as const,
        satisfaction: 'very_satisfied' as const,
        feedback_text: 'Excellent workflow',
        specific_issues: [
          {
            issue_type: 'slow' as const,
            description: 'Initial loading was slow',
            severity: 'low' as const
          }
        ] as ReadonlyArray<FeedbackIssue>,
        suggestions: ['Add progress indicators'],
        context: {
          command_used: '/build-mvp',
          time_taken: 45,
          agents_involved: ['agent-1' as any],
          workflow_type: 'feature-build',
          user_experience_level: 'intermediate' as const,
          use_case: 'prototype development'
        }
      };

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await feedbackCollector.collectFeedback(comprehensiveFeedback);

      expect(result.success).toBe(true);
      expect(result.data!.specific_issues).toHaveLength(1);
      expect(result.data!.suggestions).toHaveLength(1);
      expect(result.data!.context).toBeDefined();
    });
  });

  describe('collectQuickRating', () => {
    it('should collect quick rating feedback', async () => {
      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await feedbackCollector.collectQuickRating(
        'quick-workflow' as any,
        5,
        { command_used: '/fix-bug' }
      );

      expect(result.success).toBe(true);
      expect(result.data!.rating).toBe(5);
      expect(result.data!.satisfaction).toBe('very_satisfied');
      expect(result.data!.context?.command_used).toBe('/fix-bug');
    });

    it('should map ratings to satisfaction correctly', async () => {
      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const testCases = [
        { rating: 1 as const, expectedSatisfaction: 'very_dissatisfied' as const },
        { rating: 2 as const, expectedSatisfaction: 'dissatisfied' as const },
        { rating: 3 as const, expectedSatisfaction: 'neutral' as const },
        { rating: 4 as const, expectedSatisfaction: 'satisfied' as const },
        { rating: 5 as const, expectedSatisfaction: 'very_satisfied' as const }
      ];

      for (const { rating, expectedSatisfaction } of testCases) {
        const result = await feedbackCollector.collectQuickRating('test-workflow' as any, rating);
        expect(result.data!.satisfaction).toBe(expectedSatisfaction);
      }
    });
  });

  describe('collectAgentFeedback', () => {
    it('should collect agent-specific feedback', async () => {
      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const issues: ReadonlyArray<FeedbackIssue> = [
        {
          issue_type: 'incorrect',
          description: 'Agent made wrong assumption',
          severity: 'medium'
        }
      ];

      const suggestions = ['Improve context understanding'];

      const result = await feedbackCollector.collectAgentFeedback(
        'problem-agent' as any,
        2,
        issues,
        suggestions
      );

      expect(result.success).toBe(true);
      expect(result.data!.feedback_type).toBe('agent');
      expect(result.data!.rating).toBe(2);
      expect(result.data!.satisfaction).toBe('dissatisfied');
      expect(result.data!.specific_issues).toEqual(issues);
      expect(result.data!.suggestions).toEqual(suggestions);
      expect(result.data!.context?.agents_involved).toContain('problem-agent');
    });
  });

  describe('getAllFeedback', () => {
    it('should retrieve all feedback successfully', async () => {
      const mockFiles = ['feedback-1.yml', 'feedback-2.yml', 'other.txt'];
      const mockFeedback1 = {
        feedback_id: 'feedback-1',
        feedback_type: 'workflow',
        rating: 4,
        satisfaction: 'satisfied',
        created_at: new Date()
      };
      const mockFeedback2 = {
        feedback_id: 'feedback-2',
        feedback_type: 'agent',
        rating: 3,
        satisfaction: 'neutral',
        created_at: new Date()
      };

      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(mockFiles as any);
      jest.spyOn(mockedFs, 'readFile')
        .mockResolvedValueOnce(`
feedback_id: feedback-1
feedback_type: workflow
rating: 4
satisfaction: satisfied
created_at: 2024-01-01T00:00:00.000Z
        `)
        .mockResolvedValueOnce(`
feedback_id: feedback-2
feedback_type: agent
rating: 3
satisfaction: neutral
created_at: 2024-01-01T01:00:00.000Z
        `);

      const result = await feedbackCollector.getAllFeedback();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data![0].feedback_id).toBe('feedback-1');
      expect(result.data![1].feedback_id).toBe('feedback-2');
    });

    it('should handle directory read errors', async () => {
      jest.spyOn(mockedFs, 'readdir').mockRejectedValue(new Error('Directory not found'));

      const result = await feedbackCollector.getAllFeedback();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FEEDBACK_READ_ERROR');
    });

    it('should skip invalid feedback files gracefully', async () => {
      const mockFiles = ['valid.yml', 'invalid.yml'];
      
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(mockFiles as any);
      jest.spyOn(mockedFs, 'readFile')
        .mockResolvedValueOnce('feedback_id: valid\nrating: 4\nsatisfaction: satisfied\nfeedback_type: workflow\ncreated_at: 2024-01-01T00:00:00.000Z')
        .mockRejectedValueOnce(new Error('Invalid YAML'));

      // Mock console.warn to avoid noise in tests
      const mockWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await feedbackCollector.getAllFeedback();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(mockWarn).toHaveBeenCalledWith('Error reading feedback file invalid.yml:', expect.any(Error));
      
      mockWarn.mockRestore();
    });
  });

  describe('getWorkflowFeedback', () => {
    it('should filter feedback by workflow ID', async () => {
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(['fb1.yml', 'fb2.yml'] as any);
      jest.spyOn(mockedFs, 'readFile')
        .mockResolvedValueOnce(`
feedback_id: fb1
workflow_id: target-workflow
feedback_type: workflow
rating: 4
satisfaction: satisfied
created_at: 2024-01-01T00:00:00.000Z
        `)
        .mockResolvedValueOnce(`
feedback_id: fb2
workflow_id: other-workflow
feedback_type: workflow
rating: 3
satisfaction: neutral
created_at: 2024-01-01T01:00:00.000Z
        `);

      const result = await feedbackCollector.getWorkflowFeedback('target-workflow' as any);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].workflow_id).toBe('target-workflow');
    });
  });

  describe('getAgentFeedback', () => {
    it('should filter feedback by agent involvement', async () => {
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(['agent-fb.yml'] as any);
      jest.spyOn(mockedFs, 'readFile').mockResolvedValue(`
feedback_id: agent-fb
feedback_type: agent
rating: 5
satisfaction: very_satisfied
created_at: 2024-01-01T00:00:00.000Z
context:
  agents_involved:
    - target-agent
    - other-agent
      `);

      const result = await feedbackCollector.getAgentFeedback('target-agent' as any);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].context?.agents_involved).toContain('target-agent');
    });

    it('should include feedback with specific issues for agent', async () => {
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(['issue-fb.yml'] as any);
      jest.spyOn(mockedFs, 'readFile').mockResolvedValue(`
feedback_id: issue-fb
feedback_type: workflow
rating: 2
satisfaction: dissatisfied
created_at: 2024-01-01T00:00:00.000Z
specific_issues:
  - issue_type: slow
    description: Agent was slow
    affected_agent: target-agent
    severity: medium
      `);

      const result = await feedbackCollector.getAgentFeedback('target-agent' as any);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].specific_issues![0].affected_agent).toBe('target-agent');
    });
  });

  describe('generateFeedbackSummary', () => {
    beforeEach(() => {
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(['summary-fb.yml'] as any);
    });

    it('should generate comprehensive feedback summary', async () => {
      // Mock the internal getAllFeedback method to return proper data structure
      const mockFeedbackData: UserFeedback[] = [{
        feedback_id: 'summary-fb',
        feedback_type: 'workflow',
        rating: 4,
        satisfaction: 'satisfied',
        created_at: new Date('2024-01-15T12:00:00.000Z'),
        specific_issues: [{
          issue_type: 'slow',
          description: 'Slow performance',
          affected_agent: 'slow-agent' as any,
          severity: 'medium'
        }],
        suggestions: ['Improve caching', 'Add progress indicators'],
        context: {
          agents_involved: ['test-agent' as any],
          workflow_type: 'build'
        }
      }];

      // Mock readdir and readFile to return the feedback data
      jest.spyOn(mockedFs, 'readdir').mockResolvedValue(['summary-fb.yml'] as any);
      jest.spyOn(mockedFs, 'readFile').mockResolvedValue(`
feedback_id: summary-fb
feedback_type: workflow
rating: 4
satisfaction: satisfied
created_at: 2024-01-15T12:00:00.000Z
specific_issues:
  - issue_type: slow
    description: Slow performance
    affected_agent: slow-agent
    severity: medium
suggestions:
  - Improve caching
  - Add progress indicators
context:
  agents_involved:
    - test-agent
  workflow_type: build
      `);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await feedbackCollector.generateFeedbackSummary(startDate, endDate);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.total_feedback).toBe(1);
      expect(result.data!.average_rating).toBe(4);
      expect(result.data!.satisfaction_distribution['satisfied']).toBe(1);
      expect(result.data!.common_issues).toBeDefined();
      expect(result.data!.agent_performance).toBeDefined();
      expect(result.data!.improvement_suggestions).toContain('Improve caching');
    });

    it('should return empty summary for no feedback in period', async () => {
      jest.spyOn(mockedFs, 'readFile').mockResolvedValue(`
feedback_id: old-fb
feedback_type: workflow
rating: 3
satisfaction: neutral
created_at: 2023-01-01T00:00:00.000Z
      `);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await feedbackCollector.generateFeedbackSummary(startDate, endDate);

      expect(result.success).toBe(true);
      expect(result.data!.total_feedback).toBe(0);
      expect(result.data!.average_rating).toBe(0);
    });

    it('should handle summary generation errors', async () => {
      jest.spyOn(mockedFs, 'readdir').mockRejectedValue(new Error('Cannot read directory'));

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await feedbackCollector.generateFeedbackSummary(startDate, endDate);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('FEEDBACK_READ_ERROR');
    });
  });
});