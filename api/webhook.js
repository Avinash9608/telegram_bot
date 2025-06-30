// Minimal working Telegram webhook for Vercel. Do not add custom functions here.
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const { generateResponse, hasPredefinedResponse, initializeConversation } = require('../chatResponses');
const geminiService = require('../geminiService');

const token = process.env.BOT_TOKEN;
let bot;

async function sendTelegramMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error('Telegram API error: ' + JSON.stringify(data));
  }
}

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
      let usedGemini = false;
      if (hasPredefinedResponse && hasPredefinedResponse(text, conversation)) {
        response = await generateResponse(userId, text, conversation);
        console.log('Reply source: chatResponses');
      } else {
        try {
          response = await geminiService.generateGeminiResponse(text, conversation ? conversation.topics : null);
          usedGemini = true;
          console.log('Reply source: Gemini');
        } catch (err) {
          console.error('Gemini error:', err);
          response = null;
        }
      }
      // Always send a valid fallback reply
      if (!response || typeof response !== 'string' || !response.trim()) {
        response = usedGemini
          ? "😅 Sorry, I couldn't think of a good reply right now (Gemini error)."
          : "😅 Sorry, I couldn't think of a good reply right now.";
      }
      console.log('About to send message:', response);
      await sendTelegramMessage(chatId, response);
      console.log('Message sent to chatId:', chatId);
    } catch (err) {
      console.error('Error in message handler:', err);
      try {
        await sendTelegramMessage(chatId, 'Internal error: ' + err.message);
      } catch (sendErr) {
        console.error('Failed to send error message:', sendErr);
      }
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