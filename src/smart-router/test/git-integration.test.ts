// Git Integration Tests

import { jest } from '@jest/globals';
import { GitIntegration } from '../git-integration';
import type { WorkflowDefinition } from '../orchestration-types';

// Mock child_process
jest.mock('child_process', () => ({
  exec: jest.fn()
}));

// Mock fs/promises
jest.mock('fs/promises');
import * as fs from 'fs/promises';
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock util
jest.mock('util', () => ({
  promisify: jest.fn(() => jest.fn())
}));

describe('GitIntegration', () => {
  let gitIntegration: GitIntegration;
  let mockExecAsync: jest.MockedFunction<any>;
  const testDirectory = '/test/routing';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked promisify function
    const { promisify } = require('util');
    mockExecAsync = promisify();
    mockExecAsync.mockResolvedValue({ stdout: '', stderr: '' });
    
    gitIntegration = new GitIntegration(testDirectory);
  });

  describe('initializeRepository', () => {
    it('should initialize new git repository successfully', async () => {
      // Mock that directory is not a git repo
      mockExecAsync
        .mockRejectedValueOnce(new Error('Not a git repository')) // isGitRepository
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git init
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git add
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git commit
        .mockResolvedValueOnce({ stdout: 'abc123', stderr: '' }); // git rev-parse HEAD

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await gitIntegration.initializeRepository();

      expect(result.success).toBe(true);
      expect(mockExecAsync).toHaveBeenCalledWith('git init', { cwd: testDirectory });
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should skip initialization if already a git repository', async () => {
      // Mock that directory is already a git repo
      mockExecAsync.mockResolvedValueOnce({ stdout: '.git', stderr: '' });

      const result = await gitIntegration.initializeRepository();

      expect(result.success).toBe(true);
      expect(mockExecAsync).toHaveBeenCalledWith('git rev-parse --git-dir', { cwd: testDirectory });
    });

    it('should handle initialization errors', async () => {
      mockExecAsync
        .mockRejectedValueOnce(new Error('Not a git repository')) // isGitRepository
        .mockRejectedValueOnce(new Error('Git init failed')); // git init

      const result = await gitIntegration.initializeRepository();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('GIT_INIT_ERROR');
    });
  });

  describe('isGitRepository', () => {
    it('should return true for git repository', async () => {
      mockExecAsync.mockResolvedValue({ stdout: '.git', stderr: '' });

      const result = await gitIntegration.isGitRepository();

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should return false for non-git directory', async () => {
      mockExecAsync.mockRejectedValue(new Error('Not a git repository'));

      const result = await gitIntegration.isGitRepository();

      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    });
  });

  describe('commitWorkflowChanges', () => {
    it('should commit workflow changes successfully', async () => {
      const mockWorkflow: WorkflowDefinition = {
        workflow_id: 'test-workflow-1' as any,
        routing_id: 'routing-1' as any,
        name: 'Test Workflow',
        description: 'Test workflow description',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        steps: [],
        total_estimated_duration: 60
      };

      mockExecAsync
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git add (file 1)
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git add (file 2)
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git add (file 3)
        .mockResolvedValueOnce({ stdout: 'M  file1.yml\n', stderr: '' }) // git status --porcelain --cached
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git commit
        .mockResolvedValueOnce({ stdout: 'abc123def\n', stderr: '' }); // git rev-parse HEAD

      const result = await gitIntegration.commitWorkflowChanges(mockWorkflow);

      expect(result.success).toBe(true);
      expect(result.data).toBe('abc123def');
      expect(mockExecAsync).toHaveBeenCalledWith(
        'git commit -m "Update workflow Test Workflow (test-workflow-1)"',
        { cwd: testDirectory }
      );
    });

    it('should tag completed workflows', async () => {
      const mockWorkflow: WorkflowDefinition = {
        workflow_id: 'completed-workflow' as any,
        routing_id: 'routing-1' as any,
        name: 'Completed Workflow',
        description: 'Completed workflow',
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date(),
        steps: [],
        total_estimated_duration: 60
      };

      mockExecAsync
        .mockResolvedValue({ stdout: '', stderr: '' }) // git add commands
        .mockResolvedValueOnce({ stdout: 'M  file1.yml\n', stderr: '' }) // git status --porcelain --cached
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git commit
        .mockResolvedValueOnce({ stdout: 'def456\n', stderr: '' }) // git rev-parse HEAD
        .mockResolvedValueOnce({ stdout: '', stderr: '' }); // git tag

      const result = await gitIntegration.commitWorkflowChanges(mockWorkflow);

      expect(result.success).toBe(true);
      expect(mockExecAsync).toHaveBeenCalledWith(
        expect.stringContaining('git tag -a "workflow-completed-workflow-completed" def456'),
        { cwd: testDirectory }
      );
    });

    it('should handle commit errors', async () => {
      const mockWorkflow: WorkflowDefinition = {
        workflow_id: 'error-workflow' as any,
        routing_id: 'routing-1' as any,
        name: 'Error Workflow',
        description: 'Workflow with error',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        steps: [],
        total_estimated_duration: 60
      };

      mockExecAsync.mockRejectedValue(new Error('Git commit failed'));

      const result = await gitIntegration.commitWorkflowChanges(mockWorkflow);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_COMMIT_ERROR');
    });
  });

  describe('getWorkflowHistory', () => {
    it('should get workflow history successfully', async () => {
      const mockGitLog = `abc123|Update workflow Test (test-workflow)|author|2024-01-01 10:00:00 +0000|
def456|Complete workflow Test (test-workflow)|author|2024-01-01 11:00:00 +0000|`;

      const mockFilesOutput = `workflows/active/test-workflow.yml
logs/test-workflow-log.md`;

      mockExecAsync
        .mockResolvedValueOnce({ stdout: mockGitLog, stderr: '' }) // git log
        .mockResolvedValueOnce({ stdout: mockFilesOutput, stderr: '' }) // git diff-tree (first commit)
        .mockResolvedValueOnce({ stdout: mockFilesOutput, stderr: '' }); // git diff-tree (second commit)

      const result = await gitIntegration.getWorkflowHistory('test-workflow' as any, 10);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBe(2);
      expect(result.data![0].hash).toBe('abc123');
      expect(result.data![0].files.length).toBe(2);
    });

    it('should handle empty git log', async () => {
      mockExecAsync.mockResolvedValue({ stdout: '', stderr: '' });

      const result = await gitIntegration.getWorkflowHistory('test-workflow' as any);

      expect(result.success).toBe(true);
      expect(result.data!.length).toBe(0);
    });

    it('should handle git log errors', async () => {
      mockExecAsync.mockRejectedValue(new Error('Git log failed'));

      const result = await gitIntegration.getWorkflowHistory('test-workflow' as any);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WORKFLOW_HISTORY_ERROR');
    });
  });

  describe('getRepositoryStatus', () => {
    it('should get repository status successfully', async () => {
      mockExecAsync
        .mockResolvedValueOnce({ stdout: 'main\n', stderr: '' }) // git branch --show-current
        .mockResolvedValueOnce({ stdout: ' M file1.yml\n?? file2.yml\n', stderr: '' }) // git status --porcelain
        .mockResolvedValueOnce({ stdout: '15\n', stderr: '' }) // git rev-list --count HEAD
        .mockResolvedValueOnce({ 
          stdout: 'abc123|Last commit message|author|2024-01-01 12:00:00 +0000\n', 
          stderr: '' 
        }); // git log -1

      const result = await gitIntegration.getRepositoryStatus();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.branch).toBe('main');
      expect(result.data!.uncommittedChanges.length).toBe(2);
      expect(result.data!.totalCommits).toBe(15);
      expect(result.data!.lastCommit).toBeDefined();
    });

    it('should handle repository with no commits', async () => {
      mockExecAsync
        .mockResolvedValueOnce({ stdout: 'main\n', stderr: '' }) // git branch --show-current
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git status --porcelain
        .mockResolvedValueOnce({ stdout: '0\n', stderr: '' }) // git rev-list --count HEAD
        .mockRejectedValueOnce(new Error('No commits')); // git log -1

      const result = await gitIntegration.getRepositoryStatus();

      expect(result.success).toBe(true);
      expect(result.data!.lastCommit).toBeNull();
    });
  });

  describe('createWorkflowSnapshot', () => {
    it('should create workflow snapshot successfully', async () => {
      const mockWorkflow: WorkflowDefinition = {
        workflow_id: 'snapshot-workflow' as any,
        routing_id: 'routing-1' as any,
        name: 'Snapshot Workflow',
        description: 'Workflow for snapshot',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        steps: [],
        total_estimated_duration: 60
      };

      // Mock successful commit
      mockExecAsync
        .mockResolvedValue({ stdout: '', stderr: '' }) // git add commands
        .mockResolvedValueOnce({ stdout: 'M  file1.yml\n', stderr: '' }) // git status --porcelain --cached
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git commit
        .mockResolvedValueOnce({ stdout: 'snapshot123\n', stderr: '' }) // git rev-parse HEAD
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git add (snapshot file)
        .mockResolvedValueOnce({ stdout: 'A  snapshots/file\n', stderr: '' }) // git status --porcelain --cached
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git commit (snapshot)
        .mockResolvedValueOnce({ stdout: 'snapshot456\n', stderr: '' }); // git rev-parse HEAD (final)

      jest.spyOn(mockedFs, 'writeFile').mockResolvedValue();

      const result = await gitIntegration.createWorkflowSnapshot(mockWorkflow);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.workflow_id).toBe('snapshot-workflow');
      expect(result.data!.commit_hash).toBe('snapshot123');
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('createBackup', () => {
    it('should create backup to existing remote', async () => {
      mockExecAsync
        .mockResolvedValueOnce({ stdout: 'origin\nbackup\n', stderr: '' }) // git remote
        .mockResolvedValueOnce({ stdout: '', stderr: '' }) // git push --all
        .mockResolvedValueOnce({ stdout: '', stderr: '' }); // git push --tags

      const result = await gitIntegration.createBackup('backup');

      expect(result.success).toBe(true);
      expect(mockExecAsync).toHaveBeenCalledWith('git push backup --all', { cwd: testDirectory });
      expect(mockExecAsync).toHaveBeenCalledWith('git push backup --tags', { cwd: testDirectory });
    });

    it('should handle missing remote', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'origin\n', stderr: '' }); // git remote (no backup)

      const result = await gitIntegration.createBackup('missing');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('REMOTE_NOT_CONFIGURED');
    });

    it('should handle backup errors', async () => {
      mockExecAsync
        .mockResolvedValueOnce({ stdout: 'backup\n', stderr: '' }) // git remote
        .mockRejectedValueOnce(new Error('Push failed')); // git push --all

      const result = await gitIntegration.createBackup('backup');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('BACKUP_ERROR');
    });
  });
});