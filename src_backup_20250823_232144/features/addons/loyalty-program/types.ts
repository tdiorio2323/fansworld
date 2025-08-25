// 🎁 LOYALTY PROGRAM - TYPE DEFINITIONS

export interface LoyaltyProgram {
  id: string;
  creatorId: string;
  
  // Program details
  name: string;
  description: string;
  tagline?: string;
  
  // Program structure
  programType: 'points' | 'tiers' | 'stamps' | 'hybrid';
  currency: 'points' | 'coins' | 'hearts' | 'stars' | 'gems' | 'tokens';
  currencySymbol: string;
  
  // Point system
  pointsConfig?: {
    earnRates: PointEarnRate[];
    redemptionRates: PointRedemptionRate[];
    pointExpiry?: number; // days until points expire
    minimumRedemption: number; // minimum points needed to redeem
    maximumBalance?: number; // maximum points a user can have
  };
  
  // Tier system
  tierConfig?: {
    tiers: LoyaltyTier[];
    tierPeriod: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
    downgradePrevention: boolean; // Can users lose tier status
    tierBonusMultiplier: boolean; // Higher tiers earn more points
  };
  
  // Stamp/punch card system
  stampConfig?: {
    stampsRequired: number;
    stampValidityPeriod: number; // days
    resetOnRedemption: boolean;
    bonusStamps: StampBonusRule[];
  };
  
  // Rewards and benefits
  rewards: LoyaltyReward[];
  perks: LoyaltyPerk[];
  
  // Gamification
  achievements: LoyaltyAchievement[];
  challenges: LoyaltyChallenge[];
  leaderboard: boolean;
  badges: LoyaltyBadge[];
  
  // Settings
  isActive: boolean;
  isPublic: boolean; // Show on public profile
  allowGifting: boolean; // Users can gift points to each other
  referralBonus: number; // Points for referrals
  
  // Appearance
  theme: ProgramTheme;
  
  // Analytics
  totalMembers: number;
  activeMembers: number; // Active in last 30 days
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalRewardsRedeemed: number;
  averageLifetimeValue: number; // in cents
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  creator?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  members?: LoyaltyMember[];
}

export interface LoyaltyMember {
  id: string;
  programId: string;
  userId: string;
  
  // Status
  membershipStatus: 'active' | 'inactive' | 'suspended' | 'banned';
  joinedAt: string;
  lastActivityAt?: string;
  
  // Points and balance
  currentPoints: number;
  lifetimePoints: number;
  pointsSpent: number;
  
  // Tier information
  currentTier?: string;
  tierProgress: number; // Progress toward next tier (0-100)
  tierExpiresAt?: string;
  
  // Stamps (for punch card system)
  currentStamps: number;
  lifetimeStamps: number;
  
  // Achievements and badges
  achievements: string[]; // Achievement IDs
  badges: string[]; // Badge IDs
  
  // Statistics
  totalSpent: number; // Money spent (in cents)
  purchaseCount: number;
  referralCount: number;
  daysActive: number;
  lastPurchaseAt?: string;
  
  // Preferences
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  
  // Relations
  user?: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  transactions?: LoyaltyTransaction[];
  rewardRedemptions?: RewardRedemption[];
}

export interface PointEarnRate {
  action: 'purchase' | 'subscription_signup' | 'subscription_renewal' | 'referral' | 'social_share' | 'review' | 'daily_login' | 'content_interaction' | 'birthday' | 'anniversary';
  pointsPerAction: number;
  pointsPerDollar?: number; // For purchases
  maxPointsPerDay?: number;
  conditions?: EarnCondition[];
}

export interface PointRedemptionRate {
  rewardType: 'discount' | 'free_content' | 'exclusive_access' | 'physical_item' | 'custom_request_discount' | 'priority_support';
  pointsRequired: number;
  dollarValue?: number; // Equivalent dollar value
  maxRedemptionsPerMonth?: number;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  description: string;
  requiredPoints: number;
  requiredSpend?: number; // Minimum spend to qualify (in cents)
  color: string;
  icon: string;
  
  // Benefits
  pointMultiplier: number; // 1.5 = 50% bonus points
  discountPercentage: number;
  exclusiveContent: boolean;
  prioritySupport: boolean;
  earlyAccess: boolean;
  freeShipping: boolean;
  customPerks: string[];
  
  // Requirements to maintain tier
  maintenanceRequirements?: {
    monthlySpend?: number; // in cents
    monthlyActivity?: number; // interactions
    renewalPeriod?: number; // months
  };
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  type: 'discount_coupon' | 'free_content' | 'exclusive_access' | 'physical_item' | 'experience' | 'custom_request_credit' | 'bonus_points' | 'tier_upgrade';
  
  // Cost
  pointsCost: number;
  cashValue?: number; // Equivalent cash value in cents
  
  // Availability
  totalQuantity?: number; // Limited quantity
  remainingQuantity?: number;
  maxPerMember?: number; // Per member limit
  tierRestriction?: string[]; // Only for certain tiers
  
  // Details
  discountPercentage?: number;
  discountAmount?: number; // in cents
  contentIds?: string[];
  physicalItemDetails?: {
    name: string;
    description: string;
    imageUrl: string;
    shippingRequired: boolean;
    estimatedDelivery: string;
  };
  
  // Timing
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  expirationDays?: number; // Days after redemption
  
  // Stats
  timesRedeemed: number;
  popularity: number; // 0-1 based on redemption rate
  
  imageUrl?: string;
  terms?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyPerk {
  id: string;
  name: string;
  description: string;
  type: 'automatic' | 'manual' | 'tier_based';
  
  // Eligibility
  tierRequirement?: string;
  pointsRequirement?: number;
  membershipDuration?: number; // days of membership required
  
  // Perk details
  benefit: 'discount' | 'free_shipping' | 'early_access' | 'exclusive_content' | 'priority_support' | 'bonus_points' | 'special_events' | 'custom';
  value?: number;
  isActive: boolean;
  
  icon?: string;
  color?: string;
}

export interface LoyaltyAchievement {
  id: string;
  name: string;
  description: string;
  category: 'spending' | 'engagement' | 'referral' | 'loyalty' | 'social' | 'special';
  
  // Requirements
  requirements: AchievementRequirement[];
  
  // Rewards
  pointsReward: number;
  badgeId?: string;
  specialPerk?: string;
  
  // Appearance
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Stats
  totalEarned: number;
  earningRate: number; // Percentage of members who earned it
  
  isActive: boolean;
  isHidden: boolean; // Secret achievements
  
  createdAt: string;
}

export interface AchievementRequirement {
  type: 'total_spent' | 'purchase_count' | 'referral_count' | 'days_active' | 'tier_reached' | 'points_earned' | 'content_interactions' | 'social_shares';
  value: number;
  timeframe?: 'all_time' | 'monthly' | 'yearly';
}

export interface LoyaltyChallenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special_event';
  
  // Challenge details
  objectives: ChallengeObjective[];
  duration: number; // days
  
  // Rewards
  completionReward: {
    points: number;
    badges?: string[];
    specialPerk?: string;
  };
  progressRewards?: Array<{
    milestone: number; // percentage completed
    reward: {
      points: number;
      badge?: string;
    };
  }>;
  
  // Participation
  totalParticipants: number;
  completionRate: number;
  
  // Timing
  startDate: string;
  endDate: string;
  isActive: boolean;
  
  imageUrl?: string;
  createdAt: string;
}

export interface ChallengeObjective {
  description: string;
  type: 'make_purchase' | 'spend_amount' | 'refer_friends' | 'share_content' | 'interact_with_content' | 'daily_login';
  target: number;
  currentProgress?: number;
}

export interface LoyaltyBadge {
  id: string;
  name: string;
  description: string;
  category: 'achievement' | 'tier' | 'special_event' | 'anniversary' | 'seasonal';
  
  // Appearance
  imageUrl: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Requirements
  requirements: string;
  isAutoAwarded: boolean;
  
  // Stats
  totalAwarded: number;
  
  isActive: boolean;
  createdAt: string;
}

export interface StampBonusRule {
  condition: 'first_purchase' | 'weekend_purchase' | 'bulk_purchase' | 'tier_member' | 'special_event';
  bonusStamps: number;
  maxBonusPerMonth?: number;
}

export interface EarnCondition {
  type: 'minimum_amount' | 'product_category' | 'tier_requirement' | 'time_window';
  value: string | number;
}

export interface LoyaltyTransaction {
  id: string;
  memberId: string;
  programId: string;
  
  type: 'earned' | 'redeemed' | 'expired' | 'bonus' | 'penalty' | 'gift_received' | 'gift_sent' | 'refund';
  amount: number; // positive for earned, negative for spent
  
  // Context
  source: 'purchase' | 'referral' | 'bonus' | 'challenge' | 'achievement' | 'gift' | 'manual_adjustment' | 'redemption' | 'expiration';
  sourceId?: string; // Related purchase, reward, etc.
  description: string;
  
  // Balance tracking
  balanceBefore: number;
  balanceAfter: number;
  
  // Additional data
  metadata?: Record<string, any>;
  
  createdAt: string;
  
  // Relations
  relatedRedemption?: RewardRedemption;
}

export interface RewardRedemption {
  id: string;
  memberId: string;
  rewardId: string;
  
  // Redemption details
  pointsSpent: number;
  quantity: number;
  
  status: 'pending' | 'confirmed' | 'delivered' | 'expired' | 'cancelled';
  
  // For physical items
  shippingDetails?: {
    address: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery: string;
    actualDelivery?: string;
  };
  
  // For digital rewards
  redemptionCode?: string;
  expiresAt?: string;
  
  redeemedAt: string;
  deliveredAt?: string;
  
  // Relations
  member?: LoyaltyMember;
  reward?: LoyaltyReward;
}

export interface ProgramTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Card styling
  cardStyle: 'modern' | 'classic' | 'minimalist' | 'playful';
  borderRadius: number;
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
  
  // Typography
  headingFont: string;
  bodyFont: string;
  
  // Animations
  enableAnimations: boolean;
  animationStyle: 'subtle' | 'bouncy' | 'smooth';
  
  // Custom CSS
  customCSS?: string;
}

// Analytics and reporting types
export interface LoyaltyAnalytics {
  programId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  
  // Member metrics
  totalMembers: number;
  newMembers: number;
  activeMembers: number;
  churnRate: number;
  averageMemberLifetime: number; // days
  
  // Engagement metrics
  averagePointsPerMember: number;
  averageRedemptionsPerMember: number;
  programEngagementRate: number; // Active members / Total members
  
  // Financial metrics
  totalSpendByMembers: number; // in cents
  averageOrderValue: number; // in cents
  memberLifetimeValue: number; // in cents
  programROI: number; // Return on investment
  
  // Points economy
  pointsIssued: number;
  pointsRedeemed: number;
  pointsExpired: number;
  pointsOutstanding: number;
  pointsLiability: number; // Estimated cash value of outstanding points
  
  // Reward performance
  mostPopularRewards: Array<{
    rewardId: string;
    rewardName: string;
    redemptions: number;
    pointsSpent: number;
  }>;
  
  leastPopularRewards: Array<{
    rewardId: string;
    rewardName: string;
    redemptions: number;
  }>;
  
  // Tier distribution
  membersByTier: Record<string, number>;
  tierUpgradeRate: number;
  tierDowngradeRate: number;
  
  // Member behavior
  averageTimeToFirstRedemption: number; // days
  averageTimeBetweenPurchases: number; // days
  repeatPurchaseRate: number;
  referralConversionRate: number;
  
  // Challenges and achievements
  challengeParticipationRate: number;
  achievementEarnRate: number;
  
  // Trends
  memberGrowthTrend: Array<{
    date: string;
    newMembers: number;
    totalMembers: number;
  }>;
  
  engagementTrend: Array<{
    date: string;
    activeMembers: number;
    pointsEarned: number;
    pointsRedeemed: number;
  }>;
  
  revenueTrend: Array<{
    date: string;
    memberSpend: number;
    nonMemberSpend: number;
    memberConversion: number;
  }>;
}

// Request/response types
export interface CreateLoyaltyProgramRequest {
  name: string;
  description: string;
  tagline?: string;
  programType: LoyaltyProgram['programType'];
  currency: LoyaltyProgram['currency'];
  currencySymbol: string;
  pointsConfig?: LoyaltyProgram['pointsConfig'];
  tierConfig?: LoyaltyProgram['tierConfig'];
  stampConfig?: LoyaltyProgram['stampConfig'];
  rewards: Omit<LoyaltyReward, 'id' | 'timesRedeemed' | 'popularity' | 'createdAt' | 'updatedAt'>[];
  perks: Omit<LoyaltyPerk, 'id'>[];
  achievements: Omit<LoyaltyAchievement, 'id' | 'totalEarned' | 'earningRate' | 'createdAt'>[];
  isPublic: boolean;
  allowGifting: boolean;
  referralBonus: number;
  theme: ProgramTheme;
}

export interface UpdateLoyaltyProgramRequest {
  name?: string;
  description?: string;
  tagline?: string;
  pointsConfig?: LoyaltyProgram['pointsConfig'];
  tierConfig?: LoyaltyProgram['tierConfig'];
  rewards?: LoyaltyReward[];
  perks?: LoyaltyPerk[];
  isActive?: boolean;
  isPublic?: boolean;
  allowGifting?: boolean;
  referralBonus?: number;
  theme?: ProgramTheme;
}

export interface JoinLoyaltyProgramRequest {
  programId: string;
  userId: string;
  referralCode?: string;
}

export interface EarnPointsRequest {
  memberId: string;
  action: PointEarnRate['action'];
  amount?: number; // For purchase amounts
  sourceId?: string; // Related purchase, referral, etc.
  metadata?: Record<string, any>;
}

export interface RedeemRewardRequest {
  memberId: string;
  rewardId: string;
  quantity?: number;
  shippingAddress?: string;
}

export interface LoyaltyProgramFilter {
  creatorId?: string;
  isActive?: boolean;
  programType?: LoyaltyProgram['programType'];
  isPublic?: boolean;
  sortBy?: 'newest' | 'oldest' | 'members' | 'engagement' | 'revenue';
  limit?: number;
  offset?: number;
}

// Event types for real-time updates
export interface MemberJoinedEvent {
  type: 'MEMBER_JOINED';
  programId: string;
  member: LoyaltyMember;
  referralCode?: string;
  timestamp: string;
}

export interface PointsEarnedEvent {
  type: 'POINTS_EARNED';
  programId: string;
  memberId: string;
  pointsEarned: number;
  source: string;
  newBalance: number;
  achievementUnlocked?: string[];
  tierUpgrade?: string;
  timestamp: string;
}

export interface RewardRedeemedEvent {
  type: 'REWARD_REDEEMED';
  programId: string;
  memberId: string;
  rewardId: string;
  pointsSpent: number;
  redemptionId: string;
  timestamp: string;
}

export interface TierUpgradeEvent {
  type: 'TIER_UPGRADE';
  programId: string;
  memberId: string;
  oldTier?: string;
  newTier: string;
  benefits: string[];
  timestamp: string;
}

export interface AchievementUnlockedEvent {
  type: 'ACHIEVEMENT_UNLOCKED';
  programId: string;
  memberId: string;
  achievementId: string;
  pointsAwarded: number;
  timestamp: string;
}

// Configuration
export interface LoyaltyConfig {
  enabled: boolean;
  
  // Program limits
  maxProgramsPerCreator: number;
  maxRewardsPerProgram: number;
  maxTiersPerProgram: number;
  
  // Points system
  maxPointsPerTransaction: number;
  maxPointBalance: number;
  defaultPointExpiry: number; // days
  
  // Security
  preventPointsManipulation: boolean;
  auditAllTransactions: boolean;
  maxDailyEarnings: number; // points
  
  // Features
  enableGamification: boolean;
  enableSocialFeatures: boolean;
  enableReferralProgram: boolean;
  enableChallenges: boolean;
  
  // Notifications
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  notificationPreferences: {
    pointsEarned: boolean;
    rewardRedeemed: boolean;
    tierUpgrade: boolean;
    achievementUnlocked: boolean;
    challengeComplete: boolean;
    pointsExpiring: boolean;
  };
  
  // Analytics
  enableDetailedAnalytics: boolean;
  dataRetentionPeriod: number; // days
  
  // Compliance
  enableGDPRCompliance: boolean;
  allowDataExport: boolean;
  allowAccountDeletion: boolean;
}