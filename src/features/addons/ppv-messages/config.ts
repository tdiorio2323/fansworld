// 🔒 PPV MESSAGES - CONFIGURATION SETTINGS

import { PPVConfig, PPVRevenueShare, PPVSubscriptionDiscount } from './types';

export const DEFAULT_PPV_CONFIG: PPVConfig = {
  enabled: true,
  minPrice: 99, // $0.99 minimum
  maxPrice: 99999, // $999.99 maximum
  platformCommission: 0.20, // 20% platform fee
  creatorCommission: 0.80, // 80% creator earnings
  maxContentItems: 10, // Max 10 content pieces per message
  maxFileSize: 100 * 1024 * 1024, // 100MB max file size
  supportedFileTypes: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    // Documents
    'application/pdf',
    'text/plain',
  ],
  defaultExpirationDays: 30, // Messages expire after 30 days by default
  allowPreviewText: true,
  allowThumbnails: true,
  allowExpiration: true,
  allowViewLimits: true,
  maxPreviewLength: 100, // 100 characters preview
  watermarkEnabled: false, // Disable watermarks initially
};

// Pricing tiers for quick selection
export const PPV_PRICING_TIERS = [
  { label: '$0.99', value: 99, description: 'Budget tier' },
  { label: '$2.99', value: 299, description: 'Popular choice' },
  { label: '$4.99', value: 499, description: 'Premium content' },
  { label: '$9.99', value: 999, description: 'High-value content' },
  { label: '$19.99', value: 1999, description: 'Exclusive content' },
  { label: '$49.99', value: 4999, description: 'Luxury content' },
  { label: '$99.99', value: 9999, description: 'Ultra-premium' },
];

// Content type configurations
export const CONTENT_TYPE_CONFIG = {
  text: {
    icon: '📝',
    label: 'Text',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    maxSize: 10000, // 10KB text limit
    description: 'Written content, stories, messages',
  },
  image: {
    icon: '🖼️',
    label: 'Image',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    maxSize: 25 * 1024 * 1024, // 25MB
    description: 'Photos, artwork, graphics',
  },
  video: {
    icon: '🎬',
    label: 'Video',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    maxSize: 100 * 1024 * 1024, // 100MB
    description: 'Video content, clips, recordings',
  },
  audio: {
    icon: '🎵',
    label: 'Audio',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Voice messages, music, sounds',
  },
  file: {
    icon: '📁',
    label: 'File',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    maxSize: 25 * 1024 * 1024, // 25MB
    description: 'Documents, PDFs, other files',
  },
};

// Revenue sharing configuration
export const PPV_REVENUE_SHARE: PPVRevenueShare = {
  platformFee: 0.20, // 20% to platform
  creatorShare: 0.77, // 77% to creator
  processingFee: 0.03, // 3% payment processing (Stripe fees)
  taxWithholding: 0.00, // No tax withholding by default
};

// Subscription tier discounts for PPV messages
export const PPV_SUBSCRIPTION_DISCOUNTS: PPVSubscriptionDiscount[] = [
  {
    subscriberTier: 'basic',
    discountPercentage: 10, // 10% off for basic subscribers
    appliesTo: 'creator_messages',
  },
  {
    subscriberTier: 'premium',
    discountPercentage: 20, // 20% off for premium subscribers
    appliesTo: 'creator_messages',
  },
  {
    subscriberTier: 'vip',
    discountPercentage: 30, // 30% off for VIP subscribers
    appliesTo: 'all',
  },
];

// Popular tags for categorizing PPV messages
export const PPV_POPULAR_TAGS = [
  // Content categories
  'behind-the-scenes', 'exclusive', 'tutorial', 'personal', 'story',
  'workout', 'cooking', 'travel', 'lifestyle', 'fashion', 'beauty',
  'gaming', 'music', 'art', 'photography', 'writing', 'business',
  
  // Content types
  'photos', 'videos', 'audio', 'text', 'documents', 'voice-message',
  
  // Special categories  
  'limited-edition', 'early-access', 'custom-request', 'collaboration',
  'live-recording', 'unedited', 'raw-footage', 'deleted-scenes',
  
  // Pricing related
  'premium', 'luxury', 'budget-friendly', 'value-pack', 'bundle',
];

// Quick actions for message management
export const PPV_QUICK_ACTIONS = [
  { id: 'duplicate', label: 'Duplicate', icon: '📋' },
  { id: 'edit', label: 'Edit', icon: '✏️' },
  { id: 'promote', label: 'Promote', icon: '📢' },
  { id: 'archive', label: 'Archive', icon: '📦' },
  { id: 'delete', label: 'Delete', icon: '🗑️' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'share', label: 'Share', icon: '🔗' },
];

// Message status indicators
export const PPV_STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: '✅',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    icon: '⏸️',
  },
  expired: {
    label: 'Expired',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: '⏰',
  },
  sold_out: {
    label: 'Sold Out',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: '🎯',
  },
  pending: {
    label: 'Pending Review',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: '👁️',
  },
};

// Analytics time periods
export const ANALYTICS_PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
  { label: 'This year', value: 'year' },
  { label: 'All time', value: 'all' },
];

// Content moderation categories
export const MODERATION_CATEGORIES = [
  {
    id: 'inappropriate',
    label: 'Inappropriate Content',
    description: 'Content that violates community guidelines',
    severity: 'high',
  },
  {
    id: 'copyright',
    label: 'Copyright Infringement',
    description: 'Unauthorized use of copyrighted material',
    severity: 'high',
  },
  {
    id: 'spam',
    label: 'Spam or Misleading',
    description: 'Spam content or misleading descriptions',
    severity: 'medium',
  },
  {
    id: 'misleading',
    label: 'Misleading Pricing',
    description: 'Price doesn\'t match content quality',
    severity: 'low',
  },
  {
    id: 'other',
    label: 'Other Issues',
    description: 'Other policy violations',
    severity: 'medium',
  },
];

// Payment method configurations
export const PAYMENT_METHODS = {
  stripe: {
    label: 'Credit Card',
    icon: '💳',
    processingFee: 0.029, // 2.9% + $0.30
    fixedFee: 30, // $0.30 in cents
    description: 'Visa, Mastercard, American Express',
    instantPayout: false,
  },
  wallet: {
    label: 'Platform Wallet',
    icon: '👛',
    processingFee: 0.0, // No fees for wallet
    fixedFee: 0,
    description: 'Use your platform balance',
    instantPayout: true,
  },
  credits: {
    label: 'Platform Credits',
    icon: '🪙',
    processingFee: 0.0, // No fees for credits
    fixedFee: 0,
    description: 'Use earned or purchased credits',
    instantPayout: true,
  },
};

// File upload configurations
export const UPLOAD_CONFIG = {
  maxFiles: 10,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: {
    images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    videos: ['mp4', 'webm', 'mov', 'avi'],
    audio: ['mp3', 'wav', 'ogg', 'm4a'],
    documents: ['pdf', 'txt', 'doc', 'docx'],
  },
  thumbnailSize: {
    width: 300,
    height: 200,
  },
  watermark: {
    enabled: false,
    position: 'bottom-right',
    opacity: 0.7,
    text: 'Cabana PPV',
  },
};

// Promo code templates
export const PROMO_CODE_TEMPLATES = [
  { code: 'WELCOME10', type: 'percentage', value: 10, description: 'Welcome discount for new buyers' },
  { code: 'FLASH20', type: 'percentage', value: 20, description: 'Flash sale discount' },
  { code: 'SAVE5', type: 'fixed', value: 500, description: '$5 off any purchase' }, // 500 cents = $5
  { code: 'BULK30', type: 'percentage', value: 30, description: 'Bulk purchase discount' },
  { code: 'LOYAL15', type: 'percentage', value: 15, description: 'Loyal customer discount' },
];

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  purchase_completed: {
    title: '🎉 PPV Purchase Successful!',
    message: 'You now have access to "{messageTitle}" by @{creatorUsername}',
  },
  message_expired: {
    title: '⏰ PPV Message Expired',
    message: 'Your PPV message "{messageTitle}" has expired and is no longer available',
  },
  earnings_milestone: {
    title: '💰 Earnings Milestone!',
    message: 'Congratulations! You\'ve earned ${amount} from PPV messages',
  },
  new_purchase: {
    title: '💳 New PPV Sale!',
    message: '@{buyerUsername} purchased your message "{messageTitle}" for ${amount}',
  },
};

// Export utility functions
export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

export const calculateCreatorEarnings = (priceInCents: number): number => {
  const afterPlatformFee = priceInCents * (1 - PPV_REVENUE_SHARE.platformFee);
  const afterProcessingFee = afterPlatformFee - (PPV_REVENUE_SHARE.processingFee * priceInCents);
  return Math.max(0, Math.floor(afterProcessingFee));
};

export const calculatePlatformFee = (priceInCents: number): number => {
  return Math.floor(priceInCents * PPV_REVENUE_SHARE.platformFee);
};

export const getFileTypeFromMime = (mimeType: string): 'text' | 'image' | 'video' | 'audio' | 'file' => {
  if (mimeType.startsWith('text/')) return 'text';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
};

export const isFileTypeSupported = (mimeType: string): boolean => {
  return DEFAULT_PPV_CONFIG.supportedFileTypes.includes(mimeType);
};

export const getMaxFileSizeForType = (type: 'text' | 'image' | 'video' | 'audio' | 'file'): number => {
  return CONTENT_TYPE_CONFIG[type].maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};