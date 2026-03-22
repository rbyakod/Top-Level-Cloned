// Communication system types for file-based agent coordination

import type { RequestId, AgentConfig, ProjectContext, UserPreferences, WorkflowType, ExpertiseArea } from './types';
import type { RegistryId } from './registry-types';

export type RoutingRequestId = string & { readonly brand: 'RoutingRequestId' };
export type MessageId = string & { readonly brand: 'MessageId' };
export type DirectoryPath = string & { readonly brand: 'DirectoryPath' };

export type RoutingStatus = 'pending' | 'processing' | 'in_progress' | 'completed' | 'failed';

export type RoutingRequest = {
  readonly routing_id: RoutingRequestId;
  readonly timestamp: string;
  readonly command: string;
  readonly context: ProjectContext;
  readonly user_preferences: UserPreferences;
  readonly status: RoutingStatus;
};

export type RoutingResponse = {
  readonly routing_id: RoutingRequestId;
  readonly status: RoutingStatus;
  readonly progress: number; // 0-100
  readonly workflow_type: WorkflowType;
  readonly estimated_time: string;
  readonly start_time: string;
  readonly selected_agents: ReadonlyArray<RegistryId>;
  readonly execution_plan: ReadonlyArray<ExecutionStep>;
  readonly current_step?: number;
  readonly error_message?: string;
};

export type ExecutionStep = {
  readonly agent: RegistryId;
  readonly task: string;
  readonly status: 'pending' | 'in_progress' | 'completed' | 'failed';
  readonly duration?: string;
  readonly dependencies: ReadonlyArray<RegistryId>;
  readonly estimated_completion?: string;
};

export type AgentMessage = {
  readonly message_id: MessageId;
  readonly from: RegistryId;
  readonly to: RegistryId;
  readonly routing_id: RoutingRequestId;
  readonly timestamp: string;
  readonly type: MessageType;
  readonly content: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type MessageType = 
  | 'task_assignment'
  | 'task_handoff'
  | 'status_update'
  | 'request_assistance'
  | 'completion_notification'
  | 'error_report';

export type FileWatchEvent = {
  readonly event_type: 'add' | 'change' | 'unlink';
  readonly file_path: string;
  readonly timestamp: Date;
};

export type DirectoryStructure = {
  readonly requests: DirectoryPath;
  readonly status: DirectoryPath;
  readonly history: DirectoryPath;
  readonly messages: DirectoryPath;
};

export type CommunicationStats = {
  readonly total_requests: number;
  readonly active_requests: number;
  readonly completed_requests: number;
  readonly failed_requests: number;
  readonly average_processing_time: string;
  readonly messages_processed: number;
};

export class CommunicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly filePath?: string
  ) {
    super(message);
    this.name = 'CommunicationError';
  }
}

export type FileOperationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: CommunicationError };

export interface IFileWatcher {
  start(): Promise<FileOperationResult<void>>;
  stop(): Promise<FileOperationResult<void>>;
  onFileEvent(callback: (event: FileWatchEvent) => void): void;
  isWatching(): boolean;
}

export interface IRoutingRequestHandler {
  processRequest(requestFile: string): Promise<FileOperationResult<RoutingResponse>>;
  createResponse(request: RoutingRequest, agents: ReadonlyArray<AgentConfig>): Promise<FileOperationResult<RoutingResponse>>;
  updateStatus(routingId: RoutingRequestId, status: RoutingStatus, progress?: number): Promise<FileOperationResult<void>>;
}

export interface IAgentMessageHandler {
  sendMessage(message: AgentMessage): Promise<FileOperationResult<void>>;
  readMessages(routingId: RoutingRequestId): Promise<FileOperationResult<ReadonlyArray<AgentMessage>>>;
  createTaskHandoff(from: RegistryId, to: RegistryId, routingId: RoutingRequestId, content: string): Promise<FileOperationResult<void>>;
}

export interface ICommunicationSystem {
  initialize(): Promise<FileOperationResult<void>>;
  startMonitoring(): Promise<FileOperationResult<void>>;
  stopMonitoring(): Promise<FileOperationResult<void>>;
  getStats(): CommunicationStats;
  cleanup(): Promise<FileOperationResult<void>>;
}