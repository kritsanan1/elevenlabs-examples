"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";

async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately as we just need permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("Microphone permission denied:", error);
    // Provide more specific error information
    if (error.name === 'NotAllowedError') {
      console.error("User denied microphone access");
    } else if (error.name === 'NotFoundError') {
      console.error("No microphone found");
    } else if (error.name === 'NotSupportedError') {
      console.error("HTTPS required for microphone access");
    }
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  try {
    console.log("Making request to /api/signed-url");
    const response = await fetch("/api/signed-url");
    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);

      // Provide more specific error messages
      if (response.status === 400) {
        throw new Error(
          errorData.error ||
            "Configuration error - please check your ElevenLabs credentials"
        );
      } else if (response.status === 500) {
        throw new Error(errorData.error || "Server error - please try again");
      } else {
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to get signed URL`
        );
      }
    }

    const data = await response.json();
    console.log("API response data:", data);

    if (!data.signedUrl) {
      throw new Error("No signed URL received from server");
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error in getSignedUrl:", error);

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

  const conversation = useConversation({
    onConnect: () => {
      console.log("connected");
      setError(null);
    },
    onDisconnect: () => {
      console.log("disconnected");
    },
    onError: error => {
      console.log(error);
      setError("An error occurred during the conversation");
    },
    onMessage: message => {
      console.log(message);
    },
  });

  async function startConversation() {
    try {
      setError(null);
      console.log("Starting conversation...");

      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setError("Microphone permission is required for voice conversations");
        return;
      }
      console.log("Microphone permission granted");

      console.log("Fetching signed URL...");
      const signedUrl = await getSignedUrl();
      console.log("Got signed URL:", signedUrl ? "✓" : "✗");

      console.log("Starting conversation session...");
      const conversationId = await conversation.startSession({ signedUrl });
      console.log("Conversation started with ID:", conversationId);
    } catch (error) {
      console.error("Failed to start conversation:", error);

      // Enhanced error handling with better user messages
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });

        // Provide user-friendly error messages
        if (
          error.message.includes("AGENT_ID") ||
          error.message.includes("ELEVENLABS_API_KEY")
        ) {
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
        const errorDetails =
          typeof error === "object" && error !== null
            ? JSON.stringify(error)
            : String(error);
        setError(`An unexpected error occurred: ${errorDetails}`);
      }
    }
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className={"flex justify-center items-center gap-x-4"}>
      <Card className={"rounded-3xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center"}>
              {conversation.status === "connected"
                ? conversation.isSpeaking
                  ? `Agent is speaking`
                  : "Agent is listening"
                : "Disconnected"}
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
                  error.includes("Configuration error") ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-red-600 text-xs">
                        To use this demo, you need to configure your ElevenLabs
                        credentials:
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
                    : "orb-inactive"
              )}
            ></div>

            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={
                conversation !== null && conversation.status === "connected"
              }
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation === null}
              onClick={stopConversation}
            >
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
