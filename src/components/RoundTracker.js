import React, { useState } from 'react';
import { ChevronLeft, Save, Trash2, Flag } from 'lucide-react';
import { useRounds } from '../hooks/useRounds';

const RoundTracker = ({ round, onBack }) => {
  const [currentRound, setCurrentRound] = useState(round);
  const { addRound } = useRounds();

  const updateScore = (holeIndex, change) => {
    const newScores = [...currentRound.scores];
    const newThrows = Math.max(0, newScores[holeIndex].throws + change);
    newScores[holeIndex] = { ...newScores[holeIndex], throws: newThrows };
    
    setCurrentRound({
      ...currentRound,
      scores: newScores
    });
  };

  const finishRound = () => {
    const allHolesScored = currentRound.scores.every(score => score.throws > 0);
    
    if (!allHolesScored) {
      alert('Please enter scores for all holes before finishing the round.');
      return;
    }
    
    addRound(currentRound);
    onBack();
  };

  const getTotalScore = (scores) => {
    return scores.reduce((total, hole) => total + hole.throws, 0);
  };

  const getTotalPar = (scores) => {
    return scores.reduce((total, hole) => total + hole.par, 0);
  };

  const getScoreRelativeToPar = (scores) => {
    const totalThrows = getTotalScore(scores);
    const totalPar = getTotalPar(scores);
    const diff = totalThrows - totalPar;
    
    if (diff === 0) return 'E';
    return diff > 0 ? `+${diff}` : diff;
  };

  const getScoreName = (throws, par) => {
    if (throws === 0) return '';
    const diff = throws - par;
    
    if (diff === -3) return 'Albatross';
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double Bogey';
    if (diff === 3) return 'Triple Bogey';
    if (diff > 3) return 'Bogey+';
    return '';
  };

  const formatRelativeScore = (throws, par) => {
    if (throws === 0) return '';
    const diff = throws - par;
    if (diff === 0) return 'E';
    return diff > 0 ? `+${diff}` : diff;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <div className="flex items-center mb-2">
          <button 
            onClick={onBack}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">{currentRound.courseName}</h2>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Current Score: </span>
            <span className="font-bold">{getScoreRelativeToPar(currentRound.scores)}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total: </span>
            <span className="font-bold">{getTotalScore(currentRound.scores)}</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={finishRound}
              className="bg-green-500 text-white px-3 py-1 rounded flex items-center text-sm"
            >
              <Save size={16} className="mr-1" /> Save
            </button>
            <button 
              onClick={onBack}
              className="bg-red-500 text-white px-3 py-1 rounded flex items-center text-sm"
            >
              <Trash2 size={16} className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {currentRound.scores.map((score, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Hole {score.holeId}</h3>
              <div className="flex items-center">
                <Flag size={16} className="mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">{score.distance}ft</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Par: {score.par}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => updateScore(index, -1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                
                <div className="w-8 text-center">
                  {score.throws > 0 ? score.throws : '-'}
                </div>
                
                <button 
                  onClick={() => updateScore(index, 1)}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            {score.throws > 0 && (
              <div className="mt-2 text-right">
                <span className={`text-sm font-medium ${
                  score.throws < score.par ? 'text-green-500' : 
                  score.throws > score.par ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {getScoreName(score.throws, score.par)} ({formatRelativeScore(score.throws, score.par)})
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundTracker; 