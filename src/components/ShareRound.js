import React from 'react';
import { ChevronLeft, Share2 } from 'lucide-react';

const ShareRound = ({ selectedRound, completedRounds, onBack, onShare }) => {
  const generateShareText = (round) => {
    if (!round) return '';
    
    const totalThrows = round.scores.reduce((total, hole) => total + hole.throws, 0);
    const totalPar = round.scores.reduce((total, hole) => total + hole.par, 0);
    const relativeToPar = totalThrows - totalPar;
    const scoreText = relativeToPar === 0 ? 'E' : (relativeToPar > 0 ? `+${relativeToPar}` : relativeToPar);
    
    let shareText = `🥏 Disc Golf Round at ${round.courseName} 🥏\n`;
    shareText += `Date: ${new Date(round.date).toLocaleDateString()}\n`;
    shareText += `Final Score: ${scoreText} (${totalThrows} throws)\n\n`;
    
    shareText += `Hole-by-hole:\n`;
    round.scores.forEach(score => {
      const diff = score.throws - score.par;
      let emoji = '';
      if (diff <= -3) emoji = '🦅🦅';
      else if (diff === -2) emoji = '🦅';
      else if (diff === -1) emoji = '🐦';
      else if (diff === 0) emoji = '🟢';
      else if (diff === 1) emoji = '🟡';
      else if (diff === 2) emoji = '🟠';
      else if (diff > 2) emoji = '🔴';
      
      shareText += `Hole ${score.holeId} (${score.distance}ft, Par ${score.par}): ${score.throws} ${emoji}\n`;
    });
    
    shareText += `\nTracked with Disc Golf Tracker App`;
    
    return shareText;
  };

  if (selectedRound) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Share Round</h1>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">
            Round at {selectedRound.courseName}
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            {new Date(selectedRound.date).toLocaleDateString()}
          </p>
          
          <div className="bg-blue-50 p-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Final Score:</span>
              <span className="font-bold">
                {selectedRound.scores.reduce((total, hole) => total + hole.throws, 0) - 
                 selectedRound.scores.reduce((total, hole) => total + hole.par, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Throws:</span>
              <span className="font-bold">
                {selectedRound.scores.reduce((total, hole) => total + hole.throws, 0)}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Hole by Hole:</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedRound.scores.map(score => (
                <div key={score.holeId} className="border p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Hole {score.holeId}</span>
                    <span className={`text-sm font-medium ${
                      score.throws < score.par ? 'text-green-500' : 
                      score.throws > score.par ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {score.throws - score.par === 0 ? 'E' : 
                       score.throws - score.par > 0 ? `+${score.throws - score.par}` : 
                       score.throws - score.par}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Par {score.par}</span>
                    <span>{score.throws} throws</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => onShare(selectedRound)}
            className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center font-medium"
          >
            <Share2 size={18} className="mr-2" /> Share This Round
          </button>
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
        <h1 className="text-2xl font-bold">Share Round</h1>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-bold mb-3">Select a Round to Share</h2>
        
        {completedRounds.length > 0 ? (
          <div className="space-y-3">
            {completedRounds.slice().reverse().map((round, index) => (
              <div 
                key={index} 
                className="border p-3 rounded cursor-pointer hover:bg-blue-50"
                onClick={() => onShare(round)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{round.courseName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(round.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {round.scores.reduce((total, hole) => total + hole.throws, 0) - 
                       round.scores.reduce((total, hole) => total + hole.par, 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {round.scores.reduce((total, hole) => total + hole.throws, 0)} throws
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No completed rounds to share yet.</p>
        )}
      </div>
    </div>
  );
};

export default ShareRound; 