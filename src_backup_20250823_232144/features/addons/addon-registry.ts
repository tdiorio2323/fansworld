// 🎯 ADDON REGISTRY - Central Management System
import { ADDON_FLAGS, type AddonFlag } from './feature-flags';

export interface AddonConfig {
  name: string;
  flag: AddonFlag;
  version: string;
  description: string;
  category: 'revenue' | 'engagement' | 'ai' | 'monetization' | 'premium' | 'social' | 'security' | 'analytics' | 'conversion' | 'ux';
  dependencies: string[];
  component: () => Promise<any>;
  config?: () => Promise<any>;
  services?: () => Promise<any>;
  types?: () => Promise<any>;
}

export const ADDON_REGISTRY: Record<string, AddonConfig> = {
  'virtual-gifts': {
    name: 'Virtual Gifts System',
    flag: 'VIRTUAL_GIFTS',
    version: '1.0.0',
    description: 'Send virtual gifts to creators with real monetary value',
    category: 'revenue',
    dependencies: [],
    component: () => import('./virtual-gifts/components/VirtualGifts'),
    config: () => import('./virtual-gifts/config'),
    services: () => import('./virtual-gifts/services/virtual-gifts-service'),
    types: () => import('./virtual-gifts/types'),
  },
  'ppv-messages': {
    name: 'Pay-Per-View Messages',
    flag: 'PPV_MESSAGES',
    version: '1.0.0',
    description: 'Send premium messages that require payment to view',
    category: 'revenue',
    dependencies: [],
    component: () => import('./ppv-messages/components/PPVMessages'),
    config: () => import('./ppv-messages/config'),
    services: () => import('./ppv-messages/services/ppv-messages-service'),
    types: () => import('./ppv-messages/types'),
  },
  'flash-sales': {
    name: 'Flash Sales System',
    flag: 'FLASH_SALES',
    version: '1.0.0',
    description: 'Time-limited promotional sales with countdown timers and urgency features',
    category: 'conversion',
    dependencies: [],
    component: () => import('./flash-sales/components/FlashSales'),
    config: () => import('./flash-sales/config'),
    services: () => import('./flash-sales/services/flash-sales-service'),
    types: () => import('./flash-sales/types'),
  },
  'stories-highlights': {
    name: 'Stories & Highlights',
    flag: 'STORIES_HIGHLIGHTS',
    version: '1.0.0',
    description: 'Instagram-style stories with highlights, polls, and interactive features',
    category: 'engagement',
    dependencies: [],
    component: () => import('./stories-highlights/components/Stories'),
    config: () => import('./stories-highlights/config'),
    services: () => import('./stories-highlights/services/stories-service'),
    types: () => import('./stories-highlights/types'),
  },
  'polls-voting': {
    name: 'Polls & Fan Voting',
    flag: 'POLLS_VOTING',
    version: '1.0.0',
    description: 'Interactive polls and fan voting campaigns with premium options',
    category: 'engagement',
    dependencies: [],
    component: () => import('./polls-voting/components/Polls'),
    config: () => import('./polls-voting/config'),
    services: () => import('./polls-voting/services/polls-service'),
    types: () => import('./polls-voting/types'),
  },
  'custom-requests': {
    name: 'Custom Content Requests',
    flag: 'CUSTOM_REQUESTS',
    version: '1.0.0',
    description: 'Custom content requests system with escrow payments and templates',
    category: 'monetization',
    dependencies: [],
    component: () => import('./custom-requests/components/CustomRequests'),
    config: () => import('./custom-requests/config'),
    services: () => import('./custom-requests/services/requests-service'),
    types: () => import('./custom-requests/types'),
  },
  'ai-content-tagging': {
    name: 'AI Content Tagging',
    flag: 'AI_CONTENT_TAGGING',
    version: '1.0.0',
    description: 'Automated content analysis and tagging with AI-powered insights',
    category: 'ai',
    dependencies: [],
    component: () => import('./ai-content-tagging/components/AITagging'),
    config: () => import('./ai-content-tagging/config'),
    services: () => import('./ai-content-tagging/services/ai-tagging-service'),
    types: () => import('./ai-content-tagging/types'),
  },
  'one-click-upsells': {
    name: 'One-Click Upsells',
    flag: 'ONE_CLICK_UPSELLS',
    version: '1.0.0',
    description: 'Smart upselling system with A/B testing and behavioral targeting',
    category: 'conversion',
    dependencies: [],
    component: () => import('./one-click-upsells/components/Upsells'),
    config: () => import('./one-click-upsells/config'),
    services: () => import('./one-click-upsells/services/upsells-service'),
    types: () => import('./one-click-upsells/types'),
  },
  'loyalty-program': {
    name: 'Loyalty Program',
    flag: 'LOYALTY_PROGRAM',
    version: '1.0.0',
    description: 'Points-based loyalty system with tiers, rewards, and gamification',
    category: 'monetization',
    dependencies: [],
    component: () => import('./loyalty-program/components/LoyaltyProgram'),
    config: () => import('./loyalty-program/config'),
    services: () => import('./loyalty-program/services/loyalty-service'),
    types: () => import('./loyalty-program/types'),
  },
  'creator-leaderboards': {
    name: 'Creator Leaderboards',
    flag: 'CREATOR_LEADERBOARDS',
    version: '1.0.0',
    description: 'Competitive rankings and achievements for creators',
    category: 'engagement',
    dependencies: [],
    component: () => import('./creator-leaderboards/components/CreatorLeaderboards'),
  },
  // More addons will be registered here...
};

export class AddonManager {
  static getAddon(addonKey: string): AddonConfig | null {
    const addon = ADDON_REGISTRY[addonKey];
    if (!addon) return null;
    
    // Check if addon is enabled
    if (!ADDON_FLAGS[addon.flag]) return null;
    
    return addon;
  }

  static getEnabledAddons(): AddonConfig[] {
    return Object.values(ADDON_REGISTRY).filter(
      addon => ADDON_FLAGS[addon.flag]
    );
  }

  static getAddonsByCategory(category: AddonConfig['category']): AddonConfig[] {
    return Object.values(ADDON_REGISTRY).filter(
      addon => addon.category === category && ADDON_FLAGS[addon.flag]
    );
  }

  static async loadAddon(addonKey: string) {
    const addon = this.getAddon(addonKey);
    if (!addon) throw new Error(`Addon '${addonKey}' not found or disabled`);

    const [component, config, services, types] = await Promise.all([
      addon.component(),
      addon.config?.() || Promise.resolve(null),
      addon.services?.() || Promise.resolve(null),
      addon.types?.() || Promise.resolve(null),
    ]);

    return {
      ...addon,
      component: component.default || component,
      config: config?.default || config,
      services: services?.default || services,
      types: types?.default || types,
    };
  }

  static validateDependencies(addonKey: string): boolean {
    const addon = ADDON_REGISTRY[addonKey];
    if (!addon) return false;

    // Check if all dependencies are enabled
    return addon.dependencies.every(dep => {
      const depAddon = Object.values(ADDON_REGISTRY).find(a => a.name === dep);
      return depAddon && ADDON_FLAGS[depAddon.flag];
    });
  }
}