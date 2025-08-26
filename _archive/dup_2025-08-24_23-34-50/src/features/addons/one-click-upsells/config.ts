// 💰 ONE-CLICK UPSELLS - CONFIGURATION

import { UpsellConfig, UpsellDesign } from './types';

export const DEFAULT_UPSELL_CONFIG: UpsellConfig = {
  enabled: true,
  
  // Display limits
  maxUpsellsPerSession: 2,
  maxUpsellsPerDay: 3,
  maxUpsellsPerWeek: 5,
  
  // Timing constraints
  minTimeBetweenUpsells: 300, // 5 minutes
  maxDisplayDuration: 60, // 1 minute auto-dismiss
  
  // Performance thresholds
  minConversionRateToKeepActive: 0.01, // 1% minimum conversion rate
  minImpressionsForSignificance: 100,
  confidenceLevelRequired: 0.95, // 95% confidence
  
  // Templates and design
  defaultTemplate: 'modal',
  allowCustomCSS: true,
  requireImageOptimization: true,
  maxImageSize: 2 * 1024 * 1024, // 2MB
  
  // Targeting
  enableGeoTargeting: true,
  enableDeviceTargeting: true,
  enableBehavioralTargeting: true,
  
  // A/B testing
  enableABTesting: true,
  maxVariantsPerUpsell: 5,
  autoPromoteWinningVariant: true,
  
  // Analytics
  enableDetailedAnalytics: true,
  retentionPeriod: 365, // 1 year
  
  // Compliance
  respectDoNotTrack: true,
  showDisclosures: true,
  allowOptOut: true,
};

// Pre-designed upsell templates
export const UPSELL_TEMPLATES = {
  modal: {
    name: 'Modal Overlay',
    description: 'Full-screen overlay with centered content',
    defaultDesign: {
      primaryColor: '#EC4899',
      secondaryColor: '#8B5CF6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#F59E0B',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      headlineSize: 'large' as const,
      layout: 'centered' as const,
      imagePosition: 'top' as const,
      borderRadius: 12,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowIntensity: 'heavy' as const,
      entranceAnimation: 'fade_in' as const,
      exitAnimation: 'fade_out' as const,
      buttonStyle: 'filled' as const,
      buttonSize: 'large' as const,
      hoverEffects: true,
      mobileLayout: 'stack' as const,
      mobileImageSize: 'medium' as const,
    },
  },
  banner: {
    name: 'Top Banner',
    description: 'Horizontal banner at top of page',
    defaultDesign: {
      primaryColor: '#EF4444',
      secondaryColor: '#F97316',
      backgroundColor: '#FEF2F2',
      textColor: '#7F1D1D',
      accentColor: '#DC2626',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      headlineSize: 'medium' as const,
      layout: 'left_aligned' as const,
      imagePosition: 'left' as const,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#FCA5A5',
      shadowIntensity: 'light' as const,
      entranceAnimation: 'slide_down' as const,
      exitAnimation: 'slide_up' as const,
      buttonStyle: 'filled' as const,
      buttonSize: 'medium' as const,
      hoverEffects: true,
      mobileLayout: 'stack' as const,
      mobileImageSize: 'small' as const,
    },
  },
  slide_in: {
    name: 'Side Slide-in',
    description: 'Slides in from side of screen',
    defaultDesign: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#A855F7',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#EC4899',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      headlineSize: 'medium' as const,
      layout: 'left_aligned' as const,
      imagePosition: 'top' as const,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowIntensity: 'medium' as const,
      entranceAnimation: 'slide_up' as const,
      exitAnimation: 'slide_down' as const,
      buttonStyle: 'filled' as const,
      buttonSize: 'medium' as const,
      hoverEffects: true,
      mobileLayout: 'stack' as const,
      mobileImageSize: 'medium' as const,
    },
  },
  full_screen: {
    name: 'Full Screen Takeover',
    description: 'Takes over entire screen',
    defaultDesign: {
      primaryColor: '#F59E0B',
      secondaryColor: '#FBBF24',
      backgroundColor: '#FFFBEB',
      textColor: '#92400E',
      accentColor: '#D97706',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      headlineSize: 'extra_large' as const,
      layout: 'centered' as const,
      imagePosition: 'background' as const,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: 'transparent',
      shadowIntensity: 'none' as const,
      entranceAnimation: 'zoom_in' as const,
      exitAnimation: 'zoom_out' as const,
      buttonStyle: 'gradient' as const,
      buttonSize: 'large' as const,
      hoverEffects: true,
      mobileLayout: 'stack' as const,
      mobileImageSize: 'large' as const,
    },
  },
  inline: {
    name: 'Inline Content',
    description: 'Embedded within page content',
    defaultDesign: {
      primaryColor: '#10B981',
      secondaryColor: '#34D399',
      backgroundColor: '#ECFDF5',
      textColor: '#064E3B',
      accentColor: '#059669',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      headlineSize: 'medium' as const,
      layout: 'left_aligned' as const,
      imagePosition: 'left' as const,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#A7F3D0',
      shadowIntensity: 'light' as const,
      entranceAnimation: 'fade_in' as const,
      exitAnimation: 'fade_out' as const,
      buttonStyle: 'filled' as const,
      buttonSize: 'medium' as const,
      hoverEffects: true,
      mobileLayout: 'stack' as const,
      mobileImageSize: 'medium' as const,
    },
  },
};

// Pre-configured upsell scenarios
export const UPSELL_SCENARIOS = [
  {
    id: 'subscription-upgrade',
    name: 'Subscription Upgrade',
    description: 'Upgrade free users to paid subscription after content interaction',
    trigger: {
      type: 'content_view' as const,
      contentTypes: ['image', 'video'],
    },
    conditions: [
      {
        type: 'user_type' as const,
        operator: 'equals' as const,
        value: 'free',
      },
    ],
    offer: {
      type: 'subscription_upgrade' as const,
      subscriptionTier: 'premium',
      trialDuration: 7,
    },
    template: 'modal' as const,
    headline: 'Unlock Premium Content!',
    subheadline: 'Get unlimited access to all exclusive content',
    bulletPoints: [
      'Unlimited photo and video access',
      'HD quality downloads',
      'Early access to new content',
      'Direct messaging with creators',
    ],
    ctaText: 'Start Free Trial',
    discountType: 'percentage' as const,
    discountValue: 20,
  },
  {
    id: 'bundle-deal',
    name: 'Content Bundle',
    description: 'Offer content bundles after single purchase',
    trigger: {
      type: 'purchase_complete' as const,
      purchaseTypes: ['ppv'],
    },
    conditions: [
      {
        type: 'user_type' as const,
        operator: 'in_list' as const,
        value: ['subscriber', 'high_spender'],
      },
    ],
    offer: {
      type: 'content_bundle' as const,
      bundleName: 'Complete Collection',
    },
    template: 'slide_in' as const,
    headline: 'Complete Your Collection',
    subheadline: 'Get 3 more exclusive items at 50% off',
    bulletPoints: [
      '3 bonus premium photos',
      'Behind the scenes video',
      'Personal voice message',
    ],
    ctaText: 'Add to Collection',
    discountType: 'percentage' as const,
    discountValue: 50,
  },
  {
    id: 'exit-intent-discount',
    name: 'Exit Intent Discount',
    description: 'Last chance offer when user tries to leave',
    trigger: {
      type: 'exit_intent' as const,
    },
    conditions: [
      {
        type: 'user_type' as const,
        operator: 'equals' as const,
        value: 'new',
      },
    ],
    offer: {
      type: 'discount_coupon' as const,
      discountPercentage: 25,
    },
    template: 'modal' as const,
    headline: 'Wait! Don\'t Miss Out',
    subheadline: 'Get 25% off your first purchase',
    bulletPoints: [
      'Exclusive first-time buyer discount',
      'Valid for next 24 hours',
      'Use on any premium content',
    ],
    ctaText: 'Claim Discount',
    discountType: 'percentage' as const,
    discountValue: 25,
    expirationTime: 86400, // 24 hours
  },
  {
    id: 'loyalty-bonus',
    name: 'Loyalty Bonus',
    description: 'Reward loyal customers with exclusive content',
    trigger: {
      type: 'purchase_complete' as const,
    },
    conditions: [
      {
        type: 'previous_purchase' as const,
        operator: 'greater_than' as const,
        value: 5,
      },
    ],
    offer: {
      type: 'bonus_content' as const,
      bonusItems: [
        {
          type: 'video',
          title: 'Exclusive Thank You Video',
          description: 'Personal message just for VIP customers',
          value: 2500,
        },
      ],
    },
    template: 'banner' as const,
    headline: 'VIP Bonus Unlocked!',
    subheadline: 'Thank you for being a loyal fan',
    bulletPoints: [
      'Exclusive VIP content',
      'Limited time access',
      'Shows our appreciation',
    ],
    ctaText: 'Claim Bonus',
    discountType: 'fixed_amount' as const,
    discountValue: 0, // Free bonus
  },
  {
    id: 'time-sensitive-upgrade',
    name: 'Time-Sensitive Upgrade',
    description: 'Limited time upgrade offer for active users',
    trigger: {
      type: 'time_spent' as const,
      minTimeSpent: 300, // 5 minutes
    },
    conditions: [
      {
        type: 'subscription_tier' as const,
        operator: 'equals' as const,
        value: 'basic',
      },
      {
        type: 'time_of_day' as const,
        operator: 'in_list' as const,
        value: ['18:00-23:59'], // Evening hours
      },
    ],
    offer: {
      type: 'subscription_upgrade' as const,
      subscriptionTier: 'vip',
    },
    template: 'slide_in' as const,
    headline: 'Limited Time: VIP Upgrade',
    subheadline: 'Only available until midnight tonight',
    bulletPoints: [
      'VIP exclusive content library',
      'Priority customer support',
      '50% off first month',
    ],
    ctaText: 'Upgrade Now',
    discountType: 'percentage' as const,
    discountValue: 50,
    expirationTime: 21600, // 6 hours
  },
];

// Targeting presets for common user segments
export const USER_SEGMENTS = {
  new_users: {
    name: 'New Users',
    conditions: [
      {
        type: 'user_type' as const,
        operator: 'equals' as const,
        value: 'new',
      },
    ],
  },
  free_users: {
    name: 'Free Users',
    conditions: [
      {
        type: 'subscription_tier' as const,
        operator: 'equals' as const,
        value: 'free',
      },
    ],
  },
  subscribers: {
    name: 'Active Subscribers',
    conditions: [
      {
        type: 'subscription_tier' as const,
        operator: 'in_list' as const,
        value: ['basic', 'premium', 'vip'],
      },
    ],
  },
  high_spenders: {
    name: 'High Spenders',
    conditions: [
      {
        type: 'previous_purchase' as const,
        operator: 'greater_than' as const,
        value: 10000, // $100+
      },
    ],
  },
  at_risk_users: {
    name: 'At Risk Users',
    conditions: [
      {
        type: 'user_type' as const,
        operator: 'equals' as const,
        value: 'at_risk',
      },
      {
        type: 'previous_purchase' as const,
        operator: 'greater_than' as const,
        value: 30, // No purchase in 30 days
      },
    ],
  },
  mobile_users: {
    name: 'Mobile Users',
    conditions: [
      {
        type: 'device_type' as const,
        operator: 'equals' as const,
        value: 'mobile',
      },
    ],
  },
  weekend_visitors: {
    name: 'Weekend Visitors',
    conditions: [
      {
        type: 'day_of_week' as const,
        operator: 'in_list' as const,
        value: [0, 6], // Saturday and Sunday
      },
    ],
  },
};

// Performance benchmarks for different offer types
export const PERFORMANCE_BENCHMARKS = {
  subscription_upgrade: {
    averageConversionRate: 0.025, // 2.5%
    goodConversionRate: 0.05, // 5%
    excellentConversionRate: 0.08, // 8%
    averageOrderValue: 2000, // $20
  },
  content_bundle: {
    averageConversionRate: 0.04, // 4%
    goodConversionRate: 0.07, // 7%
    excellentConversionRate: 0.12, // 12%
    averageOrderValue: 3500, // $35
  },
  discount_coupon: {
    averageConversionRate: 0.08, // 8%
    goodConversionRate: 0.15, // 15%
    excellentConversionRate: 0.25, // 25%
    averageOrderValue: 1500, // $15
  },
  exclusive_content: {
    averageConversionRate: 0.03, // 3%
    goodConversionRate: 0.06, // 6%
    excellentConversionRate: 0.10, // 10%
    averageOrderValue: 2500, // $25
  },
  bonus_content: {
    averageConversionRate: 0.15, // 15%
    goodConversionRate: 0.25, // 25%
    excellentConversionRate: 0.40, // 40%
    averageOrderValue: 1000, // $10
  },
};

// Utility functions
export const calculateDiscountPrice = (originalPrice: number, discountType: 'percentage' | 'fixed_amount', discountValue: number): number => {
  if (discountType === 'percentage') {
    return Math.round(originalPrice * (1 - discountValue / 100));
  } else {
    return Math.max(0, originalPrice - discountValue);
  }
};

export const calculateSavings = (originalPrice: number, discountedPrice: number): number => {
  return originalPrice - discountedPrice;
};

export const calculateSavingsPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const getTemplateDesign = (templateName: string): UpsellDesign => {
  const template = UPSELL_TEMPLATES[templateName as keyof typeof UPSELL_TEMPLATES];
  return template?.defaultDesign || UPSELL_TEMPLATES.modal.defaultDesign;
};

export const getBenchmarkForOfferType = (offerType: string) => {
  return PERFORMANCE_BENCHMARKS[offerType as keyof typeof PERFORMANCE_BENCHMARKS] || PERFORMANCE_BENCHMARKS.content_bundle;
};

export const isHighPerforming = (conversionRate: number, offerType: string): boolean => {
  const benchmark = getBenchmarkForOfferType(offerType);
  return conversionRate >= benchmark.goodConversionRate;
};

export const generateUpsellId = (): string => {
  return `upsell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const validateUpsellTrigger = (trigger: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!trigger.type) {
    errors.push('Trigger type is required');
  }
  
  if (trigger.type === 'time_spent' && (!trigger.minTimeSpent || trigger.minTimeSpent < 5)) {
    errors.push('Minimum time spent must be at least 5 seconds');
  }
  
  if (trigger.type === 'scroll_depth' && (!trigger.minScrollDepth || trigger.minScrollDepth < 10)) {
    errors.push('Minimum scroll depth must be at least 10%');
  }
  
  if (trigger.type === 'purchase_complete' && (!trigger.purchaseTypes || trigger.purchaseTypes.length === 0)) {
    errors.push('Purchase types are required for purchase triggers');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpsellDesign = (design: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!design.primaryColor || !/^#[0-9A-Fa-f]{6}$/.test(design.primaryColor)) {
    errors.push('Valid primary color is required');
  }
  
  if (!design.backgroundColor || !/^#[0-9A-Fa-f]{6}$/.test(design.backgroundColor)) {
    errors.push('Valid background color is required');
  }
  
  if (design.borderRadius < 0 || design.borderRadius > 50) {
    errors.push('Border radius must be between 0 and 50');
  }
  
  if (design.borderWidth < 0 || design.borderWidth > 10) {
    errors.push('Border width must be between 0 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const formatConversionRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

export const getTimeUntilExpiration = (expiresAt: string): string => {
  const now = new Date().getTime();
  const expires = new Date(expiresAt).getTime();
  const diff = expires - now;
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

export const shouldShowUpsell = (upsell: any, user: any, context: any): { shouldShow: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  
  // Check if upsell is active
  if (!upsell.isActive) {
    reasons.push('Upsell is not active');
    return { shouldShow: false, reasons };
  }
  
  // Check display limits
  if (user.upsellsSeenToday >= DEFAULT_UPSELL_CONFIG.maxUpsellsPerDay) {
    reasons.push('Daily display limit reached');
    return { shouldShow: false, reasons };
  }
  
  if (user.upsellsSeenThisSession >= DEFAULT_UPSELL_CONFIG.maxUpsellsPerSession) {
    reasons.push('Session display limit reached');
    return { shouldShow: false, reasons };
  }
  
  // Check cooldown period
  if (user.lastUpsellShown && 
      (Date.now() - new Date(user.lastUpsellShown).getTime()) < (upsell.cooldownPeriod * 60 * 60 * 1000)) {
    reasons.push('Cooldown period not met');
    return { shouldShow: false, reasons };
  }
  
  // Check max displays per user
  if (user.timesShownThisUpsell >= upsell.maxDisplays) {
    reasons.push('Max displays per user reached');
    return { shouldShow: false, reasons };
  }
  
  reasons.push('All conditions met');
  return { shouldShow: true, reasons };
};