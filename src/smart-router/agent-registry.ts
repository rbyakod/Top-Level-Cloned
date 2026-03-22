import { readFile, writeFile } from 'fs/promises';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';
import type {
  IAgentRegistry,
  AgentConfig,
  YamlAgentRegistry,
  RegistryId,
  YamlFilePath,
  FileResult
} from './registry-types';
import { RegistryError } from './registry-types';

export class AgentRegistry implements IAgentRegistry {
  private agents = new Map<RegistryId, AgentConfig>();
  private metadata = {
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    total_agents: 0,
    available_agents: 0
  };

  constructor(private readonly filePath: YamlFilePath) {}

  async loadFromFile(): Promise<FileResult<number>> {
    try {
      const content = await readFile(this.filePath, 'utf-8');
      
      let parsedData: unknown;
      try {
        parsedData = yamlParse(content);
      } catch (parseError) {
        return {
          ok: false,
          error: new RegistryError(
            `Failed to parse YAML: ${parseError.message}`,
            'YAML_PARSE_ERROR',
            this.filePath
          )
        };
      }

      const validationResult = this.validateRegistrySchema(parsedData);
      if (!validationResult.ok) {
        return validationResult;
      }

      const registryData = parsedData as YamlAgentRegistry;
      
      // Load agents into memory
      this.agents.clear();
      let loadedCount = 0;
      
      for (const [agentId, agentConfig] of Object.entries(registryData.agents)) {
        const configValidation = this.validateAgentConfig(agentConfig);
        if (!configValidation.ok) {
          return {
            ok: false,
            error: new RegistryError(
              `Invalid agent config for ${agentId}: ${configValidation.error.message}`,
              'INVALID_AGENT_CONFIG',
              this.filePath
            )
          };
        }
        
        this.agents.set(agentId as RegistryId, agentConfig);
        loadedCount++;
      }

      // Update metadata
      this.metadata = registryData.metadata;
      
      return { ok: true, value: loadedCount };
      
    } catch (error: any) {
      if (error.code === 'ENOENT' || error.message?.includes('ENOENT: no such file')) {
        return {
          ok: false,
          error: new RegistryError(
            'Registry file not found',
            'FILE_NOT_FOUND',
            this.filePath
          )
        };
      }
      
      return {
        ok: false,
        error: new RegistryError(
          `Failed to load registry: ${error.message}`,
          'FILE_READ_ERROR',
          this.filePath
        )
      };
    }
  }

  async saveToFile(): Promise<FileResult<void>> {
    try {
      // Update metadata before saving
      this.updateMetadata();
      
      const registryData: YamlAgentRegistry = {
        version: '1.0.0',
        metadata: this.metadata,
        agents: Object.fromEntries(this.agents.entries()) as Readonly<Record<string, AgentConfig>>
      };

      const yamlContent = yamlStringify(registryData, {
        indent: 2,
        lineWidth: 120,
        minContentWidth: 20
      });

      await writeFile(this.filePath, yamlContent, 'utf-8');
      
      return { ok: true, value: undefined };
      
    } catch (error) {
      return {
        ok: false,
        error: new RegistryError(
          `Failed to save registry: ${error.message}`,
          'FILE_WRITE_ERROR',
          this.filePath
        )
      };
    }
  }

  async registerAgent(agent: AgentConfig): Promise<FileResult<void>> {
    // Validate agent configuration
    const validation = this.validateAgentConfig(agent);
    if (!validation.ok) {
      return validation;
    }

    // Check for duplicate ID
    if (this.agents.has(agent.id)) {
      return {
        ok: false,
        error: new RegistryError(
          `Agent with ID ${agent.id} already exists`,
          'DUPLICATE_AGENT_ID'
        )
      };
    }

    // Add agent to registry
    this.agents.set(agent.id, agent);
    this.updateMetadata();

    // Auto-save to file
    return await this.saveToFile();
  }

  async updateAgentStatus(agentId: RegistryId, status: AgentConfig['availability']): Promise<FileResult<void>> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return {
        ok: false,
        error: new RegistryError(
          `Agent with ID ${agentId} not found`,
          'AGENT_NOT_FOUND'
        )
      };
    }

    // Update agent status
    const updatedAgent: AgentConfig = {
      ...agent,
      availability: status,
      performance_metrics: {
        ...agent.performance_metrics,
        last_seen: new Date().toISOString()
      }
    };

    this.agents.set(agentId, updatedAgent);
    this.updateMetadata();

    // Auto-save to file
    return await this.saveToFile();
  }

  getAgent(agentId: RegistryId): AgentConfig | null {
    return this.agents.get(agentId) || null;
  }

  getAllAgents(): ReadonlyArray<AgentConfig> {
    return Array.from(this.agents.values());
  }

  getAvailableAgents(): ReadonlyArray<AgentConfig> {
    return Array.from(this.agents.values()).filter(agent => agent.availability === 'available');
  }

  private validateRegistrySchema(data: unknown): FileResult<void> {
    if (!data || typeof data !== 'object') {
      return {
        ok: false,
        error: new RegistryError('Registry data must be an object', 'INVALID_REGISTRY_SCHEMA')
      };
    }

    const registry = data as Record<string, unknown>;

    // Check required fields
    if (!registry.version || typeof registry.version !== 'string') {
      return {
        ok: false,
        error: new RegistryError('Registry must have a version field', 'INVALID_REGISTRY_SCHEMA')
      };
    }

    if (!registry.metadata || typeof registry.metadata !== 'object') {
      return {
        ok: false,
        error: new RegistryError('Registry must have metadata field', 'INVALID_REGISTRY_SCHEMA')
      };
    }

    if (!registry.agents || typeof registry.agents !== 'object') {
      return {
        ok: false,
        error: new RegistryError('Registry must have agents field', 'INVALID_REGISTRY_SCHEMA')
      };
    }

    return { ok: true, value: undefined };
  }

  private validateAgentConfig(agent: unknown): FileResult<void> {
    if (!agent || typeof agent !== 'object') {
      return {
        ok: false,
        error: new RegistryError('Agent config must be an object', 'INVALID_AGENT_CONFIG')
      };
    }

    const config = agent as Record<string, unknown>;

    // Required fields validation
    const requiredFields = ['id', 'name', 'team', 'specializations', 'availability', 'performance_metrics'];
    
    for (const field of requiredFields) {
      if (!(field in config)) {
        return {
          ok: false,
          error: new RegistryError(`Agent config missing required field: ${field}`, 'INVALID_AGENT_CONFIG')
        };
      }
    }

    // Type validation
    if (typeof config.id !== 'string' || config.id.length === 0) {
      return {
        ok: false,
        error: new RegistryError('Agent ID must be a non-empty string', 'INVALID_AGENT_CONFIG')
      };
    }

    if (!Array.isArray(config.specializations)) {
      return {
        ok: false,
        error: new RegistryError('Agent specializations must be an array', 'INVALID_AGENT_CONFIG')
      };
    }

    if (!['available', 'busy', 'offline'].includes(config.availability as string)) {
      return {
        ok: false,
        error: new RegistryError('Agent availability must be available, busy, or offline', 'INVALID_AGENT_CONFIG')
      };
    }

    return { ok: true, value: undefined };
  }

  private updateMetadata(): void {
    const now = new Date().toISOString();
    const availableCount = Array.from(this.agents.values()).filter(
      agent => agent.availability === 'available'
    ).length;

    this.metadata = {
      created: this.metadata.created, // Keep original creation time
      lastUpdated: now,
      total_agents: this.agents.size,
      available_agents: availableCount
    };
  }
}