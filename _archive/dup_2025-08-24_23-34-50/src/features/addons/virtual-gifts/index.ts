// 🎁 VIRTUAL GIFTS - ADDON MAIN EXPORT

import { ADDON_FLAGS } from '../feature-flags';

// Main component exports (lazy-loaded)
export const VirtualGifts = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./components/VirtualGifts').then(m => ({ default: m.VirtualGifts }))
  : () => Promise.resolve({ default: () => null });

export const GiftCatalog = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./components/GiftCatalog').then(m => ({ default: m.GiftCatalog }))
  : () => Promise.resolve({ default: () => null });

export const GiftStats = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./components/GiftStats').then(m => ({ default: m.GiftStats }))
  : () => Promise.resolve({ default: () => null });

export const GiftNotifications = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./components/GiftNotifications').then(m => ({ default: m.GiftNotifications }))
  : () => Promise.resolve({ default: () => null });

// Service exports
export const VirtualGiftsService = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./services/virtual-gifts-service').then(m => ({ default: m.VirtualGiftsService }))
  : () => Promise.resolve({ default: null });

// Config exports  
export const VirtualGiftsConfig = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./config')
  : () => Promise.resolve({ default: null });

// Type exports
export const VirtualGiftsTypes = ADDON_FLAGS.VIRTUAL_GIFTS 
  ? () => import('./types')
  : () => Promise.resolve({ default: null });

// Direct exports for immediate use (when addon is enabled)
if (ADDON_FLAGS.VIRTUAL_GIFTS) {
  // Re-export types for TypeScript
  export type { 
    VirtualGift, 
    GiftTransaction, 
    GiftStats, 
    GiftSendRequest,
    GiftCatalogCategory,
    VirtualGiftsConfig as VirtualGiftsConfigType,
    GiftSentEvent,
    GiftReceivedEvent
  } from './types';

  // Re-export service class for direct use
  export { VirtualGiftsService as VirtualGiftsServiceClass } from './services/virtual-gifts-service';
  
  // Re-export config constants
  export {
    DEFAULT_VIRTUAL_GIFTS_CONFIG,
    DEFAULT_GIFT_CATALOG,
    RARITY_COLORS,
    CATEGORY_CONFIG,
    GIFT_ANIMATIONS,
    GIFT_SOUNDS,
    QUICK_AMOUNTS,
    GIFT_LIMITS
  } from './config';
}

// Addon metadata
export const VIRTUAL_GIFTS_ADDON = {
  name: 'Virtual Gifts System',
  version: '1.0.0',
  enabled: ADDON_FLAGS.VIRTUAL_GIFTS,
  description: 'Send virtual gifts to creators with real monetary value',
  category: 'revenue' as const,
  
  // Feature capabilities
  capabilities: {
    giftCatalog: true,
    realTimeNotifications: true,
    paymentProcessing: true,
    analytics: true,
    soundEffects: true,
    animations: true,
    anonymousGifts: true,
    giftMessages: true,
  },

  // Database requirements
  databaseTables: [
    'virtual_gifts',
    'gift_transactions'
  ],

  // Required permissions
  permissions: [
    'supabase:read:virtual_gifts',
    'supabase:write:gift_transactions',
    'stripe:create_payment_intent',
    'realtime:subscribe:gift-notifications'
  ],

  // Installation requirements
  requirements: {
    database: 'Run virtual-gifts migration SQL',
    payments: 'Stripe Connect integration required',
    realtime: 'Supabase realtime enabled',
    sounds: 'Audio files in /public/sounds/gifts/',
  },
};

// Helper function to check if addon is properly installed
export const isVirtualGiftsInstalled = async (): Promise<boolean> => {
  if (!ADDON_FLAGS.VIRTUAL_GIFTS) return false;
  
  try {
    // Check if required database tables exist
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { error: giftsError } = await supabase
      .from('virtual_gifts')
      .select('id')
      .limit(1);
      
    const { error: transactionsError } = await supabase
      .from('gift_transactions')
      .select('id')
      .limit(1);

    return !giftsError && !transactionsError;
  } catch (error) {
    console.warn('Virtual Gifts installation check failed:', error);
    return false;
  }
};

// Helper function to initialize the addon
export const initializeVirtualGifts = async (): Promise<boolean> => {
  if (!ADDON_FLAGS.VIRTUAL_GIFTS) {
    console.warn('Virtual Gifts addon is disabled via feature flag');
    return false;
  }

  try {
    const isInstalled = await isVirtualGiftsInstalled();
    
    if (!isInstalled) {
      console.error('Virtual Gifts addon is not properly installed. Please run the database migration.');
      return false;
    }

    console.log('✅ Virtual Gifts addon initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Virtual Gifts addon:', error);
    return false;
  }
};

// React hook for using Virtual Gifts functionality
export const useVirtualGifts = () => {
  if (!ADDON_FLAGS.VIRTUAL_GIFTS) {
    return {
      enabled: false,
      sendGift: null,
      getStats: null,
      getGifts: null,
    };
  }

  return {
    enabled: true,
    sendGift: async (request: any, senderId: string) => {
      const { VirtualGiftsService } = await import('./services/virtual-gifts-service');
      return VirtualGiftsService.sendGift(request, senderId);
    },
    getStats: async (userId: string) => {
      const { VirtualGiftsService } = await import('./services/virtual-gifts-service');
      return VirtualGiftsService.getUserGiftStats(userId);
    },
    getGifts: async () => {
      const { VirtualGiftsService } = await import('./services/virtual-gifts-service');
      return VirtualGiftsService.getAllGifts();
    },
  };
};

// Default export for dynamic imports
export default VIRTUAL_GIFTS_ADDON;