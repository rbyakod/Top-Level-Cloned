import { exec } from 'child_process';
import { readdir, stat } from 'fs/promises';
import { promisify } from 'util';
import type { IContextGatherer, ProjectContext } from './types';

const execAsync = promisify(exec);

export class ContextGatherer implements IContextGatherer {
  async gather(): Promise<ProjectContext> {
    const [gitStatus, currentBranch, recentChanges, projectType] = await Promise.all([
      this.getGitStatus(),
      this.getCurrentBranch(),
      this.getRecentChanges(),
      this.detectProjectType(),
    ]);

    return {
      git_status: gitStatus,
      current_branch: currentBranch,
      recent_changes: recentChanges,
      project_type: projectType,
    };
  }

  private async getGitStatus(): Promise<string> {
    try {
      const { stdout } = await execAsync('git status --porcelain');
      return stdout.trim().length === 0 ? 'clean' : 'dirty';
    } catch {
      return 'unknown';
    }
  }

  private async getCurrentBranch(): Promise<string> {
    try {
      const { stdout } = await execAsync('git branch --show-current');
      return stdout.trim();
    } catch {
      return 'unknown';
    }
  }

  private async getRecentChanges(): Promise<ReadonlyArray<string>> {
    try {
      const files = await readdir('.');
      const recentFiles: string[] = [];
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      for (const file of files) {
        try {
          const stats = await stat(file);
          if (stats.isFile() && stats.mtime > oneHourAgo) {
            recentFiles.push(file);
          }
        } catch {
          // Skip files we can't stat
          continue;
        }
      }

      return recentFiles;
    } catch {
      return [];
    }
  }

  private async detectProjectType(): Promise<string> {
    try {
      const files = await readdir('.');
      const fileSet = new Set(files);

      // Web app indicators
      if (fileSet.has('package.json')) {
        if (fileSet.has('public') || fileSet.has('index.html') || fileSet.has('src')) {
          if (fileSet.has('routes') || fileSet.has('models')) {
            return 'api';
          }
          return 'web_app';
        }
        return 'node_project';
      }

      // Python project
      if (fileSet.has('requirements.txt') || fileSet.has('setup.py') || fileSet.has('pyproject.toml')) {
        return 'python_project';
      }

      // Go project
      if (fileSet.has('go.mod') || fileSet.has('main.go')) {
        return 'go_project';
      }

      // Rust project
      if (fileSet.has('Cargo.toml')) {
        return 'rust_project';
      }

      return 'unknown';
    } catch {
      return 'unknown';
    }
  }
}