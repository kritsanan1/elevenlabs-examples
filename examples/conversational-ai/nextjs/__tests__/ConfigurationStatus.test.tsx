import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigurationStatus } from '@/components/core/ConfigurationStatus';

// Mock the useConfiguration hook
jest.mock('@/hooks/useConfiguration', () => ({
  useConfiguration: jest.fn()
}));

const mockUseConfiguration = require('@/hooks/useConfiguration').useConfiguration;

describe('ConfigurationStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state when configuration is being checked', () => {
    mockUseConfiguration.mockReturnValue({
      status: null,
      isLoading: true,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Checking configuration/)).toBeInTheDocument();
  });

  it('shows success state when fully configured', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Configuration Complete/)).toBeInTheDocument();
    expect(screen.getByText(/Ready to start conversations/)).toBeInTheDocument();
  });

  it('shows warning state when partially configured', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: true,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Configuration Incomplete/)).toBeInTheDocument();
    expect(screen.getByText(/Please configure the missing items/)).toBeInTheDocument();
  });

  it('shows error state when no configuration exists', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Configuration Required/)).toBeInTheDocument();
    expect(screen.getByText(/Set up your ElevenLabs credentials/)).toBeInTheDocument();
  });

  it('displays individual configuration item statuses', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: true,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    // Check for status indicators
    expect(screen.getByText(/API Key/)).toBeInTheDocument();
    expect(screen.getByText(/Agent ID/)).toBeInTheDocument();
    
    // API Key should show as configured (green)
    const apiKeyIndicator = screen.getByText(/API Key/).closest('div');
    expect(apiKeyIndicator).toHaveClass('text-green-600');
    
    // Agent ID should show as missing (red)
    const agentIdIndicator = screen.getByText(/Agent ID/).closest('div');
    expect(agentIdIndicator).toHaveClass('text-red-600');
  });

  it('calls refreshConfiguration when refresh button is clicked', () => {
    const mockRefresh = jest.fn();
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: mockRefresh
    });

    render(<ConfigurationStatus />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalled();
  });

  it('applies correct styling based on configuration state', () => {
    const { rerender } = render(<ConfigurationStatus />);

    // Test success state styling
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    rerender(<ConfigurationStatus />);

    const successCard = screen.getByText(/Configuration Complete/).closest('div');
    expect(successCard).toHaveClass('border-green-200');

    // Test error state styling
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    rerender(<ConfigurationStatus />);

    const errorCard = screen.getByText(/Configuration Required/).closest('div');
    expect(errorCard).toHaveClass('border-red-200');
  });

  it('shows correct icons for different states', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    // Should show success icon (checkmark)
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('handles missing status gracefully', () => {
    mockUseConfiguration.mockReturnValue({
      status: null,
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Unable to check configuration/)).toBeInTheDocument();
  });

  it('shows setup instructions when not configured', () => {
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    expect(screen.getByText(/Add your ElevenLabs API key/)).toBeInTheDocument();
    expect(screen.getByText(/Configure your agent ID/)).toBeInTheDocument();
  });

  it('disables refresh button when loading', () => {
    mockUseConfiguration.mockReturnValue({
      status: null,
      isLoading: true,
      refreshConfiguration: jest.fn()
    });

    render(<ConfigurationStatus />);

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeDisabled();
  });

  it('updates status dynamically when configuration changes', () => {
    const { rerender } = render(<ConfigurationStatus />);

    // Start with unconfigured state
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: false,
        apiKeyConfigured: false,
        agentIdConfigured: false,
        hasMinimalConfig: false
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    rerender(<ConfigurationStatus />);
    expect(screen.getByText(/Configuration Required/)).toBeInTheDocument();

    // Update to configured state
    mockUseConfiguration.mockReturnValue({
      status: {
        isConfigured: true,
        apiKeyConfigured: true,
        agentIdConfigured: true,
        hasMinimalConfig: true
      },
      isLoading: false,
      refreshConfiguration: jest.fn()
    });

    rerender(<ConfigurationStatus />);
    expect(screen.getByText(/Configuration Complete/)).toBeInTheDocument();
  });
});
