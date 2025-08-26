// 🏷️ AI CONTENT TAGGING - TYPE DEFINITIONS

export interface ContentTag {
  id: string;
  name: string;
  category: 'appearance' | 'clothing' | 'pose' | 'setting' | 'mood' | 'style' | 'content_type' | 'activity' | 'object' | 'custom';
  confidence: number; // 0-1, AI confidence in tag accuracy
  source: 'ai_vision' | 'ai_text' | 'manual' | 'suggested' | 'community';
  color?: string; // Hex color for tag display
  description?: string;
  isNSFW: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  usageCount: number; // How often this tag is used
  
  // AI specific
  modelVersion?: string; // AI model version that generated this tag
  boundingBox?: { // For visual content
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ContentAnalysis {
  id: string;
  contentId: string;
  contentType: 'image' | 'video' | 'audio' | 'text';
  url?: string;
  
  // Analysis results
  tags: ContentTag[];
  suggestedTags: ContentTag[]; // AI suggestions pending approval
  
  // Visual analysis (for images/videos)
  visualAnalysis?: {
    dominantColors: string[];
    brightness: number; // 0-1
    contrast: number; // 0-1
    sharpness: number; // 0-1
    composition: 'portrait' | 'landscape' | 'square';
    faces: FaceAnalysis[];
    objects: ObjectDetection[];
    scene: string; // bedroom, outdoors, studio, etc.
  };
  
  // Text analysis
  textAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number; // -1 to 1
    emotions: Array<{
      emotion: string;
      confidence: number;
    }>;
    topics: Array<{
      topic: string;
      relevance: number;
    }>;
    language: string;
    readabilityScore: number;
    wordCount: number;
  };
  
  // Audio analysis
  audioAnalysis?: {
    duration: number; // seconds
    transcription?: string;
    emotions: Array<{
      emotion: string;
      confidence: number;
    }>;
    musicDetected: boolean;
    speechQuality: number; // 0-1
  };
  
  // Content safety and moderation
  safetyAnalysis: {
    isNSFW: boolean;
    nsfwScore: number; // 0-1
    violatesPolicy: boolean;
    policyViolations: string[];
    ageAppropriate: boolean;
    suggestedAgeRating: 'general' | 'mature' | 'explicit';
  };
  
  // Processing metadata
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'manual_review';
  processingStarted: string;
  processingCompleted?: string;
  processingError?: string;
  
  // Creator actions
  creatorApproved: boolean;
  approvedTags: string[]; // Tag IDs approved by creator
  rejectedTags: string[]; // Tag IDs rejected by creator
  
  createdAt: string;
  updatedAt: string;
}

export interface FaceAnalysis {
  id: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  attributes: {
    age?: number;
    gender?: 'male' | 'female' | 'unknown';
    emotion?: string;
    eyesClosed?: boolean;
    mouthOpen?: boolean;
    smiling?: boolean;
  };
  landmarks?: Array<{
    type: string;
    x: number;
    y: number;
  }>;
}

export interface ObjectDetection {
  id: string;
  name: string;
  category: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TagSuggestion {
  id: string;
  contentId: string;
  suggestedTag: ContentTag;
  reason: string; // Why this tag was suggested
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  suggestedAt: string;
  respondedAt?: string;
}

export interface TagRule {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  
  // Conditions
  conditions: Array<{
    type: 'tag_present' | 'tag_absent' | 'content_type' | 'file_name' | 'upload_time' | 'folder';
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'matches_regex';
    value: string;
  }>;
  
  // Actions
  actions: Array<{
    type: 'add_tag' | 'remove_tag' | 'set_visibility' | 'set_price' | 'move_to_folder' | 'notify';
    value: string;
  }>;
  
  isActive: boolean;
  priority: number; // Higher priority rules run first
  
  // Stats
  executionCount: number;
  lastExecuted?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface TagAnalyticsData {
  // Usage analytics
  mostUsedTags: Array<{
    tag: ContentTag;
    usageCount: number;
    recentUsage: number; // Last 30 days
  }>;
  
  tagTrends: Array<{
    tagId: string;
    tagName: string;
    period: string;
    usageCount: number;
    growthRate: number; // Percentage change
  }>;
  
  // Performance analytics
  tagPerformance: Array<{
    tagId: string;
    tagName: string;
    averageViews: number;
    averageLikes: number;
    averageRevenue: number;
    engagementRate: number;
  }>;
  
  // Content insights
  contentBreakdown: {
    byCategory: Record<string, number>;
    byNSFWStatus: Record<string, number>;
    byProcessingStatus: Record<string, number>;
  };
  
  // AI accuracy
  aiAccuracy: {
    overallAccuracy: number; // 0-1
    accuracyByCategory: Record<string, number>;
    humanOverrideRate: number; // How often creators change AI suggestions
    falsePositiveRate: number;
    falseNegativeRate: number;
  };
  
  // Processing stats
  processingStats: {
    totalProcessed: number;
    averageProcessingTime: number; // seconds
    successRate: number;
    errorRate: number;
    manualReviewRate: number;
  };
}

export interface AITaggingConfig {
  enabled: boolean;
  
  // AI Service settings
  aiProvider: 'openai' | 'google' | 'aws' | 'azure' | 'custom';
  apiKey?: string;
  modelVersion: string;
  
  // Processing settings
  autoProcess: boolean; // Automatically process uploads
  batchSize: number; // Number of items to process together
  maxProcessingTime: number; // Max processing time per item in seconds
  
  // Tag settings
  minConfidence: number; // Minimum confidence to accept AI tags (0-1)
  maxTagsPerContent: number;
  enableCustomTags: boolean;
  enableCommunityTags: boolean;
  
  // Content types to process
  enabledContentTypes: ('image' | 'video' | 'audio' | 'text')[];
  
  // Visual analysis settings
  enableFaceDetection: boolean;
  enableObjectDetection: boolean;
  enableSceneAnalysis: boolean;
  enableColorAnalysis: boolean;
  
  // Text analysis settings
  enableSentimentAnalysis: boolean;
  enableTopicExtraction: boolean;
  enableLanguageDetection: boolean;
  
  // Safety and moderation
  enableSafetyAnalysis: boolean;
  strictNSFWDetection: boolean;
  autoModeration: boolean; // Automatically hide content that violates policies
  requireManualReview: boolean; // Require human review for sensitive content
  
  // Creator control
  allowCreatorOverride: boolean;
  requireCreatorApproval: boolean; // Require approval before applying AI tags
  showConfidenceScores: boolean;
  
  // Performance
  enableCaching: boolean;
  cacheExpiry: number; // Hours
  enablePreprocessing: boolean; // Process during upload
  
  // Automation
  enableTagRules: boolean;
  maxRulesPerCreator: number;
  
  // Analytics
  enableAnalytics: boolean;
  trackTagPerformance: boolean;
  enableA11Testing: boolean; // A/B test tag suggestions
}

// API request/response types
export interface AnalyzeContentRequest {
  contentId: string;
  contentType: 'image' | 'video' | 'audio' | 'text';
  url?: string;
  text?: string;
  options?: {
    skipCache?: boolean;
    priority?: 'low' | 'normal' | 'high';
    includeNSFW?: boolean;
    customPrompt?: string;
  };
}

export interface AnalyzeContentResponse {
  analysisId: string;
  status: 'completed' | 'processing' | 'failed';
  tags: ContentTag[];
  suggestedTags: ContentTag[];
  analysis: ContentAnalysis;
  processingTime: number; // milliseconds
  tokensUsed?: number; // For API cost tracking
}

export interface BatchAnalyzeRequest {
  items: AnalyzeContentRequest[];
  priority?: 'low' | 'normal' | 'high';
  notifyWhenComplete?: boolean;
}

export interface TagManagementRequest {
  action: 'approve' | 'reject' | 'add' | 'remove' | 'edit';
  contentId: string;
  tagIds?: string[];
  newTags?: Partial<ContentTag>[];
}

export interface CreateTagRuleRequest {
  name: string;
  description: string;
  conditions: TagRule['conditions'];
  actions: TagRule['actions'];
  priority?: number;
}

export interface TagSearchQuery {
  query?: string;
  categories?: string[];
  creatorId?: string;
  isNSFW?: boolean;
  minUsage?: number;
  source?: ContentTag['source'][];
  sortBy?: 'usage' | 'alphabetical' | 'recent' | 'confidence';
  limit?: number;
  offset?: number;
}

// Event types for real-time updates
export interface ContentAnalyzedEvent {
  type: 'CONTENT_ANALYZED';
  contentId: string;
  analysis: ContentAnalysis;
  newTags: ContentTag[];
  timestamp: string;
}

export interface TagSuggestedEvent {
  type: 'TAG_SUGGESTED';
  contentId: string;
  suggestion: TagSuggestion;
  timestamp: string;
}

export interface TagRuleExecutedEvent {
  type: 'TAG_RULE_EXECUTED';
  ruleId: string;
  contentId: string;
  actionsPerformed: string[];
  timestamp: string;
}

export interface BatchProcessingCompleteEvent {
  type: 'BATCH_PROCESSING_COMPLETE';
  batchId: string;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  timestamp: string;
}

// Template types for common tag configurations
export interface TagTemplate {
  id: string;
  name: string;
  description: string;
  category: 'creator_type' | 'content_style' | 'niche' | 'general';
  tags: Array<{
    name: string;
    category: ContentTag['category'];
    color?: string;
  }>;
  rules?: Partial<TagRule>[];
  isPopular: boolean;
}

export interface AIModelPerformance {
  modelId: string;
  modelVersion: string;
  provider: string;
  
  // Performance metrics
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  
  // Processing metrics
  averageLatency: number; // milliseconds
  throughput: number; // items per minute
  errorRate: number;
  
  // Cost metrics
  costPerAnalysis: number; // in cents
  totalCost: number;
  
  // Usage stats
  totalAnalyses: number;
  analysesThisMonth: number;
  
  lastUpdated: string;
}