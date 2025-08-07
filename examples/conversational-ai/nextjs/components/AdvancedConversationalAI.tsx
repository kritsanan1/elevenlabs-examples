"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback, useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Download,
  Settings,
  Play,
  Pause,
  VolumeX,
  Volume2,
  BarChart3,
  Brain,
  Zap,
  Globe,
  Users,
  MessageSquare,
  Sparkles,
  Waves,
  Eye,
  EyeOff,
  Command,
} from "lucide-react";
import { VoiceCommandPanel } from "./VoiceCommandPanel";

// Types
interface ConversationAnalytics {
  duration: number;
  wordCount: number;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
  keyPhrases: string[];
}

interface VoicePersona {
  id: string;
  name: string;
  description: string;
  voice: string;
  personality: string;
  avatar: string;
}

interface ConversationMessage {
  id: string;
  timestamp: Date;
  speaker: "user" | "agent";
  content: string;
  sentiment?: "positive" | "neutral" | "negative";
}

// Audio Visualization Component
const AudioVisualizer: React.FC<{
  isActive: boolean;
  isSpeaking: boolean;
  mode: "orb" | "waveform" | "spectrum";
}> = ({ isActive, isSpeaking, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === "orb") {
        drawOrb(ctx, canvas.width / 2, canvas.height / 2, isActive, isSpeaking);
      } else if (mode === "waveform") {
        drawWaveform(ctx, canvas.width, canvas.height, isActive, isSpeaking);
      } else if (mode === "spectrum") {
        drawSpectrum(ctx, canvas.width, canvas.height, isActive, isSpeaking);
      }

      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isActive, isSpeaking, mode]);

  const drawOrb = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    active: boolean,
    speaking: boolean
  ) => {
    const time = Date.now() * 0.005;
    const baseRadius = 40;
    const pulseRadius = speaking
      ? baseRadius + Math.sin(time * 3) * 15
      : baseRadius;

    // Gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius);
    gradient.addColorStop(0, active ? "#60a5fa" : "#64748b");
    gradient.addColorStop(0.7, active ? "#3b82f6" : "#475569");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // Rings
    if (speaking) {
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          pulseRadius + i * 20 + Math.sin(time * 2 + i) * 5,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    }
  };

  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    active: boolean,
    speaking: boolean
  ) => {
    const centerY = height / 2;
    const time = Date.now() * 0.01;

    ctx.strokeStyle = active ? "#3b82f6" : "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < width; x += 2) {
      const amplitude = speaking ? 30 + Math.random() * 20 : 10;
      const frequency = 0.02;
      const y = centerY + Math.sin(x * frequency + time) * amplitude;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawSpectrum = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    active: boolean,
    speaking: boolean
  ) => {
    const barCount = 32;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const barHeight = speaking
        ? Math.random() * height * 0.8
        : Math.sin(Date.now() * 0.005 + i * 0.5) * height * 0.2 + height * 0.1;

      const hue = active ? 210 + i * 5 : 220;
      ctx.fillStyle = `hsl(${hue}, 70%, ${active ? 60 : 40}%)`;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      className="border rounded-lg bg-gray-50"
    />
  );
};

// Conversation Analytics Panel
const AnalyticsPanel: React.FC<{
  analytics: ConversationAnalytics;
  messages: ConversationMessage[];
  isVisible: boolean;
}> = ({ analytics, messages, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Conversation Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(analytics.duration / 60)}m
            </div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.wordCount}
            </div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                analytics.sentiment === "positive"
                  ? "text-green-600"
                  : analytics.sentiment === "negative"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {analytics.sentiment === "positive"
                ? "😊"
                : analytics.sentiment === "negative"
                  ? "😔"
                  : "😐"}
            </div>
            <div className="text-sm text-gray-600">Sentiment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {messages.length}
            </div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.topics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Voice Persona Selector
const PersonaSelector: React.FC<{
  personas: VoicePersona[];
  selectedPersona: VoicePersona;
  onPersonaChange: (persona: VoicePersona) => void;
  isVisible: boolean;
}> = ({ personas, selectedPersona, onPersonaChange, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          AI Personas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {personas.map(persona => (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                selectedPersona.id === persona.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="text-2xl mb-1">{persona.avatar}</div>
              <div className="font-semibold">{persona.name}</div>
              <div className="text-sm text-gray-600">{persona.description}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Advanced Features Component
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
    console.warn("Error in getSignedUrl:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Network error - please check your connection");
    }
  }
}

export function AdvancedConversationalAI() {
  const [error, setError] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<
    "orb" | "waveform" | "spectrum"
  >("orb");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [analytics, setAnalytics] = useState<ConversationAnalytics>({
    duration: 0,
    wordCount: 0,
    sentiment: "neutral",
    topics: ["AI", "Technology", "Conversation"],
    keyPhrases: [],
  });

  const personas: VoicePersona[] = [
    {
      id: "assistant",
      name: "Assistant",
      description: "Professional and helpful",
      voice: "sarah",
      personality: "professional",
      avatar: "🤖",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Artistic and imaginative",
      voice: "bella",
      personality: "creative",
      avatar: "🎨",
    },
    {
      id: "scientist",
      name: "Scientist",
      description: "Analytical and precise",
      voice: "adam",
      personality: "analytical",
      avatar: "🔬",
    },
  ];

  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Successfully connected to conversation");
      setError(null);
      setIsRecording(true);
    },
    onDisconnect: () => {
      console.log("Disconnected from conversation");
      setIsRecording(false);
    },
    onError: error => {
      console.error("Conversation error:", error);

      // More detailed error handling for conversation errors
      let errorMessage = "An error occurred during the conversation";

      if (error && typeof error === "object") {
        if ("message" in error) {
          errorMessage = error.message as string;
        } else if ("error" in error) {
          errorMessage = error.error as string;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setError(errorMessage);
      setIsRecording(false);
    },
    onMessage: message => {
      console.log(message);
      // Add message to conversation history
      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        speaker: message.source === "user" ? "user" : "agent",
        content: message.message || "",
        sentiment: "neutral", // Would be determined by sentiment analysis
      };
      setMessages(prev => [...prev, newMessage]);

      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        wordCount: prev.wordCount + (message.message?.split(" ").length || 0),
        duration: prev.duration + 1,
      }));
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
      console.warn("Failed to start conversation:", error);

      // More detailed error handling
      if (error instanceof Error) {
        console.warn("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        setError(error.message);
      } else {
        console.warn("Unknown error:", error);
        setError(
          "An unexpected error occurred while starting the conversation"
        );
      }
    }
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const exportConversation = () => {
    const transcript = messages
      .map(
        msg =>
          `[${msg.timestamp.toLocaleTimeString()}] ${msg.speaker.toUpperCase()}: ${msg.content}`
      )
      .join("\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Conversation Interface */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {isRecording && (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
              {conversation.status === "connected"
                ? conversation.isSpeaking
                  ? `${selectedPersona.avatar} Agent is speaking`
                  : "🎤 Agent is listening"
                : "💭 Ready to connect"}
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
                        To experience all advanced features, configure your
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

          {/* Audio Visualizer */}
          <div className="flex justify-center mb-6">
            <AudioVisualizer
              isActive={conversation.status === "connected"}
              isSpeaking={conversation.isSpeaking || false}
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
            <div className="flex justify-center gap-3">
              <Button
                variant="default"
                className="rounded-full"
                size="lg"
                disabled={
                  conversation !== null && conversation.status === "connected"
                }
                onClick={startConversation}
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Conversation
              </Button>

              <Button
                variant="outline"
                className="rounded-full"
                size="lg"
                disabled={
                  conversation === null || conversation.status !== "connected"
                }
                onClick={stopConversation}
              >
                <MicOff className="h-5 w-5 mr-2" />
                End Conversation
              </Button>
            </div>

            {/* Advanced Controls */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                {showAnalytics ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPersonas(!showPersonas)}
              >
                <Users className="h-4 w-4 mr-1" />
                Personas
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVoiceCommands(!showVoiceCommands)}
              >
                <Command className="h-4 w-4 mr-1" />
                Commands
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportConversation}
                disabled={messages.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <AnalyticsPanel
        analytics={analytics}
        messages={messages}
        isVisible={showAnalytics}
      />

      <PersonaSelector
        personas={personas}
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
        isVisible={showPersonas}
      />

      {/* Voice Command Panel */}
      {showVoiceCommands && <VoiceCommandPanel />}

      {/* Live Transcript */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Live Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {messages.slice(-10).map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "p-2 rounded-lg",
                    message.speaker === "user"
                      ? "bg-blue-50 text-blue-900 ml-8"
                      : "bg-gray-50 text-gray-900 mr-8"
                  )}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {message.speaker === "user"
                      ? "👤 You"
                      : `${selectedPersona.avatar} Agent`}{" "}
                    • {message.timestamp.toLocaleTimeString()}
                  </div>
                  <div>{message.content}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
