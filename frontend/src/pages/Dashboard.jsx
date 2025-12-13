import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useLiveMatches, useAnalyticsUpdates } from '../hooks/useSocket';
import MatchCard from '../components/MatchCard';
import './Dashboard.css';

const Dashboard = () => {
  const [todayMatches, setTodayMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('live'); // 'live' or 'today'
  
  const liveMatches = useLiveMatches();
  const analyticsUpdates = useAnalyticsUpdates();

  useEffect(() => {
    loadTodayMatches();
  }, []);

  const loadTodayMatches = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTodayMatches();
      setTodayMatches(response.data || []);
    } catch (error) {
      console.error('Error loading today matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = async (match) => {
    setSelectedMatch(match);
    setAnalytics(null);
    setPrediction(null);
    
    try {
      setLoading(true);
      const analyticsResponse = await apiService.getMatchAnalytics(match.fixture.id);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    if (!selectedMatch) return;
    
    try {
      setLoading(true);
      const response = await apiService.generatePrediction(selectedMatch.fixture.id);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayMatches = view === 'live' ? liveMatches : todayMatches;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚽ Apostas Live Analytics</h1>
        <p>Real-time sports betting analytics with AI predictions</p>
      </header>

      <div className="view-toggle">
        <button 
          className={view === 'live' ? 'active' : ''} 
          onClick={() => setView('live')}
        >
          🔴 Live Matches ({liveMatches.length})
        </button>
        <button 
          className={view === 'today' ? 'active' : ''} 
          onClick={() => setView('today')}
        >
          📅 Today's Matches ({todayMatches.length})
        </button>
      </div>

      <div className="dashboard-content">
        <div className="matches-list">
          <h2>{view === 'live' ? 'Live Matches' : "Today's Matches"}</h2>
          {loading && displayMatches.length === 0 ? (
            <div className="loading">Loading matches...</div>
          ) : displayMatches.length === 0 ? (
            <div className="no-matches">No matches available</div>
          ) : (
            displayMatches.map(match => (
              <MatchCard 
                key={match.fixture.id} 
                match={match} 
                onSelectMatch={handleSelectMatch}
              />
            ))
          )}
        </div>

        <div className="match-details">
          {selectedMatch ? (
            <>
              <h2>Match Details</h2>
              <div className="match-info">
                <h3>{selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}</h3>
                <p className="league">{selectedMatch.league.name} - {selectedMatch.league.country}</p>
                <p className="status">{selectedMatch.fixture.status.long}</p>
              </div>

              {analytics && (
                <div className="analytics-section">
                  <h3>📊 Analytics</h3>
                  {analytics.statistics && analytics.statistics.length > 0 && (
                    <div className="statistics">
                      <h4>Statistics</h4>
                      {analytics.statistics.map((stat, idx) => (
                        <div key={idx} className="team-stats">
                          <h5>{stat.team.name}</h5>
                          <div className="stats-grid">
                            {stat.statistics.slice(0, 6).map((s, i) => (
                              <div key={i} className="stat-item">
                                <span className="stat-label">{s.type}</span>
                                <span className="stat-value">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                className="prediction-button" 
                onClick={handleGeneratePrediction}
                disabled={loading}
              >
                🤖 Generate AI Prediction
              </button>

              {prediction && (
                <div className="prediction-section">
                  <h3>🔮 AI Prediction</h3>
                  <div className="prediction-content">
                    {prediction}
                  </div>
                </div>
              )}

              {analyticsUpdates[selectedMatch.fixture.id] && (
                <div className="live-analytics">
                  <h3>🔴 Live Analytics</h3>
                  <div className="analytics-content">
                    {analyticsUpdates[selectedMatch.fixture.id]}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>👈 Select a match to view details and analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
