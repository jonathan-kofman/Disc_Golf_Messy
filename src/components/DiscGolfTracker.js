import React, { useState, useEffect, useCallback } from 'react';
import { Save, PlusCircle, Trash2, Flag, RotateCcw, Share2, BarChart2, ChevronLeft, Award, Target, Clock, Star, Zap, Loader, Disc, Trophy, ArrowRight, Users, Home } from 'lucide-react';
import CourseList from '../components/CourseList';
import RoundTracker from '../components/RoundTracker';
import PracticeMode from '../components/PracticeMode';
import Statistics from '../components/Statistics';
import ShareRound from '../components/ShareRound';
import Achievements from '../components/Achievements';
import FamilyMode from '../components/FamilyMode';
import BackyardDesigner from '../components/BackyardDesigner';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiIGZpbGw9IiNlOGY1ZjAiLz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 mb-4">
              <Disc className="h-8 w-8 text-green-600 animate-spin-slow" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Disc Golf</span>
              <span className="block text-green-600">Tracker</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track your rounds, improve your game, and connect with fellow disc golfers.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg transform hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 mb-2">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{courses.length}</h3>
            <p className="text-sm text-gray-500">Courses</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg transform hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{completedRounds.length}</h3>
            <p className="text-sm text-gray-500">Rounds Played</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg transform hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-100 mb-2">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{practiceStats.achievements.length}</h3>
            <p className="text-sm text-gray-500">Achievements</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg transform hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-100 mb-2">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">4</h3>
            <p className="text-sm text-gray-500">Family Members</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShareMode(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={completedRounds.length === 0}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <button 
              onClick={() => setShowStats(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={completedRounds.length === 0}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Stats
            </button>
            <button 
              onClick={() => setShowAchievements(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </button>
            <button 
              onClick={() => setShowFamilyMode(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Family Mode
            </button>
            <button 
              onClick={() => setShowNewCourseForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course
            </button>
          </div>
        </div>

        <CourseList
          courses={courses}
          onStartRound={startRound}
          onAddCourse={() => setShowNewCourseForm(true)}
          isLoading={coursesLoading}
          error={coursesError}
          onClearError={clearCoursesError}
        />

        {/* Practice Mode Card */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Practice Mode</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Improve your skills with targeted practice challenges
                </p>
              </div>
              <button
                onClick={() => setShowPracticeMode(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Start Practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Backyard Designer Card */}
        <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Backyard Course Designer</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your own backyard disc golf course
                </p>
              </div>
              <button
                onClick={() => setShowBackyardDesigner(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Design Course
                <Home className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscGolfTracker;