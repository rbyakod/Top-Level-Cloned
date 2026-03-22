// Dependency Manager - Simple and Clean Phase 1 Implementation

import type { WorkflowStep, WorkflowDefinition } from './orchestration-types';

export interface DependencyGraph {
  readonly nodes: ReadonlyArray<string>; // step_ids
  readonly edges: ReadonlyArray<DependencyEdge>; // dependencies
}

export interface DependencyEdge {
  readonly from: string; // step_id that must complete first
  readonly to: string;   // step_id that depends on 'from'
}

export interface ExecutionPlan {
  readonly phases: ReadonlyArray<ExecutionPhase>;
  readonly total_estimated_duration: number; // minutes
  readonly max_parallel_steps: number;
}

export interface ExecutionPhase {
  readonly phase_number: number;
  readonly steps: ReadonlyArray<string>; // step_ids that can run in parallel
  readonly estimated_duration: number; // minutes
}

export class DependencyManager {
  // Build dependency graph from workflow steps
  buildDependencyGraph(steps: ReadonlyArray<WorkflowStep>): DependencyGraph {
    const nodes = steps.map(step => step.step_id);
    const edges: DependencyEdge[] = [];

    // Create edges from dependencies
    for (const step of steps) {
      for (const depId of step.depends_on) {
        edges.push({
          from: depId,
          to: step.step_id
        });
      }
    }

    return { nodes, edges };
  }

  // Create execution plan with phases for parallel execution
  createExecutionPlan(workflow: WorkflowDefinition): ExecutionPlan {
    const graph = this.buildDependencyGraph(workflow.steps);
    const phases = this.calculateExecutionPhases(workflow.steps, graph);
    
    const totalDuration = Math.max(...phases.map(p => p.estimated_duration));
    const maxParallel = Math.max(...phases.map(p => p.steps.length));

    return {
      phases,
      total_estimated_duration: totalDuration,
      max_parallel_steps: Math.min(maxParallel, workflow.max_parallel_agents)
    };
  }

  // Calculate execution phases (steps that can run in parallel)
  private calculateExecutionPhases(
    steps: ReadonlyArray<WorkflowStep>,
    graph: DependencyGraph
  ): ReadonlyArray<ExecutionPhase> {
    const phases: ExecutionPhase[] = [];
    const completed = new Set<string>();
    const stepMap = new Map(steps.map(s => [s.step_id, s]));

    let phaseNumber = 1;

    while (completed.size < steps.length) {
      // Find steps with no pending dependencies
      const readySteps = steps
        .filter(step => {
          if (completed.has(step.step_id)) return false;
          return step.depends_on.every(depId => completed.has(depId));
        })
        .map(step => step.step_id);

      if (readySteps.length === 0) {
        // Circular dependency detected
        throw new Error('Circular dependency detected in workflow steps');
      }

      // Calculate phase duration (max of all steps in phase)
      const phaseDuration = Math.max(
        ...readySteps.map(stepId => {
          const step = stepMap.get(stepId);
          return step?.estimated_duration || 0;
        })
      );

      phases.push({
        phase_number: phaseNumber,
        steps: readySteps,
        estimated_duration: phaseDuration
      });

      // Mark steps as completed for next iteration
      readySteps.forEach(stepId => completed.add(stepId));
      phaseNumber++;
    }

    return phases;
  }

  // Validate workflow dependencies
  validateDependencies(steps: ReadonlyArray<WorkflowStep>): {
    valid: boolean;
    errors: ReadonlyArray<string>;
  } {
    const errors: string[] = [];
    const stepIds = new Set(steps.map(s => s.step_id));

    // Check for invalid dependency references
    for (const step of steps) {
      for (const depId of step.depends_on) {
        if (!stepIds.has(depId)) {
          errors.push(`Step '${step.step_id}' depends on non-existent step '${depId}'`);
        }
      }
    }

    // Check for self-dependencies
    for (const step of steps) {
      if (step.depends_on.includes(step.step_id)) {
        errors.push(`Step '${step.step_id}' cannot depend on itself`);
      }
    }

    // Check for circular dependencies
    try {
      const graph = this.buildDependencyGraph(steps);
      this.detectCircularDependencies(graph);
    } catch (error: any) {
      errors.push(error.message);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Detect circular dependencies using DFS
  private detectCircularDependencies(graph: DependencyGraph): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    // Create adjacency list
    const adjList = new Map<string, string[]>();
    for (const node of graph.nodes) {
      adjList.set(node, []);
    }
    for (const edge of graph.edges) {
      const deps = adjList.get(edge.from) || [];
      deps.push(edge.to);
      adjList.set(edge.from, deps);
    }

    // DFS to detect cycles
    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true; // Cycle detected
        }
      }

      recursionStack.delete(node);
      return false;
    };

    // Check all nodes
    for (const node of graph.nodes) {
      if (!visited.has(node)) {
        if (dfs(node)) {
          throw new Error('Circular dependency detected in workflow');
        }
      }
    }
  }

  // Get steps ready for execution (no pending dependencies)
  getReadySteps(
    steps: ReadonlyArray<WorkflowStep>,
    completedStepIds: ReadonlyArray<string>
  ): ReadonlyArray<WorkflowStep> {
    const completedSet = new Set(completedStepIds);
    
    return steps.filter(step => {
      if (step.status !== 'pending') return false;
      return step.depends_on.every(depId => completedSet.has(depId));
    });
  }

  // Calculate critical path (longest path through dependencies)
  calculateCriticalPath(steps: ReadonlyArray<WorkflowStep>): {
    path: ReadonlyArray<string>;
    total_duration: number;
  } {
    const stepMap = new Map(steps.map(s => [s.step_id, s]));
    const graph = this.buildDependencyGraph(steps);
    
    // Topological sort to get proper order
    const sorted = this.topologicalSort(graph);
    
    // Calculate longest path using dynamic programming
    const distances = new Map<string, number>();
    const predecessors = new Map<string, string>();
    
    // Initialize distances
    for (const stepId of sorted) {
      distances.set(stepId, 0);
    }
    
    // Calculate longest paths
    for (const stepId of sorted) {
      const step = stepMap.get(stepId);
      if (!step) continue;
      
      const currentDistance = distances.get(stepId) || 0;
      const stepDuration = step.estimated_duration;
      
      // Update distances for dependent steps
      for (const edge of graph.edges) {
        if (edge.from === stepId) {
          const newDistance = currentDistance + stepDuration;
          const existingDistance = distances.get(edge.to) || 0;
          
          if (newDistance > existingDistance) {
            distances.set(edge.to, newDistance);
            predecessors.set(edge.to, stepId);
          }
        }
      }
    }
    
    // Find the step with maximum distance (end of critical path)
    let maxDistance = 0;
    let endStep = '';
    
    for (const [stepId, distance] of distances) {
      const step = stepMap.get(stepId);
      const totalDistance = distance + (step?.estimated_duration || 0);
      
      if (totalDistance > maxDistance) {
        maxDistance = totalDistance;
        endStep = stepId;
      }
    }
    
    // Reconstruct critical path
    const path: string[] = [];
    let current = endStep;
    
    while (current) {
      path.unshift(current);
      current = predecessors.get(current) || '';
    }
    
    return {
      path,
      total_duration: maxDistance
    };
  }
  
  // Topological sort helper
  private topologicalSort(graph: DependencyGraph): ReadonlyArray<string> {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();
    
    // Initialize
    for (const node of graph.nodes) {
      inDegree.set(node, 0);
      adjList.set(node, []);
    }
    
    // Build adjacency list and calculate in-degrees
    for (const edge of graph.edges) {
      const deps = adjList.get(edge.from) || [];
      deps.push(edge.to);
      adjList.set(edge.from, deps);
      
      const degree = inDegree.get(edge.to) || 0;
      inDegree.set(edge.to, degree + 1);
    }
    
    // Kahn's algorithm
    const queue: string[] = [];
    const result: string[] = [];
    
    // Add nodes with no incoming edges
    for (const [node, degree] of inDegree) {
      if (degree === 0) {
        queue.push(node);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      
      // Remove edges and update in-degrees
      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        const degree = inDegree.get(neighbor) || 0;
        inDegree.set(neighbor, degree - 1);
        
        if (degree - 1 === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }
}