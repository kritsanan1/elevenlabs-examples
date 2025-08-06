#!/usr/bin/env node

/**
 * Environment validation script for ElevenLabs Conversational AI setup
 * Run with: node scripts/validate-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ElevenLabs Conversational AI - Environment Validation\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('   Create a .env file in the project root with your credentials\n');
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

const checks = [
  {
    name: 'AGENT_ID',
    value: process.env.AGENT_ID,
    isValid: (val) => val && val !== 'your-agent-id-here' && val.length > 10,
    message: 'Agent ID from your ElevenLabs Conversational AI dashboard'
  },
  {
    name: 'ELEVENLABS_API_KEY', 
    value: process.env.ELEVENLABS_API_KEY,
    isValid: (val) => val && val !== 'your-api-key-here' && val.startsWith('sk_'),
    message: 'API key from your ElevenLabs account settings'
  }
];

let allValid = true;

console.log('📋 Environment Variables Check:\n');

checks.forEach(check => {
  const isValid = check.isValid(check.value);
  const status = isValid ? '✅' : '❌';
  const display = check.value ? (isValid ? 'Configured' : 'Invalid/Placeholder') : 'Missing';
  
  console.log(`${status} ${check.name}: ${display}`);
  if (!isValid) {
    console.log(`   Required: ${check.message}`);
  }
  
  allValid = allValid && isValid;
});

console.log();

if (allValid) {
  console.log('🎉 All environment variables are configured correctly!');
  console.log('   You can now start the development server with: npm run dev');
} else {
  console.log('⚠️  Some environment variables need to be configured.');
  console.log('   Please update your .env file with the correct values.');
  console.log('   
  console.log('📚 Setup Guide: https://elevenlabs.io/docs/conversational-ai/docs/agent-setup');
  console.log('🔑 Get API Key: https://elevenlabs.io/app/speech-synthesis/text-to-speech');
}

console.log();

// Network connectivity check
console.log('🌐 Testing ElevenLabs API connectivity...');

const https = require('https');

const testConnection = () => {
  return new Promise((resolve) => {
    const req = https.get('https://api.elevenlabs.io/', (res) => {
      resolve({ success: true, status: res.statusCode });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
};

testConnection().then(result => {
  if (result.success) {
    console.log('✅ ElevenLabs API is reachable');
  } else {
    console.log('❌ Cannot reach ElevenLabs API');
    console.log(`   Error: ${result.error}`);
    console.log('   Please check your internet connection');
  }
  
  console.log('\n🚀 Run "npm run dev" to start the application');
  
  if (!allValid) {
    process.exit(1);
  }
});