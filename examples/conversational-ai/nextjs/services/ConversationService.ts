import { ApiError, SignedUrlResponse } from '@/types/conversation';

/**
 * Service responsible for conversation API operations
 * Follows Single Responsibility Principle
 */
export class ConversationService {
  private static instance: ConversationService;
  private baseUrl: string;

  constructor(baseUrl: string = '') {
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
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Get signed URL for conversation
   */
  async getSignedUrl(): Promise<string> {
    try {
      console.log('Making request to /api/signed-url');
      const response = await fetch(`${this.baseUrl}/api/signed-url`);
      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        console.error('API error response:', errorData);
        throw this.createSpecificError(response.status, errorData);
      }

      const data: SignedUrlResponse = await response.json();
      console.log('API response data:', data);

      if (!data.signedUrl) {
        throw new Error('No signed URL received from server');
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedUrl:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Network error - please check your connection');
      }
    }
  }

  /**
   * Create specific error based on HTTP status
   */
  private createSpecificError(status: number, errorData: ApiError): Error {
    switch (status) {
      case 400:
        return new Error(errorData.error || 'Configuration error - please check your ElevenLabs credentials');
      case 500:
        return new Error(errorData.error || 'Server error - please try again');
      default:
        return new Error(errorData.error || `HTTP ${status}: Failed to get signed URL`);
    }
  }
}

// Export singleton instance
export const conversationService = ConversationService.getInstance();
