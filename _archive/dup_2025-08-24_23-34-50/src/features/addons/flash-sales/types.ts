// ⚡ FLASH SALES - TYPE DEFINITIONS

export interface FlashSale {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  saleType: 'subscription' | 'ppv_message' | 'virtual_gift' | 'bundle' | 'custom';
  
  // Pricing
  originalPrice: number; // in cents
  salePrice: number; // in cents
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number; // percentage (0-100) or cents for fixed
  
  // Timing
  startsAt: string;
  endsAt: string;
  timezone: string;
  
  // Limits
  maxPurchases?: number; // Total purchase limit
  maxPurchasesPerUser?: number; // Per-user purchase limit
  currentPurchases: number;
  
  // Items included in sale
  items: FlashSaleItem[];
  
  // Visibility and status
  isActive: boolean;
  isPublic: boolean; // Public vs exclusive for subscribers
  requiresSubscription?: boolean;
  
  // Engagement
  viewCount: number;
  conversionRate: number;
  totalRevenue: number; // in cents
  
  // Social features
  allowSharing: boolean;
  shareableUrl?: string;
  
  // Metadata
  tags: string[];
  thumbnailUrl?: string;
  bannerUrl?: string;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  purchases?: FlashSalePurchase[];
}

export interface FlashSaleItem {
  id: string;
  saleId: string;
  itemType: 'subscription_month' | 'subscription_year' | 'ppv_message' | 'virtual_gift_bundle' | 'custom_item';
  itemId?: string; // Reference to PPV message, gift bundle, etc.
  title: string;
  description?: string;
  originalPrice: number; // in cents
  salePrice: number; // in cents
  quantity?: number; // For gift bundles or limited items
  thumbnailUrl?: string;
  order: number;
}

export interface FlashSalePurchase {
  id: string;
  saleId: string;
  buyerId: string;
  itemsPurchased: FlashSalePurchasedItem[];
  totalAmount: number; // in cents
  totalSavings: number; // in cents
  paymentMethod: 'stripe' | 'wallet' | 'credits';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  sale?: FlashSale;
  buyer?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface FlashSalePurchasedItem {
  itemId: string;
  itemType: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  savings: number;
}

export interface FlashSaleStats {
  totalSales: number;
  totalRevenue: number; // in cents
  totalSavingsOffered: number; // in cents
  averageOrderValue: number; // in cents
  conversionRate: number; // percentage
  uniqueBuyers: number;
  repeatBuyers: number;
  viewToSaleConversion: number;
  peakSalesHour: string;
  topPerformingSale?: FlashSale;
  recentPurchases: FlashSalePurchase[];
  salesByTimeOfDay: Array<{
    hour: number;
    sales: number;
    revenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    sales: number;
    revenue: number;
    views: number;
  }>;
}

export interface FlashSaleCreateRequest {
  title: string;
  description: string;
  saleType: FlashSale['saleType'];
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  startsAt: string;
  endsAt: string;
  timezone: string;
  maxPurchases?: number;
  maxPurchasesPerUser?: number;
  items: Omit<FlashSaleItem, 'id' | 'saleId'>[];
  isPublic: boolean;
  requiresSubscription?: boolean;
  allowSharing: boolean;
  tags: string[];
  thumbnailUrl?: string;
  bannerUrl?: string;
}

export interface FlashSaleUpdateRequest {
  title?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
  endsAt?: string; // Can extend but not shorten active sales
  maxPurchases?: number;
  maxPurchasesPerUser?: number;
  isActive?: boolean;
  isPublic?: boolean;
  allowSharing?: boolean;
  tags?: string[];
  thumbnailUrl?: string;
  bannerUrl?: string;
}

export interface FlashSalePurchaseRequest {
  saleId: string;
  items: Array<{
    itemId: string;
    quantity?: number;
  }>;
  paymentMethod: 'stripe' | 'wallet' | 'credits';
  promoCode?: string;
}

export interface FlashSaleFilter {
  creatorId?: string;
  saleType?: FlashSale['saleType'];
  status?: 'upcoming' | 'active' | 'ended' | 'all';
  isPublic?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  sortBy?: 'newest' | 'ending_soon' | 'price_low' | 'price_high' | 'popular' | 'biggest_savings';
  limit?: number;
  offset?: number;
}

export interface FlashSaleTemplate {
  id: string;
  name: string;
  description: string;
  saleType: FlashSale['saleType'];
  recommendedDuration: number; // in hours
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  items: Omit<FlashSaleItem, 'id' | 'saleId'>[];
  tags: string[];
  category: 'beginner' | 'standard' | 'premium' | 'holiday' | 'special';
}

export interface FlashSaleNotification {
  id: string;
  userId: string;
  saleId: string;
  type: 'sale_starting' | 'sale_ending' | 'sale_purchased' | 'sale_created' | 'reminder';
  title: string;
  message: string;
  scheduledFor: string;
  sentAt?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FlashSaleAnalytics {
  saleId: string;
  views: number;
  uniqueViews: number;
  purchases: number;
  revenue: number; // in cents
  conversionRate: number;
  averageTimeOnPage: number; // seconds
  bounceRate: number; // percentage
  shareCount: number;
  topReferrers: Array<{
    source: string;
    views: number;
    conversions: number;
  }>;
  hourlyBreakdown: Array<{
    hour: string;
    views: number;
    purchases: number;
    revenue: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  geographicStats: Array<{
    country: string;
    views: number;
    purchases: number;
    revenue: number;
  }>;
}

export interface FlashSaleConfig {
  enabled: boolean;
  maxActiveSalesPerCreator: number;
  minSaleDuration: number; // in minutes
  maxSaleDuration: number; // in hours
  maxDiscountPercentage: number; // max % discount allowed
  maxFixedDiscount: number; // max fixed discount in cents
  allowFutureSales: boolean; // Allow scheduling sales in advance
  maxFutureScheduleDays: number; // Max days in advance
  requireApproval: boolean; // Require admin approval for sales
  platformCommission: number; // Platform fee on flash sales (0.05 = 5%)
  creatorCommission: number; // Creator earnings (0.95 = 95%)
  allowItemBundles: boolean;
  maxItemsPerSale: number;
  allowRecurring: boolean; // Allow repeating flash sales
  notificationSettings: {
    sendStartReminders: boolean;
    sendEndingReminders: boolean;
    reminderHoursBefore: number[];
  };
  socialFeatures: {
    allowSharing: boolean;
    generateShareImages: boolean;
    socialMediaIntegration: boolean;
  };
}

export interface FlashSaleLeaderboard {
  period: 'today' | 'week' | 'month' | 'all_time';
  topCreatorsBySales: Array<{
    creatorId: string;
    username: string;
    totalSales: number;
    totalRevenue: number;
    avgConversionRate: number;
  }>;
  topSalesByRevenue: FlashSale[];
  topSalesByConversion: FlashSale[];
  fastestSellouts: Array<{
    sale: FlashSale;
    selloutTimeMinutes: number;
  }>;
}

// Event types for real-time updates
export interface FlashSaleStartedEvent {
  type: 'FLASH_SALE_STARTED';
  sale: FlashSale;
  timestamp: string;
}

export interface FlashSaleEndingEvent {
  type: 'FLASH_SALE_ENDING';
  sale: FlashSale;
  minutesRemaining: number;
  timestamp: string;
}

export interface FlashSalePurchasedEvent {
  type: 'FLASH_SALE_PURCHASED';
  purchase: FlashSalePurchase;
  remainingQuantity?: number;
  timestamp: string;
}

export interface FlashSaleUpdatedEvent {
  type: 'FLASH_SALE_UPDATED';
  sale: FlashSale;
  changes: Partial<FlashSale>;
  timestamp: string;
}

// Scheduling and automation
export interface FlashSaleSchedule {
  id: string;
  creatorId: string;
  templateId?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  nextRunAt: string;
  lastRunAt?: string;
  isActive: boolean;
  settings: FlashSaleCreateRequest;
  createdAt: string;
  updatedAt: string;
}

// A/B Testing for flash sales
export interface FlashSaleVariant {
  id: string;
  saleId: string;
  name: string;
  discountValue: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  trafficPercentage: number; // 0-100
  views: number;
  conversions: number;
  revenue: number;
  isWinner?: boolean;
  createdAt: string;
}

// Revenue sharing for flash sales
export interface FlashSaleRevenueShare {
  platformFee: number; // Platform commission on flash sales
  creatorShare: number; // Creator earnings
  processingFee: number; // Payment processing fees
  affiliateShare?: number; // If affiliate/referral program
}

// Fraud prevention
export interface FlashSaleFraudCheck {
  saleId: string;
  buyerId: string;
  checks: {
    velocityCheck: boolean; // Too many purchases in short time
    duplicateCheck: boolean; // Duplicate purchases
    ipGeolocationCheck: boolean; // Suspicious location
    paymentMethodCheck: boolean; // Flagged payment method
  };
  riskScore: number; // 0-100
  action: 'allow' | 'review' | 'block';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Integration with other addons
export interface FlashSaleIntegration {
  virtualGifts: {
    enabled: boolean;
    allowGiftBundles: boolean;
    discountGiftPurchases: boolean;
  };
  ppvMessages: {
    enabled: boolean;
    allowMessageBundles: boolean;
    bulkMessageDiscounts: boolean;
  };
  subscriptions: {
    enabled: boolean;
    discountSubscriptions: boolean;
    upgradePromotions: boolean;
  };
}