const TelegramBot = require('node-telegram-bot-api');
const { generateResponse, initializeConversation, addToConversation, botPersonality } = require('../chatResponses');
const geminiService = require('../geminiService');

const token = process.env.BOT_TOKEN;
let bot;

// Initialize Gemini API (if needed)
geminiService.initializeGemini();

if (!token) {
  throw new Error('❌ BOT_TOKEN is missing in environment variables');
}

// Only create the bot once (Vercel may cold start multiple times)
if (!global._telegramBot) {
  bot = new TelegramBot(token, { webHook: true });
  global._telegramBot = bot;

  // Register handlers (move your handlers here)
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const name = msg.from.first_name || 'there';
    initializeConversation(userId);
    const welcomeMessage = `👋 Hello, ${name}! Welcome to your AI ChatBot! 🤖\n\nI'm here to have meaningful conversations with you. I can:\n• Remember our chat history and context\n• Discuss various topics intelligently\n• Respond to your mood and interests\n• Learn from our conversations\n• Tell jokes and share thoughts\n• Use AI to handle any topic you want to discuss\n\nJust start chatting naturally! I'll respond based on what we talk about.\n\nType /help to see all my features, or just say hello! 😊`;
    bot.sendMessage(chatId, welcomeMessage);
    addToConversation(userId, "User started conversation", false);
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const geminiStatus = geminiService.getGeminiStatus();
    const helpText = `🤖 **ChatBot Features:**\n\n**Conversation Commands:**\n/start - Start a new conversation\n/help - Show this help menu\n/status - Check conversation status\n/clear - Clear conversation memory\n/joke - Tell you a joke\n/topics - Show what we've discussed\n/ai - Check AI status\n\n**Smart Chat Features:**\n• **Memory**: I remember our conversations and topics\n• **Context**: I respond based on what we've discussed\n• **Personality**: I have my own interests and thoughts\n• **Adaptive**: I learn from our interactions\n• **Natural**: Just chat normally - no commands needed!\n• **AI Powered**: ${geminiStatus.available ? '✅ Gemini AI available' : '❌ Gemini AI not available'}\n\n**Topics I Love:**\n🎵 Music, 🎬 Movies, 📚 Books, ✈️ Travel, 🍕 Food, 💼 Work, ❤️ Relationships, 🌤️ Weather, 💻 Technology, ⚽ Sports, 🎨 Art, 🌿 Nature\n\n**AI Capabilities:**\n${geminiStatus.available ? '• Can discuss any topic intelligently\n• Provides detailed and helpful responses\n• Maintains conversation context\n• Learns from our interactions' : '• Basic predefined responses only\n• Add GEMINI_API_KEY to .env for AI features'}\n\n**Try These:**\n• "How are you?"\n• "What do you like?"\n• "Tell me a joke"\n• "What can you do?"\n• "Remember our conversation"\n• Ask me anything - I'll use AI to help!\n\nI'm here to be your friendly AI companion! 💬✨`;
    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const conversation = initializeConversation(userId);
    const geminiStatus = geminiService.getGeminiStatus();
    const statusText = `📊 **Conversation Status:**\n\n💬 **Messages**: ${conversation.conversationCount} total\n🎯 **Topics**: ${conversation.topics.join(', ') || 'None yet'}\n⏰ **Last Active**: ${new Date(conversation.lastActivity).toLocaleString()}\n🧠 **Memory**: ${conversation.messages.length} messages stored\n\n🤖 **Bot Mood**: ${botPersonality.mood}\n🌟 **Bot Interests**: ${botPersonality.interests.join(', ')}\n\n🤖 **AI Status**: ${geminiStatus.available ? '✅ Available' : '❌ Not available'}\n🔧 **AI Model**: ${geminiStatus.model}\n\nKeep chatting to build our conversation! 💭`;
    bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/clear/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    global.conversationMemory?.delete(userId);
    bot.sendMessage(chatId, `🧹 Conversation memory cleared! Starting fresh! ✨`);
  });

  bot.onText(/\/joke/, (msg) => {
    const chatId = msg.chat.id;
    const randomJoke = botPersonality.responses.jokes[Math.floor(Math.random() * botPersonality.responses.jokes.length)];
    bot.sendMessage(chatId, randomJoke);
  });

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

  bot.onText(/\/ai/, (msg) => {
    const chatId = msg.chat.id;
    const geminiStatus = geminiService.getGeminiStatus();
    if (geminiStatus.available) {
      bot.sendMessage(chatId, `🤖 **AI Status: Active** ✅\n\nI'm powered by Gemini AI and can discuss any topic intelligently! Just chat with me naturally and I'll provide thoughtful responses. 💬✨`, { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(chatId, `🤖 **AI Status: Inactive** ❌\n\nTo enable AI features, add your GEMINI_API_KEY to .env file.`, { parse_mode: 'Markdown' });
    }
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    if (text.startsWith('/')) return;
    addToConversation(userId, text, true);
    const conversation = initializeConversation(userId);
    bot.sendChatAction(chatId, 'typing');
    try {
      const response = await generateResponse(userId, text, conversation);
      addToConversation(userId, response, false);
      setTimeout(() => {
        bot.sendMessage(chatId, response);
      }, 1000 + Math.random() * 2000);
    } catch (error) {
      bot.sendMessage(chatId, `😅 Sorry, I'm having trouble thinking right now. Could you try rephrasing that? 🤔`);
    }
  });
}
else {
  bot = global._telegramBot;
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await bot.processUpdate(req.body);
    res.status(200).send('ok');
  } else {
    res.status(200).send('Hello from Telegram bot webhook!');
  }
}; 