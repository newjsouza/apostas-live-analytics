const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class ApiFootballService {
  constructor() {
    this.client = axios.create({
      baseURL: config.API_FOOTBALL.BASE_URL,
      headers: {
        'x-rapidapi-key': config.API_FOOTBALL.API_KEY,
        'x-rapidapi-host': config.API_FOOTBALL.API_HOST
      }
    });
  }

  /**
   * Get live matches
   */
  async getLiveMatches() {
    try {
      const response = await this.client.get('/fixtures', {
        params: { live: 'all' }
      });
      logger.info(`Fetched ${response.data.results} live matches`);
      return response.data.response;
    } catch (error) {
      logger.error('Error fetching live matches:', error.message);
      throw error;
    }
  }

  /**
   * Get match details by fixture ID
   */
  async getMatchDetails(fixtureId) {
    try {
      const response = await this.client.get('/fixtures', {
        params: { id: fixtureId }
      });
      return response.data.response[0];
    } catch (error) {
      logger.error(`Error fetching match ${fixtureId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get match statistics
   */
  async getMatchStatistics(fixtureId) {
    try {
      const response = await this.client.get('/fixtures/statistics', {
        params: { fixture: fixtureId }
      });
      return response.data.response;
    } catch (error) {
      logger.error(`Error fetching statistics for ${fixtureId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get match events (goals, cards, substitutions)
   */
  async getMatchEvents(fixtureId) {
    try {
      const response = await this.client.get('/fixtures/events', {
        params: { fixture: fixtureId }
      });
      return response.data.response;
    } catch (error) {
      logger.error(`Error fetching events for ${fixtureId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get odds for a match
   */
  async getMatchOdds(fixtureId) {
    try {
      const response = await this.client.get('/odds', {
        params: { fixture: fixtureId }
      });
      return response.data.response;
    } catch (error) {
      logger.error(`Error fetching odds for ${fixtureId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get today's matches
   */
  async getTodayMatches() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.client.get('/fixtures', {
        params: { date: today }
      });
      logger.info(`Fetched ${response.data.results} matches for today`);
      return response.data.response;
    } catch (error) {
      logger.error('Error fetching today matches:', error.message);
      throw error;
    }
  }
}

module.exports = new ApiFootballService();
