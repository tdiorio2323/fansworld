// 🔒 PPV MESSAGES - TYPE DEFINITIONS

export interface PPVMessage {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  price: number; // in cents
  content: PPVMessageContent[];
  thumbnailUrl?: string;
  previewText?: string; // First 50 chars visible for free
  isActive: boolean;
  expiresAt?: string; // Optional expiration date
  maxViews?: number; // Optional view limit
  currentViews: number;
  totalEarnings: number; // in cents
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  purchases?: PPVPurchase[];
  tags?: string[];
}

export interface PPVMessageContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  content: string; // Text content or file URL
  caption?: string;
  thumbnail?: string; // For video/file previews
  duration?: number; // For video/audio in seconds
  fileSize?: number; // In bytes
  mimeType?: string;
  order: number; // Display order
}

export interface PPVPurchase {
  id: string;
  messageId: string;
  buyerId: string;
  amount: number; // in cents
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'wallet' | 'credits';
  stripePaymentIntentId?: string;
  viewCount: number;
  lastViewedAt?: string;
  expiresAt?: string; // Time-limited access
  createdAt: string;
  updatedAt: string;
  
  // Relations
  message?: PPVMessage;
  buyer?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface PPVMessageStats {
  totalMessages: number;
  totalEarnings: number; // in cents
  totalViews: number;
  totalBuyers: number;
  averagePrice: number; // in cents
  conversionRate: number; // percentage
  topPerformingMessage?: PPVMessage;
  recentPurchases: PPVPurchase[];
  earningsThisMonth: number;
  earningsLastMonth: number;
  viewsThisMonth: number;
  viewsLastMonth: number;
}

export interface PPVCreateRequest {
  title: string;
  description?: string;
  price: number; // in cents
  content: Omit<PPVMessageContent, 'id'>[];
  thumbnailUrl?: string;
  previewText?: string;
  expiresAt?: string;
  maxViews?: number;
  tags?: string[];
}

export interface PPVUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  thumbnailUrl?: string;
  previewText?: string;
  isActive?: boolean;
  expiresAt?: string;
  maxViews?: number;
  tags?: string[];
}

export interface PPVPurchaseRequest {
  messageId: string;
  paymentMethod: 'stripe' | 'wallet' | 'credits';
  usePromoCode?: string;
}

export interface PPVMessageFilter {
  creatorId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  contentTypes?: PPVMessageContent['type'][];
  tags?: string[];
  isActive?: boolean;
  hasExpiration?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular' | 'earnings';
  limit?: number;
  offset?: number;
}

export interface PPVConfig {
  enabled: boolean;
  minPrice: number; // Minimum price in cents ($0.99 = 99)
  maxPrice: number; // Maximum price in cents ($999.99 = 99999)
  platformCommission: number; // Platform fee (0.1 = 10%)
  creatorCommission: number; // Creator keeps (0.9 = 90%)
  maxContentItems: number; // Max content pieces per message
  maxFileSize: number; // Max file size in bytes
  supportedFileTypes: string[]; // Allowed MIME types
  defaultExpirationDays: number; // Default message expiration
  allowPreviewText: boolean;
  allowThumbnails: boolean;
  allowExpiration: boolean;
  allowViewLimits: boolean;
  maxPreviewLength: number; // Max preview text characters
  watermarkEnabled: boolean; // Add watermarks to content
}

export interface PPVPromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // Percentage (0-100) or fixed amount in cents
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicableMessages?: string[]; // Specific message IDs
  creatorId?: string; // Creator-specific promo codes
  createdAt: string;
  updatedAt: string;
}

export interface PPVAnalytics {
  messageId: string;
  views: number;
  uniqueViews: number;
  purchases: number;
  earnings: number; // in cents
  conversionRate: number;
  averageViewTime: number; // seconds
  bounceRate: number; // percentage
  refundRate: number; // percentage
  topBuyers: Array<{
    userId: string;
    username: string;
    purchaseCount: number;
    totalSpent: number;
  }>;
  viewsByDate: Array<{
    date: string;
    views: number;
    purchases: number;
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
  }>;
}

// Event types for real-time updates
export interface PPVPurchaseEvent {
  type: 'PPV_PURCHASE_COMPLETED';
  purchase: PPVPurchase;
  timestamp: string;
}

export interface PPVMessageViewEvent {
  type: 'PPV_MESSAGE_VIEWED';
  messageId: string;
  viewerId: string;
  timestamp: string;
}

export interface PPVEarningsEvent {
  type: 'PPV_EARNINGS_UPDATED';
  creatorId: string;
  messageId: string;
  amount: number;
  timestamp: string;
}

// Notification types
export interface PPVNotification {
  id: string;
  userId: string;
  type: 'purchase_completed' | 'message_expired' | 'earnings_milestone' | 'new_purchase';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Revenue sharing configuration
export interface PPVRevenueShare {
  platformFee: number; // Platform commission
  creatorShare: number; // Creator earnings
  processingFee: number; // Payment processing fees
  taxWithholding?: number; // Tax withholding if applicable
}

// Content moderation
export interface PPVModerationFlag {
  id: string;
  messageId: string;
  flaggedBy: string;
  reason: 'inappropriate' | 'copyright' | 'spam' | 'misleading' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Subscription integration
export interface PPVSubscriptionDiscount {
  subscriberTier: 'basic' | 'premium' | 'vip';
  discountPercentage: number; // 0-100
  appliesTo: 'all' | 'creator_messages' | 'specific_messages';
  messageIds?: string[];
}

export interface PPVWallet {
  userId: string;
  balance: number; // in cents
  currency: 'USD' | 'EUR' | 'GBP'; // expandable
  transactions: PPVWalletTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface PPVWalletTransaction {
  id: string;
  walletId: string;
  type: 'credit' | 'debit' | 'refund' | 'withdrawal';
  amount: number; // in cents
  description: string;
  relatedPurchaseId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}