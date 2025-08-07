import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigurationPopup } from '@/components/core/ConfigurationPopup';

// Mock the child components
jest.mock('@/components/core/CredentialSetup', () => ({
  CredentialSetup: jest.fn(({ onCredentialsChange }) => (
    <div data-testid="credential-setup">
      <button 
        onClick={() => onCredentialsChange && onCredentialsChange({ agentId: 'test-agent', apiKey: 'test-key' })}
      >
        Set Credentials
      </button>
    </div>
  ))
}));

jest.mock('@/components/core/OnboardingWizard', () => ({
  OnboardingWizard: jest.fn(() => <div data-testid="onboarding-wizard">Wizard</div>)
}));

jest.mock('@/components/core/AgentSelector', () => ({
  AgentSelector: jest.fn(({ onAgentSelect }) => (
    <div data-testid="agent-selector">
      <button 
        onClick={() => onAgentSelect && onAgentSelect({ id: 'agent1', name: 'Test Agent' })}
      >
        Select Agent
      </button>
    </div>
  ))
}));

describe('ConfigurationPopup', () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
    title: 'Test Configuration',
    description: 'Test Description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders popup when visible', () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    expect(screen.getByText('Test Configuration')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render popup when not visible', () => {
    render(<ConfigurationPopup {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('Test Configuration')).not.toBeInTheDocument();
  });

  it('renders default title and description when not provided', () => {
    const { title, description, ...propsWithoutText } = defaultProps;
    render(<ConfigurationPopup {...propsWithoutText} />);
    
    expect(screen.getByText('Configuration Required')).toBeInTheDocument();
    expect(screen.getByText(/Set up your ElevenLabs credentials/)).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<ConfigurationPopup {...defaultProps} onClose={onClose} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ConfigurationPopup {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when modal content is clicked', () => {
    const onClose = jest.fn();
    render(<ConfigurationPopup {...defaultProps} onClose={onClose} />);
    
    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('switches between setup modes correctly', () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    // Should start with credential setup
    expect(screen.getByTestId('credential-setup')).toBeInTheDocument();
    
    // Switch to guided setup
    const guidedButton = screen.getByText('Guided Setup');
    fireEvent.click(guidedButton);
    
    expect(screen.getByTestId('onboarding-wizard')).toBeInTheDocument();
    
    // Switch to agent selector
    const agentButton = screen.getByText('Agent Selector');
    fireEvent.click(agentButton);
    
    expect(screen.getByTestId('agent-selector')).toBeInTheDocument();
    
    // Switch back to quick setup
    const quickButton = screen.getByText('Quick Setup');
    fireEvent.click(quickButton);
    
    expect(screen.getByTestId('credential-setup')).toBeInTheDocument();
  });

  it('handles credential changes', async () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    const setCredentialsButton = screen.getByText('Set Credentials');
    fireEvent.click(setCredentialsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Credentials updated successfully!/)).toBeInTheDocument();
    });
  });

  it('handles agent selection', () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    // Switch to agent selector
    const agentButton = screen.getByText('Agent Selector');
    fireEvent.click(agentButton);
    
    const selectAgentButton = screen.getByText('Select Agent');
    fireEvent.click(selectAgentButton);
    
    expect(screen.getByText(/Selected: Test Agent/)).toBeInTheDocument();
  });

  it('shows configuration status correctly', () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    // Check status indicators
    expect(screen.getByText(/Agent ID/)).toBeInTheDocument();
    expect(screen.getByText(/API Key/)).toBeInTheDocument();
  });

  it('applies correct theme classes', () => {
    const { container } = render(<ConfigurationPopup {...defaultProps} />);
    
    // Check for amber theme classes
    expect(container.querySelector('.bg-amber-50')).toBeInTheDocument();
    expect(container.querySelector('.border-amber-200')).toBeInTheDocument();
  });

  it('handles auto-show functionality', () => {
    render(<ConfigurationPopup {...defaultProps} autoShow={true} />);
    
    expect(screen.getByText('Test Configuration')).toBeInTheDocument();
  });

  it('shows success message after configuration', async () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    const setCredentialsButton = screen.getByText('Set Credentials');
    fireEvent.click(setCredentialsButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Success!/)).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', () => {
    render(<ConfigurationPopup {...defaultProps} />);
    
    // Test ESC key
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
