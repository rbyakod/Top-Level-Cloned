// Conflict Resolver - Simple and Clean Phase 1 Implementation

import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse as yamlParse } from 'yaml';
import type { RegistryId } from './types';
import type { WorkflowStep, WorkflowOperationResult } from './orchestration-types';

// Conflict Types
export interface AgentConflict {
  readonly conflict_id: string;
  readonly step_id: string;
  readonly conflicting_agents: ReadonlyArray<RegistryId>;
  readonly conflict_type: ConflictType;
  readonly description: string;
  readonly created_at: Date;
}

export type ConflictType = 
  | 'resource_contention'    // Multiple agents want same resource
  | 'contradictory_output'   // Agents provide conflicting recommendations
  | 'priority_collision'     // Steps with same priority compete
  | 'dependency_violation';  // Agent tries to run before dependency complete

export interface ConflictResolution {
  readonly conflict_id: string;
  readonly resolution_type: ResolutionType;
  readonly chosen_agent?: RegistryId;
  readonly reasoning: string;
  readonly resolved_at: Date;
}

export type ResolutionType = 
  | 'priority_based'         // Use priority rules
  | 'user_preference'        // Use user-defined preferences
  | 'agent_score'            // Use agent capability scores
  | 'random_selection'       // Last resort - random choice
  | 'sequential_execution';  // Convert to sequential execution

// Priority Rules Configuration
export interface PriorityRules {
  readonly agent_priorities: Record<RegistryId, number>; // Higher = more priority
  readonly team_priorities: Record<string, number>;      // Team-based priorities
  readonly task_type_priorities: Record<string, number>; // Task type priorities
  readonly default_priority: number;
}

export interface UserPreferences {
  readonly preferred_agents: ReadonlyArray<RegistryId>;
  readonly avoided_agents: ReadonlyArray<RegistryId>;
  readonly team_preferences: Record<string, number>;
  readonly conflict_resolution_strategy: ResolutionType;
}

export class ConflictResolver {
  private readonly priorityRulesPath: string;
  private readonly userPreferencesPath: string;
  private priorityRules: PriorityRules | null = null;
  private userPreferences: UserPreferences | null = null;

  constructor(configDirectory: string) {
    this.priorityRulesPath = join(configDirectory, 'priority-rules.yml');
    this.userPreferencesPath = join(configDirectory, 'user-preferences.yml');
  }

  // Initialize conflict resolver with configuration
  async initialize(): Promise<WorkflowOperationResult<void>> {
    try {
      await this.loadPriorityRules();
      await this.loadUserPreferences();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'CONFLICT_RESOLVER_INIT_ERROR',
          message: `Failed to initialize conflict resolver: ${error.message}`
        }
      };
    }
  }

  // Detect conflicts in workflow steps
  async detectConflicts(steps: ReadonlyArray<WorkflowStep>): Promise<ReadonlyArray<AgentConflict>> {
    const conflicts: AgentConflict[] = [];

    // Check for resource contention (agents assigned to same step)
    const stepAgentMap = new Map<string, RegistryId[]>();
    for (const step of steps) {
      if (step.status === 'assigned' || step.status === 'running') {
        const agents = stepAgentMap.get(step.step_id) || [];
        agents.push(step.agent_id);
        stepAgentMap.set(step.step_id, agents);
      }
    }

    for (const [stepId, agents] of stepAgentMap) {
      if (agents.length > 1) {
        conflicts.push({
          conflict_id: `resource-${stepId}-${Date.now()}`,
          step_id: stepId,
          conflicting_agents: agents,
          conflict_type: 'resource_contention',
          description: `Multiple agents assigned to step ${stepId}`,
          created_at: new Date()
        });
      }
    }

    // Check for priority collisions (same-priority steps competing for agents)
    const runningSteps = steps.filter(s => s.status === 'running');
    if (runningSteps.length > 8) { // Max 8 concurrent agents
      const priorities = await this.getStepPriorities(runningSteps);
      const samePriorityGroups = this.groupByPriority(priorities);
      
      for (const [priority, stepIds] of samePriorityGroups) {
        if (stepIds.length > 1) {
          const agents = stepIds.map(id => 
            steps.find(s => s.step_id === id)?.agent_id
          ).filter(Boolean) as RegistryId[];

          if (agents.length > 1) {
            conflicts.push({
              conflict_id: `priority-${priority}-${Date.now()}`,
              step_id: stepIds[0], // Representative step
              conflicting_agents: agents,
              conflict_type: 'priority_collision',
              description: `Steps with priority ${priority} competing for execution`,
              created_at: new Date()
            });
          }
        }
      }
    }

    return conflicts;
  }

  // Resolve a specific conflict
  async resolveConflict(conflict: AgentConflict): Promise<WorkflowOperationResult<ConflictResolution>> {
    try {
      const resolution = await this.applyResolutionStrategy(conflict);
      return { success: true, data: resolution };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'CONFLICT_RESOLUTION_ERROR',
          message: `Failed to resolve conflict ${conflict.conflict_id}: ${error.message}`
        }
      };
    }
  }

  // Apply resolution strategy based on conflict type and user preferences
  private async applyResolutionStrategy(conflict: AgentConflict): Promise<ConflictResolution> {
    const strategy = this.userPreferences?.conflict_resolution_strategy || 'priority_based';
    
    switch (strategy) {
      case 'priority_based':
        return this.resolvePriorityBased(conflict);
      
      case 'user_preference':
        return this.resolveUserPreference(conflict);
      
      case 'agent_score':
        return this.resolveAgentScore(conflict);
      
      case 'sequential_execution':
        return this.resolveSequentialExecution(conflict);
      
      case 'random_selection':
      default:
        return this.resolveRandomSelection(conflict);
    }
  }

  // Priority-based resolution
  private resolvePriorityBased(conflict: AgentConflict): ConflictResolution {
    let chosenAgent: RegistryId;
    let reasoning: string;

    if (!this.priorityRules) {
      // Fallback to first agent if no rules
      chosenAgent = conflict.conflicting_agents[0];
      reasoning = 'No priority rules configured, selected first agent';
    } else {
      // Select agent with highest priority
      let maxPriority = -1;
      chosenAgent = conflict.conflicting_agents[0];

      for (const agentId of conflict.conflicting_agents) {
        const priority = this.priorityRules.agent_priorities[agentId] || this.priorityRules.default_priority;
        if (priority > maxPriority) {
          maxPriority = priority;
          chosenAgent = agentId;
        }
      }

      reasoning = `Selected agent ${chosenAgent} with priority ${maxPriority}`;
    }

    return {
      conflict_id: conflict.conflict_id,
      resolution_type: 'priority_based',
      chosen_agent: chosenAgent,
      reasoning,
      resolved_at: new Date()
    };
  }

  // User preference-based resolution
  private resolveUserPreference(conflict: AgentConflict): ConflictResolution {
    if (!this.userPreferences) {
      return this.resolvePriorityBased(conflict);
    }

    // Check for preferred agents first
    for (const agentId of this.userPreferences.preferred_agents) {
      if (conflict.conflicting_agents.includes(agentId)) {
        return {
          conflict_id: conflict.conflict_id,
          resolution_type: 'user_preference',
          chosen_agent: agentId,
          reasoning: `Selected preferred agent ${agentId}`,
          resolved_at: new Date()
        };
      }
    }

    // Avoid agents in avoided list
    const availableAgents = conflict.conflicting_agents.filter(
      agentId => !this.userPreferences!.avoided_agents.includes(agentId)
    );

    if (availableAgents.length > 0) {
      const chosenAgent = availableAgents[0];
      return {
        conflict_id: conflict.conflict_id,
        resolution_type: 'user_preference',
        chosen_agent: chosenAgent,
        reasoning: `Selected ${chosenAgent}, avoiding user-specified agents`,
        resolved_at: new Date()
      };
    }

    // Fallback to priority-based
    return this.resolvePriorityBased(conflict);
  }

  // Agent score-based resolution (placeholder for integration with scoring engine)
  private resolveAgentScore(conflict: AgentConflict): ConflictResolution {
    // Phase 1: Simple implementation - select first agent
    // In full implementation, would integrate with ScoringEngine
    const chosenAgent = conflict.conflicting_agents[0];
    
    return {
      conflict_id: conflict.conflict_id,
      resolution_type: 'agent_score',
      chosen_agent: chosenAgent,
      reasoning: `Selected ${chosenAgent} based on capability scores (simplified)`,
      resolved_at: new Date()
    };
  }

  // Sequential execution resolution
  private resolveSequentialExecution(conflict: AgentConflict): ConflictResolution {
    return {
      conflict_id: conflict.conflict_id,
      resolution_type: 'sequential_execution',
      reasoning: `Converting conflicting parallel execution to sequential for step ${conflict.step_id}`,
      resolved_at: new Date()
    };
  }

  // Random selection (last resort)
  private resolveRandomSelection(conflict: AgentConflict): ConflictResolution {
    const randomIndex = Math.floor(Math.random() * conflict.conflicting_agents.length);
    const chosenAgent = conflict.conflicting_agents[randomIndex];
    
    return {
      conflict_id: conflict.conflict_id,
      resolution_type: 'random_selection',
      chosen_agent: chosenAgent,
      reasoning: `Randomly selected ${chosenAgent} as fallback resolution`,
      resolved_at: new Date()
    };
  }

  // Helper methods
  private async loadPriorityRules(): Promise<void> {
    try {
      const content = await readFile(this.priorityRulesPath, 'utf-8');
      this.priorityRules = yamlParse(content) as PriorityRules;
    } catch {
      // Use default rules if file doesn't exist
      this.priorityRules = {
        agent_priorities: {},
        team_priorities: {
          engineering: 10,
          design: 8,
          qa: 7,
          product: 6,
          marketing: 5,
          support: 4,
          operations: 3
        },
        task_type_priorities: {
          critical: 10,
          high: 8,
          medium: 5,
          low: 3
        },
        default_priority: 5
      };
    }
  }

  private async loadUserPreferences(): Promise<void> {
    try {
      const content = await readFile(this.userPreferencesPath, 'utf-8');
      this.userPreferences = yamlParse(content) as UserPreferences;
    } catch {
      // Use default preferences if file doesn't exist
      this.userPreferences = {
        preferred_agents: [],
        avoided_agents: [],
        team_preferences: {},
        conflict_resolution_strategy: 'priority_based'
      };
    }
  }

  private async getStepPriorities(steps: ReadonlyArray<WorkflowStep>): Promise<Map<string, number>> {
    const priorities = new Map<string, number>();
    
    for (const step of steps) {
      // Simple priority calculation based on agent and default rules
      const agentPriority = this.priorityRules?.agent_priorities[step.agent_id] || 
                           this.priorityRules?.default_priority || 5;
      priorities.set(step.step_id, agentPriority);
    }
    
    return priorities;
  }

  private groupByPriority(priorities: Map<string, number>): Map<number, string[]> {
    const groups = new Map<number, string[]>();
    
    for (const [stepId, priority] of priorities) {
      const group = groups.get(priority) || [];
      group.push(stepId);
      groups.set(priority, group);
    }
    
    return groups;
  }
}