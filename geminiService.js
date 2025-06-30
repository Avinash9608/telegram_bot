// Gemini API Service for intelligent responses
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
let genAI;
let model;

// Initialize Gemini service
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not found in .env file. Gemini features will be disabled.');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Gemini API initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini API:', error.message);
    return false;
  }
}

// Generate response using Gemini
async function generateGeminiResponse(userMessage, conversationContext = null) {
  if (!model) {
    return null; // Gemini not available
  }
  
  try {
    // Build context for Gemini
    let context = `You are a friendly AI chatbot assistant. You should be helpful, engaging, and conversational. 
    
Your personality traits:
- You're enthusiastic and positive
- You ask follow-up questions to keep conversations going
- You show genuine interest in what users share
- You're knowledgeable but not overwhelming
- You use emojis occasionally to make responses more engaging
- You keep responses conversational and not too long

Current conversation context: ${conversationContext ? `We've been discussing: ${conversationContext.join(', ')}` : 'This is a new conversation'}

User message: "${userMessage}"

Please respond in a friendly, conversational way. Keep your response under 200 words and make it engaging.`;

    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    return null;
  }
}

// Check if Gemini is available
function isGeminiAvailable() {
  return model !== undefined;
}

// Get Gemini status
function getGeminiStatus() {
  return {
    available: isGeminiAvailable(),
    model: model ? 'gemini-1.5-flash' : 'not initialized'
  };
}

module.exports = {
  initializeGemini,
  generateGeminiResponse,
  isGeminiAvailable,
  getGeminiStatus
}; 