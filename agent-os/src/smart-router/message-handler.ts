import { writeFile, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type {
  IAgentMessageHandler,
  AgentMessage,
  MessageId,
  RoutingRequestId,
  DirectoryStructure,
  FileOperationResult,
  MessageType
} from './communication-types';
import type { RegistryId } from './registry-types';
import { CommunicationError } from './communication-types';

export class AgentMessageHandler implements IAgentMessageHandler {
  constructor(private readonly directories: DirectoryStructure) {}

  async sendMessage(message: AgentMessage): Promise<FileOperationResult<void>> {
    // Validate message structure
    const validation = this.validateMessageStructure(message);
    if (!validation.success) {
      return validation;
    }

    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
      const random = Math.random().toString(36).substring(2, 5);
      const filename = `${message.routing_id}-${message.from}-${timestamp}-${random}.md`;
      const filePath = join(this.directories.messages, filename);

      // Create markdown content
      const markdownContent = this.createMarkdownMessage(message);

      // Write message to file
      await writeFile(filePath, markdownContent, 'utf-8');

      return {
        success: true,
        data: undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to send message: ${error.message}`,
          'MESSAGE_WRITE_ERROR'
        )
      };
    }
  }

  async readMessages(routingId: RoutingRequestId): Promise<FileOperationResult<ReadonlyArray<AgentMessage>>> {
    try {
      // Read all files in messages directory
      const files = await readdir(this.directories.messages);
      
      // Filter files by routing ID
      const relevantFiles = files.filter(file => 
        file.startsWith(`${routingId}-`) && file.endsWith('.md')
      );

      const messages: AgentMessage[] = [];

      // Read and parse each message file
      for (const file of relevantFiles) {
        try {
          const filePath = join(this.directories.messages, file);
          const content = await readFile(filePath, 'utf-8');
          const message = this.parseMarkdownMessage(content);
          
          if (message) {
            messages.push(message);
          }
        } catch (error) {
          // Skip malformed message files but continue processing
          console.warn(`Failed to parse message file ${file}:`, error);
        }
      }

      // Sort messages by timestamp
      messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      return {
        success: true,
        data: messages
      };

    } catch (error: any) {
      return {
        success: false,
        error: new CommunicationError(
          `Failed to read messages: ${error.message}`,
          'MESSAGE_READ_ERROR'
        )
      };
    }
  }

  async createTaskHandoff(
    from: RegistryId, 
    to: RegistryId, 
    routingId: RoutingRequestId, 
    content: string
  ): Promise<FileOperationResult<void>> {
    // Validate parameters
    if (!from || !to || !routingId || !content) {
      return {
        success: false,
        error: new CommunicationError(
          'All parameters (from, to, routingId, content) are required',
          'INVALID_HANDOFF_PARAMETERS'
        )
      };
    }

    // Create handoff message
    const message: AgentMessage = {
      message_id: this.generateMessageId(),
      from: from,
      to: to,
      routing_id: routingId,
      timestamp: new Date().toISOString(),
      type: 'task_handoff',
      content: content,
      metadata: {
        handoff_type: 'automatic',
        created_by: 'routing-system'
      }
    };

    return await this.sendMessage(message);
  }

  parseMarkdownMessage(markdownContent: string): AgentMessage | null {
    try {
      const lines = markdownContent.split('\n');
      
      // Extract metadata from markdown headers
      const metadata: Record<string, string> = {};
      let contentStartIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '## Message' || line.startsWith('## ')) {
          contentStartIndex = i + 1;
          break;
        }
        
        // Parse metadata lines like **Field:** value
        const metaMatch = line.match(/^\*\*(.+):\*\*\s*(.+)$/);
        if (metaMatch) {
          const [, field, value] = metaMatch;
          metadata[field.toLowerCase().replace(' ', '_')] = value;
        }
      }

      // Extract message content
      const contentLines = lines.slice(contentStartIndex).join('\n').trim();

      // Validate required fields
      if (!metadata.message_id || !metadata.from || !metadata.routing_id) {
        return null;
      }

      return {
        message_id: metadata.message_id as MessageId,
        from: metadata.from as RegistryId,
        to: (metadata.to || '') as RegistryId,
        routing_id: metadata.routing_id as RoutingRequestId,
        timestamp: metadata.timestamp || new Date().toISOString(),
        type: (metadata.type || 'status_update') as MessageType,
        content: contentLines,
        metadata: {}
      };

    } catch (error) {
      console.error('Error parsing markdown message:', error);
      return null;
    }
  }

  private validateMessageStructure(message: AgentMessage): FileOperationResult<void> {
    const requiredFields: (keyof AgentMessage)[] = [
      'message_id', 'from', 'to', 'routing_id', 'timestamp', 'type', 'content'
    ];

    for (const field of requiredFields) {
      if (!message[field]) {
        return {
          success: false,
          error: new CommunicationError(
            `Missing required field: ${field}`,
            'INVALID_MESSAGE_FORMAT'
          )
        };
      }
    }

    return {
      success: true,
      data: undefined
    };
  }

  private createMarkdownMessage(message: AgentMessage): string {
    const lines: string[] = [];

    // Header
    lines.push('# Agent Message');
    lines.push('');

    // Metadata
    lines.push(`**Message ID:** ${message.message_id}`);
    lines.push(`**From:** ${message.from}`);
    lines.push(`**To:** ${message.to}`);
    lines.push(`**Routing ID:** ${message.routing_id}`);
    lines.push(`**Timestamp:** ${message.timestamp}`);
    lines.push(`**Type:** ${message.type}`);
    lines.push('');

    // Message content
    lines.push('## Message');
    lines.push('');
    lines.push(message.content);

    // Metadata section if present
    if (message.metadata && Object.keys(message.metadata).length > 0) {
      lines.push('');
      lines.push('## Metadata');
      lines.push('');
      for (const [key, value] of Object.entries(message.metadata)) {
        lines.push(`**${key}:** ${value}`);
      }
    }

    return lines.join('\n');
  }

  private generateMessageId(): MessageId {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -1);
    const random = Math.random().toString(36).substring(2, 8);
    return `msg-${timestamp}-${random}` as MessageId;
  }
}