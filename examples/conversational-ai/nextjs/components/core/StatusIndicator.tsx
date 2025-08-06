"use client";

import React from "react";
import { ConversationStatus } from "@/types/conversation";

interface StatusIndicatorProps {
  status: ConversationStatus;
  isRecording: boolean;
  isSpeaking: boolean;
  selectedPersonaAvatar?: string;
}

/**
 * Status indicator component
 * Shows current conversation state
 */
export function StatusIndicator({
  status,
  isRecording,
  isSpeaking,
  selectedPersonaAvatar = "🤖",
}: StatusIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case "connected":
        return isSpeaking
          ? `${selectedPersonaAvatar} Agent is speaking`
          : "🎤 Agent is listening";
      case "connecting":
        return "🔄 Connecting...";
      case "error":
        return "❌ Connection failed";
      default:
        return "💭 Ready to connect";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-700";
      case "connecting":
        return "text-blue-700";
      case "error":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {isRecording && (
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
        <h3 className={`font-medium ${getStatusColor()}`}>{getStatusText()}</h3>
      </div>

      {status === "connecting" && (
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      )}
    </div>
  );
}
