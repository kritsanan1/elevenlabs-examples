# Scripts Documentation

This document provides comprehensive information about all available npm scripts in the ElevenLabs Conversational AI Demo project.

## 📋 Scripts Overview

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with Turbopack | `--port`, `--hostname` | `npm run dev` | [Dev Server Issues](#dev-server-issues) |
| `build` | Build production application | `--debug` | `npm run build` | [Build Issues](#build-issues) |
| `start` | Start production server | `--port`, `--hostname` | `npm run start` | [Production Issues](#production-issues) |
| `lint` | Run ESLint code analysis | `--fix`, `--ext` | `npm run lint` | [Lint Issues](#lint-issues) |

## 🔧 Detailed Script Information

### `npm run dev`

**Purpose**: Starts the Next.js development server with Turbopack for fast rebuilds and hot reloading.

**Command**: 
```bash
next dev --turbopack
```

**Parameters**:
- `--port <number>` - Specify custom port (default: 3000)
- `--hostname <string>` - Specify hostname (default: localhost)
- `--turbo` - Enable Turbopack (already included)

**Examples**:
```bash
# Standard development
npm run dev

# Custom port
npm run dev -- --port 3001

# Custom hostname
npm run dev -- --hostname 0.0.0.0

# Both port and hostname
npm run dev -- --port 8080 --hostname 192.168.1.100
```

**Expected Output**:
```
▲ Next.js 15.0.2 (Turbopack)
- Local:        http://localhost:3000
- Environments: .env

✓ Starting...
✓ Ready in 1.2s
○ Compiling / ...
✓ Compiled / in 890ms
```

**Features**:
- **Hot Reloading**: Automatic page refresh on file changes
- **Error Overlay**: Visual error display in browser
- **Fast Refresh**: Preserves component state during updates
- **Turbopack**: Enhanced build performance

### `npm run build`

**Purpose**: Creates an optimized production build of the application.

**Command**: 
```bash
next build
```

**Parameters**:
- `--debug` - Enable debug mode for build analysis
- `--profile` - Enable React profiling in production build

**Examples**:
```bash
# Standard production build
npm run build

# Debug build for analysis
npm run build -- --debug

# Build with React profiling
npm run build -- --profile
```

**Expected Output**:
```
▲ Next.js 15.0.2

✓ Creating an optimized production build...
✓ Compiled successfully

Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.2 kB
├ ○ /advanced                            8.91 kB        96.1 kB
├ ○ /refactored                          5.23 kB        92.4 kB
└ ○ /api/signed-url                      0 B                0 B

+ First Load JS shared by all            87.1 kB
  ├ chunks/framework-[hash].js           45.2 kB
  ├ chunks/main-app-[hash].js           31.5 kB
  ├ chunks/webpack-[hash].js            10.4 kB
  └ other shared chunks (total)          0 B

○  (Static)  automatically rendered as static HTML (uses no initial props)
```

**Build Artifacts**:
- `.next/` - Built application files
- `.next/static/` - Static assets with cache headers
- `.next/server/` - Server-side code

### `npm run start`

**Purpose**: Starts the Next.js production server using the built application.

**Command**: 
```bash
next start
```

**Prerequisites**: Must run `npm run build` first

**Parameters**:
- `--port <number>` - Specify port (default: 3000)
- `--hostname <string>` - Specify hostname

**Examples**:
```bash
# Build and start production server
npm run build && npm run start

# Start on custom port
npm run start -- --port 8080

# Start on all interfaces
npm run start -- --hostname 0.0.0.0
```

**Expected Output**:
```
▲ Next.js 15.0.2
- Local:        http://localhost:3000

✓ Ready in 520ms
```

**Production Features**:
- **Optimized Performance**: Minified and compressed assets
- **Server-Side Rendering**: Enhanced SEO and initial load
- **Static Generation**: Pre-built pages for faster delivery

### `npm run lint`

**Purpose**: Analyzes code for potential issues, style violations, and best practice adherence.

**Command**: 
```bash
next lint
```

**Parameters**:
- `--fix` - Automatically fix fixable issues
- `--ext <extensions>` - Specify file extensions
- `--dir <directories>` - Specify directories to lint

**Examples**:
```bash
# Standard linting
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Lint specific directory
npm run lint -- --dir components

# Lint specific file types
npm run lint -- --ext .ts,.tsx
```

**Expected Output**:
```bash
✔ No ESLint warnings or errors
```

**Or with issues**:
```bash
./components/example.tsx
4:7  Warning: 'useState' is defined but never used  @typescript-eslint/no-unused-vars
8:12 Error: 'onClick' is missing in props validation  react/prop-types

✖ 2 problems (1 error, 1 warning)
```

## 🚨 Troubleshooting

### Dev Server Issues

#### **Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions**:
```bash
# Use different port
npm run dev -- --port 3001

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill specific process
npx kill-port 3000
```

#### **Turbopack Errors**
```bash
# Disable Turbopack if issues occur
npx next dev
```

#### **Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### Build Issues

#### **Memory Errors During Build**
```bash
# Increase memory for build
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

#### **TypeScript Errors**
```bash
# Type check before build
npx tsc --noEmit
```

#### **Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Production Issues

#### **Build Not Found**
```bash
Error: Could not find a production build in the '.next' directory
```

**Solution**:
```bash
npm run build
npm run start
```

#### **Environment Variables**
Ensure production environment variables are set:
```bash
# Check environment variables
echo $ELEVENLABS_API_KEY
echo $AGENT_ID
```

### Lint Issues

#### **Configuration Errors**
```bash
# Reset ESLint configuration
rm .eslintcache
npm run lint
```

#### **Dependency Conflicts**
```bash
# Update ESLint dependencies
npm update eslint @next/eslint-plugin-next
```

#### **Custom Rules**
Modify `.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🔧 Custom Scripts

### Adding Development Utilities

```json
{
  "scripts": {
    "dev:debug": "NODE_OPTIONS='--inspect' npm run dev",
    "dev:verbose": "DEBUG=next:* npm run dev",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Testing Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Deployment Scripts

```json
{
  "scripts": {
    "deploy": "npm run build && npm run start",
    "deploy:vercel": "vercel --prod",
    "deploy:docker": "docker build -t convai-demo ."
  }
}
```

## 📊 Performance Monitoring

### Build Analysis

```bash
# Analyze bundle size
npm run build -- --debug
```

### Development Metrics

```bash
# Monitor development server
DEBUG=next:router npm run dev
```

## 🛠️ Environment-Specific Commands

### Development
```bash
# Full development setup
cp .env.example .env
npm install
npm run dev
```

### Production
```bash
# Production deployment
npm ci --only=production
npm run build
npm run start
```

### Docker
```bash
# Docker development
docker build -t convai-demo .
docker run -p 3000:3000 convai-demo
```

This documentation ensures developers can effectively use all available scripts and troubleshoot common issues during development and deployment.
