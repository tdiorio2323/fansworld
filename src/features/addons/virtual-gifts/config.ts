// 🎁 VIRTUAL GIFTS - CONFIGURATION SETTINGS

import { VirtualGiftsConfig, VirtualGift } from './types';

export const DEFAULT_VIRTUAL_GIFTS_CONFIG: VirtualGiftsConfig = {
  enabled: true,
  maxGiftsPerMessage: 5,
  maxDailySpend: 50000, // $500 in cents
  animationDuration: 3000, // 3 seconds
  soundEnabled: true,
  allowAnonymous: true,
  commissionRate: 0.1, // 10% platform commission
};

// Pre-defined gift catalog
export const DEFAULT_GIFT_CATALOG: VirtualGift[] = [
  // Hearts Category
  {
    id: 'heart-small',
    name: 'Little Heart',
    emoji: '💗',
    description: 'A sweet little heart to show you care',
    price: 100, // $1.00
    category: 'hearts',
    rarity: 'common',
    animation: 'float-up',
    sound: 'heart-beat',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'heart-big',
    name: 'Big Heart',
    emoji: '❤️',
    description: 'A big heart filled with love',
    price: 300, // $3.00
    category: 'hearts',
    rarity: 'common',
    animation: 'pulse-grow',
    sound: 'heart-beat',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'heart-fire',
    name: 'Fire Heart',
    emoji: '❤️‍🔥',
    description: 'A passionate burning heart',
    price: 500, // $5.00
    category: 'hearts',
    rarity: 'rare',
    animation: 'fire-effect',
    sound: 'fire-crackle',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Stars Category
  {
    id: 'star-small',
    name: 'Twinkle Star',
    emoji: '⭐',
    description: 'A bright twinkling star',
    price: 200, // $2.00
    category: 'stars',
    rarity: 'common',
    animation: 'twinkle',
    sound: 'star-chime',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'shooting-star',
    name: 'Shooting Star',
    emoji: '🌟',
    description: 'Make a wish on this shooting star',
    price: 800, // $8.00
    category: 'stars',
    rarity: 'epic',
    animation: 'shooting-across',
    sound: 'whoosh-sparkle',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Luxury Category
  {
    id: 'diamond',
    name: 'Diamond',
    emoji: '💎',
    description: 'A rare and precious diamond',
    price: 1500, // $15.00
    category: 'luxury',
    rarity: 'epic',
    animation: 'sparkle-rotate',
    sound: 'crystal-ding',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    emoji: '👑',
    description: 'Fit for royalty - the ultimate gift',
    price: 5000, // $50.00
    category: 'luxury',
    rarity: 'legendary',
    animation: 'golden-glow',
    sound: 'royal-fanfare',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'yacht',
    name: 'Luxury Yacht',
    emoji: '🛥️',
    description: 'The ultimate luxury gift',
    price: 10000, // $100.00
    category: 'luxury',
    rarity: 'legendary',
    animation: 'sail-by',
    sound: 'ocean-waves',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Seasonal Category
  {
    id: 'rose',
    name: 'Red Rose',
    emoji: '🌹',
    description: 'A classic romantic gesture',
    price: 400, // $4.00
    category: 'seasonal',
    rarity: 'common',
    animation: 'bloom',
    sound: 'nature-chime',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'champagne',
    name: 'Champagne',
    emoji: '🍾',
    description: 'Celebrate in style',
    price: 1200, // $12.00
    category: 'seasonal',
    rarity: 'rare',
    animation: 'pop-fizz',
    sound: 'champagne-pop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Gift rarity colors for UI
export const RARITY_COLORS = {
  common: {
    border: 'border-gray-400',
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    glow: 'shadow-gray-400/20',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    glow: 'shadow-blue-400/30',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    glow: 'shadow-purple-400/40',
  },
  legendary: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-400/50',
  },
};

// Category icons and colors
export const CATEGORY_CONFIG = {
  hearts: {
    icon: '💕',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  stars: {
    icon: '✨',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  luxury: {
    icon: '💎',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  seasonal: {
    icon: '🌸',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  custom: {
    icon: '🎨',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
};

// Animation keyframes for CSS
export const GIFT_ANIMATIONS = {
  'float-up': `
    @keyframes floatUp {
      0% { transform: translateY(0px) scale(1); opacity: 1; }
      100% { transform: translateY(-100px) scale(1.2); opacity: 0; }
    }
  `,
  'pulse-grow': `
    @keyframes pulseGrow {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `,
  'twinkle': `
    @keyframes twinkle {
      0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
      25% { opacity: 0.5; transform: scale(1.1) rotate(90deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
      75% { opacity: 0.7; transform: scale(1.1) rotate(270deg); }
    }
  `,
  'shooting-across': `
    @keyframes shootingAcross {
      0% { transform: translateX(-100px) translateY(20px) rotate(-15deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(300px) translateY(-50px) rotate(-15deg); opacity: 0; }
    }
  `,
  'sparkle-rotate': `
    @keyframes sparkleRotate {
      0% { transform: rotate(0deg) scale(1); filter: brightness(1); }
      25% { transform: rotate(90deg) scale(1.1); filter: brightness(1.2); }
      50% { transform: rotate(180deg) scale(1.2); filter: brightness(1.4); }
      75% { transform: rotate(270deg) scale(1.1); filter: brightness(1.2); }
      100% { transform: rotate(360deg) scale(1); filter: brightness(1); }
    }
  `,
  'golden-glow': `
    @keyframes goldenGlow {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
      50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
    }
  `,
  'fire-effect': `
    @keyframes fireEffect {
      0%, 100% { transform: scale(1) rotate(-2deg); filter: hue-rotate(0deg); }
      25% { transform: scale(1.1) rotate(2deg); filter: hue-rotate(10deg); }
      50% { transform: scale(1.2) rotate(-1deg); filter: hue-rotate(20deg); }
      75% { transform: scale(1.1) rotate(1deg); filter: hue-rotate(10deg); }
    }
  `,
};

// Sound file mappings
export const GIFT_SOUNDS = {
  'heart-beat': '/sounds/gifts/heart-beat.mp3',
  'star-chime': '/sounds/gifts/star-chime.mp3',
  'crystal-ding': '/sounds/gifts/crystal-ding.mp3',
  'royal-fanfare': '/sounds/gifts/royal-fanfare.mp3',
  'fire-crackle': '/sounds/gifts/fire-crackle.mp3',
  'whoosh-sparkle': '/sounds/gifts/whoosh-sparkle.mp3',
  'ocean-waves': '/sounds/gifts/ocean-waves.mp3',
  'nature-chime': '/sounds/gifts/nature-chime.mp3',
  'champagne-pop': '/sounds/gifts/champagne-pop.mp3',
};

// Quick amount buttons for gift interface
export const QUICK_AMOUNTS = [
  { label: '$1', value: 100 },
  { label: '$5', value: 500 },
  { label: '$10', value: 1000 },
  { label: '$25', value: 2500 },
  { label: '$50', value: 5000 },
  { label: '$100', value: 10000 },
];

// Gift sending limits
export const GIFT_LIMITS = {
  maxQuantityPerGift: 99,
  maxTotalValue: 100000, // $1000 per transaction
  cooldownPeriod: 1000, // 1 second between gifts
  maxMessageLength: 200,
};