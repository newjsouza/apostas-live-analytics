import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000
    });
  }

  // Match endpoints
  async getLiveMatches() {
    const response = await this.client.get('/matches/live');
    return response.data;
  }

  async getTodayMatches() {
    const response = await this.client.get('/matches/today');
    return response.data;
  }

  async getMatchDetails(fixtureId) {
    const response = await this.client.get(`/matches/${fixtureId}`);
    return response.data;
  }

  async getMatchStatistics(fixtureId) {
    const response = await this.client.get(`/matches/${fixtureId}/statistics`);
    return response.data;
  }

  async getMatchEvents(fixtureId) {
    const response = await this.client.get(`/matches/${fixtureId}/events`);
    return response.data;
  }

  async getMatchOdds(fixtureId) {
    const response = await this.client.get(`/matches/${fixtureId}/odds`);
    return response.data;
  }

  async getMatchAnalytics(fixtureId) {
    const response = await this.client.get(`/matches/${fixtureId}/analytics`);
    return response.data;
  }

  async generatePrediction(fixtureId) {
    const response = await this.client.post(`/matches/${fixtureId}/prediction`);
    return response.data;
  }
}

export default new ApiService();
