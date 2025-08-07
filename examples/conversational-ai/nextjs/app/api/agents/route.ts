import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("xi-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    // Fetch agents from ElevenLabs API
    const response = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Failed to fetch agents",
          details: errorData.detail || response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data to match our interface
    const transformedAgents = (data.agents || []).map((agent: any) => ({
      id: agent.agent_id,
      name: agent.name || "Unnamed Agent",
      description:
        agent.system_prompt?.substring(0, 100) + "..." ||
        "No description available",
      voice: {
        id: agent.voice_id,
        name: agent.voice_id, // ElevenLabs voice ID
        category: "Custom",
        accent: "Default",
      },
      personality:
        agent.system_prompt?.substring(0, 50) + "..." || "Default personality",
      language: agent.language || "English",
      isActive: true,
      createdAt: agent.created_at || new Date().toISOString(),
      conversationCount: 0, // This would need to be tracked separately
    }));

    return NextResponse.json({
      agents: transformedAgents,
      total: transformedAgents.length,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
