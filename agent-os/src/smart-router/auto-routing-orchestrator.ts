// Auto-Routing Orchestrator - Main integration point for Agent OS rapid commands

import { mkdir } from 'fs/promises';
import { CommandIntegration, type IntegrationDirectories, type CommandRequest, type RoutingRequest } from './command-integration';
import { WorkflowOrchestrator, type WorkflowDirectories } from './workflow-orchestrator';
import { ProgressTracker } from './progress-tracker';
import { WorkflowLogger } from './workflow-logger';
import { FileWatcher } from './file-watcher';
import { AgentRegistry } from './agent-registry';
import { DependencyManager } from './dependency-manager';
import { ConflictResolver } from './conflict-resolver';
import type { 
  WorkflowDefinition, 
  WorkflowId, 
  WorkflowOperationResult,
  ProgressEvent 
} from './orchestration-types';
import type { RoutingRequestId } from './types';
import type { AgentConfig } from './registry-types';

export interface AutoRoutingConfig {
  readonly baseDirectory: string;
  readonly enableRealTimeMonitoring: boolean;
  readonly maxConcurrentWorkflows: number;
}

export interface AutoRoutingDirectories {
  readonly base: string;
  readonly routing: string;
  readonly commands: string;
  readonly workflows: string;
  readonly feedback: string;
  readonly history: string;
  readonly logs: string;
  readonly summaries: string;
  readonly progress: string;
  readonly config: string;
}

export class AutoRoutingOrchestrator {
  private readonly config: AutoRoutingConfig;
  private readonly directories: AutoRoutingDirectories;
  private readonly commandIntegration: CommandIntegration;
  private readonly workflowOrchestrator: WorkflowOrchestrator;
  private readonly progressTracker: ProgressTracker;
  private readonly workflowLogger: WorkflowLogger;
  private readonly fileWatcher: FileWatcher;
  private readonly agentRegistry: AgentRegistry;
  private readonly dependencyManager: DependencyManager;
  private readonly conflictResolver: ConflictResolver;

  private activeWorkflows = new Map<WorkflowId, WorkflowDefinition>();
  private isMonitoring = false;

  constructor(config: AutoRoutingConfig) {
    this.config = config;
    this.directories = this.createDirectoryStructure(config.baseDirectory);
    
    // Initialize all components
    const integrationDirs: IntegrationDirectories = {
      commands: this.directories.commands,
      workflows: this.directories.workflows,
      feedback: this.directories.feedback,
      history: this.directories.history
    };

    const workflowDirs: WorkflowDirectories = {
      workflows: this.directories.workflows,
      active: `${this.directories.workflows}/active`,
      completed: `${this.directories.workflows}/completed`,
      failed: `${this.directories.workflows}/failed`
    };

    this.commandIntegration = new CommandIntegration(integrationDirs);
    this.workflowOrchestrator = new WorkflowOrchestrator(workflowDirs);
    this.progressTracker = new ProgressTracker(this.directories.progress);
    this.workflowLogger = new WorkflowLogger(this.directories.logs, this.directories.summaries);
    this.fileWatcher = new FileWatcher(this.directories.commands as any);
    this.agentRegistry = new AgentRegistry(`${this.directories.routing}/registry.yml`);
    this.dependencyManager = new DependencyManager();
    this.conflictResolver = new ConflictResolver(this.directories.config);
  }

  // Initialize the orchestrator
  async initialize(): Promise<WorkflowOperationResult<void>> {
    try {
      // Create directory structure
      await this.createDirectories();

      // Initialize components
      await this.agentRegistry.loadRegistry();
      await this.conflictResolver.initialize();

      // Start monitoring if enabled
      if (this.config.enableRealTimeMonitoring) {
        await this.startMonitoring();
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'ORCHESTRATOR_INIT_ERROR',
          message: `Failed to initialize auto-routing orchestrator: ${error.message}`
        }
      };
    }
  }

  // Process rapid command and create workflow
  async executeRapidCommand(
    command: string,
    parameters: string,
    modifiers: ReadonlyArray<{ type: string; value: string }> = []
  ): Promise<WorkflowOperationResult<WorkflowDefinition>> {
    try {
      // Process command into routing request
      const routingResult = await this.commandIntegration.processRapidCommand(
        command, 
        parameters, 
        modifiers
      );

      if (!routingResult.success || !routingResult.data) {
        return {
          success: false,
          error: {
            code: 'COMMAND_PROCESSING_FAILED',
            message: routingResult.error?.message || 'Failed to process command'
          }
        };
      }

      const routingRequest = routingResult.data;

      // Get available agents
      const agentResult = await this.agentRegistry.getAvailableAgents();
      if (!agentResult.success || !agentResult.data) {
        return {
          success: false,
          error: {
            code: 'AGENTS_UNAVAILABLE',
            message: 'No agents available for workflow execution'
          }
        };
      }

      // Create workflow from routing request
      const workflowResult = await this.commandIntegration.createWorkflowFromRequest(
        routingRequest,
        agentResult.data
      );

      if (!workflowResult.success || !workflowResult.data) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_CREATION_FAILED',
            message: workflowResult.error?.message || 'Failed to create workflow'
          }
        };
      }

      const workflow = workflowResult.data;

      // Validate workflow dependencies
      const validation = this.dependencyManager.validateDependencies(workflow.steps);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'INVALID_WORKFLOW_DEPENDENCIES',
            message: `Workflow has dependency issues: ${validation.errors.join(', ')}`
          }
        };
      }

      // Create workflow in orchestrator
      const createResult = await this.workflowOrchestrator.createWorkflow(
        workflow.routing_id,
        workflow.name,
        workflow.description,
        workflow.steps.map(step => ({
          step_id: step.step_id,
          agent_id: step.agent_id,
          task_description: step.task_description,
          depends_on: step.depends_on,
          estimated_duration: step.estimated_duration
        }))
      );

      if (!createResult.success || !createResult.data) {
        return {
          success: false,
          error: {
            code: 'ORCHESTRATOR_CREATE_FAILED',
            message: createResult.error?.message || 'Failed to create workflow in orchestrator'
          }
        };
      }

      const orchestratedWorkflow = createResult.data;

      // Initialize logging and progress tracking
      await this.workflowLogger.createWorkflowLog(orchestratedWorkflow);
      await this.progressTracker.startTracking(orchestratedWorkflow);

      // Start workflow execution
      const startResult = await this.workflowOrchestrator.startWorkflow(orchestratedWorkflow.workflow_id);
      if (!startResult.success) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_START_FAILED',
            message: startResult.error?.message || 'Failed to start workflow'
          }
        };
      }

      // Track active workflow
      this.activeWorkflows.set(orchestratedWorkflow.workflow_id, orchestratedWorkflow);

      // Set up progress monitoring
      this.setupWorkflowMonitoring(orchestratedWorkflow.workflow_id);

      return { success: true, data: orchestratedWorkflow };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'RAPID_COMMAND_ERROR',
          message: `Failed to execute rapid command: ${error.message}`
        }
      };
    }
  }

  // Start monitoring for new command files
  private async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    // Watch for new command files
    this.fileWatcher.onFileEvent(async (event) => {
      if (event.event_type === 'add' && event.file_path.endsWith('.yml')) {
        await this.handleNewCommandFile(event.file_path);
      }
    });

    await this.fileWatcher.start();
    this.isMonitoring = true;
  }

  // Handle new command file detected
  private async handleNewCommandFile(filePath: string): Promise<void> {
    try {
      // Auto-process command files when they appear
      // This would integrate with the broader Agent OS command system
      console.log(`New command file detected: ${filePath}`);
      // Implementation would depend on the specific command file format
    } catch (error) {
      console.error('Error handling command file:', error);
    }
  }

  // Setup progress monitoring for a workflow
  private setupWorkflowMonitoring(workflowId: WorkflowId): void {
    this.progressTracker.onProgressEvent(async (event: ProgressEvent) => {
      if (event.workflow_id !== workflowId) return;

      // Log progress events
      await this.workflowLogger.logProgressEvent(event);

      // Handle workflow completion
      if (event.event_type === 'workflow_completed') {
        await this.handleWorkflowCompletion(workflowId);
      }
    });
  }

  // Handle workflow completion
  private async handleWorkflowCompletion(workflowId: WorkflowId): Promise<void> {
    try {
      const workflow = this.activeWorkflows.get(workflowId);
      if (!workflow) return;

      // Complete logging
      await this.workflowLogger.completeWorkflowLog(workflow);

      // Stop progress tracking
      await this.progressTracker.stopTracking(workflowId);

      // Remove from active workflows
      this.activeWorkflows.delete(workflowId);

      console.log(`Workflow ${workflowId} completed successfully`);
    } catch (error) {
      console.error(`Error handling workflow completion for ${workflowId}:`, error);
    }
  }

  // Get workflow status
  async getWorkflowStatus(workflowId: WorkflowId): Promise<WorkflowOperationResult<any>> {
    try {
      const progressResult = await this.progressTracker.getProgress(workflowId);
      if (!progressResult.success) {
        return progressResult;
      }

      const workflowProgress = await this.workflowOrchestrator.getWorkflowProgress(workflowId);
      
      return {
        success: true,
        data: {
          progress: progressResult.data,
          workflow_status: workflowProgress.data,
          is_active: this.activeWorkflows.has(workflowId)
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'STATUS_FETCH_ERROR',
          message: `Failed to get workflow status: ${error.message}`
        }
      };
    }
  }

  // Get all active workflows
  async getActiveWorkflows(): Promise<WorkflowOperationResult<Map<WorkflowId, any>>> {
    try {
      const activeProgress = await this.progressTracker.getAllActiveProgress();
      return activeProgress;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'ACTIVE_WORKFLOWS_ERROR',
          message: `Failed to get active workflows: ${error.message}`
        }
      };
    }
  }

  // Get available commands
  getAvailableCommands(): ReadonlyArray<any> {
    return this.commandIntegration.getAvailableCommands();
  }

  // Shutdown orchestrator
  async shutdown(): Promise<void> {
    try {
      // Stop monitoring
      if (this.isMonitoring) {
        await this.fileWatcher.stop();
        this.isMonitoring = false;
      }

      // Stop progress tracking
      await this.progressTracker.shutdown();

      // Shutdown workflow orchestrator
      await this.workflowOrchestrator.shutdown();

      // Clear active workflows
      this.activeWorkflows.clear();

      console.log('Auto-routing orchestrator shutdown complete');
    } catch (error) {
      console.error('Error during orchestrator shutdown:', error);
    }
  }

  // Helper methods
  private createDirectoryStructure(baseDirectory: string): AutoRoutingDirectories {
    const routing = `${baseDirectory}/.agent-os/routing`;
    
    return {
      base: baseDirectory,
      routing,
      commands: `${routing}/commands`,
      workflows: `${routing}/workflows`,
      feedback: `${routing}/feedback`,
      history: `${routing}/history`,
      logs: `${routing}/logs`,
      summaries: `${routing}/summaries`,
      progress: `${routing}/progress`,
      config: `${routing}/config`
    };
  }

  private async createDirectories(): Promise<void> {
    const dirs = [
      this.directories.routing,
      this.directories.commands,
      this.directories.workflows,
      `${this.directories.workflows}/active`,
      `${this.directories.workflows}/completed`,
      `${this.directories.workflows}/failed`,
      this.directories.feedback,
      this.directories.history,
      this.directories.logs,
      this.directories.summaries,
      this.directories.progress,
      this.directories.config
    ];

    for (const dir of dirs) {
      await mkdir(dir, { recursive: true });
    }
  }
}