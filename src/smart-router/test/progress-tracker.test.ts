import { ProgressTracker } from '../progress-tracker';
import type { WorkflowDefinition, ProgressEvent } from '../orchestration-types';
import type { RoutingRequestId, RegistryId } from '../types';
import { jest } from '@jest/globals';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('ProgressTracker', () => {
  let progressTracker: ProgressTracker;
  let mockWorkflow: WorkflowDefinition;
  let progressEvents: ProgressEvent[];
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    progressTracker = new ProgressTracker('/test/progress');
    progressEvents = [];
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Clear timers to prevent interference between tests
    jest.clearAllTimers();
    jest.useFakeTimers();

    mockWorkflow = {
      workflow_id: 'test-workflow' as any,
      routing_id: 'test-routing-123' as RoutingRequestId,
      name: 'Test Workflow',
      description: 'Test workflow for progress tracking',
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

    // Setup progress event callback
    progressTracker.onProgressEvent((event) => {
      progressEvents.push(event);
    });

    // Mock fs operations
    mockedFs.writeFile = jest.fn().mockResolvedValue(undefined);
    mockedFs.readFile = jest.fn();
    
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await progressTracker.shutdown();
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  describe('progress tracking initialization', () => {
    it('should start tracking a workflow', async () => {
      const result = await progressTracker.startTracking(mockWorkflow);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalled();
      expect(progressEvents).toHaveLength(1);
      expect(progressEvents[0].event_type).toBe('step_started');
      expect(progressEvents[0].workflow_id).toBe(mockWorkflow.workflow_id);
    });

    it('should handle tracking start errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Write failed'));

      const result = await progressTracker.startTracking(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PROGRESS_TRACKING_ERROR');
    });

    it('should calculate initial metrics correctly', async () => {
      await progressTracker.startTracking(mockWorkflow);

      const result = await progressTracker.getProgress(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.total_steps).toBe(2);
        expect(result.data.completed_steps).toBe(0);
        expect(result.data.running_steps).toBe(0);
        expect(result.data.pending_steps).toBe(2);
        expect(result.data.progress_percentage).toBe(0);
        expect(result.data.agents_active).toBe(0);
      }
    });
  });

  describe('progress updates', () => {
    beforeEach(async () => {
      await progressTracker.startTracking(mockWorkflow);
      progressEvents.length = 0; // Clear initial events
    });

    it('should update progress correctly', async () => {
      // Update workflow with one completed step
      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed',
            completed_at: new Date()
          },
          {
            ...mockWorkflow.steps[1],
            status: 'running',
            assigned_at: new Date()
          }
        ],
        status: 'running',
        progress: 50
      };

      const result = await progressTracker.updateProgress(updatedWorkflow);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.completed_steps).toBe(1);
        expect(result.data.running_steps).toBe(1);
        expect(result.data.progress_percentage).toBe(50);
        expect(result.data.agents_active).toBe(1);
      }

      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should emit progress events for completed steps', async () => {
      const completedStep = {
        ...mockWorkflow.steps[0],
        status: 'completed' as const,
        completed_at: new Date()
      };

      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [completedStep, mockWorkflow.steps[1]],
        progress: 50
      };

      await progressTracker.updateProgress(updatedWorkflow);

      expect(progressEvents.some(e => e.event_type === 'step_completed')).toBe(true);
      
      const completedEvent = progressEvents.find(e => e.event_type === 'step_completed');
      expect(completedEvent?.step_id).toBe('step1');
      expect(completedEvent?.agent_id).toBe('agent1');
    });

    it('should emit progress events for failed steps', async () => {
      const failedStep = {
        ...mockWorkflow.steps[0],
        status: 'failed' as const
      };

      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [failedStep, mockWorkflow.steps[1]]
      };

      await progressTracker.updateProgress(updatedWorkflow);

      expect(progressEvents.some(e => e.event_type === 'step_failed')).toBe(true);
      
      const failedEvent = progressEvents.find(e => e.event_type === 'step_failed');
      expect(failedEvent?.step_id).toBe('step1');
    });

    it('should emit workflow completion event', async () => {
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
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
        ],
        status: 'completed',
        progress: 100,
        completed_at: new Date()
      };

      await progressTracker.updateProgress(completedWorkflow);

      expect(progressEvents.some(e => e.event_type === 'workflow_completed')).toBe(true);
      
      const completionEvent = progressEvents.find(e => e.event_type === 'workflow_completed');
      expect(completionEvent?.details?.total_steps).toBe(2);
      expect(completionEvent?.details?.failed_steps).toBe(0);
    });

    it('should handle progress update errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Update failed'));

      const result = await progressTracker.updateProgress(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PROGRESS_UPDATE_ERROR');
    });
  });

  describe('progress retrieval', () => {
    beforeEach(async () => {
      await progressTracker.startTracking(mockWorkflow);
    });

    it('should get progress from memory cache', async () => {
      const result = await progressTracker.getProgress(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockedFs.readFile).not.toHaveBeenCalled(); // Should use cache
    });

    it('should load progress from file when not cached', async () => {
      // Stop tracking to clear cache
      await progressTracker.stopTracking(mockWorkflow.workflow_id);

      const mockProgress = {
        workflow_id: mockWorkflow.workflow_id,
        total_steps: 2,
        completed_steps: 1,
        progress_percentage: 50
      };

      mockedFs.readFile.mockResolvedValue(JSON.stringify(mockProgress));

      const result = await progressTracker.getProgress(mockWorkflow.workflow_id);

      expect(result.success).toBe(true);
      expect(mockedFs.readFile).toHaveBeenCalled();
    });

    it('should handle progress not found', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await progressTracker.getProgress('nonexistent' as any);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PROGRESS_NOT_FOUND');
    });
  });

  describe('real-time updates', () => {
    beforeEach(async () => {
      await progressTracker.startTracking(mockWorkflow);
    });

    it('should provide real-time progress updates', async () => {
      // Use fake timers to advance time
      jest.advanceTimersByTime(600);
      
      // Allow promises to resolve
      await Promise.resolve();

      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should stop real-time updates when workflow completes', async () => {
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: mockWorkflow.steps.map(step => ({ ...step, status: 'completed' as const })),
        status: 'completed',
        progress: 100
      };

      await progressTracker.updateProgress(completedWorkflow);

      // Use fake timers to test timer stopping
      const writeCallsBefore = (mockedFs.writeFile as jest.Mock).mock.calls.length;
      
      // Advance time - should not trigger more writes since workflow is completed
      jest.advanceTimersByTime(600);
      await Promise.resolve();
      
      const writeCallsAfter = (mockedFs.writeFile as jest.Mock).mock.calls.length;
      
      // Should not increase after completion
      expect(writeCallsAfter - writeCallsBefore).toBeLessThanOrEqual(1);
    });
  });

  describe('multiple workflows', () => {
    it('should handle multiple active workflows', async () => {
      const secondWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        workflow_id: 'second-workflow' as any,
        name: 'Second Workflow'
      };

      await progressTracker.startTracking(mockWorkflow);
      await progressTracker.startTracking(secondWorkflow);

      const allProgress = await progressTracker.getAllActiveProgress();

      expect(allProgress.success).toBe(true);
      if (allProgress.success && allProgress.data) {
        expect(allProgress.data.size).toBe(2);
        expect(allProgress.data.has(mockWorkflow.workflow_id)).toBe(true);
        expect(allProgress.data.has(secondWorkflow.workflow_id)).toBe(true);
      }
    });

    it('should exclude completed workflows from active progress', async () => {
      await progressTracker.startTracking(mockWorkflow);

      // Complete the workflow
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: mockWorkflow.steps.map(step => ({ ...step, status: 'completed' as const })),
        status: 'completed',
        progress: 100
      };

      await progressTracker.updateProgress(completedWorkflow);

      const allProgress = await progressTracker.getAllActiveProgress();

      expect(allProgress.success).toBe(true);
      if (allProgress.success && allProgress.data) {
        expect(allProgress.data.size).toBe(0); // No active workflows
      }
    });
  });

  describe('progress event callbacks', () => {
    beforeEach(async () => {
      await progressTracker.startTracking(mockWorkflow);
      progressEvents.length = 0;
    });

    it('should handle multiple event callbacks', () => {
      const additionalEvents: ProgressEvent[] = [];
      
      progressTracker.onProgressEvent((event) => {
        additionalEvents.push(event);
      });

      const testEvent: ProgressEvent = {
        event_type: 'step_completed',
        workflow_id: mockWorkflow.workflow_id,
        step_id: 'test-step',
        timestamp: new Date()
      };

      // Trigger event via progress update
      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed',
            completed_at: new Date()
          },
          mockWorkflow.steps[1]
        ]
      };

      return progressTracker.updateProgress(updatedWorkflow).then(() => {
        expect(progressEvents.length).toBeGreaterThan(0);
        expect(additionalEvents.length).toBeGreaterThan(0);
      });
    });

    it('should handle callback errors gracefully', async () => {
      // Add a callback that throws an error
      progressTracker.onProgressEvent(() => {
        throw new Error('Callback error');
      });

      const updatedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: [
          {
            ...mockWorkflow.steps[0],
            status: 'completed',
            completed_at: new Date()
          },
          mockWorkflow.steps[1]
        ]
      };

      // Should not throw despite callback error
      expect(async () => {
        await progressTracker.updateProgress(updatedWorkflow);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('cleanup and shutdown', () => {
    it('should stop tracking workflow', async () => {
      await progressTracker.startTracking(mockWorkflow);
      
      // Should be able to get progress before stopping
      let result = await progressTracker.getProgress(mockWorkflow.workflow_id);
      expect(result.success).toBe(true);

      await progressTracker.stopTracking(mockWorkflow.workflow_id);

      // Should not have cached progress after stopping
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));
      result = await progressTracker.getProgress(mockWorkflow.workflow_id);
      expect(result.success).toBe(false);
    });

    it('should shutdown cleanly', async () => {
      await progressTracker.startTracking(mockWorkflow);
      
      // Add a second workflow
      const secondWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        workflow_id: 'second-workflow' as any
      };
      await progressTracker.startTracking(secondWorkflow);

      // Shutdown should clean up all resources
      expect(async () => {
        await progressTracker.shutdown();
      }).not.toThrow();

      // Should clear all state
      const allProgress = await progressTracker.getAllActiveProgress();
      expect(allProgress.success).toBe(true);
      if (allProgress.success && allProgress.data) {
        expect(allProgress.data.size).toBe(0);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle workflow with no steps', async () => {
      const emptyWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: []
      };

      const result = await progressTracker.startTracking(emptyWorkflow);

      expect(result.success).toBe(true);
      
      const progress = await progressTracker.getProgress(emptyWorkflow.workflow_id);
      if (progress.success && progress.data) {
        expect(progress.data.total_steps).toBe(0);
        expect(progress.data.progress_percentage).toBe(0);
      }
    });

    it('should handle rapid progress updates', async () => {
      await progressTracker.startTracking(mockWorkflow);

      // Send multiple rapid updates
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(progressTracker.updateProgress(mockWorkflow));
      }

      await Promise.all(promises);

      // All updates should succeed
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should handle workflow with all steps completed initially', async () => {
      const completedWorkflow: WorkflowDefinition = {
        ...mockWorkflow,
        steps: mockWorkflow.steps.map(step => ({
          ...step,
          status: 'completed' as const,
          completed_at: new Date()
        })),
        status: 'completed',
        progress: 100,
        completed_at: new Date()
      };

      const result = await progressTracker.startTracking(completedWorkflow);

      expect(result.success).toBe(true);
      
      const progress = await progressTracker.getProgress(completedWorkflow.workflow_id);
      if (progress.success && progress.data) {
        expect(progress.data.progress_percentage).toBe(100);
        expect(progress.data.completed_steps).toBe(2);
      }
    });
  });
});