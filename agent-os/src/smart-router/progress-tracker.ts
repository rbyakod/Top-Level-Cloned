// Progress Tracker - Real-time tracking with 500ms updates

import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { stringify as yamlStringify, parse as yamlParse } from 'yaml';
import type {
  WorkflowId,
  WorkflowStatus,
  WorkflowProgress,
  WorkflowDefinition,
  WorkflowOperationResult
} from './orchestration-types';

export interface ProgressMetrics {
  readonly workflow_id: WorkflowId;
  readonly total_steps: number;
  readonly completed_steps: number;
  readonly running_steps: number;
  readonly failed_steps: number;
  readonly pending_steps: number;
  readonly progress_percentage: number;
  readonly estimated_completion: Date | null;
  readonly current_phase: number;
  readonly total_phases: number;
  readonly agents_active: number;
  readonly last_updated: Date;
}

export interface ProgressEvent {
  readonly event_type: 'step_started' | 'step_completed' | 'step_failed' | 'workflow_completed';
  readonly workflow_id: WorkflowId;
  readonly step_id?: string;
  readonly agent_id?: string;
  readonly timestamp: Date;
  readonly details?: Record<string, unknown>;
}

export type ProgressCallback = (event: ProgressEvent) => void;

export class ProgressTracker {
  private readonly progressDirectory: string;
  private readonly updateInterval: number = 500; // 500ms as required
  private progressTimers = new Map<WorkflowId, NodeJS.Timeout>();
  private progressCallbacks: ProgressCallback[] = [];
  private workflowMetrics = new Map<WorkflowId, ProgressMetrics>();

  constructor(progressDirectory: string) {
    this.progressDirectory = progressDirectory;
  }

  // Start tracking a workflow
  async startTracking(workflow: WorkflowDefinition): Promise<WorkflowOperationResult<void>> {
    try {
      const metrics = this.calculateInitialMetrics(workflow);
      this.workflowMetrics.set(workflow.workflow_id, metrics);

      // Start real-time updates
      this.startRealTimeUpdates(workflow.workflow_id);

      // Save initial progress
      await this.saveProgress(metrics);

      // Emit tracking started event
      this.emitProgressEvent({
        event_type: 'step_started',
        workflow_id: workflow.workflow_id,
        timestamp: new Date()
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'PROGRESS_TRACKING_ERROR',
          message: `Failed to start tracking: ${error.message}`
        }
      };
    }
  }

  // Stop tracking a workflow
  async stopTracking(workflowId: WorkflowId): Promise<void> {
    const timer = this.progressTimers.get(workflowId);
    if (timer) {
      clearInterval(timer);
      this.progressTimers.delete(workflowId);
    }

    this.workflowMetrics.delete(workflowId);
  }

  // Update workflow progress
  async updateProgress(workflow: WorkflowDefinition): Promise<WorkflowOperationResult<ProgressMetrics>> {
    try {
      const metrics = this.calculateMetrics(workflow);
      this.workflowMetrics.set(workflow.workflow_id, metrics);

      // Save updated progress
      await this.saveProgress(metrics);

      // Emit progress events based on changes
      await this.checkForProgressEvents(workflow, metrics);

      return { success: true, data: metrics };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'PROGRESS_UPDATE_ERROR',
          message: `Failed to update progress: ${error.message}`
        }
      };
    }
  }

  // Get current progress for a workflow
  async getProgress(workflowId: WorkflowId): Promise<WorkflowOperationResult<ProgressMetrics>> {
    try {
      // Try memory first
      const cachedMetrics = this.workflowMetrics.get(workflowId);
      if (cachedMetrics) {
        return { success: true, data: cachedMetrics };
      }

      // Load from file
      const progressFile = join(this.progressDirectory, `${workflowId}-metrics.yml`);
      const content = await readFile(progressFile, 'utf-8');
      const metrics = yamlParse(content) as ProgressMetrics;

      this.workflowMetrics.set(workflowId, metrics);
      return { success: true, data: metrics };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'PROGRESS_NOT_FOUND',
          message: `Progress not found for workflow: ${workflowId}`
        }
      };
    }
  }

  // Subscribe to progress events
  onProgressEvent(callback: ProgressCallback): void {
    this.progressCallbacks.push(callback);
  }

  // Get all active workflow progress
  async getAllActiveProgress(): Promise<WorkflowOperationResult<Map<WorkflowId, ProgressMetrics>>> {
    try {
      const allProgress = new Map<WorkflowId, ProgressMetrics>();
      
      for (const [workflowId, metrics] of this.workflowMetrics) {
        if (metrics.progress_percentage < 100) {
          allProgress.set(workflowId, metrics);
        }
      }

      return { success: true, data: allProgress };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'PROGRESS_FETCH_ERROR',
          message: `Failed to fetch active progress: ${error.message}`
        }
      };
    }
  }

  // Calculate initial metrics for a workflow
  private calculateInitialMetrics(workflow: WorkflowDefinition): ProgressMetrics {
    const totalSteps = workflow.steps.length;
    const currentPhase = 1;
    const totalPhases = this.estimatePhaseCount(workflow);

    return {
      workflow_id: workflow.workflow_id,
      total_steps: totalSteps,
      completed_steps: 0,
      running_steps: 0,
      failed_steps: 0,
      pending_steps: totalSteps,
      progress_percentage: 0,
      estimated_completion: this.estimateCompletion(workflow),
      current_phase: currentPhase,
      total_phases: totalPhases,
      agents_active: 0,
      last_updated: new Date()
    };
  }

  // Calculate current metrics from workflow state
  private calculateMetrics(workflow: WorkflowDefinition): ProgressMetrics {
    const totalSteps = workflow.steps.length;
    const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
    const runningSteps = workflow.steps.filter(s => s.status === 'running').length;
    const failedSteps = workflow.steps.filter(s => s.status === 'failed').length;
    const pendingSteps = workflow.steps.filter(s => s.status === 'pending').length;

    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const currentPhase = this.calculateCurrentPhase(workflow);
    const totalPhases = this.estimatePhaseCount(workflow);

    return {
      workflow_id: workflow.workflow_id,
      total_steps: totalSteps,
      completed_steps: completedSteps,
      running_steps: runningSteps,
      failed_steps: failedSteps,
      pending_steps: pendingSteps,
      progress_percentage: progressPercentage,
      estimated_completion: this.estimateCompletion(workflow),
      current_phase: currentPhase,
      total_phases: totalPhases,
      agents_active: runningSteps,
      last_updated: new Date()
    };
  }

  // Start real-time updates with 500ms intervals
  private startRealTimeUpdates(workflowId: WorkflowId): void {
    const timer = setInterval(async () => {
      const metrics = this.workflowMetrics.get(workflowId);
      if (metrics && metrics.progress_percentage < 100) {
        // Update timestamp to show real-time tracking
        const updatedMetrics = {
          ...metrics,
          last_updated: new Date()
        };
        this.workflowMetrics.set(workflowId, updatedMetrics);
        await this.saveProgress(updatedMetrics);
      } else {
        // Stop tracking completed workflows
        this.stopTracking(workflowId);
      }
    }, this.updateInterval);

    this.progressTimers.set(workflowId, timer);
  }

  // Save progress to file
  private async saveProgress(metrics: ProgressMetrics): Promise<void> {
    const progressFile = join(this.progressDirectory, `${metrics.workflow_id}-metrics.yml`);
    await writeFile(progressFile, yamlStringify(metrics), 'utf-8');
  }

  // Check for progress events and emit them
  private async checkForProgressEvents(
    workflow: WorkflowDefinition, 
    metrics: ProgressMetrics
  ): Promise<void> {
    // Check for completed steps
    for (const step of workflow.steps) {
      if (step.status === 'completed' && step.completed_at) {
        this.emitProgressEvent({
          event_type: 'step_completed',
          workflow_id: workflow.workflow_id,
          step_id: step.step_id,
          agent_id: step.agent_id,
          timestamp: step.completed_at
        });
      }

      if (step.status === 'failed') {
        this.emitProgressEvent({
          event_type: 'step_failed',
          workflow_id: workflow.workflow_id,
          step_id: step.step_id,
          agent_id: step.agent_id,
          timestamp: new Date()
        });
      }
    }

    // Check for workflow completion
    if (metrics.progress_percentage === 100) {
      this.emitProgressEvent({
        event_type: 'workflow_completed',
        workflow_id: workflow.workflow_id,
        timestamp: new Date(),
        details: {
          total_steps: metrics.total_steps,
          failed_steps: metrics.failed_steps
        }
      });
    }
  }

  // Emit progress event to all callbacks
  private emitProgressEvent(event: ProgressEvent): void {
    for (const callback of this.progressCallbacks) {
      try {
        callback(event);
      } catch (error) {
        // Log error but don't break other callbacks
        console.error('Progress callback error:', error);
      }
    }
  }

  // Estimate completion time based on step durations
  private estimateCompletion(workflow: WorkflowDefinition): Date | null {
    if (workflow.status === 'completed') return null;

    const now = new Date();
    const remainingSteps = workflow.steps.filter(s => s.status === 'pending' || s.status === 'running');
    
    if (remainingSteps.length === 0) return now;

    // Simple estimation: sum of remaining step durations
    const remainingMinutes = remainingSteps.reduce((sum, step) => sum + step.estimated_duration, 0);
    
    const estimatedCompletion = new Date(now.getTime() + (remainingMinutes * 60 * 1000));
    return estimatedCompletion;
  }

  // Estimate total phases (simplified calculation)
  private estimatePhaseCount(workflow: WorkflowDefinition): number {
    // Simple heuristic: count max dependency depth
    const dependencyCounts = workflow.steps.map(step => step.depends_on.length);
    return Math.max(1, Math.max(...dependencyCounts) + 1);
  }

  // Calculate current phase based on completed dependencies
  private calculateCurrentPhase(workflow: WorkflowDefinition): number {
    const completedSteps = new Set(
      workflow.steps.filter(s => s.status === 'completed').map(s => s.step_id)
    );
    
    let maxPhase = 1;
    for (const step of workflow.steps) {
      if (step.status === 'running' || step.status === 'completed') {
        const phase = step.depends_on.length + 1;
        maxPhase = Math.max(maxPhase, phase);
      }
    }
    
    return maxPhase;
  }

  // Cleanup method
  async shutdown(): Promise<void> {
    // Stop all progress tracking
    for (const workflowId of this.progressTimers.keys()) {
      await this.stopTracking(workflowId);
    }
    
    this.progressCallbacks.length = 0;
    this.workflowMetrics.clear();
  }
}