# ElevenLabs Conversational AI Demo

A comprehensive Next.js application showcasing advanced conversational AI capabilities using ElevenLabs' voice synthesis technology. This project demonstrates real-time voice interactions, audio visualizations, conversation analytics, and clean architecture patterns.

## 🚀 Live Demo

- **Basic Demo**: Experience core conversational AI features
- **Advanced Features**: `/advanced` - Full-featured implementation with analytics and visualizations
- **Clean Architecture**: `/refactored` - Demonstrates SOLID principles and best practices

## ✨ Features

### 🎙️ **Core Conversational AI**

- Real-time voice conversations with AI agents
- Microphone permission handling and audio processing
- ElevenLabs voice synthesis integration
- WebRTC-based audio streaming

### 🎨 **Advanced Visualizations**

- **Audio Orb**: Dynamic, pulsing visualization
- **Waveform Display**: Real-time audio waveform
- **Spectrum Analyzer**: Frequency spectrum visualization
- Canvas-based rendering with smooth animations

### 📊 **Conversation Analytics**

- Real-time sentiment analysis
- Word count and duration tracking
- Topic extraction and key phrase identification
- Message history with timestamps

### 🤖 **AI Personas**

- Multiple agent personalities (Professional, Creative, Scientific)
- Voice characteristic customization
- Personality-driven conversation styles

### 🎯 **Voice Commands**

- Natural language app control
- Conversation management commands
- Smart interruption handling

### 💾 **Export & Recording**

- Conversation transcription
- Multiple export formats (TXT, JSON, CSV)
- Session replay capabilities

## 🛠️ Technical Stack

### **Frontend**

- **Next.js 15**: React framework with App Router
- **React 19 RC**: Latest React features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible UI components
- **Framer Motion**: Animations and transitions

### **AI & Audio**

- **ElevenLabs SDK**: Voice synthesis and conversational AI
- **WebRTC**: Real-time audio communication
- **Canvas API**: Audio visualizations
- **WebAudio API**: Audio processing

### **Development**

- **Turbopack**: Fast development builds
- **ESLint**: Code quality
- **PostCSS**: CSS processing
- **Jest**: Testing framework

## 📋 Prerequisites

### **System Requirements**

- **Node.js**: 18.17 or later
- **npm**: 9.0 or later (or yarn/pnpm equivalent)
- **Browser**: Chrome 88+, Firefox 85+, Safari 14+

### **External Services**

- **ElevenLabs Account**: For API access
- **Microphone Access**: Required for voice interactions

## 🔧 Installation

### **1. Clone Repository**

```bash
git clone https://github.com/elevenlabs/elevenlabs-examples.git
cd elevenlabs-examples/examples/conversational-ai/nextjs
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Environment Setup**

Copy the environment template:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_api_key_here
AGENT_ID=your_agent_id_here
```

### **4. ElevenLabs Setup**

1. **Create Account**: Visit [ElevenLabs](https://elevenlabs.io/)
2. **Get API Key**: Navigate to Settings → API Keys
3. **Create Agent**: Go to Conversational AI → Create Agent
4. **Copy Agent ID**: Use the agent ID in your environment

### **5. Start Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌍 Environment Variables

| Variable             | Description                        | Required | Example           |
| -------------------- | ---------------------------------- | -------- | ----------------- |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key            | ✅       | `sk_abc123...`    |
| `AGENT_ID`           | Conversational AI agent identifier | ✅       | `agent_abc123...` |
| `NODE_ENV`           | Environment mode                   | ❌       | `development`     |

### **Getting ElevenLabs Credentials**

#### **API Key**

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the generated key

#### **Agent ID**

1. Go to **Conversational AI** section
2. Click **Create Agent** or select existing agent
3. Copy the Agent ID from the agent details

## 🚀 Development

### **Environment Validation**

Before starting development, validate your setup:

```bash
npm run validate-setup
```

This script checks:
- ✅ Environment variables are configured
- ✅ ElevenLabs API connectivity
- ✅ Required credentials format

### **Available Scripts**

| Script          | Description                              | Usage                   |
| --------------- | ---------------------------------------- | ----------------------- |
| `dev`           | Start development server with Turbopack  | `npm run dev`           |
| `build`         | Build production application             | `npm run build`         |
| `start`         | Start production server                  | `npm run start`         |
| `lint`          | Run ESLint code analysis                 | `npm run lint`          |
| `validate-setup` | Check environment configuration         | `npm run validate-setup` |

### **Development Guidelines**

#### **Code Style**

- Use **TypeScript** for all new files
- Follow **ESLint** configuration
- Use **Prettier** for consistent formatting
- Prefer **functional components** with hooks

#### **Component Structure**

```typescript
// Component file structure
"use client"; // If client-side features needed

import { ... } from "..."; // External imports
import { ... } from "@/..."; // Internal imports

interface ComponentProps {
  // Props definition
}

export function ComponentName({ props }: ComponentProps) {
  // Component implementation
}
```

#### **Import Organization**

1. React and Next.js imports
2. External library imports
3. Internal imports (using `@/` alias)
4. Type-only imports last

### **Git Workflow**

#### **Branch Naming**

```
[type]/[ticket-number]-[description]
```

Examples:

- `feature/CONV-123-voice-commands`
- `bugfix/CONV-456-audio-visualization`
- `refactor/CONV-789-clean-architecture`

#### **Commit Messages**

```
[type]: [description]

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### **Pull Request Template**

```markdown
## Changes

- [ ] Description of changes

## Testing

- [ ] Tested locally
- [ ] Added/updated tests
- [ ] No console errors

## Screenshots

[If UI changes]

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏗️ Architecture

### **Clean Architecture Principles**

The project demonstrates SOLID principles:

#### **Single Responsibility**

- Each component has one clear purpose
- Services handle only API operations
- Hooks manage specific state logic

#### **Dependency Inversion**

- Components depend on abstractions (hooks)
- Services depend on interfaces
- Business logic separated from UI

### **Project Structure**

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── core/           # Atomic components
│   ├── ui/             # shadcn/ui components
│   └── refactored/     # Clean architecture examples
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### **Data Flow**

1. **User Interaction** → Components
2. **State Management** → Custom Hooks
3. **API Operations** → Services
4. **Error Handling** → Centralized error display

## 🧪 Testing

### **Test Structure**

```typescript
describe("ServiceName", () => {
  beforeEach(() => {
    // Setup
  });

  it("should handle expected behavior", () => {
    // Test implementation
  });
});
```

### **Testing Commands**

```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

## 🚀 Deployment

### **Production Build**

```bash
npm run build
npm run start
```

### **Environment Setup**

Ensure production environment variables:

- `ELEVENLABS_API_KEY`: Production API key
- `AGENT_ID`: Production agent identifier

### **Deployment Platforms**

#### **Vercel (Recommended)**

```bash
npm install -g vercel
vercel --prod
```

#### **Netlify**

```bash
npm run build
# Deploy dist folder
```

#### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Performance Considerations**

- Enable **compression** for static assets
- Configure **CDN** for global distribution
- Set up **caching** headers
- Monitor **Core Web Vitals**

## 🔧 Troubleshooting

### **Common Issues**

#### **Microphone Permission Denied**

```javascript
// Check browser permissions
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .catch(err => console.error("Microphone access denied:", err));
```

#### **ElevenLabs API Errors**

- Verify API key is valid
- Check agent ID exists
- Ensure sufficient API credits

#### **Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Development Server Issues**

```bash
# Reset Next.js cache
rm -rf .next
npm run dev
```

### **Browser Compatibility**

- **Chrome**: Full feature support
- **Firefox**: WebRTC limitations possible
- **Safari**: Microphone permissions may vary

### **Debug Mode**

Enable verbose logging:

```typescript
// Add to environment
DEBUG = true;
```

## 📚 Documentation

- **[Troubleshooting Guide](TROUBLESHOOTING.md)**: Common issues and solutions
- **[Architecture Guide](architecture.md)**: System design and patterns
- **[API Reference](api-reference.md)**: Endpoint documentation
- **[Component Guide](components.md)**: Component usage examples
- **[Refactoring Guide](README-REFACTORING.md)**: Clean code principles

## 🤝 Contributing

### **Development Setup**

1. Fork the repository
2. Create feature branch
3. Make changes following guidelines
4. Submit pull request

### **Code Review Criteria**

- [ ] Follows TypeScript best practices
- [ ] Includes appropriate tests
- [ ] Maintains performance standards
- [ ] Updates documentation
- [ ] Passes all checks

## 📄 License

This project is part of the ElevenLabs Examples repository and follows the repository's license terms.

## 🆘 Support

- **Documentation**: [ElevenLabs Docs](https://elevenlabs.io/docs)
- **Community**: [ElevenLabs Discord](https://discord.gg/elevenlabs)
- **Issues**: GitHub Issues for bug reports
- **Examples**: [ElevenLabs Examples](https://github.com/elevenlabs/elevenlabs-examples)

---

Built with ❤️ using ElevenLabs Conversational AI
