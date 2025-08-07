
import { ConversationExporter } from '@/utils/conversationExport';
import { ConversationMessage } from '@/types/conversation';

describe('ConversationExporter', () => {
  const mockMessages: ConversationMessage[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01T10:00:00Z'),
      speaker: 'user',
      content: 'Hello world',
      sentiment: 'neutral',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-01T10:01:00Z'),
      speaker: 'agent',
      content: 'Hi there! How can I help?',
      sentiment: 'positive',
    },
    {
      id: '3',
      timestamp: new Date('2024-01-01T10:02:30Z'),
      speaker: 'user',
      content: 'I need assistance',
      sentiment: 'neutral',
    },
  ];

  describe('getSummary', () => {
    test('calculates correct summary statistics', () => {
      const summary = ConversationExporter.getSummary(mockMessages);

      expect(summary.totalMessages).toBe(3);
      expect(summary.userMessages).toBe(2);
      expect(summary.agentMessages).toBe(1);
      expect(summary.wordCount).toBe(9); // "Hello world" + "Hi there! How can I help?" + "I need assistance"
      expect(summary.duration).toBe('3 minutes'); // 2.5 minutes rounded up
    });

    test('handles empty messages array', () => {
      const summary = ConversationExporter.getSummary([]);

      expect(summary.totalMessages).toBe(0);
      expect(summary.userMessages).toBe(0);
      expect(summary.agentMessages).toBe(0);
      expect(summary.wordCount).toBe(0);
      expect(summary.duration).toBe('0 minutes');
    });

    test('handles single message', () => {
      const singleMessage = [mockMessages[0]];
      const summary = ConversationExporter.getSummary(singleMessage);

      expect(summary.totalMessages).toBe(1);
      expect(summary.userMessages).toBe(1);
      expect(summary.agentMessages).toBe(0);
      expect(summary.wordCount).toBe(2);
      expect(summary.duration).toBe('0 minutes');
    });
  });

  describe('exportToText', () => {
    test('formats messages correctly as text', () => {
      const result = ConversationExporter.exportToText(mockMessages);

      expect(result).toContain('Conversation Export');
      expect(result).toContain('Total Messages: 3');
      expect(result).toContain('[10:00:00] User: Hello world');
      expect(result).toContain('[10:01:00] Agent: Hi there! How can I help?');
      expect(result).toContain('[10:02:30] User: I need assistance');
    });

    test('handles empty messages', () => {
      const result = ConversationExporter.exportToText([]);

      expect(result).toContain('Total Messages: 0');
      expect(result).toContain('No messages in this conversation');
    });
  });

  describe('exportToJSON', () => {
    test('exports valid JSON structure', () => {
      const result = ConversationExporter.exportToJSON(mockMessages);
      const parsed = JSON.parse(result);

      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.summary.totalMessages).toBe(3);
      expect(parsed.messages).toHaveLength(3);
      expect(parsed.messages[0].speaker).toBe('user');
      expect(parsed.messages[0].content).toBe('Hello world');
    });

    test('maintains message structure', () => {
      const result = ConversationExporter.exportToJSON(mockMessages);
      const parsed = JSON.parse(result);

      const firstMessage = parsed.messages[0];
      expect(firstMessage).toHaveProperty('id');
      expect(firstMessage).toHaveProperty('timestamp');
      expect(firstMessage).toHaveProperty('speaker');
      expect(firstMessage).toHaveProperty('content');
      expect(firstMessage).toHaveProperty('sentiment');
    });
  });

  describe('exportToCSV', () => {
    test('formats messages as CSV', () => {
      const result = ConversationExporter.exportToCSV(mockMessages);

      expect(result).toContain('ID,Timestamp,Speaker,Content,Sentiment');
      expect(result).toContain('1,2024-01-01T10:00:00.000Z,user,Hello world,neutral');
      expect(result).toContain('2,2024-01-01T10:01:00.000Z,agent,"Hi there! How can I help?",positive');
    });

    test('handles CSV escaping', () => {
      const messagesWithCommas: ConversationMessage[] = [
        {
          id: '1',
          timestamp: new Date('2024-01-01T10:00:00Z'),
          speaker: 'user',
          content: 'Hello, world',
          sentiment: 'neutral',
        },
      ];

      const result = ConversationExporter.exportToCSV(messagesWithCommas);
      expect(result).toContain('"Hello, world"');
    });
  });

  describe('downloadFile', () => {
    test('creates download link', () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = jest.fn();

      // Mock document.createElement and click
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

      ConversationExporter.downloadFile('test content', 'test.txt', 'text/plain');

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(mockLink.download).toBe('test.txt');
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
