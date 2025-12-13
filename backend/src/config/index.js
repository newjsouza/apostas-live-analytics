require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API-Football Configuration
  API_FOOTBALL: {
    BASE_URL: 'https://api-football-v1.p.rapidapi.com/v3',
    API_KEY: process.env.API_FOOTBALL_KEY,
    API_HOST: 'api-football-v1.p.rapidapi.com'
  },

  // Firebase Configuration
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    DATABASE_URL: process.env.FIREBASE_DATABASE_URL
  },

  // Telegram Configuration
  TELEGRAM: {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    CHAT_ID: process.env.TELEGRAM_CHAT_ID
  },

  // Perplexity AI Configuration
  PERPLEXITY: {
    API_KEY: process.env.PERPLEXITY_API_KEY,
    API_URL: 'https://api.perplexity.ai/chat/completions'
  },

  // WebSocket Configuration
  WEBSOCKET: {
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};
