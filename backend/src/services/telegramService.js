const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');

class TelegramService {
  constructor() {
    if (config.TELEGRAM.BOT_TOKEN) {
      try {
        this.bot = new TelegramBot(config.TELEGRAM.BOT_TOKEN, { polling: false });
        this.chatId = config.TELEGRAM.CHAT_ID;
        logger.info('Telegram bot initialized successfully');
      } catch (error) {
        logger.error('Error initializing Telegram bot:', error.message);
      }
    } else {
      logger.warn('Telegram bot token not configured');
    }
  }

  /**
   * Send notification message
   */
  async sendNotification(message, options = {}) {
    try {
      if (!this.bot || !this.chatId) {
        logger.warn('Telegram not configured, skipping notification');
        return;
      }

      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: 'Markdown',
        ...options
      });
      logger.info('Telegram notification sent successfully');
    } catch (error) {
      logger.error('Error sending Telegram notification:', error.message);
    }
  }

  /**
   * Send match update notification
   */
  async sendMatchUpdate(matchData) {
    const { fixture, teams, goals, score } = matchData;
    const message = `
🔴 *MATCH UPDATE* 🔴

⚽ *${teams.home.name}* ${goals.home} - ${goals.away} *${teams.away.name}*

⏱ Status: ${fixture.status.long}
🏆 League: ${fixture.league?.name || 'N/A'}
📅 Date: ${new Date(fixture.date).toLocaleString()}

Current Score: ${score.fulltime.home || 0} - ${score.fulltime.away || 0}
    `;
    
    await this.sendNotification(message.trim());
  }

  /**
   * Send goal notification
   */
  async sendGoalNotification(matchData, event) {
    const { teams, goals } = matchData;
    const message = `
⚽ *GOOOOAL!* ⚽

${event.team.name} scores! 
${event.player.name} ${event.detail}

*${teams.home.name}* ${goals.home} - ${goals.away} *${teams.away.name}*

⏱ ${event.time.elapsed}'
    `;
    
    await this.sendNotification(message.trim());
  }

  /**
   * Send prediction notification
   */
  async sendPredictionNotification(matchData, prediction) {
    const { teams, fixture } = matchData;
    const message = `
🤖 *AI PREDICTION* 🤖

Match: *${teams.home.name}* vs *${teams.away.name}*
🏆 ${fixture.league?.name || 'N/A'}

${prediction}

⏱ Kickoff: ${new Date(fixture.date).toLocaleString()}
    `;
    
    await this.sendNotification(message.trim());
  }

  /**
   * Send betting analytics notification
   */
  async sendBettingAnalytics(matchData, analytics) {
    const { teams } = matchData;
    const message = `
📊 *BETTING ANALYTICS* 📊

Match: *${teams.home.name}* vs *${teams.away.name}*

${analytics}
    `;
    
    await this.sendNotification(message.trim());
  }
}

module.exports = new TelegramService();
