"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CredentialSetup } from "./CredentialSetup";
import { OnboardingWizard } from "./OnboardingWizard";
import { AgentSelector } from "./AgentSelector";

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
  const [showSetup, setShowSetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signed-url");

      // Check if the response is valid before trying to parse JSON
      if (!response.ok && response.status !== 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Failed to parse response: ${parseError}`);
      }

      if (response.ok) {
        setStatus({
          isConfigured: true,
          agentIdConfigured: true,
          apiKeyConfigured: true,
        });
      } else if (response.status === 400) {
        // Expected response when credentials are not configured
        // Parse the error to determine what's missing
        const agentIdConfigured = !data.error?.includes("AGENT_ID");
        const apiKeyConfigured = !data.error?.includes("ELEVENLABS_API_KEY");

        setStatus({
          isConfigured: false,
          agentIdConfigured,
          apiKeyConfigured,
          error: data.error,
        });
      } else {
        // Unexpected error (500, etc.)
        console.error("Unexpected configuration check error:", data);
        setStatus({
          isConfigured: false,
          agentIdConfigured: false,
          apiKeyConfigured: false,
          error: data.error || "Configuration check failed",
        });
      }
    } catch (error) {
      // Only log network errors or actual unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.warn("Configuration check issue:", errorMessage);
      setStatus({
        isConfigured: false,
        agentIdConfigured: false,
        apiKeyConfigured: false,
        error: `Configuration check failed: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupComplete = () => {
    // Refresh configuration status after setup
    checkConfiguration();
    setShowSetup(false);
  };

  const handleOnboardingComplete = () => {
    // Refresh configuration status after onboarding
    checkConfiguration();
    setShowOnboarding(false);
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setShowAgentSelector(false);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-green-500 text-lg">✅</div>
              <div>
                <span className="text-green-700 text-sm font-medium">
                  Configuration verified - ready to start conversations!
                </span>
                {selectedAgent && (
                  <div className="text-xs text-green-600 mt-1">
                    Selected Agent: {selectedAgent.name}
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => setShowAgentSelector(true)}
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              🤖 Select Agent
            </Button>
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
            <Button
              onClick={() => setShowOnboarding(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-xs h-8"
            >
              🎯 Guided Setup
            </Button>
            <Button
              onClick={() => setShowSetup(true)}
              className="bg-amber-600 text-white hover:bg-amber-700 text-xs h-8"
            >
              🚀 Quick Setup
            </Button>
            {status.agentIdConfigured && status.apiKeyConfigured && (
              <Button
                onClick={() => setShowAgentSelector(true)}
                variant="outline"
                className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs h-8"
              >
                🤖 Browse Agents
              </Button>
            )}
            <a
              href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 bg-white text-amber-600 border border-amber-300 rounded text-xs hover:bg-amber-50 transition-colors"
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

      <CredentialSetup
        isVisible={showSetup}
        onClose={() => setShowSetup(false)}
        onCredentialsUpdated={handleSetupComplete}
      />

      <OnboardingWizard
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => setShowOnboarding(false)}
      />
    </Card>
  );
}
