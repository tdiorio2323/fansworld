// 🎁 LOYALTY PROGRAM - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import type {
  LoyaltyProgram,
  LoyaltyMember,
  LoyaltyTransaction,
  LoyaltyReward,
  RewardRedemption,
  LoyaltyAnalytics,
  CreateLoyaltyProgramRequest,
  UpdateLoyaltyProgramRequest,
  JoinLoyaltyProgramRequest,
  EarnPointsRequest,
  RedeemRewardRequest,
  LoyaltyProgramFilter,
  PointsEarnedEvent,
  RewardRedeemedEvent,
  TierUpgradeEvent,
  AchievementUnlockedEvent,
  MemberJoinedEvent,
  LoyaltyAchievement,
  LoyaltyChallenge,
  LoyaltyBadge,
} from '../types';
import { DEFAULT_LOYALTY_CONFIG } from '../config';

export class LoyaltyService {
  // ==================== PROGRAM MANAGEMENT ====================
  
  static async createProgram(
    request: CreateLoyaltyProgramRequest, 
    creatorId: string
  ): Promise<LoyaltyProgram> {
    try {
      const programData = {
        creator_id: creatorId,
        name: request.name,
        description: request.description,
        tagline: request.tagline || null,
        program_type: request.programType,
        currency: request.currency,
        currency_symbol: request.currencySymbol,
        points_config: request.pointsConfig || null,
        tier_config: request.tierConfig || null,
        stamp_config: request.stampConfig || null,
        rewards: request.rewards,
        perks: request.perks,
        achievements: request.achievements,
        is_active: true,
        is_public: request.isPublic,
        allow_gifting: request.allowGifting,
        referral_bonus: request.referralBonus,
        theme: request.theme,
        total_members: 0,
        active_members: 0,
        total_points_issued: 0,
        total_points_redeemed: 0,
        total_rewards_redeemed: 0,
        average_lifetime_value: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: program, error } = await supabase
        .from('loyalty_programs')
        .insert(programData)
        .select(`
          *,
          creator:profiles!loyalty_programs_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Send real-time notification
      await this.sendProgramNotification({
        type: 'PROGRAM_CREATED',
        programId: program.id,
        creatorId,
        timestamp: new Date().toISOString(),
      });

      return this.mapProgramData(program);
    } catch (error) {
      console.error('Failed to create loyalty program:', error);
      throw error;
    }
  }

  static async updateProgram(
    programId: string,
    request: UpdateLoyaltyProgramRequest,
    creatorId: string
  ): Promise<LoyaltyProgram> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Map request fields to database columns
      if (request.name !== undefined) updateData.name = request.name;
      if (request.description !== undefined) updateData.description = request.description;
      if (request.tagline !== undefined) updateData.tagline = request.tagline;
      if (request.pointsConfig !== undefined) updateData.points_config = request.pointsConfig;
      if (request.tierConfig !== undefined) updateData.tier_config = request.tierConfig;
      if (request.rewards !== undefined) updateData.rewards = request.rewards;
      if (request.perks !== undefined) updateData.perks = request.perks;
      if (request.isActive !== undefined) updateData.is_active = request.isActive;
      if (request.isPublic !== undefined) updateData.is_public = request.isPublic;
      if (request.allowGifting !== undefined) updateData.allow_gifting = request.allowGifting;
      if (request.referralBonus !== undefined) updateData.referral_bonus = request.referralBonus;
      if (request.theme !== undefined) updateData.theme = request.theme;

      const { data: program, error } = await supabase
        .from('loyalty_programs')
        .update(updateData)
        .eq('id', programId)
        .eq('creator_id', creatorId)
        .select(`
          *,
          creator:profiles!loyalty_programs_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      return this.mapProgramData(program);
    } catch (error) {
      console.error('Failed to update loyalty program:', error);
      throw error;
    }
  }

  static async getProgram(programId: string): Promise<LoyaltyProgram | null> {
    try {
      const { data: program, error } = await supabase
        .from('loyalty_programs')
        .select(`
          *,
          creator:profiles!loyalty_programs_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('id', programId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.mapProgramData(program);
    } catch (error) {
      console.error('Failed to fetch loyalty program:', error);
      return null;
    }
  }

  static async getCreatorPrograms(
    creatorId: string,
    filter: LoyaltyProgramFilter = {}
  ): Promise<LoyaltyProgram[]> {
    try {
      let query = supabase
        .from('loyalty_programs')
        .select(`
          *,
          creator:profiles!loyalty_programs_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('creator_id', creatorId);

      if (filter.isActive !== undefined) {
        query = query.eq('is_active', filter.isActive);
      }

      if (filter.programType) {
        query = query.eq('program_type', filter.programType);
      }

      if (filter.isPublic !== undefined) {
        query = query.eq('is_public', filter.isPublic);
      }

      // Apply sorting
      switch (filter.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'members':
          query = query.order('total_members', { ascending: false });
          break;
        case 'engagement':
          query = query.order('active_members', { ascending: false });
          break;
        case 'revenue':
          query = query.order('average_lifetime_value', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      if (filter.limit) query = query.limit(filter.limit);
      if (filter.offset) query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);

      const { data: programs, error } = await query;
      
      if (error) throw error;
      
      return (programs || []).map(this.mapProgramData);
    } catch (error) {
      console.error('Failed to fetch creator programs:', error);
      return [];
    }
  }

  // ==================== MEMBER MANAGEMENT ====================
  
  static async joinProgram(request: JoinLoyaltyProgramRequest): Promise<LoyaltyMember> {
    try {
      // Check if user is already a member
      const existingMember = await this.getMember(request.programId, request.userId);
      if (existingMember) {
        if (existingMember.membershipStatus === 'active') {
          throw new Error('User is already a member of this program');
        }
        
        // Reactivate membership
        const { data: member, error } = await supabase
          .from('loyalty_members')
          .update({
            membership_status: 'active',
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingMember.id)
          .select('*')
          .single();

        if (error) throw error;
        return this.mapMemberData(member);
      }

      // Create new membership
      const memberData = {
        program_id: request.programId,
        user_id: request.userId,
        membership_status: 'active',
        joined_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        current_points: 0,
        lifetime_points: 0,
        points_spent: 0,
        current_tier: null,
        tier_progress: 0,
        tier_expires_at: null,
        current_stamps: 0,
        lifetime_stamps: 0,
        achievements: [],
        badges: [],
        total_spent: 0,
        purchase_count: 0,
        referral_count: 0,
        days_active: 0,
        last_purchase_at: null,
        notifications_enabled: true,
        email_updates: true,
      };

      const { data: member, error } = await supabase
        .from('loyalty_members')
        .insert(memberData)
        .select(`
          *,
          user:profiles!loyalty_members_user_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update program member count
      await supabase
        .from('loyalty_programs')
        .update({
          total_members: supabase.rpc('increment_member_count', { program_id: request.programId }),
          active_members: supabase.rpc('increment_active_count', { program_id: request.programId }),
        })
        .eq('id', request.programId);

      // Award referral bonus if applicable
      if (request.referralCode) {
        await this.processReferralBonus(request.programId, request.userId, request.referralCode);
      }

      // Award welcome bonus points
      await this.awardWelcomeBonus(request.programId, member.id);

      const mappedMember = this.mapMemberData(member);

      // Send real-time notification
      await this.sendMemberNotification({
        type: 'MEMBER_JOINED',
        programId: request.programId,
        member: mappedMember,
        referralCode: request.referralCode,
        timestamp: new Date().toISOString(),
      });

      return mappedMember;
    } catch (error) {
      console.error('Failed to join loyalty program:', error);
      throw error;
    }
  }

  static async getMember(programId: string, userId: string): Promise<LoyaltyMember | null> {
    try {
      const { data: member, error } = await supabase
        .from('loyalty_members')
        .select(`
          *,
          user:profiles!loyalty_members_user_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('program_id', programId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.mapMemberData(member);
    } catch (error) {
      console.error('Failed to fetch loyalty member:', error);
      return null;
    }
  }

  static async getProgramMembers(
    programId: string,
    limit = 50,
    offset = 0
  ): Promise<LoyaltyMember[]> {
    try {
      const { data: members, error } = await supabase
        .from('loyalty_members')
        .select(`
          *,
          user:profiles!loyalty_members_user_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('program_id', programId)
        .eq('membership_status', 'active')
        .order('lifetime_points', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return (members || []).map(this.mapMemberData);
    } catch (error) {
      console.error('Failed to fetch program members:', error);
      return [];
    }
  }

  // ==================== POINTS & EARNING SYSTEM ====================
  
  static async earnPoints(request: EarnPointsRequest): Promise<LoyaltyTransaction> {
    try {
      // Get member and program details
      const member = await this.getMemberById(request.memberId);
      if (!member) throw new Error('Member not found');

      const program = await this.getProgram(member.programId);
      if (!program) throw new Error('Program not found');

      // Calculate points to award
      const pointsToAward = this.calculatePointsForAction(
        request.action,
        request.amount || 0,
        program,
        member
      );

      if (pointsToAward <= 0) {
        throw new Error('No points to award for this action');
      }

      // Create transaction record
      const transactionData = {
        member_id: request.memberId,
        program_id: member.programId,
        type: 'earned',
        amount: pointsToAward,
        source: request.action,
        source_id: request.sourceId || null,
        description: this.getEarnDescription(request.action, request.amount),
        balance_before: member.currentPoints,
        balance_after: member.currentPoints + pointsToAward,
        metadata: request.metadata || {},
        created_at: new Date().toISOString(),
      };

      const { data: transaction, error } = await supabase
        .from('loyalty_transactions')
        .insert(transactionData)
        .select('*')
        .single();

      if (error) throw error;

      // Update member points
      const updatedMember = await this.updateMemberPoints(
        request.memberId,
        pointsToAward,
        'add'
      );

      // Check for tier upgrades
      const tierUpgrade = await this.checkTierUpgrade(updatedMember, program);

      // Check for achievements
      const newAchievements = await this.checkAchievements(updatedMember, program);

      // Send real-time notification
      await this.sendMemberNotification({
        type: 'POINTS_EARNED',
        programId: member.programId,
        memberId: request.memberId,
        pointsEarned: pointsToAward,
        source: request.action,
        newBalance: updatedMember.currentPoints,
        achievementUnlocked: newAchievements,
        tierUpgrade: tierUpgrade?.newTier,
        timestamp: new Date().toISOString(),
      });

      return this.mapTransactionData(transaction);
    } catch (error) {
      console.error('Failed to earn points:', error);
      throw error;
    }
  }

  static async redeemReward(request: RedeemRewardRequest): Promise<RewardRedemption> {
    try {
      const member = await this.getMemberById(request.memberId);
      if (!member) throw new Error('Member not found');

      const program = await this.getProgram(member.programId);
      if (!program) throw new Error('Program not found');

      // Find the reward
      const reward = program.rewards.find(r => r.id === request.rewardId);
      if (!reward || !reward.isActive) throw new Error('Reward not found or inactive');

      const quantity = request.quantity || 1;
      const totalPointsCost = reward.pointsCost * quantity;

      // Validate redemption
      const validation = await this.validateRedemption(member, reward, quantity);
      if (!validation.valid) throw new Error(validation.error);

      // Check points balance
      if (member.currentPoints < totalPointsCost) {
        throw new Error('Insufficient points balance');
      }

      // Create redemption record
      const redemptionData = {
        member_id: request.memberId,
        reward_id: request.rewardId,
        points_spent: totalPointsCost,
        quantity,
        status: 'pending',
        shipping_details: request.shippingAddress ? { address: request.shippingAddress } : null,
        redemption_code: reward.type === 'discount_coupon' ? this.generateRedemptionCode() : null,
        expires_at: reward.expirationDays 
          ? new Date(Date.now() + reward.expirationDays * 24 * 60 * 60 * 1000).toISOString() 
          : null,
        redeemed_at: new Date().toISOString(),
      };

      const { data: redemption, error } = await supabase
        .from('reward_redemptions')
        .insert(redemptionData)
        .select(`
          *,
          member:loyalty_members!reward_redemptions_member_id_fkey(*),
          reward:loyalty_rewards!reward_redemptions_reward_id_fkey(*)
        `)
        .single();

      if (error) throw error;

      // Create points deduction transaction
      await this.createTransaction({
        memberId: request.memberId,
        programId: member.programId,
        type: 'redeemed',
        amount: -totalPointsCost,
        source: 'redemption',
        sourceId: redemption.id,
        description: `Redeemed: ${reward.name} (${quantity}x)`,
        balanceBefore: member.currentPoints,
        balanceAfter: member.currentPoints - totalPointsCost,
      });

      // Update member points
      await this.updateMemberPoints(request.memberId, totalPointsCost, 'subtract');

      // Update reward redemption count
      await this.updateRewardStats(request.rewardId, quantity);

      // Process reward delivery based on type
      await this.processRewardDelivery(redemption);

      // Send real-time notification
      await this.sendMemberNotification({
        type: 'REWARD_REDEEMED',
        programId: member.programId,
        memberId: request.memberId,
        rewardId: request.rewardId,
        pointsSpent: totalPointsCost,
        redemptionId: redemption.id,
        timestamp: new Date().toISOString(),
      });

      return this.mapRedemptionData(redemption);
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS & REPORTING ====================
  
  static async getProgramAnalytics(
    programId: string,
    period: LoyaltyAnalytics['period'] = 'month'
  ): Promise<LoyaltyAnalytics> {
    try {
      // This would typically involve complex aggregation queries
      // For now, we'll return a basic structure with placeholder logic
      
      const program = await this.getProgram(programId);
      if (!program) throw new Error('Program not found');

      // Get member metrics
      const { data: memberStats } = await supabase
        .rpc('get_loyalty_member_stats', { program_id: programId, time_period: period });

      // Get engagement metrics  
      const { data: engagementStats } = await supabase
        .rpc('get_loyalty_engagement_stats', { program_id: programId, time_period: period });

      // Get financial metrics
      const { data: financialStats } = await supabase
        .rpc('get_loyalty_financial_stats', { program_id: programId, time_period: period });

      return {
        programId,
        period,
        // Member metrics
        totalMembers: program.totalMembers,
        newMembers: memberStats?.new_members || 0,
        activeMembers: program.activeMembers,
        churnRate: memberStats?.churn_rate || 0,
        averageMemberLifetime: memberStats?.avg_lifetime || 0,
        
        // Engagement metrics
        averagePointsPerMember: engagementStats?.avg_points || 0,
        averageRedemptionsPerMember: engagementStats?.avg_redemptions || 0,
        programEngagementRate: program.activeMembers / Math.max(program.totalMembers, 1),
        
        // Financial metrics
        totalSpendByMembers: financialStats?.total_spend || 0,
        averageOrderValue: financialStats?.avg_order_value || 0,
        memberLifetimeValue: program.averageLifetimeValue,
        programROI: financialStats?.roi || 0,
        
        // Points economy
        pointsIssued: program.totalPointsIssued,
        pointsRedeemed: program.totalPointsRedeemed,
        pointsExpired: financialStats?.points_expired || 0,
        pointsOutstanding: program.totalPointsIssued - program.totalPointsRedeemed,
        pointsLiability: (program.totalPointsIssued - program.totalPointsRedeemed) * 0.01, // Estimate
        
        // Placeholder data - would be calculated from actual queries
        mostPopularRewards: [],
        leastPopularRewards: [],
        membersByTier: {},
        tierUpgradeRate: 0,
        tierDowngradeRate: 0,
        averageTimeToFirstRedemption: 0,
        averageTimeBetweenPurchases: 0,
        repeatPurchaseRate: 0,
        referralConversionRate: 0,
        challengeParticipationRate: 0,
        achievementEarnRate: 0,
        memberGrowthTrend: [],
        engagementTrend: [],
        revenueTrend: [],
      };
    } catch (error) {
      console.error('Failed to get program analytics:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  private static mapProgramData(data: any): LoyaltyProgram {
    return {
      id: data.id,
      creatorId: data.creator_id,
      name: data.name,
      description: data.description,
      tagline: data.tagline,
      programType: data.program_type,
      currency: data.currency,
      currencySymbol: data.currency_symbol,
      pointsConfig: data.points_config,
      tierConfig: data.tier_config,
      stampConfig: data.stamp_config,
      rewards: data.rewards || [],
      perks: data.perks || [],
      achievements: data.achievements || [],
      challenges: data.challenges || [],
      leaderboard: data.leaderboard || false,
      badges: data.badges || [],
      isActive: data.is_active,
      isPublic: data.is_public,
      allowGifting: data.allow_gifting,
      referralBonus: data.referral_bonus,
      theme: data.theme,
      totalMembers: data.total_members,
      activeMembers: data.active_members,
      totalPointsIssued: data.total_points_issued,
      totalPointsRedeemed: data.total_points_redeemed,
      totalRewardsRedeemed: data.total_rewards_redeemed,
      averageLifetimeValue: data.average_lifetime_value,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
      } : undefined,
    };
  }

  private static mapMemberData(data: any): LoyaltyMember {
    return {
      id: data.id,
      programId: data.program_id,
      userId: data.user_id,
      membershipStatus: data.membership_status,
      joinedAt: data.joined_at,
      lastActivityAt: data.last_activity_at,
      currentPoints: data.current_points,
      lifetimePoints: data.lifetime_points,
      pointsSpent: data.points_spent,
      currentTier: data.current_tier,
      tierProgress: data.tier_progress,
      tierExpiresAt: data.tier_expires_at,
      currentStamps: data.current_stamps,
      lifetimeStamps: data.lifetime_stamps,
      achievements: data.achievements || [],
      badges: data.badges || [],
      totalSpent: data.total_spent,
      purchaseCount: data.purchase_count,
      referralCount: data.referral_count,
      daysActive: data.days_active,
      lastPurchaseAt: data.last_purchase_at,
      notificationsEnabled: data.notifications_enabled,
      emailUpdates: data.email_updates,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        displayName: data.user.display_name,
        avatarUrl: data.user.avatar_url,
      } : undefined,
    };
  }

  private static mapTransactionData(data: any): LoyaltyTransaction {
    return {
      id: data.id,
      memberId: data.member_id,
      programId: data.program_id,
      type: data.type,
      amount: data.amount,
      source: data.source,
      sourceId: data.source_id,
      description: data.description,
      balanceBefore: data.balance_before,
      balanceAfter: data.balance_after,
      metadata: data.metadata || {},
      createdAt: data.created_at,
    };
  }

  private static mapRedemptionData(data: any): RewardRedemption {
    return {
      id: data.id,
      memberId: data.member_id,
      rewardId: data.reward_id,
      pointsSpent: data.points_spent,
      quantity: data.quantity,
      status: data.status,
      shippingDetails: data.shipping_details,
      redemptionCode: data.redemption_code,
      expiresAt: data.expires_at,
      redeemedAt: data.redeemed_at,
      deliveredAt: data.delivered_at,
    };
  }

  private static calculatePointsForAction(
    action: EarnPointsRequest['action'],
    amount: number,
    program: LoyaltyProgram,
    member: LoyaltyMember
  ): number {
    if (!program.pointsConfig) return 0;

    const earnRate = program.pointsConfig.earnRates.find(rate => rate.action === action);
    if (!earnRate) return 0;

    let points = 0;

    if (action === 'purchase' && earnRate.pointsPerDollar) {
      points = Math.floor((amount / 100) * earnRate.pointsPerDollar);
    } else {
      points = earnRate.pointsPerAction;
    }

    // Apply tier multiplier if applicable
    if (member.currentTier && program.tierConfig?.tierBonusMultiplier) {
      const tier = program.tierConfig.tiers.find(t => t.id === member.currentTier);
      if (tier) {
        points = Math.floor(points * tier.pointMultiplier);
      }
    }

    // Check daily limits
    if (earnRate.maxPointsPerDay && points > earnRate.maxPointsPerDay) {
      points = earnRate.maxPointsPerDay;
    }

    return points;
  }

  private static getEarnDescription(action: string, amount?: number): string {
    const descriptions = {
      purchase: amount ? `Purchase: $${(amount / 100).toFixed(2)}` : 'Purchase',
      subscription_signup: 'Subscription signup',
      subscription_renewal: 'Subscription renewal',
      referral: 'Referral bonus',
      social_share: 'Social media share',
      review: 'Content review',
      daily_login: 'Daily login bonus',
      content_interaction: 'Content interaction',
      birthday: 'Birthday bonus',
      anniversary: 'Anniversary bonus',
    };
    return descriptions[action as keyof typeof descriptions] || 'Points earned';
  }

  // Additional helper methods would be implemented here...
  private static async getMemberById(memberId: string): Promise<LoyaltyMember | null> {
    // Implementation
    return null;
  }

  private static async updateMemberPoints(
    memberId: string,
    points: number,
    operation: 'add' | 'subtract'
  ): Promise<LoyaltyMember> {
    // Implementation
    throw new Error('Not implemented');
  }

  private static async checkTierUpgrade(
    member: LoyaltyMember,
    program: LoyaltyProgram
  ): Promise<{ oldTier?: string; newTier: string; benefits: string[] } | null> {
    // Implementation
    return null;
  }

  private static async checkAchievements(
    member: LoyaltyMember,
    program: LoyaltyProgram
  ): Promise<string[]> {
    // Implementation
    return [];
  }

  private static async createTransaction(data: any): Promise<void> {
    // Implementation
  }

  private static async updateRewardStats(rewardId: string, quantity: number): Promise<void> {
    // Implementation
  }

  private static async processRewardDelivery(redemption: any): Promise<void> {
    // Implementation
  }

  private static async validateRedemption(
    member: LoyaltyMember,
    reward: LoyaltyReward,
    quantity: number
  ): Promise<{ valid: boolean; error?: string }> {
    // Implementation
    return { valid: true };
  }

  private static generateRedemptionCode(): string {
    return Math.random().toString(36).substr(2, 10).toUpperCase();
  }

  private static async awardWelcomeBonus(programId: string, memberId: string): Promise<void> {
    // Implementation
  }

  private static async processReferralBonus(
    programId: string,
    userId: string,
    referralCode: string
  ): Promise<void> {
    // Implementation
  }

  private static async sendProgramNotification(event: any): Promise<void> {
    try {
      const channel = supabase.channel('loyalty-program-notifications');
      await channel.send({
        type: 'broadcast',
        event: 'program-event',
        payload: event,
      });
    } catch (error) {
      console.error('Failed to send program notification:', error);
    }
  }

  private static async sendMemberNotification(
    event: MemberJoinedEvent | PointsEarnedEvent | RewardRedeemedEvent | TierUpgradeEvent | AchievementUnlockedEvent
  ): Promise<void> {
    try {
      const channel = supabase.channel('loyalty-member-notifications');
      await channel.send({
        type: 'broadcast',
        event: 'member-event',
        payload: event,
      });
    } catch (error) {
      console.error('Failed to send member notification:', error);
    }
  }
}