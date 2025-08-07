import { useState, useEffect } from "react";

interface ConfigStatus {
  isConfigured: boolean;
  agentIdConfigured: boolean;
  apiKeyConfigured: boolean;
  error?: string;
}

/**
 * Hook to manage configuration popup state
 * Can auto-show popup when configuration is missing
 */
export function useConfigurationPopup(autoShow: boolean = false) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (autoShow && !hasChecked) {
      checkConfiguration();
    }
  }, [autoShow, hasChecked]);

  const checkConfiguration = async () => {
    try {
      const response = await fetch("/api/signed-url");

      if (!response.ok && response.status !== 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Failed to parse response: ${parseError}`);
      }

      let status: ConfigStatus;

      if (response.ok) {
        status = {
          isConfigured: true,
          agentIdConfigured: true,
          apiKeyConfigured: true,
        };
      } else if (response.status === 400) {
        const agentIdConfigured = !data.error?.includes("AGENT_ID");
        const apiKeyConfigured = !data.error?.includes("ELEVENLABS_API_KEY");

        status = {
          isConfigured: false,
          agentIdConfigured,
          apiKeyConfigured,
          error: data.error,
        };
      } else {
        status = {
          isConfigured: false,
          agentIdConfigured: false,
          apiKeyConfigured: false,
          error: data.error || "Configuration check failed",
        };
      }

      setConfigStatus(status);
      setHasChecked(true);

      // Auto-show popup if configuration is missing and autoShow is enabled
      if (autoShow && !status.isConfigured) {
        setIsPopupVisible(true);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const status: ConfigStatus = {
        isConfigured: false,
        agentIdConfigured: false,
        apiKeyConfigured: false,
        error: `Configuration check failed: ${errorMessage}`,
      };

      setConfigStatus(status);
      setHasChecked(true);

      // Auto-show popup on error if autoShow is enabled
      if (autoShow) {
        setIsPopupVisible(true);
      }
    }
  };

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };

  const refreshConfiguration = () => {
    setHasChecked(false);
    checkConfiguration();
  };

  return {
    isPopupVisible,
    configStatus,
    showPopup,
    hidePopup,
    refreshConfiguration,
    isConfigured: configStatus?.isConfigured ?? false,
    hasChecked,
  };
}
