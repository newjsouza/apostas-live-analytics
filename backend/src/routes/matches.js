const express = require('express');
const router = express.Router();
const apiFootballService = require('../services/apiFootballService');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

/**
 * GET /api/matches/live
 * Get all live matches
 */
router.get('/live', async (req, res) => {
  try {
    const matches = await apiFootballService.getLiveMatches();
    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error) {
    logger.error('Error in /api/matches/live:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/today
 * Get today's matches
 */
router.get('/today', async (req, res) => {
  try {
    const matches = await apiFootballService.getTodayMatches();
    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error) {
    logger.error('Error in /api/matches/today:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/:id
 * Get match details by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await apiFootballService.getMatchDetails(id);
    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/:id/statistics
 * Get match statistics
 */
router.get('/:id/statistics', async (req, res) => {
  try {
    const { id } = req.params;
    const statistics = await apiFootballService.getMatchStatistics(id);
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}/statistics:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/:id/events
 * Get match events
 */
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await apiFootballService.getMatchEvents(id);
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}/events:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/:id/odds
 * Get match odds
 */
router.get('/:id/odds', async (req, res) => {
  try {
    const { id } = req.params;
    const odds = await apiFootballService.getMatchOdds(id);
    res.json({
      success: true,
      data: odds
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}/odds:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/matches/:id/analytics
 * Get betting analytics for a match
 */
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const analytics = await analyticsService.getBettingAnalytics(id);
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}/analytics:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/matches/:id/prediction
 * Generate AI prediction for a match
 */
router.post('/:id/prediction', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await analyticsService.generateMatchPrediction(id);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in /api/matches/${req.params.id}/prediction:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
