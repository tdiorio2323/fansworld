// 🔒 PPV MESSAGES - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import type { 
  PPVMessage, 
  PPVPurchase, 
  PPVMessageStats,
  PPVCreateRequest,
  PPVUpdateRequest,
  PPVPurchaseRequest,
  PPVMessageFilter,
  PPVAnalytics,
  PPVPromoCode,
  PPVNotification
} from '../types';
import { calculateCreatorEarnings, calculatePlatformFee } from '../config';

export class PPVMessagesService {
  // ==================== MESSAGE MANAGEMENT ====================
  
  static async createMessage(request: PPVCreateRequest, creatorId: string): Promise<PPVMessage> {
    try {
      // Validate request
      const validation = this.validateCreateRequest(request);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Create message record
      const messageData = {
        creator_id: creatorId,
        title: request.title,
        description: request.description,
        price: request.price,
        thumbnail_url: request.thumbnailUrl,
        preview_text: request.previewText,
        expires_at: request.expiresAt,
        max_views: request.maxViews,
        current_views: 0,
        total_earnings: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: message, error: messageError } = await supabase
        .from('ppv_messages')
        .insert(messageData)
        .select(`
          *,
          creator:profiles!ppv_messages_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (messageError) throw messageError;

      // Create content items
      if (request.content.length > 0) {
        const contentItems = request.content.map((item, index) => ({
          message_id: message.id,
          type: item.type,
          content: item.content,
          caption: item.caption,
          thumbnail: item.thumbnail,
          duration: item.duration,
          file_size: item.fileSize,
          mime_type: item.mimeType,
          order: item.order || index,
        }));

        const { error: contentError } = await supabase
          .from('ppv_message_content')
          .insert(contentItems);

        if (contentError) throw contentError;
      }

      // Add tags if provided
      if (request.tags && request.tags.length > 0) {
        const tagData = request.tags.map(tag => ({
          message_id: message.id,
          tag: tag.toLowerCase().trim(),
        }));

        await supabase
          .from('ppv_message_tags')
          .insert(tagData);
      }

      // Fetch complete message with content
      return await this.getMessageById(message.id, creatorId);
    } catch (error) {
      console.error('Failed to create PPV message:', error);
      throw error;
    }
  }

  static async updateMessage(
    messageId: string, 
    request: PPVUpdateRequest, 
    creatorId: string
  ): Promise<PPVMessage> {
    try {
      // Verify ownership
      const message = await this.getMessageById(messageId, creatorId);
      if (!message || message.creatorId !== creatorId) {
        throw new Error('Message not found or unauthorized');
      }

      const updateData = {
        ...request,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedMessage, error } = await supabase
        .from('ppv_messages')
        .update(updateData)
        .eq('id', messageId)
        .eq('creator_id', creatorId)
        .select(`
          *,
          creator:profiles!ppv_messages_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      return await this.getMessageById(messageId, creatorId);
    } catch (error) {
      console.error('Failed to update PPV message:', error);
      throw error;
    }
  }

  static async deleteMessage(messageId: string, creatorId: string): Promise<void> {
    try {
      // Verify ownership and check for existing purchases
      const message = await this.getMessageById(messageId, creatorId);
      if (!message || message.creatorId !== creatorId) {
        throw new Error('Message not found or unauthorized');
      }

      // Check if there are any purchases
      const { data: purchases, error: purchaseError } = await supabase
        .from('ppv_purchases')
        .select('id')
        .eq('message_id', messageId)
        .limit(1);

      if (purchaseError) throw purchaseError;

      if (purchases && purchases.length > 0) {
        // Don't delete, just deactivate if there are purchases
        await this.updateMessage(messageId, { isActive: false }, creatorId);
        return;
      }

      // Delete content items first
      await supabase
        .from('ppv_message_content')
        .delete()
        .eq('message_id', messageId);

      // Delete tags
      await supabase
        .from('ppv_message_tags')
        .delete()
        .eq('message_id', messageId);

      // Delete the message
      const { error } = await supabase
        .from('ppv_messages')
        .delete()
        .eq('id', messageId)
        .eq('creator_id', creatorId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete PPV message:', error);
      throw error;
    }
  }

  static async getMessageById(messageId: string, viewerId?: string): Promise<PPVMessage | null> {
    try {
      const { data: message, error } = await supabase
        .from('ppv_messages')
        .select(`
          *,
          creator:profiles!ppv_messages_creator_id_fkey(id, username, display_name, avatar_url),
          content:ppv_message_content(*),
          tags:ppv_message_tags(tag)
        `)
        .eq('id', messageId)
        .single();

      if (error) return null;

      // Check if viewer has purchased this message
      let hasPurchased = false;
      if (viewerId && viewerId !== message.creator_id) {
        const { data: purchase } = await supabase
          .from('ppv_purchases')
          .select('id')
          .eq('message_id', messageId)
          .eq('buyer_id', viewerId)
          .eq('status', 'completed')
          .single();

        hasPurchased = !!purchase;
      }

      return {
        id: message.id,
        creatorId: message.creator_id,
        title: message.title,
        description: message.description,
        price: message.price,
        content: message.content || [],
        thumbnailUrl: message.thumbnail_url,
        previewText: message.preview_text,
        isActive: message.is_active,
        expiresAt: message.expires_at,
        maxViews: message.max_views,
        currentViews: message.current_views,
        totalEarnings: message.total_earnings,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
        creator: message.creator,
        tags: message.tags?.map((t: any) => t.tag) || [],
      };
    } catch (error) {
      console.error('Failed to fetch PPV message:', error);
      return null;
    }
  }

  static async getMessages(filter: PPVMessageFilter = {}): Promise<PPVMessage[]> {
    try {
      let query = supabase
        .from('ppv_messages')
        .select(`
          *,
          creator:profiles!ppv_messages_creator_id_fkey(id, username, display_name, avatar_url),
          tags:ppv_message_tags(tag)
        `);

      // Apply filters
      if (filter.creatorId) {
        query = query.eq('creator_id', filter.creatorId);
      }

      if (filter.isActive !== undefined) {
        query = query.eq('is_active', filter.isActive);
      }

      if (filter.priceRange) {
        query = query
          .gte('price', filter.priceRange.min)
          .lte('price', filter.priceRange.max);
      }

      if (filter.hasExpiration !== undefined) {
        if (filter.hasExpiration) {
          query = query.not('expires_at', 'is', null);
        } else {
          query = query.is('expires_at', null);
        }
      }

      // Sorting
      switch (filter.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('current_views', { ascending: false });
          break;
        case 'earnings':
          query = query.order('total_earnings', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
      if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 50) - 1);
      }

      const { data: messages, error } = await query;

      if (error) throw error;

      return messages?.map(message => ({
        id: message.id,
        creatorId: message.creator_id,
        title: message.title,
        description: message.description,
        price: message.price,
        content: [], // Don't load content in list view for performance
        thumbnailUrl: message.thumbnail_url,
        previewText: message.preview_text,
        isActive: message.is_active,
        expiresAt: message.expires_at,
        maxViews: message.max_views,
        currentViews: message.current_views,
        totalEarnings: message.total_earnings,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
        creator: message.creator,
        tags: message.tags?.map((t: any) => t.tag) || [],
      })) || [];
    } catch (error) {
      console.error('Failed to fetch PPV messages:', error);
      return [];
    }
  }

  // ==================== PURCHASE MANAGEMENT ====================

  static async purchaseMessage(
    request: PPVPurchaseRequest, 
    buyerId: string
  ): Promise<PPVPurchase> {
    try {
      // Get message details
      const message = await this.getMessageById(request.messageId);
      if (!message || !message.isActive) {
        throw new Error('Message not found or inactive');
      }

      // Check if already purchased
      const existingPurchase = await this.getUserPurchase(request.messageId, buyerId);
      if (existingPurchase && existingPurchase.status === 'completed') {
        throw new Error('Message already purchased');
      }

      // Check expiration
      if (message.expiresAt && new Date(message.expiresAt) < new Date()) {
        throw new Error('Message has expired');
      }

      // Check view limits
      if (message.maxViews && message.currentViews >= message.maxViews) {
        throw new Error('Message view limit reached');
      }

      // Calculate final price (after promos, discounts, etc.)
      let finalPrice = message.price;
      
      if (request.usePromoCode) {
        const discount = await this.validatePromoCode(request.usePromoCode, request.messageId);
        if (discount.valid) {
          finalPrice = discount.discountedPrice;
        }
      }

      // Create purchase record
      const purchaseData = {
        message_id: request.messageId,
        buyer_id: buyerId,
        amount: finalPrice,
        payment_method: request.paymentMethod,
        status: 'pending',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: purchase, error: purchaseError } = await supabase
        .from('ppv_purchases')
        .insert(purchaseData)
        .select(`
          *,
          message:ppv_messages(*),
          buyer:profiles!ppv_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (purchaseError) throw purchaseError;

      // Process payment
      if (finalPrice > 0) {
        await this.processPayment(purchase.id, finalPrice, request.paymentMethod);
      }

      // Update purchase status to completed
      const { data: completedPurchase, error: updateError } = await supabase
        .from('ppv_purchases')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString() 
        })
        .eq('id', purchase.id)
        .select(`
          *,
          message:ppv_messages(*),
          buyer:profiles!ppv_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (updateError) throw updateError;

      // Update message earnings and stats
      await this.updateMessageEarnings(request.messageId, finalPrice);

      // Send notifications
      await this.sendPurchaseNotifications(completedPurchase);

      return completedPurchase;
    } catch (error) {
      console.error('Failed to purchase PPV message:', error);
      throw error;
    }
  }

  static async getUserPurchase(messageId: string, buyerId: string): Promise<PPVPurchase | null> {
    try {
      const { data: purchase, error } = await supabase
        .from('ppv_purchases')
        .select(`
          *,
          message:ppv_messages(*),
          buyer:profiles!ppv_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('message_id', messageId)
        .eq('buyer_id', buyerId)
        .single();

      if (error) return null;
      return purchase;
    } catch (error) {
      return null;
    }
  }

  static async getUserPurchases(buyerId: string, limit = 50): Promise<PPVPurchase[]> {
    try {
      const { data: purchases, error } = await supabase
        .from('ppv_purchases')
        .select(`
          *,
          message:ppv_messages!inner(*),
          buyer:profiles!ppv_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
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

  static async getCreatorStats(creatorId: string): Promise<PPVMessageStats> {
    try {
      // Get basic message stats
      const { data: messageStats, error: messageError } = await supabase
        .from('ppv_messages')
        .select('id, price, current_views, total_earnings')
        .eq('creator_id', creatorId);

      if (messageError) throw messageError;

      // Get purchase stats
      const { data: purchaseStats, error: purchaseError } = await supabase
        .from('ppv_purchases')
        .select(`
          amount,
          created_at,
          message:ppv_messages!inner(creator_id)
        `)
        .eq('message.creator_id', creatorId)
        .eq('status', 'completed');

      if (purchaseError) throw purchaseError;

      // Calculate statistics
      const totalMessages = messageStats?.length || 0;
      const totalEarnings = messageStats?.reduce((sum, msg) => sum + msg.total_earnings, 0) || 0;
      const totalViews = messageStats?.reduce((sum, msg) => sum + msg.current_views, 0) || 0;
      const totalBuyers = new Set(purchaseStats?.map(p => p.buyer_id)).size || 0;
      const averagePrice = totalMessages > 0 ? 
        messageStats.reduce((sum, msg) => sum + msg.price, 0) / totalMessages : 0;

      // Get recent purchases
      const recentPurchases = await this.getCreatorRecentPurchases(creatorId, 10);

      // Get top performing message
      const topMessage = messageStats?.sort((a, b) => b.total_earnings - a.total_earnings)[0];
      let topPerformingMessage = null;
      if (topMessage) {
        topPerformingMessage = await this.getMessageById(topMessage.id);
      }

      // Calculate monthly comparisons
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const thisMonthPurchases = purchaseStats?.filter(p => 
        new Date(p.created_at) >= thisMonthStart
      ) || [];

      const lastMonthPurchases = purchaseStats?.filter(p => {
        const date = new Date(p.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      }) || [];

      const earningsThisMonth = thisMonthPurchases.reduce((sum, p) => sum + p.amount, 0);
      const earningsLastMonth = lastMonthPurchases.reduce((sum, p) => sum + p.amount, 0);

      return {
        totalMessages,
        totalEarnings,
        totalViews,
        totalBuyers,
        averagePrice,
        conversionRate: totalViews > 0 ? (totalBuyers / totalViews) * 100 : 0,
        topPerformingMessage,
        recentPurchases,
        earningsThisMonth,
        earningsLastMonth,
        viewsThisMonth: 0, // Would need view tracking
        viewsLastMonth: 0,
      };
    } catch (error) {
      console.error('Failed to fetch creator stats:', error);
      throw error;
    }
  }

  static async getCreatorRecentPurchases(creatorId: string, limit = 10): Promise<PPVPurchase[]> {
    try {
      const { data: purchases, error } = await supabase
        .from('ppv_purchases')
        .select(`
          *,
          message:ppv_messages!inner(creator_id, title),
          buyer:profiles!ppv_purchases_buyer_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('message.creator_id', creatorId)
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

  // ==================== PAYMENT PROCESSING ====================

  private static async processPayment(
    purchaseId: string, 
    amount: number, 
    paymentMethod: string
  ): Promise<void> {
    try {
      switch (paymentMethod) {
        case 'stripe':
          await this.processStripePayment(purchaseId, amount);
          break;
        case 'wallet':
          await this.processWalletPayment(purchaseId, amount);
          break;
        case 'credits':
          await this.processCreditPayment(purchaseId, amount);
          break;
        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }
    } catch (error) {
      // Mark purchase as failed
      await supabase
        .from('ppv_purchases')
        .update({ status: 'failed' })
        .eq('id', purchaseId);
      throw error;
    }
  }

  private static async processStripePayment(purchaseId: string, amount: number): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('process-ppv-payment', {
        body: {
          purchaseId,
          amount,
          currency: 'usd',
          paymentMethod: 'stripe'
        }
      });

      if (error) throw error;

      // Update purchase with Stripe payment intent ID
      if (data?.paymentIntentId) {
        await supabase
          .from('ppv_purchases')
          .update({ stripe_payment_intent_id: data.paymentIntentId })
          .eq('id', purchaseId);
      }
    } catch (error) {
      console.error('Stripe payment failed:', error);
      throw error;
    }
  }

  private static async processWalletPayment(purchaseId: string, amount: number): Promise<void> {
    // Implementation would integrate with platform wallet system
    console.log('Wallet payment processing not implemented yet');
  }

  private static async processCreditPayment(purchaseId: string, amount: number): Promise<void> {
    // Implementation would integrate with platform credits system
    console.log('Credit payment processing not implemented yet');
  }

  // ==================== UTILITY METHODS ====================

  private static validateCreateRequest(request: PPVCreateRequest): { valid: boolean; error?: string } {
    if (!request.title || request.title.trim().length === 0) {
      return { valid: false, error: 'Title is required' };
    }

    if (request.price < 99 || request.price > 99999) {
      return { valid: false, error: 'Price must be between $0.99 and $999.99' };
    }

    if (request.content.length === 0) {
      return { valid: false, error: 'At least one content item is required' };
    }

    if (request.content.length > 10) {
      return { valid: false, error: 'Maximum 10 content items allowed' };
    }

    return { valid: true };
  }

  private static async updateMessageEarnings(messageId: string, amount: number): Promise<void> {
    try {
      const creatorEarnings = calculateCreatorEarnings(amount);
      
      await supabase
        .from('ppv_messages')
        .update({ 
          total_earnings: supabase.raw(`total_earnings + ${creatorEarnings}`),
          current_views: supabase.raw('current_views + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);
    } catch (error) {
      console.error('Failed to update message earnings:', error);
    }
  }

  private static async sendPurchaseNotifications(purchase: PPVPurchase): Promise<void> {
    // Implementation would send real-time notifications
    console.log('Purchase notifications not implemented yet');
  }

  private static async validatePromoCode(
    code: string, 
    messageId: string
  ): Promise<{ valid: boolean; discountedPrice: number }> {
    // Implementation would validate promo codes and calculate discounts
    return { valid: false, discountedPrice: 0 };
  }

  static formatPrice(priceInCents: number): string {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }
}