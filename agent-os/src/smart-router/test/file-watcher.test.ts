import { FileWatcher } from '../file-watcher';
import type { DirectoryPath, FileWatchEvent } from '../communication-types';
import { jest } from '@jest/globals';
import { EventEmitter } from 'events';

// Mock chokidar
jest.mock('chokidar');
import chokidar from 'chokidar';

const mockedChokidar = jest.mocked(chokidar);

describe('FileWatcher', () => {
  let fileWatcher: FileWatcher;
  let testDirectory: DirectoryPath;
  let mockWatcher: any;
  let eventCallback: ((event: FileWatchEvent) => void) | null;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    testDirectory = '/test/routing/requests' as DirectoryPath;
    fileWatcher = new FileWatcher(testDirectory);
    eventCallback = null;

    // Create mock watcher that extends EventEmitter
    mockWatcher = new EventEmitter();
    mockWatcher.close = jest.fn().mockResolvedValue(undefined);
    mockWatcher.add = jest.fn().mockReturnThis();
    mockWatcher.unwatch = jest.fn().mockReturnThis();

    mockedChokidar.watch.mockReturnValue(mockWatcher);

    jest.clearAllMocks();
  });

  afterEach(() => {
    if (eventCallback) {
      eventCallback = null;
    }
    consoleErrorSpy.mockRestore();
  });

  describe('initialization', () => {
    it('should create FileWatcher with directory path', () => {
      expect(fileWatcher).toBeInstanceOf(FileWatcher);
      expect(fileWatcher.isWatching()).toBe(false);
    });

    it('should not be watching initially', () => {
      expect(fileWatcher.isWatching()).toBe(false);
    });
  });

  describe('start watching', () => {
    it('should start watching directory successfully', async () => {
      const result = await fileWatcher.start();

      expect(result.success).toBe(true);
      expect(fileWatcher.isWatching()).toBe(true);
      expect(mockedChokidar.watch).toHaveBeenCalledWith(testDirectory, {
        ignored: /^\./,
        persistent: true,
        ignoreInitial: true
      });
    });

    it('should handle start errors gracefully', async () => {
      mockedChokidar.watch.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await fileWatcher.start();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('WATCHER_START_ERROR');
        expect(result.error.message).toContain('Permission denied');
      }
      expect(fileWatcher.isWatching()).toBe(false);
    });

    it('should not start if already watching', async () => {
      // Start first time
      await fileWatcher.start();
      expect(fileWatcher.isWatching()).toBe(true);

      // Try to start again
      const result = await fileWatcher.start();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('ALREADY_WATCHING');
      }
    });
  });

  describe('stop watching', () => {
    beforeEach(async () => {
      await fileWatcher.start();
    });

    it('should stop watching successfully', async () => {
      const result = await fileWatcher.stop();

      expect(result.success).toBe(true);
      expect(fileWatcher.isWatching()).toBe(false);
      expect(mockWatcher.close).toHaveBeenCalled();
    });

    it('should handle stop errors gracefully', async () => {
      mockWatcher.close.mockRejectedValue(new Error('Close failed'));

      const result = await fileWatcher.stop();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('WATCHER_STOP_ERROR');
      }
    });

    it('should not stop if not watching', async () => {
      await fileWatcher.stop(); // Stop first time
      
      const result = await fileWatcher.stop(); // Try to stop again

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NOT_WATCHING');
      }
    });
  });

  describe('file events', () => {
    beforeEach(async () => {
      await fileWatcher.start();
    });

    it('should register event callback', () => {
      const callback = jest.fn();
      fileWatcher.onFileEvent(callback);

      // Simulate file event
      mockWatcher.emit('add', '/test/routing/requests/new-file.yml');

      expect(callback).toHaveBeenCalledWith({
        event_type: 'add',
        file_path: '/test/routing/requests/new-file.yml',
        timestamp: expect.any(Date)
      });
    });

    it('should handle file added events', () => {
      const events: FileWatchEvent[] = [];
      fileWatcher.onFileEvent((event) => events.push(event));

      mockWatcher.emit('add', '/test/routing/requests/request-123.yml');

      expect(events).toHaveLength(1);
      expect(events[0].event_type).toBe('add');
      expect(events[0].file_path).toBe('/test/routing/requests/request-123.yml');
      expect(events[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle file changed events', () => {
      const events: FileWatchEvent[] = [];
      fileWatcher.onFileEvent((event) => events.push(event));

      mockWatcher.emit('change', '/test/routing/requests/request-123.yml');

      expect(events).toHaveLength(1);
      expect(events[0].event_type).toBe('change');
      expect(events[0].file_path).toBe('/test/routing/requests/request-123.yml');
    });

    it('should handle file removed events', () => {
      const events: FileWatchEvent[] = [];
      fileWatcher.onFileEvent((event) => events.push(event));

      mockWatcher.emit('unlink', '/test/routing/requests/request-123.yml');

      expect(events).toHaveLength(1);
      expect(events[0].event_type).toBe('unlink');
      expect(events[0].file_path).toBe('/test/routing/requests/request-123.yml');
    });

    it('should handle multiple callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      fileWatcher.onFileEvent(callback1);
      fileWatcher.onFileEvent(callback2);

      mockWatcher.emit('add', '/test/file.yml');

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle all file events from chokidar', () => {
      const events: FileWatchEvent[] = [];
      fileWatcher.onFileEvent((event) => events.push(event));

      // FileWatcher processes whatever events chokidar sends
      // (chokidar filtering happens at the OS level, not in our mock)
      mockWatcher.emit('add', '/test/routing/requests/visible-file.yml');

      expect(events).toHaveLength(1);
      expect(events[0].file_path).toBe('/test/routing/requests/visible-file.yml');
      expect(events[0].event_type).toBe('add');
    });

    it('should handle watcher errors', () => {
      const errors: Error[] = [];
      fileWatcher.onFileEvent(() => {}); // Register some callback

      // Simulate watcher error
      const error = new Error('Watch error');
      mockWatcher.emit('error', error);

      // Error should be handled gracefully (not crash the process)
      expect(() => mockWatcher.emit('error', error)).not.toThrow();
    });
  });

  describe('lifecycle management', () => {
    it('should handle rapid start/stop cycles', async () => {
      // Start
      let result = await fileWatcher.start();
      expect(result.success).toBe(true);
      expect(fileWatcher.isWatching()).toBe(true);

      // Stop
      result = await fileWatcher.stop();
      expect(result.success).toBe(true);
      expect(fileWatcher.isWatching()).toBe(false);

      // Start again
      result = await fileWatcher.start();
      expect(result.success).toBe(true);
      expect(fileWatcher.isWatching()).toBe(true);
    });

    it('should cleanup properly when stopped', async () => {
      await fileWatcher.start();
      
      const callback = jest.fn();
      fileWatcher.onFileEvent(callback);

      await fileWatcher.stop();

      // Events after stopping should not trigger callbacks
      mockWatcher.emit('add', '/test/file.yml');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle callback errors gracefully', async () => {
      await fileWatcher.start();
      
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });
      
      fileWatcher.onFileEvent(errorCallback);

      // Should not crash when callback throws
      expect(() => {
        mockWatcher.emit('add', '/test/file.yml');
      }).not.toThrow();

      expect(errorCallback).toHaveBeenCalled();
    });

    it('should handle invalid directory paths', async () => {
      const invalidWatcher = new FileWatcher('/invalid/path' as DirectoryPath);
      
      mockedChokidar.watch.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      const result = await invalidWatcher.start();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('WATCHER_START_ERROR');
        expect(result.error.message).toContain('no such file or directory');
      }
    });
  });
});