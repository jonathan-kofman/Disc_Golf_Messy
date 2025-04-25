import React, { useState } from 'react';
import { ChevronLeft, Star, Target, TrendingUp, Zap, Wind, Moon, CloudRain, Sparkles, Layout, Clock, RotateCcw, RotateCw, Disc, Flag, Users, Trophy, Calendar, Sunrise, Cloud } from 'lucide-react';
import { achievements, achievementCategories, difficultyLevels } from '../data/achievements';

const Achievements = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const getIcon = (iconName) => {
    const icons = {
      star: Star,
      target: Target,
      'trending-up': TrendingUp,
      zap: Zap,
      wind: Wind,
      moon: Moon,
      'cloud-rain': CloudRain,
      sparkles: Sparkles,
      layout: Layout,
      clock: Clock,
      'rotate-ccw': RotateCcw,
      'rotate-cw': RotateCw,
      disc: Disc,
      slalom: Flag,
      users: Users,
      trophy: Trophy,
      calendar: Calendar,
      sunrise: Sunrise,
      cloud: Cloud
    };
    const Icon = icons[iconName] || Star;
    return <Icon className="h-6 w-6" />;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || achievement.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseDetails = () => {
    setSelectedAchievement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(achievementCategories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">All Difficulties</option>
              {Object.entries(difficultyLevels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const difficulty = difficultyLevels[achievement.difficulty];
            return (
              <div
                key={achievement.id}
                onClick={() => handleAchievementClick(achievement)}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 mr-4">
                        {getIcon(achievement.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
                      {difficulty.label}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {achievementCategories[achievement.category]}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{achievement.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Details Modal */}
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-4">
                    {getIcon(selectedAchievement.icon)}
                  </div>
                  <h2 className="text-xl font-bold">{selectedAchievement.title}</h2>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyLevels[selectedAchievement.difficulty].color}`}>
                  {difficultyLevels[selectedAchievement.difficulty].label}
                </span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-medium">{selectedAchievement.points} points</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-gray-100 mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No achievements found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to see more achievements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements; 