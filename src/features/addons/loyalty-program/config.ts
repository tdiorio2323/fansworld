// 🎁 LOYALTY PROGRAM - CONFIGURATION

import type { LoyaltyConfig, LoyaltyProgram, PointEarnRate } from './types';

export const DEFAULT_LOYALTY_CONFIG: LoyaltyConfig = {
  enabled: true,
  
  // Program limits
  maxProgramsPerCreator: 3,
  maxRewardsPerProgram: 50,
  maxTiersPerProgram: 10,
  
  // Points system
  maxPointsPerTransaction: 10000,
  maxPointBalance: 1000000,
  defaultPointExpiry: 365, // 1 year
  
  // Security
  preventPointsManipulation: true,
  auditAllTransactions: true,
  maxDailyEarnings: 5000,
  
  // Features
  enableGamification: true,
  enableSocialFeatures: true,
  enableReferralProgram: true,
  enableChallenges: true,
  
  // Notifications
  enableEmailNotifications: true,
  enablePushNotifications: true,
  notificationPreferences: {
    pointsEarned: true,
    rewardRedeemed: true,
    tierUpgrade: true,
    achievementUnlocked: true,
    challengeComplete: true,
    pointsExpiring: true,
  },
  
  // Analytics
  enableDetailedAnalytics: true,
  dataRetentionPeriod: 1095, // 3 years
  
  // Compliance
  enableGDPRCompliance: true,
  allowDataExport: true,
  allowAccountDeletion: true,
};

// Default earn rates for new programs
export const DEFAULT_EARN_RATES: PointEarnRate[] = [
  {
    action: 'purchase',
    pointsPerAction: 0,
    pointsPerDollar: 1, // 1 point per dollar
    conditions: [
      { type: 'minimum_amount', value: 100 }, // Minimum $1 purchase
    ],
  },
  {
    action: 'subscription_signup',
    pointsPerAction: 100,
    maxPointsPerDay: 100,
  },
  {
    action: 'subscription_renewal',
    pointsPerAction: 50,
    maxPointsPerDay: 50,
  },
  {
    action: 'referral',
    pointsPerAction: 200,
    maxPointsPerDay: 1000,
  },
  {
    action: 'social_share',
    pointsPerAction: 10,
    maxPointsPerDay: 50,
  },
  {
    action: 'review',
    pointsPerAction: 25,
    maxPointsPerDay: 100,
  },
  {
    action: 'daily_login',
    pointsPerAction: 5,
    maxPointsPerDay: 5,
  },
  {
    action: 'content_interaction',
    pointsPerAction: 2,
    maxPointsPerDay: 20,
  },
  {
    action: 'birthday',
    pointsPerAction: 500,
    maxPointsPerDay: 500,
  },
  {
    action: 'anniversary',
    pointsPerAction: 1000,
    maxPointsPerDay: 1000,
  },
];

// Preset tier configurations
export const TIER_PRESETS = {
  bronze_silver_gold: [
    {
      id: 'bronze',
      name: 'Bronze',
      description: 'Welcome tier for new members',
      requiredPoints: 0,
      requiredSpend: 0,
      color: '#CD7F32',
      icon: '🥉',
      pointMultiplier: 1.0,
      discountPercentage: 0,
      exclusiveContent: false,
      prioritySupport: false,
      earlyAccess: false,
      freeShipping: false,
      customPerks: [],
    },
    {
      id: 'silver',
      name: 'Silver',
      description: 'Intermediate tier with better rewards',
      requiredPoints: 1000,
      requiredSpend: 10000, // $100
      color: '#C0C0C0',
      icon: '🥈',
      pointMultiplier: 1.25,
      discountPercentage: 5,
      exclusiveContent: true,
      prioritySupport: false,
      earlyAccess: false,
      freeShipping: false,
      customPerks: ['Monthly exclusive content'],
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'Premium tier with exclusive benefits',
      requiredPoints: 5000,
      requiredSpend: 50000, // $500
      color: '#FFD700',
      icon: '🥇',
      pointMultiplier: 1.5,
      discountPercentage: 10,
      exclusiveContent: true,
      prioritySupport: true,
      earlyAccess: true,
      freeShipping: true,
      customPerks: ['Weekly exclusive content', 'Direct creator access'],
    },
  ],

  vip_system: [
    {
      id: 'member',
      name: 'Member',
      description: 'Standard membership benefits',
      requiredPoints: 0,
      requiredSpend: 0,
      color: '#6B7280',
      icon: '👤',
      pointMultiplier: 1.0,
      discountPercentage: 0,
      exclusiveContent: false,
      prioritySupport: false,
      earlyAccess: false,
      freeShipping: false,
      customPerks: [],
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'VIP member with premium access',
      requiredPoints: 2500,
      requiredSpend: 25000, // $250
      color: '#7C3AED',
      icon: '⭐',
      pointMultiplier: 1.3,
      discountPercentage: 8,
      exclusiveContent: true,
      prioritySupport: true,
      earlyAccess: true,
      freeShipping: false,
      customPerks: ['VIP Discord access', 'Monthly Q&A sessions'],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Elite tier with maximum benefits',
      requiredPoints: 10000,
      requiredSpend: 100000, // $1000
      color: '#DC2626',
      icon: '💎',
      pointMultiplier: 2.0,
      discountPercentage: 15,
      exclusiveContent: true,
      prioritySupport: true,
      earlyAccess: true,
      freeShipping: true,
      customPerks: [
        'Personal creator messages',
        'Exclusive live streams',
        'Custom content requests',
        'Elite badge on profile'
      ],
    },
  ],

  fanclub_levels: [
    {
      id: 'fan',
      name: 'Fan',
      description: 'New fan just starting their journey',
      requiredPoints: 0,
      requiredSpend: 0,
      color: '#F59E0B',
      icon: '🌟',
      pointMultiplier: 1.0,
      discountPercentage: 0,
      exclusiveContent: false,
      prioritySupport: false,
      earlyAccess: false,
      freeShipping: false,
      customPerks: [],
    },
    {
      id: 'super-fan',
      name: 'Super Fan',
      description: 'Dedicated supporter with special access',
      requiredPoints: 1500,
      requiredSpend: 15000, // $150
      color: '#EF4444',
      icon: '💖',
      pointMultiplier: 1.2,
      discountPercentage: 5,
      exclusiveContent: true,
      prioritySupport: false,
      earlyAccess: false,
      freeShipping: false,
      customPerks: ['Fan art showcases', 'Behind-the-scenes content'],
    },
    {
      id: 'mega-fan',
      name: 'Mega Fan',
      description: 'Ultimate fan with exclusive privileges',
      requiredPoints: 7500,
      requiredSpend: 75000, // $750
      color: '#8B5CF6',
      icon: '👑',
      pointMultiplier: 1.75,
      discountPercentage: 12,
      exclusiveContent: true,
      prioritySupport: true,
      earlyAccess: true,
      freeShipping: true,
      customPerks: [
        'Monthly video calls',
        'Personalized content',
        'Fan hall of fame',
        'Anniversary celebrations'
      ],
    },
  ],
};

// Default reward templates
export const REWARD_TEMPLATES = [
  // Discount rewards
  {
    name: '5% Off Coupon',
    description: '5% discount on any purchase',
    type: 'discount_coupon',
    pointsCost: 100,
    discountPercentage: 5,
    expirationDays: 30,
    maxPerMember: 5,
  },
  {
    name: '10% Off Coupon',
    description: '10% discount on any purchase',
    type: 'discount_coupon',
    pointsCost: 200,
    discountPercentage: 10,
    expirationDays: 30,
    maxPerMember: 3,
  },
  {
    name: '20% Off Coupon',
    description: '20% discount on any purchase',
    type: 'discount_coupon',
    pointsCost: 500,
    discountPercentage: 20,
    expirationDays: 30,
    maxPerMember: 1,
  },

  // Free content rewards
  {
    name: 'Free Photo Set',
    description: 'Access to exclusive photo collection',
    type: 'free_content',
    pointsCost: 150,
    expirationDays: 90,
    maxPerMember: 10,
  },
  {
    name: 'Free Video',
    description: 'Access to premium video content',
    type: 'free_content',
    pointsCost: 300,
    expirationDays: 90,
    maxPerMember: 5,
  },

  // Exclusive access
  {
    name: 'VIP Chat Access',
    description: '30 days of VIP chat privileges',
    type: 'exclusive_access',
    pointsCost: 400,
    expirationDays: 30,
    maxPerMember: 2,
  },
  {
    name: 'Live Stream Priority',
    description: 'Priority questions in live streams for 1 month',
    type: 'exclusive_access',
    pointsCost: 250,
    expirationDays: 30,
    maxPerMember: 3,
  },

  // Custom request credits
  {
    name: 'Custom Request Discount',
    description: '50% off your next custom request',
    type: 'custom_request_credit',
    pointsCost: 600,
    discountPercentage: 50,
    expirationDays: 60,
    maxPerMember: 1,
  },

  // Bonus points
  {
    name: 'Bonus Points Pack',
    description: 'Extra 100 loyalty points',
    type: 'bonus_points',
    pointsCost: 50,
    maxPerMember: 10,
  },
];

// Achievement templates
export const ACHIEVEMENT_TEMPLATES = [
  // Spending achievements
  {
    name: 'First Purchase',
    description: 'Made your first purchase',
    category: 'spending',
    requirements: [{ type: 'total_spent', value: 100, timeframe: 'all_time' }],
    pointsReward: 50,
    icon: '🛒',
    color: '#10B981',
    rarity: 'common',
  },
  {
    name: 'Big Spender',
    description: 'Spent $100 or more',
    category: 'spending',
    requirements: [{ type: 'total_spent', value: 10000, timeframe: 'all_time' }],
    pointsReward: 200,
    icon: '💰',
    color: '#F59E0B',
    rarity: 'rare',
  },
  {
    name: 'Platinum Spender',
    description: 'Spent $500 or more',
    category: 'spending',
    requirements: [{ type: 'total_spent', value: 50000, timeframe: 'all_time' }],
    pointsReward: 500,
    icon: '💎',
    color: '#8B5CF6',
    rarity: 'epic',
  },

  // Loyalty achievements
  {
    name: '30-Day Streak',
    description: 'Active for 30 consecutive days',
    category: 'loyalty',
    requirements: [{ type: 'days_active', value: 30, timeframe: 'all_time' }],
    pointsReward: 100,
    icon: '🔥',
    color: '#EF4444',
    rarity: 'common',
  },
  {
    name: 'Loyal Fan',
    description: 'Active member for 6 months',
    category: 'loyalty',
    requirements: [{ type: 'days_active', value: 180, timeframe: 'all_time' }],
    pointsReward: 300,
    icon: '⭐',
    color: '#3B82F6',
    rarity: 'rare',
  },

  // Referral achievements
  {
    name: 'Friend Magnet',
    description: 'Referred 5 new members',
    category: 'referral',
    requirements: [{ type: 'referral_count', value: 5, timeframe: 'all_time' }],
    pointsReward: 250,
    icon: '🤝',
    color: '#06B6D4',
    rarity: 'rare',
  },

  // Engagement achievements
  {
    name: 'Super Fan',
    description: 'Interacted with content 100 times',
    category: 'engagement',
    requirements: [{ type: 'content_interactions', value: 100, timeframe: 'all_time' }],
    pointsReward: 150,
    icon: '👏',
    color: '#84CC16',
    rarity: 'common',
  },
];

// Program themes
export const PROGRAM_THEMES = {
  modern: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    backgroundColor: '#F8FAFC',
    textColor: '#1F2937',
    cardStyle: 'modern',
    borderRadius: 12,
    shadowIntensity: 'medium',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    enableAnimations: true,
    animationStyle: 'smooth',
  },

  playful: {
    primaryColor: '#EC4899',
    secondaryColor: '#BE185D',
    accentColor: '#F59E0B',
    backgroundColor: '#FDF2F8',
    textColor: '#831843',
    cardStyle: 'playful',
    borderRadius: 20,
    shadowIntensity: 'heavy',
    headingFont: 'Comic Sans MS',
    bodyFont: 'Nunito',
    enableAnimations: true,
    animationStyle: 'bouncy',
  },

  elegant: {
    primaryColor: '#1F2937',
    secondaryColor: '#374151',
    accentColor: '#D97706',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    cardStyle: 'classic',
    borderRadius: 8,
    shadowIntensity: 'light',
    headingFont: 'Playfair Display',
    bodyFont: 'Source Serif Pro',
    enableAnimations: true,
    animationStyle: 'subtle',
  },

  minimal: {
    primaryColor: '#6B7280',
    secondaryColor: '#4B5563',
    accentColor: '#10B981',
    backgroundColor: '#FAFAFA',
    textColor: '#374151',
    cardStyle: 'minimalist',
    borderRadius: 6,
    shadowIntensity: 'none',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    enableAnimations: false,
    animationStyle: 'subtle',
  },
};

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'points', label: 'Points', symbol: 'P' },
  { value: 'coins', label: 'Coins', symbol: '🪙' },
  { value: 'hearts', label: 'Hearts', symbol: '💖' },
  { value: 'stars', label: 'Stars', symbol: '⭐' },
  { value: 'gems', label: 'Gems', symbol: '💎' },
  { value: 'tokens', label: 'Tokens', symbol: '🎫' },
];

// Default limits and validation rules
export const LOYALTY_LIMITS = {
  programName: { min: 3, max: 50 },
  programDescription: { min: 10, max: 500 },
  tagline: { max: 100 },
  rewardName: { min: 3, max: 40 },
  rewardDescription: { min: 10, max: 200 },
  tierName: { min: 3, max: 25 },
  tierDescription: { min: 10, max: 150 },
  achievementName: { min: 3, max: 30 },
  achievementDescription: { min: 10, max: 120 },
  customPerk: { min: 5, max: 100 },
  pointsPerAction: { min: 1, max: 10000 },
  pointsCost: { min: 1, max: 100000 },
  discountPercentage: { min: 1, max: 100 },
  requiredPoints: { min: 0, max: 1000000 },
  expirationDays: { min: 1, max: 3650 }, // 10 years max
};

export const BADGE_ICONS = [
  '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '✨', '💎', '👑', '🎖️',
  '🏅', '🎭', '🎨', '🎪', '🎯', '🎲', '🎸', '🎵', '🎶', '🎤',
  '💖', '💝', '💕', '💘', '💗', '💓', '💟', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🤍', '🖤', '🤎', '❣️', '💔', '💋', '👑',
];

export const TIER_ICONS = [
  '👤', '⭐', '🌟', '✨', '💎', '👑', '🏆', '🥇', '🥈', '🥉',
  '🎖️', '🏅', '🎭', '💫', '🌈', '🦄', '🔥', '⚡', '💥', '🎨',
];

export const ACHIEVEMENT_ICONS = [
  '🏆', '🎯', '🎖️', '🏅', '⭐', '🌟', '✨', '💫', '🔥', '⚡',
  '💥', '🎉', '🎊', '🎈', '🎁', '🏰', '🗝️', '💎', '👑', '🦄',
];