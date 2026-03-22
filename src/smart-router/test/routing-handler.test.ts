import { RoutingRequestHandler } from '../routing-handler';
import type { 
  RoutingRequest, 
  RoutingResponse, 
  RoutingRequestId,
  DirectoryStructure 
} from '../communication-types';
import type { AgentConfig, RegistryId } from '../registry-types';
import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('RoutingRequestHandler', () => {
  let handler: RoutingRequestHandler;
  let mockDirectories: DirectoryStructure;
  let mockRequest: RoutingRequest;
  let mockAgents: ReadonlyArray<AgentConfig>;

  beforeEach(() => {
    mockDirectories = {
      requests: '/test/routing/requests' as any,
      status: '/test/routing/status' as any,
      history: '/test/routing/history' as any,
      messages: '/test/routing/messages' as any
    };

    handler = new RoutingRequestHandler(mockDirectories);

    mockRequest = {
      routing_id: '2025-08-27-143052-fix-bug-payment' as RoutingRequestId,
      timestamp: '2025-08-27T14:30:52Z',
      command: '/fix-bug payment button not working',
      context: {
        git_status: 'clean',
        current_branch: 'main',
        recent_changes: ['checkout.js', 'payment.service.js'],
        project_type: 'web_app'
      },
      user_preferences: {
        preferred_speed: 'rapid',
        previous_success: ['backend-engineer', 'qa-engineer']
      },
      status: 'pending'
    };

    mockAgents = [
      {
        id: 'backend-engineer' as RegistryId,
        name: 'Backend Engineer',
        team: 'engineering',
        specializations: ['apis', 'databases', 'debugging'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.94,
          avg_response_time: '2.3 minutes',
          current_workload: 2,
          completed_tasks: 150,
          last_seen: '2025-08-27T14:25:00Z'
        },
        metadata: {}
      },
      {
        id: 'qa-engineer' as RegistryId,
        name: 'QA Engineer',
        team: 'quality',
        specializations: ['testing', 'validation', 'debugging'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.96,
          avg_response_time: '3.0 minutes',
          current_workload: 1,
          completed_tasks: 120,
          last_seen: '2025-08-27T14:20:00Z'
        },
        metadata: {}
      }
    ];

    jest.clearAllMocks();
  });

  describe('request processing', () => {
    it('should process routing request file successfully', async () => {
      const requestFilePath = '/test/routing/requests/2025-08-27-request.yml';
      const yamlContent = yamlStringify(mockRequest);
      
      mockedFs.readFile.mockResolvedValue(yamlContent);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.processRequest(requestFilePath);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.routing_id).toBe(mockRequest.routing_id);
        expect(result.data.status).toBe('processing');
      }

      expect(mockedFs.readFile).toHaveBeenCalledWith(requestFilePath, 'utf-8');
    });

    it('should handle invalid request file', async () => {
      const requestFilePath = '/test/routing/requests/invalid.yml';
      const invalidYaml = 'invalid: yaml: [unclosed';
      
      mockedFs.readFile.mockResolvedValue(invalidYaml);

      const result = await handler.processRequest(requestFilePath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('YAML_PARSE_ERROR');
        expect(result.error.message).toContain('Failed to parse request');
      }
    });

    it('should handle missing request file', async () => {
      const requestFilePath = '/test/routing/requests/missing.yml';
      
      mockedFs.readFile.mockRejectedValue(new Error('ENOENT: no such file'));

      const result = await handler.processRequest(requestFilePath);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('FILE_READ_ERROR');
      }
    });

    it('should validate request structure', async () => {
      const invalidRequest = {
        routing_id: '2025-08-27-143052-fix-bug-payment',
        // Missing required fields
      };
      const yamlContent = yamlStringify(invalidRequest);
      
      mockedFs.readFile.mockResolvedValue(yamlContent);

      const result = await handler.processRequest('/test/file.yml');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_REQUEST_FORMAT');
      }
    });
  });

  describe('response creation', () => {
    it('should create routing response with agent selection', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.createResponse(mockRequest, mockAgents);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.routing_id).toBe(mockRequest.routing_id);
        expect(result.data.selected_agents.length).toBeGreaterThan(0);
        expect(result.data.execution_plan.length).toBeGreaterThan(0);
        expect(result.data.workflow_type).toBeDefined();
        expect(result.data.estimated_time).toBeDefined();
      }
    });

    it('should handle empty agent list', async () => {
      const result = await handler.createResponse(mockRequest, []);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NO_AGENTS_AVAILABLE');
      }
    });

    it('should save response to status directory', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.createResponse(mockRequest, mockAgents);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/routing/status/'),
        expect.stringContaining('routing_id'),
        'utf-8'
      );
    });

    it('should handle file write errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      const result = await handler.createResponse(mockRequest, mockAgents);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('FILE_WRITE_ERROR');
      }
    });

    it('should create execution plan based on command', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.createResponse(mockRequest, mockAgents);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.execution_plan.length).toBeGreaterThan(0);
        
        // Should have steps for both backend and QA
        const steps = result.data.execution_plan;
        expect(steps.some(step => step.agent === 'backend-engineer' as RegistryId)).toBe(true);
        expect(steps.some(step => step.agent === 'qa-engineer' as RegistryId)).toBe(true);
      }
    });
  });

  describe('status updates', () => {
    it('should update routing status successfully', async () => {
      const existingResponse: RoutingResponse = {
        routing_id: mockRequest.routing_id,
        status: 'in_progress',
        progress: 50,
        workflow_type: 'rapid_response',
        estimated_time: '15 minutes',
        start_time: '2025-08-27T14:30:52Z',
        selected_agents: ['backend-engineer' as RegistryId],
        execution_plan: [
          {
            agent: 'backend-engineer' as RegistryId,
            task: 'Fix payment button issue',
            status: 'in_progress',
            dependencies: []
          }
        ]
      };

      mockedFs.readFile.mockResolvedValue(yamlStringify(existingResponse));
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.updateStatus(mockRequest.routing_id, 'completed', 100);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`/test/routing/status/${mockRequest.routing_id}.yml`),
        expect.stringContaining('status: completed'),
        'utf-8'
      );
    });

    it('should handle missing status file', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('ENOENT: no such file'));

      const result = await handler.updateStatus(mockRequest.routing_id, 'completed');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('STATUS_FILE_NOT_FOUND');
      }
    });

    it('should update progress if provided', async () => {
      const existingResponse: RoutingResponse = {
        routing_id: mockRequest.routing_id,
        status: 'in_progress',
        progress: 30,
        workflow_type: 'rapid_response',
        estimated_time: '15 minutes',
        start_time: '2025-08-27T14:30:52Z',
        selected_agents: ['backend-engineer' as RegistryId],
        execution_plan: []
      };

      mockedFs.readFile.mockResolvedValue(yamlStringify(existingResponse));
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.updateStatus(mockRequest.routing_id, 'in_progress', 75);

      expect(result.success).toBe(true);

      // Check that progress was updated in the written file
      const writeCall = mockedFs.writeFile.mock.calls[0];
      const writtenContent = writeCall[1] as string;
      expect(writtenContent).toContain('progress: 75');
    });

    it('should move completed requests to history', async () => {
      const completedResponse: RoutingResponse = {
        routing_id: mockRequest.routing_id,
        status: 'in_progress',
        progress: 90,
        workflow_type: 'rapid_response',
        estimated_time: '15 minutes',
        start_time: '2025-08-27T14:30:52Z',
        selected_agents: ['backend-engineer' as RegistryId],
        execution_plan: []
      };

      mockedFs.readFile.mockResolvedValue(yamlStringify(completedResponse));
      mockedFs.writeFile.mockResolvedValue(undefined);
      jest.spyOn(mockedFs, 'rename').mockResolvedValue(undefined);

      const result = await handler.updateStatus(mockRequest.routing_id, 'completed', 100);

      expect(result.success).toBe(true);
      
      // Should move file from status to history
      expect(mockedFs.rename).toHaveBeenCalledWith(
        expect.stringContaining('/test/routing/status/'),
        expect.stringContaining('/test/routing/history/')
      );
    });
  });

  describe('error handling', () => {
    it('should handle corrupted status files', async () => {
      mockedFs.readFile.mockResolvedValue('invalid yaml content: [[[unclosed brackets and: bad: indentation\n  - invalid\nkey');

      const result = await handler.updateStatus(mockRequest.routing_id, 'completed');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('YAML_PARSE_ERROR');
      }
    });

    it('should handle agent selection failures gracefully', async () => {
      // Mock agents that don't match the request
      const unsuitableAgents: ReadonlyArray<AgentConfig> = [
        {
          id: 'design-agent' as RegistryId,
          name: 'Design Agent',
          team: 'design',
          specializations: ['ui', 'ux'],
          availability: 'busy',
          performance_metrics: {
            success_rate: 0.80,
            avg_response_time: '1 hour',
            current_workload: 8,
            completed_tasks: 50,
            last_seen: '2025-08-27T10:00:00Z'
          },
          metadata: {}
        }
      ];

      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.createResponse(mockRequest, unsuitableAgents);

      // Should still create a response, even with less suitable agents
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.selected_agents.length).toBeGreaterThan(0);
      }
    });

    it('should validate routing request fields', async () => {
      const incompleteRequest = {
        routing_id: '2025-08-27-143052-fix-bug-payment',
        timestamp: '2025-08-27T14:30:52Z',
        // Missing command, context, etc.
      };
      
      mockedFs.readFile.mockResolvedValue(yamlStringify(incompleteRequest));

      const result = await handler.processRequest('/test/file.yml');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_REQUEST_FORMAT');
        expect(result.error.message).toContain('Missing required field');
      }
    });
  });
});