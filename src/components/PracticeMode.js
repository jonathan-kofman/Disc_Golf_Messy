import React, { useState } from 'react';
import { ChevronLeft, Target, Zap, Repeat } from 'lucide-react';

const PracticeMode = ({ onBack, onUpdateStats }) => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const challenges = [
    {
      id: 'target',
      name: 'Target Practice',
      icon: <Target size={24} />,
      description: 'Hit targets from different distances',
      maxScore: 100
    },
    {
      id: 'speed',
      name: 'Speed Challenge',
      icon: <Zap size={24} />,
      description: 'Measure your throwing speed',
      maxScore: 200
    },
    {
      id: 'consistency',
      name: 'Consistency Drill',
      icon: <Repeat size={24} />,
      description: 'Maintain consistent throws',
      maxScore: 150
    }
  ];

  const startChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setCurrentScore(0);
    setAttempts(0);
  };

  const updateScore = (points) => {
    setCurrentScore(prev => Math.min(prev + points, currentChallenge.maxScore));
    setAttempts(prev => prev + 1);
  };

  const finishChallenge = () => {
    if (currentChallenge && attempts > 0) {
      onUpdateStats({
        challengeId: currentChallenge.id,
        score: currentScore,
        attempts: attempts,
        date: new Date().toISOString()
      });
    }
    setCurrentChallenge(null);
  };

  if (currentChallenge) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={finishChallenge}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{currentChallenge.name}</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-center mb-4">
            {currentChallenge.icon}
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">{currentChallenge.description}</p>
            <div className="text-4xl font-bold text-blue-500">
              {currentScore}/{currentChallenge.maxScore}
            </div>
            <p className="text-sm text-gray-500">Attempts: {attempts}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateScore(10)}
              className="bg-green-500 text-white p-3 rounded-lg font-medium"
            >
              Good Throw (+10)
            </button>
            <button
              onClick={() => updateScore(5)}
              className="bg-yellow-500 text-white p-3 rounded-lg font-medium"
            >
              Fair Throw (+5)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 bg-gray-200 p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Practice Mode</h1>
      </div>

      <div className="space-y-4">
        {challenges.map(challenge => (
          <div 
            key={challenge.id}
            className="bg-white rounded-lg p-4 shadow cursor-pointer hover:bg-blue-50"
            onClick={() => startChallenge(challenge)}
          >
            <div className="flex items-center">
              <div className="mr-4 text-blue-500">
                {challenge.icon}
              </div>
              <div>
                <h2 className="font-bold">{challenge.name}</h2>
                <p className="text-sm text-gray-500">{challenge.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeMode; 