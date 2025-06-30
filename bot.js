// NOTE: For Vercel deployment, use api/webhook.js and webhooks. This file uses polling and is not suitable for Vercel.
require('dotenv').config(); // Load environment variables
const TelegramBot = require('node-telegram-bot-api');
const { 
  generateResponse, 
  analyzeMessage, 
  getBotPersonality,
  botPersonality 
} = require('./chatResponses');
const geminiService = require('./geminiService');
const RSSParser = require('rss-parser');
const fs = require('fs');

// Get token from .env
const token = process.env.BOT_TOKEN;

// Verify token exists
if (!token) {
  console.error("❌ BOT_TOKEN is missing in .env file");
  process.exit(1);
}

// Create bot with polling
const bot = new TelegramBot(token, { polling: true });

// Conversation memory storage
const conversationMemory = new Map();

// Initialize conversation for a user
function initializeConversation(userId) {
  if (!conversationMemory.has(userId)) {
    conversationMemory.set(userId, {
      messages: [],
      context: [],
      mood: "neutral",
      topics: [],
      lastActivity: Date.now(),
      conversationCount: 0,
      favoriteTopics: [],
      userPreferences: {}
    });
  }
  return conversationMemory.get(userId);
}

// Add message to conversation history
function addToConversation(userId, message, isUser = true) {
  const conversation = initializeConversation(userId);
  conversation.messages.push({
    text: message,
    isUser: isUser,
    timestamp: Date.now()
  });
  
  // Keep only last 20 messages to prevent memory overflow
  if (conversation.messages.length > 20) {
    conversation.messages = conversation.messages.slice(-20);
  }
  
  conversation.lastActivity = Date.now();
  conversation.conversationCount++;
}

// Initialize Gemini API
geminiService.initializeGemini();

// Confirm bot is running
console.log("🤖 Enhanced ChatBot with Gemini AI is running...");

// Load last notified post link
let lastNotified = '';
try {
  lastNotified = fs.readFileSync('last_blog.txt', 'utf8');
} catch (e) { lastNotified = ''; }

// Function to get all user chat IDs from conversationMemory
function getAllUserChatIds() {
  // conversationMemory is a Map of userId -> conversation
  return Array.from(conversationMemory.keys());
}

// Function to check for new blog post and notify all users
async function checkForNewBlogPost() {
  try {
    const feed = await parser.parseURL(FEED_URL);
    if (feed.items && feed.items.length > 0) {
      const latest = feed.items[0];
      if (latest.link !== lastNotified) {
        // Notify all users
        const userIds = getAllUserChatIds();
        userIds.forEach(chatId => {
          bot.sendMessage(chatId, `🆕 New blog post published: *${latest.title}*
${latest.link}`, { parse_mode: 'Markdown' });
        });
        // Save the latest link
        fs.writeFileSync('last_blog.txt', latest.link);
        lastNotified = latest.link;
      }
    }
  } catch (err) {
    console.error('Error checking blog RSS feed:', err);
  }
}

// Check every hour (3600000 ms)
setInterval(checkForNewBlogPost, 60 * 60 * 1000);

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name || 'there';
  
  // Initialize conversation
  initializeConversation(userId);
  
  const welcomeMessage = `👋 Hello, ${name}! Welcome to your AI ChatBot! 🤖

Check out my developer blog for coding tutorials, tech guides, and more:
https://avinashdevblog.blogspot.com

I'm here to have meaningful conversations with you. I can:
• Remember our chat history and context
• Discuss various topics intelligently
• Respond to your mood and interests
• Learn from our conversations
• Tell jokes and share thoughts
• Use AI to handle any topic you want to discuss

Just start chatting naturally! I'll respond based on what we talk about.

Type /help to see all my features, or just say hello! 😊`;
  
  bot.sendMessage(chatId, welcomeMessage);
  addToConversation(userId, "User started conversation", false);
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const geminiStatus = geminiService.getGeminiStatus();
  
  const helpText = `
🤖 **ChatBot Features:**

**Conversation Commands:**
/start - Start a new conversation
/help - Show this help menu
/status - Check conversation status
/clear - Clear conversation memory
/joke - Tell you a joke
/topics - Show what we've discussed
/ai - Check AI status
/blog - Show all blog links
/resources - Show all blog links

**Smart Chat Features:**
• **Memory**: I remember our conversations and topics
• **Context**: I respond based on what we've discussed
• **Personality**: I have my own interests and thoughts
• **Adaptive**: I learn from our interactions
• **Natural**: Just chat normally - no commands needed!
• **AI Powered**: ${geminiStatus.available ? '✅ Gemini AI available' : '❌ Gemini AI not available'}

**Topics I Love:**
🎵 Music, 🎬 Movies, 📚 Books, ✈️ Travel, 🍕 Food, 💼 Work, ❤️ Relationships, 🌤️ Weather, 💻 Technology, ⚽ Sports, 🎨 Art, 🌿 Nature

**AI Capabilities:**
${geminiStatus.available ? '• Can discuss any topic intelligently\n• Provides detailed and helpful responses\n• Maintains conversation context\n• Learns from our interactions' : '• Basic predefined responses only\n• Add GEMINI_API_KEY to .env for AI features'}

**Try These:**
• "How are you?"
• "What do you like?"
• "Tell me a joke"
• "What can you do?"
• "Remember our conversation"
• Ask me anything - I'll use AI to help!

I'm here to be your friendly AI companion! 💬✨
  `;
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// Handle /status command
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const conversation = initializeConversation(userId);
  const geminiStatus = geminiService.getGeminiStatus();
  
  const statusText = `
📊 **Conversation Status:**

💬 **Messages**: ${conversation.conversationCount} total
🎯 **Topics**: ${conversation.topics.join(', ') || 'None yet'}
⏰ **Last Active**: ${new Date(conversation.lastActivity).toLocaleString()}
🧠 **Memory**: ${conversation.messages.length} messages stored

🤖 **Bot Mood**: ${botPersonality.mood}
🌟 **Bot Interests**: ${botPersonality.interests.join(', ')}

🤖 **AI Status**: ${geminiStatus.available ? '✅ Available' : '❌ Not available'}
🔧 **AI Model**: ${geminiStatus.model}

Keep chatting to build our conversation! 💭
  `;
  
  bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' });
});

// Handle /clear command
bot.onText(/\/clear/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  conversationMemory.delete(userId);
  bot.sendMessage(chatId, `🧹 Conversation memory cleared! Starting fresh! ✨`);
});

// Handle /joke command
bot.onText(/\/joke/, (msg) => {
  const chatId = msg.chat.id;
  const randomJoke = botPersonality.responses.jokes[Math.floor(Math.random() * botPersonality.responses.jokes.length)];
  bot.sendMessage(chatId, randomJoke);
});

// Handle /topics command
bot.onText(/\/topics/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const conversation = initializeConversation(userId);
  
  if (conversation.topics.length === 0) {
    bot.sendMessage(chatId, `🤔 We haven't discussed any specific topics yet. Let's start chatting about something! 💬`);
  } else {
    bot.sendMessage(chatId, `🎯 **Topics we've discussed:**\n\n${conversation.topics.map(topic => `• ${topic}`).join('\n')}\n\nWhat would you like to talk about next? 💭`, { parse_mode: 'Markdown' });
  }
});

// Handle /ai command
bot.onText(/\/ai/, (msg) => {
  const chatId = msg.chat.id;
  const geminiStatus = geminiService.getGeminiStatus();
  
  if (geminiStatus.available) {
    bot.sendMessage(chatId, `🤖 **AI Status: Active** ✅\n\nI'm powered by Gemini AI and can discuss any topic intelligently! Just chat with me naturally and I'll provide thoughtful responses. 💬✨`, { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(chatId, `🤖 **AI Status: Inactive** ❌\n\nTo enable AI features, add your GEMINI_API_KEY to the .env file:\n\nGEMINI_API_KEY=your_api_key_here\n\nGet your API key from: https://makersuite.google.com/app/apikey`, { parse_mode: 'Markdown' });
  }
});

// Handle /blog command
bot.onText(/\/blog/, (msg) => {
  const chatId = msg.chat.id;
  const blogLinks = [
    'https://avinashdevblog.blogspot.com',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-build-telegram-bot-using-nodejs.html',
    'https://avinashdevblog.blogspot.com/2025/06/building-simple-chatbot-with-google.html',
    'https://avinashdevblog.blogspot.com/2025/06/firebase-authentication-starter-guide.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-set-up-firebase-with-web.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-download-private-zoom-meeting.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-i-learned-right-way-to-upload.html'
  ];
  bot.sendMessage(chatId, `Check out my developer blog and latest posts:\n\n${blogLinks.map(link => `- ${link}`).join('\n')}`);
});

// Handle /resources command
bot.onText(/\/resources/, (msg) => {
  const chatId = msg.chat.id;
  const blogLinks = [
    'https://avinashdevblog.blogspot.com',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-build-telegram-bot-using-nodejs.html',
    'https://avinashdevblog.blogspot.com/2025/06/building-simple-chatbot-with-google.html',
    'https://avinashdevblog.blogspot.com/2025/06/firebase-authentication-starter-guide.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-set-up-firebase-with-web.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-to-download-private-zoom-meeting.html',
    'https://avinashdevblog.blogspot.com/2025/06/how-i-learned-right-way-to-upload.html'
  ];
  bot.sendMessage(chatId, `Here are some useful resources from my developer blog:\n\n${blogLinks.map(link => `- ${link}`).join('\n')}`);
});

// Handle /shareblog command
bot.onText(/\/shareblog/, (msg) => {
  const chatId = msg.chat.id;
  const shareMessage = `🚀 Check out this awesome developer blog for coding tutorials, tech guides, and real-world solutions!\n\nhttps://avinashdevblog.blogspot.com\n\nFeel free to share this message with your friends and groups!`;
  bot.sendMessage(chatId, shareMessage);
});

// Main conversation handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Skip commands (they're handled separately)
  if (text.startsWith('/')) return;

  console.log(`💬 [${msg.from.username || msg.from.first_name}]: ${text}`);

  // Add user message to conversation
  addToConversation(userId, text, true);
  
  // Get conversation context
  const conversation = initializeConversation(userId);
  
  // Send typing indicator
  bot.sendChatAction(chatId, 'typing');
  
  try {
    // Generate contextual response using the separate file (now async)
    const response = await generateResponse(userId, text, conversation);
    
    // Add bot response to conversation
    addToConversation(userId, response, false);
    
    // Send response with random delay to feel more natural
    setTimeout(() => {
      bot.sendMessage(chatId, response);
    }, 1000 + Math.random() * 2000);
    
  } catch (error) {
    console.error('❌ Error generating response:', error);
    bot.sendMessage(chatId, `😅 Sorry, I'm having trouble thinking right now. Could you try rephrasing that? 🤔`);
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

console.log('✅ Enhanced ChatBot with Gemini AI integration is ready!');
console.log('💬 Features: Memory, Context, Personality, Smart Responses, AI Powered');
console.log('📁 Response patterns loaded from chatResponses.js');
console.log('🤖 Gemini AI integration loaded from geminiService.js');

// Minimal Express server for Render.com free Web Service
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});
