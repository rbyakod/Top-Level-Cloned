import { AgentMessageHandler } from '../message-handler';
import type { 
  AgentMessage, 
  MessageId, 
  RoutingRequestId,
  DirectoryStructure 
} from '../communication-types';
import type { RegistryId } from '../registry-types';
import { jest } from '@jest/globals';
import * as fs from 'fs/promises';

// Mock dependencies
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

describe('AgentMessageHandler', () => {
  let handler: AgentMessageHandler;
  let mockDirectories: DirectoryStructure;
  let mockMessage: AgentMessage;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockDirectories = {
      requests: '/test/routing/requests' as any,
      status: '/test/routing/status' as any,
      history: '/test/routing/history' as any,
      messages: '/test/routing/messages' as any
    };

    handler = new AgentMessageHandler(mockDirectories);

    mockMessage = {
      message_id: 'msg-20250827-143052-001' as MessageId,
      from: 'backend-engineer' as RegistryId,
      to: 'qa-engineer' as RegistryId,
      routing_id: '2025-08-27-143052-fix-bug-payment' as RoutingRequestId,
      timestamp: '2025-08-27T14:38:15Z',
      type: 'task_handoff',
      content: 'I have fixed the payment button issue. Please verify the solution.',
      metadata: {
        changes_made: ['checkout.js:47', 'payment.service.js'],
        test_instructions: 'Test payment flow on staging environment'
      }
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('message sending', () => {
    it('should send agent message successfully', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.sendMessage(mockMessage);

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/routing/messages/'),
        expect.stringContaining('**Message ID:** msg-20250827-143052-001'),
        'utf-8'
      );
    });

    it('should create proper markdown format', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      await handler.sendMessage(mockMessage);

      const writeCall = mockedFs.writeFile.mock.calls[0];
      const content = writeCall[1] as string;

      expect(content).toContain('# Agent Message');
      expect(content).toContain('**From:** backend-engineer');
      expect(content).toContain('**To:** qa-engineer');
      expect(content).toContain('**Type:** task_handoff');
      expect(content).toContain('I have fixed the payment button issue');
    });

    it('should handle file write errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      const result = await handler.sendMessage(mockMessage);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MESSAGE_WRITE_ERROR');
      }
    });

    it('should validate message structure', async () => {
      const invalidMessage = {
        message_id: 'msg-001',
        from: 'agent1',
        // Missing required fields
      } as any;

      const result = await handler.sendMessage(invalidMessage);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_MESSAGE_FORMAT');
      }
    });

    it('should generate unique filenames for concurrent messages', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const message1 = { ...mockMessage, message_id: 'msg-001' as MessageId };
      const message2 = { ...mockMessage, message_id: 'msg-002' as MessageId };

      await Promise.all([
        handler.sendMessage(message1),
        handler.sendMessage(message2)
      ]);

      expect(mockedFs.writeFile).toHaveBeenCalledTimes(2);
      
      const calls = mockedFs.writeFile.mock.calls;
      const filename1 = calls[0][0];
      const filename2 = calls[1][0];
      
      expect(filename1).not.toBe(filename2);
    });
  });

  describe('message reading', () => {
    beforeEach(() => {
      // Use spyOn to mock specific functions
      jest.spyOn(mockedFs, 'readdir').mockClear();
      jest.spyOn(mockedFs, 'readFile').mockClear();
    });

    it('should read messages for routing ID', async () => {
      const routingId = '2025-08-27-143052-fix-bug-payment' as RoutingRequestId;
      const messageFiles = [
        `${routingId}-backend-engineer-20250827143800.md`,
        `${routingId}-qa-engineer-20250827144000.md`
      ];

      const messageContent1 = `# Agent Message

**Message ID:** msg-001
**From:** backend-engineer
**To:** qa-engineer
**Routing ID:** ${routingId}
**Timestamp:** 2025-08-27T14:38:00Z
**Type:** task_handoff

## Message

Task completed successfully.`;

      const messageContent2 = `# Agent Message

**Message ID:** msg-002
**From:** qa-engineer
**To:** backend-engineer
**Routing ID:** ${routingId}
**Timestamp:** 2025-08-27T14:40:00Z
**Type:** status_update

## Message

Validation in progress.`;

      (mockedFs.readdir as jest.Mock).mockResolvedValue(messageFiles);
      (mockedFs.readFile as jest.Mock)
        .mockResolvedValueOnce(messageContent1)
        .mockResolvedValueOnce(messageContent2);

      const result = await handler.readMessages(routingId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].message_id).toBe('msg-001' as MessageId);
        expect(result.data[1].message_id).toBe('msg-002' as MessageId);
      }
    });

    it('should handle empty message directory', async () => {
      const routingId = '2025-08-27-empty' as RoutingRequestId;
      
      (mockedFs.readdir as jest.Mock).mockResolvedValue([]);

      const result = await handler.readMessages(routingId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it('should handle directory read errors', async () => {
      const routingId = '2025-08-27-error' as RoutingRequestId;
      
      (mockedFs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await handler.readMessages(routingId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MESSAGE_READ_ERROR');
      }
    });

    it('should filter messages by routing ID', async () => {
      const routingId = '2025-08-27-target' as RoutingRequestId;
      const messageFiles = [
        `${routingId}-agent1-123.md`,
        `2025-08-27-other-agent2-124.md`, // Different routing ID
        `${routingId}-agent3-125.md`,
        `unrelated-file.txt`
      ];

      (mockedFs.readdir as jest.Mock).mockResolvedValue(messageFiles);
      (mockedFs.readFile as jest.Mock).mockResolvedValue(`# Agent Message
**Message ID:** msg-test
**From:** agent1
**To:** agent2
**Routing ID:** ${routingId}
**Timestamp:** 2025-08-27T14:00:00Z
**Type:** status_update
## Message
Test message`);

      const result = await handler.readMessages(routingId);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should only read files matching the routing ID
        expect(mockedFs.readFile).toHaveBeenCalledTimes(2);
        expect(result.data).toHaveLength(2);
      }
    });

    it('should handle malformed message files gracefully', async () => {
      const routingId = '2025-08-27-malformed' as RoutingRequestId;
      const messageFiles = [`${routingId}-agent1-123.md`];

      (mockedFs.readdir as jest.Mock).mockResolvedValue(messageFiles);
      (mockedFs.readFile as jest.Mock).mockResolvedValue('Invalid message format');

      const result = await handler.readMessages(routingId);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should skip malformed messages but not fail
        expect(result.data).toHaveLength(0);
      }
    });
  });

  describe('task handoff creation', () => {
    it('should create task handoff message', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      const result = await handler.createTaskHandoff(
        'backend-engineer' as RegistryId,
        'qa-engineer' as RegistryId,
        '2025-08-27-143052-fix-bug-payment' as RoutingRequestId,
        'Payment button fix ready for testing'
      );

      expect(result.success).toBe(true);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('/test/routing/messages/'),
        expect.stringContaining('**Type:** task_handoff'),
        'utf-8'
      );
    });

    it('should generate proper handoff message format', async () => {
      mockedFs.writeFile.mockResolvedValue(undefined);

      await handler.createTaskHandoff(
        'backend-engineer' as RegistryId,
        'qa-engineer' as RegistryId,
        '2025-08-27-143052-fix-bug-payment' as RoutingRequestId,
        'Ready for QA validation'
      );

      const writeCall = mockedFs.writeFile.mock.calls[0];
      const content = writeCall[1] as string;

      expect(content).toContain('# Agent Message');
      expect(content).toContain('**From:** backend-engineer');
      expect(content).toContain('**To:** qa-engineer');
      expect(content).toContain('**Type:** task_handoff');
      expect(content).toContain('Ready for QA validation');
    });

    it('should handle handoff creation errors', async () => {
      mockedFs.writeFile.mockRejectedValue(new Error('Disk full'));

      const result = await handler.createTaskHandoff(
        'agent1' as RegistryId,
        'agent2' as RegistryId,
        'routing-123' as RoutingRequestId,
        'Test handoff'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MESSAGE_WRITE_ERROR');
      }
    });

    it('should validate handoff parameters', async () => {
      const result = await handler.createTaskHandoff(
        '' as RegistryId,
        'qa-engineer' as RegistryId,
        '2025-08-27-test' as RoutingRequestId,
        'Test message'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_HANDOFF_PARAMETERS');
      }
    });
  });

  describe('message parsing', () => {
    it('should parse markdown message correctly', () => {
      const markdownContent = `# Agent Message

**Message ID:** msg-123
**From:** backend-engineer
**To:** qa-engineer
**Routing ID:** 2025-08-27-routing
**Timestamp:** 2025-08-27T14:30:00Z
**Type:** task_handoff

## Message

I have completed the backend implementation. 

**Changes Made:**
- Fixed authentication bug
- Updated API endpoints

**Next Steps:**
Please validate the changes on the staging environment.`;

      // This tests the internal parsing logic that would be used
      const parsed = handler.parseMarkdownMessage(markdownContent);

      expect(parsed.message_id).toBe('msg-123' as MessageId);
      expect(parsed.from).toBe('backend-engineer' as RegistryId);
      expect(parsed.to).toBe('qa-engineer' as RegistryId);
      expect(parsed.type).toBe('task_handoff');
      expect(parsed.content).toContain('I have completed the backend implementation');
    });

    it('should handle missing metadata fields gracefully', () => {
      const incompleteMarkdown = `# Agent Message

**Message ID:** msg-456
**From:** agent1

## Message

Incomplete message`;

      const parsed = handler.parseMarkdownMessage(incompleteMarkdown);

      expect(parsed).toBeNull(); // Should return null for incomplete message
    });
  });
});