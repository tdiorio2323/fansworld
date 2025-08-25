// 🗳️ POLLS & FAN VOTING - CONFIGURATION

import { PollConfig, PollTemplate } from './types';

export const DEFAULT_POLLS_CONFIG: PollConfig = {
  enabled: true,
  maxOptions: 10,
  maxCustomOptions: 5,
  allowPremiumPolls: true,
  maxVotingFee: 1000, // $10 max
  defaultDuration: 24, // 24 hours
  maxDuration: 168, // 7 days
  minDuration: 5, // 5 minutes
  features: {
    customOptions: true,
    premiumVoting: true,
    anonymousVoting: true,
    scheduledPolls: true,
    pollComments: true,
    resultSharing: true,
    votingPower: true,
  },
  votingPowerMultipliers: {
    free: 1,
    basic: 1.5,
    premium: 2,
    vip: 3,
  },
};

export const POLL_TEMPLATES: PollTemplate[] = [
  {
    id: 'outfit-choice',
    name: 'Outfit Choice',
    description: 'Let fans choose your outfit',
    category: 'fashion',
    question: 'Which outfit should I wear today?',
    options: [
      'Casual & Comfy',
      'Dress to Impress', 
      'Something Sexy',
      'Sporty & Active'
    ],
    settings: {
      allowMultipleChoices: false,
      showResults: 'after_voting',
      isAnonymous: false,
    },
    isPopular: true,
  },
  {
    id: 'content-type',
    name: 'Content Type',
    description: 'What content should I create next?',
    category: 'content',
    question: 'What type of content do you want to see next?',
    options: [
      'Behind the Scenes',
      'Tutorial/How-To',
      'Q&A Session',
      'Photoshoot',
      'Live Stream'
    ],
    settings: {
      allowMultipleChoices: true,
      showResults: 'after_voting',
      isAnonymous: false,
    },
    isPopular: true,
  },
  {
    id: 'photo-contest',
    name: 'Photo Contest',
    description: 'Vote on the best photo',
    category: 'general',
    question: 'Which photo is your favorite?',
    options: [
      'Photo A',
      'Photo B',
      'Photo C'
    ],
    settings: {
      allowMultipleChoices: false,
      showResults: 'after_end',
      isAnonymous: true,
    },
    isPopular: true,
  },
  {
    id: 'collaboration-choice',
    name: 'Collaboration Choice',
    description: 'Who should I collaborate with?',
    category: 'business',
    question: 'Who would you like to see me collaborate with?',
    options: [
      'Another Creator',
      'Brand Partnership',
      'Fan Collaboration',
      'Celebrity Guest'
    ],
    settings: {
      allowMultipleChoices: false,
      showResults: 'after_voting',
      isAnonymous: false,
    },
    isPopular: false,
  },
  {
    id: 'lifestyle-decision',
    name: 'Lifestyle Decision',
    description: 'Help me make a lifestyle choice',
    category: 'lifestyle',
    question: 'Help me decide on my next adventure!',
    options: [
      'Travel Destination',
      'New Hobby to Try',
      'Fitness Challenge',
      'Cooking Experiment'
    ],
    settings: {
      allowMultipleChoices: false,
      showResults: 'always',
      isAnonymous: false,
    },
    isPopular: false,
  },
  {
    id: 'fan-favorites',
    name: 'Fan Favorites',
    description: 'Rate your favorite content',
    category: 'general',
    question: 'Rate these pieces of content from 1-5 stars',
    options: [
      'Recent Photoshoot',
      'Last Week\'s Video',
      'Live Stream Session',
      'Behind the Scenes'
    ],
    settings: {
      allowMultipleChoices: true,
      showResults: 'after_voting',
      isAnonymous: true,
    },
    isPopular: true,
  },
];

// Poll categories with colors and icons
export const POLL_CATEGORIES = [
  { 
    value: 'general', 
    label: 'General', 
    color: '#6B7280', 
    emoji: '📋',
    description: 'General questions and decisions'
  },
  { 
    value: 'content', 
    label: 'Content', 
    color: '#8B5CF6', 
    emoji: '🎬',
    description: 'Content creation and planning'
  },
  { 
    value: 'fashion', 
    label: 'Fashion', 
    color: '#EC4899', 
    emoji: '👗',
    description: 'Outfit choices and fashion decisions'
  },
  { 
    value: 'lifestyle', 
    label: 'Lifestyle', 
    color: '#10B981', 
    emoji: '🌟',
    description: 'Personal life and lifestyle choices'
  },
  { 
    value: 'nsfw', 
    label: 'NSFW', 
    color: '#EF4444', 
    emoji: '🔞',
    description: 'Adult content decisions'
  },
  { 
    value: 'business', 
    label: 'Business', 
    color: '#F59E0B', 
    emoji: '💼',
    description: 'Business and collaboration decisions'
  },
];

// Voting types with descriptions
export const VOTING_TYPES = [
  {
    value: 'single_choice',
    label: 'Single Choice',
    description: 'Voters can select only one option',
    icon: '🎯',
  },
  {
    value: 'multiple_choice',
    label: 'Multiple Choice',
    description: 'Voters can select multiple options',
    icon: '☑️',
  },
  {
    value: 'ranked_choice',
    label: 'Ranked Choice',
    description: 'Voters rank options in order of preference',
    icon: '📊',
  },
  {
    value: 'rating',
    label: 'Rating',
    description: 'Voters rate each option (1-5 stars)',
    icon: '⭐',
  },
];

// Results display options
export const RESULTS_DISPLAY_OPTIONS = [
  {
    value: 'always',
    label: 'Always Show',
    description: 'Results are visible immediately and always',
  },
  {
    value: 'after_voting',
    label: 'After Voting',
    description: 'Results shown only after user votes',
  },
  {
    value: 'after_end',
    label: 'After Poll Ends',
    description: 'Results shown only when poll ends',
  },
  {
    value: 'never',
    label: 'Never Show',
    description: 'Results are never shown publicly',
  },
];

// Preset poll durations
export const POLL_DURATIONS = [
  { value: 1, label: '1 Hour', hours: 1 },
  { value: 3, label: '3 Hours', hours: 3 },
  { value: 6, label: '6 Hours', hours: 6 },
  { value: 12, label: '12 Hours', hours: 12 },
  { value: 24, label: '1 Day', hours: 24 },
  { value: 72, label: '3 Days', hours: 72 },
  { value: 168, label: '1 Week', hours: 168 },
];

// Voting power tiers
export const VOTING_POWER_TIERS = [
  {
    tier: 'free',
    label: 'Free Users',
    power: 1,
    color: '#6B7280',
    description: 'Standard voting power',
  },
  {
    tier: 'basic',
    label: 'Basic Subscribers',
    power: 1.5,
    color: '#3B82F6',
    description: '50% more voting power',
  },
  {
    tier: 'premium',
    label: 'Premium Subscribers',
    power: 2,
    color: '#8B5CF6',
    description: 'Double voting power',
  },
  {
    tier: 'vip',
    label: 'VIP Members',
    power: 3,
    color: '#F59E0B',
    description: 'Triple voting power',
  },
];

// Utility functions
export const calculateVotingPower = (subscriptionTier: string): number => {
  return DEFAULT_POLLS_CONFIG.votingPowerMultipliers[subscriptionTier as keyof typeof DEFAULT_POLLS_CONFIG.votingPowerMultipliers] || 1;
};

export const calculatePollResults = (options: any[], votes: any[]): any[] => {
  const totalVotes = votes.reduce((sum, vote) => sum + (vote.votingPower || 1), 0);
  
  return options.map(option => {
    const optionVotes = votes.filter(vote => 
      vote.optionIds?.includes(option.id)
    );
    
    const voteCount = optionVotes.reduce((sum, vote) => sum + (vote.votingPower || 1), 0);
    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
    
    return {
      ...option,
      voteCount,
      percentage,
    };
  });
};

export const isPollActive = (poll: any): boolean => {
  const now = new Date();
  const starts = poll.startsAt ? new Date(poll.startsAt) : new Date(poll.createdAt);
  const ends = poll.endsAt ? new Date(poll.endsAt) : null;
  
  return poll.status === 'active' && 
         now >= starts && 
         (ends === null || now <= ends);
};

export const getPollTimeRemaining = (endsAt?: string): string => {
  if (!endsAt) return 'No end time set';
  
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Poll ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

export const validatePollOptions = (options: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (options.length < 2) {
    errors.push('Poll must have at least 2 options');
  }
  
  if (options.length > DEFAULT_POLLS_CONFIG.maxOptions) {
    errors.push(`Poll cannot have more than ${DEFAULT_POLLS_CONFIG.maxOptions} options`);
  }
  
  const uniqueTexts = new Set(options.map(opt => opt.text?.toLowerCase()));
  if (uniqueTexts.size !== options.length) {
    errors.push('Poll options must be unique');
  }
  
  options.forEach((option, index) => {
    if (!option.text || option.text.trim().length === 0) {
      errors.push(`Option ${index + 1} cannot be empty`);
    }
    
    if (option.text && option.text.length > 200) {
      errors.push(`Option ${index + 1} is too long (max 200 characters)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generatePollShareUrl = (pollId: string, creatorUsername: string): string => {
  return `${window.location.origin}/${creatorUsername}/poll/${pollId}`;
};

export const formatVoteCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

export const getPollCategoryInfo = (category?: string) => {
  return POLL_CATEGORIES.find(cat => cat.value === category) || POLL_CATEGORIES[0];
};

export const canUserVote = (poll: any, user: any): { canVote: boolean; reason?: string } => {
  if (!user) {
    return { canVote: false, reason: 'Must be logged in to vote' };
  }
  
  if (!isPollActive(poll)) {
    return { canVote: false, reason: 'Poll is not active' };
  }
  
  if (poll.requiresSubscription && !user.hasSubscription) {
    return { canVote: false, reason: 'Subscription required to vote' };
  }
  
  if (poll.isPremium && !user.canMakePurchases) {
    return { canVote: false, reason: 'Cannot make premium purchases' };
  }
  
  return { canVote: true };
};