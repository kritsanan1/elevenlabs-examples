"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@11labs/react";
import { cn } from "@/lib/utils";

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
    console.log("Making request to /api/signed-url");
    const response = await fetch("/api/signed-url");
    console.log("Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);

      // Provide more specific error messages
      if (response.status === 400) {
        throw new Error(errorData.error || "Configuration error - please check your ElevenLabs credentials");
      } else if (response.status === 500) {
        throw new Error(errorData.error || "Server error - please try again");
      } else {
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to get signed URL`);
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
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error - please check your connection");
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

      // More detailed error handling
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setError(error.message);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred while starting the conversation");
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              {error.includes("AGENT_ID") || error.includes("ELEVENLABS_API_KEY") ? (
                <p className="text-red-600 text-xs mt-2">
                  Please configure your ElevenLabs credentials in the .env file to use this demo.
                </p>
              ) : null}
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
