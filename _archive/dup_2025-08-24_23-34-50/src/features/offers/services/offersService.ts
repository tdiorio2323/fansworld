/**
 * Offers Service - Limited-time promotional offers with ribbon display
 * FansWorld Creator Platform
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Offer = Database['public']['Tables']['offers']['Row'];
export type OfferRedemption = Database['public']['Tables']['offer_redemptions']['Row'];
export type OfferAnalyticsEvent = Database['public']['Tables']['offer_analytics_events']['Row'];

export interface CreateOfferData {
  title: string;
  description?: string;
  offerType: string;
  originalPriceCents?: number;
  discountedPriceCents?: number;
  discountPercentage?: number;
  maxRedemptions?: number;
  minPurchaseCents?: number;
  startsAt?: string;
  endsAt: string;
  ribbonText?: string;
  ribbonColorHex?: string;
  urgencyLevel?: number;
  targetAudience?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface RedeemOfferData {
  offerId: string;
  paymentIntentId?: string;
  originalAmountCents?: number;
  finalAmountCents?: number;
}

export interface OfferAnalytics {
  totalViews: number;
  totalClicks: number;
  totalRedemptions: number;
  conversionRate: number;
  clickThroughRate: number;
  revenueGenerated: number;
  averageDiscount: number;
  viewsByHour: Array<{ hour: number; views: number }>;
  topPages: Array<{ page: string; views: number }>;
}

class OffersService {
  /**
   * Create a new offer
   */
  async createOffer(creatorId: string, data: CreateOfferData): Promise<Offer> {
    // Validate offer data
    if (new Date(data.endsAt) <= new Date()) {
      throw new Error('Offer end date must be in the future');
    }

    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        creator_id: creatorId,
        title: data.title,
        description: data.description,
        offer_type: data.offerType,
        original_price_cents: data.originalPriceCents,
        discounted_price_cents: data.discountedPriceCents,
        discount_percentage: data.discountPercentage,
        max_redemptions: data.maxRedemptions,
        min_purchase_cents: data.minPurchaseCents || 0,
        starts_at: data.startsAt || new Date().toISOString(),
        ends_at: data.endsAt,
        ribbon_text: data.ribbonText || data.title,
        ribbon_color_hex: data.ribbonColorHex || '#FF0000',
        urgency_level: Math.max(1, Math.min(10, data.urgencyLevel || 5)),
        target_audience: data.targetAudience || {},
        metadata: data.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create offer: ${error.message}`);
    }

    // Track offer creation
    await this.trackEvent(offer.id, 'offer_created', {
      createdBy: creatorId,
      offerType: data.offerType,
      hasDiscount: !!(data.discountPercentage || data.discountedPriceCents),
    });

    return offer;
  }

  /**
   * Get active offers for a creator
   */
  async getCreatorOffers(creatorId: string, includeInactive = false): Promise<Offer[]> {
    let query = supabase
      .from('offers')
      .select('*')
      .eq('creator_id', creatorId);

    if (!includeInactive) {
      query = query
        .eq('is_active', true)
        .gte('ends_at', new Date().toISOString());
    }

    const { data: offers, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch creator offers: ${error.message}`);
    }

    return offers || [];
  }

  /**
   * Get public active offers (for display)
   */
  async getActiveOffers(limit = 20): Promise<Array<Offer & { timeRemaining: number }>> {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .gte('ends_at', new Date().toISOString())
      .order('urgency_level', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch active offers: ${error.message}`);
    }

    // Calculate time remaining for each offer
    const offersWithTime = (offers || []).map(offer => {
      const timeRemaining = new Date(offer.ends_at).getTime() - new Date().getTime();
      return {
        ...offer,
        timeRemaining: Math.max(0, timeRemaining)
      };
    });

    return offersWithTime.filter(offer => offer.timeRemaining > 0);
  }

  /**
   * Get offers targeted to a specific user
   */
  async getTargetedOffers(userId: string, userSegments: string[] = []): Promise<Offer[]> {
    // Get all active offers first
    const activeOffers = await this.getActiveOffers();
    
    // Filter by targeting criteria
    const targetedOffers = activeOffers.filter(offer => {
      const targetAudience = offer.target_audience as Record<string, any>;
      
      // If no targeting is set, show to everyone
      if (!targetAudience || Object.keys(targetAudience).length === 0) {
        return true;
      }
      
      // Check user segments
      if (targetAudience.segments && Array.isArray(targetAudience.segments)) {
        return userSegments.some(segment => targetAudience.segments.includes(segment));
      }
      
      return true;
    });

    // Track views for analytics
    for (const offer of targetedOffers) {
      await this.trackEvent(offer.id, 'offer_viewed', { userId }, userId);
    }

    return targetedOffers;
  }

  /**
   * Get a specific offer by ID
   */
  async getOffer(offerId: string, userId?: string): Promise<Offer | null> {
    const { data: offer, error } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .eq('is_active', true)
      .single();

    if (error || !offer) {
      return null;
    }

    // Track view
    if (userId) {
      await this.trackEvent(offerId, 'offer_viewed', { userId }, userId);
    }

    return offer;
  }

  /**
   * Redeem an offer
   */
  async redeemOffer(userId: string, redemptionData: RedeemOfferData): Promise<OfferRedemption> {
    // Get the offer
    const offer = await this.getOffer(redemptionData.offerId, userId);
    if (!offer) {
      throw new Error('Offer not found or inactive');
    }

    // Check if offer is still valid
    if (new Date(offer.ends_at) <= new Date()) {
      throw new Error('This offer has expired');
    }

    if (new Date(offer.starts_at) > new Date()) {
      throw new Error('This offer is not yet active');
    }

    // Check redemption limits
    if (offer.max_redemptions && offer.current_redemptions >= offer.max_redemptions) {
      throw new Error('This offer has reached its redemption limit');
    }

    // Check if user has already redeemed
    const { data: existingRedemption } = await supabase
      .from('offer_redemptions')
      .select('id')
      .eq('offer_id', redemptionData.offerId)
      .eq('user_id', userId)
      .single();

    if (existingRedemption) {
      throw new Error('You have already redeemed this offer');
    }

    // Calculate savings
    const amountSaved = (redemptionData.originalAmountCents || 0) - (redemptionData.finalAmountCents || 0);

    // Create redemption
    const { data: redemption, error } = await supabase
      .from('offer_redemptions')
      .insert({
        offer_id: redemptionData.offerId,
        user_id: userId,
        amount_saved_cents: amountSaved,
        payment_intent_id: redemptionData.paymentIntentId,
        original_amount_cents: redemptionData.originalAmountCents,
        final_amount_cents: redemptionData.finalAmountCents,
        ip_address: null, // Would be set server-side in real app
        user_agent: navigator.userAgent,
        referrer_url: document.referrer,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to redeem offer: ${error.message}`);
    }

    // Update offer redemption count
    await supabase
      .from('offers')
      .update({ current_redemptions: offer.current_redemptions + 1 })
      .eq('id', redemptionData.offerId);

    // Track redemption
    await this.trackEvent(redemptionData.offerId, 'offer_redeemed', {
      userId,
      amountSaved,
      originalAmount: redemptionData.originalAmountCents,
      finalAmount: redemptionData.finalAmountCents,
    }, userId);

    return redemption;
  }

  /**
   * Update an offer
   */
  async updateOffer(offerId: string, updates: Partial<CreateOfferData>): Promise<Offer> {
    const { data: offer, error } = await supabase
      .from('offers')
      .update({
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.originalPriceCents !== undefined && { original_price_cents: updates.originalPriceCents }),
        ...(updates.discountedPriceCents !== undefined && { discounted_price_cents: updates.discountedPriceCents }),
        ...(updates.discountPercentage !== undefined && { discount_percentage: updates.discountPercentage }),
        ...(updates.maxRedemptions !== undefined && { max_redemptions: updates.maxRedemptions }),
        ...(updates.minPurchaseCents !== undefined && { min_purchase_cents: updates.minPurchaseCents }),
        ...(updates.endsAt && { ends_at: updates.endsAt }),
        ...(updates.ribbonText !== undefined && { ribbon_text: updates.ribbonText }),
        ...(updates.ribbonColorHex && { ribbon_color_hex: updates.ribbonColorHex }),
        ...(updates.urgencyLevel !== undefined && { urgency_level: updates.urgencyLevel }),
        ...(updates.targetAudience !== undefined && { target_audience: updates.targetAudience }),
        ...(updates.metadata && { metadata: updates.metadata }),
      })
      .eq('id', offerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update offer: ${error.message}`);
    }

    // Track update
    await this.trackEvent(offerId, 'offer_updated', {
      updatedFields: Object.keys(updates),
    });

    return offer;
  }

  /**
   * Deactivate an offer
   */
  async deactivateOffer(offerId: string): Promise<void> {
    const { error } = await supabase
      .from('offers')
      .update({ is_active: false })
      .eq('id', offerId);

    if (error) {
      throw new Error(`Failed to deactivate offer: ${error.message}`);
    }

    // Track deactivation
    await this.trackEvent(offerId, 'offer_deactivated');
  }

  /**
   * Get offer analytics
   */
  async getOfferAnalytics(offerId: string): Promise<OfferAnalytics> {
    // Get analytics events
    const { data: events } = await supabase
      .from('offer_analytics_events')
      .select('*')
      .eq('offer_id', offerId)
      .order('occurred_at', { ascending: false });

    // Get redemptions
    const { data: redemptions } = await supabase
      .from('offer_redemptions')
      .select('*')
      .eq('offer_id', offerId);

    const totalViews = events?.filter(e => e.event_type === 'offer_viewed').length || 0;
    const totalClicks = events?.filter(e => e.event_type === 'offer_clicked').length || 0;
    const totalRedemptions = redemptions?.length || 0;

    const conversionRate = totalViews > 0 ? (totalRedemptions / totalViews) * 100 : 0;
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    const revenueGenerated = redemptions?.reduce((sum, r) => sum + (r.final_amount_cents || 0), 0) || 0;
    const averageDiscount = redemptions?.length > 0 
      ? redemptions.reduce((sum, r) => sum + (r.amount_saved_cents || 0), 0) / redemptions.length
      : 0;

    // Views by hour
    const viewsByHour = this.groupEventsByHour(events?.filter(e => e.event_type === 'offer_viewed') || []);

    // Top pages where offer was viewed
    const topPages = this.getTopPages(events?.filter(e => e.event_type === 'offer_viewed') || []);

    return {
      totalViews,
      totalClicks,
      totalRedemptions,
      conversionRate: Number(conversionRate.toFixed(2)),
      clickThroughRate: Number(clickThroughRate.toFixed(2)),
      revenueGenerated,
      averageDiscount,
      viewsByHour,
      topPages,
    };
  }

  /**
   * Track offer interaction event
   */
  async trackEvent(
    offerId: string, 
    eventType: string, 
    eventData?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('offer_analytics_events')
        .insert({
          offer_id: offerId,
          user_id: userId,
          event_type: eventType,
          event_data: eventData || {},
          page_url: window.location.href,
          referrer_url: document.referrer,
          user_agent: navigator.userAgent,
          session_id: this.getSessionId(),
        });
    } catch (error) {
      // Don't throw on analytics failures
      console.warn('Failed to track offer event:', error);
    }
  }

  /**
   * Calculate time remaining for an offer
   */
  getTimeRemaining(endsAt: string): {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } {
    const end = new Date(endsAt).getTime();
    const now = new Date().getTime();
    const total = end - now;

    if (total <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);

    return { total, days, hours, minutes, seconds, isExpired: false };
  }

  /**
   * Format currency
   */
  formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }

  /**
   * Calculate discount amount
   */
  calculateDiscount(originalPriceCents: number, discountPercentage: number): number {
    return Math.round((originalPriceCents * discountPercentage) / 100);
  }

  /**
   * Generate urgency message based on time remaining and urgency level
   */
  getUrgencyMessage(offer: Offer): string {
    const timeRemaining = this.getTimeRemaining(offer.ends_at);
    
    if (timeRemaining.isExpired) return 'Offer expired';
    
    const urgencyLevel = offer.urgency_level || 5;
    const timeLeft = timeRemaining.total;
    
    // Less than 1 hour
    if (timeLeft < 3600000) {
      if (urgencyLevel >= 8) return '🔥 ENDING SOON! Only minutes left!';
      return '⏰ Hurry! Less than 1 hour left!';
    }
    
    // Less than 24 hours
    if (timeLeft < 86400000) {
      if (urgencyLevel >= 8) return '🚨 LAST CHANCE! Ends today!';
      if (urgencyLevel >= 6) return '⚡ Limited time! Ends today!';
      return '📅 Ends today!';
    }
    
    // Less than 3 days
    if (timeLeft < 259200000) {
      if (urgencyLevel >= 8) return '🎯 DON\'T MISS OUT! Only days left!';
      return '📣 Limited time offer!';
    }
    
    return '💫 Special offer available!';
  }

  /**
   * Private helper methods
   */
  private groupEventsByHour(events: OfferAnalyticsEvent[]): Array<{ hour: number; views: number }> {
    const hourGroups: Record<number, number> = {};
    
    events.forEach(event => {
      const hour = new Date(event.occurred_at).getHours();
      hourGroups[hour] = (hourGroups[hour] || 0) + 1;
    });
    
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      views: hourGroups[hour] || 0
    }));
  }

  private getTopPages(events: OfferAnalyticsEvent[]): Array<{ page: string; views: number }> {
    const pageGroups: Record<string, number> = {};
    
    events.forEach(event => {
      const page = event.page_url || 'Unknown';
      pageGroups[page] = (pageGroups[page] || 0) + 1;
    });
    
    return Object.entries(pageGroups)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getSessionId(): string {
    // Simple session ID generation - in production, use proper session management
    let sessionId = sessionStorage.getItem('fansworld_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('fansworld_session_id', sessionId);
    }
    return sessionId;
  }
}

export const offersService = new OffersService();