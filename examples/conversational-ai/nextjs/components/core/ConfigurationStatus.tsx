"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConfigStatus {
  isConfigured: boolean;
  agentIdConfigured: boolean;
  apiKeyConfigured: boolean;
  error?: string;
}

/**
 * Component to check and display configuration status
 */
export function ConfigurationStatus() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signed-url");
      const data = await response.json();

      if (response.ok) {
        setStatus({
          isConfigured: true,
          agentIdConfigured: true,
          apiKeyConfigured: true,
        });
      } else {
        // Parse the error to determine what's missing
        const agentIdConfigured = !data.error?.includes("AGENT_ID");
        const apiKeyConfigured = !data.error?.includes("ELEVENLABS_API_KEY");

        setStatus({
          isConfigured: false,
          agentIdConfigured,
          apiKeyConfigured,
          error: data.error,
        });
      }
    } catch (error) {
      console.error("Configuration check failed:", error);
      setStatus({
        isConfigured: false,
        agentIdConfigured: false,
        apiKeyConfigured: false,
        error: "Unable to check configuration - network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-4 border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-blue-700 text-sm">
              Checking configuration...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  if (status.isConfigured) {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="text-green-500 text-lg">✅</div>
            <span className="text-green-700 text-sm font-medium">
              Configuration verified - ready to start conversations!
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
          ⚙️ Configuration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-amber-700 text-sm">
          To use the Conversational AI demo, please configure your ElevenLabs
          credentials:
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={
                status.agentIdConfigured ? "text-green-500" : "text-red-500"
              }
            >
              {status.agentIdConfigured ? "✅" : "❌"}
            </div>
            <span className="text-sm">
              Agent ID {status.agentIdConfigured ? "configured" : "missing"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={
                status.apiKeyConfigured ? "text-green-500" : "text-red-500"
              }
            >
              {status.apiKeyConfigured ? "✅" : "❌"}
            </div>
            <span className="text-sm">
              API Key {status.apiKeyConfigured ? "configured" : "missing"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-white border border-amber-200 rounded-lg text-xs">
            <p className="font-medium text-amber-800 mb-2">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-amber-700">
              <li>Get your ElevenLabs API key</li>
              <li>Create a Conversational AI agent</li>
              <li>Update your environment variables</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 transition-colors"
            >
              📚 Setup Guide
            </a>
            <a
              href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 bg-white text-amber-600 border border-amber-300 rounded text-xs hover:bg-amber-50 transition-colors"
            >
              🔑 Get API Key
            </a>
            <button
              onClick={checkConfiguration}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white text-amber-600 border border-amber-300 rounded text-xs hover:bg-amber-50 transition-colors"
            >
              🔄 Recheck
            </button>
          </div>
        </div>

        {status.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <strong>Error:</strong> {status.error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
