import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { 
  ConversationState, 
  ConversationMessage, 
  ConversationAnalytics, 
  VoicePersona 
} from '@/types/conversation';
import { conversationService } from '@/services/ConversationService';

// Default personas data
const DEFAULT_PERSONAS: VoicePersona[] = [
  {
    id: 'assistant',
    name: 'Assistant',
    description: 'Professional and helpful',
    voice: 'sarah',
    personality: 'professional',
    avatar: '🤖'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and imaginative',
    voice: 'bella',
    personality: 'creative',
    avatar: '🎨'
  },
  {
    id: 'scientist',
    name: 'Scientist',
    description: 'Analytical and precise',
    voice: 'adam',
    personality: 'analytical',
    avatar: '🔬'
  }
];

const DEFAULT_ANALYTICS: ConversationAnalytics = {
  duration: 0,
  wordCount: 0,
  sentiment: 'neutral',
  topics: ['AI', 'Technology', 'Conversation'],
  keyPhrases: []
};

/**
 * Custom hook for managing conversation state
 * Encapsulates all conversation-related state and logic
 */
export function useConversationState() {
  const [state, setState] = useState<ConversationState>({
    status: 'disconnected',
    isRecording: false,
    isSpeaking: false,
    error: null,
    messages: [],
    analytics: DEFAULT_ANALYTICS,
    selectedPersona: DEFAULT_PERSONAS[0]
  });

  // ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Successfully connected to conversation');
      setState(prev => ({
        ...prev,
        status: 'connected',
        isRecording: true,
        error: null
      }));
    },
    onDisconnect: () => {
      console.log('Disconnected from conversation');
      setState(prev => ({
        ...prev,
        status: 'disconnected',
        isRecording: false,
        isSpeaking: false
      }));
    },
    onError: error => {
      console.error('Conversation error:', error);
      
      let errorMessage = 'An error occurred during the conversation';
      
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMessage = error.message as string;
        } else if ('error' in error) {
          errorMessage = error.error as string;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        isRecording: false,
        isSpeaking: false
      }));
    },
    onMessage: message => {
      console.log('Message received:', message);
      
      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        speaker: message.source === 'user' ? 'user' : 'agent',
        content: message.message || '',
        sentiment: 'neutral'
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        analytics: {
          ...prev.analytics,
          wordCount: prev.analytics.wordCount + (message.message?.split(' ').length || 0),
          duration: prev.analytics.duration + 1
        },
        isSpeaking: message.source === 'agent'
      }));
    }
  });

  // Actions
  const startConversation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, status: 'connecting' }));
      console.log('Starting conversation...');
      
      const hasPermission = await conversationService.requestMicrophonePermission();
      if (!hasPermission) {
        throw new Error('Microphone permission is required for voice conversations');
      }
      console.log('Microphone permission granted');
      
      console.log('Fetching signed URL...');
      const signedUrl = await conversationService.getSignedUrl();
      console.log('Got signed URL:', signedUrl ? '✓' : '✗');
      
      console.log('Starting conversation session...');
      const conversationId = await conversation.startSession({ signedUrl });
      console.log('Conversation started with ID:', conversationId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while starting the conversation';
      
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }));
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  }, [conversation]);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setSelectedPersona = useCallback((persona: VoicePersona) => {
    setState(prev => ({ ...prev, selectedPersona: persona }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      messages: [],
      analytics: DEFAULT_ANALYTICS
    }));
  }, []);

  return {
    // State
    ...state,
    personas: DEFAULT_PERSONAS,
    
    // Actions
    startConversation,
    stopConversation,
    setError,
    setSelectedPersona,
    clearMessages,
    
    // Computed values
    isConnected: state.status === 'connected',
    canStart: state.status === 'disconnected',
    canStop: state.status === 'connected'
  };
}
