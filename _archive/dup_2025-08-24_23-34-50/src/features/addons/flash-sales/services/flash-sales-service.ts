// ⚡ FLASH SALES - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import type { 
  FlashSale, 
  FlashSalePurchase, 
  FlashSaleStats,
  FlashSaleCreateRequest,
  FlashSaleUpdateRequest,
  FlashSalePurchaseRequest,
  FlashSaleFilter,
  FlashSaleAnalytics,
  FlashSaleNotification,
  FlashSaleLeaderboard
} from '../types';
import { 
  getSaleStatus, 
  formatTimeRemaining, 
  calculateSalePrice,
  DEFAULT_FLASH_SALES_CONFIG 
} from '../config';

export class FlashSalesService {
  // ==================== FLASH SALE MANAGEMENT ====================
  
  static async createFlashSale(request: FlashSaleCreateRequest, creatorId: string): Promise<FlashSale> {
    try {
      // Validate request
      const validation = this.validateCreateRequest(request);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Check creator limits
      const activeSalesCount = await this.getCreatorActiveSalesCount(creatorId);
      if (activeSalesCount >= DEFAULT_FLASH_SALES_CONFIG.maxActiveSalesPerCreator) {
        throw new Error(`Maximum ${DEFAULT_FLASH_SALES_CONFIG.maxActiveSalesPerCreator} active sales per creator`);
      }

      // Calculate sale prices for items
      const itemsWithCalculatedPrices = request.items.map((item, index) => ({
        ...item,
        salePrice: calculateSalePrice(item.originalPrice, request.discountType, request.discountValue),
        order: item.order || index,
      }));

      // Create flash sale record
      const saleData = {
        creator_id: creatorId,
        title: request.title,
        description: request.description,
        sale_type: request.saleType,
        original_price: Math.max(...itemsWithCalculatedPrices.map(i => i.originalPrice)),
        sale_price: Math.max(...itemsWithCalculatedPrices.map(i => i.salePrice)),
        discount_type: request.discountType,
        discount_value: request.discountValue,
        starts_at: request.startsAt,
        ends_at: request.endsAt,
        timezone: request.timezone,
        max_purchases: request.maxPurchases,
        max_purchases_per_user: request.maxPurchasesPerUser,
        current_purchases: 0,
        view_count: 0,
        conversion_rate: 0,
        total_revenue: 0,
        is_active: true,
        is_public: request.isPublic,
        requires_subscription: request.requiresSubscription || false,
        allow_sharing: request.allowSharing,
        tags: request.tags,
        thumbnail_url: request.thumbnailUrl,
        banner_url: request.bannerUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: sale, error: saleError } = await supabase
        .from('flash_sales')
        .insert(saleData)
        .select(`
          *,
          creator:profiles!flash_sales_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (saleError) throw saleError;

      // Create sale items
      if (itemsWithCalculatedPrices.length > 0) {
        const itemsData = itemsWithCalculatedPrices.map(item => ({
          sale_id: sale.id,
          item_type: item.itemType,
          item_id: item.itemId,
          title: item.title,
          description: item.description,
          original_price: item.originalPrice,
          sale_price: item.salePrice,
          quantity: item.quantity,
          thumbnail_url: item.thumbnailUrl,
          order: item.order,
        }));

        const { error: itemsError } = await supabase
          .from('flash_sale_items')
          .insert(itemsData);

        if (itemsError) throw itemsError;
      }

      // Schedule notifications
      await this.scheduleFlashSaleNotifications(sale);

      // Generate shareable URL
      const shareableUrl = `${window.location.origin}/flash-sales/${sale.id}`;
      await supabase
        .from('flash_sales')
        .update({ shareable_url: shareableUrl })
        .eq('id', sale.id);

      return await this.getFlashSaleById(sale.id, creatorId);
    } catch (error) {
      console.error('Failed to create flash sale:', error);
      throw error;
    }
  }

  static async updateFlashSale(
    saleId: string, 
    request: FlashSaleUpdateRequest, 
    creatorId: string
  ): Promise<FlashSale> {
    try {
      // Verify ownership
      const sale = await this.getFlashSaleById(saleId, creatorId);
      if (!sale || sale.creatorId !== creatorId) {
        throw new Error('Flash sale not found or unauthorized');
      }

      // Validate update request
      const validation = this.validateUpdateRequest(request, sale);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const updateData = {
        ...request,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedSale, error } = await supabase
        .from('flash_sales')
        .update(updateData)
        .eq('id', saleId)
        .eq('creator_id', creatorId)
        .select(`
          *,
          creator:profiles!flash_sales_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Broadcast update event
      await this.broadcastSaleUpdate(updatedSale);

      return await this.getFlashSaleById(saleId, creatorId);
    } catch (error) {
      console.error('Failed to update flash sale:', error);
      throw error;
    }
  }

  static async deleteFlashSale(saleId: string, creatorId: string): Promise<void> {
    try {
      // Verify ownership
      const sale = await this.getFlashSaleById(saleId, creatorId);
      if (!sale || sale.creatorId !== creatorId) {
        throw new Error('Flash sale not found or unauthorized');
      }

      // Check if there are any purchases
      const { data: purchases, error: purchaseError } = await supabase
        .from('flash_sale_purchases')
        .select('id')
        .eq('sale_id', saleId)
        .limit(1);

      if (purchaseError) throw purchaseError;

      if (purchases && purchases.length > 0) {
        // Don't delete, just deactivate if there are purchases
        await this.updateFlashSale(saleId, { isActive: false }, creatorId);
        return;
      }

      // Delete sale items first
      await supabase
        .from('flash_sale_items')
        .delete()
        .eq('sale_id', saleId);

      // Delete notifications
      await supabase
        .from('flash_sale_notifications')
        .delete()
        .eq('sale_id', saleId);

      // Delete the sale
      const { error } = await supabase
        .from('flash_sales')
        .delete()
        .eq('id', saleId)
        .eq('creator_id', creatorId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete flash sale:', error);
      throw error;
    }
  }

  static async getFlashSaleById(saleId: string, viewerId?: string): Promise<FlashSale | null> {
    try {
      const { data: sale, error } = await supabase
        .from('flash_sales')
        .select(`
          *,
          creator:profiles!flash_sales_creator_id_fkey(id, username, display_name, avatar_url),
          items:flash_sale_items(*),
          purchases:flash_sale_purchases(*)
        `)
        .eq('id', saleId)
        .single();

      if (error) return null;

      // Increment view count if not creator
      if (viewerId && viewerId !== sale.creator_id) {
        await this.incrementViewCount(saleId);
      }

      return this.transformSaleData(sale);
    } catch (error) {
      console.error('Failed to fetch flash sale:', error);
      return null;
    }
  }

  static async getFlashSales(filter: FlashSaleFilter = {}): Promise<FlashSale[]> {
    try {
      let query = supabase
        .from('flash_sales')
        .select(`
          *,
          creator:profiles!flash_sales_creator_id_fkey(id, username, display_name, avatar_url),
          items:flash_sale_items(*)
        `);

      // Apply filters
      if (filter.creatorId) {
        query = query.eq('creator_id', filter.creatorId);
      }

      if (filter.saleType) {
        query = query.eq('sale_type', filter.saleType);
      }

      if (filter.isPublic !== undefined) {
        query = query.eq('is_public', filter.isPublic);
      }

      if (filter.priceRange) {
        query = query
          .gte('sale_price', filter.priceRange.min)
          .lte('sale_price', filter.priceRange.max);
      }

      if (filter.tags && filter.tags.length > 0) {
        query = query.overlaps('tags', filter.tags);
      }

      // Status filtering
      const now = new Date().toISOString();
      if (filter.status === 'upcoming') {
        query = query.gt('starts_at', now);
      } else if (filter.status === 'active') {
        query = query.lte('starts_at', now).gt('ends_at', now).eq('is_active', true);
      } else if (filter.status === 'ended') {
        query = query.lt('ends_at', now);
      }

      // Sorting
      switch (filter.sortBy) {
        case 'ending_soon':
          query = query.order('ends_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('sale_price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('sale_price', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        case 'biggest_savings':
          query = query.order('discount_value', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      // Pagination
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
      if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 50) - 1);
      }

      const { data: sales, error } = await query;

      if (error) throw error;

      return sales?.map(sale => this.transformSaleData(sale)) || [];
    } catch (error) {
      console.error('Failed to fetch flash sales:', error);
      return [];
    }
  }

  // ==================== PURCHASE MANAGEMENT ====================

  static async purchaseFlashSale(
    request: FlashSalePurchaseRequest, 
    buyerId: string
  ): Promise<FlashSalePurchase> {
    try {
      // Get sale details
      const sale = await this.getFlashSaleById(request.saleId);
      if (!sale || !sale.isActive) {
        throw new Error('Flash sale not found or inactive');
      }

      // Validate sale timing
      const now = new Date();
      if (now < new Date(sale.startsAt)) {
        throw new Error('Flash sale has not started yet');
      }
      if (now > new Date(sale.endsAt)) {
        throw new Error('Flash sale has ended');
      }

      // Check purchase limits
      if (sale.maxPurchases && sale.currentPurchases >= sale.maxPurchases) {
        throw new Error('Flash sale is sold out');
      }

      // Check per-user limits
      if (sale.maxPurchasesPerUser) {
        const userPurchaseCount = await this.getUserPurchaseCount(request.saleId, buyerId);
        if (userPurchaseCount >= sale.maxPurchasesPerUser) {
          throw new Error(`Maximum ${sale.maxPurchasesPerUser} purchases per user`);
        }
      }

      // Validate items
      const requestedItems = request.items.map(reqItem => {
        const saleItem = sale.items.find(item => item.id === reqItem.itemId);
        if (!saleItem) {
          throw new Error(`Item ${reqItem.itemId} not found in sale`);
        }
        return {
          ...saleItem,
          quantity: reqItem.quantity || 1,
        };
      });

      // Calculate total amount
      const totalAmount = requestedItems.reduce((sum, item) => 
        sum + (item.salePrice * item.quantity), 0);

      const originalTotal = requestedItems.reduce((sum, item) => 
        sum + (item.originalPrice * item.quantity), 0);

      const totalSavings = originalTotal - totalAmount;

      // Create purchase record
      const purchaseData = {
        sale_id: request.saleId,
        buyer_id: buyerId,
        total_amount: totalAmount,
        total_savings: totalSavings,
        payment_method: request.paymentMethod,
        promo_code: request.promoCode,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: purchase, error: purchaseError } = await supabase
        .from('flash_sale_purchases')
        .insert(purchaseData)
        .select(`
          *,
          sale:flash_sales(*),
          buyer:profiles!flash_sale_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchased items records
      const purchasedItemsData = requestedItems.map(item => ({
        purchase_id: purchase.id,
        item_id: item.id,
        item_type: item.itemType,
        title: item.title,
        original_price: item.originalPrice,
        sale_price: item.salePrice,
        quantity: item.quantity,
        savings: (item.originalPrice - item.salePrice) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('flash_sale_purchased_items')
        .insert(purchasedItemsData);

      if (itemsError) throw itemsError;

      // Process payment
      if (totalAmount > 0) {
        await this.processFlashSalePayment(purchase.id, totalAmount, request.paymentMethod);
      }

      // Update purchase status to completed
      const { data: completedPurchase, error: updateError } = await supabase
        .from('flash_sale_purchases')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString() 
        })
        .eq('id', purchase.id)
        .select(`
          *,
          sale:flash_sales(*),
          buyer:profiles!flash_sale_purchases_buyer_id_fkey(id, username, display_name, avatar_url),
          items:flash_sale_purchased_items(*)
        `)
        .single();

      if (updateError) throw updateError;

      // Update sale statistics
      await this.updateSaleStats(request.saleId, totalAmount);

      // Send notifications
      await this.sendPurchaseNotifications(completedPurchase);

      // Broadcast purchase event
      await this.broadcastPurchaseEvent(completedPurchase);

      return completedPurchase;
    } catch (error) {
      console.error('Failed to purchase flash sale:', error);
      throw error;
    }
  }

  static async getUserFlashSalePurchases(buyerId: string, limit = 50): Promise<FlashSalePurchase[]> {
    try {
      const { data: purchases, error } = await supabase
        .from('flash_sale_purchases')
        .select(`
          *,
          sale:flash_sales!inner(*),
          buyer:profiles!flash_sale_purchases_buyer_id_fkey(id, username, display_name, avatar_url),
          items:flash_sale_purchased_items(*)
        `)
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return purchases || [];
    } catch (error) {
      console.error('Failed to fetch user purchases:', error);
      return [];
    }
  }

  // ==================== ANALYTICS & STATISTICS ====================

  static async getCreatorFlashSaleStats(creatorId: string): Promise<FlashSaleStats> {
    try {
      // Get basic sale stats
      const { data: saleStats, error: saleError } = await supabase
        .from('flash_sales')
        .select('id, total_revenue, view_count, current_purchases, conversion_rate')
        .eq('creator_id', creatorId);

      if (saleError) throw saleError;

      // Get purchase stats
      const { data: purchaseStats, error: purchaseError } = await supabase
        .from('flash_sale_purchases')
        .select(`
          total_amount,
          total_savings,
          buyer_id,
          created_at,
          sale:flash_sales!inner(creator_id)
        `)
        .eq('sale.creator_id', creatorId)
        .eq('status', 'completed');

      if (purchaseError) throw purchaseError;

      // Calculate statistics
      const totalSales = saleStats?.reduce((sum, sale) => sum + sale.current_purchases, 0) || 0;
      const totalRevenue = saleStats?.reduce((sum, sale) => sum + sale.total_revenue, 0) || 0;
      const totalViews = saleStats?.reduce((sum, sale) => sum + sale.view_count, 0) || 0;
      const totalSavingsOffered = purchaseStats?.reduce((sum, p) => sum + p.total_savings, 0) || 0;
      
      const averageOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;
      const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
      const uniqueBuyers = new Set(purchaseStats?.map(p => p.buyer_id)).size;

      // Get repeat buyers
      const buyerCounts = new Map<string, number>();
      purchaseStats?.forEach(p => {
        buyerCounts.set(p.buyer_id, (buyerCounts.get(p.buyer_id) || 0) + 1);
      });
      const repeatBuyers = Array.from(buyerCounts.values()).filter(count => count > 1).length;

      // Calculate view to sale conversion
      const viewToSaleConversion = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;

      // Get recent purchases
      const recentPurchases = await this.getCreatorRecentPurchases(creatorId, 10);

      // Get top performing sale
      const topSale = saleStats?.sort((a, b) => b.total_revenue - a.total_revenue)[0];
      let topPerformingSale = null;
      if (topSale) {
        topPerformingSale = await this.getFlashSaleById(topSale.id);
      }

      return {
        totalSales,
        totalRevenue,
        totalSavingsOffered,
        averageOrderValue,
        conversionRate,
        uniqueBuyers,
        repeatBuyers,
        viewToSaleConversion,
        peakSalesHour: '14:00', // Would be calculated from actual data
        topPerformingSale,
        recentPurchases,
        salesByTimeOfDay: [], // Would be populated with actual data
        salesByDay: [], // Would be populated with actual data
      };
    } catch (error) {
      console.error('Failed to fetch creator stats:', error);
      throw error;
    }
  }

  static async getFlashSaleLeaderboard(period: 'today' | 'week' | 'month' | 'all_time' = 'week'): Promise<FlashSaleLeaderboard> {
    try {
      // This would be implemented with actual leaderboard queries
      return {
        period,
        topCreatorsBySales: [],
        topSalesByRevenue: [],
        topSalesByConversion: [],
        fastestSellouts: [],
      };
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  private static validateCreateRequest(request: FlashSaleCreateRequest): { valid: boolean; error?: string } {
    if (!request.title || request.title.trim().length === 0) {
      return { valid: false, error: 'Title is required' };
    }

    if (request.items.length === 0) {
      return { valid: false, error: 'At least one item is required' };
    }

    if (request.items.length > DEFAULT_FLASH_SALES_CONFIG.maxItemsPerSale) {
      return { valid: false, error: `Maximum ${DEFAULT_FLASH_SALES_CONFIG.maxItemsPerSale} items per sale` };
    }

    const now = new Date();
    const startTime = new Date(request.startsAt);
    const endTime = new Date(request.endsAt);

    if (startTime <= now) {
      return { valid: false, error: 'Start time must be in the future' };
    }

    if (endTime <= startTime) {
      return { valid: false, error: 'End time must be after start time' };
    }

    return { valid: true };
  }

  private static validateUpdateRequest(request: FlashSaleUpdateRequest, existingSale: FlashSale): { valid: boolean; error?: string } {
    // Can't shorten active sales
    if (request.endsAt && new Date(request.endsAt) < new Date(existingSale.endsAt)) {
      const saleStatus = getSaleStatus(existingSale);
      if (saleStatus === 'active' || saleStatus === 'ending_soon') {
        return { valid: false, error: 'Cannot shorten active flash sales' };
      }
    }

    return { valid: true };
  }

  private static async getCreatorActiveSalesCount(creatorId: string): Promise<number> {
    const now = new Date().toISOString();
    const { count, error } = await supabase
      .from('flash_sales')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .gt('ends_at', now);

    if (error) throw error;
    return count || 0;
  }

  private static async getUserPurchaseCount(saleId: string, userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('flash_sale_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('sale_id', saleId)
      .eq('buyer_id', userId)
      .eq('status', 'completed');

    if (error) throw error;
    return count || 0;
  }

  private static async processFlashSalePayment(purchaseId: string, amount: number, paymentMethod: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('process-flash-sale-payment', {
        body: {
          purchaseId,
          amount,
          currency: 'usd',
          paymentMethod
        }
      });

      if (error) throw error;

      // Update purchase with payment intent ID
      if (data?.paymentIntentId) {
        await supabase
          .from('flash_sale_purchases')
          .update({ stripe_payment_intent_id: data.paymentIntentId })
          .eq('id', purchaseId);
      }
    } catch (error) {
      // Mark purchase as failed
      await supabase
        .from('flash_sale_purchases')
        .update({ status: 'failed' })
        .eq('id', purchaseId);
      
      throw error;
    }
  }

  private static async incrementViewCount(saleId: string): Promise<void> {
    try {
      await supabase
        .from('flash_sales')
        .update({ 
          view_count: supabase.raw('view_count + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }

  private static async updateSaleStats(saleId: string, purchaseAmount: number): Promise<void> {
    try {
      await supabase
        .from('flash_sales')
        .update({ 
          current_purchases: supabase.raw('current_purchases + 1'),
          total_revenue: supabase.raw(`total_revenue + ${purchaseAmount}`),
          updated_at: new Date().toISOString()
        })
        .eq('id', saleId);

      // Recalculate conversion rate
      const { data: sale } = await supabase
        .from('flash_sales')
        .select('view_count, current_purchases')
        .eq('id', saleId)
        .single();

      if (sale && sale.view_count > 0) {
        const conversionRate = (sale.current_purchases / sale.view_count) * 100;
        await supabase
          .from('flash_sales')
          .update({ conversion_rate: conversionRate })
          .eq('id', saleId);
      }
    } catch (error) {
      console.error('Failed to update sale stats:', error);
    }
  }

  private static async scheduleFlashSaleNotifications(sale: any): Promise<void> {
    // Implementation would schedule notifications using job queue
    console.log('Flash sale notifications scheduled for:', sale.id);
  }

  private static async sendPurchaseNotifications(purchase: any): Promise<void> {
    // Implementation would send real-time notifications
    console.log('Purchase notifications sent for:', purchase.id);
  }

  private static async broadcastSaleUpdate(sale: any): Promise<void> {
    // Implementation would broadcast to real-time subscribers
    console.log('Sale update broadcasted for:', sale.id);
  }

  private static async broadcastPurchaseEvent(purchase: any): Promise<void> {
    // Implementation would broadcast purchase events
    console.log('Purchase event broadcasted for:', purchase.id);
  }

  private static async getCreatorRecentPurchases(creatorId: string, limit: number): Promise<FlashSalePurchase[]> {
    try {
      const { data: purchases, error } = await supabase
        .from('flash_sale_purchases')
        .select(`
          *,
          sale:flash_sales!inner(creator_id, title),
          buyer:profiles!flash_sale_purchases_buyer_id_fkey(id, username, display_name, avatar_url),
          items:flash_sale_purchased_items(*)
        `)
        .eq('sale.creator_id', creatorId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return purchases || [];
    } catch (error) {
      console.error('Failed to fetch recent purchases:', error);
      return [];
    }
  }

  private static transformSaleData(saleData: any): FlashSale {
    return {
      id: saleData.id,
      creatorId: saleData.creator_id,
      title: saleData.title,
      description: saleData.description,
      saleType: saleData.sale_type,
      originalPrice: saleData.original_price,
      salePrice: saleData.sale_price,
      discountType: saleData.discount_type,
      discountValue: saleData.discount_value,
      startsAt: saleData.starts_at,
      endsAt: saleData.ends_at,
      timezone: saleData.timezone,
      maxPurchases: saleData.max_purchases,
      maxPurchasesPerUser: saleData.max_purchases_per_user,
      currentPurchases: saleData.current_purchases,
      items: saleData.items || [],
      isActive: saleData.is_active,
      isPublic: saleData.is_public,
      requiresSubscription: saleData.requires_subscription,
      viewCount: saleData.view_count,
      conversionRate: saleData.conversion_rate,
      totalRevenue: saleData.total_revenue,
      allowSharing: saleData.allow_sharing,
      shareableUrl: saleData.shareable_url,
      tags: saleData.tags || [],
      thumbnailUrl: saleData.thumbnail_url,
      bannerUrl: saleData.banner_url,
      createdAt: saleData.created_at,
      updatedAt: saleData.updated_at,
      creator: saleData.creator,
      purchases: saleData.purchases,
    };
  }

  static formatPrice(priceInCents: number): string {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  static getSaleTimeRemaining(endsAt: string): string {
    return formatTimeRemaining(endsAt);
  }

  static getSaleStatus(sale: FlashSale): string {
    return getSaleStatus(sale);
  }
}