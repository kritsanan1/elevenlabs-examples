import { renderHook, act } from '@testing-library/react';
import { useConfiguration } from '@/hooks/useConfiguration';

// Mock credentialStorage
jest.mock('@/lib/credentialStorage', () => ({
  credentialStorage: {
    load: jest.fn(),
    save: jest.fn(),
    clear: jest.fn(),
    isConfigured: jest.fn(),
    getStatus: jest.fn(),
    update: jest.fn(),
  }
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockCredentialStorage = require('@/lib/credentialStorage').credentialStorage;

describe('useConfiguration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCredentialStorage.getStatus.mockReturnValue({
      isConfigured: false,
      apiKeyConfigured: false,
      agentIdConfigured: false,
      hasMinimalConfig: false
    });
  });

  it('initializes with default configuration status', () => {
    const { result } = renderHook(() => useConfiguration());

    expect(result.current.status).toEqual({
      isConfigured: false,
      apiKeyConfigured: false,
      agentIdConfigured: false,
      hasMinimalConfig: false
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('loads configuration status on mount', () => {
    const mockStatus = {
      isConfigured: true,
      apiKeyConfigured: true,
      agentIdConfigured: true,
      hasMinimalConfig: true
    };

    mockCredentialStorage.getStatus.mockReturnValue(mockStatus);

    const { result } = renderHook(() => useConfiguration());

    expect(result.current.status).toEqual(mockStatus);
    expect(mockCredentialStorage.getStatus).toHaveBeenCalled();
  });

  it('refreshes configuration when refreshConfiguration is called', () => {
    const initialStatus = {
      isConfigured: false,
      apiKeyConfigured: false,
      agentIdConfigured: false,
      hasMinimalConfig: false
    };

    const updatedStatus = {
      isConfigured: true,
      apiKeyConfigured: true,
      agentIdConfigured: true,
      hasMinimalConfig: true
    };

    mockCredentialStorage.getStatus
      .mockReturnValueOnce(initialStatus)
      .mockReturnValueOnce(updatedStatus);

    const { result } = renderHook(() => useConfiguration());

    expect(result.current.status).toEqual(initialStatus);

    act(() => {
      result.current.refreshConfiguration();
    });

    expect(result.current.status).toEqual(updatedStatus);
    expect(mockCredentialStorage.getStatus).toHaveBeenCalledTimes(2);
  });

  it('saves credentials and updates status', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    const updatedStatus = {
      isConfigured: true,
      apiKeyConfigured: true,
      agentIdConfigured: true,
      hasMinimalConfig: true
    };

    mockCredentialStorage.getStatus.mockReturnValue(updatedStatus);

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await result.current.saveCredentials(credentials);
    });

    expect(mockCredentialStorage.save).toHaveBeenCalledWith(credentials);
    expect(result.current.status).toEqual(updatedStatus);
  });

  it('updates credentials and refreshes status', async () => {
    const updates = {
      apiKey: 'new-api-key'
    };

    const updatedStatus = {
      isConfigured: true,
      apiKeyConfigured: true,
      agentIdConfigured: true,
      hasMinimalConfig: true
    };

    mockCredentialStorage.getStatus.mockReturnValue(updatedStatus);

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await result.current.updateCredentials(updates);
    });

    expect(mockCredentialStorage.update).toHaveBeenCalledWith(updates);
    expect(result.current.status).toEqual(updatedStatus);
  });

  it('clears credentials and updates status', async () => {
    const clearedStatus = {
      isConfigured: false,
      apiKeyConfigured: false,
      agentIdConfigured: false,
      hasMinimalConfig: false
    };

    mockCredentialStorage.getStatus.mockReturnValue(clearedStatus);

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await result.current.clearCredentials();
    });

    expect(mockCredentialStorage.clear).toHaveBeenCalled();
    expect(result.current.status).toEqual(clearedStatus);
  });

  it('tests credentials with API call', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ valid: true })
    };

    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConfiguration());

    let testResult;
    await act(async () => {
      testResult = await result.current.testCredentials(credentials);
    });

    expect(fetch).toHaveBeenCalledWith('/api/test-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    expect(testResult).toEqual({ valid: true });
  });

  it('handles API errors when testing credentials', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    const mockResponse = {
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ error: 'Invalid credentials' })
    };

    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await expect(result.current.testCredentials(credentials)).rejects.toThrow('Invalid credentials');
    });
  });

  it('handles network errors when testing credentials', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await expect(result.current.testCredentials(credentials)).rejects.toThrow('Network error');
    });
  });

  it('shows loading state during credential operations', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockCredentialStorage.save.mockImplementation(() => delayedPromise);

    const { result } = renderHook(() => useConfiguration());

    // Start async operation
    act(() => {
      result.current.saveCredentials(credentials);
    });

    // Should show loading state
    expect(result.current.isLoading).toBe(true);

    // Complete the operation
    await act(async () => {
      resolvePromise!(undefined);
      await delayedPromise;
    });

    // Should no longer be loading
    expect(result.current.isLoading).toBe(false);
  });

  it('handles storage errors gracefully', async () => {
    const credentials = {
      agentId: 'test-agent',
      apiKey: 'test-key'
    };

    mockCredentialStorage.save.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await expect(result.current.saveCredentials(credentials)).rejects.toThrow('Storage error');
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('validates credentials before saving', async () => {
    const incompleteCredentials = {
      agentId: ''
    };

    const { result } = renderHook(() => useConfiguration());

    await act(async () => {
      await result.current.saveCredentials(incompleteCredentials);
    });

    // Should still save even incomplete credentials (validation is UI responsibility)
    expect(mockCredentialStorage.save).toHaveBeenCalledWith(incompleteCredentials);
  });

  it('loads stored credentials', () => {
    const storedCredentials = {
      agentId: 'stored-agent',
      apiKey: 'stored-key'
    };

    mockCredentialStorage.load.mockReturnValue(storedCredentials);

    const { result } = renderHook(() => useConfiguration());

    const loadedCredentials = result.current.loadCredentials();

    expect(loadedCredentials).toEqual(storedCredentials);
    expect(mockCredentialStorage.load).toHaveBeenCalled();
  });

  it('returns null when no credentials are stored', () => {
    mockCredentialStorage.load.mockReturnValue(null);

    const { result } = renderHook(() => useConfiguration());

    const loadedCredentials = result.current.loadCredentials();

    expect(loadedCredentials).toBeNull();
  });

  it('provides isConfigured convenience method', () => {
    mockCredentialStorage.isConfigured.mockReturnValue(true);

    const { result } = renderHook(() => useConfiguration());

    const isConfigured = result.current.isConfigured();

    expect(isConfigured).toBe(true);
    expect(mockCredentialStorage.isConfigured).toHaveBeenCalled();
  });

  it('updates status reactively when credentials change', () => {
    const { result } = renderHook(() => useConfiguration());

    const initialStatus = result.current.status;

    const newStatus = {
      isConfigured: true,
      apiKeyConfigured: true,
      agentIdConfigured: true,
      hasMinimalConfig: true
    };

    mockCredentialStorage.getStatus.mockReturnValue(newStatus);

    act(() => {
      result.current.refreshConfiguration();
    });

    expect(result.current.status).not.toEqual(initialStatus);
    expect(result.current.status).toEqual(newStatus);
  });
});
