/**
 * Feature Flags System for FansWorld Creator Platform
 * Nextgen Overlay Features
 * 
 * All features are disabled by default for safe rollout
 * Enable features gradually through environment variables
 */

export interface FeatureFlagConfig {
  // VIP v2 System - Code redemption with analytics
  VIP_V2_ENABLED: boolean;
  VIP_V2_ADMIN_PANEL: boolean;
  VIP_V2_ANALYTICS: boolean;
  
  // Tip Goals System - Progress tracking and celebrations
  TIP_GOALS_ENABLED: boolean;
  TIP_GOALS_ANIMATIONS: boolean;
  TIP_GOALS_NOTIFICATIONS: boolean;
  
  // Offer Ribbon System - Limited time offers
  OFFER_RIBBON_ENABLED: boolean;
  OFFER_RIBBON_ANIMATIONS: boolean;
  OFFER_RIBBON_SOUND: boolean;
  
  // Moderation v2 Queue System
  MODERATION_V2_ENABLED: boolean;
  MODERATION_V2_AUTO_RULES: boolean;
  MODERATION_V2_AI_ASSIST: boolean;
  
  // System-wide toggles
  NEXTGEN_OVERLAY_ENABLED: boolean;
  FEATURE_ANALYTICS: boolean;
}

/**
 * Default feature flag configuration
 * All features disabled by default for safe production rollout
 */
const DEFAULT_FLAGS: FeatureFlagConfig = {
  // VIP v2 System
  VIP_V2_ENABLED: false,
  VIP_V2_ADMIN_PANEL: false,
  VIP_V2_ANALYTICS: false,
  
  // Tip Goals System
  TIP_GOALS_ENABLED: false,
  TIP_GOALS_ANIMATIONS: false,
  TIP_GOALS_NOTIFICATIONS: false,
  
  // Offer Ribbon System
  OFFER_RIBBON_ENABLED: false,
  OFFER_RIBBON_ANIMATIONS: false,
  OFFER_RIBBON_SOUND: false,
  
  // Moderation v2 System
  MODERATION_V2_ENABLED: false,
  MODERATION_V2_AUTO_RULES: false,
  MODERATION_V2_AI_ASSIST: false,
  
  // System-wide
  NEXTGEN_OVERLAY_ENABLED: false,
  FEATURE_ANALYTICS: false,
};

/**
 * Get feature flag value with environment variable override
 */
function getEnvFlag(key: keyof FeatureFlagConfig, defaultValue: boolean): boolean {
  const envValue = import.meta.env?.[`VITE_${key}`] || process.env?.[key];
  
  if (typeof envValue === 'string') {
    return envValue.toLowerCase() === 'true';
  }
  
  return defaultValue;
}

/**
 * Runtime feature flag configuration
 * Merges defaults with environment variables
 */
export const FEATURE_FLAGS: FeatureFlagConfig = {
  // VIP v2 System
  VIP_V2_ENABLED: getEnvFlag('VIP_V2_ENABLED', DEFAULT_FLAGS.VIP_V2_ENABLED),
  VIP_V2_ADMIN_PANEL: getEnvFlag('VIP_V2_ADMIN_PANEL', DEFAULT_FLAGS.VIP_V2_ADMIN_PANEL),
  VIP_V2_ANALYTICS: getEnvFlag('VIP_V2_ANALYTICS', DEFAULT_FLAGS.VIP_V2_ANALYTICS),
  
  // Tip Goals System
  TIP_GOALS_ENABLED: getEnvFlag('TIP_GOALS_ENABLED', DEFAULT_FLAGS.TIP_GOALS_ENABLED),
  TIP_GOALS_ANIMATIONS: getEnvFlag('TIP_GOALS_ANIMATIONS', DEFAULT_FLAGS.TIP_GOALS_ANIMATIONS),
  TIP_GOALS_NOTIFICATIONS: getEnvFlag('TIP_GOALS_NOTIFICATIONS', DEFAULT_FLAGS.TIP_GOALS_NOTIFICATIONS),
  
  // Offer Ribbon System
  OFFER_RIBBON_ENABLED: getEnvFlag('OFFER_RIBBON_ENABLED', DEFAULT_FLAGS.OFFER_RIBBON_ENABLED),
  OFFER_RIBBON_ANIMATIONS: getEnvFlag('OFFER_RIBBON_ANIMATIONS', DEFAULT_FLAGS.OFFER_RIBBON_ANIMATIONS),
  OFFER_RIBBON_SOUND: getEnvFlag('OFFER_RIBBON_SOUND', DEFAULT_FLAGS.OFFER_RIBBON_SOUND),
  
  // Moderation v2 System
  MODERATION_V2_ENABLED: getEnvFlag('MODERATION_V2_ENABLED', DEFAULT_FLAGS.MODERATION_V2_ENABLED),
  MODERATION_V2_AUTO_RULES: getEnvFlag('MODERATION_V2_AUTO_RULES', DEFAULT_FLAGS.MODERATION_V2_AUTO_RULES),
  MODERATION_V2_AI_ASSIST: getEnvFlag('MODERATION_V2_AI_ASSIST', DEFAULT_FLAGS.MODERATION_V2_AI_ASSIST),
  
  // System-wide
  NEXTGEN_OVERLAY_ENABLED: getEnvFlag('NEXTGEN_OVERLAY_ENABLED', DEFAULT_FLAGS.NEXTGEN_OVERLAY_ENABLED),
  FEATURE_ANALYTICS: getEnvFlag('FEATURE_ANALYTICS', DEFAULT_FLAGS.FEATURE_ANALYTICS),
};

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: keyof FeatureFlagConfig): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Check if multiple features are all enabled
 */
export function areAllFeaturesEnabled(flags: (keyof FeatureFlagConfig)[]): boolean {
  return flags.every(flag => FEATURE_FLAGS[flag]);
}

/**
 * Check if any of the features are enabled
 */
export function isAnyFeatureEnabled(flags: (keyof FeatureFlagConfig)[]): boolean {
  return flags.some(flag => FEATURE_FLAGS[flag]);
}

/**
 * Get all enabled feature flags
 */
export function getEnabledFeatures(): Partial<FeatureFlagConfig> {
  const enabled: Partial<FeatureFlagConfig> = {};
  
  Object.entries(FEATURE_FLAGS).forEach(([key, value]) => {
    if (value) {
      enabled[key as keyof FeatureFlagConfig] = value;
    }
  });
  
  return enabled;
}

/**
 * Development helper - override flags for testing
 * Only works in development mode
 */
export function overrideFlags(overrides: Partial<FeatureFlagConfig>): void {
  if (import.meta.env?.DEV || process.env.NODE_ENV === 'development') {
    Object.assign(FEATURE_FLAGS, overrides);
    console.log('🚩 Feature flags overridden for development:', overrides);
  } else {
    console.warn('Feature flag overrides only work in development mode');
  }
}

// Export flag groups for convenience
export const VIP_V2_FLAGS = [
  'VIP_V2_ENABLED',
  'VIP_V2_ADMIN_PANEL', 
  'VIP_V2_ANALYTICS'
] as const;

export const TIP_GOALS_FLAGS = [
  'TIP_GOALS_ENABLED',
  'TIP_GOALS_ANIMATIONS',
  'TIP_GOALS_NOTIFICATIONS'
] as const;

export const OFFER_RIBBON_FLAGS = [
  'OFFER_RIBBON_ENABLED',
  'OFFER_RIBBON_ANIMATIONS', 
  'OFFER_RIBBON_SOUND'
] as const;

export const MODERATION_V2_FLAGS = [
  'MODERATION_V2_ENABLED',
  'MODERATION_V2_AUTO_RULES',
  'MODERATION_V2_AI_ASSIST'
] as const;