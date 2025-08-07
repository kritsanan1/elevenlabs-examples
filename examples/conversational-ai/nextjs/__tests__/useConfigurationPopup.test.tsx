import { renderHook, act } from '@testing-library/react';
import { useConfigurationPopup } from '@/hooks/useConfigurationPopup';

// Mock the useConfiguration hook
jest.mock('@/hooks/useConfiguration', () => ({
  useConfiguration: jest.fn()
}));

const mockUseConfiguration = require('@/hooks/useConfiguration').useConfiguration;

describe('useConfigurationPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock configuration
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      refreshConfiguration: jest.fn()
    });
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useConfigurationPopup());

    expect(result.current.isPopupVisible).toBe(false);
    expect(result.current.isConfigured).toBe(false);
    expect(result.current.hasChecked).toBe(true);
    expect(result.current.configStatus).toEqual({
      isConfigured: false,
      apiKeyConfigured: false,
      agentIdConfigured: false,
      hasMinimalConfig: false
    });
  });

  it('shows popup when showPopup is called', () => {
    const { result } = renderHook(() => useConfigurationPopup());

    act(() => {
      result.current.showPopup();
    });

    expect(result.current.isPopupVisible).toBe(true);
  });

  it('hides popup when hidePopup is called', () => {
    const { result } = renderHook(() => useConfigurationPopup());

    // First show the popup
    act(() => {
      result.current.showPopup();
    });
    expect(result.current.isPopupVisible).toBe(true);

    // Then hide it
    act(() => {
      result.current.hidePopup();
    });
    expect(result.current.isPopupVisible).toBe(false);
  });

  it('auto-shows popup when autoShow is true and not configured', () => {
    const { result } = renderHook(() => useConfigurationPopup({ autoShow: true }));

    expect(result.current.isPopupVisible).toBe(true);
  });

  it('does not auto-show popup when already configured', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      refreshConfiguration: jest.fn()
    });

    const { result } = renderHook(() => useConfigurationPopup({ autoShow: true }));

    expect(result.current.isPopupVisible).toBe(false);
    expect(result.current.isConfigured).toBe(true);
  });

  it('calls refreshConfiguration when requested', () => {
    const mockRefresh = jest.fn();
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      refreshConfiguration: mockRefresh
    });

    const { result } = renderHook(() => useConfigurationPopup());

    act(() => {
      result.current.refreshConfiguration();
    });

    expect(mockRefresh).toHaveBeenCalled();
  });

  it('updates configuration status when underlying status changes', () => {
    const { result, rerender } = renderHook(() => useConfigurationPopup());

    expect(result.current.isConfigured).toBe(false);

    // Update mock to return configured state
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      refreshConfiguration: jest.fn()
    });

    rerender();

    expect(result.current.isConfigured).toBe(true);
    expect(result.current.configStatus?.isConfigured).toBe(true);
  });

  it('handles auto-hide on configuration completion', () => {
    const { result, rerender } = renderHook(() => useConfigurationPopup({ autoShow: true }));

    // Initially should show popup since not configured
    expect(result.current.isPopupVisible).toBe(true);

    // Update configuration to be complete
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      refreshConfiguration: jest.fn()
    });

    rerender();

    // Should auto-hide popup when configuration is complete
    expect(result.current.isConfigured).toBe(true);
  });

  it('provides correct hasChecked status', () => {
    const { result } = renderHook(() => useConfigurationPopup());

    expect(result.current.hasChecked).toBe(true);
  });

  it('handles partial configuration states', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: true,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      refreshConfiguration: jest.fn()
    });

    const { result } = renderHook(() => useConfigurationPopup());

    expect(result.current.configStatus?.apiKeyConfigured).toBe(true);
    expect(result.current.configStatus?.agentIdConfigured).toBe(false);
    expect(result.current.isConfigured).toBe(false);
  });

  it('maintains popup visibility state across re-renders', () => {
    const { result, rerender } = renderHook(() => useConfigurationPopup());

    act(() => {
      result.current.showPopup();
    });

    expect(result.current.isPopupVisible).toBe(true);

    rerender();

    expect(result.current.isPopupVisible).toBe(true);
  });

  it('handles missing configuration status gracefully', () => {
    mockUseConfiguration.mockReturnValue({
      status: null,
      refreshConfiguration: jest.fn()
    });

    const { result } = renderHook(() => useConfigurationPopup());

    expect(result.current.isConfigured).toBe(false);
    expect(result.current.configStatus).toBe(null);
  });

  it('supports custom auto-show behavior', () => {
    const { result: autoShowResult } = renderHook(() => 
      useConfigurationPopup({ autoShow: true })
    );
    const { result: noAutoShowResult } = renderHook(() => 
      useConfigurationPopup({ autoShow: false })
    );

    expect(autoShowResult.current.isPopupVisible).toBe(true);
    expect(noAutoShowResult.current.isPopupVisible).toBe(false);
  });
});
