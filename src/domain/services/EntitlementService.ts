import { User } from '../entities/User';
import { Content } from '../entities/Content';

export interface EntitlementService {
  hasContentAccess(user: User | undefined, contentId: string, contentType: 'post' | 'message' | 'media'): Promise<boolean>;
  checkSubscriptionAccess(userId: string, creatorId: string): Promise<boolean>;
  checkPremiumSubscriptionAccess(userId: string, creatorId: string, requiredTier?: string): Promise<boolean>;
  checkPPVAccess(userId: string, contentId: string, price?: number): Promise<boolean>;
  bulkCheckAccess(user: User | undefined, contentItems: Array<{ id: string; type: 'post' | 'message' | 'media' }>): Promise<Map<string, boolean>>;
}