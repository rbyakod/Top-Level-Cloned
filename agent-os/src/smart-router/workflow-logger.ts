// Workflow State Persistence - Markdown logging for Agent OS integration

import { writeFile, readFile, appendFile } from 'fs/promises';
import { join } from 'path';
import type {
  WorkflowId,
  WorkflowDefinition,
  WorkflowStep,
  ProgressEvent,
  WorkflowOperationResult
} from './orchestration-types';
import type { RegistryId } from './types';

export interface WorkflowLogEntry {
  readonly timestamp: Date;
  readonly event_type: 'workflow_created' | 'workflow_started' | 'step_assigned' | 
                      'step_completed' | 'step_failed' | 'workflow_completed' | 'error';
  readonly workflow_id: WorkflowId;
  readonly step_id?: string;
  readonly agent_id?: RegistryId;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export interface WorkflowSummary {
  readonly workflow_id: WorkflowId;
  readonly name: string;
  readonly status: string;
  readonly started_at: Date;
  readonly completed_at?: Date;
  readonly duration_minutes?: number;
  readonly total_steps: number;
  readonly completed_steps: number;
  readonly failed_steps: number;
  readonly agents_used: ReadonlyArray<RegistryId>;
}

export class WorkflowLogger {
  private readonly logDirectory: string;
  private readonly summaryDirectory: string;

  constructor(logDirectory: string, summaryDirectory: string) {
    this.logDirectory = logDirectory;
    this.summaryDirectory = summaryDirectory;
  }

  // Create initial workflow log
  async createWorkflowLog(workflow: WorkflowDefinition): Promise<WorkflowOperationResult<void>> {
    try {
      const logPath = join(this.logDirectory, `${workflow.workflow_id}.md`);
      
      const logContent = this.createInitialLogContent(workflow);
      await writeFile(logPath, logContent, 'utf-8');

      // Log creation event separately
      const createEvent = this.formatLogEntry({
        timestamp: new Date(),
        event_type: 'workflow_created',
        workflow_id: workflow.workflow_id,
        message: `Workflow '${workflow.name}' created with ${workflow.steps.length} steps`
      });
      await appendFile(logPath, `\n${createEvent}`, 'utf-8');

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_LOG_CREATE_ERROR',
          message: `Failed to create workflow log: ${error.message}`
        }
      };
    }
  }

  // Log workflow event
  async logEvent(entry: WorkflowLogEntry): Promise<WorkflowOperationResult<void>> {
    try {
      const logPath = join(this.logDirectory, `${entry.workflow_id}.md`);
      
      const logEntry = this.formatLogEntry(entry);
      await appendFile(logPath, `\n${logEntry}`, 'utf-8');

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_LOG_ERROR',
          message: `Failed to log event: ${error.message}`
        }
      };
    }
  }

  // Log progress event
  async logProgressEvent(event: ProgressEvent): Promise<void> {
    const entry: WorkflowLogEntry = {
      timestamp: event.timestamp,
      event_type: event.event_type as any,
      workflow_id: event.workflow_id,
      step_id: event.step_id,
      agent_id: event.agent_id as RegistryId,
      message: this.createProgressMessage(event),
      details: event.details
    };

    await this.logEvent(entry);
  }

  // Update workflow state in log
  async updateWorkflowState(workflow: WorkflowDefinition): Promise<WorkflowOperationResult<void>> {
    try {
      const logPath = join(this.logDirectory, `${workflow.workflow_id}.md`);
      
      // Read existing log
      const existingContent = await readFile(logPath, 'utf-8');
      
      // Update status section
      const updatedContent = this.updateStatusSection(existingContent, workflow);
      await writeFile(logPath, updatedContent, 'utf-8');

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_STATE_UPDATE_ERROR',
          message: `Failed to update workflow state: ${error.message}`
        }
      };
    }
  }

  // Complete workflow log with summary
  async completeWorkflowLog(workflow: WorkflowDefinition): Promise<WorkflowOperationResult<void>> {
    try {
      // Log completion event
      await this.logEvent({
        timestamp: new Date(),
        event_type: 'workflow_completed',
        workflow_id: workflow.workflow_id,
        message: `Workflow completed with status: ${workflow.status}`,
        details: {
          total_steps: workflow.steps.length,
          completed_steps: workflow.steps.filter(s => s.status === 'completed').length,
          failed_steps: workflow.steps.filter(s => s.status === 'failed').length
        }
      });

      // Create workflow summary
      await this.createWorkflowSummary(workflow);

      // Add completion section to log
      await this.addCompletionSection(workflow);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_COMPLETION_ERROR',
          message: `Failed to complete workflow log: ${error.message}`
        }
      };
    }
  }

  // Get workflow log content
  async getWorkflowLog(workflowId: WorkflowId): Promise<WorkflowOperationResult<string>> {
    try {
      const logPath = join(this.logDirectory, `${workflowId}.md`);
      const content = await readFile(logPath, 'utf-8');
      return { success: true, data: content };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_LOG_NOT_FOUND',
          message: `Workflow log not found: ${workflowId}`
        }
      };
    }
  }

  // Get workflow summary
  async getWorkflowSummary(workflowId: WorkflowId): Promise<WorkflowOperationResult<WorkflowSummary>> {
    try {
      const summaryPath = join(this.summaryDirectory, `${workflowId}-summary.md`);
      const content = await readFile(summaryPath, 'utf-8');
      const summary = this.parseWorkflowSummary(content);
      return { success: true, data: summary };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_SUMMARY_NOT_FOUND',
          message: `Workflow summary not found: ${workflowId}`
        }
      };
    }
  }

  // Create initial log content
  private createInitialLogContent(workflow: WorkflowDefinition): string {
    const timestamp = workflow.created_at.toISOString();
    
    return `# Workflow: ${workflow.name}

**Workflow ID:** ${workflow.workflow_id}  
**Routing ID:** ${workflow.routing_id}  
**Created:** ${timestamp}  
**Status:** ${workflow.status}  
**Description:** ${workflow.description}

## Configuration

- **Max Parallel Agents:** ${workflow.max_parallel_agents}
- **Total Steps:** ${workflow.steps.length}
- **Estimated Duration:** ${this.calculateEstimatedDuration(workflow)} minutes

## Steps Overview

${this.createStepsTable(workflow.steps)}

## Current Status

**Progress:** ${workflow.progress}%  
**Status:** ${workflow.status}  
**Last Updated:** ${timestamp}

### Step Status
${this.createStepStatusList(workflow.steps)}

## Execution Log

*Workflow events will be logged below in chronological order*

---`;
  }

  // Format log entry
  private formatLogEntry(entry: WorkflowLogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const stepInfo = entry.step_id ? ` [Step: ${entry.step_id}]` : '';
    const agentInfo = entry.agent_id ? ` [Agent: ${entry.agent_id}]` : '';
    
    let logEntry = `### ${timestamp} - ${entry.event_type.toUpperCase()}${stepInfo}${agentInfo}

${entry.message}`;

    if (entry.details) {
      logEntry += `\n\n**Details:**\n\`\`\`json\n${JSON.stringify(entry.details, null, 2)}\n\`\`\``;
    }

    return logEntry;
  }

  // Create progress message
  private createProgressMessage(event: ProgressEvent): string {
    switch (event.event_type) {
      case 'step_started':
        return `Step ${event.step_id} assigned to agent ${event.agent_id}`;
      case 'step_completed':
        return `Step ${event.step_id} completed successfully by agent ${event.agent_id}`;
      case 'step_failed':
        return `Step ${event.step_id} failed on agent ${event.agent_id}`;
      case 'workflow_completed':
        return `Workflow execution completed`;
      default:
        return `Progress event: ${event.event_type}`;
    }
  }

  // Update status section in log
  private updateStatusSection(content: string, workflow: WorkflowDefinition): string {
    const statusRegex = /## Current Status[\s\S]*?(?=## |$)/;
    const newStatusSection = `## Current Status

**Progress:** ${workflow.progress}%  
**Status:** ${workflow.status}  
**Last Updated:** ${new Date().toISOString()}

### Step Status
${this.createStepStatusList(workflow.steps)}

`;

    return content.replace(statusRegex, newStatusSection);
  }

  // Create workflow summary
  private async createWorkflowSummary(workflow: WorkflowDefinition): Promise<void> {
    const summary = this.generateWorkflowSummary(workflow);
    const summaryContent = this.formatWorkflowSummary(summary);
    
    const summaryPath = join(this.summaryDirectory, `${workflow.workflow_id}-summary.md`);
    await writeFile(summaryPath, summaryContent, 'utf-8');
  }

  // Generate workflow summary data
  private generateWorkflowSummary(workflow: WorkflowDefinition): WorkflowSummary {
    const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
    const failedSteps = workflow.steps.filter(s => s.status === 'failed').length;
    const agentsUsed = [...new Set(workflow.steps.map(s => s.agent_id))];
    
    let duration: number | undefined;
    if (workflow.started_at && workflow.completed_at) {
      duration = Math.round((workflow.completed_at.getTime() - workflow.started_at.getTime()) / (1000 * 60));
    }

    return {
      workflow_id: workflow.workflow_id,
      name: workflow.name,
      status: workflow.status,
      started_at: workflow.started_at || workflow.created_at,
      completed_at: workflow.completed_at,
      duration_minutes: duration,
      total_steps: workflow.steps.length,
      completed_steps: completedSteps,
      failed_steps: failedSteps,
      agents_used: agentsUsed
    };
  }

  // Format workflow summary as markdown
  private formatWorkflowSummary(summary: WorkflowSummary): string {
    return `# Workflow Summary: ${summary.name}

**Workflow ID:** ${summary.workflow_id}  
**Status:** ${summary.status}  
**Started:** ${summary.started_at.toISOString()}  
${summary.completed_at ? `**Completed:** ${summary.completed_at.toISOString()}  ` : ''}
${summary.duration_minutes ? `**Duration:** ${summary.duration_minutes} minutes  ` : ''}

## Results

- **Total Steps:** ${summary.total_steps}
- **Completed:** ${summary.completed_steps}
- **Failed:** ${summary.failed_steps}
- **Success Rate:** ${Math.round((summary.completed_steps / summary.total_steps) * 100)}%

## Agents Involved

${summary.agents_used.map(agent => `- ${agent}`).join('\n')}

## Performance Metrics

- **Average Steps per Minute:** ${summary.duration_minutes ? Math.round(summary.completed_steps / summary.duration_minutes) : 'N/A'}
- **Agents Utilization:** ${summary.agents_used.length} agents
- **Parallel Efficiency:** ${summary.total_steps > summary.agents_used.length ? 'High' : 'Medium'}

---

*Generated by Agent OS Smart Router v2.0*`;
  }

  // Parse workflow summary from markdown
  private parseWorkflowSummary(content: string): WorkflowSummary {
    // Simple parsing - in production would use more robust markdown parser
    const lines = content.split('\n');
    const summary: any = {};
    
    for (const line of lines) {
      if (line.startsWith('**Workflow ID:**')) {
        summary.workflow_id = line.split('**Workflow ID:**')[1].trim();
      } else if (line.startsWith('**Status:**')) {
        summary.status = line.split('**Status:**')[1].trim();
      }
      // Add more parsing as needed
    }
    
    return summary as WorkflowSummary;
  }

  // Add completion section to log
  private async addCompletionSection(workflow: WorkflowDefinition): Promise<void> {
    const logPath = join(this.logDirectory, `${workflow.workflow_id}.md`);
    const summary = this.generateWorkflowSummary(workflow);
    
    const completionSection = `

## Workflow Completion Summary

**Final Status:** ${workflow.status}  
**Completed At:** ${workflow.completed_at?.toISOString()}  
**Duration:** ${summary.duration_minutes} minutes  

### Final Results
- Total Steps: ${summary.total_steps}
- Completed: ${summary.completed_steps}
- Failed: ${summary.failed_steps}
- Success Rate: ${Math.round((summary.completed_steps / summary.total_steps) * 100)}%

### Agents Performance
${summary.agents_used.map(agent => {
  const agentSteps = workflow.steps.filter(s => s.agent_id === agent);
  const completed = agentSteps.filter(s => s.status === 'completed').length;
  const total = agentSteps.length;
  return `- **${agent}**: ${completed}/${total} steps (${Math.round((completed / total) * 100)}%)`;
}).join('\n')}

---
*Workflow log completed by Agent OS Smart Router*`;

    await appendFile(logPath, completionSection, 'utf-8');
  }

  // Helper methods
  private createStepsTable(steps: ReadonlyArray<WorkflowStep>): string {
    const header = '| Step ID | Agent | Description | Dependencies | Duration |\n|---------|-------|-------------|--------------|----------|';
    const rows = steps.map(step => 
      `| ${step.step_id} | ${step.agent_id} | ${step.task_description} | ${step.depends_on.join(', ') || 'None'} | ${step.estimated_duration}min |`
    );
    return [header, ...rows].join('\n');
  }

  private createStepStatusList(steps: ReadonlyArray<WorkflowStep>): string {
    return steps.map(step => {
      const statusIcon = this.getStatusIcon(step.status);
      return `- ${statusIcon} **${step.step_id}** (${step.agent_id}): ${step.status}`;
    }).join('\n');
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      case 'assigned': return '👤';
      default: return '⏳';
    }
  }

  private calculateEstimatedDuration(workflow: WorkflowDefinition): number {
    return workflow.steps.reduce((sum, step) => sum + step.estimated_duration, 0);
  }
}