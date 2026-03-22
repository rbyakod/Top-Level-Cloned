import { ContextGatherer } from '../context-gatherer';
import type { ProjectContext } from '../types';
import { jest } from '@jest/globals';

// Mock child_process for git commands
jest.mock('child_process');
jest.mock('fs/promises');

import { exec } from 'child_process';
import { readdir, stat } from 'fs/promises';

const mockedExec = jest.mocked(exec);
const mockedReaddir = jest.mocked(readdir);
const mockedStat = jest.mocked(stat);

describe('ContextGatherer', () => {
  let gatherer: ContextGatherer;

  beforeEach(() => {
    gatherer = new ContextGatherer();
    jest.clearAllMocks();
  });

  describe('git status gathering', () => {
    it('should gather git status correctly when clean', async () => {
      mockedExec.mockImplementation((cmd, callback) => {
        if (cmd === 'git status --porcelain') {
          callback!(null, { stdout: '', stderr: '' } as any);
        } else if (cmd === 'git branch --show-current') {
          callback!(null, { stdout: 'main\n', stderr: '' } as any);
        }
        return {} as any;
      });

      const context = await gatherer.gather();

      expect(context.git_status).toBe('clean');
      expect(context.current_branch).toBe('main');
    });

    it('should gather git status correctly when dirty', async () => {
      mockedExec.mockImplementation((cmd, callback) => {
        if (cmd === 'git status --porcelain') {
          callback!(null, { 
            stdout: ' M src/file.ts\n?? new-file.ts\n', 
            stderr: '' 
          } as any);
        } else if (cmd === 'git branch --show-current') {
          callback!(null, { stdout: 'feature-branch\n', stderr: '' } as any);
        }
        return {} as any;
      });

      const context = await gatherer.gather();

      expect(context.git_status).toBe('dirty');
      expect(context.current_branch).toBe('feature-branch');
    });

    it('should handle git command errors gracefully', async () => {
      mockedExec.mockImplementation((cmd, callback) => {
        callback!(new Error('Git not found'), { stdout: '', stderr: 'error' } as any);
        return {} as any;
      });

      const context = await gatherer.gather();

      expect(context.git_status).toBe('unknown');
      expect(context.current_branch).toBe('unknown');
    });
  });

  describe('recent changes detection', () => {
    it('should detect recently modified files', async () => {
      mockedReaddir.mockResolvedValue(['file1.ts', 'file2.js', 'README.md'] as any);
      mockedStat.mockImplementation((path) => {
        const now = new Date();
        const recentTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago
        return Promise.resolve({ 
          mtime: recentTime,
          isFile: () => true 
        } as any);
      });

      const context = await gatherer.gather();

      expect(context.recent_changes).toHaveLength(3);
      expect(context.recent_changes).toContain('file1.ts');
      expect(context.recent_changes).toContain('file2.js');
      expect(context.recent_changes).toContain('README.md');
    });

    it('should filter out old files', async () => {
      mockedReaddir.mockResolvedValue(['old-file.ts', 'recent-file.js'] as any);
      mockedStat.mockImplementation((path) => {
        if (path.toString().includes('old-file')) {
          const oldTime = new Date('2024-01-01'); // Very old
          return Promise.resolve({ 
            mtime: oldTime,
            isFile: () => true 
          } as any);
        } else {
          const recentTime = new Date(); // Now
          return Promise.resolve({ 
            mtime: recentTime,
            isFile: () => true 
          } as any);
        }
      });

      const context = await gatherer.gather();

      expect(context.recent_changes).toHaveLength(1);
      expect(context.recent_changes).toContain('recent-file.js');
      expect(context.recent_changes).not.toContain('old-file.ts');
    });
  });

  describe('project type detection', () => {
    it('should detect web app project type', async () => {
      mockedReaddir.mockResolvedValue([
        'package.json', 'src', 'public', 'index.html'
      ] as any);

      const context = await gatherer.gather();

      expect(context.project_type).toBe('web_app');
    });

    it('should detect Node.js API project type', async () => {
      mockedReaddir.mockResolvedValue([
        'package.json', 'src', 'routes', 'models'
      ] as any);

      const context = await gatherer.gather();

      expect(context.project_type).toBe('api');
    });

    it('should default to unknown project type', async () => {
      mockedReaddir.mockResolvedValue(['README.md'] as any);

      const context = await gatherer.gather();

      expect(context.project_type).toBe('unknown');
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      mockedReaddir.mockRejectedValue(new Error('Permission denied'));

      const context = await gatherer.gather();

      expect(context.recent_changes).toEqual([]);
      expect(context.project_type).toBe('unknown');
    });
  });
});