// 📚 STORIES & HIGHLIGHTS - CONFIGURATION

import { StoryConfig, StoryTemplate } from './types';

export const DEFAULT_STORIES_CONFIG: StoryConfig = {
  enabled: true,
  maxDuration: 24, // 24 hours
  maxContentItems: 10, // Max 10 slides per story
  allowPremiumStories: true,
  maxPremiumPrice: 5000, // $50 max
  autoExpiry: true,
  defaultExpiry: 24, // 24 hours
  maxHighlights: 20, // Max highlights per creator
  storiesPerHighlight: 100, // Max stories per highlight
  fileUploadLimits: {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxVideoLength: 60, // 60 seconds
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'webm'],
  },
  features: {
    polls: true,
    questions: true,
    stickers: true,
    music: true,
    filters: true,
    mentions: true,
    hashtags: true,
    location: true,
  },
};

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: 'behind-scenes',
    name: 'Behind the Scenes',
    description: 'Share what goes on behind the camera',
    category: 'behind_scenes',
    thumbnailUrl: '/templates/behind-scenes.jpg',
    isPopular: true,
    content: [
      {
        type: 'text',
        text: 'Behind the scenes... 👀',
        duration: 3,
        order: 0,
        backgroundColor: '#FF6B9D',
        textColor: '#FFFFFF',
        fontSize: 'large',
        textAlign: 'center',
      },
      {
        type: 'question',
        question: {
          text: 'What would you like to see next?',
          placeholder: 'Tell me your ideas...',
        },
        duration: 5,
        order: 1,
        backgroundColor: '#A855F7',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    id: 'announcement',
    name: 'Big Announcement',
    description: 'Share exciting news with your fans',
    category: 'announcement',
    thumbnailUrl: '/templates/announcement.jpg',
    isPopular: true,
    content: [
      {
        type: 'text',
        text: '📢 Big news coming...',
        duration: 3,
        order: 0,
        backgroundColor: '#F59E0B',
        textColor: '#FFFFFF',
        fontSize: 'large',
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'Stay tuned! 🔥',
        duration: 3,
        order: 1,
        backgroundColor: '#EF4444',
        textColor: '#FFFFFF',
        fontSize: 'medium',
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'fan-poll',
    name: 'Fan Poll',
    description: 'Let your fans vote on something',
    category: 'poll',
    thumbnailUrl: '/templates/poll.jpg',
    isPopular: true,
    content: [
      {
        type: 'poll',
        text: 'Help me decide! 🤔',
        duration: 10,
        order: 0,
        poll: {
          question: 'Which outfit should I wear today?',
          options: ['Casual & Comfy', 'Dress to Impress', 'Something Sexy'],
          votes: {},
        },
        backgroundColor: '#8B5CF6',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    id: 'teaser',
    name: 'Content Teaser',
    description: 'Tease upcoming premium content',
    category: 'teaser',
    thumbnailUrl: '/templates/teaser.jpg',
    isPopular: true,
    content: [
      {
        type: 'text',
        text: 'New content dropping soon... 😈',
        duration: 3,
        order: 0,
        backgroundColor: '#1F2937',
        textColor: '#F59E0B',
        fontSize: 'large',
        textAlign: 'center',
      },
      {
        type: 'text',
        text: 'Subscribe to see it first! 💫',
        duration: 3,
        order: 1,
        backgroundColor: '#1F2937',
        textColor: '#FFFFFF',
        fontSize: 'medium',
        textAlign: 'center',
      },
    ],
  },
  {
    id: 'q-and-a',
    name: 'Q&A Session',
    description: 'Answer fan questions',
    category: 'question',
    thumbnailUrl: '/templates/qa.jpg',
    isPopular: false,
    content: [
      {
        type: 'text',
        text: 'Ask me anything! 💬',
        duration: 3,
        order: 0,
        backgroundColor: '#06B6D4',
        textColor: '#FFFFFF',
        fontSize: 'large',
        textAlign: 'center',
      },
      {
        type: 'question',
        question: {
          text: 'What do you want to know?',
          placeholder: 'Ask me anything...',
        },
        duration: 10,
        order: 1,
        backgroundColor: '#0EA5E9',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Day in My Life',
    description: 'Share your daily routine',
    category: 'lifestyle',
    thumbnailUrl: '/templates/lifestyle.jpg',
    isPopular: true,
    content: [
      {
        type: 'text',
        text: 'Day in my life ✨',
        duration: 3,
        order: 0,
        backgroundColor: '#F472B6',
        textColor: '#FFFFFF',
        fontSize: 'large',
        textAlign: 'center',
      },
    ],
  },
];

// Story filters and effects
export const STORY_FILTERS = [
  { name: 'None', value: 'none' },
  { name: 'Vintage', value: 'vintage' },
  { name: 'Dramatic', value: 'dramatic' },
  { name: 'Bright', value: 'bright' },
  { name: 'Soft', value: 'soft' },
];

export const STORY_BACKGROUNDS = [
  '#FF6B9D', // Pink
  '#A855F7', // Purple
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F472B6', // Pink
  '#1F2937', // Dark
  '#FFFFFF', // White
];

export const STORY_MOODS = [
  { label: 'Happy', value: 'happy', emoji: '😊', color: '#F59E0B' },
  { label: 'Excited', value: 'excited', emoji: '🤩', color: '#EF4444' },
  { label: 'Sexy', value: 'sexy', emoji: '😈', color: '#EC4899' },
  { label: 'Flirty', value: 'flirty', emoji: '😘', color: '#F472B6' },
  { label: 'Mysterious', value: 'mysterious', emoji: '🖤', color: '#6B7280' },
  { label: 'Playful', value: 'playful', emoji: '😜', color: '#A855F7' },
];

// Story sticker categories
export const STORY_STICKERS = {
  emojis: ['❤️', '🔥', '💯', '🎉', '✨', '💋', '👀', '🌟', '💫', '🦋'],
  reactions: ['😍', '🥵', '🤤', '😜', '😈', '🥰', '😘', '🤩', '😋', '🔥'],
  hearts: ['💕', '💖', '💗', '💓', '💝', '💘', '💞', '💟', '❣️', '💌'],
};

// Utility functions
export const calculateStoryDuration = (content: any[]): number => {
  return content.reduce((total, item) => total + (item.duration || 5), 0);
};

export const validateStoryContent = (content: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (content.length === 0) {
    errors.push('Story must have at least one content item');
  }
  
  if (content.length > DEFAULT_STORIES_CONFIG.maxContentItems) {
    errors.push(`Story cannot have more than ${DEFAULT_STORIES_CONFIG.maxContentItems} items`);
  }
  
  const totalDuration = calculateStoryDuration(content);
  if (totalDuration > 60) {
    errors.push('Story duration cannot exceed 60 seconds');
  }
  
  content.forEach((item, index) => {
    if (!item.type) {
      errors.push(`Content item ${index + 1} is missing type`);
    }
    
    if (item.type === 'poll' && (!item.poll?.question || !item.poll?.options?.length)) {
      errors.push(`Poll in item ${index + 1} is missing question or options`);
    }
    
    if (item.type === 'question' && !item.question?.text) {
      errors.push(`Question in item ${index + 1} is missing text`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generateStoryShareUrl = (storyId: string, creatorUsername: string): string => {
  return `${window.location.origin}/${creatorUsername}/story/${storyId}`;
};

export const formatStoryDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
};

export const isStoryExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const getTimeUntilExpiry = (expiresAt?: string): string => {
  if (!expiresAt) return 'Never expires';
  
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};