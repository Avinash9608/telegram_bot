# Telegram AI ChatBot (with Google Gemini)

This is a Telegram chatbot that responds to known questions with predefined answers and uses Google Gemini AI for unknown questions.

## Features
- Predefined responses for common questions
- AI-powered answers for anything else (via Google Gemini)
- Conversation memory and context
- Runs 24/7 on free Node.js hosts (Render, Railway, Fly.io, etc.)

## Deployment (Free Hosting)

### 1. Prerequisites
- [Node.js 18+](https://nodejs.org/)
- Telegram Bot Token ([How to get one?](https://core.telegram.org/bots#6-botfather))
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### 2. Environment Variables
Create a `.env` file in the root directory:

```
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Deploy to Render/Railway/Fly.io
- **Render:**
  - Create a new Web Service, connect your repo, set build command to `npm install` and start command to `npm start`.
- **Railway:**
  - Create a new project, link your repo, set service to `node`, and entry point to `bot.js`.
- **Fly.io:**
  - Install Fly CLI, run `fly launch`, and deploy.

### 4. Keep Alive
- These free services may sleep after inactivity. For best uptime, use Railway or Fly.io.

### 5. Local Development
```
npm install
npm start
```

## Files
- `bot.js` — Main bot logic
- `chatResponses.js` — Predefined responses and logic
- `geminiService.js` — Google Gemini integration

## License
MIT 