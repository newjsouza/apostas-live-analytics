const admin = require('firebase-admin');
const config = require('../config');
const logger = require('../utils/logger');

class FirebaseService {
  constructor() {
    if (config.FIREBASE.PRIVATE_KEY && config.FIREBASE.CLIENT_EMAIL) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.FIREBASE.PROJECT_ID,
            privateKey: config.FIREBASE.PRIVATE_KEY,
            clientEmail: config.FIREBASE.CLIENT_EMAIL
          }),
          databaseURL: config.FIREBASE.DATABASE_URL
        });
        this.db = admin.firestore();
        logger.info('Firebase initialized successfully');
      } catch (error) {
        logger.error('Error initializing Firebase:', error.message);
      }
    } else {
      logger.warn('Firebase credentials not configured');
    }
  }

  /**
   * Save match data
   */
  async saveMatch(matchData) {
    try {
      if (!this.db) {
        logger.warn('Firebase not configured, skipping save');
        return false;
      }
      const matchRef = this.db.collection('matches').doc(matchData.fixture.id.toString());
      await matchRef.set({
        ...matchData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info(`Match ${matchData.fixture.id} saved to Firebase`);
      return true;
    } catch (error) {
      logger.error('Error saving match:', error.message);
      throw error;
    }
  }

  /**
   * Get match by ID
   */
  async getMatch(fixtureId) {
    try {
      if (!this.db) {
        logger.warn('Firebase not configured');
        return null;
      }
      const matchDoc = await this.db.collection('matches').doc(fixtureId.toString()).get();
      if (matchDoc.exists) {
        return matchDoc.data();
      }
      return null;
    } catch (error) {
      logger.error('Error getting match:', error.message);
      throw error;
    }
  }

  /**
   * Save prediction
   */
  async savePrediction(fixtureId, prediction) {
    try {
      if (!this.db) {
        logger.warn('Firebase not configured, skipping save');
        return false;
      }
      const predictionRef = this.db.collection('predictions').doc(fixtureId.toString());
      await predictionRef.set({
        fixtureId,
        prediction,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      logger.info(`Prediction for match ${fixtureId} saved`);
      return true;
    } catch (error) {
      logger.error('Error saving prediction:', error.message);
      throw error;
    }
  }

  /**
   * Get all live matches from Firebase
   */
  async getLiveMatches() {
    try {
      if (!this.db) {
        logger.warn('Firebase not configured');
        return [];
      }
      const snapshot = await this.db.collection('matches')
        .where('fixture.status.short', 'in', ['1H', '2H', 'HT', 'ET', 'P'])
        .get();
      
      const matches = [];
      snapshot.forEach(doc => {
        matches.push(doc.data());
      });
      return matches;
    } catch (error) {
      logger.error('Error getting live matches:', error.message);
      throw error;
    }
  }

  /**
   * Save betting analytics
   */
  async saveBettingAnalytics(fixtureId, analytics) {
    try {
      if (!this.db) {
        logger.warn('Firebase not configured, skipping save');
        return false;
      }
      const analyticsRef = this.db.collection('analytics').doc(fixtureId.toString());
      await analyticsRef.set({
        fixtureId,
        analytics,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info(`Analytics for match ${fixtureId} saved`);
      return true;
    } catch (error) {
      logger.error('Error saving analytics:', error.message);
      throw error;
    }
  }
}

module.exports = new FirebaseService();
