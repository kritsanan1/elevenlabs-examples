import { ConvAI } from "@/components/ConvAI";
import { ConfigurationStatus } from "@/components/core/ConfigurationStatus";
import { MicrophoneTest } from "@/components/MicrophoneTest";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            ElevenLabs Conversational AI Demo
          </h1>
          <p className="text-gray-600">
            Experience real-time voice conversations with AI agents powered by
            ElevenLabs.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <a
              href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
            >
              📚 Setup guide
            </a>
            <a
              href="/advanced"
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              🚀 Try Advanced Features
            </a>
            <a
              href="/refactored"
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              🏗️ View Clean Architecture
            </a>
          </div>
        </div>
        <ConvAI />
      </main>
    </div>
  );
}
