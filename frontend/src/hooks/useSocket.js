import { useState, useEffect } from 'react';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return { isConnected, socket: socketService };
};

export const useLiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const handleLiveMatches = (data) => {
      setMatches(data);
    };

    socket.on('live_matches', handleLiveMatches);

    return () => {
      socket.off('live_matches', handleLiveMatches);
    };
  }, [socket]);

  return matches;
};

export const useMatchUpdates = (fixtureId) => {
  const [matchData, setMatchData] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (fixtureId) {
      socket.subscribeToMatch(fixtureId);

      const handleMatchUpdate = (data) => {
        if (data.fixture.id === parseInt(fixtureId)) {
          setMatchData(data);
        }
      };

      socket.on('match_update', handleMatchUpdate);

      return () => {
        socket.off('match_update', handleMatchUpdate);
        socket.unsubscribeFromMatch(fixtureId);
      };
    }
  }, [fixtureId, socket]);

  return matchData;
};

export const useAnalyticsUpdates = () => {
  const [analytics, setAnalytics] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    const handleAnalyticsUpdate = (data) => {
      setAnalytics(prev => ({
        ...prev,
        [data.fixtureId]: data.analytics
      }));
    };

    socket.on('analytics_update', handleAnalyticsUpdate);

    return () => {
      socket.off('analytics_update', handleAnalyticsUpdate);
    };
  }, [socket]);

  return analytics;
};
