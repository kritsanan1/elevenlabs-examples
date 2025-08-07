"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";
import { useConfiguration } from "@/hooks/useConfiguration";
import { useConfigurationPopup } from "@/hooks/useConfigurationPopup";
import { ConfigurationStatus } from "@/components/core/ConfigurationStatus";
import { ConfigurationPopup } from "@/components/core/ConfigurationPopup";

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  try {
    const response = await fetch("/api/signed-url");

    if (!response.ok) {
      const errorData = await response.json();

      // Use warning level for expected configuration errors (400)
      if (response.status === 400) {
        console.warn(
          "Configuration issue (expected when not configured):",
          errorData
        );
        throw new Error(
          errorData.error ||
            "Configuration error - please check your ElevenLabs credentials"
        );
      } else {
        console.error("API error response:", errorData);
        if (response.status === 500) {
          throw new Error(errorData.error || "Server error - please try again");
        } else {
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: Failed to get signed URL`
          );
        }
      }
    }

    const data = await response.json();

    if (!data.signedUrl) {
      throw new Error("No signed URL received from server");
    }

    return data.signedUrl;
  } catch (error) {
    // Use warning level for expected configuration errors
    const isConfigError =
      error instanceof Error &&
      (error.message.includes("AGENT_ID") ||
        error.message.includes("ELEVENLABS_API_KEY") ||
        error.message.includes("Configuration error"));

    if (isConfigError) {
      console.warn("Configuration error (expected):", error);
    } else {
      console.error("Unexpected error in getSignedUrl:", error);
    }

    // Better error handling with detailed logging
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error - unable to connect to the server. Please check your internet connection."
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      // Convert any non-Error objects to proper Error with details
      const errorMsg =
        typeof error === "object" && error !== null
          ? JSON.stringify(error)
          : String(error);
      throw new Error(`Unexpected error: ${errorMsg}`);
    }
  }
}

export function ConvAI() {
  const [error, setError] = React.useState<string | null>(null);
  const config = useConfiguration();
  const configPopup = useConfigurationPopup();

  const conversation = useConversation({
    onConnect: () => {
      setError(null);
    },
    onDisconnect: () => {
      // Connection ended
    },
    onError: () => {
      setError("An error occurred during the conversation");
    },
    onMessage: () => {
      // Message received
    },
  });

  async function startConversation() {
    try {
      setError(null);

      // Pre-validate configuration
      if (!config.isConfigured) {
        setError(
          "Please configure your ElevenLabs credentials before starting a conversation"
        );
        return;
      }

      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setError("Microphone permission is required for voice conversations");
        return;
      }

      const signedUrl = await getSignedUrl();
      await conversation.startSession({ signedUrl });
    } catch (error) {
      // Enhanced error handling with better user messages
      if (error instanceof Error) {
        const isConfigError =
          error.message.includes("AGENT_ID") ||
          error.message.includes("ELEVENLABS_API_KEY") ||
          error.message.includes("Configuration error");

        if (isConfigError) {
          console.warn("Configuration error (expected):", error.message);
        } else {
          console.error("Failed to start conversation:", error);
        }

        // Provide user-friendly error messages
        if (isConfigError) {
          setError(error.message);
        } else if (
          error.message.includes("Network error") ||
          error.message.includes("fetch")
        ) {
          setError(
            "Network connection error. Please check your internet connection and try again."
          );
        } else if (error.message.includes("Microphone")) {
          setError(
            "Microphone access is required. Please grant permission and try again."
          );
        } else {
          setError(`Failed to start conversation: ${error.message}`);
        }
      } else {
        console.error("Unknown error type:", typeof error, error);
        // Better error serialization for objects
        let errorDetails = String(error);
        if (typeof error === "object" && error !== null) {
          try {
            // Try to extract meaningful properties from the error object
            const errorProps = Object.getOwnPropertyNames(error);
            if (errorProps.length > 0) {
              errorDetails = errorProps
                .map(prop => `${prop}: ${error[prop]}`)
                .join(", ");
            } else {
              errorDetails = error.toString();
            }
          } catch {
            errorDetails = "Unknown error object";
          }
        }
        setError(`An unexpected error occurred: ${errorDetails}`);
      }
    }
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Determine if conversation controls should be disabled
  const isDisabled = !config.isConfigured || config.isLoading;

  return (
    <div className="space-y-4">
      {/* Always show configuration status */}
      <ConfigurationStatus />

      <div className={"flex justify-center items-center gap-x-4"}>
        <Card className={"rounded-3xl"}>
          <CardContent>
            <CardHeader>
              <CardTitle className={"text-center"}>
                {conversation.status === "connected"
                  ? conversation.isSpeaking
                    ? `Agent is speaking`
                    : "Agent is listening"
                  : config.isConfigured
                    ? "Ready to connect"
                    : "Configuration required"}
              </CardTitle>
            </CardHeader>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-lg">⚠️</div>
                  <div className="flex-1">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                    {error.includes("AGENT_ID") ||
                    error.includes("ELEVENLABS_API_KEY") ||
                    error.includes("Configuration error") ||
                    error.includes("configure your ElevenLabs credentials") ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-red-600 text-xs">
                          To use this demo, you need to configure your
                          ElevenLabs credentials:
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
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            <div className={"flex flex-col gap-y-4 text-center"}>
              <div
                className={cn(
                  "orb my-16 mx-12",
                  conversation.status === "connected" && conversation.isSpeaking
                    ? "orb-active animate-orb"
                    : conversation.status === "connected"
                      ? "animate-orb-slow orb-inactive"
                      : config.isConfigured
                        ? "orb-inactive"
                        : "orb-disabled opacity-40"
                )}
              ></div>

              <Button
                variant={config.isConfigured ? "outline" : "secondary"}
                className={"rounded-full"}
                size={"lg"}
                disabled={
                  isDisabled ||
                  (conversation !== null && conversation.status === "connected")
                }
                onClick={startConversation}
                title={
                  !config.isConfigured
                    ? "Please configure your ElevenLabs credentials first"
                    : conversation.status === "connected"
                      ? "Conversation is already active"
                      : "Start a new conversation"
                }
              >
                {config.isLoading
                  ? "Checking configuration..."
                  : !config.isConfigured
                    ? "Configure to start"
                    : "Start conversation"}
              </Button>
              <Button
                variant={"outline"}
                className={"rounded-full"}
                size={"lg"}
                disabled={
                  conversation === null || conversation.status !== "connected"
                }
                onClick={stopConversation}
              >
                End conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
