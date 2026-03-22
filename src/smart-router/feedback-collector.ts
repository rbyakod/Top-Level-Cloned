// Feedback Collector - User feedback collection and analysis system

import { writeFile, readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { stringify as yamlStringify, parse as yamlParse } from 'yaml';
import type { WorkflowId, RoutingRequestId } from './types';
import type { RegistryId } from './types';

// Feedback Types
export interface UserFeedback {
  readonly feedback_id: string;
  readonly workflow_id?: WorkflowId;
  readonly routing_id?: RoutingRequestId;
  readonly user_id?: string;
  readonly feedback_type: 'workflow' | 'agent' | 'routing' | 'general';
  readonly rating: 1 | 2 | 3 | 4 | 5; // 1 = terrible, 5 = excellent
  readonly satisfaction: 'very_dissatisfied' | 'dissatisfied' | 'neutral' | 'satisfied' | 'very_satisfied';
  readonly feedback_text?: string;
  readonly specific_issues?: ReadonlyArray<FeedbackIssue>;
  readonly suggestions?: ReadonlyArray<string>;
  readonly created_at: Date;
  readonly context?: FeedbackContext;
}

export interface FeedbackIssue {
  readonly issue_type: 'slow' | 'incorrect' | 'unclear' | 'incomplete' | 'error' | 'other';
  readonly description: string;
  readonly affected_agent?: RegistryId;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FeedbackContext {
  readonly command_used?: string;
  readonly time_taken?: number; // minutes
  readonly agents_involved?: ReadonlyArray<RegistryId>;
  readonly workflow_type?: string;
  readonly user_experience_level?: 'beginner' | 'intermediate' | 'advanced';
  readonly use_case?: string;
}

export interface FeedbackSummary {
  readonly period_start: Date;
  readonly period_end: Date;
  readonly total_feedback: number;
  readonly average_rating: number;
  readonly satisfaction_distribution: Record<string, number>;
  readonly common_issues: ReadonlyArray<IssueAnalysis>;
  readonly agent_performance: ReadonlyArray<AgentFeedbackSummary>;
  readonly workflow_performance: ReadonlyArray<WorkflowFeedbackSummary>;
  readonly improvement_suggestions: ReadonlyArray<string>;
}

export interface IssueAnalysis {
  readonly issue_type: string;
  readonly frequency: number;
  readonly average_severity: number;
  readonly affected_agents: ReadonlyArray<RegistryId>;
  readonly description: string;
}

export interface AgentFeedbackSummary {
  readonly agent_id: RegistryId;
  readonly total_feedback: number;
  readonly average_rating: number;
  readonly satisfaction_rate: number; // percentage satisfied or very satisfied
  readonly common_issues: ReadonlyArray<string>;
  readonly improvement_areas: ReadonlyArray<string>;
}

export interface WorkflowFeedbackSummary {
  readonly workflow_type: string;
  readonly total_feedback: number;
  readonly average_rating: number;
  readonly completion_satisfaction: number;
  readonly time_satisfaction: number;
  readonly common_improvements: ReadonlyArray<string>;
}

export interface FeedbackOperationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: FeedbackError;
}

export interface FeedbackError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export class FeedbackCollector {
  private readonly feedbackDirectory: string;

  constructor(feedbackDirectory: string) {
    this.feedbackDirectory = feedbackDirectory;
  }

  // Collect user feedback
  async collectFeedback(feedback: Omit<UserFeedback, 'feedback_id' | 'created_at'>): Promise<FeedbackOperationResult<UserFeedback>> {
    try {
      const completeFeedback: UserFeedback = {
        ...feedback,
        feedback_id: this.generateFeedbackId(),
        created_at: new Date()
      };

      // Validate feedback
      const validation = this.validateFeedback(completeFeedback);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'INVALID_FEEDBACK',
            message: `Invalid feedback: ${validation.errors.join(', ')}`
          }
        };
      }

      // Save feedback to file
      const feedbackFile = join(this.feedbackDirectory, `${completeFeedback.feedback_id}.yml`);
      await writeFile(feedbackFile, yamlStringify(completeFeedback), 'utf-8');

      return { success: true, data: completeFeedback };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'FEEDBACK_COLLECTION_ERROR',
          message: `Failed to collect feedback: ${error.message}`
        }
      };
    }
  }

  // Collect quick rating feedback
  async collectQuickRating(
    workflowId: WorkflowId,
    rating: 1 | 2 | 3 | 4 | 5,
    context?: Partial<FeedbackContext>
  ): Promise<FeedbackOperationResult<UserFeedback>> {
    const satisfaction = this.ratingsToSatisfaction(rating);
    
    return this.collectFeedback({
      workflow_id: workflowId,
      feedback_type: 'workflow',
      rating,
      satisfaction,
      context: context ? { ...context } : undefined
    });
  }

  // Collect agent-specific feedback
  async collectAgentFeedback(
    agentId: RegistryId,
    rating: 1 | 2 | 3 | 4 | 5,
    issues?: ReadonlyArray<FeedbackIssue>,
    suggestions?: ReadonlyArray<string>
  ): Promise<FeedbackOperationResult<UserFeedback>> {
    const satisfaction = this.ratingsToSatisfaction(rating);
    
    return this.collectFeedback({
      feedback_type: 'agent',
      rating,
      satisfaction,
      specific_issues: issues,
      suggestions,
      context: {
        agents_involved: [agentId]
      }
    });
  }

  // Get all feedback for analysis
  async getAllFeedback(): Promise<FeedbackOperationResult<ReadonlyArray<UserFeedback>>> {
    try {
      const files = await readdir(this.feedbackDirectory);
      const feedbackFiles = files.filter(file => file.endsWith('.yml'));
      
      const feedback: UserFeedback[] = [];
      
      for (const file of feedbackFiles) {
        try {
          const content = await readFile(join(this.feedbackDirectory, file), 'utf-8');
          const feedbackData = yamlParse(content) as any;
          
          // Convert date strings to Date objects
          if (feedbackData.created_at) {
            feedbackData.created_at = new Date(feedbackData.created_at);
          }
          
          feedback.push(feedbackData as UserFeedback);
        } catch (error) {
          console.warn(`Error reading feedback file ${file}:`, error);
        }
      }

      return { success: true, data: feedback };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'FEEDBACK_READ_ERROR',
          message: `Failed to read feedback: ${error.message}`
        }
      };
    }
  }

  // Get feedback for specific workflow
  async getWorkflowFeedback(workflowId: WorkflowId): Promise<FeedbackOperationResult<ReadonlyArray<UserFeedback>>> {
    try {
      const allFeedbackResult = await this.getAllFeedback();
      if (!allFeedbackResult.success || !allFeedbackResult.data) {
        return allFeedbackResult;
      }

      const workflowFeedback = allFeedbackResult.data.filter(
        feedback => feedback.workflow_id === workflowId
      );

      return { success: true, data: workflowFeedback };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_FEEDBACK_ERROR',
          message: `Failed to get workflow feedback: ${error.message}`
        }
      };
    }
  }

  // Get feedback for specific agent
  async getAgentFeedback(agentId: RegistryId): Promise<FeedbackOperationResult<ReadonlyArray<UserFeedback>>> {
    try {
      const allFeedbackResult = await this.getAllFeedback();
      if (!allFeedbackResult.success || !allFeedbackResult.data) {
        return allFeedbackResult;
      }

      const agentFeedback = allFeedbackResult.data.filter(
        feedback => feedback.context?.agents_involved?.includes(agentId) ||
                   feedback.specific_issues?.some(issue => issue.affected_agent === agentId)
      );

      return { success: true, data: agentFeedback };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AGENT_FEEDBACK_ERROR',
          message: `Failed to get agent feedback: ${error.message}`
        }
      };
    }
  }

  // Generate feedback summary for time period
  async generateFeedbackSummary(
    startDate: Date,
    endDate: Date
  ): Promise<FeedbackOperationResult<FeedbackSummary>> {
    try {
      const allFeedbackResult = await this.getAllFeedback();
      if (!allFeedbackResult.success || !allFeedbackResult.data) {
        return {
          success: false,
          error: allFeedbackResult.error
        };
      }

      const periodFeedback = allFeedbackResult.data.filter(
        feedback => feedback.created_at >= startDate && feedback.created_at <= endDate
      );

      if (periodFeedback.length === 0) {
        return {
          success: true,
          data: {
            period_start: startDate,
            period_end: endDate,
            total_feedback: 0,
            average_rating: 0,
            satisfaction_distribution: {},
            common_issues: [],
            agent_performance: [],
            workflow_performance: [],
            improvement_suggestions: []
          }
        };
      }

      const summary = this.analyzeFeedback(periodFeedback, startDate, endDate);
      return { success: true, data: summary };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'FEEDBACK_SUMMARY_ERROR',
          message: `Failed to generate feedback summary: ${error.message}`
        }
      };
    }
  }

  // Analyze feedback and generate insights
  private analyzeFeedback(
    feedback: ReadonlyArray<UserFeedback>,
    startDate: Date,
    endDate: Date
  ): FeedbackSummary {
    const totalFeedback = feedback.length;
    const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    
    // Satisfaction distribution
    const satisfactionDistribution: Record<string, number> = {};
    for (const f of feedback) {
      satisfactionDistribution[f.satisfaction] = (satisfactionDistribution[f.satisfaction] || 0) + 1;
    }

    // Common issues analysis
    const issueMap = new Map<string, { count: number; severities: number[]; agents: Set<RegistryId> }>();
    
    for (const f of feedback) {
      if (f.specific_issues) {
        for (const issue of f.specific_issues) {
          const key = issue.issue_type;
          if (!issueMap.has(key)) {
            issueMap.set(key, { count: 0, severities: [], agents: new Set() });
          }
          const analysis = issueMap.get(key)!;
          analysis.count++;
          analysis.severities.push(this.severityToNumber(issue.severity));
          if (issue.affected_agent) {
            analysis.agents.add(issue.affected_agent);
          }
        }
      }
    }

    const commonIssues: IssueAnalysis[] = Array.from(issueMap.entries()).map(([type, data]) => ({
      issue_type: type,
      frequency: data.count,
      average_severity: data.severities.reduce((a, b) => a + b, 0) / data.severities.length,
      affected_agents: Array.from(data.agents),
      description: this.getIssueDescription(type)
    })).sort((a, b) => b.frequency - a.frequency);

    // Agent performance analysis
    const agentMap = new Map<RegistryId, { ratings: number[]; issues: string[]; feedback_count: number }>();
    
    for (const f of feedback) {
      if (f.context?.agents_involved) {
        for (const agentId of f.context.agents_involved) {
          if (!agentMap.has(agentId)) {
            agentMap.set(agentId, { ratings: [], issues: [], feedback_count: 0 });
          }
          const agentData = agentMap.get(agentId)!;
          agentData.ratings.push(f.rating);
          agentData.feedback_count++;
          
          if (f.specific_issues) {
            for (const issue of f.specific_issues) {
              if (issue.affected_agent === agentId) {
                agentData.issues.push(issue.issue_type);
              }
            }
          }
        }
      }
    }

    const agentPerformance: AgentFeedbackSummary[] = Array.from(agentMap.entries()).map(([agentId, data]) => ({
      agent_id: agentId,
      total_feedback: data.feedback_count,
      average_rating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
      satisfaction_rate: (data.ratings.filter(r => r >= 4).length / data.ratings.length) * 100,
      common_issues: [...new Set(data.issues)].slice(0, 3),
      improvement_areas: this.generateImprovementAreas(data.issues)
    }));

    // Workflow performance analysis
    const workflowMap = new Map<string, { ratings: number[]; feedback_count: number }>();
    
    for (const f of feedback) {
      if (f.context?.workflow_type) {
        const workflowType = f.context.workflow_type;
        if (!workflowMap.has(workflowType)) {
          workflowMap.set(workflowType, { ratings: [], feedback_count: 0 });
        }
        const workflowData = workflowMap.get(workflowType)!;
        workflowData.ratings.push(f.rating);
        workflowData.feedback_count++;
      }
    }

    const workflowPerformance: WorkflowFeedbackSummary[] = Array.from(workflowMap.entries()).map(([type, data]) => ({
      workflow_type: type,
      total_feedback: data.feedback_count,
      average_rating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
      completion_satisfaction: (data.ratings.filter(r => r >= 4).length / data.ratings.length) * 100,
      time_satisfaction: 80, // Simplified - would need time-specific feedback
      common_improvements: []
    }));

    // Improvement suggestions
    const suggestions = feedback
      .flatMap(f => f.suggestions || [])
      .filter((s, i, arr) => arr.indexOf(s) === i)
      .slice(0, 10);

    return {
      period_start: startDate,
      period_end: endDate,
      total_feedback: totalFeedback,
      average_rating: averageRating,
      satisfaction_distribution: satisfactionDistribution,
      common_issues: commonIssues.slice(0, 10),
      agent_performance: agentPerformance,
      workflow_performance: workflowPerformance,
      improvement_suggestions: suggestions
    };
  }

  // Helper methods
  private validateFeedback(feedback: UserFeedback): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!feedback.feedback_type) {
      errors.push('Feedback type is required');
    }

    if (feedback.rating < 1 || feedback.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!feedback.satisfaction) {
      errors.push('Satisfaction level is required');
    }

    return { valid: errors.length === 0, errors };
  }

  private generateFeedbackId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
    const random = Math.random().toString(36).substring(2, 8);
    return `feedback-${timestamp}-${random}`;
  }

  private ratingsToSatisfaction(rating: 1 | 2 | 3 | 4 | 5): UserFeedback['satisfaction'] {
    switch (rating) {
      case 1: return 'very_dissatisfied';
      case 2: return 'dissatisfied';
      case 3: return 'neutral';
      case 4: return 'satisfied';
      case 5: return 'very_satisfied';
    }
  }

  private severityToNumber(severity: FeedbackIssue['severity']): number {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
    }
  }

  private getIssueDescription(issueType: string): string {
    const descriptions: Record<string, string> = {
      slow: 'Process took longer than expected',
      incorrect: 'Results were not accurate or correct',
      unclear: 'Instructions or output were confusing',
      incomplete: 'Task was not fully completed',
      error: 'Technical errors occurred during execution',
      other: 'Other issues not covered by standard categories'
    };
    return descriptions[issueType] || 'Unspecified issue';
  }

  private generateImprovementAreas(issues: ReadonlyArray<string>): ReadonlyArray<string> {
    const improvementMap: Record<string, string> = {
      slow: 'Performance optimization',
      incorrect: 'Accuracy improvement',
      unclear: 'Communication clarity',
      incomplete: 'Task completion',
      error: 'Error handling'
    };

    return [...new Set(issues.map(issue => improvementMap[issue]).filter(Boolean))].slice(0, 3);
  }
}