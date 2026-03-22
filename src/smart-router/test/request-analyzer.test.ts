import { RequestAnalyzer } from '../request-analyzer';
import type { RequestData, AnalysisResult, RequestId } from '../types';

describe('RequestAnalyzer', () => {
  let analyzer: RequestAnalyzer;

  beforeEach(() => {
    analyzer = new RequestAnalyzer();
  });

  describe('intent extraction', () => {
    it('should extract intent from fix-bug command', async () => {
      const request: RequestData = {
        command: '/fix-bug payment button not working on checkout page',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'main',
          recent_changes: ['checkout.js', 'payment.service.js'],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'rapid',
          previous_success: ['backend-engineer', 'qa-engineer']
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.intent).toContain('fix payment button not working');
      expect(result.command_type).toBe('fix-bug');
      expect(result.workflow_type).toBe('standard');
    });

    it('should extract intent from build-mvp command', async () => {
      const request: RequestData = {
        command: '/build-mvp dark mode toggle for better user experience',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'dirty',
          current_branch: 'feature-branch',
          recent_changes: ['styles.css', 'theme.js'],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'standard',
          previous_success: ['ui-designer', 'frontend-engineer']
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.intent).toContain('implement dark mode toggle');
      expect(result.command_type).toBe('build-mvp');
      expect(result.workflow_type).toBe('standard');
    });
  });

  describe('expertise area identification', () => {
    it('should identify backend and QA expertise for payment bug', async () => {
      const request: RequestData = {
        command: '/fix-bug payment processing fails with 500 error',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'main',
          recent_changes: ['payment-service.js', 'database.js'],
          project_type: 'api'
        },
        user_preferences: {
          preferred_speed: 'rapid',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.expertise_areas).toContain('backend');
      expect(result.expertise_areas).toContain('qa');
      expect(result.complexity_level).toBeGreaterThanOrEqual(3);
      expect(result.complexity_level).toBeLessThanOrEqual(6);
    });

    it('should identify design and frontend expertise for UI features', async () => {
      const request: RequestData = {
        command: '/build-mvp responsive navigation menu with animations',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'dirty',
          current_branch: 'ui-redesign',
          recent_changes: ['navigation.css', 'menu.component.js'],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'standard',
          previous_success: ['ui-designer']
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.expertise_areas).toContain('design');
      expect(result.expertise_areas).toContain('frontend');
      expect(result.complexity_level).toBeGreaterThanOrEqual(4);
    });

    it('should identify security expertise for security-related commands', async () => {
      const request: RequestData = {
        command: '/fix-bug SQL injection vulnerability in user login',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'security-fix',
          recent_changes: ['auth.js', 'user.model.js'],
          project_type: 'api'
        },
        user_preferences: {
          preferred_speed: 'rapid',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.expertise_areas).toContain('security');
      expect(result.expertise_areas).toContain('backend');
      expect(result.complexity_level).toBeGreaterThanOrEqual(7);
    });
  });

  describe('workflow type classification', () => {
    it('should classify simple bugs as rapid_response', async () => {
      const request: RequestData = {
        command: '/fix-bug typo in button text',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'main',
          recent_changes: [],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'rapid',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.workflow_type).toBe('rapid_response');
      expect(result.complexity_level).toBeLessThanOrEqual(3);
      expect(result.estimated_time).toMatch(/\d+\s*minutes?/);
    });

    it('should classify MVPs as standard workflow', async () => {
      const request: RequestData = {
        command: '/build-mvp user profile dashboard with charts',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'dirty',
          current_branch: 'dashboard',
          recent_changes: ['dashboard.js'],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'standard',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.workflow_type).toBe('standard');
      expect(result.complexity_level).toBeGreaterThanOrEqual(4);
      expect(result.complexity_level).toBeLessThanOrEqual(7);
      expect(result.estimated_time).toMatch(/\d+\s*hours?/);
    });

    it('should classify complex architecture as complex workflow', async () => {
      const request: RequestData = {
        command: '/ultrathink redesign entire API architecture for microservices',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'architecture-redesign',
          recent_changes: [],
          project_type: 'api'
        },
        user_preferences: {
          preferred_speed: 'complex',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.workflow_type).toBe('complex');
      expect(result.complexity_level).toBeGreaterThanOrEqual(8);
      expect(result.estimated_time).toMatch(/\d+\s*days?/);
    });
  });

  describe('requirement extraction', () => {
    it('should extract specific requirements from command context', async () => {
      const request: RequestData = {
        command: '/build-mvp real-time chat with file sharing and emoji support',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'dirty',
          current_branch: 'chat-feature',
          recent_changes: ['websocket.js', 'chat.component.js'],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'standard',
          previous_success: []
        }
      };

      const result = await analyzer.analyze(request);

      expect(result.requirements).toContain('real-time messaging functionality');
      expect(result.requirements).toContain('file upload and sharing');
      expect(result.requirements).toContain('emoji picker integration');
      expect(result.requirements.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('request ID generation', () => {
    it('should generate unique request IDs', async () => {
      const request: RequestData = {
        command: '/fix-bug test command',
        timestamp: '2025-08-27T14:30:52Z',
        context: {
          git_status: 'clean',
          current_branch: 'main',
          recent_changes: [],
          project_type: 'web_app'
        },
        user_preferences: {
          preferred_speed: 'rapid',
          previous_success: []
        }
      };

      const result1 = await analyzer.analyze(request);
      const result2 = await analyzer.analyze(request);

      expect(result1.request_id).not.toBe(result2.request_id);
      expect(result1.request_id).toMatch(/2025-08-27-.+-fix-bug-.+/);
    });
  });
});