import { useState, useEffect } from 'react';

const usePracticeStats = () => {
  const [practiceStats, setPracticeStats] = useState({
    targetChallenge: {
      bestAccuracy: 0,
      gamesPlayed: 0,
      lastScore: 0
    },
    speedChallenge: {
      bestTime: null,
      gamesPlayed: 0,
      lastTime: null
    },
    consistencyChallenge: {
      bestStreak: 0,
      totalThrows: 0,
      gamesPlayed: 0
    },
    achievements: []
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('practiceStats');
    if (savedStats) {
      setPracticeStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('practiceStats', JSON.stringify(practiceStats));
  }, [practiceStats]);

  const updateStats = (newStats) => {
    setPracticeStats(newStats);
  };

  return {
    practiceStats,
    updateStats
  };
};

export default usePracticeStats; 