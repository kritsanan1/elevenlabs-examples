"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface ConversationControlsProps {
  canStart: boolean;
  canStop: boolean;
  isConnected: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

/**
 * Focused component for conversation controls
 * Follows Single Responsibility Principle
 */
export function ConversationControls({
  canStart,
  canStop,
  isConnected,
  onStart,
  onStop,
  disabled = false,
}: ConversationControlsProps) {
  return (
    <div className="flex justify-center gap-3">
      <Button
        variant="default"
        className="rounded-full"
        size="lg"
        disabled={!canStart || disabled}
        onClick={onStart}
      >
        <Mic className="h-5 w-5 mr-2" />
        Start Conversation
      </Button>

      <Button
        variant="outline"
        className="rounded-full"
        size="lg"
        disabled={!canStop || disabled}
        onClick={onStop}
      >
        <MicOff className="h-5 w-5 mr-2" />
        End Conversation
      </Button>
    </div>
  );
}
