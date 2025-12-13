const apiFootballService = require('./apiFootballService');
const firebaseService = require('./firebaseService');
const telegramService = require('./telegramService');
const perplexityService = require('./perplexityService');
const logger = require('../utils/logger');

// Configuration constants
const LIVE_MATCH_UPDATE_INTERVAL_MS = 30000; // 30 seconds

class AnalyticsService {
  constructor() {
    this.liveMatchesCache = new Map();
    this.updateInterval = null;
  }

  /**
   * Start monitoring live matches
   */
  startMonitoring(io) {
    logger.info('Starting live match monitoring...');
    
    // Initial fetch
    this.updateLiveMatches(io);

    // Update every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateLiveMatches(io);
    }, LIVE_MATCH_UPDATE_INTERVAL_MS);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      logger.info('Live match monitoring stopped');
    }
  }

  /**
   * Update live matches and emit to connected clients
   */
  async updateLiveMatches(io) {
    try {
      const liveMatches = await apiFootballService.getLiveMatches();
      
      for (const match of liveMatches) {
        const fixtureId = match.fixture.id;
        const cachedMatch = this.liveMatchesCache.get(fixtureId);

        // Check for score changes
        if (cachedMatch && this.hasScoreChanged(cachedMatch, match)) {
          logger.info(`Score change detected for match ${fixtureId}`);
          
          // Send WebSocket update
          io.emit('match_update', match);
          
          // Send Telegram notification
          await telegramService.sendMatchUpdate(match);
          
          // Generate and send betting analytics
          const statistics = await apiFootballService.getMatchStatistics(fixtureId);
          const analytics = await perplexityService.generateBettingAnalytics(match, statistics);
          
          io.emit('analytics_update', {
            fixtureId,
            analytics
          });
          
          // Save to Firebase
          await firebaseService.saveMatch(match);
          await firebaseService.saveBettingAnalytics(fixtureId, analytics);
        }

        // Update cache
        this.liveMatchesCache.set(fixtureId, match);
      }

      // Emit all live matches
      io.emit('live_matches', liveMatches);
      
    } catch (error) {
      logger.error('Error updating live matches:', error.message);
    }
  }

  /**
   * Check if match score has changed
   */
  hasScoreChanged(oldMatch, newMatch) {
    return oldMatch.goals.home !== newMatch.goals.home ||
           oldMatch.goals.away !== newMatch.goals.away;
  }

  /**
   * Generate prediction for upcoming match
   */
  async generateMatchPrediction(fixtureId) {
    try {
      const match = await apiFootballService.getMatchDetails(fixtureId);
      const prediction = await perplexityService.generatePrediction(match);
      
      // Save prediction
      await firebaseService.savePrediction(fixtureId, prediction);
      
      // Send notification
      await telegramService.sendPredictionNotification(match, prediction);
      
      return {
        match,
        prediction
      };
    } catch (error) {
      logger.error('Error generating prediction:', error.message);
      throw error;
    }
  }

  /**
   * Get betting analytics for a match
   */
  async getBettingAnalytics(fixtureId) {
    try {
      const match = await apiFootballService.getMatchDetails(fixtureId);
      const statistics = await apiFootballService.getMatchStatistics(fixtureId);
      const odds = await apiFootballService.getMatchOdds(fixtureId);
      
      return {
        match,
        statistics,
        odds
      };
    } catch (error) {
      logger.error('Error getting betting analytics:', error.message);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
