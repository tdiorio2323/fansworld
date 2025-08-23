// 🏷️ AI CONTENT TAGGING - CONFIGURATION

import { AITaggingConfig, TagTemplate } from './types';

export const DEFAULT_AI_TAGGING_CONFIG: AITaggingConfig = {
  enabled: true,
  
  // AI Service settings
  aiProvider: 'openai',
  modelVersion: 'gpt-4-vision-preview',
  
  // Processing settings
  autoProcess: true,
  batchSize: 10,
  maxProcessingTime: 30, // 30 seconds
  
  // Tag settings
  minConfidence: 0.7,
  maxTagsPerContent: 15,
  enableCustomTags: true,
  enableCommunityTags: true,
  
  // Content types to process
  enabledContentTypes: ['image', 'video', 'text'],
  
  // Visual analysis settings
  enableFaceDetection: true,
  enableObjectDetection: true,
  enableSceneAnalysis: true,
  enableColorAnalysis: true,
  
  // Text analysis settings
  enableSentimentAnalysis: true,
  enableTopicExtraction: true,
  enableLanguageDetection: true,
  
  // Safety and moderation
  enableSafetyAnalysis: true,
  strictNSFWDetection: false, // Creator platform, more permissive
  autoModeration: false,
  requireManualReview: true, // For sensitive content
  
  // Creator control
  allowCreatorOverride: true,
  requireCreatorApproval: false, // Auto-apply high-confidence tags
  showConfidenceScores: true,
  
  // Performance
  enableCaching: true,
  cacheExpiry: 24, // 24 hours
  enablePreprocessing: true,
  
  // Automation
  enableTagRules: true,
  maxRulesPerCreator: 20,
  
  // Analytics
  enableAnalytics: true,
  trackTagPerformance: true,
  enableA11Testing: true,
};

// Pre-defined tag categories with colors and descriptions
export const TAG_CATEGORIES = [
  {
    name: 'appearance',
    label: 'Appearance',
    color: '#EC4899',
    description: 'Physical appearance, body features, hair, etc.',
    icon: '👤',
    examples: ['blonde', 'curvy', 'tall', 'blue-eyes', 'tattoed'],
  },
  {
    name: 'clothing',
    label: 'Clothing',
    color: '#8B5CF6',
    description: 'Outfits, accessories, footwear',
    icon: '👗',
    examples: ['lingerie', 'bikini', 'dress', 'heels', 'jewelry'],
  },
  {
    name: 'pose',
    label: 'Pose',
    color: '#F59E0B',
    description: 'Body position, facial expression',
    icon: '🤳',
    examples: ['mirror-selfie', 'lying-down', 'standing', 'dancing', 'yoga-pose'],
  },
  {
    name: 'setting',
    label: 'Setting',
    color: '#10B981',
    description: 'Location, environment, background',
    icon: '🏠',
    examples: ['bedroom', 'bathroom', 'outdoors', 'studio', 'kitchen'],
  },
  {
    name: 'mood',
    label: 'Mood',
    color: '#EF4444',
    description: 'Emotional tone, vibe, atmosphere',
    icon: '😊',
    examples: ['playful', 'sexy', 'romantic', 'confident', 'mysterious'],
  },
  {
    name: 'style',
    label: 'Style',
    color: '#06B6D4',
    description: 'Aesthetic style, theme, genre',
    icon: '🎨',
    examples: ['vintage', 'modern', 'gothic', 'boho', 'minimalist'],
  },
  {
    name: 'content_type',
    label: 'Content Type',
    color: '#A855F7',
    description: 'Type of content or media',
    icon: '📱',
    examples: ['selfie', 'photoshoot', 'workout', 'cooking', 'tutorial'],
  },
  {
    name: 'activity',
    label: 'Activity',
    color: '#84CC16',
    description: 'What the person is doing',
    icon: '🏃',
    examples: ['exercising', 'reading', 'eating', 'dancing', 'relaxing'],
  },
  {
    name: 'object',
    label: 'Objects',
    color: '#F97316',
    description: 'Props, items, accessories in scene',
    icon: '🔧',
    examples: ['phone', 'mirror', 'bed', 'flowers', 'wine-glass'],
  },
  {
    name: 'custom',
    label: 'Custom',
    color: '#6B7280',
    description: 'Creator-specific or unique tags',
    icon: '⭐',
    examples: ['signature-pose', 'favorite-outfit', 'special-occasion'],
  },
];

// Common tag templates for different creator types
export const TAG_TEMPLATES: TagTemplate[] = [
  {
    id: 'fitness-creator',
    name: 'Fitness Creator',
    description: 'Tags for fitness and wellness content',
    category: 'creator_type',
    isPopular: true,
    tags: [
      { name: 'workout', category: 'activity', color: '#EF4444' },
      { name: 'gym', category: 'setting', color: '#374151' },
      { name: 'athletic-wear', category: 'clothing', color: '#1F2937' },
      { name: 'fitness-motivation', category: 'mood', color: '#059669' },
      { name: 'healthy-lifestyle', category: 'content_type', color: '#10B981' },
      { name: 'exercise-routine', category: 'activity', color: '#DC2626' },
      { name: 'post-workout', category: 'mood', color: '#F59E0B' },
      { name: 'yoga', category: 'activity', color: '#8B5CF6' },
      { name: 'meditation', category: 'activity', color: '#06B6D4' },
      { name: 'progress-photo', category: 'content_type', color: '#EC4899' },
    ],
  },
  {
    id: 'lifestyle-creator',
    name: 'Lifestyle Creator',
    description: 'Tags for lifestyle and daily life content',
    category: 'creator_type',
    isPopular: true,
    tags: [
      { name: 'daily-life', category: 'content_type', color: '#6B7280' },
      { name: 'morning-routine', category: 'activity', color: '#F59E0B' },
      { name: 'self-care', category: 'activity', color: '#EC4899' },
      { name: 'cozy', category: 'mood', color: '#A855F7' },
      { name: 'aesthetic', category: 'style', color: '#8B5CF6' },
      { name: 'minimalist', category: 'style', color: '#374151' },
      { name: 'coffee-time', category: 'activity', color: '#92400E' },
      { name: 'skincare', category: 'activity', color: '#F472B6' },
      { name: 'home-decor', category: 'setting', color: '#10B981' },
      { name: 'inspiration', category: 'mood', color: '#FBBF24' },
    ],
  },
  {
    id: 'fashion-creator',
    name: 'Fashion Creator',
    description: 'Tags for fashion and style content',
    category: 'creator_type',
    isPopular: true,
    tags: [
      { name: 'ootd', category: 'content_type', color: '#EC4899' },
      { name: 'fashion-haul', category: 'content_type', color: '#8B5CF6' },
      { name: 'styling-tips', category: 'content_type', color: '#F59E0B' },
      { name: 'designer', category: 'style', color: '#1F2937' },
      { name: 'casual-chic', category: 'style', color: '#6B7280' },
      { name: 'evening-wear', category: 'clothing', color: '#7C2D12' },
      { name: 'accessories', category: 'clothing', color: '#FBBF24' },
      { name: 'trendy', category: 'style', color: '#EF4444' },
      { name: 'vintage-fashion', category: 'style', color: '#92400E' },
      { name: 'lookbook', category: 'content_type', color: '#A855F7' },
    ],
  },
  {
    id: 'adult-creator',
    name: 'Adult Creator',
    description: 'Tags for adult and intimate content',
    category: 'creator_type',
    isPopular: true,
    tags: [
      { name: 'lingerie', category: 'clothing', color: '#EC4899' },
      { name: 'boudoir', category: 'style', color: '#7C2D12' },
      { name: 'intimate', category: 'mood', color: '#DC2626' },
      { name: 'seductive', category: 'pose', color: '#B91C1C' },
      { name: 'bedroom', category: 'setting', color: '#374151' },
      { name: 'sensual', category: 'mood', color: '#EF4444' },
      { name: 'artistic-nude', category: 'style', color: '#6B7280' },
      { name: 'glamour', category: 'style', color: '#FBBF24' },
      { name: 'fetish', category: 'content_type', color: '#7C2D12' },
      { name: 'roleplay', category: 'content_type', color: '#A855F7' },
    ],
  },
  {
    id: 'gaming-creator',
    name: 'Gaming Creator',
    description: 'Tags for gaming and streaming content',
    category: 'creator_type',
    isPopular: false,
    tags: [
      { name: 'gaming-setup', category: 'setting', color: '#1F2937' },
      { name: 'streaming', category: 'activity', color: '#EF4444' },
      { name: 'gamer-girl', category: 'appearance', color: '#EC4899' },
      { name: 'cosplay', category: 'clothing', color: '#8B5CF6' },
      { name: 'rgb-lighting', category: 'style', color: '#06B6D4' },
      { name: 'headset', category: 'object', color: '#374151' },
      { name: 'victory-pose', category: 'pose', color: '#10B981' },
      { name: 'late-night-gaming', category: 'mood', color: '#7C2D12' },
      { name: 'tournament', category: 'activity', color: '#F59E0B' },
      { name: 'retro-gaming', category: 'style', color: '#92400E' },
    ],
  },
];

// AI prompts for different content types
export const AI_ANALYSIS_PROMPTS = {
  image: {
    general: `Analyze this image and provide detailed tags for a creator platform. Focus on:
- Physical appearance and features
- Clothing, outfits, and accessories  
- Pose, expression, and body language
- Setting, location, and background
- Mood, style, and aesthetic
- Objects and props visible
- Lighting and composition
- Content type and activity

Provide tags that are specific, accurate, and useful for content discovery. Include confidence scores.`,

    nsfw: `Analyze this adult content image professionally. Provide tags for:
- Clothing/lingerie/attire
- Pose and positioning 
- Setting and environment
- Style and aesthetic
- Mood and atmosphere
- Content category

Be descriptive but tasteful. Focus on artistic and technical aspects.`,

    fashion: `Analyze this fashion/style image focusing on:
- Specific clothing items and brands
- Color combinations and patterns
- Style categories (casual, formal, vintage, etc.)
- Accessories and footwear
- Fashion trends represented
- Styling techniques shown
- Occasion appropriateness`,
  },

  video: {
    general: `Analyze this video content and provide relevant tags for:
- Main activities and actions
- Setting and location
- Participants and their appearance
- Mood and atmosphere
- Content type and category
- Audio elements (if present)
- Technical quality aspects

Focus on the most prominent and distinctive elements.`,

    tutorial: `Analyze this tutorial/educational video for:
- Subject matter being taught
- Skill level (beginner, intermediate, advanced)
- Tools and materials used
- Teaching methods employed
- Target audience
- Practical applications`,
  },

  text: {
    general: `Analyze this text content and extract relevant tags for:
- Main topics and themes
- Emotional tone and sentiment
- Writing style and format
- Target audience
- Content category
- Key concepts mentioned
- Language complexity level

Provide tags that help with content discovery and organization.`,

    story: `Analyze this story/narrative content for:
- Genre and category
- Themes and motifs
- Character types
- Setting and time period
- Mood and atmosphere
- Target audience
- Content warnings if applicable`,
  },

  audio: {
    general: `Analyze this audio content for:
- Content type (music, speech, sounds)
- Mood and emotional tone
- Audio quality and production
- Genre or category
- Instrumentation (if music)
- Speaking style (if speech)
- Background elements`,

    music: `Analyze this music content for:
- Genre and subgenre
- Tempo and rhythm
- Instruments present
- Vocal characteristics
- Mood and energy level
- Production style
- Era or time period`,
  },
};

// Predefined tag suggestions for common scenarios
export const SUGGESTED_TAG_SETS = {
  mirror_selfie: ['mirror-selfie', 'bathroom', 'phone', 'reflection', 'self-portrait'],
  bedroom_content: ['bedroom', 'bed', 'intimate', 'private', 'cozy'],
  workout_content: ['workout', 'fitness', 'athletic-wear', 'gym', 'exercise', 'healthy'],
  outfit_post: ['ootd', 'fashion', 'style', 'clothing', 'accessories'],
  makeup_content: ['makeup', 'beauty', 'cosmetics', 'skincare', 'tutorial'],
  food_content: ['food', 'cooking', 'kitchen', 'recipe', 'culinary'],
  travel_content: ['travel', 'vacation', 'adventure', 'outdoors', 'destination'],
  pet_content: ['pet', 'animal', 'cute', 'companion', 'lifestyle'],
};

// Content safety categories and thresholds
export const SAFETY_THRESHOLDS = {
  nsfw: {
    explicit: 0.9,
    suggestive: 0.7,
    mild: 0.5,
  },
  violence: {
    graphic: 0.8,
    mild: 0.6,
  },
  substance: {
    drugs: 0.8,
    alcohol: 0.6,
    tobacco: 0.5,
  },
  hate_speech: {
    severe: 0.9,
    moderate: 0.7,
    mild: 0.5,
  },
};

// AI model configurations for different providers
export const AI_MODELS = {
  openai: {
    vision: 'gpt-4-vision-preview',
    text: 'gpt-4-turbo-preview',
    embedding: 'text-embedding-ada-002',
    moderation: 'text-moderation-latest',
  },
  google: {
    vision: 'gemini-pro-vision',
    text: 'gemini-pro',
    safety: 'text-bison-safety',
  },
  aws: {
    vision: 'amazon.rekognition',
    text: 'amazon.comprehend',
    moderation: 'amazon.content-moderation',
  },
  azure: {
    vision: 'azure-computer-vision',
    text: 'azure-text-analytics',
    moderation: 'azure-content-moderator',
  },
};

// Utility functions
export const getCategoryInfo = (categoryName: string) => {
  return TAG_CATEGORIES.find(cat => cat.name === categoryName) || TAG_CATEGORIES[0];
};

export const getTagColor = (category: string): string => {
  const categoryInfo = getCategoryInfo(category);
  return categoryInfo.color;
};

export const calculateTagRelevanceScore = (tag: any, content: any): number => {
  let score = tag.confidence || 0.5;
  
  // Boost score for high-confidence AI tags
  if (tag.source === 'ai_vision' && tag.confidence > 0.8) {
    score += 0.1;
  }
  
  // Boost score for manually added tags
  if (tag.source === 'manual') {
    score += 0.2;
  }
  
  // Boost score for frequently used tags
  if (tag.usageCount > 100) {
    score += 0.05;
  }
  
  return Math.min(score, 1.0);
};

export const filterTagsByNSFW = (tags: any[], allowNSFW: boolean = false) => {
  if (allowNSFW) return tags;
  return tags.filter(tag => !tag.isNSFW);
};

export const groupTagsByCategory = (tags: any[]) => {
  const grouped: Record<string, any[]> = {};
  
  tags.forEach(tag => {
    const category = tag.category || 'custom';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(tag);
  });
  
  return grouped;
};

export const generateTagSuggestions = (existingTags: string[], contentType: string): string[] => {
  const suggestions: string[] = [];
  
  // Logic to suggest complementary tags based on existing ones
  existingTags.forEach(tag => {
    const relatedSets = Object.entries(SUGGESTED_TAG_SETS).find(([key, tags]) => 
      tags.includes(tag.toLowerCase())
    );
    
    if (relatedSets) {
      relatedSets[1].forEach(suggestedTag => {
        if (!existingTags.includes(suggestedTag) && !suggestions.includes(suggestedTag)) {
          suggestions.push(suggestedTag);
        }
      });
    }
  });
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

export const validateTagName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Tag name cannot be empty' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Tag name cannot exceed 50 characters' };
  }
  
  if (!/^[a-zA-Z0-9\-_\s]+$/.test(name)) {
    return { isValid: false, error: 'Tag name can only contain letters, numbers, hyphens, underscores, and spaces' };
  }
  
  return { isValid: true };
};

export const formatTagForDisplay = (tag: any): string => {
  return tag.name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

export const getProcessingEstimate = (contentType: string, fileSize?: number): number => {
  // Return estimated processing time in seconds
  const baseTime = {
    image: 5,
    video: 15,
    audio: 10,
    text: 2,
  };
  
  let estimate = baseTime[contentType as keyof typeof baseTime] || 5;
  
  // Adjust for file size (for video/audio)
  if (fileSize && (contentType === 'video' || contentType === 'audio')) {
    const sizeMB = fileSize / (1024 * 1024);
    estimate += Math.ceil(sizeMB / 10) * 2; // +2s per 10MB
  }
  
  return Math.min(estimate, DEFAULT_AI_TAGGING_CONFIG.maxProcessingTime);
};