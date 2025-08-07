# Scripts Documentation

## Overview

This document provides comprehensive documentation for all available npm scripts in the ElevenLabs Conversational AI Demo project. Each script is designed for specific development, build, and maintenance tasks.

## Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with Turbopack | `--port <number>`, `--hostname <host>` | `npm run dev` | Clear `.next` cache if issues occur |
| `build` | Build production application | `--debug`, `--profile` | `npm run build` | Check for TypeScript errors first |
| `start` | Start production server | `--port <number>`, `--hostname <host>` | `npm run start` | Ensure `build` was run first |
| `lint` | Run ESLint code analysis | `--fix`, `--ext <extensions>` | `npm run lint` | Run `npm run lint -- --fix` for auto-fixes |
| `validate-setup` | Check environment configuration | None | `npm run validate-setup` | Verify `.env` file exists and is configured |
| `setup-check` | Alias for validate-setup | None | `npm run setup-check` | Same as validate-setup |

## Script Details

### Development Scripts

#### `npm run dev`

**Purpose**: Starts the Next.js development server with Turbopack for fast development builds.

**Command**: `next dev --turbopack`

**Features**:
- Hot module replacement (HMR)
- Fast refresh for React components
- TypeScript compilation
- CSS processing with Tailwind
- Real-time error reporting

**Parameters**:
```bash
# Custom port
npm run dev -- --port 3001

# Custom hostname
npm run dev -- --hostname 0.0.0.0

# Combined
npm run dev -- --port 3001 --hostname 0.0.0.0
```

**Environment Variables**:
- `PORT`: Default port (3000)
- `HOSTNAME`: Default hostname (localhost)

**Expected Output**:
```
   ▲ Next.js 15.0.2 (Turbopack)
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 1.2s
```

**Common Issues**:
- **Port already in use**: Use different port with `--port` flag
- **Turbopack errors**: Fallback to `next dev` without Turbopack
- **Memory issues**: Increase Node.js heap size with `NODE_OPTIONS="--max-old-space-size=4096"`

**Troubleshooting**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -ti:3000 | xargs kill -9
```

#### `npm run validate-setup`

**Purpose**: Validates that all required environment variables and configurations are properly set up.

**Command**: `node scripts/validate-setup.js`

**Validation Checks**:
- ✅ `.env` file exists
- ✅ `ELEVENLABS_API_KEY` is configured
- ✅ `AGENT_ID` is configured
- ✅ API key format validation
- ✅ ElevenLabs API connectivity test
- ✅ Agent accessibility verification

**Expected Output**:
```
🔍 Validating ElevenLabs setup...

✅ Environment file (.env) found
✅ ELEVENLABS_API_KEY is configured
✅ AGENT_ID is configured
✅ API key format is valid
✅ ElevenLabs API is accessible
✅ Agent is accessible

🎉 Setup validation complete! You're ready to start developing.
```

**Error Scenarios**:
```bash
# Missing .env file
❌ Environment file (.env) not found
💡 Copy .env.example to .env and configure your credentials

# Invalid API key
❌ ELEVENLABS_API_KEY format is invalid
💡 API key should start with 'sk_'

# API connectivity issues
❌ Cannot connect to ElevenLabs API
💡 Check your internet connection and API key validity
```

**Troubleshooting**:
```bash
# Create .env from template
cp .env.example .env

# Test API key manually
curl -H "xi-api-key: YOUR_API_KEY" https://api.elevenlabs.io/v1/voices

# Verify agent exists
curl -H "xi-api-key: YOUR_API_KEY" https://api.elevenlabs.io/v1/convai/agents/YOUR_AGENT_ID
```

### Build Scripts

#### `npm run build`

**Purpose**: Creates an optimized production build of the application.

**Command**: `next build`

**Build Process**:
1. TypeScript compilation
2. Component tree shaking
3. CSS optimization and purging
4. JavaScript bundling and minification
5. Image optimization
6. Static page generation
7. Route manifest creation

**Parameters**:
```bash
# Debug build information
npm run build -- --debug

# Profile build performance
npm run build -- --profile

# No lint during build
npm run build -- --no-lint
```

**Expected Output**:
```
   ▲ Next.js 15.0.2
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully

   Page                                       Size     First Load JS
   ┌ ○ /                                      1.2 kB          87.3 kB
   ├ ○ /advanced                              1.8 kB          89.1 kB
   ├ ○ /refactored                            1.5 kB          88.8 kB
   └ ○ /404                                   182 B           85.2 kB

 ○  (Static)  automatically rendered as static HTML
```

**Build Artifacts**:
- `.next/static/`: Static assets (JS, CSS, images)
- `.next/server/`: Server-side code
- `.next/cache/`: Build cache for faster rebuilds

**Troubleshooting**:
```bash
# TypeScript errors
npm run build 2>&1 | grep "Type error"

# Memory issues during build
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Clear build cache
rm -rf .next

# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### `npm run start`

**Purpose**: Starts the production server using the built application.

**Command**: `next start`

**Prerequisites**: 
- Must run `npm run build` first
- `.next` directory must exist with build artifacts

**Parameters**:
```bash
# Custom port
npm run start -- --port 8080

# Custom hostname
npm run start -- --hostname 0.0.0.0
```

**Expected Output**:
```
   ▲ Next.js 15.0.2
   - Local:        http://localhost:3000

 ✓ Ready in 0.5s
```

**Troubleshooting**:
```bash
# No build found
❌ Error: Could not find a production build in the '.next' directory

# Solution: Build first
npm run build
npm run start

# Port conflicts
lsof -ti:3000 | xargs kill -9
npm run start
```

### Code Quality Scripts

#### `npm run lint`

**Purpose**: Runs ESLint to analyze code for potential errors, style issues, and best practices.

**Command**: `next lint`

**Linting Rules**:
- ESLint recommended rules
- Next.js specific rules
- React hooks rules
- TypeScript ESLint rules
- Custom project rules

**Parameters**:
```bash
# Auto-fix issues
npm run lint -- --fix

# Specific file extensions
npm run lint -- --ext .ts,.tsx

# Specific directories
npm run lint -- components/

# Different output format
npm run lint -- --format=json
```

**Expected Output**:
```
✔ No ESLint warnings or errors
```

**Error Example**:
```
./components/ConvAI.tsx
  45:6  Warning: React Hook useEffect has a missing dependency  react-hooks/exhaustive-deps
  67:1  Error: 'console' is not defined                        no-console

✖ 2 problems (1 error, 1 warning)
  1 error and 0 warnings potentially fixable with the --fix option.
```

**Troubleshooting**:
```bash
# Auto-fix common issues
npm run lint -- --fix

# Check specific file
npx eslint components/ConvAI.tsx

# Generate detailed report
npm run lint -- --format=html --output-file=lint-report.html
```

## Custom Scripts

### Adding New Scripts

To add custom scripts to the project:

1. **Add to package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out"
  }
}
```

2. **Document in this file**:
```markdown
| `test` | Run Jest tests | `--watch`, `--coverage` | `npm test` | Ensure Jest is configured |
```

### Useful Development Scripts

#### Testing Scripts (if added)
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

#### Type Checking
```bash
# TypeScript compilation check
npm run type-check
```

#### Cleanup Scripts
```bash
# Clean build artifacts
npm run clean

# Complete reset
npm run reset
```

## Environment-Specific Usage

### Development
```bash
# Start development
npm run validate-setup
npm run dev

# Code quality
npm run lint
npm run type-check
```

### Production
```bash
# Build and deploy
npm run validate-setup
npm run lint
npm run build
npm run start
```

### CI/CD Pipeline
```bash
# Continuous integration
npm ci
npm run validate-setup
npm run lint
npm run type-check
npm run build
npm test  # if tests exist
```

## Performance Optimization

### Build Performance
```bash
# Profile build time
npm run build -- --profile

# Analyze bundle size
ANALYZE=true npm run build

# Cache optimization
npm run build -- --experimental-build-cache
```

### Development Performance
```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Disable source maps for faster builds
DISABLE_SOURCE_MAPS=true npm run dev
```

## Monitoring and Debugging

### Debug Mode
```bash
# Enable debug output
DEBUG=* npm run dev

# Next.js specific debugging
DEBUG=next:* npm run dev
```

### Performance Monitoring
```bash
# Profile application
npm run build -- --profile
npm run start

# Monitor memory usage
node --inspect npm run dev
```

## Automation Examples

### Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
```

### GitHub Actions
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run validate-setup
      - run: npm run lint
      - run: npm run build
```

This comprehensive scripts documentation ensures developers can effectively use all available tooling for development, building, and maintaining the ElevenLabs Conversational AI application.
