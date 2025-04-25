import React, { useState } from 'react';
import { Share2, BarChart2, PlusCircle } from 'lucide-react';
import CourseList from './CourseList';
import RoundTracker from './RoundTracker';
import PracticeMode from './PracticeMode';
import Statistics from './Statistics';
import ShareRound from './ShareRound';
import Achievements from './Achievements';
import { useCourses } from '../hooks/useCourses';
import { useRounds } from '../hooks/useRounds';
import { usePracticeStats } from '../hooks/usePracticeStats';

const DiscGolfTracker = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [selectedRoundForShare, setSelectedRoundForShare] = useState(null);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const { courses, addCourse } = useCourses();
  const { completedRounds } = useRounds();
  const { practiceStats } = usePracticeStats();

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

  const goBack = (screen) => {
    switch(screen) {
      case 'round':
        setCurrentRound(null);
        setSelectedCourse(null);
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
        setCurrentRound(null);
        setSelectedCourse(null);
        setShowPracticeMode(false);
        setShowAchievements(false);
        setShowStats(false);
        setShareMode(false);
        setShowNewCourseForm(false);
    }
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
      />
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
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

      <CourseList
        courses={courses}
        onStartRound={startRound}
        onAddCourse={() => setShowNewCourseForm(true)}
      />
    </div>
  );
};

export default DiscGolfTracker; 