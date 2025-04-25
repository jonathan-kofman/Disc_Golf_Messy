import React from 'react';
import { ChevronLeft, Award, BarChart2 } from 'lucide-react';

const Statistics = ({ stats, onBack }) => {
  if (!stats) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={onBack}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Statistics</h1>
        </div>
        <div className="bg-white rounded-lg p-6 shadow text-center">
          <p className="text-gray-500">No completed rounds yet. Play a round to see your stats!</p>
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
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Total Rounds</p>
              <p className="text-xl font-bold">{stats.totalRounds}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Total Holes</p>
              <p className="text-xl font-bold">{stats.totalHoles}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Avg. Throws/Hole</p>
              <p className="text-xl font-bold">{stats.averageThrowsPerHole}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-500">Avg. Round Score</p>
              <p className="text-xl font-bold">{stats.averageRoundScore}</p>
            </div>
          </div>
        </div>
        
        {stats.bestRound && (
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <Award size={20} className="mr-2 text-yellow-500" /> Best Round
            </h2>
            <div className="bg-yellow-50 p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{stats.bestRound.courseName}</p>
                  <p className="text-sm text-gray-500">{stats.bestRound.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">{stats.bestRound.score}</p>
                  <p className="text-sm text-gray-500">{stats.bestRound.throws} throws</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-3">Score Distribution</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center">🦅🦅 Albatross or better</span>
              <span className="font-bold">{stats.scoreCounts.albatrosses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🦅 Eagle</span>
              <span className="font-bold">{stats.scoreCounts.eagles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🐦 Birdie</span>
              <span className="font-bold">{stats.scoreCounts.birdies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🟢 Par</span>
              <span className="font-bold">{stats.scoreCounts.pars}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🟡 Bogey</span>
              <span className="font-bold">{stats.scoreCounts.bogeys}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🟠 Double Bogey</span>
              <span className="font-bold">{stats.scoreCounts.doubleBogeys}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">🔴 Triple Bogey+</span>
              <span className="font-bold">{stats.scoreCounts.tripleBogeyPlus}</span>
            </div>
          </div>
        </div>
        
        {stats.courseStats.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-3">Course Stats</h2>
            <div className="space-y-3">
              {stats.courseStats.map(course => (
                <div key={course.id} className="border-b last:border-b-0 pb-2 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.roundCount} rounds</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">Best: {course.bestScore}</p>
                      <p className="text-sm text-gray-500">Avg: {course.averageScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics; 