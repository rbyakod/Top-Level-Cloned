import { DependencyManager } from '../dependency-manager';
import type { WorkflowStep, WorkflowDefinition } from '../orchestration-types';
import type { RegistryId, RoutingRequestId } from '../types';

describe('DependencyManager', () => {
  let dependencyManager: DependencyManager;

  beforeEach(() => {
    dependencyManager = new DependencyManager();
  });

  const createMockSteps = (stepConfigs: Array<{
    id: string;
    agent: string;
    deps: string[];
    duration: number;
  }>): WorkflowStep[] => {
    return stepConfigs.map(config => ({
      step_id: config.id,
      agent_id: config.agent as RegistryId,
      task_description: `Task for ${config.id}`,
      depends_on: config.deps,
      estimated_duration: config.duration,
      status: 'pending'
    }));
  };

  describe('dependency graph building', () => {
    it('should build dependency graph from steps', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['step1'], duration: 15 },
        { id: 'step3', agent: 'agent3', deps: ['step1'], duration: 20 }
      ]);

      const graph = dependencyManager.buildDependencyGraph(steps);

      expect(graph.nodes).toEqual(['step1', 'step2', 'step3']);
      expect(graph.edges).toHaveLength(2);
      expect(graph.edges).toContainEqual({ from: 'step1', to: 'step2' });
      expect(graph.edges).toContainEqual({ from: 'step1', to: 'step3' });
    });

    it('should handle steps with no dependencies', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: [], duration: 15 }
      ]);

      const graph = dependencyManager.buildDependencyGraph(steps);

      expect(graph.nodes).toEqual(['step1', 'step2']);
      expect(graph.edges).toHaveLength(0);
    });

    it('should handle complex dependency chains', () => {
      const steps = createMockSteps([
        { id: 'A', agent: 'agent1', deps: [], duration: 10 },
        { id: 'B', agent: 'agent2', deps: ['A'], duration: 15 },
        { id: 'C', agent: 'agent3', deps: ['B'], duration: 20 },
        { id: 'D', agent: 'agent4', deps: ['B', 'A'], duration: 25 }
      ]);

      const graph = dependencyManager.buildDependencyGraph(steps);

      expect(graph.nodes).toHaveLength(4);
      expect(graph.edges).toHaveLength(4);
      expect(graph.edges).toContainEqual({ from: 'A', to: 'B' });
      expect(graph.edges).toContainEqual({ from: 'B', to: 'C' });
      expect(graph.edges).toContainEqual({ from: 'B', to: 'D' });
      expect(graph.edges).toContainEqual({ from: 'A', to: 'D' });
    });
  });

  describe('execution plan creation', () => {
    it('should create execution plan with phases', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['step1'], duration: 15 },
        { id: 'step3', agent: 'agent3', deps: ['step1'], duration: 20 },
        { id: 'step4', agent: 'agent4', deps: ['step2', 'step3'], duration: 25 }
      ]);

      const workflow: WorkflowDefinition = {
        workflow_id: 'test-workflow' as any,
        routing_id: 'test-routing' as RoutingRequestId,
        name: 'Test Workflow',
        description: 'Test',
        steps,
        max_parallel_agents: 8,
        status: 'pending',
        created_at: new Date(),
        progress: 0
      };

      const plan = dependencyManager.createExecutionPlan(workflow);

      expect(plan.phases).toHaveLength(3);
      
      // Phase 1: step1 (no dependencies)
      expect(plan.phases[0].steps).toEqual(['step1']);
      expect(plan.phases[0].estimated_duration).toBe(10);
      
      // Phase 2: step2, step3 (depend on step1)
      expect(plan.phases[1].steps).toContain('step2');
      expect(plan.phases[1].steps).toContain('step3');
      expect(plan.phases[1].estimated_duration).toBe(20); // max(15, 20)
      
      // Phase 3: step4 (depends on step2 and step3)
      expect(plan.phases[2].steps).toEqual(['step4']);
      expect(plan.phases[2].estimated_duration).toBe(25);
    });

    it('should handle parallel execution limits', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: [], duration: 15 },
        { id: 'step3', agent: 'agent3', deps: [], duration: 20 }
      ]);

      const workflow: WorkflowDefinition = {
        workflow_id: 'parallel-test' as any,
        routing_id: 'parallel-routing' as RoutingRequestId,
        name: 'Parallel Test',
        description: 'Test parallel limits',
        steps,
        max_parallel_agents: 2, // Limited to 2 agents
        status: 'pending',
        created_at: new Date(),
        progress: 0
      };

      const plan = dependencyManager.createExecutionPlan(workflow);

      expect(plan.max_parallel_steps).toBe(2); // Limited by max_parallel_agents
      expect(plan.phases[0].steps).toHaveLength(3); // All steps can run in parallel
    });
  });

  describe('dependency validation', () => {
    it('should validate correct dependencies', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['step1'], duration: 15 }
      ]);

      const validation = dependencyManager.validateDependencies(steps);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid dependency references', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['nonexistent'], duration: 15 }
      ]);

      const validation = dependencyManager.validateDependencies(steps);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        "Step 'step2' depends on non-existent step 'nonexistent'"
      );
    });

    it('should detect self-dependencies', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: ['step1'], duration: 10 }
      ]);

      const validation = dependencyManager.validateDependencies(steps);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        "Step 'step1' cannot depend on itself"
      );
    });

    it('should detect circular dependencies', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: ['step2'], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['step1'], duration: 15 }
      ]);

      const validation = dependencyManager.validateDependencies(steps);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should handle complex circular dependencies', () => {
      const steps = createMockSteps([
        { id: 'A', agent: 'agent1', deps: ['C'], duration: 10 },
        { id: 'B', agent: 'agent2', deps: ['A'], duration: 15 },
        { id: 'C', agent: 'agent3', deps: ['B'], duration: 20 }
      ]);

      const validation = dependencyManager.validateDependencies(steps);

      expect(validation.valid).toBe(false);
    });
  });

  describe('ready steps identification', () => {
    it('should identify steps ready for execution', () => {
      const initialSteps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: ['step1'], duration: 15 },
        { id: 'step3', agent: 'agent3', deps: ['step1'], duration: 20 },
        { id: 'step4', agent: 'agent4', deps: ['step2', 'step3'], duration: 25 }
      ]);

      // Initially, only step1 should be ready
      let readySteps = dependencyManager.getReadySteps(initialSteps, []);
      expect(readySteps.map(s => s.step_id)).toEqual(['step1']);

      // Simulate step1 completion
      const stepsAfterStep1 = initialSteps.map(step => 
        step.step_id === 'step1' ? { ...step, status: 'completed' as const } : step
      );
      
      // After step1 completes, step2 and step3 should be ready
      readySteps = dependencyManager.getReadySteps(stepsAfterStep1, ['step1']);
      expect(readySteps.map(s => s.step_id)).toContain('step2');
      expect(readySteps.map(s => s.step_id)).toContain('step3');
      expect(readySteps).toHaveLength(2);

      // Simulate step2 and step3 completion
      const stepsAfterStep2And3 = stepsAfterStep1.map(step => 
        ['step2', 'step3'].includes(step.step_id) ? { ...step, status: 'completed' as const } : step
      );

      // After step2 and step3 complete, step4 should be ready  
      readySteps = dependencyManager.getReadySteps(stepsAfterStep2And3, ['step1', 'step2', 'step3']);
      expect(readySteps.map(s => s.step_id)).toEqual(['step4']);
    });

    it('should not include non-pending steps', () => {
      const steps: WorkflowStep[] = [
        {
          step_id: 'step1',
          agent_id: 'agent1' as RegistryId,
          task_description: 'Step 1',
          depends_on: [],
          estimated_duration: 10,
          status: 'completed' // Already completed
        },
        {
          step_id: 'step2',
          agent_id: 'agent2' as RegistryId,
          task_description: 'Step 2',
          depends_on: [],
          estimated_duration: 15,
          status: 'pending'
        }
      ];

      const readySteps = dependencyManager.getReadySteps(steps, []);
      
      expect(readySteps).toHaveLength(1);
      expect(readySteps[0].step_id).toBe('step2');
    });
  });

  describe('critical path calculation', () => {
    it('should calculate critical path correctly', () => {
      const steps = createMockSteps([
        { id: 'A', agent: 'agent1', deps: [], duration: 10 },
        { id: 'B', agent: 'agent2', deps: ['A'], duration: 20 },
        { id: 'C', agent: 'agent3', deps: ['A'], duration: 15 },
        { id: 'D', agent: 'agent4', deps: ['B', 'C'], duration: 25 }
      ]);

      const criticalPath = dependencyManager.calculateCriticalPath(steps);

      expect(criticalPath.path).toEqual(['A', 'B', 'D']);
      expect(criticalPath.total_duration).toBe(55); // 10 + 20 + 25
    });

    it('should handle single step workflow', () => {
      const steps = createMockSteps([
        { id: 'single', agent: 'agent1', deps: [], duration: 30 }
      ]);

      const criticalPath = dependencyManager.calculateCriticalPath(steps);

      expect(criticalPath.path).toEqual(['single']);
      expect(criticalPath.total_duration).toBe(30);
    });

    it('should handle parallel paths', () => {
      const steps = createMockSteps([
        { id: 'start', agent: 'agent1', deps: [], duration: 5 },
        { id: 'path1', agent: 'agent2', deps: ['start'], duration: 10 },
        { id: 'path2', agent: 'agent3', deps: ['start'], duration: 30 },
        { id: 'end', agent: 'agent4', deps: ['path1', 'path2'], duration: 5 }
      ]);

      const criticalPath = dependencyManager.calculateCriticalPath(steps);

      expect(criticalPath.path).toEqual(['start', 'path2', 'end']);
      expect(criticalPath.total_duration).toBe(40); // 5 + 30 + 5
    });
  });

  describe('edge cases', () => {
    it('should handle empty workflow', () => {
      const steps: WorkflowStep[] = [];
      
      expect(() => {
        dependencyManager.buildDependencyGraph(steps);
      }).not.toThrow();
      
      const graph = dependencyManager.buildDependencyGraph(steps);
      expect(graph.nodes).toHaveLength(0);
      expect(graph.edges).toHaveLength(0);
    });

    it('should handle workflow with only independent steps', () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', deps: [], duration: 10 },
        { id: 'step2', agent: 'agent2', deps: [], duration: 15 },
        { id: 'step3', agent: 'agent3', deps: [], duration: 20 }
      ]);

      const readySteps = dependencyManager.getReadySteps(steps, []);
      expect(readySteps).toHaveLength(3);
      
      const validation = dependencyManager.validateDependencies(steps);
      expect(validation.valid).toBe(true);
    });

    it('should detect cycles in larger graphs', () => {
      const steps = createMockSteps([
        { id: 'A', agent: 'agent1', deps: ['E'], duration: 10 },
        { id: 'B', agent: 'agent2', deps: ['A'], duration: 15 },
        { id: 'C', agent: 'agent3', deps: ['B'], duration: 20 },
        { id: 'D', agent: 'agent4', deps: ['C'], duration: 25 },
        { id: 'E', agent: 'agent5', deps: ['D'], duration: 30 }
      ]);

      expect(() => {
        dependencyManager.validateDependencies(steps);
      }).not.toThrow();
      
      const validation = dependencyManager.validateDependencies(steps);
      expect(validation.valid).toBe(false);
    });
  });
});