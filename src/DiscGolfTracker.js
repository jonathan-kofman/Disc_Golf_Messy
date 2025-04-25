import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Flag, RotateCcw, Share2, BarChart2, ChevronLeft, Award, Target, Clock, Star, Zap, Loader } from 'lucide-react';
import CourseList from './components/CourseList';
import RoundTracker from './components/RoundTracker';
import PracticeMode from './components/PracticeMode';
import Statistics from './components/Statistics';
import ShareRound from './components/ShareRound';
import Achievements from './components/Achievements';
import { useCourses } from './hooks/useCourses';
import { useRounds } from './hooks/useRounds';
import { usePracticeStats } from './hooks/usePracticeStats';

const DiscGolfTracker = () => {
  const { courses, addCourse } = useCourses();
  const { completedRounds, addRound } = useRounds();
  const { practiceStats, updateStats } = usePracticeStats();
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [selectedRoundForShare, setSelectedRoundForShare] = useState(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Add state for confirmation dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedRounds = localStorage.getItem('completedRounds');
    const savedCourses = localStorage.getItem('courses');
    const savedPracticeStats = localStorage.getItem('practiceStats');
    
    if (savedRounds) {
      completedRounds(JSON.parse(savedRounds));
    }
    
    if (savedCourses) {
      courses(JSON.parse(savedCourses));
    }
    
    if (savedPracticeStats) {
      practiceStats(JSON.parse(savedPracticeStats));
    }
  }, []);

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
  const goBack = () => {
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
    return (
      <PracticeMode 
        onBack={goBack}
        onUpdateStats={updateStats}
      />
    );
  }

  if (showAchievements) {
    return (
      <Achievements 
        achievements={practiceStats.achievements}
        onBack={goBack}
      />
    );
  }

  if (showStats) {
    return (
      <Statistics 
        stats={calculateStats()}
        onBack={goBack}
      />
    );
  }

  if (shareMode) {
    return (
      <ShareRound 
        selectedRound={selectedRoundForShare}
        completedRounds={completedRounds}
        onBack={goBack}
        onShare={(round) => {
          const shareText = `Disc Golf Round at ${round.courseName}\nDate: ${new Date(round.date).toLocaleDateString()}\nScore: ${round.scores.reduce((total, hole) => total + hole.throws, 0)} throws\n\nHole-by-hole:\n${round.scores.map(score => `Hole ${score.holeId}: ${score.throws} throws`).join('\n')}`;
          navigator.clipboard.writeText(shareText);
        }}
      />
    );
  }

  if (currentRound) {
    return (
      <RoundTracker 
        round={currentRound}
        onBack={goBack}
        onFinish={(updatedRound) => {
          addRound(updatedRound);
          setCurrentRound(null);
          setSelectedCourse(null);
        }}
      />
    );
  }

  if (showNewCourseForm) {
    return (
      <CourseList 
        onBack={goBack}
        onAddCourse={addCourse}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p className="mb-4">{confirmMessage}</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Disc Golf Tracker</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShareMode(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center text-sm"
            disabled={completedRounds.length === 0}
          >
            <Share2 size={16} className="mr-1" /> Share
          </button>
          <button 
            onClick={() => setShowStats(true)}
            className="bg-purple-500 text-white px-3 py-1 rounded flex items-center text-sm"
            disabled={completedRounds.length === 0}
          >
            <BarChart2 size={16} className="mr-1" /> Stats
          </button>
          <button 
            onClick={() => setShowNewCourseForm(true)}
            className="bg-green-500 text-white px-3 py-1 rounded flex items-center text-sm"
          >
            <PlusCircle size={16} className="mr-1" /> Add
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">Practice Mode</h2>
          <button 
            onClick={() => setShowPracticeMode(true)}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Start Practice
          </button>
        </div>
        <p className="text-sm text-gray-500">Perfect your skills with target practice!</p>
        
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-sm text-gray-500">Target</div>
            <div className="font-bold">{practiceStats.targetChallenge.bestAccuracy > 0 ? `${practiceStats.targetChallenge.bestAccuracy}%` : '-'}</div>
          </div>
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-sm text-gray-500">Speed</div>
            <div className="font-bold">{practiceStats.speedChallenge.bestTime ? `${practiceStats.speedChallenge.bestTime.toFixed(1)}s` : '-'}</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center">
            <div className="text-sm text-gray-500">Streak</div>
            <div className="font-bold">{practiceStats.consistencyChallenge.bestStreak || '-'}</div>
          </div>
        </div>
        
        {practiceStats.achievements.length > 0 && (
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center">
              <Award size={16} className="text-yellow-500 mr-1" />
              <span className="text-sm">{practiceStats.achievements.length} Achievement{practiceStats.achievements.length !== 1 ? 's' : ''}</span>
            </div>
            <button 
              onClick={() => setShowAchievements(true)}
              className="text-blue-500 text-sm"
            >
              View All
            </button>
          </div>
        )}
      </div>
      
      {courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{course.name}</h2>
                  <p className="text-sm text-gray-500">{course.holes.length} holes</p>
                </div>
                <button 
                  onClick={() => startRound(course)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Start Round
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow text-center">
          <p className="text-gray-500 mb-4">No courses added yet.</p>
          <button 
            onClick={() => setShowNewCourseForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscGolfTracker;