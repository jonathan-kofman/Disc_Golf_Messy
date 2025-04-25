import { useState, useEffect } from 'react';

const useRounds = () => {
  const [completedRounds, setCompletedRounds] = useState([]);

  useEffect(() => {
    const savedRounds = localStorage.getItem('completedRounds');
    if (savedRounds) {
      setCompletedRounds(JSON.parse(savedRounds));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedRounds', JSON.stringify(completedRounds));
  }, [completedRounds]);

  const addRound = (round) => {
    setCompletedRounds([...completedRounds, round]);
  };

  return {
    completedRounds,
    addRound
  };
};

export default useRounds; 