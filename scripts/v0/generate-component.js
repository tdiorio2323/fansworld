#!/usr/bin/env node

const V0Client = require('./v0-client');
require('dotenv').config({ path: '.env.v0' });

const client = new V0Client(process.env.V0_API_KEY);

async function generateComponent(prompt, filename) {
  try {
    console.log(`🔄 Generating component: ${filename}`);
    console.log(`📝 Prompt: ${prompt}`);
    
    const result = await client.generateComponent(prompt);
    
    if (result.success) {
      await client.saveComponent(result.data, filename);
      console.log('✅ Component generated successfully!');
    } else {
      console.error('❌ Generation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Command line usage
if (require.main === module) {
  const prompt = process.argv[2];
  const filename = process.argv[3] || 'GeneratedComponent.tsx';
  
  if (!prompt) {
    console.log('Usage: node generate-component.js "prompt" "filename.tsx"');
    process.exit(1);
  }
  
  generateComponent(prompt, filename);
}

module.exports = generateComponent;
