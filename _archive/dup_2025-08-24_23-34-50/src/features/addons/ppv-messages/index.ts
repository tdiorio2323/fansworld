// 🔒 PPV MESSAGES - ADDON MAIN EXPORT

import { ADDON_FLAGS } from '../feature-flags';

// Main component exports (lazy-loaded)
export const PPVMessages = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./components/PPVMessages').then(m => ({ default: m.PPVMessages }))
  : () => Promise.resolve({ default: () => null });

export const PPVMessageComposer = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./components/PPVMessageComposer').then(m => ({ default: m.PPVMessageComposer }))
  : () => Promise.resolve({ default: () => null });

export const PPVMessageViewer = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./components/PPVMessageViewer').then(m => ({ default: m.PPVMessageViewer }))
  : () => Promise.resolve({ default: () => null });

export const PPVAnalytics = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./components/PPVAnalytics').then(m => ({ default: m.PPVAnalytics }))
  : () => Promise.resolve({ default: () => null });

// Service exports
export const PPVMessagesService = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./services/ppv-messages-service').then(m => ({ default: m.PPVMessagesService }))
  : () => Promise.resolve({ default: null });

// Config exports  
export const PPVMessagesConfig = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./config')
  : () => Promise.resolve({ default: null });

// Type exports
export const PPVMessagesTypes = ADDON_FLAGS.PPV_MESSAGES 
  ? () => import('./types')
  : () => Promise.resolve({ default: null });

// Direct exports for immediate use (when addon is enabled)
if (ADDON_FLAGS.PPV_MESSAGES) {
  // Re-export types for TypeScript
  export type { 
    PPVMessage,
    PPVPurchase,
    PPVMessageStats,
    PPVCreateRequest,
    PPVUpdateRequest,
    PPVPurchaseRequest,
    PPVMessageFilter,
    PPVAnalytics,
    PPVPromoCode,
    PPVNotification,
    PPVMessageContent,
    PPVConfig as PPVConfigType,
    PPVRevenueShare,
    PPVWallet,
    PPVWalletTransaction
  } from './types';

  // Re-export service class for direct use
  export { PPVMessagesService as PPVMessagesServiceClass } from './services/ppv-messages-service';
  
  // Re-export config constants
  export {
    DEFAULT_PPV_CONFIG,
    PPV_PRICING_TIERS,
    CONTENT_TYPE_CONFIG,
    PPV_REVENUE_SHARE,
    PPV_SUBSCRIPTION_DISCOUNTS,
    PPV_POPULAR_TAGS,
    PPV_QUICK_ACTIONS,
    PPV_STATUS_CONFIG,
    ANALYTICS_PERIODS,
    MODERATION_CATEGORIES,
    PAYMENT_METHODS,
    UPLOAD_CONFIG,
    PROMO_CODE_TEMPLATES,
    NOTIFICATION_TEMPLATES,
    formatPrice,
    calculateCreatorEarnings,
    calculatePlatformFee,
    getFileTypeFromMime,
    isFileTypeSupported,
    getMaxFileSizeForType,
    formatFileSize
  } from './config';
}

// Addon metadata
export const PPV_MESSAGES_ADDON = {
  name: 'Pay-Per-View Messages',
  version: '1.0.0',
  enabled: ADDON_FLAGS.PPV_MESSAGES,
  description: 'Send premium messages that require payment to view',
  category: 'revenue' as const,
  
  // Feature capabilities
  capabilities: {
    premiumContent: true,
    paymentGating: true,
    contentComposer: true,
    mediaUpload: true,
    analytics: true,
    promoCode: true,
    multiplePaymentMethods: true,
    contentExpiration: true,
    viewLimits: true,
    contentPreview: true,
    creatorEarnings: true,
    platformCommission: true,
  },

  // Database requirements
  databaseTables: [
    'ppv_messages',
    'ppv_message_content',
    'ppv_purchases',
    'ppv_message_tags',
    'ppv_promo_codes',
    'ppv_notifications'
  ],

  // Required permissions
  permissions: [
    'supabase:read:ppv_messages',
    'supabase:write:ppv_messages',
    'supabase:read:ppv_purchases',
    'supabase:write:ppv_purchases',
    'stripe:create_payment_intent',
    'storage:upload_files',
    'realtime:subscribe:ppv-notifications'
  ],

  // Installation requirements
  requirements: {
    database: 'Run PPV messages migration SQL',
    payments: 'Stripe Connect integration required',
    storage: 'File upload storage configured',
    realtime: 'Supabase realtime for notifications',
    mediaProcessing: 'Video/audio processing capabilities',
  },

  // Configuration options
  configOptions: {
    minPrice: 'Minimum message price (cents)',
    maxPrice: 'Maximum message price (cents)', 
    platformCommission: 'Platform commission rate (0-1)',
    maxFileSize: 'Maximum file upload size (bytes)',
    supportedFileTypes: 'Allowed file MIME types',
    allowExpiration: 'Enable message expiration',
    allowViewLimits: 'Enable view count limits',
    watermarkEnabled: 'Add watermarks to content',
  },
};

// Helper function to check if addon is properly installed
export const isPPVMessagesInstalled = async (): Promise<boolean> => {
  if (!ADDON_FLAGS.PPV_MESSAGES) return false;
  
  try {
    // Check if required database tables exist
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error: messagesError } = await supabase
      .from('ppv_messages')
      .select('id')
      .limit(1);
      
    const { error: purchasesError } = await supabase
      .from('ppv_purchases')
      .select('id')
      .limit(1);

    const { error: contentError } = await supabase
      .from('ppv_message_content')
      .select('id')
      .limit(1);

    return !messagesError && !purchasesError && !contentError;
  } catch (error) {
    console.warn('PPV Messages installation check failed:', error);
    return false;
  }
};

// Helper function to initialize the addon
export const initializePPVMessages = async (): Promise<boolean> => {
  if (!ADDON_FLAGS.PPV_MESSAGES) {
    console.warn('PPV Messages addon is disabled via feature flag');
    return false;
  }

  try {
    const isInstalled = await isPPVMessagesInstalled();
    
    if (!isInstalled) {
      console.error('PPV Messages addon is not properly installed. Please run the database migration.');
      return false;
    }

    console.log('✅ PPV Messages addon initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize PPV Messages addon:', error);
    return false;
  }
};

// React hook for using PPV Messages functionality
export const usePPVMessages = () => {
  if (!ADDON_FLAGS.PPV_MESSAGES) {
    return {
      enabled: false,
      createMessage: null,
      purchaseMessage: null,
      getMessages: null,
      getStats: null,
    };
  }

  return {
    enabled: true,
    createMessage: async (request: any, creatorId: string) => {
      const { PPVMessagesService } = await import('./services/ppv-messages-service');
      return PPVMessagesService.createMessage(request, creatorId);
    },
    purchaseMessage: async (request: any, buyerId: string) => {
      const { PPVMessagesService } = await import('./services/ppv-messages-service');
      return PPVMessagesService.purchaseMessage(request, buyerId);
    },
    getMessages: async (filter?: any) => {
      const { PPVMessagesService } = await import('./services/ppv-messages-service');
      return PPVMessagesService.getMessages(filter);
    },
    getStats: async (creatorId: string) => {
      const { PPVMessagesService } = await import('./services/ppv-messages-service');
      return PPVMessagesService.getCreatorStats(creatorId);
    },
    getUserPurchases: async (buyerId: string) => {
      const { PPVMessagesService } = await import('./services/ppv-messages-service');
      return PPVMessagesService.getUserPurchases(buyerId);
    },
  };
};

// Utility functions for external use
export const PPVUtils = {
  // Price formatting
  formatPrice: (cents: number) => `$${(cents / 100).toFixed(2)}`,
  
  // Creator earnings calculation
  calculateCreatorEarnings: (priceInCents: number, commissionRate = 0.2) => {
    return Math.floor(priceInCents * (1 - commissionRate));
  },
  
  // Platform commission calculation
  calculatePlatformCommission: (priceInCents: number, commissionRate = 0.2) => {
    return Math.floor(priceInCents * commissionRate);
  },
  
  // Content type detection
  getContentType: (mimeType: string) => {
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'file';
  },
  
  // File size formatting
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Validation helpers
  isValidPrice: (cents: number) => cents >= 99 && cents <= 99999,
  isValidTitle: (title: string) => title.trim().length > 0 && title.length <= 200,
  isValidDescription: (desc: string) => desc.length <= 500,
  
  // Status helpers
  isMessageExpired: (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  },
  
  isViewLimitReached: (currentViews: number, maxViews?: number) => {
    if (!maxViews) return false;
    return currentViews >= maxViews;
  },
};

// Default export for dynamic imports
export default PPV_MESSAGES_ADDON;