import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trophy, Star, Target, Clock, Zap, Smile, Heart, Flag, Award, Sparkles, Gamepad2, Leaf, Activity } from 'lucide-react';

const KidsMode = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  
  // Target states
  const [targets, setTargets] = useState([false, false, false]);
  
  // Treasures and animals state
  const [foundItems, setFoundItems] = useState({});

  const games = [
    {
      id: 'target-challenge',
      name: 'Target Challenge',
      icon: <Target className="h-8 w-8 text-red-500" />,
      description: 'Hit the target 3 times in a row!',
      points: 50,
      color: 'red'
    },
    {
      id: 'speed-challenge',
      name: 'Speed Challenge',
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      description: 'Complete the course as fast as you can!',
      points: 100,
      color: 'blue'
    },
    {
      id: 'treasure-hunt',
      name: 'Treasure Hunt',
      icon: <Flag className="h-8 w-8 text-yellow-500" />,
      description: 'Find hidden treasures around the course!',
      points: 75,
      color: 'yellow'
    },
    {
      id: 'animal-spotting',
      name: 'Animal Spotting',
      icon: <Heart className="h-8 w-8 text-green-500" />,
      description: 'Spot and identify animals you see!',
      points: 25,
      color: 'green'
    }
  ];

  const achievements = [
    {
      id: 'first-game',
      name: 'First Game!',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      description: 'Played your first game',
      unlocked: true
    },
    {
      id: 'target-master',
      name: 'Target Master',
      icon: <Target className="h-6 w-6 text-red-500" />,
      description: 'Hit 10 targets in a row',
      unlocked: false
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      description: 'Complete a course in under 5 minutes',
      unlocked: false
    },
    {
      id: 'nature-explorer',
      name: 'Nature Explorer',
      icon: <Leaf className="h-6 w-6 text-green-500" />,
      description: 'Spot 5 different animals',
      unlocked: false
    }
  ];

  // Reset game state when a game is selected
  useEffect(() => {
    if (selectedGame) {
      setStreak(0);
      setTargets([false, false, false]);
      setTime(0);
      setIsTimerRunning(false);
      setFoundItems({});
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [selectedGame]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); // Update every 10ms
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleScoreUpdate = (points) => {
    setScore(prev => prev + points);
    setShowConfetti(true);
  };
  
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  const handleTargetClick = () => {
    const newTargets = [...targets];
    const nextTargetIndex = newTargets.findIndex(t => !t);
    
    if (nextTargetIndex !== -1) {
      newTargets[nextTargetIndex] = true;
      setTargets(newTargets);
      
      // If all targets hit
      if (nextTargetIndex === 2 || newTargets.every(t => t)) {
        handleScoreUpdate(games[0].points);
        setTimeout(() => {
          setTargets([false, false, false]);
        }, 1500);
      }
    }
  };
  
  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    handleScoreUpdate(games[1].points);
    
    // Check for Speed Demon achievement
    if (time < 300000) { // Less than 5 minutes
      const newAchievements = [...achievements];
      const speedDemonIndex = newAchievements.findIndex(a => a.id === 'speed-demon');
      if (speedDemonIndex !== -1) {
        newAchievements[speedDemonIndex] = {
          ...newAchievements[speedDemonIndex],
          unlocked: true
        };
      }
    }
  };
  
  const handleItemFound = (item, gameId, points) => {
    if (!foundItems[item]) {
      setFoundItems(prev => ({...prev, [item]: true}));
      handleScoreUpdate(points);
      
      // Check for Nature Explorer achievement if it's animal spotting
      if (gameId === 'animal-spotting') {
        const animalCount = Object.keys(foundItems).filter(key => key.startsWith('animal-')).length + 1;
        if (animalCount >= 5) {
          const newAchievements = [...achievements];
          const natureExplorerIndex = newAchievements.findIndex(a => a.id === 'nature-explorer');
          if (natureExplorerIndex !== -1) {
            newAchievements[natureExplorerIndex] = {
              ...newAchievements[natureExplorerIndex],
              unlocked: true
            };
          }
        }
      }
    }
  };

  const renderGameSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Choose a Game!</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="font-bold">{score} Points</span>
          </div>
          <div className="flex items-center bg-blue-100 px-4 py-2 rounded-full">
            <Trophy className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-bold">{streak} Streak</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`group relative overflow-hidden bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-${game.color}-200`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${game.color}-100 to-${game.color}-200 opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative flex items-center space-x-4">
              <div className={`p-4 rounded-full bg-${game.color}-100 group-hover:bg-${game.color}-200 transition-colors duration-300`}>
                {game.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">{game.name}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
                <p className="text-sm text-yellow-500 mt-1">Points: {game.points}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = (game) => {
    switch (game.id) {
      case 'target-challenge':
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">{game.name}</h3>
            <div className="bg-gray-100 p-6 rounded-xl mb-4">
              <p className="text-lg mb-4">Hit the target 3 times in a row!</p>
              <div className="flex justify-center space-x-4">
                {targets.map((hit, i) => (
                  <div key={i} className="relative">
                    <div className={`w-16 h-16 ${hit ? 'bg-red-500' : 'bg-white'} rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 ${hit ? 'scale-110' : ''}`}>
                      {hit ? '🎯' : '○'}
                    </div>
                    {hit && (
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleTargetClick}
              className={`px-8 py-3 ${targets.every(t => t) ? 'bg-green-500' : 'bg-red-500'} text-white rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              {targets.every(t => t) ? 'All Targets Hit!' : 'Hit Target!'}
            </button>
          </div>
        );

      case 'speed-challenge':
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">{game.name}</h3>
            <div className="bg-gray-100 p-6 rounded-xl mb-4">
              <p className="text-lg mb-4">Complete the course as fast as you can!</p>
              <div className={`text-5xl font-bold my-4 ${isTimerRunning ? 'text-blue-500' : 'text-gray-700'} ${isTimerRunning ? 'animate-pulse' : ''}`}>
                {formatTime(time)}
              </div>
            </div>
            {isTimerRunning ? (
              <button
                onClick={handleTimerComplete}
                className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Finish Course!
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Timer!
              </button>
            )}
          </div>
        );

      case 'treasure-hunt':
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">{game.name}</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                {icon: '🌳', id: 'treasure-tree'}, 
                {icon: '🏞️', id: 'treasure-landscape'}, 
                {icon: '🌊', id: 'treasure-water'}, 
                {icon: '🪨', id: 'treasure-rock'}, 
                {icon: '🌺', id: 'treasure-flower'}, 
                {icon: '🦋', id: 'treasure-butterfly'}
              ].map((treasure) => (
                <div
                  key={treasure.id}
                  className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${foundItems[treasure.id] ? 'border-2 border-yellow-400 bg-yellow-50' : ''}`}
                  onClick={() => handleItemFound(treasure.id, game.id, 15)}
                >
                  <span className="text-4xl">{treasure.icon}</span>
                  {foundItems[treasure.id] && <p className="text-sm mt-2 text-green-500">Found!</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'animal-spotting':
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">{game.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                {icon: '🦊', id: 'animal-fox'}, 
                {icon: '🐦', id: 'animal-bird'}, 
                {icon: '🦋', id: 'animal-butterfly'}, 
                {icon: '🐿️', id: 'animal-squirrel'}, 
                {icon: '🦆', id: 'animal-duck'}, 
                {icon: '🐇', id: 'animal-rabbit'}
              ].map((animal) => (
                <div
                  key={animal.id}
                  className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${foundItems[animal.id] ? 'border-2 border-green-400 bg-green-50' : ''}`}
                  onClick={() => handleItemFound(animal.id, game.id, 5)}
                >
                  <span className="text-4xl">{animal.icon}</span>
                  <p className="text-sm mt-2">
                    {foundItems[animal.id] ? (
                      <span className="text-green-500">Spotted!</span>
                    ) : (
                      "Click when you spot one!"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transform hover:scale-105 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Back
          </button>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
          {selectedGame ? (
            <div>
              <button
                onClick={() => setSelectedGame(null)}
                className="mb-4 text-blue-500 hover:text-blue-700 transform hover:scale-105 transition-all duration-300"
              >
                ← Back to Games
              </button>
              {renderGame(selectedGame)}
            </div>
          ) : (
            renderGameSelection()
          )}
        </div>

        <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl ${
                  achievement.unlocked ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
                } transform hover:scale-105 transition-all duration-300`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {achievement.icon}
                  <span className="font-semibold">{achievement.name}</span>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2 text-green-500 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span className="text-xs">Unlocked!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showConfetti && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-bounce">
              <Sparkles className="h-16 w-16 text-yellow-500" />
            </div>
            <div className="absolute top-1/4 left-1/4 animate-ping delay-75">
              <Star className="h-8 w-8 text-pink-500" />
            </div>
            <div className="absolute top-1/3 right-1/3 animate-ping delay-150">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-ping delay-300">
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsMode;