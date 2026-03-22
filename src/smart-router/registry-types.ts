// Registry-specific types for Agent Registry System

export type RegistryId = string & { readonly brand: 'RegistryId' };
export type YamlFilePath = string & { readonly brand: 'YamlFilePath' };
export type AgentScore = number & { readonly brand: 'AgentScore' };

export type AgentTeam = 'product' | 'engineering' | 'design' | 'quality' | 'data_ai' | 'growth' | 'strategy' | 'rapid_response';

export type AgentConfig = {
  readonly id: RegistryId;
  readonly name: string;
  readonly team: AgentTeam;
  readonly specializations: ReadonlyArray<string>;
  readonly availability: 'available' | 'busy' | 'offline';
  readonly performance_metrics: AgentPerformanceMetrics;
  readonly metadata: Readonly<Record<string, unknown>>;
};

export type AgentPerformanceMetrics = {
  readonly success_rate: number; // 0.0 to 1.0
  readonly avg_response_time: string; // e.g., "2.3 minutes"
  readonly current_workload: number; // 0 to 10 scale
  readonly completed_tasks: number;
  readonly last_seen: string; // ISO timestamp
};

export type YamlAgentRegistry = {
  readonly version: string;
  readonly metadata: {
    readonly created: string;
    readonly lastUpdated: string;
    readonly total_agents: number;
    readonly available_agents: number;
  };
  readonly agents: Readonly<Record<string, AgentConfig>>;
};

export type ScoringCriteria = {
  readonly expertise_areas: ReadonlyArray<string>;
  readonly urgency: 'low' | 'medium' | 'high' | 'critical';
  readonly complexity_level: number; // 1-10 scale
  readonly preferred_agents?: ReadonlyArray<RegistryId>;
};

export type SelectionCriteria = ScoringCriteria & {
  readonly exclude_busy?: boolean;
  readonly max_workload?: number;
  readonly team_preference?: AgentTeam;
};

export type ScoringResult = {
  readonly agent_id: RegistryId;
  readonly score: AgentScore;
  readonly reasoning: string;
  readonly breakdown: ScoringBreakdown;
};

export type ScoringBreakdown = {
  readonly expertise_match: number;
  readonly availability_score: number;
  readonly performance_score: number;
  readonly workload_penalty: number;
  readonly preference_bonus: number;
};

export type LoadBalancingResult = {
  readonly selected_agent: AgentConfig;
  readonly score: AgentScore;
  readonly alternatives: ReadonlyArray<ScoringResult>;
  readonly selection_reasoning: string;
};

export type FileResult<T> = 
  | { ok: true; value: T }
  | { ok: false; error: RegistryError };

export class RegistryError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly filePath?: YamlFilePath
  ) {
    super(message);
    this.name = 'RegistryError';
  }
}

export interface IAgentRegistry {
  loadFromFile(): Promise<FileResult<number>>;
  saveToFile(): Promise<FileResult<void>>;
  registerAgent(agent: AgentConfig): Promise<FileResult<void>>;
  updateAgentStatus(agentId: RegistryId, status: AgentConfig['availability']): Promise<FileResult<void>>;
  getAgent(agentId: RegistryId): AgentConfig | null;
  getAllAgents(): ReadonlyArray<AgentConfig>;
  getAvailableAgents(): ReadonlyArray<AgentConfig>;
}

export interface IScoringStrategy {
  calculate(agent: AgentConfig, criteria: ScoringCriteria): AgentScore;
  explain(agent: AgentConfig, criteria: ScoringCriteria): ScoringBreakdown;
}

export interface ILoadBalancer {
  selectAgent(agents: ReadonlyArray<AgentConfig>, criteria: SelectionCriteria): LoadBalancingResult | null;
  selectMultipleAgents(agents: ReadonlyArray<AgentConfig>, criteria: SelectionCriteria, count: number): ReadonlyArray<AgentConfig>;
}