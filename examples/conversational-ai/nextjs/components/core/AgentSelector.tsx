"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Search,
  Mic,
  Settings,
  Star,
  Clock,
  Globe,
  User,
  Volume2,
  RefreshCw,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  voice: {
    id: string;
    name: string;
    category: string;
    accent: string;
  };
  personality: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  conversationCount?: number;
}

interface AgentSelectorProps {
  isVisible: boolean;
  selectedAgentId?: string;
  onAgentSelect: (agent: Agent) => void;
  onClose: () => void;
  apiKey?: string;
}

/**
 * Agent selection component with voice preview
 */
export function AgentSelector({
  isVisible,
  selectedAgentId,
  onAgentSelect,
  onClose,
  apiKey,
}: AgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewingAgent, setPreviewingAgent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demo - in real app, fetch from ElevenLabs API
  const mockAgents: Agent[] = [
    {
      id: "agent_1",
      name: "Professional Assistant",
      description:
        "A professional and helpful AI assistant for business conversations",
      voice: {
        id: "sarah",
        name: "Sarah",
        category: "Professional",
        accent: "American",
      },
      personality: "Professional, helpful, and articulate",
      language: "English (US)",
      isActive: true,
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
      conversationCount: 42,
    },
    {
      id: "agent_2",
      name: "Creative Storyteller",
      description:
        "An imaginative AI that specializes in creative storytelling and brainstorming",
      voice: {
        id: "bella",
        name: "Bella",
        category: "Creative",
        accent: "British",
      },
      personality: "Creative, imaginative, and inspiring",
      language: "English (UK)",
      isActive: true,
      createdAt: "2024-01-10",
      lastUsed: "2024-01-18",
      conversationCount: 28,
    },
    {
      id: "agent_3",
      name: "Technical Expert",
      description:
        "A knowledgeable AI for technical discussions and problem-solving",
      voice: {
        id: "adam",
        name: "Adam",
        category: "Technical",
        accent: "Canadian",
      },
      personality: "Analytical, precise, and knowledgeable",
      language: "English (CA)",
      isActive: false,
      createdAt: "2024-01-05",
      conversationCount: 15,
    },
  ];

  useEffect(() => {
    if (isVisible) {
      loadAgents();
    }
  }, [isVisible, apiKey]);

  const loadAgents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        // Use mock data when no API key
        setAgents(mockAgents);
        return;
      }

      // In real implementation, fetch from ElevenLabs API
      const response = await fetch("/api/agents", {
        headers: {
          "xi-api-key": apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || mockAgents);
      } else {
        // Fallback to mock data
        setAgents(mockAgents);
      }
    } catch (error) {
      console.error("Error loading agents:", error);
      setAgents(mockAgents); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAgents = agents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.voice.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const previewVoice = async (agent: Agent) => {
    setPreviewingAgent(agent.id);

    // Simulate voice preview - in real app, use ElevenLabs TTS
    setTimeout(() => {
      setPreviewingAgent(null);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Your AI Agent
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadAgents}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Choose an AI agent to start your conversation. Each agent has a
            unique personality and voice.
          </p>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents by name, description, or voice..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Loading agents...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadAgents} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "No agents match your search"
                  : "No agents found"}
              </p>
              {!apiKey && (
                <p className="text-sm text-gray-500">
                  Connect your API key to see your actual agents
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAgents.map(agent => (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAgentId === agent.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onAgentSelect(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {agent.name}
                          </h3>
                          {!agent.isActive && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Inactive
                            </span>
                          )}
                          {selectedAgentId === agent.id && (
                            <Star className="h-4 w-4 text-blue-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {agent.description}
                        </p>
                      </div>
                    </div>

                    {/* Voice info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {agent.voice.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({agent.voice.accent})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            previewVoice(agent);
                          }}
                          disabled={previewingAgent === agent.id}
                          className="h-6 px-2"
                        >
                          {previewingAgent === agent.id ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">
                        {agent.personality}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {agent.language}
                        </div>
                        {agent.conversationCount && (
                          <div className="flex items-center gap-1">
                            <Mic className="h-3 w-3" />
                            {agent.conversationCount} chats
                          </div>
                        )}
                      </div>
                      {agent.lastUsed && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(agent.lastUsed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredAgents.length} agent
              {filteredAgents.length !== 1 ? "s" : ""} available
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {selectedAgentId && (
                <Button onClick={onClose}>Start Conversation</Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
