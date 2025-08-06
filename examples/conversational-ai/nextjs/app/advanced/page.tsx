import { AdvancedConversationalAI } from "@/components/AdvancedConversationalAI";
import { FeatureShowcase } from "@/components/FeatureShowcase";

export default function AdvancedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        🚀 Advanced Features Demo
                    </div>
                    
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Next-Gen Conversational AI
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the future of voice interactions with advanced visualizations, 
                        real-time analytics, multiple AI personas, and intelligent conversation management.
                    </p>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-2xl mb-2">🎨</div>
                            <div className="font-semibold text-sm">3D Audio Visualizations</div>
                            <div className="text-xs text-gray-600">Dynamic waveforms & spectrum</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-semibold text-sm">Live Analytics</div>
                            <div className="text-xs text-gray-600">Sentiment & conversation insights</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-2xl mb-2">🤖</div>
                            <div className="font-semibold text-sm">AI Personas</div>
                            <div className="text-xs text-gray-600">Multiple agent personalities</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-2xl mb-2">💾</div>
                            <div className="font-semibold text-sm">Smart Recording</div>
                            <div className="text-xs text-gray-600">Export & replay conversations</div>
                        </div>
                    </div>
                </div>

                {/* Setup Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-2xl">⚡</div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Quick Setup Required</h3>
                            <p className="text-blue-800 mb-3">
                                To experience all advanced features, configure your ElevenLabs credentials:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/50 rounded-lg p-3">
                                    <code className="text-sm font-mono text-blue-700">AGENT_ID</code>
                                    <p className="text-xs text-blue-600 mt-1">Your conversational AI agent ID</p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-3">
                                    <code className="text-sm font-mono text-blue-700">ELEVENLABS_API_KEY</code>
                                    <p className="text-xs text-blue-600 mt-1">Your ElevenLabs API key</p>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <a 
                                    href="https://elevenlabs.io/docs/conversational-ai/docs/agent-setup" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                    📚 Setup Guide
                                </a>
                                <a 
                                    href="https://elevenlabs.io/app/speech-synthesis/text-to-speech" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white text-blue-600 rounded-lg text-sm border border-blue-200 hover:bg-blue-50 transition-colors"
                                >
                                    🔑 Get API Key
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Conversational AI Component */}
                <AdvancedConversationalAI />

                {/* Feature Showcase */}
                <div className="mt-16">
                    <FeatureShowcase />
                </div>

                {/* Feature Details */}
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🎯 Key Features
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <div>
                                    <strong>Real-time Audio Visualization</strong>
                                    <br />Multiple visualization modes: Orb, Waveform, and Spectrum
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <div>
                                    <strong>Live Conversation Analytics</strong>
                                    <br />Track sentiment, word count, duration, and key topics
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <div>
                                    <strong>Multiple AI Personas</strong>
                                    <br />Switch between different agent personalities and voices
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <div>
                                    <strong>Smart Transcript Export</strong>
                                    <br />Download conversations with timestamps and speaker identification
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            🔮 Future Roadmap
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">⏳</span>
                                <div>
                                    <strong>Voice Cloning Integration</strong>
                                    <br />Clone and use your own voice for conversations
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">⏳</span>
                                <div>
                                    <strong>Multi-language Support</strong>
                                    <br />Real-time language detection and translation
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">⏳</span>
                                <div>
                                    <strong>Advanced Voice Commands</strong>
                                    <br />Control app features through voice interactions
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">⏳</span>
                                <div>
                                    <strong>Integration Platform</strong>
                                    <br />Calendar, notes, tasks, and productivity tools
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
