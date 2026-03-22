// Command Integration - Connect Smart Router with Agent OS Rapid Commands

import { writeFile, readFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { stringify as yamlStringify, parse as yamlParse } from 'yaml';
import type { RoutingRequestId, RegistryId } from './types';
import type { WorkflowDefinition, WorkflowStep } from './orchestration-types';
import type { AgentConfig } from './registry-types';

// Command Integration Types
export interface RapidCommand {
  readonly command: string;
  readonly description: string;
  readonly workflow: string;
  readonly time_limit: string;
  readonly agents: ReadonlyArray<RegistryId>;
  readonly priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface CommandRequest {
  readonly command: string;
  readonly parameters: string;
  readonly user_id?: string;
  readonly timestamp: Date;
  readonly modifiers: ReadonlyArray<CommandModifier>;
}

export interface CommandModifier {
  readonly type: 'time' | 'quality' | 'team';
  readonly value: string;
}

export interface RoutingRequest {
  readonly routing_id: RoutingRequestId;
  readonly command: string;
  readonly description: string;
  readonly priority: 'urgent' | 'high' | 'medium' | 'low';
  readonly time_limit: number; // minutes
  readonly workflow_type: string;
  readonly agents_required: ReadonlyArray<RegistryId>;
  readonly created_at: Date;
  readonly user_context?: Record<string, unknown>;
}

export interface IntegrationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: IntegrationError;
}

export interface IntegrationError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// Command Integration Directories
export interface IntegrationDirectories {
  readonly commands: string;        // .agent-os/routing/commands/
  readonly workflows: string;       // .agent-os/routing/workflows/
  readonly feedback: string;        // .agent-os/routing/feedback/
  readonly history: string;         // .agent-os/routing/history/
}

export class CommandIntegration {
  private readonly directories: IntegrationDirectories;
  private readonly rapidCommands: Map<string, RapidCommand> = new Map();

  constructor(directories: IntegrationDirectories) {
    this.directories = directories;
    this.initializeRapidCommands();
  }

  // Initialize built-in rapid commands
  private initializeRapidCommands(): void {
    const commands: RapidCommand[] = [
      {
        command: '/fix-bug',
        description: 'Fix critical user-facing bug in 15 minutes',
        workflow: 'fast-track-bug-fix',
        time_limit: '15_minutes',
        agents: ['qa-engineer', 'backend-engineer', 'architect'],
        priority: 'urgent'
      },
      {
        command: '/build-mvp',
        description: 'Build MVP in 4 hours',
        workflow: 'mvp-builder',
        time_limit: '4_hours',
        agents: ['product-owner', 'ui-designer', 'backend-engineer', 'frontend-engineer'],
        priority: 'high'
      },
      {
        command: '/validate',
        description: 'Validate a user problem in 2 hours',
        workflow: 'rapid-validation',
        time_limit: '2_hours',
        agents: ['ux-researcher', 'product-owner', 'ui-designer'],
        priority: 'high'
      },
      {
        command: '/ship-today',
        description: 'Ship a feature by end of day',
        workflow: 'rapid-feature',
        time_limit: '8_hours',
        agents: ['product-owner', 'ui-designer', 'backend-engineer', 'frontend-engineer', 'qa-engineer'],
        priority: 'medium'
      },
      {
        command: '/ultrathink',
        description: 'Solve complex problems with all teams',
        workflow: 'ultrathink-development',
        time_limit: '1_day',
        agents: ['architect', 'ai-researcher', 'security-engineer', 'backend-engineer', 'frontend-engineer'],
        priority: 'medium'
      }
    ];

    for (const cmd of commands) {
      this.rapidCommands.set(cmd.command, cmd);
    }
  }

  // Process rapid command and create routing request
  async processRapidCommand(
    command: string,
    parameters: string,
    modifiers: ReadonlyArray<CommandModifier> = []
  ): Promise<IntegrationResult<RoutingRequest>> {
    try {
      const rapidCommand = this.rapidCommands.get(command);
      if (!rapidCommand) {
        return {
          success: false,
          error: {
            code: 'UNKNOWN_COMMAND',
            message: `Unknown rapid command: ${command}`,
            details: { available_commands: Array.from(this.rapidCommands.keys()) }
          }
        };
      }

      const routingId = this.generateRoutingId(command, parameters);
      const timeLimit = this.parseTimeLimit(rapidCommand.time_limit, modifiers);
      const priority = this.resolvePriority(rapidCommand.priority, modifiers);
      
      const routingRequest: RoutingRequest = {
        routing_id: routingId,
        command: command,
        description: `${rapidCommand.description}: ${parameters}`,
        priority,
        time_limit: timeLimit,
        workflow_type: rapidCommand.workflow,
        agents_required: rapidCommand.agents,
        created_at: new Date(),
        user_context: {
          parameters,
          modifiers: modifiers.map(m => ({ type: m.type, value: m.value })),
          original_command: `${command} ${parameters}`
        }
      };

      // Create routing request file
      await this.createRoutingRequestFile(routingRequest);

      return { success: true, data: routingRequest };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'COMMAND_PROCESSING_ERROR',
          message: `Failed to process command: ${error.message}`
        }
      };
    }
  }

  // Create workflow from routing request
  async createWorkflowFromRequest(
    routingRequest: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): Promise<IntegrationResult<WorkflowDefinition>> {
    try {
      const workflowSteps = this.generateWorkflowSteps(routingRequest, agents);
      const workflowId = `workflow-${routingRequest.routing_id}` as any;

      const workflow: WorkflowDefinition = {
        workflow_id: workflowId,
        routing_id: routingRequest.routing_id,
        name: `${routingRequest.command} Workflow`,
        description: routingRequest.description,
        steps: workflowSteps,
        max_parallel_agents: Math.min(workflowSteps.length, 8),
        status: 'pending',
        created_at: new Date(),
        progress: 0
      };

      return { success: true, data: workflow };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_CREATION_ERROR',
          message: `Failed to create workflow: ${error.message}`
        }
      };
    }
  }

  // Generate workflow steps based on command type
  private generateWorkflowSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const availableAgents = agents.filter(agent => 
      request.agents_required.includes(agent.id)
    );

    switch (request.command) {
      case '/fix-bug':
        return this.generateBugFixSteps(request, availableAgents);
      case '/build-mvp':
        return this.generateMvpSteps(request, availableAgents);
      case '/validate':
        return this.generateValidationSteps(request, availableAgents);
      case '/ship-today':
        return this.generateShipTodaySteps(request, availableAgents);
      case '/ultrathink':
        return this.generateUltrathinkSteps(request, availableAgents);
      default:
        return this.generateGenericSteps(request, availableAgents);
    }
  }

  // Generate bug fix workflow steps
  private generateBugFixSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const qaAgent = agents.find(a => a.id === 'qa-engineer')?.id || agents[0]?.id;
    const engineerAgent = agents.find(a => a.id === 'backend-engineer')?.id || agents[1]?.id;
    const architectAgent = agents.find(a => a.id === 'architect')?.id || agents[2]?.id;

    return [
      {
        step_id: 'reproduce-bug',
        agent_id: qaAgent,
        task_description: `Reproduce and analyze bug: ${request.description}`,
        depends_on: [],
        estimated_duration: 5,
        status: 'pending'
      },
      {
        step_id: 'implement-fix',
        agent_id: engineerAgent,
        task_description: 'Implement rapid fix for reproduced bug',
        depends_on: ['reproduce-bug'],
        estimated_duration: 5,
        status: 'pending'
      },
      {
        step_id: 'test-deploy',
        agent_id: qaAgent,
        task_description: 'Test fix and deploy to production',
        depends_on: ['implement-fix'],
        estimated_duration: 3,
        status: 'pending'
      },
      {
        step_id: 'prevention-analysis',
        agent_id: architectAgent,
        task_description: 'Analyze prevention measures',
        depends_on: ['test-deploy'],
        estimated_duration: 2,
        status: 'pending'
      }
    ];
  }

  // Generate MVP workflow steps
  private generateMvpSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const productOwner = agents.find(a => a.id === 'product-owner')?.id || agents[0]?.id;
    const designer = agents.find(a => a.id === 'ui-designer')?.id || agents[1]?.id;
    const backendEng = agents.find(a => a.id === 'backend-engineer')?.id || agents[2]?.id;
    const frontendEng = agents.find(a => a.id === 'frontend-engineer')?.id || agents[3]?.id;

    return [
      {
        step_id: 'define-scope',
        agent_id: productOwner,
        task_description: `Define MVP scope for: ${request.description}`,
        depends_on: [],
        estimated_duration: 30,
        status: 'pending'
      },
      {
        step_id: 'design-ui',
        agent_id: designer,
        task_description: 'Create simple UI design for MVP',
        depends_on: ['define-scope'],
        estimated_duration: 45,
        status: 'pending'
      },
      {
        step_id: 'backend-dev',
        agent_id: backendEng,
        task_description: 'Develop backend functionality for MVP',
        depends_on: ['define-scope'],
        estimated_duration: 120,
        status: 'pending'
      },
      {
        step_id: 'frontend-dev',
        agent_id: frontendEng,
        task_description: 'Implement frontend with UI design',
        depends_on: ['design-ui', 'backend-dev'],
        estimated_duration: 90,
        status: 'pending'
      },
      {
        step_id: 'test-validate',
        agent_id: productOwner,
        task_description: 'Test core workflow and validate with users',
        depends_on: ['frontend-dev'],
        estimated_duration: 75,
        status: 'pending'
      }
    ];
  }

  // Generate validation workflow steps  
  private generateValidationSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const researcher = agents.find(a => a.id === 'ux-researcher')?.id || agents[0]?.id;
    const productOwner = agents.find(a => a.id === 'product-owner')?.id || agents[1]?.id;
    const designer = agents.find(a => a.id === 'ui-designer')?.id || agents[2]?.id;

    return [
      {
        step_id: 'user-interviews',
        agent_id: researcher,
        task_description: `Interview 3-5 users about: ${request.description}`,
        depends_on: [],
        estimated_duration: 30,
        status: 'pending'
      },
      {
        step_id: 'prioritize-problem',
        agent_id: productOwner,
        task_description: 'Prioritize problem based on research',
        depends_on: ['user-interviews'],
        estimated_duration: 10,
        status: 'pending'
      },
      {
        step_id: 'prototype-solution',
        agent_id: designer,
        task_description: 'Create prototype for validation',
        depends_on: ['prioritize-problem'],
        estimated_duration: 30,
        status: 'pending'
      },
      {
        step_id: 'test-users',
        agent_id: researcher,
        task_description: 'Test prototype with users',
        depends_on: ['prototype-solution'],
        estimated_duration: 30,
        status: 'pending'
      }
    ];
  }

  // Generate ship-today workflow steps
  private generateShipTodaySteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const morning = this.generateValidationSteps(request, agents);
    const afternoon = this.generateMvpSteps(request, agents);
    
    // Combine validation and development for same-day shipping
    return [
      ...morning,
      ...afternoon.map(step => ({
        ...step,
        step_id: `ship-${step.step_id}`,
        depends_on: step.depends_on.length === 0 ? ['test-users'] : step.depends_on
      }))
    ];
  }

  // Generate ultrathink workflow steps
  private generateUltrathinkSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const architect = agents.find(a => a.id === 'architect')?.id || agents[0]?.id;
    const aiResearcher = agents.find(a => a.id === 'ai-researcher')?.id || agents[1]?.id;
    const securityEng = agents.find(a => a.id === 'security-engineer')?.id || agents[2]?.id;
    const backendEng = agents.find(a => a.id === 'backend-engineer')?.id || agents[3]?.id;
    const frontendEng = agents.find(a => a.id === 'frontend-engineer')?.id || agents[4]?.id;

    return [
      {
        step_id: 'architecture-design',
        agent_id: architect,
        task_description: `Design solution architecture for: ${request.description}`,
        depends_on: [],
        estimated_duration: 120,
        status: 'pending'
      },
      {
        step_id: 'research-practices',
        agent_id: aiResearcher,
        task_description: 'Research best practices and solutions',
        depends_on: [],
        estimated_duration: 90,
        status: 'pending'
      },
      {
        step_id: 'security-review',
        agent_id: securityEng,
        task_description: 'Review architectural approach for security',
        depends_on: ['architecture-design'],
        estimated_duration: 60,
        status: 'pending'
      },
      {
        step_id: 'parallel-backend',
        agent_id: backendEng,
        task_description: 'Implement backend with architectural guidelines',
        depends_on: ['architecture-design', 'security-review'],
        estimated_duration: 180,
        status: 'pending'
      },
      {
        step_id: 'parallel-frontend',
        agent_id: frontendEng,
        task_description: 'Implement frontend with research insights',
        depends_on: ['architecture-design', 'research-practices'],
        estimated_duration: 180,
        status: 'pending'
      },
      {
        step_id: 'integration-test',
        agent_id: architect,
        task_description: 'Integration testing and coordination',
        depends_on: ['parallel-backend', 'parallel-frontend'],
        estimated_duration: 90,
        status: 'pending'
      }
    ];
  }

  // Generate generic workflow steps
  private generateGenericSteps(
    request: RoutingRequest,
    agents: ReadonlyArray<AgentConfig>
  ): ReadonlyArray<WorkflowStep> {
    const timePerAgent = Math.floor(request.time_limit / Math.max(agents.length, 1));
    
    return agents.map((agent, index) => ({
      step_id: `step-${index + 1}`,
      agent_id: agent.id,
      task_description: `${request.description} - Part ${index + 1}`,
      depends_on: index === 0 ? [] : [`step-${index}`],
      estimated_duration: timePerAgent,
      status: 'pending' as const
    }));
  }

  // Create routing request file
  private async createRoutingRequestFile(request: RoutingRequest): Promise<void> {
    const requestDir = this.directories.commands;
    const requestFile = join(requestDir, `${request.routing_id}.yml`);

    await mkdir(dirname(requestFile), { recursive: true });
    await writeFile(requestFile, yamlStringify(request), 'utf-8');
  }

  // Helper methods
  private generateRoutingId(command: string, parameters: string): RoutingRequestId {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '').replace('T', '-');
    const paramHash = parameters.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    return `${timestamp}-${command.slice(1)}-${paramHash}` as RoutingRequestId;
  }

  private parseTimeLimit(timeLimit: string, modifiers: ReadonlyArray<CommandModifier>): number {
    const timeModifier = modifiers.find(m => m.type === 'time');
    const baseTime = timeModifier?.value || timeLimit;

    const timeMap: Record<string, number> = {
      '15_minutes': 15,
      '30_minutes': 30,
      '1_hour': 60,
      '2_hours': 120,
      '4_hours': 240,
      '8_hours': 480,
      '1_day': 1440
    };

    return timeMap[baseTime] || 240; // Default to 4 hours
  }

  private resolvePriority(
    basePriority: 'urgent' | 'high' | 'medium' | 'low',
    modifiers: ReadonlyArray<CommandModifier>
  ): 'urgent' | 'high' | 'medium' | 'low' {
    const urgentModifiers = modifiers.filter(m => 
      (m.type === 'time' && ['urgent', 'today'].includes(m.value)) ||
      (m.type === 'quality' && m.value === 'urgent')
    );

    return urgentModifiers.length > 0 ? 'urgent' : basePriority;
  }

  // Get available rapid commands
  getAvailableCommands(): ReadonlyArray<RapidCommand> {
    return Array.from(this.rapidCommands.values());
  }

  // Add custom command
  addCustomCommand(command: RapidCommand): IntegrationResult<void> {
    try {
      this.rapidCommands.set(command.command, command);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'COMMAND_REGISTRATION_ERROR',
          message: `Failed to register command: ${error.message}`
        }
      };
    }
  }
}