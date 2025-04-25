import React, { useState, useEffect, useCallback } from 'react';
import { Save, PlusCircle, Trash2, Flag, RotateCcw, Share2, BarChart2, ChevronLeft, Award, Target, Clock, Star, Zap, Loader, Disc, Trophy, ArrowRight, Users, Home, Smile, Sparkles, Activity, Map, Gamepad2, Leaf } from 'lucide-react';
import CourseList from '../components/CourseList';
import RoundTracker from '../components/RoundTracker';
import PracticeMode from '../components/PracticeMode';
import Statistics from '../components/Statistics';
import ShareRound from '../components/ShareRound';
import Achievements from '../components/Achievements';
import FamilyMode from '../components/FamilyMode';
import BackyardDesigner from '../components/BackyardDesigner';
import KidsMode from '../components/KidsMode';
import ThreeDScene from '../components/ThreeDScene'; // Import the ThreeDScene component
import useCourses from '../hooks/useCourses';
import useRounds from '../hooks/useRounds';
import usePracticeStats from '../hooks/usePracticeStats';

const DiscGolfTracker = () => {
  const { courses = [], addCourse, coursesLoading, coursesError, clearCoursesError } = useCourses();
  const { completedRounds = [], addRound } = useRounds();
  const { practiceStats = {
    targetChallenge: { bestAccuracy: 0, gamesPlayed: 0, lastScore: 0 },
    speedChallenge: { bestTime: null, gamesPlayed: 0, lastTime: null },
    consistencyChallenge: { bestStreak: 0, totalThrows: 0, gamesPlayed: 0 },
    achievements: []
  }, updateStats } = usePracticeStats();
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [selectedRoundForShare, setSelectedRoundForShare] = useState(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFamilyMode, setShowFamilyMode] = useState(false);
  const [showBackyardDesigner, setShowBackyardDesigner] = useState(false);
  const [showKidsMode, setShowKidsMode] = useState(false);

  // Add state for confirmation dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedRounds = localStorage.getItem('completedRounds');
      const savedCourses = localStorage.getItem('courses');
      const savedPracticeStats = localStorage.getItem('practiceStats');
      
      if (savedRounds) {
        const parsedRounds = JSON.parse(savedRounds);
        if (Array.isArray(parsedRounds)) {
          parsedRounds.forEach(round => addRound(round));
        }
      }
      
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedCourses)) {
          parsedCourses.forEach(course => addCourse(course));
        }
      }
      
      if (savedPracticeStats) {
        const parsedStats = JSON.parse(savedPracticeStats);
        if (parsedStats && typeof parsedStats === 'object') {
          updateStats(parsedStats);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [addRound, addCourse, updateStats]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedRounds', JSON.stringify(completedRounds));
  }, [completedRounds]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('practiceStats', JSON.stringify(practiceStats));
  }, [practiceStats]);

  // Confirmation dialog handlers
  const handleConfirmDialogOpen = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
  };

  const startRound = (course) => {
    setSelectedCourse(course);
    setCurrentRound({
      courseId: course.id,
      courseName: course.name,
      date: new Date().toISOString(),
      scores: course.holes.map(hole => ({
        holeId: hole.id,
        distance: hole.distance,
        par: hole.par,
        throws: 0
      }))
    });
  };

  const updateScore = (holeIndex, change) => {
    if (!currentRound) return;
    
    const newScores = [...currentRound.scores];
    const newThrows = Math.max(0, newScores[holeIndex].throws + change);
    newScores[holeIndex] = { ...newScores[holeIndex], throws: newThrows };
    
    setCurrentRound({
      ...currentRound,
      scores: newScores
    });
  };

  const finishRound = () => {
    if (!currentRound) return;
    
    // Check if all holes have scores
    const allHolesScored = currentRound.scores.every(score => score.throws > 0);
    
    if (!allHolesScored) {
      alert('Please enter scores for all holes before finishing the round.');
      return;
    }
    
    addRound({ ...currentRound, scores: currentRound.scores });
    setCurrentRound(null);
    setSelectedCourse(null);
  };

  const cancelRound = () => {
    handleConfirmDialogOpen('Are you sure you want to cancel this round? All scores will be lost.', () => {
      setCurrentRound(null);
      setSelectedCourse(null);
    });
  };
  
  // Add this function to handle back navigation from all screens
  const goBack = (source) => {
    if (currentRound) {
      handleConfirmDialogOpen('Are you sure you want to go back? Your current round will be lost.', () => {
        setCurrentRound(null);
        setSelectedCourse(null);
      });
    } else if (showNewCourseForm) {
      setShowNewCourseForm(false);
    } else if (showStats) {
      setShowStats(false);
    } else if (shareMode) {
      setShareMode(false);
      setSelectedRoundForShare(null);
    } else if (showPracticeMode) {
      setShowPracticeMode(false);
    } else if (showAchievements) {
      setShowAchievements(false);
    } else if (showFamilyMode) {
      setShowFamilyMode(false);
    } else if (showBackyardDesigner) {
      setShowBackyardDesigner(false);
    } else if (showKidsMode) {
      setShowKidsMode(false);
    }
  };

  const calculateStats = () => {
    if (completedRounds.length === 0) return null;
    
    let totalHoles = 0;
    let totalThrows = 0;
    let totalPar = 0;
    let birdies = 0;
    let eagles = 0;
    let albatrosses = 0;
    let pars = 0;
    let bogeys = 0;
    let doubleBogeys = 0;
    let tripleBogeyPlus = 0;
    let bestRound = null;
    let averageRoundScore = 0;
    
    const courseStats = {};
    
    completedRounds.forEach(round => {
      let roundTotalThrows = 0;
      let roundTotalPar = 0;
      
      round.scores.forEach(score => {
        totalHoles++;
        totalThrows += score.throws;
        totalPar += score.par;
        roundTotalThrows += score.throws;
        roundTotalPar += score.par;
        
        const diff = score.throws - score.par;
        if (diff <= -3) albatrosses++;
        else if (diff === -2) eagles++;
        else if (diff === -1) birdies++;
        else if (diff === 0) pars++;
        else if (diff === 1) bogeys++;
        else if (diff === 2) doubleBogeys++;
        else if (diff > 2) tripleBogeyPlus++;
      });
      
      if (!courseStats[round.courseId]) {
        courseStats[round.courseId] = {
          name: round.courseName,
          roundCount: 0,
          totalThrows: 0,
          totalPar: 0,
          bestScore: null
        };
      }
      
      courseStats[round.courseId].roundCount++;
      courseStats[round.courseId].totalThrows += roundTotalThrows;
      courseStats[round.courseId].totalPar += roundTotalPar;
      
      const roundScore = roundTotalThrows - roundTotalPar;
      if (courseStats[round.courseId].bestScore === null || roundScore < courseStats[round.courseId].bestScore) {
        courseStats[round.courseId].bestScore = roundScore;
      }
      
      if (bestRound === null || roundScore < bestRound.score) {
        bestRound = {
          courseId: round.courseId,
          courseName: round.courseName,
          date: round.date,
          score: roundScore,
          throws: roundTotalThrows
        };
      }
    });
    
    const averageThrowsPerHole = totalHoles > 0 ? (totalThrows / totalHoles).toFixed(2) : 0;
    averageRoundScore = completedRounds.length > 0 ? ((totalThrows - totalPar) / completedRounds.length).toFixed(2) : 0;
    
    const formattedCourseStats = Object.keys(courseStats).map(courseId => {
      const stat = courseStats[courseId];
      return {
        id: courseId,
        name: stat.name,
        roundCount: stat.roundCount,
        averageScore: stat.roundCount > 0 ? ((stat.totalThrows - stat.totalPar) / stat.roundCount).toFixed(2) : 0,
        bestScore: stat.bestScore === 0 ? 'E' : (stat.bestScore > 0 ? `+${stat.bestScore}` : stat.bestScore)
      };
    });
    
    return {
      totalRounds: completedRounds.length,
      totalHoles,
      totalThrows,
      averageThrowsPerHole,
      averageRoundScore: averageRoundScore === '0.00' ? 'E' : (averageRoundScore > 0 ? `+${averageRoundScore}` : averageRoundScore),
      scoreCounts: {
        albatrosses,
        eagles,
        birdies,
        pars,
        bogeys,
        doubleBogeys,
        tripleBogeyPlus
      },
      bestRound: bestRound ? {
        ...bestRound,
        score: bestRound.score === 0 ? 'E' : (bestRound.score > 0 ? `+${bestRound.score}` : bestRound.score),
        date: new Date(bestRound.date).toLocaleDateString()
      } : null,
      courseStats: formattedCourseStats
    };
  };

  const renderMainMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 3D Background Scene */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <ThreeDScene sceneUrl="https://prod.spline.design/your-main-menu-scene" />
        </div>

        {/* Hero Section with Animated Background */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiIGZpbGw9IiNlOGY1ZjAiLz48L2c+PC9zdmc+')] opacity-10 animate-pulse"></div>
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-bounce">
              <Disc className="h-12 w-12 text-green-600 animate-spin-slow" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              <span className="block">Disc Golf</span>
              <span className="block text-green-600">Tracker</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your rounds, improve your game, and connect with fellow disc golfers.
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center p-3 rounded-full bg-green-100 mb-4">
              <Flag className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">{courses.length}</h3>
            <p className="text-sm text-gray-600 text-center">Courses</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">{completedRounds.length}</h3>
            <p className="text-sm text-gray-600 text-center">Rounds Played</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center p-3 rounded-full bg-purple-100 mb-4">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">{practiceStats.achievements.length}</h3>
            <p className="text-sm text-gray-600 text-center">Achievements</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center p-3 rounded-full bg-yellow-100 mb-4">
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center">4</h3>
            <p className="text-sm text-gray-600 text-center">Family Members</p>
          </div>
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setShowNewCourseForm(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Flag className="h-8 w-8 text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Courses</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Browse and manage your courses</p>
            </div>
          </button>

          <button
            onClick={() => setShowPracticeMode(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Practice Mode</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Improve your skills</p>
            </div>
          </button>

          <button
            onClick={() => setShowFamilyMode(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-purple-100 mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Family Mode</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Play together as a family</p>
            </div>
          </button>

          <button
            onClick={() => setShowKidsMode(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-yellow-100 mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                <Smile className="h-8 w-8 text-yellow-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Kids Mode</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Fun games for young players</p>
            </div>
          </button>

          <button
            onClick={() => setShowBackyardDesigner(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-red-100 mb-4 group-hover:bg-red-200 transition-colors duration-300">
                <Home className="h-8 w-8 text-red-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Backyard Designer</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Create your own course</p>
            </div>
          </button>

          <button
            onClick={() => setShowStats(true)}
            className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <div className="p-4 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors duration-300">
                <BarChart2 className="h-8 w-8 text-indigo-600" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Statistics</span>
              <p className="text-sm text-gray-600 mt-2 text-center">Track your progress</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  if (showPracticeMode) {
    return <PracticeMode onBack={() => goBack('practice')} />;
  }

  if (showAchievements) {
    return <Achievements onBack={() => goBack('achievements')} />;
  }

  if (showStats) {
    return <Statistics onBack={() => goBack('stats')} />;
  }

  if (shareMode) {
    return (
      <ShareRound
        selectedRound={selectedRoundForShare}
        onBack={() => goBack('share')}
      />
    );
  }

  if (currentRound) {
    return (
      <RoundTracker
        round={currentRound}
        onBack={() => goBack('round')}
      />
    );
  }

  if (showNewCourseForm) {
    return (
      <CourseList
        onAddCourse={addCourse}
        onBack={() => goBack('newCourse')}
        isLoading={coursesLoading}
        error={coursesError}
        onClearError={clearCoursesError}
      />
    );
  }

  if (showFamilyMode) {
    return <FamilyMode onBack={() => goBack('family')} />;
  }

  if (showBackyardDesigner) {
    return <BackyardDesigner onBack={() => goBack('designer')} />;
  }

  if (showKidsMode) {
    return <KidsMode onBack={() => goBack('kids')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {showNewCourseForm ? (
          <CourseList
            onBack={() => goBack('newCourse')}
            onSelectCourse={startRound}
            onAddCourse={() => setShowNewCourseForm(true)}
          />
        ) : showPracticeMode ? (
          <PracticeMode onBack={() => goBack('practice')} />
        ) : showFamilyMode ? (
          <FamilyMode onBack={() => goBack('family')} />
        ) : showKidsMode ? (
          <KidsMode onBack={() => goBack('kids')} />
        ) : showBackyardDesigner ? (
          <BackyardDesigner onBack={() => goBack('designer')} />
        ) : showStats ? (
          <Statistics onBack={() => goBack('stats')} />
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Disc Golf Tracker</h1>
            {renderMainMenu()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscGolfTracker;