import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

export async function GET() {
  const agentId = process.env.AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || agentId === "your-agent-id-here") {
    return NextResponse.json(
      {
        error: "AGENT_ID is not configured. Please set up your ElevenLabs Agent ID in the .env file.",
        setup: "Visit https://elevenlabs.io/docs/conversational-ai/docs/agent-setup for setup instructions."
      },
      { status: 400 }
    );
  }

  if (!apiKey || apiKey === "your-api-key-here") {
    return NextResponse.json(
      {
        error: "ELEVENLABS_API_KEY is not configured. Please set up your ElevenLabs API Key in the .env file.",
        setup: "Get your API key from https://elevenlabs.io/app/speech-synthesis/text-to-speech"
      },
      { status: 400 }
    );
  }

  try {
    const client = new ElevenLabsClient({ apiKey });
    const response = await client.conversationalAi.getSignedUrl({
      agent_id: agentId,
    });
    return NextResponse.json({ signedUrl: response.signed_url });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to get signed URL",
        details: error instanceof Error ? error.message : "Unknown error",
        setup: "Please check your AGENT_ID and ELEVENLABS_API_KEY are valid."
      },
      { status: 500 }
    );
  }
}
