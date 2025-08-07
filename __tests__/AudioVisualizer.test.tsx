
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AudioVisualizer } from '@/components/core/AudioVisualizer';

// Mock canvas context
const mockContext = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  strokeRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

describe('AudioVisualizer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders canvas element', () => {
    render(<AudioVisualizer audioLevel={0.5} type="orb" />);
    
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  test('renders with orb visualization type', () => {
    render(<AudioVisualizer audioLevel={0.8} type="orb" />);
    
    const canvas = screen.getByRole('img');
    expect(canvas).toHaveClass('rounded-full');
  });

  test('renders with waveform visualization type', () => {
    render(<AudioVisualizer audioLevel={0.3} type="waveform" />);
    
    const canvas = screen.getByRole('img');
    expect(canvas).toHaveClass('rounded-lg');
  });

  test('updates canvas when audio level changes', () => {
    const { rerender } = render(<AudioVisualizer audioLevel={0.2} type="orb" />);
    
    expect(mockContext.clearRect).toHaveBeenCalled();
    
    rerender(<AudioVisualizer audioLevel={0.8} type="orb" />);
    
    expect(mockContext.clearRect).toHaveBeenCalledTimes(2);
  });

  test('handles zero audio level', () => {
    render(<AudioVisualizer audioLevel={0} type="spectrum" />);
    
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  test('handles maximum audio level', () => {
    render(<AudioVisualizer audioLevel={1} type="orb" />);
    
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
  });
});
