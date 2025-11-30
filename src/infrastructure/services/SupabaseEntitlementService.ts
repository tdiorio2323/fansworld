import { EntitlementService as DomainEntitlementService } from '../../domain/services/EntitlementService';
import { User } from '../../domain/entities/User';
import { Content } from '../../domain/entities/Content';
import { ContentRepository } from '../../domain/repositories/ContentRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { SupabaseContentRepository } from '../repositories/SupabaseContentRepository';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { DomainError } from '../../domain/errors';
import { logger } from '../../lib/security-enhanced';
import { getSupabaseDataSource } from '../datasources/SupabaseDataSource';
import { Service } from '../container/Container';
import { Role } from '../../domain/value-objects/Role';

interface UserSubscription {
  id: string;
  user_id: string;
  creator_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
  tier?: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  price_id?: string;
  amount?: number;
}

interface PPVPurchase {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

@Service()
export class SupabaseEntitlementService implements DomainEntitlementService {
  private supabase = getSupabaseDataSource().getClient();
  private contentRepository: ContentRepository;
  private userRepository: UserRepository;

  constructor() {
    this.contentRepository = new SupabaseContentRepository();
    this.userRepository = new SupabaseUserRepository();
  }

  async hasContentAccess(user: User | undefined, contentId: string, contentType: 'post' | 'message' | 'media'): Promise<boolean> {
    try {
      // Get content access metadata
      const content = await this.contentRepository.findById(contentId);
      if (!content) {
        logger.warn('Content not found for entitlement check', { contentId });
        return false;
      }

      // Public content is always accessible
      if (content.accessLevel.value === 'public') {
        return true;
      }

      // Authentication required for non-public content
      if (!user) {
        return false;
      }

      // Creator always has access to their own content
      if (user.id === content.creatorId) {
        return true;
      }

      // Admins and moderators have access to all content
      if (user.role.value === Role.ADMIN.value || user.role.value === Role.MODERATOR.value) {
        return true;
      }

      // Check specific access levels
      switch (content.accessLevel.value) {
        case 'subscribers_only':
          return await this.checkSubscriptionAccess(user.id, content.creatorId);

        case 'premium_subscribers':
          return await this.checkPremiumSubscriptionAccess(
            user.id,
            content.creatorId,
            content.subscriptionTierRequired
          );

        case 'ppv_locked':
        case 'custom_price':
          return await this.checkPPVAccess(user.id, contentId, content.price);

        default:
          return false;
      }

    } catch (error) {
      logger.error('Entitlement check error', {
        userId: user?.id,
        contentId,
        contentType,
        error
      });

      return false;
    }
  }

  async checkSubscriptionAccess(userId: string, creatorId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId, creatorId);

      if (!subscription) {
        return false;
      }

      if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false;
      }

      // Check if subscription is expired
      if (new Date(subscription.current_period_end) < new Date()) {
        return false;
      }

      return true;

    } catch (error) {
      logger.error('Subscription check error', { userId, creatorId, error });
      return false;
    }
  }

  async checkPremiumSubscriptionAccess(userId: string, creatorId: string, requiredTier?: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId, creatorId);

      if (!subscription) {
        return false;
      }

      if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false;
      }

      // Check tier if specified
      if (requiredTier && subscription.tier !== requiredTier) {
        return false;
      }

      return true;

    } catch (error) {
      logger.error('Premium subscription check error', {
        userId,
        creatorId,
        requiredTier,
        error
      });

      return false;
    }
  }

  async checkPPVAccess(userId: string, contentId: string, price?: number): Promise<boolean> {
    try {
      const hasPurchased = await this.hasPPVPurchase(userId, contentId);
      return hasPurchased;

    } catch (error) {
      logger.error('PPV access check error', { userId, contentId, error });
      return false;
    }
  }

  async bulkCheckAccess(user: User | undefined, contentItems: Array<{ id: string; type: 'post' | 'message' | 'media' }>): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    // Use Promise.allSettled to handle partial failures
    const checks = contentItems.map(async (item) => {
      const hasAccess = await this.hasContentAccess(user, item.id, item.type);
      return { contentId: item.id, hasAccess };
    });

    const settled = await Promise.allSettled(checks);

    settled.forEach((outcome, index) => {
      const contentId = contentItems[index].id;

      if (outcome.status === 'fulfilled') {
        results.set(contentId, outcome.value.hasAccess);
      } else {
        results.set(contentId, false);

        logger.error('Bulk access check failed', {
          contentId,
          error: outcome.reason
        });
      }
    });

    return results;
  }

  private async getUserSubscription(userId: string, creatorId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await this.supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        logger.debug('Subscription query failed', {
          userId,
          creatorId,
          error: error.message
        });
        return null;
      }

      return data as UserSubscription | null;
    } catch (error) {
      logger.debug('Subscription check error', {
        userId,
        creatorId,
        error
      });
      return null;
    }
  }

  private async hasPPVPurchase(userId: string, contentId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('ppv_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (error) {
        logger.debug('PPV purchase query failed', {
          userId,
          contentId,
          error: error.message
        });
        return false;
      }

      return !!data;
    } catch (error) {
      logger.debug('PPV purchase check error', {
        userId,
        contentId,
        error
      });
      return false;
    }
  }
}