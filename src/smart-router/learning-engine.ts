// Learning Engine - Improves agent selection based on feedback and performance data

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { stringify as yamlStringify, parse as yamlParse } from 'yaml';
import type { RegistryId } from './types';
import type { UserFeedback, FeedbackSummary } from './feedback-collector';
import type { AgentConfig } from './registry-types';

export interface LearningData {
  readonly agent_id: RegistryId;
  readonly total_assignments: number;
  readonly successful_completions: number;
  readonly average_rating: number;
  readonly satisfaction_rate: number; // percentage
  readonly common_task_types: ReadonlyArray<string>;
  readonly performance_trends: ReadonlyArray<PerformanceTrend>;
  readonly last_updated: Date;
}

export interface PerformanceTrend {
  readonly period: string;
  readonly rating: number;
  readonly completion_rate: number;
  readonly user_satisfaction: number;
  readonly issue_frequency: number;
}

export interface AgentImprovement {
  readonly agent_id: RegistryId;
  readonly current_score: number;
  readonly suggested_score: number;
  readonly confidence: number; // 0-1
  readonly reasoning: string;
  readonly data_points: number;
}

export interface LearningResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

export class LearningEngine {
  private readonly learningDirectory: string;
  private readonly modelFile: string;
  private learningData = new Map<RegistryId, LearningData>();

  constructor(learningDirectory: string) {
    this.learningDirectory = learningDirectory;
    this.modelFile = join(learningDirectory, 'learning-model.yml');
  }

  // Load existing learning data
  async loadLearningData(): Promise<LearningResult<Map<RegistryId, LearningData>>> {
    try {
      const content = await readFile(this.modelFile, 'utf-8');
      const data = yamlParse(content) as { agents: LearningData[] };
      
      this.learningData.clear();
      for (const agentData of data.agents || []) {
        this.learningData.set(agentData.agent_id, agentData);
      }

      return { success: true, data: this.learningData };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, start with empty data
        return { success: true, data: this.learningData };
      }
      
      return {
        success: false,
        error: {
          code: 'LEARNING_DATA_LOAD_ERROR',
          message: `Failed to load learning data: ${error.message}`
        }
      };
    }
  }

  // Save learning data to file
  async saveLearningData(): Promise<LearningResult<void>> {
    try {
      const data = {
        last_updated: new Date(),
        agents: Array.from(this.learningData.values())
      };

      await writeFile(this.modelFile, yamlStringify(data), 'utf-8');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'LEARNING_DATA_SAVE_ERROR',
          message: `Failed to save learning data: ${error.message}`
        }
      };
    }
  }

  // Update learning data from feedback
  async updateFromFeedback(feedback: ReadonlyArray<UserFeedback>): Promise<LearningResult<void>> {
    try {
      const agentStats = new Map<RegistryId, {
        ratings: number[];
        satisfactions: string[];
        taskTypes: string[];
        completions: number;
        totalAssignments: number;
      }>();

      // Aggregate feedback data by agent
      for (const fb of feedback) {
        if (fb.context?.agents_involved) {
          for (const agentId of fb.context.agents_involved) {
            if (!agentStats.has(agentId)) {
              agentStats.set(agentId, {
                ratings: [],
                satisfactions: [],
                taskTypes: [],
                completions: 0,
                totalAssignments: 0
              });
            }

            const stats = agentStats.get(agentId)!;
            stats.ratings.push(fb.rating);
            stats.satisfactions.push(fb.satisfaction);
            stats.totalAssignments++;
            
            // Count as completion if rating >= 3
            if (fb.rating >= 3) {
              stats.completions++;
            }

            // Add task type if available
            if (fb.context?.workflow_type) {
              stats.taskTypes.push(fb.context.workflow_type);
            }
          }
        }
      }

      // Update learning data for each agent
      for (const [agentId, stats] of agentStats) {
        const existingData = this.learningData.get(agentId);
        
        const averageRating = stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length;
        const satisfactionRate = (stats.satisfactions.filter(s => 
          s === 'satisfied' || s === 'very_satisfied'
        ).length / stats.satisfactions.length) * 100;

        // Generate performance trends (simplified - last 30 days)
        const trends = this.generatePerformanceTrends(stats, existingData);

        const updatedData: LearningData = {
          agent_id: agentId,
          total_assignments: (existingData?.total_assignments || 0) + stats.totalAssignments,
          successful_completions: (existingData?.successful_completions || 0) + stats.completions,
          average_rating: averageRating,
          satisfaction_rate: satisfactionRate,
          common_task_types: [...new Set([
            ...(existingData?.common_task_types || []),
            ...stats.taskTypes
          ])].slice(0, 10), // Keep top 10
          performance_trends: trends,
          last_updated: new Date()
        };

        this.learningData.set(agentId, updatedData);
      }

      await this.saveLearningData();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'FEEDBACK_UPDATE_ERROR',
          message: `Failed to update from feedback: ${error.message}`
        }
      };
    }
  }

  // Generate agent score improvements based on learning
  async generateScoreImprovements(
    currentAgents: ReadonlyArray<AgentConfig>
  ): Promise<LearningResult<ReadonlyArray<AgentImprovement>>> {
    try {
      const improvements: AgentImprovement[] = [];

      for (const agent of currentAgents) {
        const learningData = this.learningData.get(agent.id);
        
        if (!learningData || learningData.total_assignments < 5) {
          // Not enough data for meaningful improvements
          continue;
        }

        const improvement = this.calculateScoreImprovement(agent, learningData);
        if (improvement) {
          improvements.push(improvement);
        }
      }

      return { success: true, data: improvements };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'SCORE_IMPROVEMENT_ERROR',
          message: `Failed to generate score improvements: ${error.message}`
        }
      };
    }
  }

  // Get learning data for specific agent
  async getAgentLearningData(agentId: RegistryId): Promise<LearningResult<LearningData | undefined>> {
    try {
      const data = this.learningData.get(agentId);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AGENT_LEARNING_ERROR',
          message: `Failed to get agent learning data: ${error.message}`
        }
      };
    }
  }

  // Get top performing agents for a task type
  async getTopAgentsForTask(
    taskType: string,
    limit: number = 5
  ): Promise<LearningResult<ReadonlyArray<{ agentId: RegistryId; score: number; confidence: number }>>> {
    try {
      const candidates: Array<{ agentId: RegistryId; score: number; confidence: number }> = [];

      for (const [agentId, data] of this.learningData) {
        // Check if agent has experience with this task type
        const hasTaskExperience = data.common_task_types.some(type => 
          type.toLowerCase().includes(taskType.toLowerCase()) ||
          taskType.toLowerCase().includes(type.toLowerCase())
        );

        if (hasTaskExperience && data.total_assignments >= 3) {
          const score = this.calculateTaskSpecificScore(data, taskType);
          const confidence = this.calculateConfidence(data);
          
          candidates.push({ agentId, score, confidence });
        }
      }

      // Sort by score and confidence
      candidates.sort((a, b) => {
        const scoreWeight = 0.7;
        const confidenceWeight = 0.3;
        const scoreA = (a.score * scoreWeight) + (a.confidence * confidenceWeight);
        const scoreB = (b.score * scoreWeight) + (b.confidence * confidenceWeight);
        return scoreB - scoreA;
      });

      return { success: true, data: candidates.slice(0, limit) };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'TOP_AGENTS_ERROR',
          message: `Failed to get top agents for task: ${error.message}`
        }
      };
    }
  }

  // Get learning statistics
  async getLearningStatistics(): Promise<LearningResult<{
    totalAgents: number;
    totalAssignments: number;
    averageSatisfaction: number;
    improvementOpportunities: number;
  }>> {
    try {
      const stats = {
        totalAgents: this.learningData.size,
        totalAssignments: Array.from(this.learningData.values())
          .reduce((sum, data) => sum + data.total_assignments, 0),
        averageSatisfaction: Array.from(this.learningData.values())
          .reduce((sum, data) => sum + data.satisfaction_rate, 0) / this.learningData.size,
        improvementOpportunities: Array.from(this.learningData.values())
          .filter(data => data.satisfaction_rate < 80 || data.average_rating < 3.5).length
      };

      return { success: true, data: stats };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'LEARNING_STATS_ERROR',
          message: `Failed to get learning statistics: ${error.message}`
        }
      };
    }
  }

  // Private helper methods
  private generatePerformanceTrends(
    stats: { ratings: number[]; satisfactions: string[]; completions: number; totalAssignments: number },
    existingData?: LearningData
  ): ReadonlyArray<PerformanceTrend> {
    // Simplified trend generation - would be more sophisticated in production
    const currentTrend: PerformanceTrend = {
      period: new Date().toISOString().substring(0, 7), // YYYY-MM
      rating: stats.ratings.reduce((sum, r) => sum + r, 0) / stats.ratings.length,
      completion_rate: (stats.completions / stats.totalAssignments) * 100,
      user_satisfaction: (stats.satisfactions.filter(s => 
        s === 'satisfied' || s === 'very_satisfied'
      ).length / stats.satisfactions.length) * 100,
      issue_frequency: 0 // Would calculate from feedback issues
    };

    const existingTrends = existingData?.performance_trends || [];
    const updatedTrends = [currentTrend, ...existingTrends.slice(0, 11)]; // Keep last 12 months
    
    return updatedTrends;
  }

  private calculateScoreImprovement(
    agent: AgentConfig,
    learningData: LearningData
  ): AgentImprovement | null {
    const currentScore = agent.priority_score;
    
    // Calculate suggested score based on performance
    const performanceMultiplier = this.calculatePerformanceMultiplier(learningData);
    const suggestedScore = Math.max(1, Math.min(10, Math.round(currentScore * performanceMultiplier)));
    
    // Only suggest changes if significant difference
    if (Math.abs(suggestedScore - currentScore) < 0.5) {
      return null;
    }

    const confidence = this.calculateConfidence(learningData);
    const reasoning = this.generateReasoningText(learningData, currentScore, suggestedScore);

    return {
      agent_id: agent.id,
      current_score: currentScore,
      suggested_score: suggestedScore,
      confidence,
      reasoning,
      data_points: learningData.total_assignments
    };
  }

  private calculatePerformanceMultiplier(data: LearningData): number {
    const baseMultiplier = 1.0;
    
    // Adjust based on satisfaction rate
    const satisfactionAdjustment = (data.satisfaction_rate - 75) / 100; // 75% is baseline
    
    // Adjust based on average rating
    const ratingAdjustment = (data.average_rating - 3.5) / 10; // 3.5 is baseline
    
    // Adjust based on completion rate
    const completionRate = (data.successful_completions / data.total_assignments) * 100;
    const completionAdjustment = (completionRate - 80) / 200; // 80% is baseline
    
    return Math.max(0.5, Math.min(2.0, 
      baseMultiplier + satisfactionAdjustment + ratingAdjustment + completionAdjustment
    ));
  }

  private calculateTaskSpecificScore(data: LearningData, taskType: string): number {
    let baseScore = (data.average_rating / 5) * 100; // Convert to 0-100 scale
    
    // Boost score if agent has specific experience with task type
    const taskExperience = data.common_task_types.filter(type => 
      type.toLowerCase().includes(taskType.toLowerCase())
    ).length;
    
    const experienceBoost = Math.min(20, taskExperience * 5); // Max 20 point boost
    
    return Math.min(100, baseScore + experienceBoost);
  }

  private calculateConfidence(data: LearningData): number {
    // Confidence based on amount of data and consistency
    const dataPoints = Math.min(100, data.total_assignments);
    const dataConfidence = dataPoints / 100;
    
    // Consistency in ratings (lower variance = higher confidence)
    const trends = data.performance_trends;
    const variance = trends.length > 1 ? 
      this.calculateVariance(trends.map(t => t.rating)) : 0;
    const consistencyConfidence = Math.max(0, 1 - (variance / 5));
    
    return (dataConfidence * 0.6) + (consistencyConfidence * 0.4);
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private generateReasoningText(
    data: LearningData,
    currentScore: number,
    suggestedScore: number
  ): string {
    const direction = suggestedScore > currentScore ? 'increase' : 'decrease';
    const satisfactionText = data.satisfaction_rate >= 80 ? 'high' : 
                           data.satisfaction_rate >= 60 ? 'moderate' : 'low';
    const ratingText = data.average_rating >= 4 ? 'excellent' : 
                      data.average_rating >= 3.5 ? 'good' : 'needs improvement';

    return `Suggest ${direction} based on ${satisfactionText} user satisfaction (${data.satisfaction_rate.toFixed(1)}%) and ${ratingText} average rating (${data.average_rating.toFixed(1)}/5) over ${data.total_assignments} assignments.`;
  }
}