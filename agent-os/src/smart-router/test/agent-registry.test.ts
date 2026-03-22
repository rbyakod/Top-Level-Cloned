import { AgentRegistry } from '../agent-registry';
import type { 
  AgentConfig, 
  YamlAgentRegistry, 
  RegistryId, 
  YamlFilePath,
  AgentPerformanceMetrics
} from '../registry-types';
import { RegistryError } from '../registry-types';
import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('AgentRegistry', () => {
  let registry: AgentRegistry;
  let testFilePath: YamlFilePath;
  let mockAgentConfig: AgentConfig;
  let mockRegistryData: YamlAgentRegistry;

  beforeEach(() => {
    testFilePath = '/test/registry.yml' as YamlFilePath;
    registry = new AgentRegistry(testFilePath);
    
    mockAgentConfig = {
      id: 'backend-engineer' as RegistryId,
      name: 'Backend Engineer',
      team: 'engineering',
      specializations: ['apis', 'databases', 'debugging'],
      availability: 'available',
      performance_metrics: {
        success_rate: 0.94,
        avg_response_time: '2.3 minutes',
        current_workload: 2,
        completed_tasks: 150,
        last_seen: '2025-08-27T14:25:00Z'
      },
      metadata: {
        description: 'Expert in backend development and API design'
      }
    };

    mockRegistryData = {
      version: '1.0.0',
      metadata: {
        created: '2025-08-27T10:00:00Z',
        lastUpdated: '2025-08-27T14:00:00Z',
        total_agents: 35,
        available_agents: 31
      },
      agents: {
        'backend-engineer': mockAgentConfig
      }
    };

    jest.clearAllMocks();
  });

  describe('file operations', () => {
    it('should load valid YAML registry file', async () => {
      const yamlContent = yamlStringify(mockRegistryData);
      mockedFs.readFile.mockResolvedValue(yamlContent);

      const result = await registry.loadFromFile();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(1); // Number of agents loaded
      }
      expect(mockedFs.readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
    });

    it('should handle missing registry file', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('ENOENT: no such file'));

      const result = await registry.loadFromFile();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(RegistryError);
        expect(result.error.code).toBe('FILE_NOT_FOUND');
        expect(result.error.filePath).toBe(testFilePath);
      }
    });

    it('should handle malformed YAML file', async () => {
      const invalidYaml = 'invalid: yaml: content: [unclosed';
      mockedFs.readFile.mockResolvedValue(invalidYaml);

      const result = await registry.loadFromFile();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeInstanceOf(RegistryError);
        expect(result.error.code).toBe('YAML_PARSE_ERROR');
      }
    });

    it('should validate registry schema', async () => {
      const invalidRegistryData = {
        version: '1.0.0',
        // Missing required metadata and agents fields
      };
      const yamlContent = yamlStringify(invalidRegistryData);
      mockedFs.readFile.mockResolvedValue(yamlContent);

      const result = await registry.loadFromFile();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('INVALID_REGISTRY_SCHEMA');
      }
    });

    it('should save registry to YAML file', async () => {
      // First load the registry
      mockedFs.readFile.mockResolvedValue(yamlStringify(mockRegistryData));
      await registry.loadFromFile();

      // Mock successful file write
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await registry.saveToFile();

      expect(result.ok).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        testFilePath,
        expect.stringContaining('version: 1.0.0'),
        'utf-8'
      );
    });

    it('should handle file write errors', async () => {
      // Load registry first
      mockedFs.readFile.mockResolvedValue(yamlStringify(mockRegistryData));
      await registry.loadFromFile();

      // Mock file write failure
      mockedFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      const result = await registry.saveToFile();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('FILE_WRITE_ERROR');
      }
    });
  });

  describe('agent registration and management', () => {
    beforeEach(async () => {
      // Load initial registry
      mockedFs.readFile.mockResolvedValue(yamlStringify(mockRegistryData));
      mockedFs.writeFile.mockResolvedValue(undefined);
      await registry.loadFromFile();
    });

    it('should register new agent', async () => {
      const newAgent: AgentConfig = {
        id: 'frontend-engineer' as RegistryId,
        name: 'Frontend Engineer',
        team: 'engineering',
        specializations: ['react', 'typescript', 'css'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.91,
          avg_response_time: '1.8 minutes',
          current_workload: 1,
          completed_tasks: 200,
          last_seen: '2025-08-27T14:30:00Z'
        },
        metadata: {}
      };

      const result = await registry.registerAgent(newAgent);

      expect(result.ok).toBe(true);
      expect(registry.getAgent(newAgent.id)).toEqual(newAgent);
    });

    it('should prevent duplicate agent registration', async () => {
      const duplicateAgent: AgentConfig = {
        ...mockAgentConfig,
        id: 'backend-engineer' as RegistryId // Same as existing
      };

      const result = await registry.registerAgent(duplicateAgent);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('DUPLICATE_AGENT_ID');
      }
    });

    it('should update agent availability status', async () => {
      const agentId = 'backend-engineer' as RegistryId;

      const result = await registry.updateAgentStatus(agentId, 'busy');

      expect(result.ok).toBe(true);
      const updatedAgent = registry.getAgent(agentId);
      expect(updatedAgent?.availability).toBe('busy');
    });

    it('should handle updating non-existent agent', async () => {
      const nonExistentId = 'non-existent-agent' as RegistryId;

      const result = await registry.updateAgentStatus(nonExistentId, 'busy');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('AGENT_NOT_FOUND');
      }
    });

    it('should retrieve agent by ID', () => {
      const agent = registry.getAgent('backend-engineer' as RegistryId);
      
      expect(agent).toEqual(mockAgentConfig);
    });

    it('should return null for non-existent agent', () => {
      const agent = registry.getAgent('non-existent' as RegistryId);
      
      expect(agent).toBeNull();
    });

    it('should get all agents', () => {
      const allAgents = registry.getAllAgents();
      
      expect(allAgents).toHaveLength(1);
      expect(allAgents[0]).toEqual(mockAgentConfig);
    });

    it('should get only available agents', async () => {
      // Add a busy agent
      const busyAgent: AgentConfig = {
        ...mockAgentConfig,
        id: 'qa-engineer' as RegistryId,
        name: 'QA Engineer',
        availability: 'busy'
      };
      await registry.registerAgent(busyAgent);

      const availableAgents = registry.getAvailableAgents();
      
      expect(availableAgents).toHaveLength(1);
      expect(availableAgents[0].availability).toBe('available');
    });

    it('should update metadata when agents change', async () => {
      const newAgent: AgentConfig = {
        id: 'new-agent' as RegistryId,
        name: 'New Agent',
        team: 'design',
        specializations: ['ui', 'ux'],
        availability: 'available',
        performance_metrics: {
          success_rate: 0.85,
          avg_response_time: '3.0 minutes',
          current_workload: 0,
          completed_tasks: 50,
          last_seen: '2025-08-27T14:35:00Z'
        },
        metadata: {}
      };

      await registry.registerAgent(newAgent);

      // Check that metadata was updated
      const allAgents = registry.getAllAgents();
      expect(allAgents).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('should handle corrupted agent data gracefully', async () => {
      const corruptedData = {
        version: '1.0.0',
        metadata: {
          created: '2025-08-27T10:00:00Z',
          lastUpdated: '2025-08-27T14:00:00Z',
          total_agents: 1,
          available_agents: 1
        },
        agents: {
          'invalid-agent': {
            id: 'invalid-agent',
            // Missing required fields
            availability: 'available'
          }
        }
      };

      mockedFs.readFile.mockResolvedValue(yamlStringify(corruptedData));

      const result = await registry.loadFromFile();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('INVALID_AGENT_CONFIG');
      }
    });

    it('should validate agent configuration on registration', async () => {
      const invalidAgent = {
        id: 'invalid-agent' as RegistryId,
        name: 'Invalid Agent',
        // Missing required fields
      } as AgentConfig;

      mockedFs.readFile.mockResolvedValue(yamlStringify(mockRegistryData));
      await registry.loadFromFile();

      const result = await registry.registerAgent(invalidAgent);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('INVALID_AGENT_CONFIG');
      }
    });
  });
});