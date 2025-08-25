// 💌 CUSTOM CONTENT REQUESTS - TYPE DEFINITIONS

export interface ContentRequest {
  id: string;
  requesterId: string;
  creatorId: string;
  
  // Request details
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'text' | 'live_session' | 'custom_message' | 'outfit' | 'role_play';
  category: 'general' | 'photo_session' | 'video_call' | 'custom_content' | 'personal_message' | 'special_occasion';
  
  // Requirements and specifications
  specifications: RequestSpecification[];
  duration?: number; // in minutes for video/audio/calls
  deliverables: string[]; // What the requester expects to receive
  
  // Pricing and payment
  budget: number; // Suggested budget in cents
  finalPrice?: number; // Agreed price in cents
  isPremium: boolean; // Premium request with higher priority
  paymentStatus: 'pending' | 'escrowed' | 'completed' | 'refunded' | 'cancelled';
  stripePaymentIntentId?: string;
  
  // Timing
  deadline?: string;
  preferredCompletionTime?: string;
  estimatedDelivery?: string;
  
  // Privacy and sharing
  isPrivate: boolean; // Only for requester vs public on profile
  allowCreatorSharing: boolean; // Can creator share publicly
  isAnonymous: boolean; // Hide requester identity
  
  // Request status
  status: 'draft' | 'submitted' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'delivered' | 'cancelled' | 'disputed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Creator response
  creatorResponse?: string;
  creatorQuote?: number; // Counter-offer in cents
  creatorDeadline?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  deliveredAt?: string;
  
  // Content and deliverables
  deliveredContent: DeliveredContent[];
  
  // Communication
  messageThread?: RequestMessage[];
  allowMessages: boolean;
  
  // Reviews and feedback
  requesterRating?: number; // 1-5
  requesterReview?: string;
  creatorRating?: number; // 1-5
  creatorReview?: string;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  requester?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
}

export interface RequestSpecification {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'number' | 'choice' | 'file' | 'date' | 'time';
  required: boolean;
  options?: string[]; // For choice type
}

export interface DeliveredContent {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'file';
  url?: string;
  text?: string;
  filename?: string;
  fileSize?: number;
  duration?: number; // For video/audio
  thumbnailUrl?: string;
  order: number;
  createdAt: string;
}

export interface RequestMessage {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string;
  isFromCreator: boolean;
  createdAt: string;
  
  sender?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface RequestTemplate {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  type: ContentRequest['type'];
  category: ContentRequest['category'];
  
  // Template settings
  basePrice: number; // in cents
  specifications: Omit<RequestSpecification, 'id' | 'value'>[];
  estimatedDeliveryDays: number;
  maxRevisions: number;
  
  // Options
  allowCustomizations: boolean;
  requiresApproval: boolean; // Creator must approve before payment
  isActive: boolean;
  
  // Stats
  orderCount: number;
  averageRating: number;
  
  createdAt: string;
  updatedAt: string;
  
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface RequestOffer {
  id: string;
  requestId: string;
  creatorId: string;
  
  // Offer details
  price: number; // in cents
  deliveryTime: number; // in days
  message: string;
  revisions: number; // Number of revisions included
  
  // Additional services
  rushDelivery?: {
    enabled: boolean;
    extraCost: number;
    timeReduction: number; // days reduced
  };
  
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  
  createdAt: string;
  updatedAt: string;
  
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
}

export interface RequestCreateRequest {
  creatorId: string;
  title: string;
  description: string;
  type: ContentRequest['type'];
  category: ContentRequest['category'];
  specifications: Omit<RequestSpecification, 'id'>[];
  duration?: number;
  deliverables: string[];
  budget: number;
  deadline?: string;
  preferredCompletionTime?: string;
  isPrivate: boolean;
  allowCreatorSharing: boolean;
  isAnonymous: boolean;
  priority: ContentRequest['priority'];
  allowMessages: boolean;
}

export interface RequestUpdateRequest {
  title?: string;
  description?: string;
  specifications?: RequestSpecification[];
  budget?: number;
  deadline?: string;
  priority?: ContentRequest['priority'];
  status?: ContentRequest['status'];
}

export interface TemplateCreateRequest {
  name: string;
  description: string;
  type: ContentRequest['type'];
  category: ContentRequest['category'];
  basePrice: number;
  specifications: Omit<RequestSpecification, 'id' | 'value'>[];
  estimatedDeliveryDays: number;
  maxRevisions: number;
  allowCustomizations: boolean;
  requiresApproval: boolean;
}

export interface RequestFilter {
  creatorId?: string;
  requesterId?: string;
  status?: ContentRequest['status'][];
  type?: ContentRequest['type'];
  category?: ContentRequest['category'];
  priority?: ContentRequest['priority'];
  isPremium?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  hasDeadline?: boolean;
  sortBy?: 'newest' | 'oldest' | 'price_high' | 'price_low' | 'deadline' | 'priority';
  limit?: number;
  offset?: number;
}

export interface RequestStats {
  // Overview
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalRevenue: number; // in cents
  averageOrderValue: number;
  
  // Performance
  completionRate: number; // percentage
  averageDeliveryTime: number; // in days
  averageRating: number;
  repeatCustomerRate: number;
  
  // Financial
  pendingEarnings: number; // in escrow
  monthlyRevenue: number;
  topEarningCategory: string;
  
  // Engagement
  responseTime: number; // average response time in hours
  acceptanceRate: number; // requests accepted vs received
  
  // Analytics
  requestsByType: Record<string, number>;
  requestsByCategory: Record<string, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
  topRequestersBySpent: Array<{
    requesterId: string;
    username: string;
    totalSpent: number;
    requestCount: number;
  }>;
}

export interface RequestAnalytics {
  requestId: string;
  
  // Timeline
  timeToAcceptance: number; // hours from submission to acceptance
  timeToCompletion: number; // hours from acceptance to completion
  timeToDelivery: number; // hours from completion to delivery
  
  // Communication
  messageCount: number;
  responseTime: number; // average response time in hours
  
  // Revisions and changes
  revisionCount: number;
  changeRequests: number;
  
  // Financial
  originalBudget: number;
  finalPrice: number;
  priceNegotiationRounds: number;
  
  // Satisfaction
  requesterSatisfaction: number; // 1-5
  creatorSatisfaction: number; // 1-5
  
  // Performance
  deliveredOnTime: boolean;
  metRequirements: boolean;
  qualityScore: number; // internal quality assessment
}

// Real-time events
export interface RequestSubmittedEvent {
  type: 'REQUEST_SUBMITTED';
  request: ContentRequest;
  timestamp: string;
}

export interface RequestAcceptedEvent {
  type: 'REQUEST_ACCEPTED';
  request: ContentRequest;
  offer?: RequestOffer;
  timestamp: string;
}

export interface RequestCompletedEvent {
  type: 'REQUEST_COMPLETED';
  request: ContentRequest;
  deliveredContent: DeliveredContent[];
  timestamp: string;
}

export interface RequestMessageEvent {
  type: 'REQUEST_MESSAGE';
  request: ContentRequest;
  message: RequestMessage;
  timestamp: string;
}

// Configuration
export interface RequestConfig {
  enabled: boolean;
  
  // Request limits
  maxActiveRequests: number; // Per requester
  maxPendingRequests: number; // Per creator
  
  // Pricing
  minRequestPrice: number; // in cents
  maxRequestPrice: number; // in cents
  platformFee: number; // percentage (0.1 = 10%)
  
  // Timing
  defaultDeadlineDays: number;
  maxDeadlineDays: number;
  autoAcceptanceHours: number; // Auto-accept if no response
  
  // Features
  allowAnonymousRequests: boolean;
  allowRushDelivery: boolean;
  enableRequestTemplates: boolean;
  enableMessageThread: boolean;
  enableRevisions: boolean;
  maxRevisions: number;
  
  // Content
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  maxDeliverables: number;
  
  // Categories and types
  enabledTypes: ContentRequest['type'][];
  enabledCategories: ContentRequest['category'][];
  
  // Quality control
  requireCreatorApproval: boolean;
  enableDisputeResolution: boolean;
  autoRefundDays: number; // Auto-refund if not delivered
  
  // Communication
  maxMessagesPerRequest: number;
  enableFileSharing: boolean;
  enableVideoMessages: boolean;
}