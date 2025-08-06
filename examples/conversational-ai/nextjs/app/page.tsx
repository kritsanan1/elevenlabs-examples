import {ConvAI} from "@/components/ConvAI";

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center max-w-2xl">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900">ElevenLabs Conversational AI Demo</h1>
                    <p className="text-gray-600">
                        Experience real-time voice conversations with AI agents powered by ElevenLabs.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        <p className="font-semibold">Setup Required:</p>
                        <p>To use this demo, configure your ElevenLabs credentials in the .env file:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Set <code className="bg-blue-100 px-1 rounded">AGENT_ID</code> with your conversational AI agent ID</li>
                            <li>Set <code className="bg-blue-100 px-1 rounded">ELEVENLABS_API_KEY</code> with your API key</li>
                        </ul>
                        <p className="mt-2">
                            <a href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 underline">
                                View setup guide →
                            </a>
                        </p>
                    </div>
                </div>
                <ConvAI/>
            </main>
        </div>
    );
}
