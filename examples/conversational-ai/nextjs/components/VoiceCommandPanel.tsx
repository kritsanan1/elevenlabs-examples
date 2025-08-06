"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Save,
  Trash2,
  Share,
  Clock,
  Target,
  Zap,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface VoiceCommand {
  command: string;
  action: string;
  description: string;
  enabled: boolean;
}

interface ConversationSettings {
  autoTranscribe: boolean;
  voiceCommands: boolean;
  backgroundListening: boolean;
  intelligentPause: boolean;
  conversationMode: 'standard' | 'focus' | 'presentation';
  responseSpeed: number;
  interruptionHandling: boolean;
}

interface SavedConversation {
  id: string;
  title: string;
  duration: number;
  timestamp: Date;
  messages: number;
  participants: string[];
}

export function VoiceCommandPanel() {
  const [isListening, setIsListening] = useState(false);
  const [settings, setSettings] = useState<ConversationSettings>({
    autoTranscribe: true,
    voiceCommands: true,
    backgroundListening: false,
    intelligentPause: true,
    conversationMode: 'standard',
    responseSpeed: 1.0,
    interruptionHandling: true
  });
  
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([
    {
      id: '1',
      title: 'Product Planning Discussion',
      duration: 1800,
      timestamp: new Date(Date.now() - 86400000),
      messages: 45,
      participants: ['You', 'AI Assistant']
    },
    {
      id: '2',
      title: 'Creative Brainstorming',
      duration: 2400,
      timestamp: new Date(Date.now() - 172800000),
      messages: 32,
      participants: ['You', 'Creative AI']
    }
  ]);

  const [activeCommands] = useState<VoiceCommand[]>([
    { command: "Hey AI, pause", action: "pause", description: "Pause the conversation", enabled: true },
    { command: "Hey AI, resume", action: "resume", description: "Resume the conversation", enabled: true },
    { command: "Hey AI, summary", action: "summary", description: "Generate conversation summary", enabled: true },
    { command: "Hey AI, save", action: "save", description: "Save current conversation", enabled: true },
    { command: "Hey AI, switch persona", action: "switch_persona", description: "Change AI personality", enabled: true },
    { command: "Hey AI, increase speed", action: "speed_up", description: "Make AI speak faster", enabled: true },
    { command: "Hey AI, decrease speed", action: "slow_down", description: "Make AI speak slower", enabled: true },
    { command: "Hey AI, focus mode", action: "focus_mode", description: "Enter distraction-free mode", enabled: true }
  ]);

  const [recognizedCommand, setRecognizedCommand] = useState<string | null>(null);
  const commandTimeoutRef = useRef<NodeJS.Timeout>();

  // Voice command recognition simulation
  useEffect(() => {
    if (isListening && settings.voiceCommands) {
      const interval = setInterval(() => {
        // Simulate voice command recognition
        const randomCommand = activeCommands[Math.floor(Math.random() * activeCommands.length)];
        if (Math.random() > 0.95) { // 5% chance of command recognition
          setRecognizedCommand(randomCommand.command);
          
          // Clear command after 3 seconds
          if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
          }
          commandTimeoutRef.current = setTimeout(() => {
            setRecognizedCommand(null);
          }, 3000);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isListening, settings.voiceCommands, activeCommands]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Voice Commands Status */}
      {recognizedCommand && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <div className="font-semibold text-green-800">Voice Command Recognized</div>
                <div className="text-sm text-green-700">{recognizedCommand}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Conversation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conversation Mode Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Conversation Mode</label>
            <div className="flex gap-2">
              {(['standard', 'focus', 'presentation'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={settings.conversationMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, conversationMode: mode }))}
                  className="capitalize"
                >
                  {mode === 'standard' && <Bot className="h-4 w-4 mr-1" />}
                  {mode === 'focus' && <Target className="h-4 w-4 mr-1" />}
                  {mode === 'presentation' && <Settings className="h-4 w-4 mr-1" />}
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Response Speed Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Response Speed: {settings.responseSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.responseSpeed}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                responseSpeed: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          {/* Smart Features Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.autoTranscribe}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  autoTranscribe: e.target.checked 
                }))}
                className="rounded"
              />
              Auto Transcribe
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.voiceCommands}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  voiceCommands: e.target.checked 
                }))}
                className="rounded"
              />
              Voice Commands
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.backgroundListening}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  backgroundListening: e.target.checked 
                }))}
                className="rounded"
              />
              Background Listen
            </label>
            
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.intelligentPause}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  intelligentPause: e.target.checked 
                }))}
                className="rounded"
              />
              Smart Pause
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {activeCommands.filter(cmd => cmd.enabled).map((command, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div>
                  <div className="font-mono text-sm text-blue-600">"{command.command}"</div>
                  <div className="text-xs text-gray-600">{command.description}</div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Voice commands work even during conversations. 
              The AI will recognize and respond to control commands naturally.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Saved Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold">{conversation.title}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(conversation.duration)}
                    </span>
                    <span>{conversation.messages} messages</span>
                    <span>{formatTimestamp(conversation.timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            View All Conversations
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
              <Save className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Save Session</div>
                <div className="text-xs text-gray-600">Quick save current chat</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
              <Share className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Share Insights</div>
                <div className="text-xs text-gray-600">Export key moments</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
              <SkipBack className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Replay Last</div>
                <div className="text-xs text-gray-600">Hear previous response</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
              <Bot className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">AI Summary</div>
                <div className="text-xs text-gray-600">Get conversation recap</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
