import React, { useState } from 'react';
import { ChevronLeft, Users, Trophy, Calendar, Camera, Star, Target, Zap, Award, Smile, Heart, Sun, Cloud, Music, BookOpen } from 'lucide-react';

const FamilyMode = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [showChallengeDetails, setShowChallengeDetails] = useState(null);

  const familyMembers = [
    { id: 1, name: 'Mom', avatar: '👩', score: 120, achievements: 5 },
    { id: 2, name: 'Dad', avatar: '👨', score: 150, achievements: 8 },
    { id: 3, name: 'Emma', avatar: '👧', score: 80, achievements: 3 },
    { id: 4, name: 'Liam', avatar: '👦', score: 95, achievements: 4 }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Around the World',
      description: 'Complete throws from 5 different spots in your backyard',
      icon: <Target className="h-6 w-6" />,
      points: 50
    },
    {
      id: 2,
      title: 'Trick Shot Master',
      description: 'Record and share your best trick shot',
      icon: <Camera className="h-6 w-6" />,
      points: 75
    },
    {
      id: 3,
      title: 'Family Tournament',
      description: 'Compete in a family tournament',
      icon: <Trophy className="h-6 w-6" />,
      points: 100
    }
  ];

  const renderProfiles = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {familyMembers.map(member => (
        <div key={member.id} className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{member.avatar}</span>
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.achievements} achievements</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-500">{member.score}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChallenges = () => (
    <div className="grid grid-cols-1 gap-4">
      {challenges.map(challenge => (
        <div 
          key={challenge.id}
          onClick={() => setShowChallengeDetails(challenge)}
          className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform hover:scale-105 transition-transform"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-4">
              {challenge.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{challenge.title}</h3>
              <p className="text-sm text-gray-500">{challenge.description}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-bold text-yellow-500">{challenge.points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuickLinks = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: <BookOpen className="h-6 w-6" />, title: 'Rules Guide', color: 'bg-green-100' },
        { icon: <Sun className="h-6 w-6" />, title: 'Weather Check', color: 'bg-blue-100' },
        { icon: <Music className="h-6 w-6" />, title: 'Sound Effects', color: 'bg-purple-100' },
        { icon: <Calendar className="h-6 w-6" />, title: 'Events', color: 'bg-pink-100' }
      ].map((link, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
          <div className={`inline-flex items-center justify-center p-3 rounded-full ${link.color} mb-4`}>
            {link.icon}
          </div>
          <h3 className="text-lg font-semibold">{link.title}</h3>
        </div>
      ))}
    </div>
  );

  if (showChallengeDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowChallengeDetails(null)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold">{showChallengeDetails.title}</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                {showChallengeDetails.icon}
              </div>
              <div>
                <p className="text-gray-600">{showChallengeDetails.description}</p>
                <p className="text-yellow-500 font-bold mt-2">{showChallengeDetails.points} points</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium">
                Start Challenge
              </button>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium">
                Share with Family
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Family Mode</h1>
          <div className="w-10" />
        </div>

        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'profiles' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Family Profiles
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Trophy className="h-5 w-5 inline-block mr-2" />
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('quicklinks')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'quicklinks' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Star className="h-5 w-5 inline-block mr-2" />
              Quick Links
            </button>
          </div>

          {activeTab === 'profiles' && renderProfiles()}
          {activeTab === 'challenges' && renderChallenges()}
          {activeTab === 'quicklinks' && renderQuickLinks()}
        </div>
      </div>
    </div>
  );
};

export default FamilyMode; 