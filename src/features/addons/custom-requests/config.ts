// 💌 CUSTOM CONTENT REQUESTS - CONFIGURATION

import { RequestConfig, RequestTemplate } from './types';

export const DEFAULT_REQUEST_CONFIG: RequestConfig = {
  enabled: true,
  
  // Request limits
  maxActiveRequests: 10, // Per requester
  maxPendingRequests: 50, // Per creator
  
  // Pricing
  minRequestPrice: 500, // $5 minimum
  maxRequestPrice: 100000, // $1000 maximum
  platformFee: 0.15, // 15% platform fee
  
  // Timing
  defaultDeadlineDays: 7,
  maxDeadlineDays: 30,
  autoAcceptanceHours: 48, // Auto-decline if no response in 48h
  
  // Features
  allowAnonymousRequests: true,
  allowRushDelivery: true,
  enableRequestTemplates: true,
  enableMessageThread: true,
  enableRevisions: true,
  maxRevisions: 3,
  
  // Content
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'mp3', 'wav', 'pdf', 'txt'],
  maxDeliverables: 10,
  
  // Categories and types
  enabledTypes: ['photo', 'video', 'audio', 'text', 'live_session', 'custom_message', 'outfit', 'role_play'],
  enabledCategories: ['general', 'photo_session', 'video_call', 'custom_content', 'personal_message', 'special_occasion'],
  
  // Quality control
  requireCreatorApproval: false,
  enableDisputeResolution: true,
  autoRefundDays: 14, // Auto-refund if not delivered in 14 days
  
  // Communication
  maxMessagesPerRequest: 100,
  enableFileSharing: true,
  enableVideoMessages: true,
};

// Request type configurations
export const REQUEST_TYPES = [
  {
    value: 'photo',
    label: 'Custom Photo',
    description: 'Request custom photos with specific poses, outfits, or themes',
    icon: '📸',
    color: '#EC4899',
    basePrice: 2500, // $25
    estimatedDelivery: 3, // days
    specifications: [
      { label: 'Photo Count', type: 'number', required: true },
      { label: 'Outfit/Style', type: 'text', required: true },
      { label: 'Pose/Theme', type: 'text', required: false },
      { label: 'Background/Setting', type: 'text', required: false },
    ],
  },
  {
    value: 'video',
    label: 'Custom Video',
    description: 'Request personalized videos with custom content',
    icon: '🎥',
    color: '#8B5CF6',
    basePrice: 5000, // $50
    estimatedDelivery: 5, // days
    specifications: [
      { label: 'Video Length (minutes)', type: 'number', required: true },
      { label: 'Content Type', type: 'choice', required: true, options: ['Casual', 'Sexy', 'Fetish', 'Roleplay', 'Educational'] },
      { label: 'Outfit Request', type: 'text', required: false },
      { label: 'Script/Dialogue', type: 'text', required: false },
      { label: 'Special Requests', type: 'text', required: false },
    ],
  },
  {
    value: 'audio',
    label: 'Voice Message',
    description: 'Custom voice recordings and audio content',
    icon: '🎤',
    color: '#F59E0B',
    basePrice: 1500, // $15
    estimatedDelivery: 2, // days
    specifications: [
      { label: 'Duration (minutes)', type: 'number', required: true },
      { label: 'Message Content', type: 'text', required: true },
      { label: 'Voice Style', type: 'choice', required: false, options: ['Sweet', 'Seductive', 'Playful', 'Professional'] },
      { label: 'Background Music', type: 'choice', required: false, options: ['None', 'Soft', 'Romantic', 'Upbeat'] },
    ],
  },
  {
    value: 'text',
    label: 'Written Content',
    description: 'Custom written messages, stories, or letters',
    icon: '✍️',
    color: '#10B981',
    basePrice: 1000, // $10
    estimatedDelivery: 2, // days
    specifications: [
      { label: 'Content Length', type: 'choice', required: true, options: ['Short (100-300 words)', 'Medium (300-500 words)', 'Long (500+ words)'] },
      { label: 'Content Type', type: 'choice', required: true, options: ['Personal Message', 'Story/Fantasy', 'Letter', 'Poem', 'Other'] },
      { label: 'Topic/Theme', type: 'text', required: true },
      { label: 'Tone/Style', type: 'choice', required: false, options: ['Romantic', 'Playful', 'Intimate', 'Professional'] },
    ],
  },
  {
    value: 'live_session',
    label: 'Live Session',
    description: 'Private live video or audio sessions',
    icon: '🔴',
    color: '#EF4444',
    basePrice: 10000, // $100
    estimatedDelivery: 1, // days (scheduling)
    specifications: [
      { label: 'Session Duration (minutes)', type: 'number', required: true },
      { label: 'Session Type', type: 'choice', required: true, options: ['Video Call', 'Audio Call', 'Chat Only'] },
      { label: 'Preferred Date', type: 'date', required: true },
      { label: 'Preferred Time', type: 'time', required: true },
      { label: 'Special Requests', type: 'text', required: false },
    ],
  },
  {
    value: 'custom_message',
    label: 'Personal Message',
    description: 'Personalized messages for special occasions',
    icon: '💌',
    color: '#F472B6',
    basePrice: 2000, // $20
    estimatedDelivery: 1, // days
    specifications: [
      { label: 'Recipient Name', type: 'text', required: true },
      { label: 'Occasion', type: 'choice', required: true, options: ['Birthday', 'Anniversary', 'Holiday', 'Congratulations', 'Other'] },
      { label: 'Message Type', type: 'choice', required: true, options: ['Video', 'Audio', 'Text', 'Photo with Text'] },
      { label: 'Personal Details', type: 'text', required: false },
    ],
  },
  {
    value: 'outfit',
    label: 'Outfit Request',
    description: 'Request specific outfits or clothing in content',
    icon: '👗',
    color: '#06B6D4',
    basePrice: 3000, // $30
    estimatedDelivery: 3, // days
    specifications: [
      { label: 'Outfit Description', type: 'text', required: true },
      { label: 'Content Type', type: 'choice', required: true, options: ['Photos', 'Video', 'Both'] },
      { label: 'Quantity', type: 'number', required: true },
      { label: 'Specific Poses', type: 'text', required: false },
    ],
  },
  {
    value: 'role_play',
    label: 'Role Play',
    description: 'Custom roleplay scenarios and characters',
    icon: '🎭',
    color: '#A855F7',
    basePrice: 7500, // $75
    estimatedDelivery: 5, // days
    specifications: [
      { label: 'Scenario/Character', type: 'text', required: true },
      { label: 'Content Format', type: 'choice', required: true, options: ['Video', 'Photos', 'Audio', 'Text Story'] },
      { label: 'Duration/Length', type: 'text', required: true },
      { label: 'Costume/Outfit', type: 'text', required: false },
      { label: 'Dialogue/Script', type: 'text', required: false },
    ],
  },
];

// Request categories
export const REQUEST_CATEGORIES = [
  {
    value: 'general',
    label: 'General Request',
    description: 'General custom content requests',
    icon: '📋',
    color: '#6B7280',
  },
  {
    value: 'photo_session',
    label: 'Photo Session',
    description: 'Custom photo shoots and photography',
    icon: '📷',
    color: '#EC4899',
  },
  {
    value: 'video_call',
    label: 'Video Call',
    description: 'Private video calls and live sessions',
    icon: '📹',
    color: '#EF4444',
  },
  {
    value: 'custom_content',
    label: 'Custom Content',
    description: 'Unique personalized content creation',
    icon: '🎨',
    color: '#8B5CF6',
  },
  {
    value: 'personal_message',
    label: 'Personal Message',
    description: 'Personalized messages and greetings',
    icon: '💬',
    color: '#F59E0B',
  },
  {
    value: 'special_occasion',
    label: 'Special Occasion',
    description: 'Content for birthdays, holidays, and events',
    icon: '🎉',
    color: '#10B981',
  },
];

// Priority levels
export const PRIORITY_LEVELS = [
  {
    value: 'low',
    label: 'Low Priority',
    color: '#6B7280',
    multiplier: 1,
    description: 'Standard delivery time',
  },
  {
    value: 'normal',
    label: 'Normal',
    color: '#3B82F6',
    multiplier: 1,
    description: 'Standard delivery time',
  },
  {
    value: 'high',
    label: 'High Priority',
    color: '#F59E0B',
    multiplier: 1.5,
    description: '50% faster delivery (+50% cost)',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    color: '#EF4444',
    multiplier: 2,
    description: '24-48 hour delivery (+100% cost)',
  },
];

// Status progression and colors
export const REQUEST_STATUSES = [
  { value: 'draft', label: 'Draft', color: '#6B7280', description: 'Request being prepared' },
  { value: 'submitted', label: 'Submitted', color: '#3B82F6', description: 'Waiting for creator response' },
  { value: 'quoted', label: 'Quoted', color: '#F59E0B', description: 'Creator provided quote' },
  { value: 'accepted', label: 'Accepted', color: '#10B981', description: 'Request accepted, payment processed' },
  { value: 'in_progress', label: 'In Progress', color: '#8B5CF6', description: 'Creator working on request' },
  { value: 'completed', label: 'Completed', color: '#059669', description: 'Content ready for delivery' },
  { value: 'delivered', label: 'Delivered', color: '#047857', description: 'Content delivered to requester' },
  { value: 'cancelled', label: 'Cancelled', color: '#DC2626', description: 'Request cancelled' },
  { value: 'disputed', label: 'Disputed', color: '#B91C1C', description: 'Request under dispute' },
];

// Default request templates
export const DEFAULT_TEMPLATES: Omit<RequestTemplate, 'id' | 'creatorId' | 'orderCount' | 'averageRating' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Custom Photo Set',
    description: 'Professional photo set with your specifications',
    type: 'photo',
    category: 'photo_session',
    basePrice: 3000,
    specifications: [
      { label: 'Number of Photos', type: 'number', required: true },
      { label: 'Outfit Style', type: 'text', required: true },
      { label: 'Theme/Mood', type: 'text', required: false },
      { label: 'Special Props', type: 'text', required: false },
    ],
    estimatedDeliveryDays: 3,
    maxRevisions: 2,
    allowCustomizations: true,
    requiresApproval: false,
    isActive: true,
  },
  {
    name: 'Personal Video Message',
    description: 'Personalized video message for any occasion',
    type: 'video',
    category: 'personal_message',
    basePrice: 2500,
    specifications: [
      { label: 'Recipient Name', type: 'text', required: true },
      { label: 'Message Length', type: 'choice', required: true, options: ['1-2 minutes', '2-3 minutes', '3-5 minutes'] },
      { label: 'Occasion', type: 'choice', required: true, options: ['Birthday', 'Anniversary', 'Holiday', 'Just Because'] },
      { label: 'Special Message', type: 'text', required: false },
    ],
    estimatedDeliveryDays: 2,
    maxRevisions: 1,
    allowCustomizations: true,
    requiresApproval: false,
    isActive: true,
  },
  {
    name: 'GFE Audio Message',
    description: 'Girlfriend experience voice message',
    type: 'audio',
    category: 'custom_content',
    basePrice: 2000,
    specifications: [
      { label: 'Duration (minutes)', type: 'number', required: true },
      { label: 'Scenario', type: 'text', required: true },
      { label: 'Voice Style', type: 'choice', required: false, options: ['Sweet', 'Playful', 'Intimate', 'Encouraging'] },
    ],
    estimatedDeliveryDays: 2,
    maxRevisions: 1,
    allowCustomizations: true,
    requiresApproval: false,
    isActive: true,
  },
];

// Utility functions
export const calculateRequestPrice = (basePrice: number, priority: string, rushDelivery: boolean = false): number => {
  const priorityLevel = PRIORITY_LEVELS.find(p => p.value === priority);
  let price = basePrice;
  
  if (priorityLevel && priorityLevel.multiplier > 1) {
    price *= priorityLevel.multiplier;
  }
  
  if (rushDelivery) {
    price *= 1.5; // 50% surcharge for rush delivery
  }
  
  return Math.round(price);
};

export const calculatePlatformFee = (price: number): number => {
  return Math.round(price * DEFAULT_REQUEST_CONFIG.platformFee);
};

export const calculateCreatorEarnings = (price: number): number => {
  return price - calculatePlatformFee(price);
};

export const getRequestTypeInfo = (type: string) => {
  return REQUEST_TYPES.find(t => t.value === type) || REQUEST_TYPES[0];
};

export const getCategoryInfo = (category: string) => {
  return REQUEST_CATEGORIES.find(c => c.value === category) || REQUEST_CATEGORIES[0];
};

export const getStatusInfo = (status: string) => {
  return REQUEST_STATUSES.find(s => s.value === status) || REQUEST_STATUSES[0];
};

export const getPriorityInfo = (priority: string) => {
  return PRIORITY_LEVELS.find(p => p.value === priority) || PRIORITY_LEVELS[1];
};

export const isRequestExpired = (deadline?: string): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

export const getTimeUntilDeadline = (deadline?: string): string => {
  if (!deadline) return 'No deadline set';
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Deadline passed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  return 'Less than 1 hour left';
};

export const validateRequestSpecifications = (specs: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  specs.forEach((spec, index) => {
    if (spec.required && (!spec.value || spec.value.trim().length === 0)) {
      errors.push(`${spec.label} is required`);
    }
    
    if (spec.type === 'number' && spec.value && isNaN(Number(spec.value))) {
      errors.push(`${spec.label} must be a valid number`);
    }
    
    if (spec.type === 'choice' && spec.value && spec.options && !spec.options.includes(spec.value)) {
      errors.push(`${spec.label} must be one of the available options`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const generateRequestShareUrl = (requestId: string): string => {
  return `${window.location.origin}/request/${requestId}`;
};

export const getEstimatedDelivery = (type: string, priority: string = 'normal'): number => {
  const typeInfo = getRequestTypeInfo(type);
  const priorityInfo = getPriorityInfo(priority);
  
  let baseDays = typeInfo.estimatedDelivery;
  
  if (priority === 'high') {
    baseDays = Math.ceil(baseDays * 0.7); // 30% faster
  } else if (priority === 'urgent') {
    baseDays = Math.max(1, Math.ceil(baseDays * 0.4)); // 60% faster, min 1 day
  }
  
  return baseDays;
};

export const canUserMakeRequest = (user: any): { canRequest: boolean; reason?: string } => {
  if (!user) {
    return { canRequest: false, reason: 'Must be logged in to make requests' };
  }
  
  if (user.activeRequests >= DEFAULT_REQUEST_CONFIG.maxActiveRequests) {
    return { canRequest: false, reason: `Maximum of ${DEFAULT_REQUEST_CONFIG.maxActiveRequests} active requests allowed` };
  }
  
  if (!user.canMakePurchases) {
    return { canRequest: false, reason: 'Payment method required to make requests' };
  }
  
  return { canRequest: true };
};