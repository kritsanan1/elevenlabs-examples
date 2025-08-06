// Core conversation types
export interface ConversationMessage {
  id: string;
  timestamp: Date;
  speaker: "user" | "agent";
  content: string;
  sentiment?: "positive" | "neutral" | "negative";
}

export interface ConversationAnalytics {
  duration: number;
  wordCount: number;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
  keyPhrases: string[];
}

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  voice: string;
  personality: string;
  avatar: string;
}

export interface ConversationSettings {
  autoTranscribe: boolean;
  voiceCommands: boolean;
  backgroundListening: boolean;
  intelligentPause: boolean;
  conversationMode: "standard" | "focus" | "presentation";
  responseSpeed: number;
  interruptionHandling: boolean;
}

export interface SavedConversation {
  id: string;
  title: string;
  duration: number;
  timestamp: Date;
  messages: number;
  participants: string[];
}

export interface VoiceCommand {
  command: string;
  action: string;
  description: string;
  enabled: boolean;
}

// API response types
export interface SignedUrlResponse {
  signedUrl: string;
}

export interface ApiError {
  error: string;
  setup?: string;
  details?: string;
}

// Conversation state types
export type ConversationStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface ConversationState {
  status: ConversationStatus;
  isRecording: boolean;
  isSpeaking: boolean;
  error: string | null;
  messages: ConversationMessage[];
  analytics: ConversationAnalytics;
  selectedPersona: VoicePersona;
}

// Visualization types
export type VisualizationMode = "orb" | "waveform" | "spectrum";

export interface VisualizationConfig {
  mode: VisualizationMode;
  isActive: boolean;
  isSpeaking: boolean;
}
