// Git Integration - Version control for routing state and workflow history

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { stringify as yamlStringify } from 'yaml';
import type { WorkflowId, RoutingRequestId } from './types';
import type { WorkflowDefinition } from './orchestration-types';

const execAsync = promisify(exec);

export interface GitOperationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

export interface GitCommitInfo {
  readonly hash: string;
  readonly message: string;
  readonly author: string;
  readonly date: Date;
  readonly files: ReadonlyArray<string>;
}

export interface WorkflowSnapshot {
  readonly workflow_id: WorkflowId;
  readonly routing_id: RoutingRequestId;
  readonly workflow_state: WorkflowDefinition;
  readonly commit_hash: string;
  readonly snapshot_date: Date;
  readonly tags: ReadonlyArray<string>;
}

export class GitIntegration {
  private readonly routingDirectory: string;
  private readonly repositoryPath: string;

  constructor(routingDirectory: string) {
    this.routingDirectory = routingDirectory;
    this.repositoryPath = routingDirectory;
  }

  // Initialize Git repository for routing state
  async initializeRepository(): Promise<GitOperationResult<void>> {
    try {
      // Check if already a git repository
      const isRepoResult = await this.isGitRepository();
      if (isRepoResult.success && isRepoResult.data) {
        return { success: true };
      }

      // Initialize new repository
      await execAsync('git init', { cwd: this.routingDirectory });
      
      // Create initial gitignore
      await this.createGitignore();
      
      // Initial commit
      await this.commitChanges('Initial Agent OS routing repository', ['.gitignore']);
      
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'GIT_INIT_ERROR',
          message: `Failed to initialize Git repository: ${error.message}`
        }
      };
    }
  }

  // Check if directory is a Git repository
  async isGitRepository(): Promise<GitOperationResult<boolean>> {
    try {
      await execAsync('git rev-parse --git-dir', { cwd: this.routingDirectory });
      return { success: true, data: true };
    } catch (error: any) {
      return { success: true, data: false };
    }
  }

  // Commit workflow changes
  async commitWorkflowChanges(
    workflow: WorkflowDefinition,
    message?: string
  ): Promise<GitOperationResult<string>> {
    try {
      const files = [
        `workflows/active/${workflow.workflow_id}.yml`,
        `progress/${workflow.workflow_id}-progress.yml`,
        `logs/${workflow.workflow_id}-log.md`
      ];

      const commitMessage = message || `Update workflow ${workflow.name} (${workflow.workflow_id})`;
      const commitHash = await this.commitChanges(commitMessage, files);
      
      // Tag important milestones
      if (workflow.status === 'completed') {
        await this.tagCommit(commitHash, `workflow-${workflow.workflow_id}-completed`);
      }

      return { success: true, data: commitHash };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_COMMIT_ERROR',
          message: `Failed to commit workflow changes: ${error.message}`
        }
      };
    }
  }

  // Commit feedback and learning updates
  async commitLearningUpdates(message?: string): Promise<GitOperationResult<string>> {
    try {
      const files = [
        'feedback/*.yml',
        'learning-model.yml',
        'agent-registry.yml'
      ];

      const commitMessage = message || `Update learning model and feedback data`;
      const commitHash = await this.commitChanges(commitMessage, files);

      return { success: true, data: commitHash };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'LEARNING_COMMIT_ERROR',
          message: `Failed to commit learning updates: ${error.message}`
        }
      };
    }
  }

  // Create workflow snapshot
  async createWorkflowSnapshot(workflow: WorkflowDefinition): Promise<GitOperationResult<WorkflowSnapshot>> {
    try {
      // Commit current state
      const commitResult = await this.commitWorkflowChanges(workflow, 
        `Snapshot workflow ${workflow.name} at ${workflow.status} state`);
      
      if (!commitResult.success || !commitResult.data) {
        return {
          success: false,
          error: commitResult.error
        };
      }

      const snapshot: WorkflowSnapshot = {
        workflow_id: workflow.workflow_id,
        routing_id: workflow.routing_id,
        workflow_state: workflow,
        commit_hash: commitResult.data,
        snapshot_date: new Date(),
        tags: [`${workflow.status}`, `workflow-${workflow.workflow_id}`]
      };

      // Save snapshot metadata
      const snapshotFile = join(this.routingDirectory, 'snapshots', `${workflow.workflow_id}-snapshot.yml`);
      await writeFile(snapshotFile, yamlStringify(snapshot), 'utf-8');

      // Commit snapshot metadata
      await this.commitChanges(`Add snapshot for workflow ${workflow.workflow_id}`, [
        `snapshots/${workflow.workflow_id}-snapshot.yml`
      ]);

      return { success: true, data: snapshot };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'SNAPSHOT_CREATE_ERROR',
          message: `Failed to create workflow snapshot: ${error.message}`
        }
      };
    }
  }

  // Get workflow history
  async getWorkflowHistory(
    workflowId: WorkflowId,
    limit: number = 20
  ): Promise<GitOperationResult<ReadonlyArray<GitCommitInfo>>> {
    try {
      const { stdout } = await execAsync(
        `git log --oneline --grep="workflow.*${workflowId}" --format="%H|%s|%an|%ad|%n" --date=iso -${limit}`,
        { cwd: this.routingDirectory }
      );

      const commits: GitCommitInfo[] = [];
      const lines = stdout.trim().split('\n').filter(line => line.length > 0);

      for (const line of lines) {
        const [hash, message, author, dateStr] = line.split('|');
        if (hash && message && author && dateStr) {
          // Get files changed in this commit
          const filesResult = await execAsync(
            `git diff-tree --no-commit-id --name-only -r ${hash}`,
            { cwd: this.routingDirectory }
          );

          commits.push({
            hash: hash.trim(),
            message: message.trim(),
            author: author.trim(),
            date: new Date(dateStr.trim()),
            files: filesResult.stdout.trim().split('\n').filter(f => f.length > 0)
          });
        }
      }

      return { success: true, data: commits };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_HISTORY_ERROR',
          message: `Failed to get workflow history: ${error.message}`
        }
      };
    }
  }

  // Restore workflow from snapshot
  async restoreWorkflowSnapshot(
    snapshotHash: string,
    workflowId: WorkflowId
  ): Promise<GitOperationResult<WorkflowDefinition>> {
    try {
      // Create a new branch for restoration
      const branchName = `restore-${workflowId}-${Date.now()}`;
      await execAsync(`git checkout -b ${branchName}`, { cwd: this.routingDirectory });

      // Reset to snapshot commit
      await execAsync(`git reset --hard ${snapshotHash}`, { cwd: this.routingDirectory });

      // Read workflow state from that commit
      const workflowFile = join(this.routingDirectory, 'workflows', 'active', `${workflowId}.yml`);
      const workflowContent = await readFile(workflowFile, 'utf-8');
      const workflow = JSON.parse(workflowContent) as WorkflowDefinition;

      // Switch back to main branch
      await execAsync('git checkout main', { cwd: this.routingDirectory });

      return { success: true, data: workflow };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'SNAPSHOT_RESTORE_ERROR',
          message: `Failed to restore workflow snapshot: ${error.message}`
        }
      };
    }
  }

  // Get repository status
  async getRepositoryStatus(): Promise<GitOperationResult<{
    branch: string;
    uncommittedChanges: ReadonlyArray<string>;
    totalCommits: number;
    lastCommit: GitCommitInfo | null;
  }>> {
    try {
      // Get current branch
      const { stdout: branchOutput } = await execAsync('git branch --show-current', { 
        cwd: this.routingDirectory 
      });
      const branch = branchOutput.trim();

      // Get uncommitted changes
      const { stdout: statusOutput } = await execAsync('git status --porcelain', { 
        cwd: this.routingDirectory 
      });
      const uncommittedChanges = statusOutput.trim().split('\n')
        .filter(line => line.length > 0)
        .map(line => line.substring(3)); // Remove status prefix

      // Get total commit count
      const { stdout: countOutput } = await execAsync('git rev-list --count HEAD', { 
        cwd: this.routingDirectory 
      });
      const totalCommits = parseInt(countOutput.trim(), 10);

      // Get last commit
      let lastCommit: GitCommitInfo | null = null;
      try {
        const { stdout: lastCommitOutput } = await execAsync(
          'git log -1 --format="%H|%s|%an|%ad" --date=iso', 
          { cwd: this.routingDirectory }
        );
        
        const [hash, message, author, dateStr] = lastCommitOutput.trim().split('|');
        if (hash && message && author && dateStr) {
          lastCommit = {
            hash: hash.trim(),
            message: message.trim(),
            author: author.trim(),
            date: new Date(dateStr.trim()),
            files: [] // Would need separate call to get files
          };
        }
      } catch (error) {
        // No commits yet
      }

      return {
        success: true,
        data: {
          branch,
          uncommittedChanges,
          totalCommits,
          lastCommit
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'REPOSITORY_STATUS_ERROR',
          message: `Failed to get repository status: ${error.message}`
        }
      };
    }
  }

  // Create and push backup to remote
  async createBackup(remoteName: string = 'backup'): Promise<GitOperationResult<void>> {
    try {
      // Check if remote exists
      const { stdout: remoteOutput } = await execAsync('git remote', { 
        cwd: this.routingDirectory 
      });
      
      if (remoteOutput.includes(remoteName)) {
        // Push to existing remote
        await execAsync(`git push ${remoteName} --all`, { cwd: this.routingDirectory });
        await execAsync(`git push ${remoteName} --tags`, { cwd: this.routingDirectory });
      } else {
        return {
          success: false,
          error: {
            code: 'REMOTE_NOT_CONFIGURED',
            message: `Remote '${remoteName}' not configured. Please add remote first.`
          }
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'BACKUP_ERROR',
          message: `Failed to create backup: ${error.message}`
        }
      };
    }
  }

  // Private helper methods
  private async createGitignore(): Promise<void> {
    const gitignoreContent = `
# Agent OS Routing - Git Ignore

# Temporary files
*.tmp
*.temp
.DS_Store

# Node modules (if any)
node_modules/

# Logs with sensitive data
logs/sensitive/

# Local configuration
.env.local
config/local.yml

# Cache directories
.cache/
temp/

# Editor files
.vscode/settings.json
.idea/workspace.xml

# OS generated files
Thumbs.db
`.trim();

    const gitignorePath = join(this.routingDirectory, '.gitignore');
    await writeFile(gitignorePath, gitignoreContent, 'utf-8');
  }

  private async commitChanges(message: string, files: ReadonlyArray<string>): Promise<string> {
    // Stage files
    for (const file of files) {
      try {
        await execAsync(`git add "${file}"`, { cwd: this.routingDirectory });
      } catch (error) {
        // File might not exist, continue with others
        console.warn(`Warning: Could not stage file ${file}`);
      }
    }

    // Check if there are any staged changes
    const { stdout: statusOutput } = await execAsync('git status --porcelain --cached', { 
      cwd: this.routingDirectory 
    });

    if (statusOutput.trim().length === 0) {
      // No staged changes, create empty commit if needed
      await execAsync(`git commit --allow-empty -m "${message}"`, { 
        cwd: this.routingDirectory 
      });
    } else {
      // Commit staged changes
      await execAsync(`git commit -m "${message}"`, { 
        cwd: this.routingDirectory 
      });
    }

    // Get commit hash
    const { stdout: hashOutput } = await execAsync('git rev-parse HEAD', { 
      cwd: this.routingDirectory 
    });
    
    return hashOutput.trim();
  }

  private async tagCommit(commitHash: string, tagName: string): Promise<void> {
    try {
      await execAsync(`git tag -a "${tagName}" ${commitHash} -m "Auto-tag: ${tagName}"`, { 
        cwd: this.routingDirectory 
      });
    } catch (error) {
      // Tag might already exist, ignore error
      console.warn(`Warning: Could not create tag ${tagName}`);
    }
  }
}