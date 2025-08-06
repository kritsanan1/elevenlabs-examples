"use client";

import React from 'react';
import { useVisualization } from '@/hooks/useVisualization';
import { VisualizationMode } from '@/types/conversation';

interface AudioVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  mode: VisualizationMode;
  onModeChange?: (mode: VisualizationMode) => void;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Reusable AudioVisualizer component
 * Follows Single Responsibility Principle - only handles visualization
 */
export function AudioVisualizer({
  isActive,
  isSpeaking,
  mode: initialMode,
  width = 300,
  height = 200,
  className = ""
}: AudioVisualizerProps) {
  const { canvasRef, mode } = useVisualization({
    mode: initialMode,
    isActive,
    isSpeaking
  });

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`border rounded-lg bg-gray-50 ${className}`}
      aria-label={`Audio visualization in ${mode} mode`}
    />
  );
}
