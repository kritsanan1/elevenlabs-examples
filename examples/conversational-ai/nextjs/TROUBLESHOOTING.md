# Troubleshooting Guide

This guide helps you resolve common issues with the ElevenLabs Conversational AI demo.

## Quick Fix Checklist

### ✅ Configuration Issues
- [ ] AGENT_ID is set in `.env` file
- [ ] ELEVENLABS_API_KEY is set in `.env` file  
- [ ] Values are not the default placeholders
- [ ] No extra quotes or spaces in environment variables

### ✅ Network Issues
- [ ] Internet connection is working
- [ ] No firewall blocking requests
- [ ] ElevenLabs API is accessible

### ✅ Browser Issues
- [ ] Microphone permission granted
- [ ] Browser supports WebRTC
- [ ] No ad blockers interfering

## Common Errors and Solutions

### 1. "AGENT_ID is not configured" or "ELEVENLABS_API_KEY is not configured"

**Cause**: Environment variables are not set or contain placeholder values.

**Solution**:
1. Open `.env` file in the project root
2. Replace placeholder values:
   ```env
   AGENT_ID="your-actual-agent-id-here"
   ELEVENLABS_API_KEY="your-actual-api-key-here"
   ```
3. Get your credentials from [ElevenLabs Dashboard](https://elevenlabs.io/app)
4. Restart the development server: `npm run dev`

### 2. "Failed to start conversation: Error" with generic error

**Cause**: Network issues or API errors with poor error handling.

**What we fixed**: Enhanced error handling to show specific error messages instead of generic "Error" objects.

**Solution**:
- Check the browser console for detailed error messages
- Verify your internet connection
- Ensure ElevenLabs API is accessible

### 3. "Microphone permission is required"

**Cause**: Browser blocked microphone access.

**Solution**:
1. Click the 🔒 lock icon in your browser's address bar
2. Allow microphone permission
3. Refresh the page
4. Try starting the conversation again

### 4. "Network error - unable to connect"

**Cause**: Connection issues or server problems.

**Solutions**:
- Check your internet connection
- Verify the development server is running (`npm run dev`)
- Check if any firewall is blocking localhost:3000
- Try refreshing the page

### 5. "Failed to get signed URL from ElevenLabs"

**Cause**: Invalid credentials or ElevenLabs API issues.

**Solutions**:
1. Verify your API key is correct and active
2. Check that your agent ID exists and is accessible
3. Ensure your ElevenLabs account has sufficient credits
4. Check [ElevenLabs Status Page](https://status.elevenlabs.io/) for service issues

## Setting Up ElevenLabs Credentials

### Step 1: Get Your API Key
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app)
2. Sign in or create an account
3. Navigate to Settings → API Keys
4. Copy your API key

### Step 2: Create a Conversational AI Agent
1. In the ElevenLabs dashboard, go to Conversational AI
2. Create a new agent or use an existing one
3. Copy the Agent ID from the agent details

### Step 3: Configure Environment Variables
1. Open `.env` file in your project
2. Replace the placeholder values:
   ```env
   # Replace with your actual credentials
   AGENT_ID="your-agent-id-from-step-2"
   ELEVENLABS_API_KEY="your-api-key-from-step-1"
   ```
3. Save the file
4. Restart your development server

## Development Setup Issues

### Environment Variables Not Loading
- Ensure the `.env` file is in the project root (same level as `package.json`)
- Restart the development server after changing environment variables
- Check for typos in variable names (they are case-sensitive)

### Build/Runtime Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (requires Node 18+)

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 88+
- ✅ Firefox 84+
- ✅ Safari 14+
- ✅ Edge 88+

### Known Issues
- Some ad blockers may interfere with WebRTC connections
- Incognito/private mode may have restricted microphone access
- Corporate firewalls may block WebSocket connections

## Getting Help

### Debug Information
When reporting issues, include:
1. Browser and version
2. Error messages from browser console
3. Your environment setup (Node.js version, OS)
4. Steps to reproduce the issue

### Useful Commands
```bash
# Check environment variables are loaded
npm run dev

# View detailed error logs
# Check browser console (F12 → Console tab)

# Test API endpoint directly
curl http://localhost:3000/api/signed-url
```

### Support Resources
- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Conversational AI Setup Guide](https://elevenlabs.io/docs/conversational-ai/docs/agent-setup)
- [ElevenLabs Discord Community](https://discord.gg/elevenlabs)

## Still Having Issues?

If you're still experiencing problems after following this guide:

1. Check the browser console for detailed error messages
2. Verify all setup steps are completed correctly
3. Try the basic conversation flow in the ElevenLabs dashboard first
4. Consider reaching out to ElevenLabs support with specific error details

The enhanced error handling in this application now provides much more specific error messages to help you identify and resolve issues quickly.
