import React, { useState } from 'react';
import { ChevronLeft, Users, Trophy, Calendar, Camera, Star, Target, Zap, Award, Smile, Heart, Sun, Cloud, Music, BookOpen, Map, Trash2, Edit, Plus, User, Save, X } from 'lucide-react';

const FamilyMode = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [showChallengeDetails, setShowChallengeDetails] = useState(null);
  const [showResourceDetails, setShowResourceDetails] = useState(null);
  const [familyRules, setFamilyRules] = useState([]);
  const [newRule, setNewRule] = useState('');
  const [selectedSound, setSelectedSound] = useState('Classic Chain Rattle');
  
  // State for confirmation dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  
  // State for editable family profiles
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Mom', avatar: '👩', score: 120, achievements: 5 },
    { id: 2, name: 'Dad', avatar: '👨', score: 150, achievements: 8 },
    { id: 3, name: 'Emma', avatar: '👧', score: 80, achievements: 3 },
    { id: 4, name: 'Liam', avatar: '👦', score: 95, achievements: 4 }
  ]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', avatar: '👤', score: 0, achievements: 0 });
  const [showAddProfile, setShowAddProfile] = useState(false);
  
  // State for editable challenges/activities
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Around the World',
      description: 'Complete throws from 5 different spots in your backyard',
      icon: 'Target',
      points: 50
    },
    {
      id: 2,
      title: 'Trick Shot Master',
      description: 'Record and share your best trick shot',
      icon: 'Camera',
      points: 75
    },
    {
      id: 3,
      title: 'Family Tournament',
      description: 'Compete in a family tournament',
      icon: 'Trophy',
      points: 100
    }
  ]);
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const [challengeForm, setChallengeForm] = useState({ 
    title: '', 
    description: '', 
    icon: 'Target', 
    points: 50 
  });
  const [showAddChallenge, setShowAddChallenge] = useState(false);

  // Available icons for challenges
  const availableIcons = [
    { name: 'Target', component: <Target className="h-6 w-6" /> },
    { name: 'Trophy', component: <Trophy className="h-6 w-6" /> },
    { name: 'Camera', component: <Camera className="h-6 w-6" /> },
    { name: 'Star', component: <Star className="h-6 w-6" /> },
    { name: 'Zap', component: <Zap className="h-6 w-6" /> },
    { name: 'Award', component: <Award className="h-6 w-6" /> },
    { name: 'Heart', component: <Heart className="h-6 w-6" /> },
    { name: 'Smile', component: <Smile className="h-6 w-6" /> }
  ];

  // Available avatars for profiles
  const availableAvatars = ['👤', '👩', '👨', '👧', '👦', '👵', '👴', '🧒', '👱‍♀️', '👱', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱'];

  // Get icon component by name
  const getIconComponent = (iconName) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.component : <Target className="h-6 w-6" />;
  };

  const quickLinks = [
    { 
      icon: <BookOpen className="h-6 w-6 text-green-600" />, 
      title: 'Family Rules', 
      color: 'bg-green-100',
      description: 'Create your own family disc golf rules',
      content: {
        type: 'custom-rules',
        suggestions: [
          'Shorter distances for kids',
          'Extra throws allowed for beginners',
          'Special family scoring system',
          'Handicap system for different ages',
          'Unique obstacles or challenges',
          'Team play formats',
          'Modified par values',
          'Fun penalties or bonuses'
        ]
      }
    },
    { 
      icon: <Sun className="h-6 w-6 text-blue-600" />, 
      title: 'Weather Check', 
      color: 'bg-blue-100',
      description: 'Check local weather conditions for your disc golf outing',
      content: [
        { title: 'Current Weather', url: 'https://weather.com' },
        { title: 'How Wind Affects Disc Flight', url: '#' },
        { title: 'Rain Plans', url: '#' },
        { title: 'Best Times to Play', url: '#' }
      ]
    },
    { 
      icon: <Music className="h-6 w-6 text-purple-600" />, 
      title: 'Sound Effects', 
      color: 'bg-purple-100',
      description: 'Fun sounds for when the disc goes into the basket',
      content: {
        type: 'sound-effects',
        sounds: [
          { name: 'Classic Chain Rattle', icon: '🔊' },
          { name: 'Crowd Cheering', icon: '👏' },
          { name: 'Magic Sparkle', icon: '✨' },
          { name: 'Victory Trumpet', icon: '🎺' },
          { name: 'Arcade Success', icon: '🎮' },
          { name: 'Custom Recording', icon: '🎤' }
        ]
      }
    },
    { 
      icon: <Calendar className="h-6 w-6 text-pink-600" />, 
      title: 'Family Events', 
      color: 'bg-pink-100',
      description: 'Schedule and track family disc golf events',
      content: [
        { title: 'Create Family Tournament', url: '#' },
        { title: 'Weekly Challenge Day', url: '#' },
        { title: 'Birthday Special Games', url: '#' },
        { title: 'Family vs Family Match', url: '#' }
      ]
    },
    { 
      icon: <Map className="h-6 w-6 text-red-600" />, 
      title: 'Course Finder', 
      color: 'bg-red-100',
      description: 'Find family-friendly disc golf courses nearby',
      content: [
        { title: 'Search Nearby Courses', url: '#' },
        { title: 'Family-Friendly Filters', url: '#' },
        { title: 'Save Favorite Courses', url: '#' },
        { title: 'Rate Course Difficulty', url: '#' }
      ]
    },
    { 
      icon: <Award className="h-6 w-6 text-indigo-600" />, 
      title: 'Printables', 
      color: 'bg-indigo-100',
      description: 'Download and print family scorecards and games',
      content: [
        { title: 'Family Scorecard', url: '#' },
        { title: 'Achievement Tracker', url: '#' },
        { title: 'Disc Golf Bingo', url: '#' },
        { title: 'Course Design Sheet', url: '#' }
      ]
    },
    { 
      icon: <Heart className="h-6 w-6 text-yellow-600" />, 
      title: 'Safety Tips', 
      color: 'bg-yellow-100',
      description: 'Safety guidelines for family disc golf outings',
      content: [
        { title: 'Course Etiquette', url: '#' },
        { title: 'Throwing Safety', url: '#' },
        { title: 'Playing in Groups', url: '#' },
        { title: 'First Aid Basics', url: '#' }
      ]
    },
    { 
      icon: <Smile className="h-6 w-6 text-orange-600" />, 
      title: 'Fun Challenges', 
      color: 'bg-orange-100',
      description: 'Creative games to make disc golf more fun for kids',
      content: [
        { title: 'Trick Shot Contest', url: '#' },
        { title: 'Themed Rounds', url: '#' },
        { title: 'Team Challenges', url: '#' },
        { title: 'Skill-Building Games', url: '#' }
      ]
    }
  ];

  // Profile Functions
  const startEditingProfile = (profile) => {
    setEditingProfileId(profile.id);
    setProfileForm({
      name: profile.name,
      avatar: profile.avatar,
      score: profile.score,
      achievements: profile.achievements
    });
  };

  const startAddingProfile = () => {
    setShowAddProfile(true);
    setProfileForm({
      name: '',
      avatar: '👤',
      score: 0,
      achievements: 0
    });
  };

  const saveProfile = () => {
    if (profileForm.name.trim() === '') return;
    
    if (editingProfileId) {
      // Update existing profile
      setFamilyMembers(familyMembers.map(member => 
        member.id === editingProfileId ? { ...member, ...profileForm } : member
      ));
      setEditingProfileId(null);
    } else if (showAddProfile) {
      // Add new profile
      const newId = Math.max(0, ...familyMembers.map(m => m.id)) + 1;
      setFamilyMembers([...familyMembers, { id: newId, ...profileForm }]);
      setShowAddProfile(false);
    }
  };

  const cancelEditProfile = () => {
    setEditingProfileId(null);
    setShowAddProfile(false);
  };

  // Confirmation dialog functions
  const showConfirmationDialog = (message, action) => {
    setConfirmDialogMessage(message);
    setConfirmDialogAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (confirmDialogAction) {
      confirmDialogAction();
    }
    setShowConfirmDialog(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  const deleteProfile = (id) => {
    showConfirmationDialog(
      'Are you sure you want to remove this family member?',
      () => setFamilyMembers(familyMembers.filter(member => member.id !== id))
    );
  };

  // Challenge Functions
  const startEditingChallenge = (challenge) => {
    setEditingChallengeId(challenge.id);
    setChallengeForm({
      title: challenge.title,
      description: challenge.description,
      icon: challenge.icon,
      points: challenge.points
    });
  };

  const startAddingChallenge = () => {
    setShowAddChallenge(true);
    setChallengeForm({
      title: '',
      description: '',
      icon: 'Target',
      points: 50
    });
  };

  const saveChallenge = () => {
    if (challengeForm.title.trim() === '') return;
    
    if (editingChallengeId) {
      // Update existing challenge
      setChallenges(challenges.map(challenge => 
        challenge.id === editingChallengeId ? { ...challenge, ...challengeForm } : challenge
      ));
      setEditingChallengeId(null);
    } else if (showAddChallenge) {
      // Add new challenge
      const newId = Math.max(0, ...challenges.map(c => c.id)) + 1;
      setChallenges([...challenges, { id: newId, ...challengeForm }]);
      setShowAddChallenge(false);
    }
  };

  const cancelEditChallenge = () => {
    setEditingChallengeId(null);
    setShowAddChallenge(false);
  };

  const deleteChallenge = (id) => {
    showConfirmationDialog(
      'Are you sure you want to delete this challenge?',
      () => setChallenges(challenges.filter(challenge => challenge.id !== id))
    );
  };

  // Rule Functions
  const addRule = () => {
    if (newRule.trim() !== '') {
      setFamilyRules([...familyRules, newRule]);
      setNewRule('');
    }
  };

  const removeRule = (index) => {
    const updatedRules = [...familyRules];
    updatedRules.splice(index, 1);
    setFamilyRules(updatedRules);
  };

  // Profile Form
  const renderProfileForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">
        {editingProfileId ? 'Edit Family Member' : 'Add Family Member'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={profileForm.name}
            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
          <div className="grid grid-cols-7 gap-2">
            {availableAvatars.map((avatar, idx) => (
              <button
                key={idx}
                onClick={() => setProfileForm({...profileForm, avatar})}
                className={`text-2xl p-2 rounded-lg ${profileForm.avatar === avatar ? 'bg-blue-100 border-2 border-blue-500' : 'border border-gray-200'}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input
              type="number"
              value={profileForm.score}
              onChange={(e) => setProfileForm({...profileForm, score: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
            <input
              type="number"
              value={profileForm.achievements}
              onChange={(e) => setProfileForm({...profileForm, achievements: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={saveProfile}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={cancelEditProfile}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
  
  // Challenge Form
  const renderChallengeForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">
        {editingChallengeId ? 'Edit Challenge' : 'Add Challenge'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={challengeForm.title}
            onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Challenge title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={challengeForm.description}
            onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the challenge"
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {availableIcons.map((icon, idx) => (
              <button
                key={idx}
                onClick={() => setChallengeForm({...challengeForm, icon: icon.name})}
                className={`p-3 rounded-lg flex items-center justify-center ${
                  challengeForm.icon === icon.name 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'border border-gray-200'
                }`}
              >
                {icon.component}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
          <input
            type="number"
            value={challengeForm.points}
            onChange={(e) => setChallengeForm({...challengeForm, points: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <button
          onClick={saveChallenge}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
        <button
          onClick={cancelEditChallenge}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );

  const renderProfiles = () => (
    <div>
      {showAddProfile && renderProfileForm()}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Family Members</h3>
        <button
          onClick={startAddingProfile}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center text-sm"
          disabled={showAddProfile}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Member
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map(member => (
          <div key={member.id} className="relative bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform">
            {editingProfileId === member.id ? (
              renderProfileForm()
            ) : (
              <>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => startEditingProfile(member)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProfile(member.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div>
      {showAddChallenge && renderChallengeForm()}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Family Challenges</h3>
        <button
          onClick={startAddingChallenge}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center text-sm"
          disabled={showAddChallenge}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Challenge
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {challenges.map(challenge => (
          <div key={challenge.id} className="relative bg-white rounded-lg shadow-lg p-6">
            {editingChallengeId === challenge.id ? (
              renderChallengeForm()
            ) : (
              <>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => startEditingChallenge(challenge)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteChallenge(challenge.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setShowChallengeDetails(challenge)}
                >
                  <div className="p-2 rounded-full bg-blue-100 mr-4">
                    {getIconComponent(challenge.icon)}
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuickLinks = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickLinks.map((link, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowResourceDetails(link)}
        >
          <div className={`inline-flex items-center justify-center p-3 rounded-full ${link.color} mb-4`}>
            {link.icon}
          </div>
          <h3 className="text-lg font-semibold">{link.title}</h3>
          <p className="text-sm text-gray-500 mt-2">{link.description}</p>
        </div>
      ))}
    </div>
  );

  const renderResourceDetails = () => {
    const resource = showResourceDetails;
    
    if (resource.title === 'Family Rules') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create Your Family Rules</h3>
          <p className="text-gray-600 mb-6">Customize your disc golf experience with special rules that make the game fun for the whole family.</p>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Suggested Rules:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {resource.content.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setNewRule(suggestion)}
                  className="text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex mb-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Enter your custom rule"
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={addRule}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg"
              >
                Add
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Your Family Rules:</h4>
            {familyRules.length === 0 ? (
              <p className="text-gray-500 italic">No rules added yet. Add some rules to get started!</p>
            ) : (
              <ul className="space-y-2">
                {familyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg">
                    <span>{rule}</span>
                    <button
                      onClick={() => removeRule(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-green-500 text-white py-2 rounded-lg font-medium">
              Save Family Rules
            </button>
          </div>
        </div>
      );
    }
    
    if (resource.title === 'Sound Effects') {
      return (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Basket Sound Effects</h3>
          <p className="text-gray-600 mb-6">Choose a fun sound to play when the disc lands in the basket!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {resource.content.sounds.map((sound, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSound(sound.name)}
                className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                  selectedSound === sound.name
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="text-2xl mr-3">{sound.icon}</span>
                <span className="font-medium">{sound.name}</span>
              </button>
            ))}
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium mb-2">Currently Selected:</h4>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedSound}</span>
              <button className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                <Music className="h-4 w-4 mr-1" />
                Test Sound
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium">
              Save Sound Preference
            </button>
          </div>
        </div>
      );
    }
    
    // Default resource view (for links)
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
        <p className="text-gray-600 mb-6">{resource.description}</p>
        
        <ul className="space-y-3">
          {Array.isArray(resource.content) && resource.content.map((item, idx) => (
            <li key={idx}>
              <a 
                href={item.url} 
                className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-full ${resource.color} mr-3`}>
                  {resource.icon}
                </div>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (showResourceDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowResourceDetails(null)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold">{showResourceDetails.title}</h2>
          </div>
          
          {renderResourceDetails()}
        </div>
      </div>
    );
  }

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
                {getIconComponent(showChallengeDetails.icon)}
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

  // Confirmation Dialog component
  const ConfirmationDialog = () => {
    if (!showConfirmDialog) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
          <p className="mb-6">{confirmDialogMessage}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelConfirm}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Render confirmation dialog */}
        <ConfirmationDialog />
        
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
          <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'profiles' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Family Profiles
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Trophy className="h-5 w-5 inline-block mr-2" />
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('quicklinks')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'quicklinks' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <Star className="h-5 w-5 inline-block mr-2" />
              Resources
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {activeTab === 'profiles' && renderProfiles()}
            {activeTab === 'challenges' && renderChallenges()}
            {activeTab === 'quicklinks' && renderQuickLinks()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMode;