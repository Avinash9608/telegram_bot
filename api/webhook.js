// Minimal working Telegram webhook for Vercel. Do not add custom functions here.
const TelegramBot = require('node-telegram-bot-api');
const { generateResponse, hasPredefinedResponse, initializeConversation } = require('../chatResponses');
const geminiService = require('../geminiService');

const token = process.env.BOT_TOKEN;
let bot;

if (!global._telegramBot) {
  bot = new TelegramBot(token, { webHook: true });
  global._telegramBot = bot;

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    try {
      const conversation = initializeConversation ? initializeConversation(userId) : null;
      let response;
      if (hasPredefinedResponse && hasPredefinedResponse(text, conversation)) {
        response = await generateResponse(userId, text, conversation);
      } else {
        try {
          response = await geminiService.generateGeminiResponse(text);
        } catch (err) {
          console.error('Gemini error:', err);
          response = "😅 Sorry, I couldn't think of a good reply right now (Gemini error).";
        }
      }
      await bot.sendMessage(chatId, response);
    } catch (err) {
      console.error('Error in message handler:', err);
      await bot.sendMessage(chatId, 'Internal error: ' + err.message);
    }
  });
} else {
  bot = global._telegramBot;
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    console.log('Received POST from Telegram');
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(JSON.parse(data)));
      });
    }
    try {
      await bot.processUpdate(body);
      console.log('Processed update:', body);
    } catch (err) {
      console.error('Error processing update:', err, body);
    }
    res.status(200).send('ok');
  } else {
    res.status(200).send('Hello from Telegram bot webhook!');
  }
}; 