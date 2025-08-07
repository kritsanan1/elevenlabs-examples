
import { renderHook, act } from '@testing-library/react';
import { useConversationState } from '@/hooks/useConversationState';

describe('useConversationState Hook', () => {
  test('initializes with default values', () => {
    const { result } = renderHook(() => useConversationState());
    
    expect(result.current.status).toBe('disconnected');
    expect(result.current.isConnected).toBe(false);
    expect(result.current.audioLevel).toBe(0);
    expect(result.current.error).toBeNull();
    expect(result.current.conversation).toBeNull();
  });

  test('updates status correctly', () => {
    const { result } = renderHook(() => useConversationState());
    
    act(() => {
      result.current.setStatus('connecting');
    });
    
    expect(result.current.status).toBe('connecting');
    expect(result.current.isConnected).toBe(false);
    
    act(() => {
      result.current.setStatus('connected');
    });
    
    expect(result.current.status).toBe('connected');
    expect(result.current.isConnected).toBe(true);
  });

  test('handles error state', () => {
    const { result } = renderHook(() => useConversationState());
    
    const testError = 'Connection failed';
    
    act(() => {
      result.current.setError(testError);
    });
    
    expect(result.current.error).toBe(testError);
  });

  test('updates audio level', () => {
    const { result } = renderHook(() => useConversationState());
    
    act(() => {
      result.current.setAudioLevel(0.75);
    });
    
    expect(result.current.audioLevel).toBe(0.75);
  });

  test('clears error when status changes', () => {
    const { result } = renderHook(() => useConversationState());
    
    act(() => {
      result.current.setError('Test error');
    });
    
    expect(result.current.error).toBe('Test error');
    
    act(() => {
      result.current.setStatus('connected');
    });
    
    expect(result.current.error).toBeNull();
  });

  test('resets state correctly', () => {
    const { result } = renderHook(() => useConversationState());
    
    // Set some state
    act(() => {
      result.current.setStatus('connected');
      result.current.setAudioLevel(0.5);
      result.current.setError('Some error');
    });
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.status).toBe('disconnected');
    expect(result.current.isConnected).toBe(false);
    expect(result.current.audioLevel).toBe(0);
    expect(result.current.error).toBeNull();
  });
});
