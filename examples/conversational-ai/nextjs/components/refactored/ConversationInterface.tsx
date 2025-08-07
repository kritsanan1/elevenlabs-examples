"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConversationState } from "@/hooks/useConversationState";
import { AudioVisualizer } from "@/components/core/AudioVisualizer";
import { ErrorDisplay } from "@/components/core/ErrorDisplay";
import { ConversationControls } from "@/components/core/ConversationControls";
import { StatusIndicator } from "@/components/core/StatusIndicator";
import { VisualizationMode } from "@/types/conversation";
import { Sparkles, Waves, BarChart3 } from "lucide-react";
import { useConfiguration } from "@/hooks/useConfiguration";
import { ConfigurationStatus } from "@/components/core/ConfigurationStatus";

/**
 * Refactored conversation interface
 * Follows SOLID principles:
 * - Single Responsibility: Only handles the main conversation UI
 * - Open/Closed: Extensible through composition
 * - Liskov Substitution: Can be replaced with other implementations
 * - Interface Segregation: Uses focused interfaces
 * - Dependency Inversion: Depends on abstractions (hooks, services)
 */
export function ConversationInterface() {
  const [visualizerMode, setVisualizerMode] =
    useState<VisualizationMode>("orb");
  const config = useConfiguration();

  const {
    status,
    isRecording,
    isSpeaking,
    error,
    selectedPersona,
    startConversation,
    stopConversation,
    setError,
    canStart,
    canStop,
    isConnected,
  } = useConversationState();

  const handleDismissError = () => {
    setError(null);
  };

  // Determine if conversation controls should be disabled
  const isDisabled = !config.isConfigured || config.isLoading;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Always show configuration status */}
      <ConfigurationStatus />
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <CardHeader className="px-0 pt-0">
            <StatusIndicator
              status={status}
              isRecording={isRecording}
              isSpeaking={isSpeaking}
              selectedPersonaAvatar={selectedPersona.avatar}
            />
          </CardHeader>

          {error && (
            <ErrorDisplay error={error} onDismiss={handleDismissError} />
          )}

          {/* Audio Visualizer */}
          <div className="flex justify-center mb-6">
            <AudioVisualizer
              isActive={isConnected}
              isSpeaking={isSpeaking}
              mode={visualizerMode}
            />
          </div>

          {/* Visualizer Mode Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={visualizerMode === "orb" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisualizerMode("orb")}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Orb
            </Button>
            <Button
              variant={visualizerMode === "waveform" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisualizerMode("waveform")}
            >
              <Waves className="h-4 w-4 mr-1" />
              Wave
            </Button>
            <Button
              variant={visualizerMode === "spectrum" ? "default" : "outline"}
              size="sm"
              onClick={() => setVisualizerMode("spectrum")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Spectrum
            </Button>
          </div>

          {/* Main Controls */}
          <div className="flex flex-col gap-4 text-center">
            <ConversationControls
              canStart={canStart && config.isConfigured}
              canStop={canStop}
              isConnected={isConnected}
              onStart={startConversation}
              onStop={stopConversation}
              disabled={isDisabled || status === "connecting"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
