"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Sparkles,
  Key,
  Mic,
  Play
} from "lucide-react";

interface OnboardingWizardProps {
  isVisible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

type WizardStep = 
  | "welcome"
  | "account"
  | "api-key"
  | "agent-creation"
  | "agent-id"
  | "testing"
  | "complete";

const STEPS: { id: WizardStep; title: string; description: string }[] = [
  {
    id: "welcome",
    title: "Welcome to ElevenLabs AI",
    description: "Let's set up your conversational AI in just a few steps"
  },
  {
    id: "account",
    title: "ElevenLabs Account",
    description: "Ensure you have an ElevenLabs account"
  },
  {
    id: "api-key",
    title: "Get Your API Key",
    description: "Find and copy your API key"
  },
  {
    id: "agent-creation",
    title: "Create an AI Agent",
    description: "Set up your conversational AI agent"
  },
  {
    id: "agent-id",
    title: "Get Agent ID",
    description: "Copy your agent's unique identifier"
  },
  {
    id: "testing",
    title: "Test Configuration",
    description: "Verify everything works correctly"
  },
  {
    id: "complete",
    title: "Setup Complete!",
    description: "You're ready to start conversations"
  }
];

/**
 * Step-by-step onboarding wizard for ElevenLabs setup
 */
export function OnboardingWizard({ isVisible, onComplete, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome");
  const [credentials, setCredentials] = useState({
    apiKey: "",
    agentId: ""
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  if (!isVisible) return null;

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const markStepComplete = (stepId: WizardStep) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      markStepComplete(currentStep);
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleComplete = () => {
    markStepComplete(currentStep);
    onComplete();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎙️</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Welcome to ElevenLabs Conversational AI</h3>
              <p className="text-gray-600">
                This wizard will help you set up your credentials and create your first AI conversation. 
                The process takes about 5 minutes.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What you'll need:</strong><br />
                • An ElevenLabs account (free or paid)<br />
                • About 5 minutes of your time<br />
                • A microphone for testing
              </p>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">ElevenLabs Account Required</h3>
              <p className="text-gray-600">
                You'll need an ElevenLabs account to use the conversational AI features.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">✅ Already have an account?</h4>
                <p className="text-sm text-gray-600 mb-3">Great! You can continue to the next step.</p>
                <Button variant="outline" size="sm" onClick={nextStep}>
                  I have an account
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">🆕 Need to create an account?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Sign up for free at ElevenLabs and return to continue setup.
                </p>
                <a
                  href="https://elevenlabs.io/sign-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Create Account <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        );

      case "api-key":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Key className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get Your API Key</h3>
              <p className="text-gray-600">
                Your API key allows this demo to connect to ElevenLabs services.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">📋 Steps to get your API key:</h4>
                <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                  <li>Go to your ElevenLabs profile settings</li>
                  <li>Find the "API" section</li>
                  <li>Copy your API key (starts with "sk_")</li>
                  <li>Paste it in the field below</li>
                </ol>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wizardApiKey">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="wizardApiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="sk_..."
                      value={credentials.apiKey}
                      onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-6 w-6 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <a
                    href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Get Key <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      case "agent-creation":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create Your AI Agent</h3>
              <p className="text-gray-600">
                An AI agent defines the personality and voice of your conversational AI.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-2">🤖 Creating your agent:</h4>
                <ol className="list-decimal list-inside text-sm text-purple-700 space-y-1">
                  <li>Go to ElevenLabs Conversational AI</li>
                  <li>Click "Create Agent" or "New Agent"</li>
                  <li>Choose a voice and personality</li>
                  <li>Set up basic conversation settings</li>
                  <li>Save your agent</li>
                </ol>
              </div>

              <div className="text-center">
                <a
                  href="https://elevenlabs.io/app/conversational-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Agent <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Start with a simple agent for testing. You can always 
                  create more sophisticated agents later with custom prompts and behaviors.
                </p>
              </div>
            </div>
          </div>
        );

      case "agent-id":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔢</div>
              <h3 className="text-xl font-semibold mb-2">Get Your Agent ID</h3>
              <p className="text-gray-600">
                Each agent has a unique ID that we need to connect to it.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">📋 Finding your Agent ID:</h4>
                <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
                  <li>Go to your agent in ElevenLabs</li>
                  <li>Look at the URL or agent settings</li>
                  <li>Copy the agent ID (long string of characters)</li>
                  <li>Paste it in the field below</li>
                </ol>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wizardAgentId">Agent ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="wizardAgentId"
                    placeholder="your-agent-id-here"
                    value={credentials.agentId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, agentId: e.target.value }))}
                  />
                  <a
                    href="https://elevenlabs.io/app/conversational-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Find ID <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      case "testing":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Play className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Test Your Configuration</h3>
              <p className="text-gray-600">
                Let's verify that your credentials work correctly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">🔑 API Key</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {credentials.apiKey ? 
                    `${credentials.apiKey.substring(0, 8)}...` : 
                    "Not provided"
                  }
                </p>
                <div className="text-xs text-gray-500">
                  {credentials.apiKey ? "✅ Ready to test" : "❌ Required"}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">🤖 Agent ID</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {credentials.agentId ? 
                    `${credentials.agentId.substring(0, 20)}...` : 
                    "Not provided"
                  }
                </p>
                <div className="text-xs text-gray-500">
                  {credentials.agentId ? "✅ Ready to test" : "❌ Required"}
                </div>
              </div>

              {credentials.apiKey && credentials.agentId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700 mb-3">
                    Ready to test! Click below to verify your configuration.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Mic className="h-4 w-4 mr-2" />
                    Test Configuration
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
              <p className="text-gray-600">
                Your ElevenLabs conversational AI is now configured and ready to use.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">✅ API Key Configured</h4>
                <p className="text-sm text-gray-600">Connected to ElevenLabs services</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">✅ Agent Ready</h4>
                <p className="text-sm text-gray-600">AI personality is set up</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">🚀 What's next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Click "Start Conversation" to test your setup</li>
                <li>• Grant microphone permission when prompted</li>
                <li>• Speak naturally with your AI agent</li>
                <li>• Explore advanced features and settings</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex].title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            {STEPS[currentStepIndex].description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep === "complete" ? (
                <Button
                  onClick={handleComplete}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                  Start Using AI
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                  disabled={
                    (currentStep === "api-key" && !credentials.apiKey) ||
                    (currentStep === "agent-id" && !credentials.agentId)
                  }
                >
                  {isLastStep ? "Complete" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
