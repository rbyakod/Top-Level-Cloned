import { CommandParser } from '../command-parser';
import type { CommandType } from '../types';

describe('CommandParser', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  describe('basic command parsing', () => {
    it('should parse fix-bug command correctly', () => {
      const result = parser.parse('/fix-bug payment button not working');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('fix-bug' as CommandType);
      }
    });

    it('should parse build-mvp command correctly', () => {
      const result = parser.parse('/build-mvp dark mode feature');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('build-mvp' as CommandType);
      }
    });

    it('should parse validate command correctly', () => {
      const result = parser.parse('/validate user needs better navigation');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('validate' as CommandType);
      }
    });

    it('should parse ultrathink command correctly', () => {
      const result = parser.parse('/ultrathink redesign API for 10x scale');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('ultrathink' as CommandType);
      }
    });
  });

  describe('command parsing edge cases', () => {
    it('should handle commands with extra spaces', () => {
      const result = parser.parse('  /fix-bug   payment   issue  ');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('fix-bug' as CommandType);
      }
    });

    it('should be case insensitive for commands', () => {
      const result = parser.parse('/FIX-BUG Payment Button Not Working');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('fix-bug' as CommandType);
      }
    });

    it('should handle commands without leading slash', () => {
      const result = parser.parse('build-mvp new dashboard feature');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('build-mvp' as CommandType);
      }
    });
  });

  describe('invalid command handling', () => {
    it('should return error for unknown command', () => {
      const result = parser.parse('/unknown-command do something');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Unknown command');
      }
    });

    it('should return error for empty command', () => {
      const result = parser.parse('');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Empty command');
      }
    });

    it('should return error for command without description', () => {
      const result = parser.parse('/fix-bug');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Command requires description');
      }
    });
  });
});