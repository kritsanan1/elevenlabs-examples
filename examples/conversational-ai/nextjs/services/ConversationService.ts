import { ApiError, SignedUrlResponse } from "@/types/conversation";

/**
 * Service responsible for conversation API operations
 * Follows Single Responsibility Principle
 */
export class ConversationService {
  private static instance: ConversationService;
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  /**
   * Request microphone permission
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  }

  /**
   * Get signed URL for conversation
   */
  async getSignedUrl(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/signed-url`);

      if (!response.ok) {
        const errorData: ApiError = await response.json();

        // Use warning level for expected configuration errors (400)
        if (response.status === 400) {
          console.warn(
            "Configuration issue (expected when not configured):",
            errorData
          );
        } else {
          console.error("API error response:", errorData);
        }

        throw this.createSpecificError(response.status, errorData);
      }

      const data: SignedUrlResponse = await response.json();

      if (!data.signedUrl) {
        throw new Error("No signed URL received from server");
      }

      return data.signedUrl;
    } catch (error) {
      // Use warning level for expected configuration errors
      const isConfigError =
        error instanceof Error &&
        (error.message.includes("AGENT_ID") ||
          error.message.includes("ELEVENLABS_API_KEY") ||
          error.message.includes("Configuration error"));

      if (isConfigError) {
        console.warn("Configuration error (expected):", error);
      } else {
        console.error("Unexpected error in getSignedUrl:", error);
      }

      // Enhanced error handling with detailed logging
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
        throw new Error(`Unexpected error in ConversationService: ${errorMsg}`);
      }
    }
  }

  /**
   * Create specific error based on HTTP status
   */
  private createSpecificError(status: number, errorData: ApiError): Error {
    switch (status) {
      case 400:
        return new Error(
          errorData.error ||
            "Configuration error - please check your ElevenLabs credentials"
        );
      case 500:
        return new Error(errorData.error || "Server error - please try again");
      default:
        return new Error(
          errorData.error || `HTTP ${status}: Failed to get signed URL`
        );
    }
  }
}

// Export singleton instance
export const conversationService = ConversationService.getInstance();
