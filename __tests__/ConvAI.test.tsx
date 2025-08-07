
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConvAI } from '@/components/ConvAI';

// Mock the ConversationService
jest.mock('@/services/ConversationService', () => ({
  ConversationService: {
    getInstance: jest.fn(() => ({
      requestMicrophonePermission: jest.fn(),
      getSignedUrl: jest.fn(),
    })),
  },
}));

// Mock ElevenLabs Conversation
const mockConversation = {
  startSession: jest.fn(),
  endSession: jest.fn(),
  setVolume: jest.fn(),
  getInputVolume: jest.fn(() => 0.5),
  getOutputVolume: jest.fn(() => 0.8),
};

jest.mock('@11labs/client', () => ({
  ElevenLabsClient: jest.fn(() => ({
    conversationalAi: {
      conversation: jest.fn(() => mockConversation),
    },
  })),
}));

describe('ConvAI Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders start conversation button initially', () => {
    render(<ConvAI />);
    
    const startButton = screen.getByText(/start conversation/i);
    expect(startButton).toBeInTheDocument();
  });

  test('displays connection status', () => {
    render(<ConvAI />);
    
    const status = screen.getByText(/disconnected/i);
    expect(status).toBeInTheDocument();
  });

  test('shows microphone permission error when denied', async () => {
    const mockService = {
      requestMicrophonePermission: jest.fn().mockResolvedValue(false),
      getSignedUrl: jest.fn(),
    };

    require('@/services/ConversationService').ConversationService.getInstance.mockReturnValue(mockService);

    render(<ConvAI />);
    
    const startButton = screen.getByText(/start conversation/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/microphone permission denied/i)).toBeInTheDocument();
    });
  });

  test('handles successful conversation start', async () => {
    const mockService = {
      requestMicrophonePermission: jest.fn().mockResolvedValue(true),
      getSignedUrl: jest.fn().mockResolvedValue('signed-url'),
    };

    require('@/services/ConversationService').ConversationService.getInstance.mockReturnValue(mockService);

    render(<ConvAI />);
    
    const startButton = screen.getByText(/start conversation/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockService.requestMicrophonePermission).toHaveBeenCalled();
      expect(mockService.getSignedUrl).toHaveBeenCalled();
    });
  });

  test('displays error messages when API fails', async () => {
    const mockService = {
      requestMicrophonePermission: jest.fn().mockResolvedValue(true),
      getSignedUrl: jest.fn().mockRejectedValue(new Error('API Error')),
    };

    require('@/services/ConversationService').ConversationService.getInstance.mockReturnValue(mockService);

    render(<ConvAI />);
    
    const startButton = screen.getByText(/start conversation/i);
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
