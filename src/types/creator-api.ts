// =============================================================================
// CREATOR MANAGEMENT PLATFORM - API INTERFACES
// =============================================================================

// Base Creator Types
// =============================================================================

export interface Creator {
  id: string;
  user_id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  verified: boolean;
  tier: 'starter' | 'premium' | 'elite';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  commission_rate: number;
  joined_date: string;
  last_active: string;
  total_earnings: number;
  follower_count: number;
  content_count: number;
  platforms: CreatorPlatform[];
  settings: CreatorSettings;
  created_at: string;
  updated_at: string;
}

export interface CreatorPlatform {
  id: string;
  creator_id: string;
  platform: Platform;
  platform_user_id: string;
  platform_username: string;
  follower_count: number;
  verified: boolean;
  connected: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  last_sync: string;
  metrics: PlatformMetrics;
  created_at: string;
  updated_at: string;
}

export interface CreatorSettings {
  notifications: {
    email_enabled: boolean;
    push_enabled: boolean;
    milestone_alerts: boolean;
    payment_alerts: boolean;
    performance_reports: boolean;
  };
  privacy: {
    profile_public: boolean;
    earnings_visible: boolean;
    analytics_shared: boolean;
  };
  automation: {
    auto_post_scheduling: boolean;
    auto_respond_enabled: boolean;
    content_suggestions: boolean;
  };
}

// Platform Types
// =============================================================================

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'onlyfans' | 'twitter' | 'twitch';

export interface PlatformMetrics {
  followers: number;
  following: number;
  posts_count: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  reach: number;
  impressions: number;
  profile_views: number;
  website_clicks: number;
  growth_rate_30d: number;
  last_updated: string;
}

// Instagram API Integration
// =============================================================================

export interface InstagramBasicInfo {
  id: string;
  username: string;
  account_type: 'PERSONAL' | 'BUSINESS' | 'CREATOR';
  media_count: number;
}

export interface InstagramInsights {
  reach: number;
  impressions: number;
  profile_views: number;
  website_clicks: number;
  follower_count: number;
  email_contacts: number;
  phone_call_clicks: number;
  text_message_clicks: number;
  get_directions_clicks: number;
}

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  insights?: InstagramMediaInsights;
}

export interface InstagramMediaInsights {
  impressions: number;
  reach: number;
  engagement: number;
  saves: number;
  video_views?: number;
  profile_visits: number;
  website_clicks: number;
}

// TikTok API Integration  
// =============================================================================

export interface TikTokUser {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_large_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokVideo {
  id: string;
  title: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  cover_image_url: string;
  share_url: string;
  embed_html: string;
  embed_link: string;
  create_time: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
}

// YouTube API Integration
// =============================================================================

export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    custom_url: string;
    published_at: string;
    thumbnails: YouTubeThumbnails;
    country: string;
  };
  statistics: {
    view_count: string;
    subscriber_count: string;
    hidden_subscriber_count: boolean;
    video_count: string;
  };
  brandingSettings: {
    channel: {
      title: string;
      description: string;
      keywords: string;
      tracking_analytics_account_id: string;
    };
  };
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    published_at: string;
    channel_id: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channel_title: string;
    tags: string[];
    category_id: string;
    live_broadcast_content: string;
  };
  statistics: {
    view_count: string;
    like_count: string;
    comment_count: string;
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
  };
}

export interface YouTubeThumbnails {
  default: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  high: { url: string; width: number; height: number };
  standard?: { url: string; width: number; height: number };
  maxres?: { url: string; width: number; height: number };
}

// Content Management
// =============================================================================

export interface Content {
  id: string;
  creator_id: string;
  platform: Platform;
  platform_post_id: string;
  type: ContentType;
  title?: string;
  description?: string;
  media_urls: string[];
  thumbnail_url?: string;
  duration?: number;
  status: ContentStatus;
  scheduled_at?: string;
  published_at?: string;
  metrics: ContentMetrics;
  hashtags: string[];
  mentions: string[];
  location?: string;
  collaboration_id?: string;
  campaign_id?: string;
  created_at: string;
  updated_at: string;
}

export type ContentType = 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'live' | 'short';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived' | 'deleted';

export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  click_through_rate: number;
  revenue_generated: number;
  last_updated: string;
}

// Analytics & Reporting
// =============================================================================

export interface AnalyticsReport {
  id: string;
  creator_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period_start: string;
  period_end: string;
  metrics: ReportMetrics;
  insights: ReportInsights;
  recommendations: string[];
  generated_at: string;
  status: 'generating' | 'completed' | 'failed';
}

export interface ReportMetrics {
  follower_growth: {
    start_count: number;
    end_count: number;
    net_growth: number;
    growth_rate: number;
  };
  engagement: {
    total_likes: number;
    total_comments: number;
    total_shares: number;
    avg_engagement_rate: number;
  };
  content: {
    posts_published: number;
    total_views: number;
    best_performing_post: string;
    worst_performing_post: string;
  };
  revenue: {
    total_earnings: number;
    commission_paid: number;
    net_earnings: number;
    revenue_by_source: RevenueBySource;
  };
}

export interface ReportInsights {
  best_posting_times: string[];
  top_hashtags: string[];
  audience_demographics: AudienceDemographics;
  content_performance: ContentPerformanceInsight[];
  growth_opportunities: string[];
}

export interface RevenueBySource {
  subscriptions: number;
  tips: number;
  merchandise: number;
  brand_partnerships: number;
  affiliate_commissions: number;
  other: number;
}

export interface AudienceDemographics {
  age_groups: { [key: string]: number };
  genders: { [key: string]: number };
  locations: { [key: string]: number };
  interests: string[];
  active_hours: number[];
}

export interface ContentPerformanceInsight {
  content_type: ContentType;
  avg_performance: number;
  best_example: string;
  improvement_suggestions: string[];
}

// Campaign Management
// =============================================================================

export interface Campaign {
  id: string;
  creator_id: string;
  brand_id?: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  commission_rate: number;
  deliverables: Deliverable[];
  timeline: {
    start_date: string;
    end_date: string;
    milestones: Milestone[];
  };
  requirements: CampaignRequirements;
  metrics: CampaignMetrics;
  payments: CampaignPayment[];
  created_at: string;
  updated_at: string;
}

export type CampaignType = 'sponsored_post' | 'product_placement' | 'brand_ambassador' | 'event_promotion' | 'giveaway';
export type CampaignStatus = 'draft' | 'pending_approval' | 'active' | 'completed' | 'cancelled';

export interface Deliverable {
  id: string;
  type: ContentType;
  platform: Platform;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  content_id?: string;
  feedback?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue';
  payment_percentage: number;
}

export interface CampaignRequirements {
  min_followers: number;
  target_demographics: AudienceDemographics;
  content_guidelines: string[];
  hashtags_required: string[];
  mentions_required: string[];
  disclosure_required: boolean;
}

export interface CampaignMetrics {
  total_reach: number;
  total_impressions: number;
  total_engagement: number;
  click_through_rate: number;
  conversion_rate: number;
  roi: number;
  brand_mention_sentiment: number;
}

export interface CampaignPayment {
  id: string;
  milestone_id: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  processed_at?: string;
  transaction_id?: string;
}

// Payment & Financial Management
// =============================================================================

export interface CreatorEarnings {
  id: string;
  creator_id: string;
  period_start: string;
  period_end: string;
  gross_earnings: number;
  commission_amount: number;
  net_earnings: number;
  platform_fees: number;
  tax_withheld: number;
  bonus_earnings: number;
  penalty_deductions: number;
  earnings_breakdown: EarningsBreakdown;
  payout_status: PayoutStatus;
  payout_date?: string;
  payout_method?: PayoutMethod;
  created_at: string;
  updated_at: string;
}

export interface EarningsBreakdown {
  subscription_revenue: number;
  tip_revenue: number;
  merchandise_revenue: number;
  brand_deal_revenue: number;
  affiliate_revenue: number;
  bonus_payments: number;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PayoutMethod = 'bank_transfer' | 'paypal' | 'stripe' | 'crypto' | 'check';

// API Response Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ResponseMetadata {
  total_count?: number;
  page?: number;
  per_page?: number;
  has_more?: boolean;
  request_id: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: ResponseMetadata & {
    total_count: number;
    page: number;
    per_page: number;
    has_more: boolean;
  };
}

// API Endpoints & Request Types
// =============================================================================

export interface CreateCreatorRequest {
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  tier: 'starter' | 'premium' | 'elite';
  commission_rate?: number;
  platforms?: {
    platform: Platform;
    username: string;
  }[];
}

export interface UpdateCreatorRequest {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  tier?: 'starter' | 'premium' | 'elite';
  commission_rate?: number;
  status?: 'active' | 'pending' | 'suspended' | 'inactive';
  settings?: Partial<CreatorSettings>;
}

export interface ConnectPlatformRequest {
  platform: Platform;
  access_token: string;
  refresh_token?: string;
  platform_user_id: string;
  platform_username: string;
}

export interface CreateCampaignRequest {
  creator_id: string;
  name: string;
  description: string;
  type: CampaignType;
  budget: number;
  commission_rate?: number;
  timeline: {
    start_date: string;
    end_date: string;
  };
  deliverables: Omit<Deliverable, 'id' | 'status'>[];
  requirements?: Partial<CampaignRequirements>;
}

export interface SyncPlatformMetricsRequest {
  creator_id: string;
  platform: Platform;
  force_refresh?: boolean;
}

export interface GenerateReportRequest {
  creator_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period_start?: string;
  period_end?: string;
  include_insights?: boolean;
  include_recommendations?: boolean;
}

// Webhook Types
// =============================================================================

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  data: any;
  timestamp: string;
  source: Platform | 'internal';
  creator_id?: string;
}

export type WebhookEventType = 
  | 'creator.created'
  | 'creator.updated'
  | 'creator.suspended'
  | 'platform.connected'
  | 'platform.disconnected'
  | 'metrics.updated'
  | 'content.published'
  | 'campaign.started'
  | 'campaign.completed'
  | 'payment.processed'
  | 'payment.failed'
  | 'report.generated';

// Search & Filtering
// =============================================================================

export interface CreatorSearchFilters {
  tier?: ('starter' | 'premium' | 'elite')[];
  status?: ('active' | 'pending' | 'suspended' | 'inactive')[];
  platforms?: Platform[];
  min_followers?: number;
  max_followers?: number;
  min_earnings?: number;
  max_earnings?: number;
  min_engagement_rate?: number;
  max_engagement_rate?: number;
  joined_after?: string;
  joined_before?: string;
  verified_only?: boolean;
  search_query?: string;
}

export interface ContentSearchFilters {
  creator_ids?: string[];
  platforms?: Platform[];
  types?: ContentType[];
  status?: ContentStatus[];
  published_after?: string;
  published_before?: string;
  min_views?: number;
  max_views?: number;
  min_engagement_rate?: number;
  max_engagement_rate?: number;
  hashtags?: string[];
  search_query?: string;
}
