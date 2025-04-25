export const achievements = [
  {
    id: 'perfect_round',
    title: 'Perfect Round',
    description: 'Complete a round with all pars or better',
    icon: 'star',
    category: 'round',
    difficulty: 'hard',
    points: 100
  },
  {
    id: 'ace_master',
    title: 'Ace Master',
    description: 'Get 5 aces in a single round',
    icon: 'target',
    category: 'accuracy',
    difficulty: 'legendary',
    points: 200
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Complete 10 rounds in a row without any double bogeys',
    icon: 'trending-up',
    category: 'consistency',
    difficulty: 'hard',
    points: 150
  },
  {
    id: 'distance_demon',
    title: 'Distance Demon',
    description: 'Make a putt from 30+ feet',
    icon: 'zap',
    category: 'power',
    difficulty: 'medium',
    points: 75
  },
  {
    id: 'wind_warrior',
    title: 'Wind Warrior',
    description: 'Complete a round in windy conditions (15+ mph) with all pars or better',
    icon: 'wind',
    category: 'skill',
    difficulty: 'hard',
    points: 125
  },
  {
    id: 'night_rider',
    title: 'Night Rider',
    description: 'Complete a round after sunset using only ambient light',
    icon: 'moon',
    category: 'special',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'rain_master',
    title: 'Rain Master',
    description: 'Complete a round in the rain with all pars or better',
    icon: 'cloud-rain',
    category: 'special',
    difficulty: 'hard',
    points: 150
  },
  {
    id: 'trick_shot_artist',
    title: 'Trick Shot Artist',
    description: 'Successfully complete 5 different trick shots in a single round',
    icon: 'sparkles',
    category: 'skill',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'putting_pro',
    title: 'Putting Pro',
    description: 'Make 20 putts in a row from 15 feet',
    icon: 'target',
    category: 'accuracy',
    difficulty: 'hard',
    points: 150
  },
  {
    id: 'course_designer',
    title: 'Course Designer',
    description: 'Create and complete a round on a custom 9-hole course layout',
    icon: 'layout',
    category: 'creativity',
    difficulty: 'easy',
    points: 50
  },
  {
    id: 'speed_round',
    title: 'Speed Round',
    description: 'Complete a 9-hole round in under 15 minutes',
    icon: 'clock',
    category: 'speed',
    difficulty: 'medium',
    points: 75
  },
  {
    id: 'backhand_master',
    title: 'Backhand Master',
    description: 'Complete a round using only backhand throws',
    icon: 'rotate-ccw',
    category: 'skill',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'forehand_expert',
    title: 'Forehand Expert',
    description: 'Complete a round using only forehand throws',
    icon: 'rotate-cw',
    category: 'skill',
    difficulty: 'hard',
    points: 125
  },
  {
    id: 'one_disc_wonder',
    title: 'One Disc Wonder',
    description: 'Complete a round using only one disc',
    icon: 'disc',
    category: 'skill',
    difficulty: 'hard',
    points: 150
  },
  {
    id: 'obstacle_course',
    title: 'Obstacle Course',
    description: 'Complete a round with at least 5 obstacles per hole',
    icon: 'slalom',
    category: 'skill',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'family_fun',
    title: 'Family Fun',
    description: 'Complete a round with at least 3 family members',
    icon: 'users',
    category: 'social',
    difficulty: 'easy',
    points: 50
  },
  {
    id: 'neighborhood_champ',
    title: 'Neighborhood Champ',
    description: 'Organize and win a mini tournament with neighbors',
    icon: 'trophy',
    category: 'social',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'practice_makes_perfect',
    title: 'Practice Makes Perfect',
    description: 'Complete 100 practice putts in a single session',
    icon: 'target',
    category: 'practice',
    difficulty: 'medium',
    points: 75
  },
  {
    id: 'weather_warrior',
    title: 'Weather Warrior',
    description: 'Complete rounds in 5 different weather conditions',
    icon: 'cloud',
    category: 'special',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'course_conqueror',
    title: 'Course Conqueror',
    description: 'Complete 50 rounds on your home course',
    icon: 'flag',
    category: 'dedication',
    difficulty: 'hard',
    points: 200
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a round before 7 AM',
    icon: 'sunrise',
    category: 'special',
    difficulty: 'easy',
    points: 50
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a round after 10 PM',
    icon: 'moon',
    category: 'special',
    difficulty: 'easy',
    points: 50
  },
  {
    id: 'seasoned_player',
    title: 'Seasoned Player',
    description: 'Complete rounds in all four seasons',
    icon: 'calendar',
    category: 'dedication',
    difficulty: 'medium',
    points: 100
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Play rounds with 10 different people',
    icon: 'users',
    category: 'social',
    difficulty: 'medium',
    points: 75
  },
  {
    id: 'course_innovator',
    title: 'Course Innovator',
    description: 'Create and complete 5 different custom course layouts',
    icon: 'layout',
    category: 'creativity',
    difficulty: 'hard',
    points: 150
  }
];

export const achievementCategories = {
  round: 'Round Achievements',
  accuracy: 'Accuracy Achievements',
  consistency: 'Consistency Achievements',
  power: 'Power Achievements',
  skill: 'Skill Achievements',
  special: 'Special Achievements',
  creativity: 'Creativity Achievements',
  speed: 'Speed Achievements',
  social: 'Social Achievements',
  practice: 'Practice Achievements',
  dedication: 'Dedication Achievements'
};

export const difficultyLevels = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  hard: { label: 'Hard', color: 'bg-orange-100 text-orange-800' },
  legendary: { label: 'Legendary', color: 'bg-purple-100 text-purple-800' }
}; 