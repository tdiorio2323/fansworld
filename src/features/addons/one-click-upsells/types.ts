// 💰 ONE-CLICK UPSELLS - TYPE DEFINITIONS

export interface Upsell {
  id: string;
  creatorId: string;
  
  // Basic info
  name: string;
  description: string;
  tagline?: string; // Short catchy phrase
  
  // Trigger configuration
  trigger: UpsellTrigger;
  conditions: UpsellCondition[];
  
  // Offer details
  offer: UpsellOffer;
  originalPrice: number; // in cents
  discountedPrice: number; // in cents
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  
  // Timing
  displayTiming: 'immediate' | 'delayed' | 'exit_intent' | 'after_action';
  delaySeconds?: number;
  expirationTime?: number; // seconds until offer expires
  
  // Appearance
  template: 'modal' | 'banner' | 'slide_in' | 'full_screen' | 'inline';
  design: UpsellDesign;
  
  // Content
  headline: string;
  subheadline?: string;
  bulletPoints: string[];
  imageUrl?: string;
  videoUrl?: string;
  ctaText: string;
  
  // Settings
  isActive: boolean;
  priority: number; // Higher priority shows first
  maxDisplays: number; // Max times to show per user
  cooldownPeriod: number; // Hours between displays
  
  // A/B Testing
  variants: UpsellVariant[];
  testingEnabled: boolean;
  winningVariant?: string;
  
  // Performance tracking
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number; // in cents
  conversionRate: number;
  
  // Analytics
  conversionsBySource: Record<string, number>;
  conversionsByDevice: Record<string, number>;
  averageTimeToDecision: number; // seconds
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  conversions?: UpsellConversion[];
}

export interface UpsellTrigger {
  type: 'page_visit' | 'purchase_complete' | 'subscription_signup' | 'content_view' | 'time_spent' | 'scroll_depth' | 'exit_intent';
  
  // Page visit triggers
  pages?: string[]; // Specific pages to trigger on
  
  // Purchase triggers
  purchaseTypes?: ('subscription' | 'ppv' | 'virtual_gift' | 'flash_sale' | 'custom_request')[];
  minPurchaseAmount?: number; // Minimum purchase to trigger
  
  // Content triggers
  contentTypes?: ('image' | 'video' | 'audio' | 'text' | 'live_stream')[];
  contentTags?: string[];
  
  // Engagement triggers
  minTimeSpent?: number; // seconds on page
  minScrollDepth?: number; // percentage scrolled
  
  // User behavior triggers
  sessionCount?: number; // Trigger after X sessions
  daysSinceLastPurchase?: number;
}

export interface UpsellCondition {
  type: 'user_type' | 'subscription_tier' | 'previous_purchase' | 'time_of_day' | 'day_of_week' | 'device_type' | 'location' | 'referrer';
  
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_list';
  value: string | number | string[];
  
  // User type conditions
  userTypes?: ('new' | 'returning' | 'subscriber' | 'high_spender' | 'at_risk')[];
  
  // Subscription conditions
  subscriptionTiers?: string[];
  hasActiveSubscription?: boolean;
  
  // Purchase conditions
  totalSpent?: number; // Minimum total spent
  lastPurchaseDays?: number; // Days since last purchase
  
  // Time conditions
  timeRanges?: Array<{
    start: string; // HH:MM
    end: string; // HH:MM
  }>;
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  
  // Technical conditions
  deviceTypes?: ('mobile' | 'desktop' | 'tablet')[];
  browsers?: string[];
  operatingSystems?: string[];
  
  // Geographic conditions
  countries?: string[];
  regions?: string[];
  
  // Referrer conditions
  referrerDomains?: string[];
  trafficSources?: ('direct' | 'social' | 'search' | 'email' | 'ads')[];
}

export interface UpsellOffer {
  type: 'subscription_upgrade' | 'content_bundle' | 'exclusive_content' | 'discount_coupon' | 'free_trial' | 'bonus_content' | 'custom_request_discount';
  
  // Subscription offers
  subscriptionTier?: string;
  trialDuration?: number; // days
  
  // Content offers
  contentIds?: string[];
  bundleName?: string;
  
  // Discount offers
  discountCode?: string;
  discountPercentage?: number;
  discountAmount?: number; // in cents
  
  // Exclusive access
  exclusiveContentType?: string;
  accessDuration?: number; // days
  
  // Bonus content
  bonusItems?: Array<{
    type: 'image' | 'video' | 'audio' | 'text';
    title: string;
    description: string;
    value: number; // in cents
  }>;
  
  // Custom request discounts
  requestDiscountPercentage?: number;
  maxRequestValue?: number; // in cents
  
  // Bundle configuration
  includesItems?: Array<{
    id: string;
    type: string;
    title: string;
    originalPrice: number;
    discountedPrice: number;
  }>;
}

export interface UpsellDesign {
  // Colors and branding
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  
  // Typography
  headlineFont: string;
  bodyFont: string;
  headlineSize: 'small' | 'medium' | 'large' | 'extra_large';
  
  // Layout
  layout: 'centered' | 'left_aligned' | 'right_aligned';
  imagePosition: 'top' | 'left' | 'right' | 'background';
  
  // Styling
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
  
  // Animation
  entranceAnimation: 'none' | 'fade_in' | 'slide_up' | 'slide_down' | 'zoom_in' | 'bounce';
  exitAnimation: 'none' | 'fade_out' | 'slide_up' | 'slide_down' | 'zoom_out';
  
  // Interactive elements
  buttonStyle: 'filled' | 'outlined' | 'text' | 'gradient';
  buttonSize: 'small' | 'medium' | 'large';
  hoverEffects: boolean;
  
  // Mobile optimization
  mobileLayout?: 'stack' | 'horizontal' | 'card';
  mobileImageSize?: 'small' | 'medium' | 'large' | 'full';
}

export interface UpsellVariant {
  id: string;
  name: string;
  isControl: boolean;
  trafficAllocation: number; // 0-100 percentage
  
  // Variant-specific overrides
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  imageUrl?: string;
  videoUrl?: string;
  design?: Partial<UpsellDesign>;
  offer?: Partial<UpsellOffer>;
  
  // Performance metrics
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  averageOrderValue: number;
  
  // Statistical significance
  confidenceLevel: number;
  pValue: number;
  isStatisticallySignificant: boolean;
  
  createdAt: string;
}

export interface UpsellConversion {
  id: string;
  upsellId: string;
  variantId?: string;
  userId: string;
  
  // Conversion details
  convertedAt: string;
  conversionValue: number; // in cents
  timeToDecision: number; // seconds from display to conversion
  
  // Context
  triggerSource: string; // What triggered the upsell
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  operatingSystem: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  
  // User data
  user?: {
    id: string;
    username: string;
    subscriptionTier?: string;
    totalSpent: number;
    signupDate: string;
  };
  
  createdAt: string;
}

export interface UpsellAnalytics {
  upsellId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  // Performance metrics
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number; // in cents
  conversionRate: number;
  clickThroughRate: number;
  averageOrderValue: number;
  revenuePerImpression: number;
  
  // User engagement
  averageTimeToDecision: number;
  bounceRate: number; // Users who immediately dismiss
  repeatConversions: number; // Users who convert multiple times
  
  // Segmentation
  performanceByUserType: Record<string, {
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;
  
  performanceByDevice: Record<string, {
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
  
  performanceByTimeOfDay: Array<{
    hour: number;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
  
  performanceByDayOfWeek: Array<{
    day: number;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
  
  // Geographic performance
  performanceByCountry: Array<{
    country: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;
  
  // Traffic source performance
  performanceBySource: Array<{
    source: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }>;
  
  // Conversion funnel
  funnelData: {
    impressions: number;
    clicked: number;
    viewed_offer: number;
    started_checkout: number;
    completed_purchase: number;
  };
  
  // Revenue attribution
  revenueAttribution: {
    direct: number; // Immediate conversions
    assisted: number; // Influenced future purchases
    total: number;
  };
}

// Request/response types
export interface CreateUpsellRequest {
  name: string;
  description: string;
  tagline?: string;
  trigger: UpsellTrigger;
  conditions: UpsellCondition[];
  offer: UpsellOffer;
  originalPrice: number;
  discountedPrice: number;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  displayTiming: Upsell['displayTiming'];
  delaySeconds?: number;
  expirationTime?: number;
  template: Upsell['template'];
  design: UpsellDesign;
  headline: string;
  subheadline?: string;
  bulletPoints: string[];
  imageUrl?: string;
  videoUrl?: string;
  ctaText: string;
  priority: number;
  maxDisplays: number;
  cooldownPeriod: number;
}

export interface UpdateUpsellRequest {
  name?: string;
  description?: string;
  tagline?: string;
  conditions?: UpsellCondition[];
  offer?: UpsellOffer;
  discountedPrice?: number;
  discountValue?: number;
  design?: UpsellDesign;
  headline?: string;
  subheadline?: string;
  bulletPoints?: string[];
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  isActive?: boolean;
  priority?: number;
  maxDisplays?: number;
  cooldownPeriod?: number;
}

export interface UpsellDisplayRequest {
  upsellId: string;
  userId: string;
  context: {
    page: string;
    triggerSource: string;
    deviceType: string;
    userAgent: string;
    sessionData?: Record<string, any>;
  };
}

export interface UpsellDisplayResponse {
  shouldDisplay: boolean;
  upsell?: Upsell;
  variant?: UpsellVariant;
  displayId: string; // For tracking
  expiresAt?: string;
  reasons?: string[]; // Why it should/shouldn't display
}

export interface UpsellFilter {
  creatorId?: string;
  isActive?: boolean;
  triggerType?: UpsellTrigger['type'];
  template?: Upsell['template'];
  minConversionRate?: number;
  sortBy?: 'newest' | 'oldest' | 'performance' | 'revenue' | 'conversion_rate';
  limit?: number;
  offset?: number;
}

// Event types for real-time tracking
export interface UpsellDisplayedEvent {
  type: 'UPSELL_DISPLAYED';
  upsellId: string;
  variantId?: string;
  userId: string;
  displayId: string;
  context: {
    page: string;
    triggerSource: string;
    deviceType: string;
  };
  timestamp: string;
}

export interface UpsellClickedEvent {
  type: 'UPSELL_CLICKED';
  upsellId: string;
  variantId?: string;
  userId: string;
  displayId: string;
  timeToClick: number; // seconds
  timestamp: string;
}

export interface UpsellConvertedEvent {
  type: 'UPSELL_CONVERTED';
  upsellId: string;
  variantId?: string;
  userId: string;
  displayId: string;
  conversionValue: number;
  timeToConversion: number; // seconds
  timestamp: string;
}

export interface UpsellDismissedEvent {
  type: 'UPSELL_DISMISSED';
  upsellId: string;
  variantId?: string;
  userId: string;
  displayId: string;
  dismissReason: 'close_button' | 'outside_click' | 'escape_key' | 'timeout';
  timeToDissmiss: number; // seconds
  timestamp: string;
}

// Configuration
export interface UpsellConfig {
  enabled: boolean;
  
  // Display limits
  maxUpsellsPerSession: number;
  maxUpsellsPerDay: number;
  maxUpsellsPerWeek: number;
  
  // Timing constraints
  minTimeBetweenUpsells: number; // seconds
  maxDisplayDuration: number; // seconds before auto-dismiss
  
  // Performance thresholds
  minConversionRateToKeepActive: number; // Auto-disable low performers
  minImpressionsForSignificance: number; // A/B testing
  confidenceLevelRequired: number; // Statistical significance threshold
  
  // Templates and design
  defaultTemplate: Upsell['template'];
  allowCustomCSS: boolean;
  requireImageOptimization: boolean;
  maxImageSize: number; // bytes
  
  // Targeting
  enableGeoTargeting: boolean;
  enableDeviceTargeting: boolean;
  enableBehavioralTargeting: boolean;
  
  // A/B testing
  enableABTesting: boolean;
  maxVariantsPerUpsell: number;
  autoPromoteWinningVariant: boolean;
  
  // Analytics
  enableDetailedAnalytics: boolean;
  retentionPeriod: number; // days to keep analytics data
  
  // Compliance
  respectDoNotTrack: boolean;
  showDisclosures: boolean;
  allowOptOut: boolean;
}