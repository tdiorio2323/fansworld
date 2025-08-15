// ENHANCED TYPE SYSTEM - TD Studios Ecosystem
// Comprehensive type safety with strict validation

import { z } from 'zod';

// =============================================================================
// SECURITY & VALIDATION TYPES
// =============================================================================

export const securitySchemas = {
  email: z.string().email().max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes'),
  vipCode: z.string()
    .min(6, 'VIP code too short')
    .max(15, 'VIP code too long')
    .regex(/^[A-Z0-9]+$/, 'VIP code must be uppercase alphanumeric'),
  uuid: z.string().uuid(),
  url: z.string().url().max(2048),
  amount: z.number().positive().max(999999.99),
  text: z.string().max(10000),
  html: z.string().max(50000)
};

// =============================================================================
// AI ENGINE TYPES
// =============================================================================

export interface AIProviderConfig {
  name: 'claude' | 'openai';
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
}

export interface AIRequest {
  prompt: string;
  type: 'bio' | 'social' | 'email' | 'description' | 'marketing' | 'html';
  complexity: 'low' | 'medium' | 'high';
  context?: Record<string, unknown>;
  useCache?: boolean;
}

export interface AIResponse {
  content: string;
  provider: 'claude' | 'openai';
  model: string;
  tokensUsed?: number;
  processingTime: number;
  cached: boolean;
  confidence?: number;
  reason: string;
  metadata: {
    generatedAt: string;
    requestId: string;
    retryCount: number;
    [key: string]: unknown;
  };
}

export interface ConnectionPoolStats {
  totalConnections: number;
  activeConnections: number;
  claudeConnections: number;
  openaiConnections: number;
  requestsServed: number;
  failures: number;
  averageResponseTime: number;
  healthyConnections: number;
}

// =============================================================================
// USER & AUTHENTICATION TYPES
// =============================================================================

export const userRoles = ['user', 'creator', 'admin', 'super_admin'] as const;
export type UserRole = typeof userRoles[number];

export const subscriptionTiers = ['free', 'premium', 'vip', 'founder'] as const;
export type SubscriptionTier = typeof subscriptionTiers[number];

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  isVerified: boolean;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  metadata: {
    loginCount: number;
    preferences: Record<string, unknown>;
    flags: string[];
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// =============================================================================
// CREATOR & CONTENT TYPES
// =============================================================================

export const contentTypes = ['image', 'video', 'audio', 'text', 'link'] as const;
export type ContentType = typeof contentTypes[number];

export const contentVisibility = ['public', 'subscribers', 'vip', 'private'] as const;
export type ContentVisibility = typeof contentVisibility[number];

export interface Creator {
  id: string;
  userId: string;
  displayName: string;
  slug: string;
  bio: string;
  profileImage?: string;
  bannerImage?: string;
  category: string;
  isVerified: boolean;
  followerCount: number;
  subscriberCount: number;
  totalEarnings: number;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    onlyfans?: string;
    custom?: Record<string, string>;
  };
  subscriptionPrices: {
    monthly: number;
    quarterly?: number;
    yearly?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  creatorId: string;
  type: ContentType;
  title: string;
  description?: string;
  visibility: ContentVisibility;
  mediaUrls: string[];
  thumbnailUrl?: string;
  price?: number;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isLocked: boolean;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    duration?: number;
    dimensions?: { width: number; height: number };
    fileSize?: number;
    aiGenerated?: boolean;
    [key: string]: unknown;
  };
}

// =============================================================================
// PAYMENT & TRANSACTION TYPES
// =============================================================================

export const paymentMethods = ['stripe_card', 'stripe_bank', 'crypto', 'wallet'] as const;
export type PaymentMethod = typeof paymentMethods[number];

export const transactionTypes = ['subscription', 'tip', 'content_purchase', 'payout'] as const;
export type TransactionType = typeof transactionTypes[number];

export const transactionStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'] as const;
export type TransactionStatus = typeof transactionStatuses[number];

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  type: TransactionType;
  method: PaymentMethod;
  status: TransactionStatus;
  clientSecret?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  creatorId?: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  method: PaymentMethod;
  stripePaymentIntentId?: string;
  description: string;
  fees: {
    platform: number;
    payment: number;
    total: number;
  };
  processedAt?: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

// =============================================================================
// API & RESPONSE TYPES
// =============================================================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  details?: unknown;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
  timestamp: string;
  requestId?: string;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  error?: string | null;
  retry?: () => void;
}

export interface AsyncComponentProps<T = unknown> extends LoadingProps {
  data?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// =============================================================================
// FORM & VALIDATION TYPES
// =============================================================================

export interface FormField<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  validators?: ((value: T) => string | null)[];
}

export interface FormState<T extends Record<string, unknown> = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// =============================================================================
// EVENT & NOTIFICATION TYPES
// =============================================================================

export const notificationTypes = ['info', 'success', 'warning', 'error'] as const;
export type NotificationType = typeof notificationTypes[number];

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'destructive';
  }>;
  createdAt: string;
}

export interface SystemEvent {
  type: string;
  data: unknown;
  timestamp: string;
  source: string;
  userId?: string;
}

// =============================================================================
// FEATURE FLAGS & CONFIGURATION
// =============================================================================

export interface FeatureFlags {
  VIP_V2: boolean;
  TIP_GOALS: boolean;
  LT_OFFERS: boolean;
  MOD_QUEUE_V2: boolean;
  AI_CONTENT_GEN: boolean;
  CRYPTO_PAYMENTS: boolean;
  ADVANCED_ANALYTICS: boolean;
  LIVE_STREAMING: boolean;
}

export interface AppConfig {
  features: FeatureFlags;
  limits: {
    maxFileSize: number;
    maxVideoDuration: number;
    maxImagesPerPost: number;
    maxBioLength: number;
  };
  payments: {
    minTipAmount: number;
    maxTipAmount: number;
    platformFee: number;
    stripeFee: number;
  };
  ai: {
    maxTokens: number;
    defaultTemperature: number;
    cacheExpiry: number;
    rateLimits: Record<string, number>;
  };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type NonEmptyArray<T> = [T, ...T[]];

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

// =============================================================================
// TYPE GUARDS
// =============================================================================

export const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'email' in obj && 
         'role' in obj;
};

export const isAPIResponse = <T = unknown>(obj: unknown): obj is APIResponse<T> => {
  return typeof obj === 'object' && 
         obj !== null && 
         'success' in obj && 
         'timestamp' in obj;
};

export const isAPIError = (obj: unknown): obj is APIError => {
  return typeof obj === 'object' && 
         obj !== null && 
         'code' in obj && 
         'message' in obj;
};

export const isValidEmail = (email: string): boolean => {
  try {
    securitySchemas.email.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const isValidPassword = (password: string): boolean => {
  try {
    securitySchemas.password.parse(password);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

export type {
  APIResponse as Response,
  PaginatedResponse as PaginatedAPIResponse,
  FormState as Form,
  BaseComponentProps as ComponentProps
};

export { securitySchemas as validators };