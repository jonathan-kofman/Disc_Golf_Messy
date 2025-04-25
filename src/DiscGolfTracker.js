import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Flag, RotateCcw, Share2, BarChart2, ChevronLeft, Award, Target, Clock, Star, Zap, Loader } from 'lucide-react';

const DiscGolfTracker = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Pine Valley', holes: [
      { id: 1, distance: 250, par: 3 },
      { id: 2, distance: 320, par: 3 },
      { id: 3, distance: 420, par: 4 },
      { id: 4, distance: 280, par: 3 },
      { id: 5, distance: 520, par: 4 }
    ]},
    { id: 2, name: 'Oak Ridge', holes: [
      { id: 1, distance: 280, par: 3 },
      { id: 2, distance: 350, par: 3 },
      { id: 3, distance: 460, par: 4 },
      { id: 4, distance: 210, par: 3 },
      { id: 5, distance: 540, par: 5 }
    ]},
    { id: 3, name: 'Backyard Practice', holes: [
      { id: 1, distance: 20, par: 1 },
      { id: 2, distance: 30, par: 1 },
      { id: 3, distance: 40, par: 1 },
      { id: 4, distance: 50, par: 2 },
      { id: 5, distance: 60, par: 2 }
    ]}
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [completedRounds, setCompletedRounds] = useState([]);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newHoles, setNewHoles] = useState([{ distance: 250, par: 3 }]);
  const [showStats, setShowStats] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [selectedRoundForShare, setSelectedRoundForShare] = useState(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [practiceMode, setPracticeMode] = useState(null);
  const [practiceStats, setPracticeStats] = useState({
    targetChallenge: {
      bestAccuracy: 0,
      gamesPlayed: 0,
      lastScore: 0
    },
    speedChallenge: {
      bestTime: null,
      gamesPlayed: 0,
      lastTime: null
    },
    consistencyChallenge: {
      bestStreak: 0,
      totalThrows: 0,
      gamesPlayed: 0
    },
    achievements: []
  });
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
      setCompletedRounds(JSON.parse(savedRounds));
    }
    
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
    
    if (savedPracticeStats) {
      setPracticeStats(JSON.parse(savedPracticeStats));
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
    
    setCompletedRounds([...completedRounds, currentRound]);
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
  const goBack = (screen) => {
    switch(screen) {
      case 'round':
        handleConfirmDialogOpen('Are you sure you want to go back? Your current round will be lost.', () => {
          setCurrentRound(null);
          setSelectedCourse(null);
        });
        break;
      case 'practice':
        setShowPracticeMode(false);
        break;
      case 'achievements':
        setShowAchievements(false);
        break;
      case 'stats':
        setShowStats(false);
        break;
      case 'share':
        setShareMode(false);
        setSelectedRoundForShare(null);
        break;
      case 'newCourse':
        setShowNewCourseForm(false);
        break;
      default:
        // Reset to main screen
        setCurrentRound(null);
        setSelectedCourse(null);
        setShowPracticeMode(false);
        setShowAchievements(false);
        setShowStats(false);
        setShareMode(false);
        setShowNewCourseForm(false);
    }
  };

  const addCourse = () => {
    if (newCourseName.trim() === '') {
      alert('Please enter a course name');
      return;
    }
    
    if (newHoles.length === 0) {
      alert('Please add at least one hole');
      return;
    }
    
    const newCourse = {
      id: Date.now(),
      name: newCourseName,
      holes: newHoles.map((hole, index) => ({
        id: index + 1,
        distance: parseInt(hole.distance) || 0,
        par: parseInt(hole.par) || 3
      }))
    };
    
    setCourses([...courses, newCourse]);
    setNewCourseName('');
    setNewHoles([{ distance: 250, par: 3 }]);
    setShowNewCourseForm(false);
  };

  const addHole = () => {
    setNewHoles([...newHoles, { distance: 250, par: 3 }]);
  };

  const updateHole = (index, field, value) => {
    const updatedHoles = [...newHoles];
    updatedHoles[index] = { ...updatedHoles[index], [field]: value };
    setNewHoles(updatedHoles);
  };

  const removeHole = (index) => {
    if (newHoles.length <= 1) {
      alert('Course must have at least one hole');
      return;
    }
    
    const updatedHoles = newHoles.filter((_, i) => i !== index);
    setNewHoles(updatedHoles);
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

  const formatRelativeScore = (throws, par) => {
    if (throws === 0) return '';
    const diff = throws - par;
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
  
  const getScoreEmoji = (throws, par) => {
    if (throws === 0) return '';
    const diff = throws - par;
    
    if (diff <= -3) return '🦅🦅';  // Albatross or better
    if (diff === -2) return '🦅';   // Eagle
    if (diff === -1) return '🐦';   // Birdie
    if (diff === 0) return '🟢';    // Par
    if (diff === 1) return '🟡';    // Bogey
    if (diff === 2) return '🟠';    // Double Bogey
    if (diff > 2) return '🔴';      // Triple Bogey or worse
    return '';
  };

  // Practice mode functions
  const startPracticeMode = (mode) => {
    if (mode === 'target') {
      setPracticeMode({
        type: 'target',
        throws: 0,
        hits: 0,
        totalThrows: 10,
        currentRound: 1,
        totalRounds: 3,
        roundScores: [],
        status: 'active'
      });
    } else if (mode === 'speed') {
      setPracticeMode({
        type: 'speed',
        startTime: Date.now(),
        throws: 0,
        hits: 0,
        goalHits: 5,
        status: 'active'
      });
    } else if (mode === 'consistency') {
      setPracticeMode({
        type: 'consistency',
        currentStreak: 0,
        bestStreak: 0,
        totalThrows: 0,
        status: 'active'
      });
    }
  };
  
  const recordPracticeThrow = (hit) => {
    if (!practiceMode) return;
    
    if (practiceMode.type === 'target') {
      const updatedMode = { ...practiceMode };
      updatedMode.throws += 1;
      if (hit) updatedMode.hits += 1;
      
      if (updatedMode.throws >= updatedMode.totalThrows) {
        // Round completed
        const accuracy = Math.round((updatedMode.hits / updatedMode.throws) * 100);
        updatedMode.roundScores.push(accuracy);
        
        if (updatedMode.currentRound >= updatedMode.totalRounds) {
          // All rounds completed
          const finalScore = Math.round(updatedMode.roundScores.reduce((sum, score) => sum + score, 0) / updatedMode.roundScores.length);
          
          // Update practice stats
          const updatedStats = { ...practiceStats };
          updatedStats.targetChallenge.gamesPlayed += 1;
          updatedStats.targetChallenge.lastScore = finalScore;
          
          if (finalScore > updatedStats.targetChallenge.bestAccuracy) {
            updatedStats.targetChallenge.bestAccuracy = finalScore;
            
            // Add achievement if it's the first time or a significant improvement
            if (finalScore >= 90 && !updatedStats.achievements.some(a => a.type === 'target-90')) {
              updatedStats.achievements.push({
                id: Date.now(),
                type: 'target-90',
                title: 'Sharpshooter',
                description: 'Achieve 90% accuracy in Target Challenge',
                date: new Date().toISOString(),
                icon: 'target'
              });
            }
          }
          
          setPracticeStats(updatedStats);
          updatedMode.status = 'completed';
          updatedMode.finalScore = finalScore;
        } else {
          // Start next round
          updatedMode.currentRound += 1;
          updatedMode.throws = 0;
          updatedMode.hits = 0;
        }
      }
      
      setPracticeMode(updatedMode);
    } else if (practiceMode.type === 'speed') {
      const updatedMode = { ...practiceMode };
      updatedMode.throws += 1;
      if (hit) updatedMode.hits += 1;
      
      if (updatedMode.hits >= updatedMode.goalHits) {
        // Challenge completed
        const endTime = Date.now();
        const timeElapsed = (endTime - updatedMode.startTime) / 1000; // in seconds
        
        // Update practice stats
        const updatedStats = { ...practiceStats };
        updatedStats.speedChallenge.gamesPlayed += 1;
        updatedStats.speedChallenge.lastTime = timeElapsed;
        
        if (updatedStats.speedChallenge.bestTime === null || timeElapsed < updatedStats.speedChallenge.bestTime) {
          updatedStats.speedChallenge.bestTime = timeElapsed;
          
          // Add achievement for speed improvement
          if (timeElapsed < 30 && !updatedStats.achievements.some(a => a.type === 'speed-30')) {
            updatedStats.achievements.push({
              id: Date.now(),
              type: 'speed-30',
              title: 'Quick Draw',
              description: 'Complete Speed Challenge in under 30 seconds',
              date: new Date().toISOString(),
              icon: 'clock'
            });
          }
        }
        
        setPracticeStats(updatedStats);
        updatedMode.status = 'completed';
        updatedMode.finalTime = timeElapsed;
      }
      
      setPracticeMode(updatedMode);
    } else if (practiceMode.type === 'consistency') {
      const updatedMode = { ...practiceMode };
      updatedMode.totalThrows += 1;
      
      if (hit) {
        updatedMode.currentStreak += 1;
        if (updatedMode.currentStreak > updatedMode.bestStreak) {
          updatedMode.bestStreak = updatedMode.currentStreak;
        }
      } else {
        updatedMode.currentStreak = 0;
      }
      
      setPracticeMode(updatedMode);
    }
  };
  
  const finishConsistencyChallenge = () => {
    if (practiceMode && practiceMode.type === 'consistency') {
      const updatedStats = { ...practiceStats };
      updatedStats.consistencyChallenge.gamesPlayed += 1;
      updatedStats.consistencyChallenge.totalThrows += practiceMode.totalThrows;
      
      if (practiceMode.bestStreak > updatedStats.consistencyChallenge.bestStreak) {
        updatedStats.consistencyChallenge.bestStreak = practiceMode.bestStreak;
        
        // Add achievements based on streak milestones
        if (practiceMode.bestStreak >= 10 && !updatedStats.achievements.some(a => a.type === 'streak-10')) {
          updatedStats.achievements.push({
            id: Date.now(),
            type: 'streak-10',
            title: 'Streak Master',
            description: 'Achieve a streak of 10 consecutive hits',
            date: new Date().toISOString(),
            icon: 'zap'
          });
        }
      }
      
      setPracticeStats(updatedStats);
      
      const updatedMode = { ...practiceMode };
      updatedMode.status = 'completed';
      setPracticeMode(updatedMode);
    }
  };
  
  const resetPractice = () => {
    setPracticeMode(null);
  };
  
  // Check for total throws achievement
  useEffect(() => {
    const totalThrows = completedRounds.reduce((sum, round) => {
      return sum + round.scores.reduce((holeSum, score) => holeSum + score.throws, 0);
    }, 0) + practiceStats.consistencyChallenge.totalThrows;
    
    // Add achievement for 100 throws
    if (totalThrows >= 100 && 
        !practiceStats.achievements.some(a => a.type === 'throws-100')) {
      const updatedStats = { ...practiceStats };
      updatedStats.achievements.push({
        id: Date.now(),
        type: 'throws-100',
        title: 'Century Thrower',
        description: 'Complete 100 total throws',
        date: new Date().toISOString(),
        icon: 'award'
      });
      setPracticeStats(updatedStats);
    }
  }, [completedRounds, practiceStats]);
  
  // Statistics calculation functions
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
    
    // Course specific stats
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
      
      // Track course-specific stats
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
      
      // Track best overall round
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
    
    // Calculate averages
    const averageThrowsPerHole = totalHoles > 0 ? (totalThrows / totalHoles).toFixed(2) : 0;
    averageRoundScore = completedRounds.length > 0 ? ((totalThrows - totalPar) / completedRounds.length).toFixed(2) : 0;
    
    // Format course stats
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
  
  // Generate shareable content
  const generateShareText = (round) => {
    if (!round) return '';
    
    const totalThrows = getTotalScore(round.scores);
    const totalPar = getTotalPar(round.scores);
    const relativeToPar = getScoreRelativeToPar(round.scores);
    
    let shareText = `🥏 Disc Golf Round at ${round.courseName} 🥏\n`;
    shareText += `Date: ${new Date(round.date).toLocaleDateString()}\n`;
    shareText += `Final Score: ${relativeToPar} (${totalThrows} throws)\n\n`;
    
    shareText += `Hole-by-hole:\n`;
    round.scores.forEach(score => {
      const scoreEmoji = getScoreEmoji(score.throws, score.par);
      shareText += `Hole ${score.holeId} (${score.distance}ft, Par ${score.par}): ${score.throws} ${scoreEmoji}\n`;
    });
    
    shareText += `\nTracked with Disc Golf Tracker App`;
    
    return shareText;
  };
  
  // Create a Confirmation Dialog component
  const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
  
  // Practice mode UI
  if (showPracticeMode) {
    if (practiceMode) {
      // Currently in a practice challenge
      return (
        <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center mb-4">
            <button 
              onClick={resetPractice}
              className="mr-2 bg-gray-200 p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">
              {practiceMode.type === 'target' && 'Target Challenge'}
              {practiceMode.type === 'speed' && 'Speed Challenge'}
              {practiceMode.type === 'consistency' && 'Consistency Challenge'}
            </h1>
          </div>
          
          {practiceMode.status === 'active' ? (
            <div className="bg-white rounded-lg p-4 shadow mb-4">
              {practiceMode.type === 'target' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Round</p>
                      <p className="text-xl font-bold">{practiceMode.currentRound} of {practiceMode.totalRounds}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Throws</p>
                      <p className="text-xl font-bold">{practiceMode.throws} of {practiceMode.totalThrows}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hits</p>
                      <p className="text-xl font-bold">{practiceMode.hits}</p>
                    </div>
                  </div>
                  
                  <p className="text-center mb-6">Aim for the target! Record each throw.</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => recordPracticeThrow(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Hit!
                    </button>
                    <button 
                      onClick={() => recordPracticeThrow(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Miss
                    </button>
                  </div>
                  
                  {practiceMode.roundScores.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold mb-2">Previous Rounds:</h3>
                      {practiceMode.roundScores.map((score, i) => (
                        <div key={i} className="flex justify-between items-center border-b py-2 last:border-b-0">
                          <span>Round {i + 1}:</span>
                          <span className="font-bold">{score}% accuracy</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {practiceMode.type === 'speed' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Hits</p>
                      <p className="text-xl font-bold">{practiceMode.hits} of {practiceMode.goalHits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Throws</p>
                      <p className="text-xl font-bold">{practiceMode.throws}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timer</p>
                      <p className="text-xl font-bold">
                        <Clock size={20} className="inline mr-1" /> Running...
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-center mb-6">Hit the target {practiceMode.goalHits} times as fast as you can!</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => recordPracticeThrow(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Hit!
                    </button>
                    <button 
                      onClick={() => recordPracticeThrow(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Miss
                    </button>
                  </div>
                </div>
              )}
              
              {practiceMode.type === 'consistency' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Streak</p>
                      <p className="text-xl font-bold">{practiceMode.currentStreak}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Best Streak</p>
                      <p className="text-xl font-bold">{practiceMode.bestStreak}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Throws</p>
                      <p className="text-xl font-bold">{practiceMode.totalThrows}</p>
                    </div>
                  </div>
                  
                  <p className="text-center mb-6">How many targets can you hit in a row?</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => recordPracticeThrow(true)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Hit!
                    </button>
                    <button 
                      onClick={() => recordPracticeThrow(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium flex-1"
                    >
                      Miss
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button 
                      onClick={finishConsistencyChallenge}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Finish Practice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Practice completed
            <div className="bg-white rounded-lg p-4 shadow mb-4">
              <h2 className="text-xl font-bold text-center mb-4">Challenge Complete!</h2>
              
              {practiceMode.type === 'target' && (
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-500 mb-2">{practiceMode.finalScore}%</div>
                  <p className="text-lg">Accuracy</p>
                  
                  <div className="flex justify-center space-x-8 mt-6">
                    <div>
                      <p className="text-sm text-gray-500">Best</p>
                      <p className="text-xl font-bold">{practiceStats.targetChallenge.bestAccuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Games</p>
                      <p className="text-xl font-bold">{practiceStats.targetChallenge.gamesPlayed}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {practiceMode.type === 'speed' && (
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-500 mb-2">{practiceMode.finalTime.toFixed(2)}</div>
                  <p className="text-lg">Seconds</p>
                  
                  <div className="flex justify-center space-x-8 mt-6">
                    <div>
                      <p className="text-sm text-gray-500">Best Time</p>
                      <p className="text-xl font-bold">
                        {practiceStats.speedChallenge.bestTime ? practiceStats.speedChallenge.bestTime.toFixed(2) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Games</p>
                      <p className="text-xl font-bold">{practiceStats.speedChallenge.gamesPlayed}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {practiceMode.type === 'consistency' && (
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-500 mb-2">{practiceMode.bestStreak}</div>
                  <p className="text-lg">Best Streak</p>
                  
                  <div className="flex justify-center space-x-8 mt-6">
                    <div>
                      <p className="text-sm text-gray-500">All-Time Best</p>
                      <p className="text-xl font-bold">{practiceStats.consistencyChallenge.bestStreak}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Throws</p>
                      <p className="text-xl font-bold">{practiceStats.consistencyChallenge.totalThrows}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => startPracticeMode(practiceMode.type)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Try Again
                </button>
                <button 
                  onClick={resetPractice}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                >
                  Back to Practice Menu
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Practice mode selection
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => goBack('practice')}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Practice Challenges</h1>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Target size={24} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Target Challenge</h2>
                  <p className="text-sm text-gray-500">Improve your accuracy</p>
                </div>
              </div>
              <button 
                onClick={() => startPracticeMode('target')}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Start
              </button>
            </div>
            {practiceStats.targetChallenge.gamesPlayed > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Best Accuracy</span>
                  <span className="font-bold">{practiceStats.targetChallenge.bestAccuracy}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <Clock size={24} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Speed Challenge</h2>
                  <p className="text-sm text-gray-500">Hit 5 targets as fast as you can</p>
                </div>
              </div>
              <button 
                onClick={() => startPracticeMode('speed')}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Start
              </button>
            </div>
            {practiceStats.speedChallenge.gamesPlayed > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Best Time</span>
                  <span className="font-bold">
                    {practiceStats.speedChallenge.bestTime ? `${practiceStats.speedChallenge.bestTime.toFixed(2)}s` : '-'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-3">
                  <Zap size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Consistency Challenge</h2>
                  <p className="text-sm text-gray-500">Build your longest streak</p>
                </div>
              </div>
              <button 
                onClick={() => startPracticeMode('consistency')}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Start
              </button>
            </div>
            {practiceStats.consistencyChallenge.gamesPlayed > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Best Streak</span>
                  <span className="font-bold">{practiceStats.consistencyChallenge.bestStreak}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => setShowAchievements(true)}
            className="w-full bg-purple-500 text-white p-3 rounded-lg flex items-center justify-center font-medium"
          >
            <Award size={18} className="mr-2" /> View Achievements
          </button>
        </div>
      </div>
    );
  }
  
  if (showAchievements) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setShowPracticeMode(false)}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>
        
        {practiceStats.achievements.length > 0 ? (
          <div className="space-y-3">
            {practiceStats.achievements.map(achievement => (
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
  }

  // Share functions
  const shareRound = (round) => {
    const shareText = generateShareText(round);
    
    if (navigator.share) {
      navigator.share({
        title: `Disc Golf Round at ${round.courseName}`,
        text: shareText
      }).catch(error => {
        console.error('Error sharing:', error);
        fallbackShare(shareText);
      });
    } else {
      fallbackShare(shareText);
    }
  };
  
  const fallbackShare = (text) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);
    
    alert('Round details copied to clipboard! You can now paste and share it.');
  };

  if (showStats) {
    const stats = calculateStats();
    
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => goBack('stats')}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Your Statistics</h1>
        </div>
        
        {stats ? (
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
        ) : (
          <div className="bg-white rounded-lg p-6 shadow text-center">
            <p className="text-gray-500">No completed rounds yet. Play a round to see your stats!</p>
          </div>
        )}
      </div>
    );
  }
  
  if (shareMode) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => goBack('share')}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Share Round</h1>
        </div>
        
        {selectedRoundForShare ? (
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-3">
              Round at {selectedRoundForShare.courseName}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {new Date(selectedRoundForShare.date).toLocaleDateString()}
            </p>
            
            <div className="bg-blue-50 p-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Final Score:</span>
                <span className="font-bold">{getScoreRelativeToPar(selectedRoundForShare.scores)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Throws:</span>
                <span className="font-bold">{getTotalScore(selectedRoundForShare.scores)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Hole by Hole:</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedRoundForShare.scores.map(score => (
                  <div key={score.holeId} className="border p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hole {score.holeId}</span>
                      <span className={`text-sm font-medium ${
                        score.throws < score.par ? 'text-green-500' : 
                        score.throws > score.par ? 'text-red-500' : 'text-gray-500'
                      }`}>{getScoreEmoji(score.throws, score.par)}</span>
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
              onClick={() => shareRound(selectedRoundForShare)}
              className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center font-medium"
            >
              <Share2 size={18} className="mr-2" /> Share This Round
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-3">Select a Round to Share</h2>
            
            {completedRounds.length > 0 ? (
              <div className="space-y-3">
                {completedRounds.slice().reverse().map((round, index) => (
                  <div 
                    key={index} 
                    className="border p-3 rounded cursor-pointer hover:bg-blue-50"
                    onClick={() => setSelectedRoundForShare(round)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{round.courseName}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(round.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{getScoreRelativeToPar(round.scores)}</p>
                        <p className="text-sm text-gray-500">
                          {getTotalScore(round.scores)} throws
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
        )}
      </div>
    );
  }

  if (currentRound) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="flex items-center mb-2">
            <button 
              onClick={() => goBack('round')}
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
                onClick={cancelRound}
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
  }

  if (showNewCourseForm) {
    return (
      <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => goBack('newCourse')}
            className="mr-2 bg-gray-200 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4">Add New Course</h2>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter course name"
            />
          </div>
          
          <h3 className="font-medium mb-2">Holes</h3>
          
          {newHoles.map((hole, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div className="w-8 text-center">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              
              <div className="flex-grow">
                <input
                  type="number"
                  value={hole.distance}
                  onChange={(e) => updateHole(index, 'distance', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Distance (ft)"
                />
              </div>
              
              <div className="w-16">
                <input
                  type="number"
                  value={hole.par}
                  onChange={(e) => updateHole(index, 'par', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Par"
                  min="1"
                  max="7"
                />
              </div>
              
              <button 
                onClick={() => removeHole(index)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={addHole}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center text-sm"
            >
              <PlusCircle size={16} className="mr-1" /> Add Hole
            </button>
            
            <div className="space-x-2">
              <button 
                onClick={() => setShowNewCourseForm(false)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
              
              <button 
                onClick={addCourse}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
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
      
      {completedRounds.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Recent Rounds</h2>
            {completedRounds.length > 5 && (
              <button 
                onClick={() => setShareMode(true)}
                className="text-blue-500 text-sm font-medium"
              >
                View All
              </button>
            )}
          </div>
          <div className="space-y-3">
            {completedRounds.slice().reverse().slice(0, 5).map((round, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{round.courseName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(round.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{getScoreRelativeToPar(round.scores)}</p>
                    <p className="text-sm text-gray-500">
                      {getTotalScore(round.scores)} throws
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={() => {
                      setSelectedRoundForShare(round);
                      setShareMode(true);
                    }}
                    className="text-blue-500 text-sm font-medium flex items-center"
                  >
                    <Share2 size={14} className="mr-1" /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscGolfTracker;