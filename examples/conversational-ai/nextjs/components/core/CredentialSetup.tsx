"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save, Test, ExternalLink, Copy, Check, Trash2 } from "lucide-react";
import { saveCredentials, loadCredentials, clearCredentials, hasStoredCredentials } from "@/lib/credentialStorage";

interface CredentialSetupProps {
  isVisible: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

/**
 * Interactive credential setup component
 * Allows users to configure their ElevenLabs credentials through the UI
 */
export function CredentialSetup({ 
  isVisible, 
  onClose, 
  onCredentialsUpdated 
}: CredentialSetupProps) {
  const [credentials, setCredentials] = useState({
    agentId: "",
    apiKey: ""
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStored, setHasStored] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    agentId?: "valid" | "invalid" | "testing";
    apiKey?: "valid" | "invalid" | "testing";
    agentIdError?: string;
    apiKeyError?: string;
  }>({});
  const [copied, setCopied] = useState<string | null>(null);

  // Load stored credentials when component mounts
  useEffect(() => {
    if (isVisible) {
      const stored = loadCredentials();
      if (stored) {
        setCredentials({
          agentId: stored.agentId || "",
          apiKey: stored.apiKey || ""
        });
      }
      setHasStored(hasStoredCredentials());
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleInputChange = (field: "agentId" | "apiKey", value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear validation when user types
    setValidationResults(prev => ({ ...prev, [field]: undefined }));
  };

  const testCredential = async (field: "agentId" | "apiKey") => {
    setValidationResults(prev => ({
      ...prev,
      [field]: "testing",
      [`${field}Error`]: undefined
    }));

    try {
      // For agent ID testing, we need both credentials
      const testData = field === "agentId"
        ? { agentId: credentials.agentId, apiKey: credentials.apiKey }
        : { [field]: credentials[field] };

      const response = await fetch("/api/test-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      const isValid = result.valid;

      setValidationResults(prev => ({
        ...prev,
        [field]: isValid ? "valid" : "invalid",
        [`${field}Error`]: result.error
      }));
    } catch (error) {
      setValidationResults(prev => ({
        ...prev,
        [field]: "invalid",
        [`${field}Error`]: "Network error - please check your connection"
      }));
    }
  };

  const saveCredentials = async () => {
    setIsLoading(true);
    
    try {
      // Save credentials to backend/local storage
      const response = await fetch("/api/save-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        onCredentialsUpdated();
        onClose();
      } else {
        console.error("Failed to save credentials");
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const isFormValid = credentials.agentId.trim() && credentials.apiKey.trim();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔑 Configure ElevenLabs Credentials
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter your ElevenLabs credentials to start using the conversational AI demo.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Agent ID Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="agentId" className="text-sm font-medium">
                Agent ID
              </Label>
              <a
                href="https://elevenlabs.io/app/conversational-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Create Agent <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <div className="flex gap-2">
              <Input
                id="agentId"
                placeholder="your-agent-id-here"
                value={credentials.agentId}
                onChange={(e) => handleInputChange("agentId", e.target.value)}
                className={`flex-1 ${
                  validationResults.agentId === "valid" 
                    ? "border-green-500" 
                    : validationResults.agentId === "invalid"
                      ? "border-red-500"
                      : ""
                }`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testCredential("agentId")}
                disabled={
                  !credentials.agentId.trim() ||
                  !credentials.apiKey.trim() ||
                  validationResults.agentId === "testing"
                }
                title={
                  !credentials.apiKey.trim()
                    ? "API key is required to test Agent ID"
                    : "Test if agent ID is valid and accessible"
                }
              >
                {validationResults.agentId === "testing" ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Test className="h-4 w-4" />
                )}
              </Button>
            </div>

            {validationResults.agentId && (
              <div className={`text-xs flex items-center gap-1 ${
                validationResults.agentId === "valid" ? "text-green-600" : "text-red-600"
              }`}>
                {validationResults.agentId === "valid" ? (
                  "✅ Valid agent ID"
                ) : (
                  <div>
                    <div>❌ Invalid agent ID</div>
                    {validationResults.agentIdError && (
                      <div className="text-red-500 mt-1">{validationResults.agentIdError}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
              <p className="font-medium text-blue-800">How to get your Agent ID:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1 text-blue-700">
                <li>Go to ElevenLabs Conversational AI</li>
                <li>Create or select an existing agent</li>
                <li>Copy the agent ID from the URL or settings</li>
              </ol>
              <p className="mt-2 text-blue-600 font-medium">💡 Note: API key is required to test Agent ID</p>
            </div>
          </div>

          {/* API Key Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </Label>
              <a
                href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Get API Key <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk_..."
                  value={credentials.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  className={`pr-10 ${
                    validationResults.apiKey === "valid" 
                      ? "border-green-500" 
                      : validationResults.apiKey === "invalid"
                        ? "border-red-500"
                        : ""
                  }`}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => testCredential("apiKey")}
                disabled={!credentials.apiKey.trim() || validationResults.apiKey === "testing"}
              >
                {validationResults.apiKey === "testing" ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Test className="h-4 w-4" />
                )}
              </Button>
            </div>

            {validationResults.apiKey && (
              <div className={`text-xs flex items-center gap-1 ${
                validationResults.apiKey === "valid" ? "text-green-600" : "text-red-600"
              }`}>
                {validationResults.apiKey === "valid" ? (
                  "✅ Valid API key"
                ) : (
                  <div>
                    <div>❌ Invalid API key</div>
                    {validationResults.apiKeyError && (
                      <div className="text-red-500 mt-1">{validationResults.apiKeyError}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded p-3 text-xs">
              <p className="font-medium text-green-800">How to get your API Key:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1 text-green-700">
                <li>Sign in to your ElevenLabs account</li>
                <li>Go to your Profile settings</li>
                <li>Copy your API key from the API section</li>
              </ol>
            </div>
          </div>

          {/* Environment Variable Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <p className="font-medium text-amber-800 text-sm mb-2">
              💡 Alternative: Set Environment Variables
            </p>
            <p className="text-xs text-amber-700 mb-3">
              You can also add these to your .env file:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="bg-amber-100 px-2 py-1 rounded text-xs flex-1">
                  AGENT_ID={credentials.agentId || "your-agent-id-here"}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(`AGENT_ID=${credentials.agentId || "your-agent-id-here"}`, "agentId")}
                >
                  {copied === "agentId" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-amber-100 px-2 py-1 rounded text-xs flex-1">
                  ELEVENLABS_API_KEY={credentials.apiKey || "your-api-key-here"}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(`ELEVENLABS_API_KEY=${credentials.apiKey || "your-api-key-here"}`, "apiKey")}
                >
                  {copied === "apiKey" ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={saveCredentials}
              disabled={!isFormValid || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
