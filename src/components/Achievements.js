import React from 'react';
import { Award, Target, Clock, Zap } from 'lucide-react';

const Achievements = ({ achievements, onBack }) => {
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 bg-gray-200 p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>
      
      {achievements.length > 0 ? (
        <div className="space-y-3">
          {achievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-full mr-3">
                  {achievement.icon === 'target' && <Target size={24} className="text-green-500" />}
                  {achievement.icon === 'clock' && <Clock size={24} className="text-blue-500" />}
                  {achievement.icon === 'zap' && <Zap size={24} className="text-yellow-500" />}
                  {achievement.icon === 'award' && <Award size={24} className="text-purple-500" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{achievement.title}</h2>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Unlocked on {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow text-center">
          <p className="text-gray-500 mb-4">No achievements yet.</p>
          <p className="text-sm">Complete practice challenges to earn achievements!</p>
        </div>
      )}
    </div>
  );
};

export default Achievements; 