// Core types for Smart Router system

export type RequestId = string & { readonly brand: 'RequestId' };

export type CommandType = 'fix-bug' | 'build-mvp' | 'validate' | 'ultrathink';

export type WorkflowType = 'rapid_response' | 'standard' | 'complex';

export type ExpertiseArea = 'frontend' | 'backend' | 'design' | 'qa' | 'devops' | 'security';

export type RequestData = {
  readonly command: string;
  readonly timestamp: string;
  readonly context: ProjectContext;
  readonly user_preferences: UserPreferences;
};

export type ProjectContext = {
  readonly git_status: string;
  readonly current_branch: string;
  readonly recent_changes: ReadonlyArray<string>;
  readonly project_type: string;
};

export type UserPreferences = {
  readonly preferred_speed: 'rapid' | 'standard' | 'complex';
  readonly previous_success: ReadonlyArray<string>;
};

export type AnalysisResult = {
  readonly request_id: RequestId;
  readonly command_type: CommandType;
  readonly workflow_type: WorkflowType;
  readonly expertise_areas: ReadonlyArray<ExpertiseArea>;
  readonly complexity_level: number; // 1-10 scale
  readonly estimated_time: string;
  readonly intent: string;
  readonly requirements: ReadonlyArray<string>;
};

export type ParseResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ParseError };

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export interface ICommandParser {
  parse(command: string): ParseResult<CommandType>;
}

export interface IContextGatherer {
  gather(): Promise<ProjectContext>;
}

export interface IRequestAnalyzer {
  analyze(request: RequestData): Promise<AnalysisResult>;
}