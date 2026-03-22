// Workflow Orchestrator - Simple and Clean Phase 1 Implementation

import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { stringify as yamlStringify, parse as yamlParse } from 'yaml';
import type {
  WorkflowDefinition,
  WorkflowStep,
  WorkflowStatus,
  WorkflowId,
  WorkflowProgress,
  AgentTaskStatus,
  WorkflowOperationResult,
  WorkflowError,
  WorkflowDirectories,
  AgentTask,
  AgentExecutionResult
} from './orchestration-types';
import type { RoutingRequestId, RegistryId } from './types';

export class WorkflowOrchestrator {
  private readonly directories: WorkflowDirectories;
  private readonly progressUpdateInterval: number = 500; // 500ms as required
  private activeWorkflows = new Map<WorkflowId, WorkflowDefinition>();
  private progressTimers = new Map<WorkflowId, NodeJS.Timeout>();

  constructor(directories: WorkflowDirectories) {
    this.directories = directories;
  }

  // Create a new workflow from routing request
  async createWorkflow(
    routingId: RoutingRequestId,
    name: string,
    description: string,
    steps: ReadonlyArray<Omit<WorkflowStep, 'status' | 'assigned_at' | 'completed_at'>>
  ): Promise<WorkflowOperationResult<WorkflowDefinition>> {
    try {
      const workflowId = this.generateWorkflowId(routingId);
      
      const workflow: WorkflowDefinition = {
        workflow_id: workflowId,
        routing_id: routingId,
        name,
        description,
        steps: steps.map(step => ({
          ...step,
          status: 'pending' as AgentTaskStatus,
        })),
        max_parallel_agents: Math.min(steps.length, 8), // up to 8 concurrent
        status: 'pending' as WorkflowStatus,
        created_at: new Date(),
        progress: 0
      };

      // Save workflow to active directory
      const filePath = join(this.directories.active, `${workflowId}.yml`);
      await writeFile(filePath, yamlStringify(workflow), 'utf-8');

      return { success: true, data: workflow };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_CREATE_ERROR',
          message: `Failed to create workflow: ${error.message}`
        }
      };
    }
  }

  // Start workflow execution
  async startWorkflow(workflowId: WorkflowId): Promise<WorkflowOperationResult<void>> {
    try {
      const workflow = await this.loadWorkflow(workflowId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow ${workflowId} not found`
          }
        };
      }

      // Update workflow status
      const updatedWorkflow: WorkflowDefinition = {
        ...workflow,
        status: 'running',
        started_at: new Date()
      };

      await this.saveWorkflow(updatedWorkflow);
      this.activeWorkflows.set(workflowId, updatedWorkflow);

      // Start progress tracking
      this.startProgressTracking(workflowId);

      // Execute initial steps (no dependencies)
      await this.executeReadySteps(workflowId);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_START_ERROR',
          message: `Failed to start workflow: ${error.message}`
        }
      };
    }
  }

  // Execute steps that have no pending dependencies
  private async executeReadySteps(workflowId: WorkflowId): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const readySteps = this.getReadySteps(workflow);
    const runningCount = workflow.steps.filter(s => s.status === 'running').length;
    const canRun = Math.min(
      readySteps.length, 
      workflow.max_parallel_agents - runningCount
    );

    // Execute up to max_parallel_agents steps
    for (let i = 0; i < canRun; i++) {
      const step = readySteps[i];
      await this.executeStep(workflowId, step.step_id);
    }
  }

  // Get steps ready for execution (dependencies completed)
  private getReadySteps(workflow: WorkflowDefinition): ReadonlyArray<WorkflowStep> {
    return workflow.steps.filter(step => {
      if (step.status !== 'pending') return false;
      
      // Check if all dependencies are completed
      return step.depends_on.every(depId => {
        const depStep = workflow.steps.find(s => s.step_id === depId);
        return depStep?.status === 'completed';
      });
    });
  }

  // Execute a single step (simplified for Phase 1)
  private async executeStep(workflowId: WorkflowId, stepId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const step = workflow.steps.find(s => s.step_id === stepId);
    if (!step) return;

    // Update step status to running
    await this.updateStepStatus(workflowId, stepId, 'running', new Date());

    try {
      // Phase 1: Simulate agent execution (will integrate with real agents later)
      const result = await this.simulateAgentExecution(step);
      
      if (result.success) {
        await this.updateStepStatus(workflowId, stepId, 'completed', undefined, new Date(), result.output);
      } else {
        await this.updateStepStatus(workflowId, stepId, 'failed', undefined, new Date(), result.error);
      }

      // Check if workflow is complete or can execute more steps
      await this.checkWorkflowProgress(workflowId);
      
    } catch (error: any) {
      await this.updateStepStatus(workflowId, stepId, 'failed', undefined, new Date(), error.message);
    }
  }

  // Phase 1: Simulate agent execution (placeholder for real integration)
  private async simulateAgentExecution(step: WorkflowStep): Promise<AgentExecutionResult> {
    // Simulate execution time based on estimated duration
    const executionTime = Math.min(step.estimated_duration * 100, 5000); // Max 5 seconds
    await new Promise(resolve => setTimeout(resolve, executionTime));

    // Phase 1: Always succeed for testing
    return {
      task_id: step.step_id,
      agent_id: step.agent_id,
      success: true,
      output: `Completed: ${step.task_description}`,
      completed_at: new Date()
    };
  }

  // Update step status and save workflow
  private async updateStepStatus(
    workflowId: WorkflowId,
    stepId: string,
    status: AgentTaskStatus,
    assignedAt?: Date,
    completedAt?: Date,
    output?: string
  ): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const updatedSteps = workflow.steps.map(step => {
      if (step.step_id === stepId) {
        return {
          ...step,
          status,
          assigned_at: assignedAt || step.assigned_at,
          completed_at: completedAt || step.completed_at,
          output: output || step.output
        };
      }
      return step;
    });

    const updatedWorkflow = { ...workflow, steps: updatedSteps };
    this.activeWorkflows.set(workflowId, updatedWorkflow);
    await this.saveWorkflow(updatedWorkflow);
  }

  // Check workflow progress and trigger next steps
  private async checkWorkflowProgress(workflowId: WorkflowId): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const completedCount = workflow.steps.filter(s => s.status === 'completed').length;
    const failedCount = workflow.steps.filter(s => s.status === 'failed').length;
    const totalSteps = workflow.steps.length;

    // Calculate progress
    const progress = Math.round((completedCount / totalSteps) * 100);

    // Check if workflow is complete
    if (completedCount === totalSteps) {
      await this.completeWorkflow(workflowId, 'completed');
    } else if (failedCount > 0 && completedCount + failedCount === totalSteps) {
      await this.completeWorkflow(workflowId, 'failed');
    } else {
      // Continue execution with next ready steps
      await this.executeReadySteps(workflowId);
      
      // Update progress
      const updatedWorkflow = { ...workflow, progress };
      this.activeWorkflows.set(workflowId, updatedWorkflow);
      await this.saveWorkflow(updatedWorkflow);
    }
  }

  // Complete workflow and move to appropriate directory
  private async completeWorkflow(workflowId: WorkflowId, status: WorkflowStatus): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const completedWorkflow: WorkflowDefinition = {
      ...workflow,
      status,
      completed_at: new Date(),
      progress: status === 'completed' ? 100 : workflow.progress
    };

    // Stop progress tracking
    this.stopProgressTracking(workflowId);

    // Move to completed/failed directory
    const targetDir = status === 'completed' ? this.directories.completed : this.directories.failed;
    const newPath = join(targetDir, `${workflowId}.yml`);
    const oldPath = join(this.directories.active, `${workflowId}.yml`);

    await writeFile(newPath, yamlStringify(completedWorkflow), 'utf-8');
    
    // Remove from active workflows
    this.activeWorkflows.delete(workflowId);
  }

  // Progress tracking with 500ms updates
  private startProgressTracking(workflowId: WorkflowId): void {
    const timer = setInterval(async () => {
      await this.updateWorkflowProgress(workflowId);
    }, this.progressUpdateInterval);
    
    this.progressTimers.set(workflowId, timer);
  }

  private stopProgressTracking(workflowId: WorkflowId): void {
    const timer = this.progressTimers.get(workflowId);
    if (timer) {
      clearInterval(timer);
      this.progressTimers.delete(workflowId);
    }
  }

  private async updateWorkflowProgress(workflowId: WorkflowId): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) return;

    const progress: WorkflowProgress = {
      workflow_id: workflowId,
      status: workflow.status,
      progress: workflow.progress,
      running_steps: workflow.steps.filter(s => s.status === 'running').map(s => s.step_id),
      completed_steps: workflow.steps.filter(s => s.status === 'completed').map(s => s.step_id),
      failed_steps: workflow.steps.filter(s => s.status === 'failed').map(s => s.step_id),
      last_updated: new Date()
    };

    // Save progress file
    const progressPath = join(this.directories.active, `${workflowId}-progress.yml`);
    await writeFile(progressPath, yamlStringify(progress), 'utf-8');
  }

  // Get workflow progress
  async getWorkflowProgress(workflowId: WorkflowId): Promise<WorkflowOperationResult<WorkflowProgress>> {
    try {
      const progressPath = join(this.directories.active, `${workflowId}-progress.yml`);
      const content = await readFile(progressPath, 'utf-8');
      const progress = yamlParse(content) as WorkflowProgress;
      
      return { success: true, data: progress };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'PROGRESS_NOT_FOUND',
          message: `Progress not found for workflow ${workflowId}`
        }
      };
    }
  }

  // Helper methods
  private async loadWorkflow(workflowId: WorkflowId): Promise<WorkflowDefinition | null> {
    try {
      const filePath = join(this.directories.active, `${workflowId}.yml`);
      const content = await readFile(filePath, 'utf-8');
      return yamlParse(content) as WorkflowDefinition;
    } catch {
      return null;
    }
  }

  private async saveWorkflow(workflow: WorkflowDefinition): Promise<void> {
    const filePath = join(this.directories.active, `${workflow.workflow_id}.yml`);
    await writeFile(filePath, yamlStringify(workflow), 'utf-8');
  }

  private generateWorkflowId(routingId: RoutingRequestId): WorkflowId {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
    return `workflow-${routingId}-${timestamp}` as WorkflowId;
  }

  // Cleanup method
  async shutdown(): Promise<void> {
    // Stop all progress tracking
    for (const workflowId of this.progressTimers.keys()) {
      this.stopProgressTracking(workflowId);
    }
    
    this.activeWorkflows.clear();
  }
}