import chokidar from 'chokidar';
import type {
  IFileWatcher,
  DirectoryPath,
  FileWatchEvent,
  FileOperationResult
} from './communication-types';
import { CommunicationError } from './communication-types';

export class FileWatcher implements IFileWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private callbacks: ((event: FileWatchEvent) => void)[] = [];
  private watching = false;

  constructor(private readonly directory: DirectoryPath) {}

  async start(): Promise<FileOperationResult<void>> {
    if (this.watching) {
      return {
        success: false,
        error: new CommunicationError(
          'FileWatcher is already watching',
          'ALREADY_WATCHING'
        )
      };
    }

    try {
      this.watcher = chokidar.watch(this.directory, {
        ignored: /^\./,
        persistent: true,
        ignoreInitial: true
      });

      // Set up event listeners
      this.watcher.on('add', (path: string) => {
        this.handleFileEvent('add', path);
      });

      this.watcher.on('change', (path: string) => {
        this.handleFileEvent('change', path);
      });

      this.watcher.on('unlink', (path: string) => {
        this.handleFileEvent('unlink', path);
      });

      this.watcher.on('error', (error: Error) => {
        console.error('FileWatcher error:', error);
        // Handle errors gracefully without crashing
      });

      this.watching = true;

      return {
        success: true,
        data: undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to start file watcher: ${error.message}`,
          'WATCHER_START_ERROR'
        )
      };
    }
  }

  async stop(): Promise<FileOperationResult<void>> {
    if (!this.watching) {
      return {
        success: false,
        error: new CommunicationError(
          'FileWatcher is not currently watching',
          'NOT_WATCHING'
        )
      };
    }

    try {
      if (this.watcher) {
        await this.watcher.close();
        this.watcher = null;
      }

      this.watching = false;
      this.callbacks = []; // Clear callbacks

      return {
        success: true,
        data: undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to stop file watcher: ${error.message}`,
          'WATCHER_STOP_ERROR'
        )
      };
    }
  }

  onFileEvent(callback: (event: FileWatchEvent) => void): void {
    this.callbacks.push(callback);
  }

  isWatching(): boolean {
    return this.watching;
  }

  private handleFileEvent(eventType: 'add' | 'change' | 'unlink', filePath: string): void {
    const event: FileWatchEvent = {
      event_type: eventType,
      file_path: filePath,
      timestamp: new Date()
    };

    // Notify all callbacks
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in file event callback:', error);
        // Continue with other callbacks even if one fails
      }
    }
  }
}