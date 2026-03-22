// Orchestration Engine Types - Simple and Clean Phase 1 Implementation

import type { RoutingRequestId, AgentId, RegistryId } from './types';

// Workflow Status Types
export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type AgentTaskStatus = 'pending' | 'assigned' | 'running' | 'completed' | 'failed';

// Core Workflow Types
export type WorkflowId = string & { readonly brand: unique symbol };

export interface WorkflowStep {
  readonly step_id: string;
  readonly agent_id: RegistryId;
  readonly task_description: string;
  readonly depends_on: ReadonlyArray<string>; // step_ids this depends on
  readonly estimated_duration: number; // minutes
  readonly status: AgentTaskStatus;
  readonly assigned_at?: Date;
  readonly completed_at?: Date;
  readonly output?: string;
}

export interface WorkflowDefinition {
  readonly workflow_id: WorkflowId;
  readonly routing_id: RoutingRequestId;
  readonly name: string;
  readonly description: string;
  readonly steps: ReadonlyArray<WorkflowStep>;
  readonly max_parallel_agents: number; // up to 8
  readonly status: WorkflowStatus;
  readonly created_at: Date;
  readonly started_at?: Date;
  readonly completed_at?: Date;
  readonly progress: number; // 0-100
}

// Progress Tracking Types
export interface WorkflowProgress {
  readonly workflow_id: WorkflowId;
  readonly status: WorkflowStatus;
  readonly progress: number;
  readonly running_steps: ReadonlyArray<string>;
  readonly completed_steps: ReadonlyArray<string>;
  readonly failed_steps: ReadonlyArray<string>;
  readonly last_updated: Date;
}

// Agent Execution Types - Simple interface for Phase 1
export interface AgentTask {
  readonly task_id: string;
  readonly agent_id: RegistryId;
  readonly description: string;
  readonly context: Record<string, unknown>;
  readonly status: AgentTaskStatus;
}

export interface AgentExecutionResult {
  readonly task_id: string;
  readonly agent_id: RegistryId;
  readonly success: boolean;
  readonly output?: string;
  readonly error?: string;
  readonly completed_at: Date;
}

// Directory Structure for Workflows
export interface WorkflowDirectories {
  readonly workflows: string; // .agent-os/routing/workflows/
  readonly active: string;    // .agent-os/routing/workflows/active/
  readonly completed: string; // .agent-os/routing/workflows/completed/
  readonly failed: string;    // .agent-os/routing/workflows/failed/
}

// Simple Result Types for Operations
export interface WorkflowOperationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: WorkflowError;
}

export interface WorkflowError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}