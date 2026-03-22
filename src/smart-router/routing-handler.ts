import { readFile, writeFile, rename } from 'fs/promises';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';
import { join } from 'path';
import type {
  IRoutingRequestHandler,
  RoutingRequest,
  RoutingResponse,
  RoutingRequestId,
  DirectoryStructure,
  FileOperationResult,
  ExecutionStep,
  RoutingStatus
} from './communication-types';
import type { AgentConfig, RegistryId } from './registry-types';
import { CommunicationError } from './communication-types';
import { RequestAnalyzer } from './request-analyzer';

export class RoutingRequestHandler implements IRoutingRequestHandler {
  private readonly analyzer = new RequestAnalyzer();

  constructor(private readonly directories: DirectoryStructure) {}

  async processRequest(requestFile: string): Promise<FileOperationResult<RoutingResponse>> {
    try {
      // Read and parse the request file
      const content = await readFile(requestFile, 'utf-8');
      
      let request: RoutingRequest;
      try {
        const parsed = yamlParse(content);
        const validation = this.validateRequestStructure(parsed);
        if (!validation.success) {
          return validation;
        }
        request = parsed as RoutingRequest;
      } catch (parseError: any) {
        return {
          success: false,
          error: new CommunicationError(
            `Failed to parse request: ${parseError.message}`,
            'YAML_PARSE_ERROR',
            requestFile
          )
        };
      }

      // Update request status to processing
      const updatedRequest = { ...request, status: 'processing' as RoutingStatus };
      await writeFile(requestFile, yamlStringify(updatedRequest), 'utf-8');

      // Create initial response with processing status
      const response: RoutingResponse = {
        routing_id: request.routing_id,
        status: 'processing',
        progress: 0,
        workflow_type: 'standard', // Will be determined by agent analysis
        estimated_time: 'calculating...',
        start_time: new Date().toISOString(),
        selected_agents: [],
        execution_plan: []
      };

      // Save response to status directory
      const statusFile = join(this.directories.status, `${request.routing_id}.yml`);
      await writeFile(statusFile, yamlStringify(response), 'utf-8');

      return {
        success: true,
        data: response
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to process request: ${error.message}`,
          'FILE_READ_ERROR',
          requestFile
        )
      };
    }
  }

  async createResponse(
    request: RoutingRequest, 
    agents: ReadonlyArray<AgentConfig>
  ): Promise<FileOperationResult<RoutingResponse>> {
    if (agents.length === 0) {
      return {
        success: false,
        error: new CommunicationError(
          'No agents available for routing',
          'NO_AGENTS_AVAILABLE'
        )
      };
    }

    try {
      // Analyze the request to determine requirements
      const requestData = {
        command: request.command,
        timestamp: request.timestamp,
        context: request.context,
        user_preferences: request.user_preferences
      };

      const analysis = await this.analyzer.analyze(requestData);

      // Select agents based on analysis
      const selectedAgents = this.selectAgentsFromAnalysis(agents, analysis);
      
      // Create execution plan
      const executionPlan = this.createExecutionPlan(selectedAgents, analysis);

      // Build response
      const response: RoutingResponse = {
        routing_id: request.routing_id,
        status: 'in_progress',
        progress: 0,
        workflow_type: analysis.workflow_type,
        estimated_time: analysis.estimated_time,
        start_time: new Date().toISOString(),
        selected_agents: selectedAgents.map(agent => agent.id),
        execution_plan: executionPlan
      };

      // Save to status directory
      const statusFile = join(this.directories.status, `${request.routing_id}.yml`);
      await writeFile(statusFile, yamlStringify(response), 'utf-8');

      return {
        success: true,
        data: response
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to create response: ${error.message}`,
          'FILE_WRITE_ERROR'
        )
      };
    }
  }

  async updateStatus(
    routingId: RoutingRequestId, 
    status: RoutingStatus, 
    progress?: number
  ): Promise<FileOperationResult<void>> {
    const statusFile = join(this.directories.status, `${routingId}.yml`);

    try {
      // Read current status
      const content = await readFile(statusFile, 'utf-8');
      
      let currentResponse: RoutingResponse;
      try {
        currentResponse = yamlParse(content) as RoutingResponse;
      } catch (parseError: any) {
        return {
          success: false,
          error: new CommunicationError(
            `Failed to parse status file: ${parseError.message}`,
            'YAML_PARSE_ERROR',
            statusFile
          )
        };
      }

      // Update response
      const updatedResponse: RoutingResponse = {
        ...currentResponse,
        status: status,
        progress: progress ?? currentResponse.progress
      };

      // Save updated status
      await writeFile(statusFile, yamlStringify(updatedResponse), 'utf-8');

      // Move to history if completed
      if (status === 'completed' || status === 'failed') {
        const historyFile = join(this.directories.history, `${routingId}.yml`);
        await rename(statusFile, historyFile);
      }

      return {
        success: true,
        data: undefined
      };

    } catch (error: any) {
      if (error.code === 'ENOENT' || error.message?.includes('ENOENT') || error.message?.includes('no such file')) {
        return {
          success: false,
          error: new CommunicationError(
            `Status file not found for routing ID: ${routingId}`,
            'STATUS_FILE_NOT_FOUND',
            statusFile
          )
        };
      }

      return {
        success: false,
        error: new CommunicationError(
          `Failed to update status: ${error.message}`,
          'STATUS_UPDATE_ERROR',
          statusFile
        )
      };
    }
  }

  private validateRequestStructure(data: unknown): FileOperationResult<void> {
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: new CommunicationError(
          'Request must be an object',
          'INVALID_REQUEST_FORMAT'
        )
      };
    }

    const request = data as Record<string, unknown>;
    const requiredFields = ['routing_id', 'timestamp', 'command', 'context', 'user_preferences', 'status'];

    for (const field of requiredFields) {
      if (!(field in request)) {
        return {
          success: false,
          error: new CommunicationError(
            `Missing required field: ${field}`,
            'INVALID_REQUEST_FORMAT'
          )
        };
      }
    }

    return {
      success: true,
      data: undefined
    };
  }

  private selectAgentsFromAnalysis(
    agents: ReadonlyArray<AgentConfig>, 
    analysis: any
  ): ReadonlyArray<AgentConfig> {
    // Simple selection based on expertise areas
    const relevantAgents = agents.filter(agent => {
      // Check if agent has matching specializations
      const hasMatch = analysis.expertise_areas.some((area: string) =>
        agent.specializations.some(spec => 
          spec.toLowerCase().includes(area.toLowerCase()) ||
          area.toLowerCase().includes(spec.toLowerCase())
        )
      );
      
      return hasMatch && agent.availability !== 'offline';
    });

    // If no specific matches, return any available agents
    if (relevantAgents.length === 0) {
      const availableAgents = agents.filter(agent => agent.availability === 'available');
      if (availableAgents.length > 0) {
        return availableAgents.slice(0, 2);
      }
      // If no available agents, return any agent that's not offline
      const anyAgents = agents.filter(agent => agent.availability !== 'offline');
      return anyAgents.slice(0, 1);
    }

    // Prefer available agents, but include busy ones if needed
    const availableAgents = relevantAgents.filter(agent => agent.availability === 'available');
    const busyAgents = relevantAgents.filter(agent => agent.availability === 'busy');

    return availableAgents.length > 0 ? availableAgents.slice(0, 3) : busyAgents.slice(0, 2);
  }

  private createExecutionPlan(
    agents: ReadonlyArray<AgentConfig>, 
    analysis: any
  ): ReadonlyArray<ExecutionStep> {
    const steps: ExecutionStep[] = [];

    if (agents.length === 0) return steps;

    // Create steps based on command type and selected agents
    const commandType = analysis.command_type;
    
    if (commandType === 'fix-bug') {
      // Bug fix workflow: diagnosis -> fix -> test
      const engineeringAgents = agents.filter(a => a.team === 'engineering');
      const qaAgents = agents.filter(a => a.team === 'quality');

      if (engineeringAgents.length > 0) {
        steps.push({
          agent: engineeringAgents[0].id,
          task: 'Diagnose and fix the reported issue',
          status: 'pending',
          dependencies: []
        });

        if (qaAgents.length > 0) {
          steps.push({
            agent: qaAgents[0].id,
            task: 'Verify the fix and validate solution',
            status: 'pending',
            dependencies: [engineeringAgents[0].id]
          });
        }
      }
    } else if (commandType === 'build-mvp') {
      // MVP workflow: design -> implement -> test
      const designAgents = agents.filter(a => a.team === 'design');
      const engineeringAgents = agents.filter(a => a.team === 'engineering');
      const qaAgents = agents.filter(a => a.team === 'quality');

      if (designAgents.length > 0) {
        steps.push({
          agent: designAgents[0].id,
          task: 'Create design and wireframes',
          status: 'pending',
          dependencies: []
        });
      }

      if (engineeringAgents.length > 0) {
        steps.push({
          agent: engineeringAgents[0].id,
          task: 'Implement MVP functionality',
          status: 'pending',
          dependencies: designAgents.length > 0 ? [designAgents[0].id] : []
        });
      }

      if (qaAgents.length > 0) {
        steps.push({
          agent: qaAgents[0].id,
          task: 'Test and validate MVP',
          status: 'pending',
          dependencies: engineeringAgents.length > 0 ? [engineeringAgents[0].id] : []
        });
      }
    } else {
      // Generic workflow for other commands
      agents.forEach((agent, index) => {
        steps.push({
          agent: agent.id,
          task: `Execute ${analysis.intent}`,
          status: 'pending',
          dependencies: index > 0 ? [agents[index - 1].id] : []
        });
      });
    }

    return steps;
  }
}