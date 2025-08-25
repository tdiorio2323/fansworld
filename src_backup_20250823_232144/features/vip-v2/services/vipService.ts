/**
 * VIP v2 Service - Enhanced VIP code system with analytics
 * FansWorld Creator Platform
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type VipCode = Database['public']['Tables']['vip_v2_codes']['Row'];
export type VipRedemption = Database['public']['Tables']['vip_v2_redemptions']['Row'];
export type VipAnalyticsEvent = Database['public']['Tables']['vip_v2_analytics_events']['Row'];

export interface CreateVipCodeData {
  code: string;
  title: string;
  description?: string;
  maxUses: number;
  priceCents: number;
  benefits: string[];
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface RedeemCodeData {
  code: string;
  paymentIntentId?: string;
  amountPaidCents?: number;
  userAgent?: string;
  referrerUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, any>;
}

export interface VipCodeAnalytics {
  totalViews: number;
  totalRedemptions: number;
  conversionRate: number;
  revenueGenerated: number;
  topReferrers: Array<{ referrer: string; count: number }>;
  redemptionsByDay: Array<{ date: string; count: number }>;
  userAnalytics: {
    uniqueUsers: number;
    returningUsers: number;
    averageSessionTime: number;
  };
}

class VipV2Service {
  /**
   * Create a new VIP v2 code
   */
  async createCode(creatorId: string, data: CreateVipCodeData): Promise<VipCode> {
    const { data: code, error } = await supabase
      .from('vip_v2_codes')
      .insert({
        creator_id: creatorId,
        code: data.code,
        title: data.title,
        description: data.description,
        max_uses: data.maxUses,
        price_cents: data.priceCents,
        benefits: data.benefits,
        expires_at: data.expiresAt,
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create VIP code: ${error.message}`);
    }

    // Track code creation analytics
    await this.trackAnalyticsEvent(code.id, 'code_created', {
      createdBy: creatorId,
      codeLength: data.code.length,
      priceCents: data.priceCents,
      maxUses: data.maxUses,
    });

    return code;
  }

  /**
   * Get all VIP codes for a creator
   */
  async getCreatorCodes(creatorId: string): Promise<VipCode[]> {
    const { data: codes, error } = await supabase
      .from('vip_v2_codes')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch creator codes: ${error.message}`);
    }

    return codes || [];
  }

  /**
   * Get active VIP codes (publicly viewable)
   */
  async getActiveCodes(limit = 50): Promise<VipCode[]> {
    const { data: codes, error } = await supabase
      .from('vip_v2_codes')
      .select('*')
      .eq('is_active', true)
      .or('expires_at.is.null,expires_at.gte.now()')
      .lt('current_uses', supabase.raw('max_uses'))
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch active codes: ${error.message}`);
    }

    return codes || [];
  }

  /**
   * Get a specific VIP code by code string
   */
  async getCodeByString(code: string): Promise<VipCode | null> {
    const { data, error } = await supabase
      .from('vip_v2_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Code not found
      }
      throw new Error(`Failed to fetch code: ${error.message}`);
    }

    // Track code view
    await this.trackAnalyticsEvent(data.id, 'code_viewed', {
      viewedAt: new Date().toISOString(),
    });

    return data;
  }

  /**
   * Redeem a VIP code
   */
  async redeemCode(
    userId: string, 
    redemptionData: RedeemCodeData,
    ipAddress?: string
  ): Promise<VipRedemption> {
    // First, get the code
    const code = await this.getCodeByString(redemptionData.code);
    if (!code) {
      throw new Error('VIP code not found or inactive');
    }

    // Check if code is still valid
    if (code.current_uses >= code.max_uses) {
      throw new Error('VIP code has reached maximum uses');
    }

    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      throw new Error('VIP code has expired');
    }

    // Check if user has already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('vip_v2_redemptions')
      .select('id')
      .eq('code_id', code.id)
      .eq('user_id', userId)
      .single();

    if (existingRedemption) {
      throw new Error('You have already redeemed this VIP code');
    }

    // Create the redemption
    const { data: redemption, error } = await supabase
      .from('vip_v2_redemptions')
      .insert({
        code_id: code.id,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: redemptionData.userAgent,
        payment_intent_id: redemptionData.paymentIntentId,
        amount_paid_cents: redemptionData.amountPaidCents || 0,
        referrer_url: redemptionData.referrerUrl,
        utm_source: redemptionData.utmSource,
        utm_medium: redemptionData.utmMedium,
        utm_campaign: redemptionData.utmCampaign,
        metadata: redemptionData.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to redeem code: ${error.message}`);
    }

    // Update code usage count
    await supabase
      .from('vip_v2_codes')
      .update({ current_uses: code.current_uses + 1 })
      .eq('id', code.id);

    // Track redemption analytics
    await this.trackAnalyticsEvent(code.id, 'code_redeemed', {
      redeemedBy: userId,
      amountPaid: redemptionData.amountPaidCents || 0,
      referrer: redemptionData.referrerUrl,
      utm: {
        source: redemptionData.utmSource,
        medium: redemptionData.utmMedium,
        campaign: redemptionData.utmCampaign,
      },
    }, userId);

    return redemption;
  }

  /**
   * Get redemptions for a code
   */
  async getCodeRedemptions(codeId: string): Promise<VipRedemption[]> {
    const { data: redemptions, error } = await supabase
      .from('vip_v2_redemptions')
      .select('*')
      .eq('code_id', codeId)
      .order('redeemed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch redemptions: ${error.message}`);
    }

    return redemptions || [];
  }

  /**
   * Get user's redemptions
   */
  async getUserRedemptions(userId: string): Promise<Array<VipRedemption & { code: VipCode }>> {
    const { data: redemptions, error } = await supabase
      .from('vip_v2_redemptions')
      .select(`
        *,
        vip_v2_codes (*)
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user redemptions: ${error.message}`);
    }

    return redemptions?.map(r => ({
      ...r,
      code: r.vip_v2_codes as VipCode
    })) || [];
  }

  /**
   * Update VIP code
   */
  async updateCode(codeId: string, updates: Partial<CreateVipCodeData>): Promise<VipCode> {
    const { data: code, error } = await supabase
      .from('vip_v2_codes')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.maxUses && { max_uses: updates.maxUses }),
        ...(updates.priceCents !== undefined && { price_cents: updates.priceCents }),
        ...(updates.benefits && { benefits: updates.benefits }),
        ...(updates.expiresAt !== undefined && { expires_at: updates.expiresAt }),
        ...(updates.metadata && { metadata: updates.metadata }),
      })
      .eq('id', codeId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update code: ${error.message}`);
    }

    // Track update analytics
    await this.trackAnalyticsEvent(codeId, 'code_updated', {
      updatedFields: Object.keys(updates),
    });

    return code;
  }

  /**
   * Deactivate VIP code
   */
  async deactivateCode(codeId: string): Promise<void> {
    const { error } = await supabase
      .from('vip_v2_codes')
      .update({ is_active: false })
      .eq('id', codeId);

    if (error) {
      throw new Error(`Failed to deactivate code: ${error.message}`);
    }

    // Track deactivation
    await this.trackAnalyticsEvent(codeId, 'code_deactivated');
  }

  /**
   * Get comprehensive analytics for a VIP code
   */
  async getCodeAnalytics(codeId: string): Promise<VipCodeAnalytics> {
    // Get basic code data
    const { data: code } = await supabase
      .from('vip_v2_codes')
      .select('*')
      .eq('id', codeId)
      .single();

    if (!code) {
      throw new Error('Code not found');
    }

    // Get analytics events
    const { data: events } = await supabase
      .from('vip_v2_analytics_events')
      .select('*')
      .eq('code_id', codeId)
      .order('occurred_at', { ascending: false });

    // Get redemptions
    const { data: redemptions } = await supabase
      .from('vip_v2_redemptions')
      .select('*')
      .eq('code_id', codeId);

    const totalViews = events?.filter(e => e.event_type === 'code_viewed').length || 0;
    const totalRedemptions = redemptions?.length || 0;
    const conversionRate = totalViews > 0 ? (totalRedemptions / totalViews) * 100 : 0;
    const revenueGenerated = redemptions?.reduce((sum, r) => sum + (r.amount_paid_cents || 0), 0) || 0;

    // Top referrers
    const referrerCounts = redemptions?.reduce((acc, r) => {
      const referrer = r.referrer_url || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Redemptions by day
    const redemptionsByDay = this.groupRedemptionsByDay(redemptions || []);

    return {
      totalViews,
      totalRedemptions,
      conversionRate: Number(conversionRate.toFixed(2)),
      revenueGenerated,
      topReferrers,
      redemptionsByDay,
      userAnalytics: {
        uniqueUsers: new Set(redemptions?.map(r => r.user_id)).size,
        returningUsers: 0, // TODO: Calculate based on user activity
        averageSessionTime: 0, // TODO: Calculate from analytics events
      },
    };
  }

  /**
   * Track analytics event
   */
  private async trackAnalyticsEvent(
    codeId: string, 
    eventType: string, 
    eventData?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('vip_v2_analytics_events')
        .insert({
          code_id: codeId,
          user_id: userId,
          event_type: eventType,
          event_data: eventData || {},
        });
    } catch (error) {
      // Don't throw on analytics failures
      console.warn('Failed to track analytics event:', error);
    }
  }

  /**
   * Group redemptions by day for analytics
   */
  private groupRedemptionsByDay(redemptions: VipRedemption[]): Array<{ date: string; count: number }> {
    const dayGroups = redemptions.reduce((acc, redemption) => {
      const date = new Date(redemption.redeemed_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dayGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Validate VIP code format
   */
  validateCodeFormat(code: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!code) {
      errors.push('Code is required');
    } else {
      if (code.length < 3) {
        errors.push('Code must be at least 3 characters long');
      }
      if (code.length > 50) {
        errors.push('Code must be no more than 50 characters long');
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
        errors.push('Code can only contain letters, numbers, underscores, and hyphens');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate random VIP code
   */
  generateCode(length = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const vipV2Service = new VipV2Service();