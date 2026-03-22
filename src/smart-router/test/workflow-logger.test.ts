import { WorkflowLogger } from '../workflow-logger';
import type { 
  WorkflowDefinition, 
  WorkflowLogEntry, 
  ProgressEvent 
} from '../orchestration-types';
import type { RoutingRequestId, RegistryId } from '../types';
import { jest } from '@jest/globals';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('WorkflowLogger', () => {
  let logger: WorkflowLogger;
  let mockWorkflow: WorkflowDefinition;

  beforeEach(() => {
    logger = new WorkflowLogger('/test/logs', '/test/summaries');

    mockWorkflow = {
      workflow_id: 'test-workflow-123' as any,
      routing_id: 'routing-123' as RoutingRequestId,
      name: 'Test Workflow',
      description: 'A test workflow for logging',
      steps: [
        {
          step_id: 'step1',
          agent_id: 'backend-engineer' as RegistryId,
          task_description: 'Implement backend API',
          depends_on: [],
          estimated_duration: 30,
          status: 'pending'
        },
        {
          step_id: 'step2',
          agent_id: 'frontend-engineer' as RegistryId,
          task_description: 'Create UI components',
          depends_on: ['step1'],
          estimated_duration: 45,
          status: 'pending'
        }
      ],
      max_parallel_agents: 2,
      status: 'pending',
      created_at: new Date(),
      progress: 0
    };

    // Mock fs operations
    mockedFs.writeFile = jest.fn().mockResolvedValue(undefined);
    mockedFs.readFile = jest.fn();
    mockedFs.appendFile = jest.fn().mockResolvedValue(undefined);
    
    jest.clearAllMocks();
  });

  describe('workflow log creation', () => {
    it('should create initial workflow log', async () => {
      const result = await logger.createWorkflowLog(mockWorkflow);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        expect.stringContaining('# Workflow: Test Workflow'),
        'utf-8'
      );
      
      expect(mockedFs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        expect.stringContaining('WORKFLOW_CREATED'),
        'utf-8'
      );
    });

    it('should handle log creation errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Write failed'));

      const result = await logger.createWorkflowLog(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_LOG_CREATE_ERROR');
    });

    it('should include workflow metadata in initial log', async () => {
      await logger.createWorkflowLog(mockWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('Test Workflow');
      expect(logContent).toContain('test-workflow-123');
      expect(logContent).toContain('routing-123');
      expect(logContent).toContain('Max Parallel Agents:** 2');
      expect(logContent).toContain('Total Steps:** 2');
    });

    it('should include steps overview table', async () => {
      await logger.createWorkflowLog(mockWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('## Steps Overview');
      expect(logContent).toContain('| Step ID | Agent | Description |');
      expect(logContent).toContain('| step1 | backend-engineer |');
      expect(logContent).toContain('| step2 | frontend-engineer |');
      expect(logContent).toContain('30min');
      expect(logContent).toContain('45min');
    });
  });

  describe('event logging', () => {
    beforeEach(async () => {
      await logger.createWorkflowLog(mockWorkflow);
      jest.clearAllMocks();
    });

    it('should log workflow events', async () => {
      const logEntry: WorkflowLogEntry = {
        timestamp: new Date(),
        event_type: 'step_completed',
        workflow_id: mockWorkflow.workflow_id,
        step_id: 'step1',
        agent_id: 'backend-engineer' as RegistryId,
        message: 'Step completed successfully',
        details: { duration: 25 }
      };

      const result = await logger.logEvent(logEntry);

      expect(result.success).toBe(true);
      expect(mockedFs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        expect.stringContaining('STEP_COMPLETED'),
        'utf-8'
      );
    });

    it('should format log entries correctly', async () => {
      const logEntry: WorkflowLogEntry = {
        timestamp: new Date('2025-08-28T10:00:00Z'),
        event_type: 'step_assigned',
        workflow_id: mockWorkflow.workflow_id,
        step_id: 'step1',
        agent_id: 'backend-engineer' as RegistryId,
        message: 'Step assigned to agent'
      };

      await logger.logEvent(logEntry);

      const appendCall = (mockedFs.appendFile as jest.Mock).mock.calls[0];
      const logContent = appendCall[1];

      expect(logContent).toContain('### 2025-08-28T10:00:00.000Z - STEP_ASSIGNED');
      expect(logContent).toContain('[Step: step1]');
      expect(logContent).toContain('[Agent: backend-engineer]');
      expect(logContent).toContain('Step assigned to agent');
    });

    it('should include details in log entries', async () => {
      const logEntry: WorkflowLogEntry = {
        timestamp: new Date(),
        event_type: 'error',
        workflow_id: mockWorkflow.workflow_id,
        message: 'Agent execution failed',
        details: {
          error: 'Connection timeout',
          retry_count: 3,
          agent_load: 'high'
        }
      };

      await logger.logEvent(logEntry);

      const appendCall = (mockedFs.appendFile as jest.Mock).mock.calls[0];
      const logContent = appendCall[1];

      expect(logContent).toContain('**Details:**');
      expect(logContent).toContain('```json');
      expect(logContent).toContain('Connection timeout');
      expect(logContent).toContain('retry_count');
    });

    it('should handle logging errors', async () => {
      mockedFs.appendFile.mockRejectedValue(new Error('Append failed'));

      const logEntry: WorkflowLogEntry = {
        timestamp: new Date(),
        event_type: 'workflow_started',
        workflow_id: mockWorkflow.workflow_id,
        message: 'Workflow execution started'
      };

      const result = await logger.logEvent(logEntry);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_LOG_ERROR');
    });
  });

  describe('progress event logging', () => {
    beforeEach(async () => {
      await logger.createWorkflowLog(mockWorkflow);
      jest.clearAllMocks();
    });

    it('should log progress events', async () => {
      const progressEvent: ProgressEvent = {
        event_type: 'step_completed',
        workflow_id: mockWorkflow.workflow_id,
        step_id: 'step1',
        agent_id: 'backend-engineer' as RegistryId,
        timestamp: new Date(),
        details: { execution_time: 1800 }
      };

      await logger.logProgressEvent(progressEvent);

      expect(mockedFs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        expect.stringContaining('Step step1 completed successfully by agent backend-engineer'),
        'utf-8'
      );
    });

    it('should create appropriate messages for different event types', async () => {
      const events: ProgressEvent[] = [
        {
          event_type: 'step_started',
          workflow_id: mockWorkflow.workflow_id,
          step_id: 'step1',
          agent_id: 'backend-engineer' as RegistryId,
          timestamp: new Date()
        },
        {
          event_type: 'step_failed',
          workflow_id: mockWorkflow.workflow_id,
          step_id: 'step2',
          agent_id: 'frontend-engineer' as RegistryId,
          timestamp: new Date()
        },
        {
          event_type: 'workflow_completed',
          workflow_id: mockWorkflow.workflow_id,
          timestamp: new Date()
        }
      ];

      for (const event of events) {
        await logger.logProgressEvent(event);
      }

      expect(mockedFs.appendFile).toHaveBeenCalledTimes(3);
      
      const calls = (mockedFs.appendFile as jest.Mock).mock.calls;
      expect(calls[0][1]).toContain('Step step1 assigned to agent backend-engineer');
      expect(calls[1][1]).toContain('Step step2 failed on agent frontend-engineer');
      expect(calls[2][1]).toContain('Workflow execution completed');
    });
  });

  describe('workflow state updates', () => {
    beforeEach(async () => {
      await logger.createWorkflowLog(mockWorkflow);
      
      // Mock reading existing log content
      const initialLogContent = `# Workflow: Test Workflow

## Current Status

**Progress:** 0%
**Status:** pending

### Step Status
- ⏳ **step1** (backend-engineer): pending
- ⏳ **step2** (frontend-engineer): pending

## Execution Log`;

      mockedFs.readFile.mockResolvedValue(initialLogContent);
      jest.clearAllMocks();
    });

    it('should update workflow state in log', async () => {
      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        status: 'running',
        progress: 50,
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed'
          },
          {
            ...mockWorkflow.steps[1],
            status: 'running'
          }
        ]
      };

      const result = await logger.updateWorkflowState(updatedWorkflow);

      expect(result.success).toBe(true);
      expect(mockedFs.readFile).toHaveBeenCalled();
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        expect.stringContaining('**Progress:** 50%'),
        'utf-8'
      );
    });

    it('should update step status icons correctly', async () => {
      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [
          { ...mockWorkflow.steps[0], status: 'completed' },
          { ...mockWorkflow.steps[1], status: 'failed' }
        ]
      };

      await logger.updateWorkflowState(updatedWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const updatedContent = writeCall[1];

      expect(updatedContent).toContain('✅ **step1**'); // completed icon
      expect(updatedContent).toContain('❌ **step2**'); // failed icon
    });

    it('should handle state update errors', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Read failed'));

      const result = await logger.updateWorkflowState(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_STATE_UPDATE_ERROR');
    });
  });

  describe('workflow completion', () => {
    beforeEach(async () => {
      await logger.createWorkflowLog(mockWorkflow);
      jest.clearAllMocks();
    });

    it('should complete workflow log with summary', async () => {
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        status: 'completed',
        started_at: new Date('2025-08-28T10:00:00Z'),
        completed_at: new Date('2025-08-28T11:30:00Z'),
        progress: 100,
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed',
            completed_at: new Date()
          },
          {
            ...mockWorkflow.steps[1],
            status: 'completed',
            completed_at: new Date()
          }
        ]
      };

      const result = await logger.completeWorkflowLog(completedWorkflow);

      expect(result.success).toBe(true);
      
      // Should log completion event
      expect(mockedFs.appendFile).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('WORKFLOW_COMPLETED'),
        'utf-8'
      );
      
      // Should create summary file
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/summaries/test-workflow-123-summary.md'),
        expect.stringContaining('# Workflow Summary: Test Workflow'),
        'utf-8'
      );
    });

    it('should calculate workflow duration correctly', async () => {
      const startTime = new Date('2025-08-28T10:00:00Z');
      const endTime = new Date('2025-08-28T11:30:00Z'); // 90 minutes later
      
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        status: 'completed',
        started_at: startTime,
        completed_at: endTime,
        steps: mockWorkflow.steps.map(step => ({ ...step, status: 'completed' as const }))
      };

      await logger.completeWorkflowLog(completedWorkflow);

      const summaryCall = (mockedFs.writeFile as jest.Mock).mock.calls.find(
        call => call[0].includes('summary')
      );
      const summaryContent = summaryCall[1];

      expect(summaryContent).toContain('**Duration:** 90 minutes');
    });

    it('should include agent performance metrics', async () => {
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        status: 'completed',
        started_at: new Date(),
        completed_at: new Date(),
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed',
            agent_id: 'backend-engineer' as RegistryId
          },
          {
            ...mockWorkflow.steps[1],
            status: 'failed',
            agent_id: 'frontend-engineer' as RegistryId
          }
        ]
      };

      await logger.completeWorkflowLog(completedWorkflow);

      const completionCall = (mockedFs.appendFile as jest.Mock).mock.calls.find(
        call => call[1].includes('Agents Performance')
      );
      const completionContent = completionCall[1];

      expect(completionContent).toContain('**backend-engineer**: 1/1 steps (100%)');
      expect(completionContent).toContain('**frontend-engineer**: 0/1 steps (0%)');
    });

    it('should handle completion errors', async () => {
      mockedFs.appendFile.mockRejectedValue(new Error('Completion failed'));

      const result = await logger.completeWorkflowLog(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_COMPLETION_ERROR');
    });
  });

  describe('log retrieval', () => {
    beforeEach(async () => {
      await logger.createWorkflowLog(mockWorkflow);
    });

    it('should retrieve workflow log content', async () => {
      const mockLogContent = '# Workflow: Test Workflow\n\nWorkflow content here...';
      mockedFs.readFile.mockResolvedValue(mockLogContent);

      const result = await logger.getWorkflowLog(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLogContent);
      expect(mockedFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/logs/test-workflow-123.md'),
        'utf-8'
      );
    });

    it('should handle log not found', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await logger.getWorkflowLog('nonexistent' as any);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_LOG_NOT_FOUND');
    });

    it('should retrieve workflow summary', async () => {
      const mockSummaryContent = `# Workflow Summary: Test Workflow

**Status:** completed
**Duration:** 90 minutes`;

      mockedFs.readFile.mockResolvedValue(mockSummaryContent);

      const result = await logger.getWorkflowSummary(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockedFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/summaries/test-workflow-123-summary.md'),
        'utf-8'
      );
    });

    it('should handle summary not found', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Summary not found'));

      const result = await logger.getWorkflowSummary('nonexistent' as any);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_SUMMARY_NOT_FOUND');
    });
  });

  describe('markdown formatting', () => {
    it('should create proper status icons for different step statuses', async () => {
      await logger.createWorkflowLog(mockWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      // Should use pending icons initially
      expect(logContent).toContain('⏳ **step1**');
      expect(logContent).toContain('⏳ **step2**');
    });

    it('should format steps table correctly', async () => {
      await logger.createWorkflowLog(mockWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('| Step ID | Agent | Description | Dependencies | Duration |');
      expect(logContent).toContain('|---------|-------|-------------|--------------|----------|');
      expect(logContent).toContain('| step1 | backend-engineer | Implement backend API | None | 30min |');
      expect(logContent).toContain('| step2 | frontend-engineer | Create UI components | step1 | 45min |');
    });

    it('should calculate estimated duration correctly', async () => {
      await logger.createWorkflowLog(mockWorkflow);

      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('75 minutes'); // 30 + 45
    });
  });

  describe('edge cases', () => {
    it('should handle workflow with no steps', async () => {
      const emptyWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: []
      };

      const result = await logger.createWorkflowLog(emptyWorkflow);

      expect(result.success).toBe(true);
      
      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('**Total Steps:** 0');
      expect(logContent).toContain('0 minutes');
    });

    it('should handle very long step descriptions', async () => {
      const workflowWithLongDescription: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [
          {
            ...mockWorkflow.steps[0],
            task_description: 'A'.repeat(200) // Very long description
          }
        ]
      };

      const result = await logger.createWorkflowLog(workflowWithLongDescription);

      expect(result.success).toBe(true);
    });

    it('should handle special characters in workflow names', async () => {
      const specialWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        name: 'Test & "Special" Characters <Workflow>',
        description: 'Contains special chars: & < > " \''
      };

      const result = await logger.createWorkflowLog(specialWorkflow);

      expect(result.success).toBe(true);
      
      const writeCall = (mockedFs.writeFile as jest.Mock).mock.calls[0];
      const logContent = writeCall[1];

      expect(logContent).toContain('Test & "Special" Characters <Workflow>');
    });
  });
});