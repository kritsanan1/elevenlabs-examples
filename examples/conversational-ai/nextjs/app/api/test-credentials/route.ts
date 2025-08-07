import { NextRequest, NextResponse } from "next/server";

async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    // Test API key by calling ElevenLabs voices endpoint
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error testing API key:", error);
    return false;
  }
}

async function testAgentId(agentId: string, apiKey: string): Promise<boolean> {
  try {
    // Test agent ID by trying to get agent details
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error testing agent ID:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, apiKey } = body;

    // Basic format validation first
    if (agentId) {
      const isValidFormat =
        agentId.length > 10 && !agentId.includes("your-agent-id-here");
      if (!isValidFormat) {
        return NextResponse.json(
          {
            valid: false,
            field: "agentId",
            error: "Invalid agent ID format",
          },
          { status: 400 }
        );
      }
    }

    if (apiKey) {
      const isValidFormat =
        apiKey.startsWith("sk_") &&
        apiKey.length > 20 &&
        !apiKey.includes("your-api-key-here");
      if (!isValidFormat) {
        return NextResponse.json(
          {
            valid: false,
            field: "apiKey",
            error: "Invalid API key format",
          },
          { status: 400 }
        );
      }
    }

    // Real API validation
    if (apiKey && !agentId) {
      // Test API key only
      const isValid = await testApiKey(apiKey);
      return NextResponse.json({
        valid: isValid,
        field: "apiKey",
        error: isValid ? undefined : "API key authentication failed",
      });
    }

    if (agentId && apiKey) {
      // Test both API key and agent ID
      const apiKeyValid = await testApiKey(apiKey);
      if (!apiKeyValid) {
        return NextResponse.json(
          {
            valid: false,
            field: "apiKey",
            error: "API key authentication failed",
          },
          { status: 400 }
        );
      }

      const agentIdValid = await testAgentId(agentId, apiKey);
      return NextResponse.json({
        valid: agentIdValid,
        field: "agentId",
        error: agentIdValid ? undefined : "Agent ID not found or inaccessible",
      });
    }

    // If we get here, basic validation passed but need both credentials for full test
    return NextResponse.json({
      valid: true,
      message: "Provide both credentials for full validation",
    });
  } catch (error) {
    console.error("Error testing credentials:", error);
    return NextResponse.json(
      { error: "Failed to test credentials", valid: false },
      { status: 500 }
    );
  }
}
