import React from 'react';
import './MatchCard.css';

const MatchCard = ({ match, onSelectMatch }) => {
  const { fixture, teams, goals, league } = match;
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(fixture.status.short);

  return (
    <div className={`match-card ${isLive ? 'live' : ''}`} onClick={() => onSelectMatch(match)}>
      {isLive && (
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE - {fixture.status.elapsed}'
        </div>
      )}
      
      <div className="league-info">
        <span className="league-name">{league.name}</span>
        <span className="league-country">{league.country}</span>
      </div>

      <div className="match-content">
        <div className="team home-team">
          <img src={teams.home.logo} alt={teams.home.name} className="team-logo" />
          <span className="team-name">{teams.home.name}</span>
        </div>

        <div className="match-score">
          <div className="score">
            <span className="score-value">{goals.home ?? '-'}</span>
            <span className="score-separator">:</span>
            <span className="score-value">{goals.away ?? '-'}</span>
          </div>
          <div className="match-status">{fixture.status.long}</div>
        </div>

        <div className="team away-team">
          <img src={teams.away.logo} alt={teams.away.name} className="team-logo" />
          <span className="team-name">{teams.away.name}</span>
        </div>
      </div>

      <div className="match-footer">
        <span className="match-date">
          {new Date(fixture.date).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default MatchCard;
