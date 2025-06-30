// Minimal working Telegram webhook for Vercel. Do not add custom functions here.
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
let bot;

if (!global._telegramBot) {
  bot = new TelegramBot(token, { webHook: true });
  global._telegramBot = bot;

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! This is a reply from the Vercel webhook.');
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