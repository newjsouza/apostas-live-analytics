const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class PerplexityService {
  constructor() {
    if (config.PERPLEXITY.API_KEY) {
      this.client = axios.create({
        baseURL: config.PERPLEXITY.API_URL,
        headers: {
          'Authorization': `Bearer ${config.PERPLEXITY.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      logger.info('Perplexity AI service initialized');
    } else {
      logger.warn('Perplexity API key not configured');
    }
  }

  /**
   * Generate match prediction using Perplexity AI
   */
  async generatePrediction(matchData) {
    try {
      if (!this.client) {
        logger.warn('Perplexity not configured, returning default prediction');
        return 'AI predictions not available. Please configure Perplexity API key.';
      }

      const { teams, fixture, league } = matchData;
      
      const prompt = `Analyze this soccer match and provide a betting prediction:
      
Match: ${teams.home.name} vs ${teams.away.name}
League: ${league?.name || 'Unknown'}
Date: ${new Date(fixture.date).toLocaleString()}

Please provide:
1. Match outcome prediction (Home win/Draw/Away win)
2. Expected score
3. Key factors influencing the prediction
4. Betting recommendations (Over/Under goals, Both teams to score)
5. Confidence level (Low/Medium/High)

Keep the response concise and focused on betting analytics.`;

      const response = await this.client.post('', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a sports betting analyst specializing in soccer matches. Provide data-driven predictions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const prediction = response.data.choices[0].message.content;
      logger.info(`Generated prediction for match ${fixture.id}`);
      return prediction;
    } catch (error) {
      logger.error('Error generating prediction:', error.message);
      return 'Unable to generate prediction at this time.';
    }
  }

  /**
   * Generate betting analytics for ongoing match
   */
  async generateBettingAnalytics(matchData, statistics) {
    try {
      if (!this.client) {
        return 'AI analytics not available. Please configure Perplexity API key.';
      }

      const { teams, goals, fixture } = matchData;
      
      const statsText = statistics ? 
        statistics.map(s => `${s.team.name}: ${JSON.stringify(s.statistics)}`).join('\n') : 
        'No statistics available';

      const prompt = `Analyze this live soccer match for betting opportunities:

Match: ${teams.home.name} ${goals.home} - ${goals.away} ${teams.away.name}
Status: ${fixture.status.long}
Elapsed: ${fixture.status.elapsed}'

Statistics:
${statsText}

Provide:
1. Live betting opportunities
2. Expected final score
3. Next goal probability
4. Corners/Cards predictions
5. Value bets to consider

Keep it brief and actionable.`;

      const response = await this.client.post('', {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a live sports betting analyst. Analyze ongoing matches and suggest betting opportunities.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      const analytics = response.data.choices[0].message.content;
      logger.info(`Generated analytics for match ${fixture.id}`);
      return analytics;
    } catch (error) {
      logger.error('Error generating analytics:', error.message);
      return 'Unable to generate analytics at this time.';
    }
  }
}

module.exports = new PerplexityService();
