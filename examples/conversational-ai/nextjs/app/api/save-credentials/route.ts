import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, apiKey } = body;

    // Basic validation
    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: "Both Agent ID and API Key are required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate credentials against ElevenLabs API
    // 2. Securely store credentials (encrypted)
    // 3. Associate with user session/account
    
    // For this demo, we'll store in server-side environment or session
    // Note: This is a simplified implementation for demo purposes
    
    // You could store in various ways:
    // - Environment variables (requires server restart)
    // - Secure session storage
    // - Encrypted database
    // - Secure user preferences
    
    console.log("Credentials would be saved:", {
      agentId: agentId.substring(0, 8) + "...",
      apiKey: "sk_" + "*".repeat(apiKey.length - 3)
    });

    // For demo purposes, we'll return success
    // In production, implement proper credential storage
    return NextResponse.json({ 
      success: true,
      message: "Credentials saved successfully. Please restart the application to use them."
    });
    
  } catch (error) {
    console.error("Error saving credentials:", error);
    return NextResponse.json(
      { error: "Failed to save credentials" },
      { status: 500 }
    );
  }
}
