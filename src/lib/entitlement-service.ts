import { createClient } from '@supabase/supabase-js';
import { logger } from './security-enhanced';
import { UserRole, AuthenticatedUser } from './auth-middleware';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Entitlement types
export enum EntitlementType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME_PURCHASE = 'one_time_purchase',
  PPV_MESSAGE = 'ppv_message',
  TIP_ACCESS = 'tip_access',
  FREE_ACCESS = 'free_access'
}

// Content access levels
export enum AccessLevel {
  PUBLIC = 'public',
  SUBSCRIBERS_ONLY = 'subscribers_only',
  PREMIUM_SUBSCRIBERS = 'premium_subscribers',
  PPV_LOCKED = 'ppv_locked',
  CUSTOM_PRICE = 'custom_price'
}

// Entitlement result interface
export interface EntitlementResult {
  hasAccess: boolean;
  reason: string;
  entitlementType?: EntitlementType;
  price?: number;
  currency?: string;
  subscriptionRequired?: boolean;
  upgradeRequired?: boolean;
}

// Subscription status enum
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  TRIALING = 'trialing'
}

// User subscription interface
export interface UserSubscription {
  id: string;
  userId: string;
  creatorId: string;
  status: SubscriptionStatus;
  tier: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  priceId?: string;
  amount?: number;
}

// Content access metadata
export interface ContentAccess {
  contentId: string;
  contentType: 'post' | 'message' | 'media';
  creatorId: string;
  accessLevel: AccessLevel;
  price?: number;
  subscriptionTierRequired?: string;
}

/**
 * Entitlement Service - Manages content access control and payment verification
 * This is the core service that determines if a user can access specific content
 */
export class EntitlementService {
  /**
   * Check if user has access to specific content
   */
  static async hasContentAccess(
    user: AuthenticatedUser | undefined,
    contentId: string,
    contentType: 'post' | 'message' | 'media' = 'post'
  ): Promise<EntitlementResult> {
    try {
      // Get content access metadata
      const contentAccess = await this.getContentAccessMetadata(contentId, contentType);

      if (!contentAccess) {
        return {
          hasAccess: false,
          reason: 'Content not found or access metadata missing'
        };
      }

      // Public content is always accessible
      if (contentAccess.accessLevel === AccessLevel.PUBLIC) {
        return {
          hasAccess: true,
          reason: 'Public content',
          entitlementType: EntitlementType.FREE_ACCESS
        };
      }

      // Authentication required for non-public content
      if (!user) {
        return {
          hasAccess: false,
          reason: 'Authentication required',
          subscriptionRequired: contentAccess.accessLevel === AccessLevel.SUBSCRIBERS_ONLY
        };
      }

      // Creator always has access to their own content
      if (user.id === contentAccess.creatorId) {
        return {
          hasAccess: true,
          reason: 'Content owner',
          entitlementType: EntitlementType.FREE_ACCESS
        };
      }

      // Admins and moderators have access to all content
      if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
        return {
          hasAccess: true,
          reason: 'Administrative access',
          entitlementType: EntitlementType.FREE_ACCESS
        };
      }

      // Check specific access levels
      switch (contentAccess.accessLevel) {
        case AccessLevel.SUBSCRIBERS_ONLY:
          return await this.checkSubscriptionAccess(user.id, contentAccess.creatorId);

        case AccessLevel.PREMIUM_SUBSCRIBERS:
          return await this.checkPremiumSubscriptionAccess(
            user.id,
            contentAccess.creatorId,
            contentAccess.subscriptionTierRequired
          );

        case AccessLevel.PPV_LOCKED:
        case AccessLevel.CUSTOM_PRICE:
          return await this.checkPPVAccess(user.id, contentId, contentAccess.price);

        default:
          return {
            hasAccess: false,
            reason: 'Unknown access level'
          };
      }

    } catch (error) {
      logger.error('Entitlement check error', {
        userId: user?.id,
        contentId,
        contentType,
        error
      });

      return {
        hasAccess: false,
        reason: 'Entitlement check failed'
      };
    }
  }

  /**
   * Check if user has active subscription to creator
   */
  static async checkSubscriptionAccess(
    userId: string,
    creatorId: string
  ): Promise<EntitlementResult> {
    try {
      // TODO: Implement with actual subscription table when payments are integrated
      const subscription = await this.getUserSubscription(userId, creatorId);

      if (!subscription) {
        return {
          hasAccess: false,
          reason: 'No active subscription',
          subscriptionRequired: true
        };
      }

      if (subscription.status !== SubscriptionStatus.ACTIVE &&
          subscription.status !== SubscriptionStatus.TRIALING) {
        return {
          hasAccess: false,
          reason: `Subscription status: ${subscription.status}`,
          subscriptionRequired: true
        };
      }

      // Check if subscription is expired
      if (subscription.currentPeriodEnd < new Date()) {
        return {
          hasAccess: false,
          reason: 'Subscription expired',
          subscriptionRequired: true
        };
      }

      return {
        hasAccess: true,
        reason: 'Active subscription',
        entitlementType: EntitlementType.SUBSCRIPTION
      };

    } catch (error) {
      logger.error('Subscription check error', { userId, creatorId, error });
      return {
        hasAccess: false,
        reason: 'Subscription check failed'
      };
    }
  }

  /**
   * Check if user has premium subscription access
   */
  static async checkPremiumSubscriptionAccess(
    userId: string,
    creatorId: string,
    requiredTier?: string
  ): Promise<EntitlementResult> {
    try {
      const subscription = await this.getUserSubscription(userId, creatorId);

      if (!subscription) {
        return {
          hasAccess: false,
          reason: 'Premium subscription required',
          subscriptionRequired: true,
          upgradeRequired: false
        };
      }

      if (subscription.status !== SubscriptionStatus.ACTIVE &&
          subscription.status !== SubscriptionStatus.TRIALING) {
        return {
          hasAccess: false,
          reason: 'Active subscription required',
          subscriptionRequired: true
        };
      }

      // Check tier if specified
      if (requiredTier && subscription.tier !== requiredTier) {
        return {
          hasAccess: false,
          reason: `${requiredTier} tier required`,
          subscriptionRequired: false,
          upgradeRequired: true
        };
      }

      return {
        hasAccess: true,
        reason: 'Premium subscription active',
        entitlementType: EntitlementType.SUBSCRIPTION
      };

    } catch (error) {
      logger.error('Premium subscription check error', {
        userId,
        creatorId,
        requiredTier,
        error
      });

      return {
        hasAccess: false,
        reason: 'Premium subscription check failed'
      };
    }
  }

  /**
   * Check if user has purchased PPV content
   */
  static async checkPPVAccess(
    userId: string,
    contentId: string,
    price?: number
  ): Promise<EntitlementResult> {
    try {
      // TODO: Implement with actual PPV purchases table when payments are integrated
      const hasPurchased = await this.hasPPVPurchase(userId, contentId);

      if (hasPurchased) {
        return {
          hasAccess: true,
          reason: 'PPV content purchased',
          entitlementType: EntitlementType.ONE_TIME_PURCHASE
        };
      }

      return {
        hasAccess: false,
        reason: 'Payment required',
        price: price || 0,
        currency: 'USD',
        entitlementType: EntitlementType.PPV_MESSAGE
      };

    } catch (error) {
      logger.error('PPV access check error', { userId, contentId, error });
      return {
        hasAccess: false,
        reason: 'PPV access check failed'
      };
    }
  }

  /**
   * Get user's subscription to a creator (STUB - implement when payments are ready)
   */
  private static async getUserSubscription(
    userId: string,
    creatorId: string
  ): Promise<UserSubscription | null> {
    try {
      // STUB: Return null for now - implement when subscription table is created
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        logger.debug('Subscription query failed (expected during development)', {
          userId,
          creatorId,
          error: error.message
        });
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        creatorId: data.creator_id,
        status: data.status,
        tier: data.tier || 'basic',
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        priceId: data.price_id,
        amount: data.amount
      };

    } catch (error) {
      logger.debug('Subscription check error (expected during development)', {
        userId,
        creatorId,
        error
      });
      return null;
    }
  }

  /**
   * Check if user has purchased PPV content (STUB - implement when payments are ready)
   */
  private static async hasPPVPurchase(
    userId: string,
    contentId: string
  ): Promise<boolean> {
    try {
      // STUB: Return false for now - implement when PPV purchases table is created
      const { data, error } = await supabase
        .from('ppv_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) {
        logger.debug('PPV purchase query failed (expected during development)', {
          userId,
          contentId,
          error: error.message
        });
        return false;
      }

      return !!data;

    } catch (error) {
      logger.debug('PPV purchase check error (expected during development)', {
        userId,
        contentId,
        error
      });
      return false;
    }
  }

  /**
   * Get content access metadata (STUB - implement when content tables are ready)
   */
  private static async getContentAccessMetadata(
    contentId: string,
    contentType: 'post' | 'message' | 'media'
  ): Promise<ContentAccess | null> {
    try {
      let tableName: string;
      switch (contentType) {
        case 'post':
          tableName = 'posts';
          break;
        case 'message':
          tableName = 'messages';
          break;
        case 'media':
          tableName = 'media';
          break;
        default:
          return null;
      }

      // STUB: Return default metadata for development
      // In production, this would query the actual content table
      const { data, error } = await supabase
        .from(tableName)
        .select('id, creator_id, access_level, price, subscription_tier_required')
        .eq('id', contentId)
        .maybeSingle();

      if (error) {
        logger.debug(`${contentType} metadata query failed (expected during development)`, {
          contentId,
          contentType,
          error: error.message
        });

        // Return default metadata for development
        return {
          contentId,
          contentType,
          creatorId: 'default-creator-id',
          accessLevel: AccessLevel.PUBLIC, // Default to public access during development
          price: 0
        };
      }

      if (!data) {
        return null;
      }

      return {
        contentId: data.id,
        contentType,
        creatorId: data.creator_id,
        accessLevel: data.access_level || AccessLevel.PUBLIC,
        price: data.price,
        subscriptionTierRequired: data.subscription_tier_required
      };

    } catch (error) {
      logger.debug('Content metadata error (expected during development)', {
        contentId,
        contentType,
        error
      });

      // Return permissive default for development
      return {
        contentId,
        contentType,
        creatorId: 'default-creator-id',
        accessLevel: AccessLevel.PUBLIC,
        price: 0
      };
    }
  }

  /**
   * Bulk check access for multiple content items
   */
  static async bulkCheckAccess(
    user: AuthenticatedUser | undefined,
    contentItems: Array<{ id: string; type: 'post' | 'message' | 'media' }>
  ): Promise<Map<string, EntitlementResult>> {
    const results = new Map<string, EntitlementResult>();

    // Use Promise.allSettled to handle partial failures
    const checks = contentItems.map(async (item) => {
      const result = await this.hasContentAccess(user, item.id, item.type);
      return { contentId: item.id, result };
    });

    const settled = await Promise.allSettled(checks);

    settled.forEach((outcome, index) => {
      const contentId = contentItems[index].id;

      if (outcome.status === 'fulfilled') {
        results.set(contentId, outcome.value.result);
      } else {
        results.set(contentId, {
          hasAccess: false,
          reason: 'Access check failed'
        });

        logger.error('Bulk access check failed', {
          contentId,
          error: outcome.reason
        });
      }
    });

    return results;
  }

  /**
   * Create entitlement middleware for Express routes
   */
  static requireContentAccess(contentType: 'post' | 'message' | 'media' = 'post') {
    return async (req: any, res: any, next: any) => {
      try {
        const contentId = req.params.id || req.params.contentId;

        if (!contentId) {
          return res.status(400).json({
            error: 'content_id_required',
            message: 'Content ID is required',
            correlationId: req.correlationId
          });
        }

        const entitlement = await EntitlementService.hasContentAccess(
          req.user,
          contentId,
          contentType
        );

        if (!entitlement.hasAccess) {
          const statusCode = entitlement.subscriptionRequired ? 402 : 403;

          logger.warn('Content access denied', {
            userId: req.user?.id,
            contentId,
            contentType,
            reason: entitlement.reason,
            correlationId: req.correlationId
          });

          return res.status(statusCode).json({
            error: 'access_denied',
            message: entitlement.reason,
            price: entitlement.price,
            currency: entitlement.currency,
            subscriptionRequired: entitlement.subscriptionRequired,
            upgradeRequired: entitlement.upgradeRequired,
            entitlementType: entitlement.entitlementType,
            correlationId: req.correlationId
          });
        }

        // Store entitlement result in request for later use
        req.entitlement = entitlement;
        next();

      } catch (error) {
        logger.error('Content access middleware error', {
          contentId: req.params.id || req.params.contentId,
          error,
          correlationId: req.correlationId
        });

        res.status(500).json({
          error: 'access_check_failed',
          message: 'Failed to verify content access',
          correlationId: req.correlationId
        });
      }
    };
  }
}

export default EntitlementService;