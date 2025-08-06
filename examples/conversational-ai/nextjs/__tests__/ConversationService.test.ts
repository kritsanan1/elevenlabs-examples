// Example test file demonstrating improved testability
// This shows how the refactored code can be easily tested

import { ConversationService } from '@/services/ConversationService';
import { ConversationExporter } from '@/utils/conversationExport';
import { ConversationMessage } from '@/types/conversation';

// Mock global fetch for testing
global.fetch = jest.fn();

describe('ConversationService', () => {
  let service: ConversationService;

  beforeEach(() => {
    service = new ConversationService();
    jest.clearAllMocks();
  });

  describe('getSignedUrl', () => {
    it('should return signed URL on successful response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({ signedUrl: 'test-url' })
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getSignedUrl();
      
      expect(result).toBe('test-url');
      expect(fetch).toHaveBeenCalledWith('/api/signed-url');
    });

    it('should throw specific error for 400 status', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Invalid configuration' })
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(service.getSignedUrl()).rejects.toThrow('Invalid configuration');
    });

    it('should throw generic error for missing signed URL', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({})
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(service.getSignedUrl()).rejects.toThrow('No signed URL received from server');
    });
  });

  describe('requestMicrophonePermission', () => {
    it('should return true when permission granted', async () => {
      // Mock successful permission
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: jest.fn().mockResolvedValue({})
        },
        writable: true
      });

      const result = await service.requestMicrophonePermission();
      expect(result).toBe(true);
    });

    it('should return false when permission denied', async () => {
      // Mock permission denial
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: jest.fn().mockRejectedValue(new Error('Permission denied'))
        },
        writable: true
      });

      const result = await service.requestMicrophonePermission();
      expect(result).toBe(false);
    });
  });
});

describe('ConversationExporter', () => {
  const mockMessages: ConversationMessage[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01T10:00:00Z'),
      speaker: 'user',
      content: 'Hello',
      sentiment: 'neutral'
    },
    {
      id: '2',
      timestamp: new Date('2024-01-01T10:01:00Z'),
      speaker: 'agent',
      content: 'Hi there!',
      sentiment: 'positive'
    }
  ];

  describe('getSummary', () => {
    it('should calculate correct summary statistics', () => {
      const summary = ConversationExporter.getSummary(mockMessages);
      
      expect(summary.totalMessages).toBe(2);
      expect(summary.userMessages).toBe(1);
      expect(summary.agentMessages).toBe(1);
      expect(summary.wordCount).toBe(3); // "Hello" + "Hi there!"
      expect(summary.duration).toBe('1 minutes');
    });

    it('should handle empty messages array', () => {
      const summary = ConversationExporter.getSummary([]);
      
      expect(summary.totalMessages).toBe(0);
      expect(summary.userMessages).toBe(0);
      expect(summary.agentMessages).toBe(0);
      expect(summary.wordCount).toBe(0);
      expect(summary.duration).toBe('0 minutes');
    });
  });
});

// This demonstrates how the refactored architecture enables:
// 1. EASY UNIT TESTING - Each service/utility can be tested in isolation
// 2. MOCKABLE DEPENDENCIES - External dependencies (fetch, navigator) can be easily mocked
// 3. PURE FUNCTIONS - Business logic separated from side effects
// 4. CLEAR INTERFACES - Well-defined input/output makes testing straightforward
// 5. SINGLE RESPONSIBILITY - Each function has a clear, testable purpose
