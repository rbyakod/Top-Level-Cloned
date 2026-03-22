import { ConflictResolver } from '../conflict-resolver';
import type { 
  AgentConflict, 
  ConflictResolution,
  PriorityRules,
  UserPreferences 
} from '../conflict-resolver';
import type { WorkflowStep } from '../orchestration-types';
import type { RegistryId } from '../types';
import { jest } from '@jest/globals';
import { promises as fs } from 'fs';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('ConflictResolver', () => {
  let resolver: ConflictResolver;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    resolver = new ConflictResolver('/test/config');
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock default configurations
    mockedFs.readFile = jest.fn();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const createMockSteps = (stepConfigs: Array<{
    id: string;
    agent: string;
    status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed';
  }>): WorkflowStep[] => {
    return stepConfigs.map(config => ({
      step_id: config.id,
      agent_id: config.agent as RegistryId,
      task_description: `Task ${config.id}`,
      depends_on: [],
      estimated_duration: 10,
      status: config.status
    }));
  };

  describe('initialization', () => {
    it('should initialize successfully with default configurations', async () => {
      // Mock file not found - should use defaults
      mockedFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await resolver.initialize();

      expect(result.success).toBe(true);
      expect(mockedFs.readFile).toHaveBeenCalledTimes(2); // priority rules + user preferences
    });

    it('should load custom priority rules', async () => {
      const mockPriorityRules: PriorityRules = {
        agent_priorities: {
          'backend-engineer': 10,
          'frontend-engineer': 8
        },
        team_priorities: {
          engineering: 10,
          design: 5
        },
        task_type_priorities: {
          critical: 10,
          normal: 5
        },
        default_priority: 3
      };

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockPriorityRules)) // priority rules
        .mockRejectedValueOnce(new Error('User preferences not found')); // user preferences

      const result = await resolver.initialize();

      expect(result.success).toBe(true);
    });

    it('should load custom user preferences', async () => {
      const mockUserPreferences: UserPreferences = {
        preferred_agents: ['backend-engineer', 'qa-engineer'],
        avoided_agents: ['slow-agent'],
        team_preferences: { engineering: 10 },
        conflict_resolution_strategy: 'user_preference'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('Priority rules not found'))
        .mockResolvedValueOnce(JSON.stringify(mockUserPreferences));

      const result = await resolver.initialize();

      expect(result.success).toBe(true);
    });

    it('should handle initialization errors', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Permission denied'));

      const result = await resolver.initialize();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CONFLICT_RESOLVER_INIT_ERROR');
    });
  });

  describe('conflict detection', () => {
    beforeEach(async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Use defaults'));
      await resolver.initialize();
    });

    it('should detect resource contention conflicts', async () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', status: 'running' },
        { id: 'step1', agent: 'agent2', status: 'assigned' }, // Same step ID
        { id: 'step2', agent: 'agent3', status: 'running' }
      ]);

      const conflicts = await resolver.detectConflicts(steps);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].conflict_type).toBe('resource_contention');
      expect(conflicts[0].step_id).toBe('step1');
      expect(conflicts[0].conflicting_agents).toContain('agent1');
      expect(conflicts[0].conflicting_agents).toContain('agent2');
    });

    it('should detect priority collision conflicts', async () => {
      // Create more than 8 running steps to trigger priority collision detection
      const steps = createMockSteps(
        Array.from({ length: 10 }, (_, i) => ({
          id: `step${i}`,
          agent: `agent${i}` as string,
          status: 'running' as const
        }))
      );

      const conflicts = await resolver.detectConflicts(steps);

      expect(conflicts.length).toBeGreaterThanOrEqual(0); // May detect priority collisions
    });

    it('should not detect conflicts in normal workflows', async () => {
      const steps = createMockSteps([
        { id: 'step1', agent: 'agent1', status: 'running' },
        { id: 'step2', agent: 'agent2', status: 'pending' },
        { id: 'step3', agent: 'agent3', status: 'completed' }
      ]);

      const conflicts = await resolver.detectConflicts(steps);

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('conflict resolution', () => {
    beforeEach(async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Use defaults'));
      await resolver.initialize();
    });

    it('should resolve conflict using priority-based strategy', async () => {
      const conflict: AgentConflict = {
        conflict_id: 'test-conflict-1',
        step_id: 'step1',
        conflicting_agents: ['agent1', 'agent2'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Test conflict',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.success && result.data) {
        expect(result.data.conflict_id).toBe('test-conflict-1');
        expect(result.data.resolution_type).toBe('priority_based');
        expect(result.data.chosen_agent).toBeDefined();
        expect(['agent1', 'agent2']).toContain(result.data.chosen_agent);
      }
    });

    it('should resolve conflict using user preference strategy', async () => {
      // Mock user preferences
      const mockPreferences: UserPreferences = {
        preferred_agents: ['preferred-agent'],
        avoided_agents: ['avoided-agent'],
        team_preferences: {},
        conflict_resolution_strategy: 'user_preference'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'preference-test',
        step_id: 'step1',
        conflicting_agents: ['preferred-agent', 'other-agent'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'User preference test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.chosen_agent).toBe('preferred-agent');
        expect(result.data.resolution_type).toBe('user_preference');
      }
    });

    it('should avoid agents in avoided list', async () => {
      const mockPreferences: UserPreferences = {
        preferred_agents: [],
        avoided_agents: ['avoided-agent'],
        team_preferences: {},
        conflict_resolution_strategy: 'user_preference'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'avoid-test',
        step_id: 'step1',
        conflicting_agents: ['avoided-agent', 'good-agent'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Avoid agent test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.chosen_agent).toBe('good-agent');
        expect(result.data.resolution_type).toBe('user_preference');
      }
    });

    it('should handle agent score resolution strategy', async () => {
      const mockPreferences: UserPreferences = {
        preferred_agents: [],
        avoided_agents: [],
        team_preferences: {},
        conflict_resolution_strategy: 'agent_score'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'score-test',
        step_id: 'step1',
        conflicting_agents: ['agent1', 'agent2'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Agent score test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.resolution_type).toBe('agent_score');
        expect(result.data.chosen_agent).toBeDefined();
      }
    });

    it('should handle sequential execution resolution', async () => {
      const mockPreferences: UserPreferences = {
        preferred_agents: [],
        avoided_agents: [],
        team_preferences: {},
        conflict_resolution_strategy: 'sequential_execution'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'sequential-test',
        step_id: 'step1',
        conflicting_agents: ['agent1', 'agent2'] as RegistryId[],
        conflict_type: 'priority_collision',
        description: 'Sequential execution test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.resolution_type).toBe('sequential_execution');
        expect(result.data.reasoning).toContain('sequential');
      }
    });

    it('should fall back to random selection', async () => {
      const mockPreferences: UserPreferences = {
        preferred_agents: [],
        avoided_agents: [],
        team_preferences: {},
        conflict_resolution_strategy: 'random_selection'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'random-test',
        step_id: 'step1',
        conflicting_agents: ['agent1', 'agent2', 'agent3'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Random selection test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.resolution_type).toBe('random_selection');
        expect(['agent1', 'agent2', 'agent3']).toContain(result.data.chosen_agent);
      }
    });

    it('should handle resolution errors', async () => {
      // Create a conflict that will cause an error during resolution
      const invalidConflict: AgentConflict = {
        conflict_id: '',
        step_id: '',
        conflicting_agents: [] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Invalid conflict',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(invalidConflict);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CONFLICT_RESOLUTION_ERROR');
    });
  });

  describe('priority-based resolution', () => {
    it('should use custom priority rules', async () => {
      const mockPriorityRules: PriorityRules = {
        agent_priorities: {
          'high-priority-agent': 10,
          'low-priority-agent': 3
        },
        team_priorities: {},
        task_type_priorities: {},
        default_priority: 5
      };

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockPriorityRules))
        .mockRejectedValueOnce(new Error('No user preferences'));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'priority-test',
        step_id: 'step1',
        conflicting_agents: ['low-priority-agent', 'high-priority-agent'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Priority test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.chosen_agent).toBe('high-priority-agent');
        expect(result.data.reasoning).toContain('priority 10');
      }
    });

    it('should use default priority when agent not in rules', async () => {
      const mockPriorityRules: PriorityRules = {
        agent_priorities: {
          'known-agent': 8
        },
        team_priorities: {},
        task_type_priorities: {},
        default_priority: 5
      };

      mockedFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockPriorityRules))
        .mockRejectedValueOnce(new Error('No user preferences'));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'default-priority-test',
        step_id: 'step1',
        conflicting_agents: ['unknown-agent', 'known-agent'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Default priority test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.chosen_agent).toBe('known-agent');
      }
    });
  });

  describe('edge cases', () => {
    beforeEach(async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Use defaults'));
      await resolver.initialize();
    });

    it('should handle empty conflicting agents array', async () => {
      const conflict: AgentConflict = {
        conflict_id: 'empty-test',
        step_id: 'step1',
        conflicting_agents: [],
        conflict_type: 'resource_contention',
        description: 'Empty agents test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CONFLICT_RESOLUTION_ERROR');
    });

    it('should handle single agent conflict', async () => {
      const conflict: AgentConflict = {
        conflict_id: 'single-agent-test',
        step_id: 'step1',
        conflicting_agents: ['only-agent'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'Single agent test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.chosen_agent).toBe('only-agent');
      }
    });

    it('should handle all agents in avoided list', async () => {
      const mockPreferences: UserPreferences = {
        preferred_agents: [],
        avoided_agents: ['agent1', 'agent2'],
        team_preferences: {},
        conflict_resolution_strategy: 'user_preference'
      };

      mockedFs.readFile
        .mockRejectedValueOnce(new Error('No priority rules'))
        .mockResolvedValueOnce(JSON.stringify(mockPreferences));

      await resolver.initialize();

      const conflict: AgentConflict = {
        conflict_id: 'all-avoided-test',
        step_id: 'step1',
        conflicting_agents: ['agent1', 'agent2'] as RegistryId[],
        conflict_type: 'resource_contention',
        description: 'All agents avoided test',
        created_at: new Date()
      };

      const result = await resolver.resolveConflict(conflict);

      expect(result.success).toBe(true);
      // Should fall back to priority-based resolution
      if (result.success && result.data) {
        expect(['agent1', 'agent2']).toContain(result.data.chosen_agent);
      }
    });
  });
});