// 📚 STORIES & HIGHLIGHTS - TYPE DEFINITIONS

export interface Story {
  id: string;
  creatorId: string;
  title: string;
  content: StoryContent[];
  thumbnailUrl?: string;
  highlightId?: string; // If saved to a highlight
  
  // Visibility and access
  isPublic: boolean;
  requiresSubscription?: boolean;
  isPremium?: boolean; // Requires payment to view
  premiumPrice?: number; // in cents
  
  // Engagement
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // Timing
  expiresAt?: string; // 24hr default, can be extended
  createdAt: string;
  updatedAt: string;
  
  // Metadata
  tags: string[];
  location?: string;
  mood?: 'happy' | 'excited' | 'sexy' | 'flirty' | 'mysterious' | 'playful';
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  views?: StoryView[];
  likes?: StoryLike[];
  comments?: StoryComment[];
}

export interface StoryContent {
  id: string;
  type: 'image' | 'video' | 'text' | 'poll' | 'question';
  url?: string; // For image/video
  text?: string; // For text content
  duration?: number; // Display duration in seconds
  order: number;
  
  // Interactive elements
  poll?: {
    question: string;
    options: string[];
    votes: Record<string, number>; // option -> vote count
  };
  question?: {
    text: string;
    placeholder?: string;
  };
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  textAlign?: 'left' | 'center' | 'right';
  
  // Effects
  filter?: 'none' | 'vintage' | 'dramatic' | 'bright' | 'soft';
  stickers?: StorySticker[];
}

export interface StorySticker {
  id: string;
  type: 'emoji' | 'gif' | 'location' | 'mention' | 'hashtag' | 'music';
  content: string;
  x: number; // Position as percentage
  y: number;
  scale: number;
  rotation: number;
}

export interface StoryView {
  id: string;
  storyId: string;
  viewerId: string;
  viewedAt: string;
  completedPercentage: number; // 0-100
  interacted: boolean; // Liked, commented, etc.
  
  viewer?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface StoryLike {
  id: string;
  storyId: string;
  userId: string;
  createdAt: string;
  
  user?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface StoryComment {
  id: string;
  storyId: string;
  userId: string;
  content: string;
  createdAt: string;
  
  user?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface Highlight {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  coverUrl?: string;
  coverStoryId?: string; // Use story as cover
  
  // Content
  storyIds: string[];
  storyCount: number;
  
  // Settings
  isPublic: boolean;
  requiresSubscription?: boolean;
  order: number; // Display order on profile
  
  // Stats
  viewCount: number;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  stories?: Story[];
}

export interface StoryCreateRequest {
  title: string;
  content: Omit<StoryContent, 'id'>[];
  isPublic: boolean;
  requiresSubscription?: boolean;
  isPremium?: boolean;
  premiumPrice?: number;
  tags: string[];
  location?: string;
  mood?: Story['mood'];
  expiresAt?: string;
}

export interface StoryUpdateRequest {
  title?: string;
  isPublic?: boolean;
  tags?: string[];
  highlightId?: string; // Add to highlight
}

export interface HighlightCreateRequest {
  title: string;
  description?: string;
  coverUrl?: string;
  storyIds?: string[];
  isPublic: boolean;
  requiresSubscription?: boolean;
}

export interface HighlightUpdateRequest {
  title?: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
  order?: number;
  storyIds?: string[]; // Replace all stories
}

export interface StoryFilter {
  creatorId?: string;
  isPublic?: boolean;
  isPremium?: boolean;
  tags?: string[];
  mood?: Story['mood'];
  hasHighlight?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'most_viewed';
  limit?: number;
  offset?: number;
}

export interface StoryStats {
  totalStories: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageViewDuration: number;
  completionRate: number; // Percentage who view full story
  engagementRate: number; // Likes + comments / views
  premiumRevenue: number; // Revenue from premium stories
  
  // Analytics
  viewsByHour: Array<{
    hour: string;
    views: number;
    engagement: number;
  }>;
  topPerformingStories: Story[];
  audienceInsights: {
    topViewers: Array<{
      userId: string;
      username: string;
      viewCount: number;
      engagementRate: number;
    }>;
    demographics: {
      ageGroups: Record<string, number>;
      locations: Record<string, number>;
    };
  };
}

export interface StoryAnalytics {
  storyId: string;
  views: number;
  uniqueViews: number;
  likes: number;
  comments: number;
  shares: number;
  completionRate: number;
  averageWatchTime: number;
  engagementRate: number;
  revenue?: number; // For premium stories
  
  // Detailed metrics
  viewerRetention: Array<{
    timePercent: number; // 0-100
    viewerCount: number;
  }>;
  
  interactionHeatmap: Array<{
    contentIndex: number;
    interactions: number;
    dropoffRate: number;
  }>;
  
  audienceBreakdown: {
    subscribers: number;
    nonSubscribers: number;
    newViewers: number;
    returningViewers: number;
  };
}

// Real-time story events
export interface StoryViewEvent {
  type: 'STORY_VIEWED';
  story: Story;
  viewer: {
    id: string;
    username: string;
  };
  timestamp: string;
}

export interface StoryLikeEvent {
  type: 'STORY_LIKED';
  story: Story;
  user: {
    id: string;
    username: string;
  };
  timestamp: string;
}

export interface StoryCommentEvent {
  type: 'STORY_COMMENTED';
  story: Story;
  comment: StoryComment;
  timestamp: string;
}

// Story templates and suggestions
export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'behind_scenes' | 'announcement' | 'question' | 'poll' | 'teaser' | 'lifestyle';
  content: Omit<StoryContent, 'id'>[];
  thumbnailUrl?: string;
  isPopular: boolean;
}

export interface StoryConfig {
  enabled: boolean;
  maxDuration: number; // Max story duration in hours
  maxContentItems: number; // Max slides per story
  allowPremiumStories: boolean;
  maxPremiumPrice: number; // in cents
  autoExpiry: boolean;
  defaultExpiry: number; // hours
  maxHighlights: number; // Per creator
  storiesPerHighlight: number; // Max stories per highlight
  fileUploadLimits: {
    maxImageSize: number; // bytes
    maxVideoSize: number;
    maxVideoLength: number; // seconds
    allowedFormats: string[];
  };
  features: {
    polls: boolean;
    questions: boolean;
    stickers: boolean;
    music: boolean;
    filters: boolean;
    mentions: boolean;
    hashtags: boolean;
    location: boolean;
  };
}