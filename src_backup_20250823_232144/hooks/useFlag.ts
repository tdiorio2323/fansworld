/**
 * React Hook for Feature Flags
 * Provides reactive access to feature flags throughout the application
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FeatureFlagConfig, 
  isFeatureEnabled, 
  areAllFeaturesEnabled, 
  isAnyFeatureEnabled,
  getEnabledFeatures,
  overrideFlags,
  FEATURE_FLAGS
} from '@/lib/flags';

/**
 * Hook for accessing a single feature flag
 */
export function useFlag(flag: keyof FeatureFlagConfig) {
  const [isEnabled, setIsEnabled] = useState(() => isFeatureEnabled(flag));
  
  useEffect(() => {
    // Update flag value if it changes (useful for hot reloading in dev)
    setIsEnabled(isFeatureEnabled(flag));
  }, [flag]);
  
  return {
    isEnabled,
    flag,
    flagValue: FEATURE_FLAGS[flag]
  };
}

/**
 * Hook for accessing multiple feature flags
 */
export function useFlags<T extends keyof FeatureFlagConfig>(flags: T[]) {
  const [flagStates, setFlagStates] = useState(() => 
    flags.reduce((acc, flag) => {
      acc[flag] = isFeatureEnabled(flag);
      return acc;
    }, {} as Record<T, boolean>)
  );
  
  useEffect(() => {
    const newStates = flags.reduce((acc, flag) => {
      acc[flag] = isFeatureEnabled(flag);
      return acc;
    }, {} as Record<T, boolean>);
    
    setFlagStates(newStates);
  }, [flags]);
  
  return {
    flags: flagStates,
    allEnabled: areAllFeaturesEnabled(flags),
    anyEnabled: isAnyFeatureEnabled(flags),
    enabledCount: Object.values(flagStates).filter(Boolean).length
  };
}

/**
 * Hook for VIP v2 feature flags
 */
export function useVipV2Flags() {
  return useFlags(['VIP_V2_ENABLED', 'VIP_V2_ADMIN_PANEL', 'VIP_V2_ANALYTICS'] as const);
}

/**
 * Hook for Tip Goals feature flags
 */
export function useTipGoalsFlags() {
  return useFlags(['TIP_GOALS_ENABLED', 'TIP_GOALS_ANIMATIONS', 'TIP_GOALS_NOTIFICATIONS'] as const);
}

/**
 * Hook for Offer Ribbon feature flags
 */
export function useOfferRibbonFlags() {
  return useFlags(['OFFER_RIBBON_ENABLED', 'OFFER_RIBBON_ANIMATIONS', 'OFFER_RIBBON_SOUND'] as const);
}

/**
 * Hook for Moderation v2 feature flags
 */
export function useModerationV2Flags() {
  return useFlags(['MODERATION_V2_ENABLED', 'MODERATION_V2_AUTO_RULES', 'MODERATION_V2_AI_ASSIST'] as const);
}

/**
 * Hook for all nextgen overlay features
 */
export function useNextgenOverlayFlags() {
  const [allFlags, setAllFlags] = useState(() => getEnabledFeatures());
  
  useEffect(() => {
    setAllFlags(getEnabledFeatures());
  }, []);
  
  return {
    enabledFeatures: allFlags,
    isOverlayEnabled: isFeatureEnabled('NEXTGEN_OVERLAY_ENABLED'),
    enabledCount: Object.keys(allFlags).length
  };
}

/**
 * Development hook for overriding flags
 * Only works in development mode
 */
export function useFlagOverrides() {
  const [overrides, setOverrides] = useState<Partial<FeatureFlagConfig>>({});
  
  const override = useCallback((newOverrides: Partial<FeatureFlagConfig>) => {
    overrideFlags(newOverrides);
    setOverrides(prev => ({ ...prev, ...newOverrides }));
  }, []);
  
  const resetOverrides = useCallback(() => {
    // Reset to environment values
    if (import.meta.env?.DEV || process.env.NODE_ENV === 'development') {
      window.location.reload();
    }
  }, []);
  
  return {
    override,
    resetOverrides,
    currentOverrides: overrides,
    isDev: import.meta.env?.DEV || process.env.NODE_ENV === 'development'
  };
}

/**
 * Hook for conditionally rendering components based on feature flags
 */
export function useFeatureGate(flag: keyof FeatureFlagConfig) {
  const { isEnabled } = useFlag(flag);
  
  const FeatureGate = useCallback(({ 
    children, 
    fallback = null 
  }: { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
  }): React.ReactElement => {
    return isEnabled ? React.createElement(React.Fragment, null, children) : React.createElement(React.Fragment, null, fallback);
  }, [isEnabled]);
  
  return {
    isEnabled,
    FeatureGate
  };
}

/**
 * Hook for feature flag analytics (if enabled)
 */
export function useFlagAnalytics() {
  const { isEnabled: analyticsEnabled } = useFlag('FEATURE_ANALYTICS');
  
  const trackFlagUsage = useCallback((flag: keyof FeatureFlagConfig, action: string) => {
    if (!analyticsEnabled) return;
    
    // Track flag usage for optimization
    console.log(`🚩 Flag Analytics: ${flag} - ${action}`);
    
    // TODO: Integrate with actual analytics service
    // analytics.track('feature_flag_usage', {
    //   flag,
    //   action,
    //   timestamp: Date.now()
    // });
  }, [analyticsEnabled]);
  
  return {
    trackFlagUsage,
    analyticsEnabled
  };
}