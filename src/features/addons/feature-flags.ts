// 🚀 CABANA ADD-ON FEATURE FLAGS
// Central toggle system for all modular add-ons

export const ADDON_FLAGS = {
  // 💰 IMMEDIATE REVENUE ADD-ONS
  VIRTUAL_GIFTS: true,
  PPV_MESSAGES: true,
  FLASH_SALES: true,
  CREATOR_LEADERBOARDS: true,

  // 🎪 ENGAGEMENT BOOSTERS
  STORIES_HIGHLIGHTS: true,
  LIVE_SHOWS: false,
  POLLS_VOTING: true,
  CUSTOM_REQUESTS: true,

  // 🤖 AI-POWERED FEATURES
  AI_CHATBOT: false,
  PREDICTIVE_ANALYTICS: false,
  SMART_RECOMMENDATIONS: true,
  AI_CONTENT_TAGGING: true,

  // 🛍️ MONETIZATION EXPANSION
  MERCH_STORE: false,
  CREATOR_COURSES: false,
  COLLABORATION_TOOLS: false,
  VIDEO_CALLS: false,

  // 💎 PREMIUM FEATURES
  CRYPTO_PAYMENTS: false,
  NFT_MARKETPLACE: false,
  MULTILANGUAGE: false,
  MOBILE_APPS: false,

  // 📱 SOCIAL & MARKETING
  SOCIAL_AUTOPOST: false,
  AFFILIATE_TOOLS: false,
  LOYALTY_PROGRAM: true,
  GIFT_SUBSCRIPTIONS: true,

  // 🔒 SECURITY & COMPLIANCE
  CONTENT_WATERMARKING: false,
  AGE_VERIFICATION: false,
  FRAUD_DETECTION: false,

  // 📊 ANALYTICS & BUSINESS
  ADVANCED_ANALYTICS: true,
  MARKETING_AUTOMATION: false,
  BUSINESS_TOOLS: false,

  // ⚡ CONVERSION OPTIMIZATION
  ONE_CLICK_UPSELLS: true,
  SEASONAL_THEMES: true,
  SMART_NOTIFICATIONS: true,

  // 🎨 USER EXPERIENCE
  PROFILE_CUSTOMIZATION: true,
  CHAT_IMPROVEMENTS: true
} as const;

export type AddonFlag = keyof typeof ADDON_FLAGS;

// Helper functions
export const isAddonEnabled = (flag: AddonFlag): boolean => {
  return ADDON_FLAGS[flag];
};

export const getEnabledAddons = (): AddonFlag[] => {
  return (Object.keys(ADDON_FLAGS) as AddonFlag[]).filter(
    flag => ADDON_FLAGS[flag]
  );
};

export const getDisabledAddons = (): AddonFlag[] => {
  return (Object.keys(ADDON_FLAGS) as AddonFlag[]).filter(
    flag => !ADDON_FLAGS[flag]
  );
};