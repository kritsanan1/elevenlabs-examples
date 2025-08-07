import { credentialStorage } from '@/lib/credentialStorage';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('credentialStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('save', () => {
    it('saves credentials to localStorage', () => {
      const credentials = {
        agentId: 'test-agent-id',
        apiKey: 'test-api-key'
      };

      credentialStorage.save(credentials);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'elevenlabs-credentials',
        JSON.stringify(credentials)
      );
    });

    it('handles partial credentials', () => {
      const partialCredentials = {
        agentId: 'test-agent-id'
      };

      credentialStorage.save(partialCredentials);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'elevenlabs-credentials',
        JSON.stringify(partialCredentials)
      );
    });

    it('overwrites existing credentials', () => {
      const existingCredentials = {
        agentId: 'old-agent',
        apiKey: 'old-key'
      };

      const newCredentials = {
        agentId: 'new-agent',
        apiKey: 'new-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCredentials));

      credentialStorage.save(newCredentials);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'elevenlabs-credentials',
        JSON.stringify(newCredentials)
      );
    });

    it('handles localStorage errors gracefully', () => {
      const error = new Error('Storage quota exceeded');
      mockLocalStorage.setItem.mockImplementation(() => {
        throw error;
      });

      const credentials = {
        agentId: 'test-agent',
        apiKey: 'test-key'
      };

      expect(() => credentialStorage.save(credentials)).not.toThrow();
    });
  });

  describe('load', () => {
    it('loads credentials from localStorage', () => {
      const storedCredentials = {
        agentId: 'stored-agent',
        apiKey: 'stored-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedCredentials));

      const result = credentialStorage.load();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('elevenlabs-credentials');
      expect(result).toEqual(storedCredentials);
    });

    it('returns null when no credentials are stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = credentialStorage.load();

      expect(result).toBeNull();
    });

    it('returns null when stored data is invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      const result = credentialStorage.load();

      expect(result).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = credentialStorage.load();

      expect(result).toBeNull();
    });

    it('validates loaded credentials structure', () => {
      // Test with invalid credential structure
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ invalid: 'structure' }));

      const result = credentialStorage.load();

      // Should return the data as-is, letting the application handle validation
      expect(result).toEqual({ invalid: 'structure' });
    });
  });

  describe('clear', () => {
    it('removes credentials from localStorage', () => {
      credentialStorage.clear();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('elevenlabs-credentials');
    });

    it('handles localStorage errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      expect(() => credentialStorage.clear()).not.toThrow();
    });
  });

  describe('isConfigured', () => {
    it('returns true when both agentId and apiKey are present', () => {
      const completeCredentials = {
        agentId: 'test-agent',
        apiKey: 'test-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(completeCredentials));

      const result = credentialStorage.isConfigured();

      expect(result).toBe(true);
    });

    it('returns false when agentId is missing', () => {
      const incompleteCredentials = {
        apiKey: 'test-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(incompleteCredentials));

      const result = credentialStorage.isConfigured();

      expect(result).toBe(false);
    });

    it('returns false when apiKey is missing', () => {
      const incompleteCredentials = {
        agentId: 'test-agent'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(incompleteCredentials));

      const result = credentialStorage.isConfigured();

      expect(result).toBe(false);
    });

    it('returns false when no credentials are stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = credentialStorage.isConfigured();

      expect(result).toBe(false);
    });

    it('returns false when credentials have empty values', () => {
      const emptyCredentials = {
        agentId: '',
        apiKey: ''
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(emptyCredentials));

      const result = credentialStorage.isConfigured();

      expect(result).toBe(false);
    });

    it('returns false when credentials have whitespace-only values', () => {
      const whitespaceCredentials = {
        agentId: '   ',
        apiKey: '\t\n'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(whitespaceCredentials));

      const result = credentialStorage.isConfigured();

      expect(result).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('returns detailed status for complete configuration', () => {
      const credentials = {
        agentId: 'test-agent',
        apiKey: 'test-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(credentials));

      const status = credentialStorage.getStatus();

      expect(status).toEqual({
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      });
    });

    it('returns detailed status for partial configuration', () => {
      const partialCredentials = {
        agentId: 'test-agent'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(partialCredentials));

      const status = credentialStorage.getStatus();

      expect(status).toEqual({
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: true,
        hasMinimalConfig: false
      });
    });

    it('returns detailed status for no configuration', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const status = credentialStorage.getStatus();

      expect(status).toEqual({
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      });
    });
  });

  describe('update', () => {
    it('merges new credentials with existing ones', () => {
      const existingCredentials = {
        agentId: 'existing-agent',
        apiKey: 'existing-key'
      };

      const updates = {
        apiKey: 'new-key'
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCredentials));

      credentialStorage.update(updates);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'elevenlabs-credentials',
        JSON.stringify({
          agentId: 'existing-agent',
          apiKey: 'new-key'
        })
      );
    });

    it('creates new credentials when none exist', () => {
      const updates = {
        agentId: 'new-agent'
      };

      mockLocalStorage.getItem.mockReturnValue(null);

      credentialStorage.update(updates);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'elevenlabs-credentials',
        JSON.stringify(updates)
      );
    });

    it('handles localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const updates = {
        agentId: 'test-agent'
      };

      expect(() => credentialStorage.update(updates)).not.toThrow();
    });
  });

  describe('browser compatibility', () => {
    it('handles missing localStorage gracefully', () => {
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      const result = credentialStorage.load();

      expect(result).toBeNull();

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it('handles disabled localStorage gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new Error('localStorage is disabled');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const credentials = {
        agentId: 'test-agent',
        apiKey: 'test-key'
      };

      expect(() => credentialStorage.save(credentials)).not.toThrow();
    });
  });
});
