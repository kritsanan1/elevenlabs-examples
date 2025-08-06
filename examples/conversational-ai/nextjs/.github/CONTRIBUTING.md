# Contributing to ElevenLabs Conversational AI Demo

Thank you for your interest in contributing to the ElevenLabs Conversational AI Demo! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later (or yarn/pnpm equivalent)
- Git
- ElevenLabs account and API access

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/elevenlabs-examples.git
   cd elevenlabs-examples/examples/conversational-ai/nextjs
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Fill in your ElevenLabs credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Types of Contributions

We welcome the following types of contributions:

- **🐛 Bug Fixes**: Fix issues and improve stability
- **✨ New Features**: Add new functionality or enhance existing features
- **📚 Documentation**: Improve documentation, examples, or guides
- **🎨 UI/UX Improvements**: Enhance user interface and experience
- **⚡ Performance**: Optimize code performance and efficiency
- **🧪 Testing**: Add or improve test coverage
- **🔧 Infrastructure**: Improve build process, CI/CD, or development tools

### Contribution Workflow

1. **Check Existing Issues**
   - Look for existing issues related to your contribution
   - Comment on the issue to express interest and discuss approach
   - If no issue exists, create one to discuss the proposed change

2. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number-description
   ```

3. **Make Changes**
   - Follow the coding standards outlined below
   - Write tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**

   ```bash
   npm run lint          # Check code style
   npm run type-check    # Verify TypeScript
   npm run test          # Run tests
   npm run build         # Ensure build works
   ```

5. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add voice command feature"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request through GitHub

## 📝 Coding Standards

### TypeScript and JavaScript

- **Use TypeScript** for all new files
- **Strict typing**: Avoid `any` types, prefer explicit interfaces
- **Function definitions**: Use arrow functions for callbacks, regular functions for components
- **Naming conventions**:
  - Components: PascalCase (e.g., `ConversationInterface`)
  - Functions/variables: camelCase (e.g., `handleStartConversation`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
  - Files: PascalCase for components, camelCase for utilities

### React Components

```typescript
// ✅ Good component structure
interface ComponentProps {
  title: string;
  onAction: (data: string) => void;
}

export function ComponentName({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>('');

  const handleClick = useCallback(() => {
    onAction(state);
  }, [state, onAction]);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React from "react";
import { useState, useCallback } from "react";
import Link from "next/link";

// 2. Third-party library imports
import { useConversation } from "@elevenlabs/react";
import { Button } from "@radix-ui/react-button";

// 3. Internal imports (using @/ alias)
import { ConversationService } from "@/services/ConversationService";
import { AudioVisualizer } from "@/components/core/AudioVisualizer";

// 4. Type-only imports
import type { ConversationMessage } from "@/types/conversation";
```

### CSS and Styling

- **Use Tailwind CSS** for styling
- **Prefer utility classes** over custom CSS
- **Use CSS variables** for theming
- **Component-specific styles** should be co-located

```typescript
// ✅ Good Tailwind usage
<div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
  <Button className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
    Start Conversation
  </Button>
</div>
```

### Error Handling

- **Always handle errors** gracefully
- **Provide meaningful error messages** to users
- **Log errors** appropriately for debugging

```typescript
// ✅ Good error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);

  if (error instanceof ApiError) {
    throw new Error(`API Error: ${error.message}`);
  }

  throw new Error("An unexpected error occurred");
}
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe("ComponentName", () => {
  beforeEach(() => {
    // Setup before each test
  });

  it("should handle user interaction correctly", () => {
    // Test implementation
  });

  it("should display error states appropriately", () => {
    // Test error scenarios
  });
});
```

### What to Test

- **Component rendering**: Verify components render correctly
- **User interactions**: Test click handlers, form submissions
- **State changes**: Verify state updates work as expected
- **Error scenarios**: Test error handling and edge cases
- **API integration**: Mock external services and test integration

### Test Coverage

- Aim for **80%+ test coverage** for new code
- **Critical paths** should have 100% coverage
- **Complex business logic** must be thoroughly tested

## 📚 Documentation Standards

### Code Documentation

```typescript
/**
 * Manages conversation state and provides audio visualization
 * @param config - Configuration options for the conversation
 * @returns Conversation state and control functions
 */
export function useConversationState(config: ConversationConfig) {
  // Implementation
}
```

### README Updates

- Update README when adding new features
- Include examples and usage instructions
- Update environment variables documentation

### Component Documentation

- Document component props and usage
- Provide examples of different configurations
- Include accessibility considerations

## 🔄 Pull Request Guidelines

### PR Title Format

```
[type]: [description]

Examples:
feat: add voice command recognition
fix: resolve audio visualization flickering
docs: update installation instructions
refactor: improve conversation state management
```

### PR Description

Use the provided PR template and include:

- **Clear description** of changes
- **Testing steps** for reviewers
- **Screenshots/videos** for UI changes
- **Breaking changes** if any
- **Related issues** being addressed

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing verification** by reviewer
4. **Documentation review** if applicable

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment information** (browser, OS, Node.js version)
- **Console errors** and relevant logs
- **Screenshots/videos** if applicable

## ✨ Feature Requests

When requesting features, please include:

- **Clear description** of the desired functionality
- **Use cases** and user stories
- **Acceptance criteria** for the feature
- **Potential implementation approach** if you have ideas

## 📊 Performance Considerations

- **Bundle size**: Keep bundle impact minimal
- **Runtime performance**: Avoid unnecessary re-renders
- **Memory usage**: Clean up resources properly
- **Accessibility**: Follow WCAG guidelines
- **SEO**: Maintain good SEO practices

## 🔒 Security Guidelines

- **Never commit secrets** or API keys
- **Validate user inputs** properly
- **Follow security best practices** for authentication
- **Report security issues** privately to maintainers

## 🌍 Internationalization

- **Use appropriate text keys** for user-facing strings
- **Consider RTL languages** in UI design
- **Test with different locales** when applicable

## 📱 Browser Compatibility

- **Support modern browsers**: Chrome 88+, Firefox 85+, Safari 14+
- **Progressive enhancement**: Graceful degradation for older browsers
- **Mobile responsiveness**: Ensure mobile compatibility
- **Cross-browser testing**: Test on multiple browsers

## 🚀 Release Process

Releases follow semantic versioning:

- **Major (x.0.0)**: Breaking changes
- **Minor (0.x.0)**: New features, backward compatible
- **Patch (0.0.x)**: Bug fixes, backward compatible

## 💬 Communication

- **GitHub Issues**: Technical discussions and bug reports
- **Pull Requests**: Code review and feature discussions
- **Discussions**: General questions and community topics

## 🙏 Recognition

Contributors will be recognized in:

- **Contributors list** in README
- **Release notes** for significant contributions
- **Special mentions** for outstanding contributions

## 📞 Getting Help

If you need help:

1. **Check documentation** and existing issues
2. **Search discussions** for similar questions
3. **Create a new issue** with detailed information
4. **Be patient and respectful** when asking for help

Thank you for contributing to the ElevenLabs Conversational AI Demo! Your contributions help make this project better for everyone. 🎉
