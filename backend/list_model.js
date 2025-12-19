const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('Available models:');
    models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();