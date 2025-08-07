"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Settings, Zap } from "lucide-react";
import { CredentialSetup } from "./CredentialSetup";
import { OnboardingWizard } from "./OnboardingWizard";
import { AgentSelector } from "./AgentSelector";

interface ConfigStatus {
  isConfigured: boolean;
  agentIdConfigured: boolean;
  apiKeyConfigured: boolean;
  error?: string;
}

interface ConfigurationPopupProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  autoShow?: boolean; // Auto-show when configuration is missing
}

/**
 * Configuration popup that matches the existing amber theme
 * Shows setup guidance when configuration is required
 */
export function ConfigurationPopup({
  isVisible,
  onClose,
  title = "Setup Required",
  description = "Configuration needed to start conversations",
  autoShow = false,
}: ConfigurationPopupProps) {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [internalVisible, setInternalVisible] = useState(isVisible);

  useEffect(() => {
    if (autoShow) {
      checkConfiguration();
    }
  }, [autoShow]);

  useEffect(() => {
    setInternalVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (autoShow && status && !status.isConfigured) {
      setInternalVisible(true);
    } else if (autoShow && status?.isConfigured) {
      setInternalVisible(false);
    }
  }, [status, autoShow]);

  const checkConfiguration = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signed-url");

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
        const agentIdConfigured = !data.error?.includes("AGENT_ID");
        const apiKeyConfigured = !data.error?.includes("ELEVENLABS_API_KEY");

        setStatus({
          isConfigured: false,
          agentIdConfigured,
          apiKeyConfigured,
          error: data.error,
        });
      } else {
        setStatus({
          isConfigured: false,
          agentIdConfigured: false,
          apiKeyConfigured: false,
          error: data.error || "Configuration check failed",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
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

  const handleClose = () => {
    setInternalVisible(false);
    onClose();
  };

  const handleSetupComplete = () => {
    checkConfiguration();
    setShowSetup(false);
  };

  const handleOnboardingComplete = () => {
    checkConfiguration();
    setShowOnboarding(false);
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setShowAgentSelector(false);
  };

  if (!internalVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">{title}</h3>
                <p className="text-sm text-amber-600">{description}</p>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:bg-amber-100 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                  <span className="text-amber-700 text-sm">
                    Checking configuration...
                  </span>
                </div>
              </div>
            ) : status?.isConfigured ? (
              <div className="text-center py-8 space-y-4">
                <div className="p-3 bg-green-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-green-800">
                    Configuration Complete!
                  </h4>
                  <p className="text-sm text-green-600 mt-1">
                    Ready to start conversations
                  </p>
                  {selectedAgent && (
                    <p className="text-xs text-green-500 mt-2">
                      Agent: {selectedAgent.name}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleClose}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Get Started
                </Button>
              </div>
            ) : (
              <>
                {/* Configuration Status */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                  <p className="text-amber-700 text-sm font-medium">
                    Configuration Status:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={
                          status?.agentIdConfigured ? "text-green-500" : "text-red-500"
                        }
                      >
                        {status?.agentIdConfigured ? "✅" : "❌"}
                      </div>
                      <span className="text-sm text-amber-700">
                        Agent ID {status?.agentIdConfigured ? "configured" : "missing"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={
                          status?.apiKeyConfigured ? "text-green-500" : "text-red-500"
                        }
                      >
                        {status?.apiKeyConfigured ? "✅" : "❌"}
                      </div>
                      <span className="text-sm text-amber-700">
                        API Key {status?.apiKeyConfigured ? "configured" : "missing"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Setup Steps */}
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <p className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Quick Setup Steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-amber-700">
                    <li>Get your ElevenLabs API key</li>
                    <li>Create a Conversational AI agent</li>
                    <li>Update your environment variables</li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => setShowOnboarding(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm h-10 w-full"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Guided Setup Wizard
                    </Button>
                    <Button
                      onClick={() => setShowSetup(true)}
                      className="bg-amber-600 text-white hover:bg-amber-700 text-sm h-10 w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Quick Configuration
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-white text-amber-600 border border-amber-300 rounded text-sm hover:bg-amber-50 transition-colors"
                    >
                      📚 Setup Guide
                    </a>
                    <a
                      href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-white text-amber-600 border border-amber-300 rounded text-sm hover:bg-amber-50 transition-colors"
                    >
                      🔑 Get API Key
                    </a>
                  </div>

                  <Button
                    onClick={checkConfiguration}
                    variant="outline"
                    className="w-full text-amber-700 border-amber-300 hover:bg-amber-50 text-sm"
                  >
                    🔄 Recheck Configuration
                  </Button>
                </div>

                {/* Error Display */}
                {status?.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700">
                      <strong>Error:</strong> {status.error}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub-modals */}
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

      <AgentSelector
        isVisible={showAgentSelector}
        selectedAgentId={selectedAgent?.id}
        onAgentSelect={handleAgentSelect}
        onClose={() => setShowAgentSelector(false)}
        apiKey={process.env.ELEVENLABS_API_KEY}
      />
    </>
  );
}
