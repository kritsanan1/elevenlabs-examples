import { useEffect, useState } from "react";
import { loadCredentials } from "@/lib/credentialStorage";

interface ConfigStatus {
  isConfigured: boolean;
  agentIdConfigured: boolean;
  apiKeyConfigured: boolean;
  isLoading: boolean;
  error?: string;
}

/**
 * Hook to check ElevenLabs configuration status
 * Provides real-time validation of credentials
 */
export function useConfiguration() {
  const [status, setStatus] = useState<ConfigStatus>({
    isConfigured: false,
    agentIdConfigured: false,
    apiKeyConfigured: false,
    isLoading: true,
  });

  const checkConfiguration = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true }));

      // Check if we have stored credentials that might work
      const storedCreds = loadCredentials();
      if (storedCreds && storedCreds.agentId && storedCreds.apiKey) {
        // Try to use stored credentials for validation
        console.log("Found stored credentials, validating...");
      }

      const response = await fetch("/api/signed-url");

      // Don't treat expected 400 responses as errors
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
          isLoading: false,
        });
      } else if (response.status === 400) {
        // Expected response when credentials are not configured
        const agentIdConfigured = !data.error?.includes("AGENT_ID");
        const apiKeyConfigured = !data.error?.includes("ELEVENLABS_API_KEY");

        setStatus({
          isConfigured: false,
          agentIdConfigured,
          apiKeyConfigured,
          isLoading: false,
          error: data.error,
        });
      } else {
        // Unexpected error
        console.warn("Unexpected configuration check response:", data);
        setStatus({
          isConfigured: false,
          agentIdConfigured: false,
          apiKeyConfigured: false,
          isLoading: false,
          error: data.error || "Configuration check failed",
        });
      }
    } catch (error) {
      // Only log network errors or actual unexpected errors as warnings
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.warn("Configuration check issue:", errorMessage);
      setStatus({
        isConfigured: false,
        agentIdConfigured: false,
        apiKeyConfigured: false,
        isLoading: false,
        error: `Configuration check failed: ${errorMessage}`,
      });
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  return {
    ...status,
    recheck: checkConfiguration,
  };
}
