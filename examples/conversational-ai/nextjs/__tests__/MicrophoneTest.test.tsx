import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MicrophoneTest } from '@/components/MicrophoneTest';

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn();
const mockEnumerateDevices = jest.fn();

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
  writable: true,
});

// Mock audio context and related APIs
const mockAudioContext = {
  createMediaStreamSource: jest.fn(),
  createAnalyser: jest.fn(() => ({
    connect: jest.fn(),
    getByteFrequencyData: jest.fn(),
    frequencyBinCount: 1024,
    fftSize: 2048,
  })),
  destination: {},
  close: jest.fn(),
};

Object.defineProperty(window, 'AudioContext', {
  value: jest.fn(() => mockAudioContext),
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: jest.fn(() => mockAudioContext),
  writable: true,
});

describe('MicrophoneTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserMedia.mockClear();
    mockEnumerateDevices.mockClear();
  });

  it('renders microphone test component', () => {
    render(<MicrophoneTest />);
    
    expect(screen.getByText(/Microphone Test/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start test/i })).toBeInTheDocument();
  });

  it('starts microphone test when button is clicked', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ]),
      getAudioTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ])
    };
    
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    });
    
    expect(screen.getByText(/Testing microphone/)).toBeInTheDocument();
  });

  it('shows error when microphone access is denied', async () => {
    const error = new Error('Permission denied');
    error.name = 'NotAllowedError';
    mockGetUserMedia.mockRejectedValue(error);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Microphone access denied/)).toBeInTheDocument();
    });
  });

  it('shows error when no microphone is found', async () => {
    const error = new Error('No microphone found');
    error.name = 'NotFoundError';
    mockGetUserMedia.mockRejectedValue(error);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/No microphone found/)).toBeInTheDocument();
    });
  });

  it('stops microphone test when stop button is clicked', async () => {
    const mockTrack = { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' };
    const mockStream = {
      getTracks: jest.fn(() => [mockTrack]),
      getAudioTracks: jest.fn(() => [mockTrack])
    };
    
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    render(<MicrophoneTest />);
    
    // Start the test
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Testing microphone/)).toBeInTheDocument();
    });
    
    // Stop the test
    const stopButton = screen.getByRole('button', { name: /stop test/i });
    fireEvent.click(stopButton);
    
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /start test/i })).toBeInTheDocument();
  });

  it('displays audio level indicator during test', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ]),
      getAudioTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ])
    };
    
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Audio Level/)).toBeInTheDocument();
    });
  });

  it('shows success message when microphone works correctly', async () => {
    const mockStream = {
      getTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ]),
      getAudioTracks: jest.fn(() => [
        { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' }
      ])
    };
    
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Microphone is working/)).toBeInTheDocument();
    });
  });

  it('enumerates and displays available devices', async () => {
    const mockDevices = [
      { deviceId: 'device1', label: 'Built-in Microphone', kind: 'audioinput' },
      { deviceId: 'device2', label: 'USB Microphone', kind: 'audioinput' }
    ];
    
    mockEnumerateDevices.mockResolvedValue(mockDevices);
    
    render(<MicrophoneTest />);
    
    await waitFor(() => {
      expect(screen.getByText(/Built-in Microphone/)).toBeInTheDocument();
      expect(screen.getByText(/USB Microphone/)).toBeInTheDocument();
    });
  });

  it('handles device enumeration errors gracefully', async () => {
    mockEnumerateDevices.mockRejectedValue(new Error('Device enumeration failed'));
    
    render(<MicrophoneTest />);
    
    await waitFor(() => {
      expect(screen.getByText(/Unable to list devices/)).toBeInTheDocument();
    });
  });

  it('displays microphone permissions status', () => {
    render(<MicrophoneTest />);
    
    expect(screen.getByText(/Permission Status/)).toBeInTheDocument();
  });

  it('shows loading state during microphone access', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetUserMedia.mockReturnValue(promise);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    expect(screen.getByText(/Requesting microphone access/)).toBeInTheDocument();
    
    // Resolve the promise
    resolvePromise!({
      getTracks: jest.fn(() => []),
      getAudioTracks: jest.fn(() => [])
    });
  });

  it('handles unsupported browser gracefully', () => {
    // Temporarily remove mediaDevices to simulate unsupported browser
    const originalMediaDevices = navigator.mediaDevices;
    delete (navigator as any).mediaDevices;
    
    render(<MicrophoneTest />);
    
    expect(screen.getByText(/Microphone testing not supported/)).toBeInTheDocument();
    
    // Restore mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      writable: true,
    });
  });

  it('provides troubleshooting tips on errors', async () => {
    const error = new Error('Permission denied');
    error.name = 'NotAllowedError';
    mockGetUserMedia.mockRejectedValue(error);
    
    render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Check browser permissions/)).toBeInTheDocument();
    });
  });

  it('cleans up resources when component unmounts', async () => {
    const mockTrack = { stop: jest.fn(), kind: 'audio', label: 'Default Microphone' };
    const mockStream = {
      getTracks: jest.fn(() => [mockTrack]),
      getAudioTracks: jest.fn(() => [mockTrack])
    };
    
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    const { unmount } = render(<MicrophoneTest />);
    
    const startButton = screen.getByRole('button', { name: /start test/i });
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Testing microphone/)).toBeInTheDocument();
    });
    
    unmount();
    
    expect(mockTrack.stop).toHaveBeenCalled();
  });
});
