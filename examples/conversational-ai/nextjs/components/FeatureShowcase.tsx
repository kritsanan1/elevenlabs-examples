"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BarChart3,
  Users,
  Command,
  Save,
  Waves,
  Brain,
  Zap,
  Globe,
  Shield,
  Headphones,
  Smartphone,
  Monitor,
  Clock,
  Target,
  Settings,
  Download,
  Share,
  Mic,
  MessageSquare,
  Eye,
  Palette,
  Cpu,
  Wifi,
  Camera,
  FileText,
  TrendingUp,
  Heart,
  Star,
  Lightbulb,
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "visualization"
    | "analytics"
    | "interaction"
    | "management"
    | "future";
  status: "available" | "beta" | "coming-soon";
  highlights: string[];
}

const features: Feature[] = [
  {
    id: "audio-viz",
    title: "3D Audio Visualizations",
    description:
      "Dynamic visual representations of voice interactions with multiple rendering modes",
    icon: <Waves className="h-6 w-6" />,
    category: "visualization",
    status: "available",
    highlights: [
      "Real-time waveform analysis",
      "Spectrum frequency display",
      "Interactive orb animations",
      "Canvas-based rendering",
    ],
  },
  {
    id: "analytics",
    title: "Conversation Analytics",
    description:
      "AI-powered insights into conversation quality, sentiment, and engagement metrics",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "analytics",
    status: "available",
    highlights: [
      "Sentiment analysis",
      "Word count tracking",
      "Topic extraction",
      "Engagement scoring",
    ],
  },
  {
    id: "personas",
    title: "AI Personas",
    description:
      "Multiple agent personalities with distinct voices, behaviors, and expertise areas",
    icon: <Users className="h-6 w-6" />,
    category: "interaction",
    status: "available",
    highlights: [
      "Professional assistant",
      "Creative collaborator",
      "Technical expert",
      "Custom personalities",
    ],
  },
  {
    id: "voice-commands",
    title: "Advanced Voice Commands",
    description:
      "Natural language control of app features and conversation management",
    icon: <Command className="h-6 w-6" />,
    category: "interaction",
    status: "available",
    highlights: [
      "Natural speech recognition",
      "App control commands",
      "Conversation navigation",
      "Smart interruption handling",
    ],
  },
  {
    id: "recording",
    title: "Smart Recording & Export",
    description:
      "Intelligent conversation capture with automatic transcription and formatting",
    icon: <Save className="h-6 w-6" />,
    category: "management",
    status: "available",
    highlights: [
      "Auto-transcription",
      "Timestamped exports",
      "Searchable history",
      "Multiple export formats",
    ],
  },
  {
    id: "real-time",
    title: "Real-time Processing",
    description:
      "Low-latency voice processing with intelligent buffering and optimization",
    icon: <Zap className="h-6 w-6" />,
    category: "interaction",
    status: "beta",
    highlights: [
      "Sub-100ms latency",
      "Adaptive quality",
      "Network optimization",
      "Edge processing",
    ],
  },
  {
    id: "multi-language",
    title: "Multi-language Support",
    description:
      "Real-time language detection, translation, and voice synthesis in 50+ languages",
    icon: <Globe className="h-6 w-6" />,
    category: "future",
    status: "coming-soon",
    highlights: [
      "Auto language detection",
      "Real-time translation",
      "Native accent synthesis",
      "Cultural adaptation",
    ],
  },
  {
    id: "voice-cloning",
    title: "Voice Cloning",
    description:
      "Train custom voice models from short audio samples for personalized experiences",
    icon: <Mic className="h-6 w-6" />,
    category: "future",
    status: "coming-soon",
    highlights: [
      "15-second training",
      "High fidelity synthesis",
      "Emotional range",
      "Privacy protection",
    ],
  },
  {
    id: "ar-integration",
    title: "AR/VR Integration",
    description:
      "Immersive conversational experiences in augmented and virtual reality environments",
    icon: <Monitor className="h-6 w-6" />,
    category: "future",
    status: "coming-soon",
    highlights: [
      "Spatial audio",
      "3D avatar interactions",
      "Gesture recognition",
      "Haptic feedback",
    ],
  },
];

const categoryConfig = {
  visualization: {
    name: "Visualization",
    color: "bg-purple-100 text-purple-800",
  },
  analytics: { name: "Analytics", color: "bg-blue-100 text-blue-800" },
  interaction: { name: "Interaction", color: "bg-green-100 text-green-800" },
  management: { name: "Management", color: "bg-orange-100 text-orange-800" },
  future: { name: "Future Tech", color: "bg-gray-100 text-gray-800" },
};

const statusConfig = {
  available: { name: "Available", color: "bg-green-500", icon: "✅" },
  beta: { name: "Beta", color: "bg-yellow-500", icon: "⚡" },
  "coming-soon": { name: "Coming Soon", color: "bg-gray-500", icon: "🚀" },
};

export function FeatureShowcase() {
  const groupedFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, Feature[]>
  );

  const stats = {
    total: features.length,
    available: features.filter(f => f.status === "available").length,
    beta: features.filter(f => f.status === "beta").length,
    comingSoon: features.filter(f => f.status === "coming-soon").length,
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Advanced Features Overview
            </h2>
            <p className="text-gray-600">
              Comprehensive AI conversation capabilities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.available}
              </div>
              <div className="text-sm text-gray-600">Available Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.beta}
              </div>
              <div className="text-sm text-gray-600">In Beta</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.comingSoon}
              </div>
              <div className="text-sm text-gray-600">Coming Soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900">
              {categoryConfig[category as keyof typeof categoryConfig].name}
            </h3>
            <Badge
              className={
                categoryConfig[category as keyof typeof categoryConfig].color
              }
            >
              {categoryFeatures.length} features
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryFeatures.map(feature => (
              <Card
                key={feature.id}
                className="h-full hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig[feature.status].color}`}
                          />
                          <span className="text-xs text-gray-600">
                            {statusConfig[feature.status].name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Key Features
                    </div>
                    <ul className="space-y-1">
                      {feature.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 flex items-center gap-2"
                        >
                          <Star className="h-3 w-3 text-yellow-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI & ML
              </h4>
              <div className="space-y-2 text-sm">
                <div>• ElevenLabs Voice Synthesis</div>
                <div>• WebRTC Audio Processing</div>
                <div>• Real-time Speech Recognition</div>
                <div>• Natural Language Processing</div>
                <div>• Sentiment Analysis</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Frontend
              </h4>
              <div className="space-y-2 text-sm">
                <div>• Next.js 15 + React 19</div>
                <div>• TypeScript</div>
                <div>• Tailwind CSS</div>
                <div>• Canvas API for Visualizations</div>
                <div>• WebAudio API</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Infrastructure
              </h4>
              <div className="space-y-2 text-sm">
                <div>• Real-time WebSocket connections</div>
                <div>• Edge computing optimization</div>
                <div>• CDN audio delivery</div>
                <div>• Adaptive bitrate streaming</div>
                <div>• Multi-region deployment</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Lightbulb className="h-12 w-12 mx-auto text-yellow-300" />
            <h3 className="text-2xl font-bold">Ready to Build the Future?</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              This advanced demo showcases cutting-edge conversational AI
              capabilities. Configure your ElevenLabs credentials to experience
              the full potential of next-generation voice interactions.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure API Keys
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
