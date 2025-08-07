import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, apiKey } = body;

    // For now, we'll do basic validation
    // In a real implementation, this would test against ElevenLabs API
    
    if (agentId) {
      // Basic agent ID validation (should be a valid format)
      const isValidAgentId = agentId.length > 10 && !agentId.includes("your-agent-id-here");
      if (!isValidAgentId) {
        return NextResponse.json({ valid: false, field: "agentId" }, { status: 400 });
      }
    }

    if (apiKey) {
      // Basic API key validation
      const isValidApiKey = apiKey.startsWith("sk_") && apiKey.length > 20 && !apiKey.includes("your-api-key-here");
      if (!isValidApiKey) {
        return NextResponse.json({ valid: false, field: "apiKey" }, { status: 400 });
      }
    }

    // If we get here, basic validation passed
    return NextResponse.json({ valid: true });
    
  } catch (error) {
    console.error("Error testing credentials:", error);
    return NextResponse.json(
      { error: "Failed to test credentials" },
      { status: 500 }
    );
  }
}
