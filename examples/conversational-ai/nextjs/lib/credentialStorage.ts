/**
 * Secure credential storage utility
 * Uses localStorage with basic encoding for demo purposes
 * In production, use proper encryption and secure storage
 */

interface StoredCredentials {
  agentId?: string;
  apiKey?: string;
  lastUpdated: number;
}

const STORAGE_KEY = "elevenlabs_credentials";
const STORAGE_VERSION = "1.0";

// Simple encoding for demo - in production use proper encryption
function encode(value: string): string {
  try {
    return btoa(encodeURIComponent(value));
  } catch {
    return value;
  }
}

function decode(value: string): string {
  try {
    return decodeURIComponent(atob(value));
  } catch {
    return value;
  }
}

/**
 * Save credentials to localStorage
 */
export function saveCredentials(credentials: { agentId?: string; apiKey?: string }): boolean {
  try {
    const data: StoredCredentials = {
      ...credentials,
      lastUpdated: Date.now()
    };

    // Encode sensitive data
    if (data.agentId) {
      data.agentId = encode(data.agentId);
    }
    if (data.apiKey) {
      data.apiKey = encode(data.apiKey);
    }

    const storageData = {
      version: STORAGE_VERSION,
      data: encode(JSON.stringify(data))
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    return true;
  } catch (error) {
    console.error("Failed to save credentials:", error);
    return false;
  }
}

/**
 * Load credentials from localStorage
 */
export function loadCredentials(): { agentId?: string; apiKey?: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const storageData = JSON.parse(stored);
    if (storageData.version !== STORAGE_VERSION) {
      // Version mismatch, clear old data
      clearCredentials();
      return null;
    }

    const data: StoredCredentials = JSON.parse(decode(storageData.data));
    
    // Check if data is too old (7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - data.lastUpdated > maxAge) {
      clearCredentials();
      return null;
    }

    // Decode sensitive data
    const credentials: { agentId?: string; apiKey?: string } = {};
    
    if (data.agentId) {
      credentials.agentId = decode(data.agentId);
    }
    if (data.apiKey) {
      credentials.apiKey = decode(data.apiKey);
    }

    return credentials;
  } catch (error) {
    console.error("Failed to load credentials:", error);
    clearCredentials(); // Clear corrupted data
    return null;
  }
}

/**
 * Clear stored credentials
 */
export function clearCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear credentials:", error);
  }
}

/**
 * Check if credentials are stored
 */
export function hasStoredCredentials(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null;
  } catch {
    return false;
  }
}

/**
 * Update only specific credentials
 */
export function updateCredentials(updates: { agentId?: string; apiKey?: string }): boolean {
  const existing = loadCredentials() || {};
  return saveCredentials({ ...existing, ...updates });
}
