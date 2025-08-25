// ⚡ FLASH SALES - CONFIGURATION SETTINGS

import { FlashSaleConfig, FlashSaleTemplate, FlashSaleRevenueShare } from './types';

export const DEFAULT_FLASH_SALES_CONFIG: FlashSaleConfig = {
  enabled: true,
  maxActiveSalesPerCreator: 3, // Max concurrent flash sales per creator
  minSaleDuration: 30, // 30 minutes minimum
  maxSaleDuration: 72, // 72 hours maximum
  maxDiscountPercentage: 80, // Max 80% discount
  maxFixedDiscount: 10000, // Max $100 fixed discount
  allowFutureSales: true, // Allow scheduling in advance
  maxFutureScheduleDays: 30, // Max 30 days in advance
  requireApproval: false, // No admin approval required
  platformCommission: 0.05, // 5% platform fee on flash sales
  creatorCommission: 0.95, // 95% to creator
  allowItemBundles: true,
  maxItemsPerSale: 10,
  allowRecurring: true,
  notificationSettings: {
    sendStartReminders: true,
    sendEndingReminders: true,
    reminderHoursBefore: [24, 4, 1], // 24h, 4h, 1h before
  },
  socialFeatures: {
    allowSharing: true,
    generateShareImages: true,
    socialMediaIntegration: true,
  },
};

// Pre-built flash sale templates
export const FLASH_SALE_TEMPLATES: FlashSaleTemplate[] = [
  // Beginner Templates
  {
    id: 'subscription-50-off',
    name: '50% Off Subscription',
    description: 'Half price on monthly subscriptions - great for first-time flash sales',
    saleType: 'subscription',
    recommendedDuration: 24,
    discountType: 'percentage',
    discountValue: 50,
    items: [
      {
        itemType: 'subscription_month',
        title: '50% Off Monthly Subscription',
        description: 'Access all premium content for half the regular price',
        originalPrice: 1999, // $19.99
        salePrice: 999, // $9.99
        order: 0,
      }
    ],
    tags: ['subscription', 'beginner', 'popular'],
    category: 'beginner',
  },
  
  {
    id: 'ppv-bundle-basic',
    name: 'PPV Message Bundle',
    description: '3 premium messages at a discounted rate',
    saleType: 'bundle',
    recommendedDuration: 12,
    discountType: 'percentage',
    discountValue: 30,
    items: [
      {
        itemType: 'ppv_message',
        title: 'Premium Content Bundle (3 Messages)',
        description: 'Get 3 exclusive messages for less than the price of 2',
        originalPrice: 2997, // 3 x $9.99
        salePrice: 2099, // ~$21
        quantity: 3,
        order: 0,
      }
    ],
    tags: ['ppv', 'bundle', 'content'],
    category: 'beginner',
  },

  // Standard Templates
  {
    id: 'flash-24h-mega',
    name: '24-Hour Mega Sale',
    description: 'Everything discounted for 24 hours only',
    saleType: 'bundle',
    recommendedDuration: 24,
    discountType: 'percentage',
    discountValue: 40,
    items: [
      {
        itemType: 'subscription_month',
        title: '40% Off Monthly Subscription',
        originalPrice: 1999,
        salePrice: 1199,
        order: 0,
      },
      {
        itemType: 'virtual_gift_bundle',
        title: 'Virtual Gift Package',
        description: '50 virtual gifts bundle',
        originalPrice: 5000,
        salePrice: 3000,
        quantity: 50,
        order: 1,
      }
    ],
    tags: ['mega-sale', 'everything', '24hour'],
    category: 'standard',
  },

  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior Sale',
    description: 'Weekend-long promotional event',
    saleType: 'bundle',
    recommendedDuration: 48,
    discountType: 'percentage',
    discountValue: 35,
    items: [
      {
        itemType: 'subscription_month',
        title: 'Weekend Special - Monthly Sub',
        originalPrice: 1999,
        salePrice: 1299,
        order: 0,
      },
      {
        itemType: 'ppv_message',
        title: 'Exclusive Weekend Content',
        originalPrice: 999,
        salePrice: 649,
        order: 1,
      }
    ],
    tags: ['weekend', 'special', 'limited'],
    category: 'standard',
  },

  // Premium Templates
  {
    id: 'vip-exclusive-sale',
    name: 'VIP Exclusive Flash Sale',
    description: 'Exclusive deals for VIP subscribers only',
    saleType: 'bundle',
    recommendedDuration: 6,
    discountType: 'percentage',
    discountValue: 60,
    items: [
      {
        itemType: 'subscription_year',
        title: 'VIP Annual Subscription (60% Off)',
        originalPrice: 19999, // $199.99
        salePrice: 7999, // $79.99
        order: 0,
      },
      {
        itemType: 'custom_item',
        title: 'Personal Video Message',
        description: 'Custom video message just for you',
        originalPrice: 9999,
        salePrice: 3999,
        order: 1,
      }
    ],
    tags: ['vip', 'exclusive', 'premium', 'annual'],
    category: 'premium',
  },

  // Holiday Templates
  {
    id: 'black-friday-mega',
    name: 'Black Friday Mega Deal',
    description: 'Biggest savings of the year - Black Friday special',
    saleType: 'bundle',
    recommendedDuration: 48,
    discountType: 'percentage',
    discountValue: 70,
    items: [
      {
        itemType: 'subscription_year',
        title: 'Annual Subscription (70% Off)',
        originalPrice: 19999,
        salePrice: 5999,
        order: 0,
      },
      {
        itemType: 'virtual_gift_bundle',
        title: 'Black Friday Gift Pack',
        quantity: 100,
        originalPrice: 10000,
        salePrice: 3000,
        order: 1,
      }
    ],
    tags: ['black-friday', 'holiday', 'biggest-savings'],
    category: 'holiday',
  },

  {
    id: 'valentines-romance',
    name: 'Valentine\'s Romance Sale',
    description: 'Love-themed content and gifts at special prices',
    saleType: 'bundle',
    recommendedDuration: 72,
    discountType: 'percentage',
    discountValue: 45,
    items: [
      {
        itemType: 'ppv_message',
        title: 'Valentine\'s Exclusive Content',
        originalPrice: 1499,
        salePrice: 824,
        order: 0,
      },
      {
        itemType: 'virtual_gift_bundle',
        title: 'Romance Gift Bundle',
        description: 'Hearts, roses, and love-themed gifts',
        quantity: 25,
        originalPrice: 2500,
        salePrice: 1375,
        order: 1,
      }
    ],
    tags: ['valentines', 'romance', 'holiday', 'love'],
    category: 'holiday',
  },
];

// Sale type configurations
export const SALE_TYPE_CONFIG = {
  subscription: {
    icon: '🔔',
    label: 'Subscription Sale',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Discounted subscription access',
    allowedItems: ['subscription_month', 'subscription_year'],
  },
  ppv_message: {
    icon: '🔒',
    label: 'PPV Message Sale',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    description: 'Premium message discounts',
    allowedItems: ['ppv_message'],
  },
  virtual_gift: {
    icon: '🎁',
    label: 'Gift Bundle Sale',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    description: 'Virtual gift packages',
    allowedItems: ['virtual_gift_bundle'],
  },
  bundle: {
    icon: '📦',
    label: 'Everything Bundle',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    description: 'Mix of different content types',
    allowedItems: ['subscription_month', 'subscription_year', 'ppv_message', 'virtual_gift_bundle', 'custom_item'],
  },
  custom: {
    icon: '⭐',
    label: 'Custom Sale',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    description: 'Unique custom offerings',
    allowedItems: ['custom_item'],
  },
};

// Revenue sharing configuration
export const FLASH_SALE_REVENUE_SHARE: FlashSaleRevenueShare = {
  platformFee: 0.05, // 5% to platform (lower than regular to incentivize flash sales)
  creatorShare: 0.92, // 92% to creator
  processingFee: 0.03, // 3% payment processing (Stripe fees)
  affiliateShare: 0.00, // No affiliate program by default
};

// Quick discount options
export const QUICK_DISCOUNT_OPTIONS = [
  { label: '10% OFF', type: 'percentage', value: 10, description: 'Small discount' },
  { label: '25% OFF', type: 'percentage', value: 25, description: 'Popular choice' },
  { label: '50% OFF', type: 'percentage', value: 50, description: 'Half price' },
  { label: '70% OFF', type: 'percentage', value: 70, description: 'Big savings' },
  { label: '$5 OFF', type: 'fixed_amount', value: 500, description: 'Fixed discount' },
  { label: '$10 OFF', type: 'fixed_amount', value: 1000, description: 'Fixed discount' },
  { label: '$25 OFF', type: 'fixed_amount', value: 2500, description: 'Fixed discount' },
];

// Duration presets (in hours)
export const DURATION_PRESETS = [
  { label: '1 Hour', value: 1, description: 'Lightning fast' },
  { label: '6 Hours', value: 6, description: 'Quarter day' },
  { label: '12 Hours', value: 12, description: 'Half day' },
  { label: '24 Hours', value: 24, description: 'Full day' },
  { label: '48 Hours', value: 48, description: 'Weekend' },
  { label: '72 Hours', value: 72, description: '3 days' },
];

// Sale status configurations
export const SALE_STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: '⏳',
  },
  active: {
    label: 'Live Now',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: '⚡',
  },
  ending_soon: {
    label: 'Ending Soon',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    icon: '⏰',
  },
  ended: {
    label: 'Ended',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    icon: '✅',
  },
  sold_out: {
    label: 'Sold Out',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: '🎯',
  },
  paused: {
    label: 'Paused',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: '⏸️',
  },
};

// Popular tags for flash sales
export const FLASH_SALE_POPULAR_TAGS = [
  // Time-based
  'flash-sale', 'limited-time', '24-hour', 'weekend-only', 'one-day-only',
  
  // Discount-based  
  'half-price', 'mega-savings', 'biggest-discount', 'clearance', 'best-deal',
  
  // Event-based
  'black-friday', 'cyber-monday', 'valentines', 'summer-sale', 'holiday-special',
  
  // Content-based
  'subscription-deal', 'bundle-pack', 'premium-content', 'exclusive-access',
  
  // Urgency
  'ending-soon', 'last-chance', 'final-hours', 'almost-sold-out', 'limited-quantity',
  
  // Social
  'subscriber-only', 'vip-exclusive', 'member-special', 'fan-appreciation',
];

// Notification templates
export const FLASH_SALE_NOTIFICATIONS = {
  sale_starting: {
    title: '⚡ Flash Sale Starting Now!',
    message: 'Your flash sale "{saleTitle}" is now live! Time to boost those sales 🚀',
  },
  sale_ending_24h: {
    title: '⏰ 24 Hours Left!',
    message: 'Only 24 hours remaining on your "{saleTitle}" flash sale',
  },
  sale_ending_1h: {
    title: '🔥 Final Hour!',
    message: 'Last chance! Your "{saleTitle}" sale ends in 1 hour',
  },
  sale_purchased: {
    title: '💰 Flash Sale Purchase!',
    message: '{buyerName} just purchased your "{saleTitle}" for {amount}!',
  },
  sale_sold_out: {
    title: '🎉 Sold Out!',
    message: 'Congratulations! Your "{saleTitle}" flash sale is completely sold out',
  },
};

// Social media share templates
export const SHARE_TEMPLATES = {
  twitter: {
    template: '⚡ FLASH SALE ALERT! Get {discount} off {saleTitle} - but hurry, this deal ends in {timeLeft}! 🔥 {url} #FlashSale #LimitedTime',
    maxLength: 280,
  },
  instagram: {
    template: '⚡ FLASH SALE ⚡\n\n{saleTitle}\n{discount} OFF for {duration} only!\n\nDon\'t miss out - link in bio 🔥\n\n#FlashSale #LimitedTime #DontMissOut',
  },
  facebook: {
    template: '⚡ FLASH SALE ALERT! ⚡\n\nI\'m running an exclusive {duration} flash sale on {saleTitle}!\n\nGet {discount} off - but you need to hurry because this deal won\'t last long! ⏰\n\nGrab it now: {url}',
  },
};

// Analytics periods for reporting
export const ANALYTICS_PERIODS = [
  { label: 'Last Hour', value: 'hour', hours: 1 },
  { label: 'Last 6 Hours', value: '6hours', hours: 6 },
  { label: 'Last 24 Hours', value: 'day', hours: 24 },
  { label: 'Last Week', value: 'week', hours: 168 },
  { label: 'Last Month', value: 'month', hours: 720 },
  { label: 'All Time', value: 'all', hours: -1 },
];

// Utility functions
export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

export const calculateDiscount = (originalPrice: number, discountType: 'percentage' | 'fixed_amount', discountValue: number): number => {
  if (discountType === 'percentage') {
    return Math.round(originalPrice * (discountValue / 100));
  } else {
    return Math.min(discountValue, originalPrice); // Can't discount more than the original price
  }
};

export const calculateSalePrice = (originalPrice: number, discountType: 'percentage' | 'fixed_amount', discountValue: number): number => {
  const discountAmount = calculateDiscount(originalPrice, discountType, discountValue);
  return Math.max(0, originalPrice - discountAmount);
};

export const calculateSavingsPercentage = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const getSaleStatus = (sale: { startsAt: string; endsAt: string; maxPurchases?: number; currentPurchases: number; isActive: boolean }): keyof typeof SALE_STATUS_CONFIG => {
  if (!sale.isActive) return 'paused';
  
  const now = new Date();
  const startTime = new Date(sale.startsAt);
  const endTime = new Date(sale.endsAt);
  
  // Check if sold out
  if (sale.maxPurchases && sale.currentPurchases >= sale.maxPurchases) {
    return 'sold_out';
  }
  
  // Check timing
  if (now < startTime) return 'upcoming';
  if (now > endTime) return 'ended';
  
  // Check if ending soon (within 4 hours)
  const hoursUntilEnd = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursUntilEnd <= 4) return 'ending_soon';
  
  return 'active';
};

export const formatTimeRemaining = (endsAt: string): string => {
  const now = new Date();
  const endTime = new Date(endsAt);
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const isValidSaleTime = (startsAt: string, endsAt: string): { valid: boolean; error?: string } => {
  const now = new Date();
  const startTime = new Date(startsAt);
  const endTime = new Date(endsAt);
  
  if (startTime <= now) {
    return { valid: false, error: 'Start time must be in the future' };
  }
  
  if (endTime <= startTime) {
    return { valid: false, error: 'End time must be after start time' };
  }
  
  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  
  if (durationHours < DEFAULT_FLASH_SALES_CONFIG.minSaleDuration / 60) {
    return { valid: false, error: `Sale duration must be at least ${DEFAULT_FLASH_SALES_CONFIG.minSaleDuration} minutes` };
  }
  
  if (durationHours > DEFAULT_FLASH_SALES_CONFIG.maxSaleDuration) {
    return { valid: false, error: `Sale duration cannot exceed ${DEFAULT_FLASH_SALES_CONFIG.maxSaleDuration} hours` };
  }
  
  return { valid: true };
};

export const validateDiscountValue = (discountType: 'percentage' | 'fixed_amount', discountValue: number, originalPrice?: number): { valid: boolean; error?: string } => {
  if (discountValue <= 0) {
    return { valid: false, error: 'Discount value must be greater than 0' };
  }
  
  if (discountType === 'percentage') {
    if (discountValue > DEFAULT_FLASH_SALES_CONFIG.maxDiscountPercentage) {
      return { valid: false, error: `Maximum discount is ${DEFAULT_FLASH_SALES_CONFIG.maxDiscountPercentage}%` };
    }
  } else {
    if (discountValue > DEFAULT_FLASH_SALES_CONFIG.maxFixedDiscount) {
      return { valid: false, error: `Maximum fixed discount is ${formatPrice(DEFAULT_FLASH_SALES_CONFIG.maxFixedDiscount)}` };
    }
    
    if (originalPrice && discountValue >= originalPrice) {
      return { valid: false, error: 'Fixed discount cannot be greater than or equal to the original price' };
    }
  }
  
  return { valid: true };
};