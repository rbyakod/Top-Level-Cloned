import { WorkflowOrchestrator } from '../workflow-orchestrator';
import type { 
  WorkflowDirectories, 
  WorkflowDefinition,
  WorkflowStep,
  WorkflowId
} from '../orchestration-types';
import type { RoutingRequestId, RegistryId } from '../types';
import { jest } from '@jest/globals';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('WorkflowOrchestrator', () => {
  let orchestrator: WorkflowOrchestrator;
  let mockDirectories: WorkflowDirectories;

  beforeEach(() => {
    mockDirectories = {
      workflows: '/test/workflows',
      active: '/test/workflows/active',
      completed: '/test/workflows/completed',
      failed: '/test/workflows/failed'
    };

    orchestrator = new WorkflowOrchestrator(mockDirectories);

    // Mock all fs operations
    mockedFs.writeFile = jest.fn().mockResolvedValue(undefined);
    mockedFs.readFile = jest.fn();
    
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await orchestrator.shutdown();
  });

  describe('workflow creation', () => {
    it('should create a workflow successfully', async () => {
      const routingId = '2025-08-28-140000-test-task' as RoutingRequestId;
      const steps = [
        {
          step_id: 'step1',
          agent_id: 'backend-engineer' as RegistryId,
          task_description: 'Implement API endpoint',
          depends_on: [],
          estimated_duration: 30
        },
        {
          step_id: 'step2',
          agent_id: 'frontend-engineer' as RegistryId,
          task_description: 'Create UI component',
          depends_on: ['step1'],
          estimated_duration: 45
        }
      ];

      const result = await orchestrator.createWorkflow(
        routingId,
        'Test Workflow',
        'A test workflow for validation',
        steps
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.success && result.data) {
        expect(result.data.name).toBe('Test Workflow');
        expect(result.data.steps).toHaveLength(2);
        expect(result.data.status).toBe('pending');
        expect(result.data.max_parallel_agents).toBe(2);
      }

      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/workflows/active/'),
        expect.stringContaining('workflow_id:'),
        'utf-8'
      );
    });

    it('should handle workflow creation errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('File write failed'));

      const routingId = '2025-08-28-140000-test-task' as RoutingRequestId;
      const steps = [
        {
          step_id: 'step1',
          agent_id: 'backend-engineer' as RegistryId,
          task_description: 'Test step',
          depends_on: [],
          estimated_duration: 30
        }
      ];

      const result = await orchestrator.createWorkflow(
        routingId,
        'Test Workflow',
        'Description',
        steps
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_CREATE_ERROR');
    });

    it('should limit max parallel agents to 8', async () => {
      const routingId = '2025-08-28-140000-test-task' as RoutingRequestId;
      const steps = Array.from({ length: 10 }, (_, i) => ({
        step_id: `step${i + 1}`,
        agent_id: `agent${i + 1}` as RegistryId,
        task_description: `Step ${i + 1}`,
        depends_on: [],
        estimated_duration: 15
      }));

      const result = await orchestrator.createWorkflow(
        routingId,
        'Large Workflow',
        'Workflow with many steps',
        steps
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.max_parallel_agents).toBe(8);
      }
    });
  });

  describe('workflow execution', () => {
    let mockWorkflow: WorkflowDefinition;

    beforeEach(() => {
      const workflowId = 'workflow-test-123' as WorkflowId;
      
      mockWorkflow = {
        workflow_id: workflowId,
        routing_id: '2025-08-28-140000-test' as RoutingRequestId,
        name: 'Test Workflow',
        description: 'Test workflow',
        steps: [
          {
            step_id: 'step1',
            agent_id: 'agent1' as RegistryId,
            task_description: 'First step',
            depends_on: [],
            estimated_duration: 10,
            status: 'pending'
          },
          {
            step_id: 'step2',
            agent_id: 'agent2' as RegistryId,
            task_description: 'Second step',
            depends_on: ['step1'],
            estimated_duration: 15,
            status: 'pending'
          }
        ],
        max_parallel_agents: 2,
        status: 'pending',
        created_at: new Date(),
        progress: 0
      };
    });

    it('should start workflow execution', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockWorkflow));

      const result = await orchestrator.startWorkflow(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should handle missing workflow', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await orchestrator.startWorkflow('nonexistent' as WorkflowId);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_NOT_FOUND');
    });

    it('should handle workflow start errors', async () => {
      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockWorkflow));
      mockedFs.writeFile.mockRejectedValue(new Error('Write failed'));

      const result = await orchestrator.startWorkflow(mockWorkflow.workflow_id);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_START_ERROR');
    });
  });

  describe('progress tracking', () => {
    it('should get workflow progress', async () => {
      const workflowId = 'workflow-progress-test' as WorkflowId;
      const mockProgress = {
        workflow_id: workflowId,
        status: 'running',
        progress: 50,
        running_steps: ['step1'],
        completed_steps: ['step0'],
        failed_steps: [],
        last_updated: new Date()
      };

      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockProgress));

      const result = await orchestrator.getWorkflowProgress(workflowId);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.success && result.data) {
        expect(result.data.workflow_id).toBe(workflowId);
        expect(result.data.progress).toBe(50);
      }
    });

    it('should handle progress not found', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await orchestrator.getWorkflowProgress('nonexistent' as WorkflowId);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PROGRESS_NOT_FOUND');
    });
  });

  describe('workflow lifecycle', () => {
    it('should handle rapid start/stop cycles', async () => {
      const mockWorkflow = {
        workflow_id: 'lifecycle-test' as WorkflowId,
        routing_id: '2025-08-28-lifecycle' as RoutingRequestId,
        name: 'Lifecycle Test',
        description: 'Test lifecycle',
        steps: [
          {
            step_id: 'step1',
            agent_id: 'agent1' as RegistryId,
            task_description: 'Test step',
            depends_on: [],
            estimated_duration: 5,
            status: 'pending' as const
          }
        ],
        max_parallel_agents: 1,
        status: 'pending' as const,
        created_at: new Date(),
        progress: 0
      };

      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockWorkflow));

      // Start workflow
      let result = await orchestrator.startWorkflow(mockWorkflow.workflow_id);
      expect(result.success).toBe(true);

      // Shutdown should clean up properly
      await orchestrator.shutdown();
      
      // Should be able to create new orchestrator
      const newOrchestrator = new WorkflowOrchestrator(mockDirectories);
      await newOrchestrator.shutdown();
    });

    it('should cleanup resources on shutdown', async () => {
      // Start some workflows to create internal state
      const routingId = '2025-08-28-cleanup' as RoutingRequestId;
      const steps = [
        {
          step_id: 'cleanup-step',
          agent_id: 'agent1' as RegistryId,
          task_description: 'Cleanup test',
          depends_on: [],
          estimated_duration: 1
        }
      ];

      await orchestrator.createWorkflow(
        routingId,
        'Cleanup Test',
        'Test cleanup',
        steps
      );

      // Shutdown should not throw
      expect(async () => {
        await orchestrator.shutdown();
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Disk full'));

      const routingId = '2025-08-28-error-test' as RoutingRequestId;
      const steps = [
        {
          step_id: 'error-step',
          agent_id: 'agent1' as RegistryId,
          task_description: 'Error test',
          depends_on: [],
          estimated_duration: 1
        }
      ];

      const result = await orchestrator.createWorkflow(
        routingId,
        'Error Test',
        'Test error handling',
        steps
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Disk full');
    });

    it('should handle malformed workflow data', async () => {
      mockedFs.readFile.mockResolvedValue('invalid yaml content');

      const result = await orchestrator.startWorkflow('malformed' as WorkflowId);

      expect(result.success).toBe(false);
    });
  });

  describe('parallel execution limits', () => {
    it('should respect max parallel agents limit', async () => {
      const steps = Array.from({ length: 5 }, (_, i) => ({
        step_id: `parallel-step-${i}`,
        agent_id: `agent-${i}` as RegistryId,
        task_description: `Parallel step ${i}`,
        depends_on: [], // All can run in parallel
        estimated_duration: 10
      }));

      const routingId = '2025-08-28-parallel-test' as RoutingRequestId;
      const result = await orchestrator.createWorkflow(
        routingId,
        'Parallel Test',
        'Test parallel limits',
        steps
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.max_parallel_agents).toBe(5); // Should be min(5, 8)
        expect(result.data.steps).toHaveLength(5);
      }
    });

    it('should handle workflows with dependencies', async () => {
      const steps = [
        {
          step_id: 'root',
          agent_id: 'agent1' as RegistryId,
          task_description: 'Root step',
          depends_on: [],
          estimated_duration: 10
        },
        {
          step_id: 'child1',
          agent_id: 'agent2' as RegistryId,
          task_description: 'Child 1',
          depends_on: ['root'],
          estimated_duration: 15
        },
        {
          step_id: 'child2',
          agent_id: 'agent3' as RegistryId,
          task_description: 'Child 2',
          depends_on: ['root'],
          estimated_duration: 12
        }
      ];

      const routingId = '2025-08-28-dependency-test' as RoutingRequestId;
      const result = await orchestrator.createWorkflow(
        routingId,
        'Dependency Test',
        'Test with dependencies',
        steps
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.steps).toHaveLength(3);
        
        const rootStep = result.data.steps.find(s => s.step_id === 'root');
        const child1Step = result.data.steps.find(s => s.step_id === 'child1');
        const child2Step = result.data.steps.find(s => s.step_id === 'child2');
        
        expect(rootStep?.depends_on).toEqual([]);
        expect(child1Step?.depends_on).toEqual(['root']);
        expect(child2Step?.depends_on).toEqual(['root']);
      }
    });
  });
});