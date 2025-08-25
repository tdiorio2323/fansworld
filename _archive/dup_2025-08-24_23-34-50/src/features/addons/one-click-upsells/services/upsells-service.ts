// 💰 ONE-CLICK UPSELLS - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import type {
  Upsell,
  UpsellConversion,
  UpsellAnalytics,
  CreateUpsellRequest,
  UpdateUpsellRequest,
  UpsellDisplayRequest,
  UpsellDisplayResponse,
  UpsellFilter,
  UpsellDisplayedEvent,
  UpsellClickedEvent,
  UpsellConvertedEvent,
  UpsellDismissedEvent,
  UpsellVariant,
} from '../types';
import { DEFAULT_UPSELL_CONFIG } from '../config';

export class UpsellsService {
  // ==================== UPSELL MANAGEMENT ====================
  
  static async createUpsell(
    request: CreateUpsellRequest,
    creatorId: string
  ): Promise<Upsell> {
    try {
      const upsellData = {
        creator_id: creatorId,
        name: request.name,
        description: request.description,
        tagline: request.tagline || null,
        trigger: request.trigger,
        conditions: request.conditions,
        offer: request.offer,
        original_price: request.originalPrice,
        discounted_price: request.discountedPrice,
        discount_type: request.discountType,
        discount_value: request.discountValue,
        display_timing: request.displayTiming,
        delay_seconds: request.delaySeconds || null,
        expiration_time: request.expirationTime || null,
        template: request.template,
        design: request.design,
        headline: request.headline,
        subheadline: request.subheadline || null,
        bullet_points: request.bulletPoints,
        image_url: request.imageUrl || null,
        video_url: request.videoUrl || null,
        cta_text: request.ctaText,
        is_active: true,
        priority: request.priority,
        max_displays: request.maxDisplays,
        cooldown_period: request.cooldownPeriod,
        variants: [],
        testing_enabled: false,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversion_rate: 0,
        conversions_by_source: {},
        conversions_by_device: {},
        average_time_to_decision: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: upsell, error } = await supabase
        .from('upsells')
        .insert(upsellData)
        .select(`
          *,
          creator:profiles!upsells_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Send real-time notification
      await this.sendUpsellNotification({
        type: 'UPSELL_CREATED',
        upsellId: upsell.id,
        creatorId,
        timestamp: new Date().toISOString(),
      });

      return this.mapUpsellData(upsell);
    } catch (error) {
      console.error('Failed to create upsell:', error);
      throw error;
    }
  }

  static async updateUpsell(
    upsellId: string,
    request: UpdateUpsellRequest,
    creatorId: string
  ): Promise<Upsell> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Map request fields to database columns
      if (request.name !== undefined) updateData.name = request.name;
      if (request.description !== undefined) updateData.description = request.description;
      if (request.tagline !== undefined) updateData.tagline = request.tagline;
      if (request.conditions !== undefined) updateData.conditions = request.conditions;
      if (request.offer !== undefined) updateData.offer = request.offer;
      if (request.discountedPrice !== undefined) updateData.discounted_price = request.discountedPrice;
      if (request.discountValue !== undefined) updateData.discount_value = request.discountValue;
      if (request.design !== undefined) updateData.design = request.design;
      if (request.headline !== undefined) updateData.headline = request.headline;
      if (request.subheadline !== undefined) updateData.subheadline = request.subheadline;
      if (request.bulletPoints !== undefined) updateData.bullet_points = request.bulletPoints;
      if (request.imageUrl !== undefined) updateData.image_url = request.imageUrl;
      if (request.videoUrl !== undefined) updateData.video_url = request.videoUrl;
      if (request.ctaText !== undefined) updateData.cta_text = request.ctaText;
      if (request.isActive !== undefined) updateData.is_active = request.isActive;
      if (request.priority !== undefined) updateData.priority = request.priority;
      if (request.maxDisplays !== undefined) updateData.max_displays = request.maxDisplays;
      if (request.cooldownPeriod !== undefined) updateData.cooldown_period = request.cooldownPeriod;

      const { data: upsell, error } = await supabase
        .from('upsells')
        .update(updateData)
        .eq('id', upsellId)
        .eq('creator_id', creatorId)
        .select(`
          *,
          creator:profiles!upsells_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      return this.mapUpsellData(upsell);
    } catch (error) {
      console.error('Failed to update upsell:', error);
      throw error;
    }
  }

  static async getUpsell(upsellId: string): Promise<Upsell | null> {
    try {
      const { data: upsell, error } = await supabase
        .from('upsells')
        .select(`
          *,
          creator:profiles!upsells_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('id', upsellId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.mapUpsellData(upsell);
    } catch (error) {
      console.error('Failed to fetch upsell:', error);
      return null;
    }
  }

  static async getCreatorUpsells(
    creatorId: string,
    filter: UpsellFilter = {}
  ): Promise<Upsell[]> {
    try {
      let query = supabase
        .from('upsells')
        .select(`
          *,
          creator:profiles!upsells_creator_id_fkey(
            id, username, display_name, avatar_url
          )
        `)
        .eq('creator_id', creatorId);

      if (filter.isActive !== undefined) {
        query = query.eq('is_active', filter.isActive);
      }

      if (filter.triggerType) {
        query = query.eq('trigger->type', filter.triggerType);
      }

      if (filter.template) {
        query = query.eq('template', filter.template);
      }

      if (filter.minConversionRate) {
        query = query.gte('conversion_rate', filter.minConversionRate);
      }

      // Apply sorting
      switch (filter.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'performance':
          query = query.order('conversion_rate', { ascending: false });
          break;
        case 'revenue':
          query = query.order('revenue', { ascending: false });
          break;
        case 'conversion_rate':
          query = query.order('conversion_rate', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      if (filter.limit) query = query.limit(filter.limit);
      if (filter.offset) query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);

      const { data: upsells, error } = await query;
      
      if (error) throw error;
      
      return (upsells || []).map(this.mapUpsellData);
    } catch (error) {
      console.error('Failed to fetch creator upsells:', error);
      return [];
    }
  }

  // ==================== UPSELL DISPLAY LOGIC ====================
  
  static async checkShouldDisplay(request: UpsellDisplayRequest): Promise<UpsellDisplayResponse> {
    try {
      const upsell = await this.getUpsell(request.upsellId);
      if (!upsell || !upsell.isActive) {
        return {
          shouldDisplay: false,
          displayId: this.generateDisplayId(),
          reasons: ['Upsell not found or inactive'],
        };
      }

      // Check display frequency limits
      const displayLimits = await this.checkDisplayLimits(request.upsellId, request.userId);
      if (!displayLimits.canDisplay) {
        return {
          shouldDisplay: false,
          displayId: this.generateDisplayId(),
          reasons: displayLimits.reasons,
        };
      }

      // Evaluate trigger conditions
      const triggerMatch = await this.evaluateTrigger(upsell.trigger, request.context);
      if (!triggerMatch) {
        return {
          shouldDisplay: false,
          displayId: this.generateDisplayId(),
          reasons: ['Trigger conditions not met'],
        };
      }

      // Evaluate targeting conditions
      const conditionsMatch = await this.evaluateConditions(upsell.conditions, request.userId, request.context);
      if (!conditionsMatch) {
        return {
          shouldDisplay: false,
          displayId: this.generateDisplayId(),
          reasons: ['Targeting conditions not met'],
        };
      }

      // Select variant for A/B testing
      const variant = upsell.testingEnabled 
        ? this.selectVariant(upsell.variants, request.userId)
        : undefined;

      const displayId = this.generateDisplayId();
      
      // Record impression
      await this.recordImpression(request.upsellId, variant?.id, request.userId, displayId, request.context);

      return {
        shouldDisplay: true,
        upsell,
        variant,
        displayId,
        expiresAt: upsell.expirationTime 
          ? new Date(Date.now() + upsell.expirationTime * 1000).toISOString()
          : undefined,
      };
    } catch (error) {
      console.error('Failed to check upsell display:', error);
      return {
        shouldDisplay: false,
        displayId: this.generateDisplayId(),
        reasons: ['Error evaluating display conditions'],
      };
    }
  }

  static async recordInteraction(
    type: 'click' | 'conversion' | 'dismiss',
    upsellId: string,
    variantId: string | undefined,
    userId: string,
    displayId: string,
    context: {
      timeToAction?: number;
      conversionValue?: number;
      dismissReason?: string;
    } = {}
  ): Promise<void> {
    try {
      // Update upsell statistics
      const updateData: any = {};
      
      switch (type) {
        case 'click':
          updateData.clicks = supabase.rpc('increment_clicks', { upsell_id: upsellId });
          break;
        case 'conversion':
          updateData.conversions = supabase.rpc('increment_conversions', { upsell_id: upsellId });
          if (context.conversionValue) {
            updateData.revenue = supabase.rpc('add_revenue', { 
              upsell_id: upsellId, 
              amount: context.conversionValue 
            });
          }
          break;
      }

      await supabase
        .from('upsells')
        .update(updateData)
        .eq('id', upsellId);

      // Record interaction event
      const eventData = {
        upsell_id: upsellId,
        variant_id: variantId || null,
        user_id: userId,
        display_id: displayId,
        interaction_type: type,
        time_to_action: context.timeToAction || null,
        conversion_value: context.conversionValue || null,
        dismiss_reason: context.dismissReason || null,
        created_at: new Date().toISOString(),
      };

      await supabase
        .from('upsell_interactions')
        .insert(eventData);

      // Send real-time notification
      const event = this.createInteractionEvent(type, {
        upsellId,
        variantId,
        userId,
        displayId,
        ...context,
      });
      
      if (event) {
        await this.sendUpsellNotification(event);
      }

      // Update conversion rate
      await this.updateConversionRate(upsellId);
    } catch (error) {
      console.error('Failed to record upsell interaction:', error);
    }
  }

  // ==================== CONVERSION TRACKING ====================
  
  static async createConversion(
    upsellId: string,
    variantId: string | undefined,
    userId: string,
    displayId: string,
    conversionValue: number,
    timeToDecision: number,
    context: {
      triggerSource: string;
      deviceType: string;
      browser: string;
      operatingSystem: string;
      location?: {
        country: string;
        region: string;
        city: string;
      };
    }
  ): Promise<UpsellConversion> {
    try {
      const conversionData = {
        upsell_id: upsellId,
        variant_id: variantId || null,
        user_id: userId,
        display_id: displayId,
        converted_at: new Date().toISOString(),
        conversion_value: conversionValue,
        time_to_decision: timeToDecision,
        trigger_source: context.triggerSource,
        device_type: context.deviceType,
        browser: context.browser,
        operating_system: context.operatingSystem,
        location: context.location || null,
        created_at: new Date().toISOString(),
      };

      const { data: conversion, error } = await supabase
        .from('upsell_conversions')
        .insert(conversionData)
        .select(`
          *,
          user:profiles!upsell_conversions_user_id_fkey(
            id, username, subscription_tier, created_at
          )
        `)
        .single();

      if (error) throw error;

      // Update user's total spent for better targeting
      await this.updateUserSpendingData(userId, conversionValue);

      return this.mapConversionData(conversion);
    } catch (error) {
      console.error('Failed to create upsell conversion:', error);
      throw error;
    }
  }

  static async getUpsellConversions(
    upsellId: string,
    limit = 50,
    offset = 0
  ): Promise<UpsellConversion[]> {
    try {
      const { data: conversions, error } = await supabase
        .from('upsell_conversions')
        .select(`
          *,
          user:profiles!upsell_conversions_user_id_fkey(
            id, username, subscription_tier, created_at
          )
        `)
        .eq('upsell_id', upsellId)
        .order('converted_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return (conversions || []).map(this.mapConversionData);
    } catch (error) {
      console.error('Failed to fetch upsell conversions:', error);
      return [];
    }
  }

  // ==================== A/B TESTING ====================
  
  static async createVariant(
    upsellId: string,
    variantData: Omit<UpsellVariant, 'id' | 'impressions' | 'clicks' | 'conversions' | 'conversionRate' | 'averageOrderValue' | 'confidenceLevel' | 'pValue' | 'isStatisticallySignificant' | 'createdAt'>
  ): Promise<UpsellVariant> {
    try {
      const variant: UpsellVariant = {
        ...variantData,
        id: this.generateVariantId(),
        impressions: 0,
        clicks: 0,
        conversions: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        confidenceLevel: 0,
        pValue: 1,
        isStatisticallySignificant: false,
        createdAt: new Date().toISOString(),
      };

      // Add variant to upsell
      const { data: upsell, error } = await supabase
        .from('upsells')
        .update({
          variants: supabase.rpc('add_variant', { 
            upsell_id: upsellId, 
            variant_data: variant 
          }),
          testing_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', upsellId)
        .select('variants')
        .single();

      if (error) throw error;

      return variant;
    } catch (error) {
      console.error('Failed to create upsell variant:', error);
      throw error;
    }
  }

  static async updateVariantPerformance(
    upsellId: string,
    variantId: string,
    metrics: {
      impressions?: number;
      clicks?: number;
      conversions?: number;
      revenue?: number;
    }
  ): Promise<void> {
    try {
      await supabase.rpc('update_variant_performance', {
        upsell_id: upsellId,
        variant_id: variantId,
        metrics,
      });

      // Check for statistical significance
      await this.checkStatisticalSignificance(upsellId);
    } catch (error) {
      console.error('Failed to update variant performance:', error);
    }
  }

  // ==================== ANALYTICS & REPORTING ====================
  
  static async getUpsellAnalytics(
    upsellId: string,
    period: UpsellAnalytics['period'] = 'month'
  ): Promise<UpsellAnalytics> {
    try {
      const upsell = await this.getUpsell(upsellId);
      if (!upsell) throw new Error('Upsell not found');

      // Get basic metrics
      const { data: basicMetrics } = await supabase
        .rpc('get_upsell_metrics', { upsell_id: upsellId, time_period: period });

      // Get segmentation data
      const { data: segmentationData } = await supabase
        .rpc('get_upsell_segmentation', { upsell_id: upsellId, time_period: period });

      // Get conversion funnel data
      const { data: funnelData } = await supabase
        .rpc('get_upsell_funnel', { upsell_id: upsellId, time_period: period });

      // Get geographic performance
      const { data: geoPerformance } = await supabase
        .rpc('get_upsell_geo_performance', { upsell_id: upsellId, time_period: period });

      return {
        upsellId,
        period,
        totalImpressions: basicMetrics?.impressions || upsell.impressions,
        totalClicks: basicMetrics?.clicks || upsell.clicks,
        totalConversions: basicMetrics?.conversions || upsell.conversions,
        totalRevenue: basicMetrics?.revenue || upsell.revenue,
        conversionRate: basicMetrics?.conversion_rate || upsell.conversionRate,
        clickThroughRate: basicMetrics?.ctr || (upsell.clicks / Math.max(upsell.impressions, 1)),
        averageOrderValue: basicMetrics?.aov || (upsell.revenue / Math.max(upsell.conversions, 1)),
        revenuePerImpression: basicMetrics?.rpi || (upsell.revenue / Math.max(upsell.impressions, 1)),
        averageTimeToDecision: upsell.averageTimeToDecision,
        bounceRate: basicMetrics?.bounce_rate || 0,
        repeatConversions: basicMetrics?.repeat_conversions || 0,
        performanceByUserType: segmentationData?.by_user_type || {},
        performanceByDevice: segmentationData?.by_device || {},
        performanceByTimeOfDay: segmentationData?.by_hour || [],
        performanceByDayOfWeek: segmentationData?.by_day || [],
        performanceByCountry: geoPerformance || [],
        performanceBySource: segmentationData?.by_source || [],
        funnelData: funnelData || {
          impressions: upsell.impressions,
          clicked: upsell.clicks,
          viewed_offer: upsell.clicks,
          started_checkout: Math.floor(upsell.clicks * 0.8),
          completed_purchase: upsell.conversions,
        },
        revenueAttribution: {
          direct: upsell.revenue,
          assisted: basicMetrics?.assisted_revenue || 0,
          total: upsell.revenue + (basicMetrics?.assisted_revenue || 0),
        },
      };
    } catch (error) {
      console.error('Failed to get upsell analytics:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  private static mapUpsellData(data: any): Upsell {
    return {
      id: data.id,
      creatorId: data.creator_id,
      name: data.name,
      description: data.description,
      tagline: data.tagline,
      trigger: data.trigger,
      conditions: data.conditions || [],
      offer: data.offer,
      originalPrice: data.original_price,
      discountedPrice: data.discounted_price,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      displayTiming: data.display_timing,
      delaySeconds: data.delay_seconds,
      expirationTime: data.expiration_time,
      template: data.template,
      design: data.design,
      headline: data.headline,
      subheadline: data.subheadline,
      bulletPoints: data.bullet_points || [],
      imageUrl: data.image_url,
      videoUrl: data.video_url,
      ctaText: data.cta_text,
      isActive: data.is_active,
      priority: data.priority,
      maxDisplays: data.max_displays,
      cooldownPeriod: data.cooldown_period,
      variants: data.variants || [],
      testingEnabled: data.testing_enabled,
      winningVariant: data.winning_variant,
      impressions: data.impressions,
      clicks: data.clicks,
      conversions: data.conversions,
      revenue: data.revenue,
      conversionRate: data.conversion_rate,
      conversionsBySource: data.conversions_by_source || {},
      conversionsByDevice: data.conversions_by_device || {},
      averageTimeToDecision: data.average_time_to_decision,
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

  private static mapConversionData(data: any): UpsellConversion {
    return {
      id: data.id,
      upsellId: data.upsell_id,
      variantId: data.variant_id,
      userId: data.user_id,
      convertedAt: data.converted_at,
      conversionValue: data.conversion_value,
      timeToDecision: data.time_to_decision,
      triggerSource: data.trigger_source,
      deviceType: data.device_type,
      browser: data.browser,
      operatingSystem: data.operating_system,
      location: data.location,
      createdAt: data.created_at,
      user: data.user ? {
        id: data.user.id,
        username: data.user.username,
        subscriptionTier: data.user.subscription_tier,
        totalSpent: data.user.total_spent || 0,
        signupDate: data.user.created_at,
      } : undefined,
    };
  }

  private static generateDisplayId(): string {
    return `disp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateVariantId(): string {
    return `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async checkDisplayLimits(
    upsellId: string,
    userId: string
  ): Promise<{ canDisplay: boolean; reasons: string[] }> {
    // Implementation would check daily/weekly limits, cooldown periods, etc.
    return { canDisplay: true, reasons: [] };
  }

  private static async evaluateTrigger(trigger: any, context: any): Promise<boolean> {
    // Implementation would evaluate trigger conditions based on context
    return true;
  }

  private static async evaluateConditions(
    conditions: any[],
    userId: string,
    context: any
  ): Promise<boolean> {
    // Implementation would evaluate targeting conditions
    return true;
  }

  private static selectVariant(variants: UpsellVariant[], userId: string): UpsellVariant | undefined {
    if (!variants.length) return undefined;
    
    // Simple hash-based variant selection for consistent user experience
    const userHash = this.hashUserId(userId);
    const totalAllocation = variants.reduce((sum, v) => sum + v.trafficAllocation, 0);
    const selection = userHash % totalAllocation;
    
    let currentTotal = 0;
    for (const variant of variants) {
      currentTotal += variant.trafficAllocation;
      if (selection < currentTotal) {
        return variant;
      }
    }
    
    return variants[0];
  }

  private static hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private static async recordImpression(
    upsellId: string,
    variantId: string | undefined,
    userId: string,
    displayId: string,
    context: any
  ): Promise<void> {
    await this.recordInteraction('impression' as any, upsellId, variantId, userId, displayId, {});
  }

  private static async updateConversionRate(upsellId: string): Promise<void> {
    await supabase.rpc('update_upsell_conversion_rate', { upsell_id: upsellId });
  }

  private static async updateUserSpendingData(userId: string, amount: number): Promise<void> {
    await supabase.rpc('increment_user_spending', { user_id: userId, amount });
  }

  private static async checkStatisticalSignificance(upsellId: string): Promise<void> {
    // Implementation would calculate statistical significance for A/B test variants
  }

  private static createInteractionEvent(
    type: string,
    data: any
  ): UpsellDisplayedEvent | UpsellClickedEvent | UpsellConvertedEvent | UpsellDismissedEvent | null {
    const baseEvent = {
      upsellId: data.upsellId,
      variantId: data.variantId,
      userId: data.userId,
      displayId: data.displayId,
      timestamp: new Date().toISOString(),
    };

    switch (type) {
      case 'click':
        return {
          type: 'UPSELL_CLICKED',
          ...baseEvent,
          timeToClick: data.timeToAction || 0,
        };
      case 'conversion':
        return {
          type: 'UPSELL_CONVERTED',
          ...baseEvent,
          conversionValue: data.conversionValue || 0,
          timeToConversion: data.timeToAction || 0,
        };
      case 'dismiss':
        return {
          type: 'UPSELL_DISMISSED',
          ...baseEvent,
          dismissReason: data.dismissReason || 'unknown',
          timeToDissmiss: data.timeToAction || 0,
        };
      default:
        return null;
    }
  }

  private static async sendUpsellNotification(event: any): Promise<void> {
    try {
      const channel = supabase.channel('upsell-notifications');
      await channel.send({
        type: 'broadcast',
        event: 'upsell-event',
        payload: event,
      });
    } catch (error) {
      console.error('Failed to send upsell notification:', error);
    }
  }
}