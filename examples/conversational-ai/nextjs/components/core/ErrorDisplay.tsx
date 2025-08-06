"use client";

import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
  showSetupHelp?: boolean;
}

/**
 * Reusable error display component
 * Follows Open/Closed Principle - extensible through props
 */
export function ErrorDisplay({ error, onDismiss, showSetupHelp = true }: ErrorDisplayProps) {
  const isConfigurationError = error.includes("AGENT_ID") || 
                              error.includes("ELEVENLABS_API_KEY") || 
                              error.includes("Configuration error");

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-red-500 text-lg">⚠️</div>
        <div className="flex-1">
          <p className="text-red-700 text-sm font-medium">{error}</p>
          
          {isConfigurationError && showSetupHelp && (
            <div className="mt-3 space-y-2">
              <p className="text-red-600 text-xs">
                To use this demo, you need to configure your ElevenLabs credentials:
              </p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                >
                  📚 Setup Guide
                </a>
                <a 
                  href="https://elevenlabs.io/app/speech-synthesis/text-to-speech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white text-red-600 border border-red-200 rounded text-xs hover:bg-red-50 transition-colors"
                >
                  🔑 Get API Key
                </a>
              </div>
            </div>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
