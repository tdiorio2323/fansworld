// 🎁 VIRTUAL GIFTS - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import type { 
  VirtualGift, 
  GiftTransaction, 
  GiftStats, 
  GiftSendRequest,
  GiftCatalogCategory 
} from '../types';
import { DEFAULT_GIFT_CATALOG } from '../config';

export class VirtualGiftsService {
  // ==================== GIFT CATALOG METHODS ====================
  
  static async getAllGifts(): Promise<VirtualGift[]> {
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) {
        console.warn('Failed to fetch gifts from database, using default catalog:', error);
        return DEFAULT_GIFT_CATALOG;
      }
      
      return data || DEFAULT_GIFT_CATALOG;
    } catch (error) {
      console.warn('Database error, using default catalog:', error);
      return DEFAULT_GIFT_CATALOG;
    }
  }

  static async getGiftsByCategory(category: VirtualGift['category']): Promise<VirtualGift[]> {
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to fetch gifts by category:', error);
      return DEFAULT_GIFT_CATALOG.filter(gift => gift.category === category);
    }
  }

  static async getGiftById(giftId: string): Promise<VirtualGift | null> {
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .eq('id', giftId)
        .eq('is_active', true)
        .single();
      
      if (error) {
        // Fallback to default catalog
        const defaultGift = DEFAULT_GIFT_CATALOG.find(g => g.id === giftId);
        return defaultGift || null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch gift by ID:', error);
      return DEFAULT_GIFT_CATALOG.find(g => g.id === giftId) || null;
    }
  }

  static async getCatalogByCategories(): Promise<GiftCatalogCategory[]> {
    try {
      const gifts = await this.getAllGifts();
      const categories = new Map<string, VirtualGift[]>();
      
      gifts.forEach(gift => {
        if (!categories.has(gift.category)) {
          categories.set(gift.category, []);
        }
        categories.get(gift.category)!.push(gift);
      });
      
      return Array.from(categories.entries()).map(([categoryName, gifts]) => ({
        id: categoryName,
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        emoji: this.getCategoryEmoji(categoryName as VirtualGift['category']),
        gifts: gifts.sort((a, b) => a.price - b.price),
      }));
    } catch (error) {
      console.error('Failed to organize catalog by categories:', error);
      return [];
    }
  }

  // ==================== GIFT TRANSACTION METHODS ====================
  
  static async sendGift(request: GiftSendRequest, senderId: string): Promise<GiftTransaction> {
    try {
      // Validate gift exists and is active
      const gift = await this.getGiftById(request.giftId);
      if (!gift) {
        throw new Error('Gift not found or inactive');
      }

      // Calculate total amount
      const totalAmount = gift.price * request.quantity;

      // Create transaction record
      const transactionData = {
        gift_id: request.giftId,
        sender_id: senderId,
        recipient_id: request.recipientId,
        amount: totalAmount,
        quantity: request.quantity,
        message: request.message || null,
        is_anonymous: request.isAnonymous,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: transaction, error } = await supabase
        .from('gift_transactions')
        .insert(transactionData)
        .select(`
          *,
          gift:virtual_gifts(*),
          sender:profiles!gift_transactions_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!gift_transactions_recipient_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Process payment if amount > 0
      if (totalAmount > 0) {
        await this.processGiftPayment(transaction.id, totalAmount);
      }

      // Update transaction status to completed
      const { data: completedTransaction, error: updateError } = await supabase
        .from('gift_transactions')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', transaction.id)
        .select(`
          *,
          gift:virtual_gifts(*),
          sender:profiles!gift_transactions_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!gift_transactions_recipient_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (updateError) throw updateError;

      // Send real-time notification
      await this.sendGiftNotification(completedTransaction);

      return completedTransaction;
    } catch (error) {
      console.error('Failed to send gift:', error);
      throw error;
    }
  }

  static async getUserGiftTransactions(
    userId: string, 
    type: 'sent' | 'received' | 'all' = 'all',
    limit = 50
  ): Promise<GiftTransaction[]> {
    try {
      let query = supabase
        .from('gift_transactions')
        .select(`
          *,
          gift:virtual_gifts(*),
          sender:profiles!gift_transactions_sender_id_fkey(id, username, display_name, avatar_url),
          recipient:profiles!gift_transactions_recipient_id_fkey(id, username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type === 'sent') {
        query = query.eq('sender_id', userId);
      } else if (type === 'received') {
        query = query.eq('recipient_id', userId);
      } else {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch gift transactions:', error);
      return [];
    }
  }

  // ==================== GIFT STATISTICS METHODS ====================
  
  static async getUserGiftStats(userId: string): Promise<GiftStats> {
    try {
      // Get sent gifts stats
      const { data: sentStats, error: sentError } = await supabase
        .from('gift_transactions')
        .select('amount, quantity')
        .eq('sender_id', userId)
        .eq('status', 'completed');

      if (sentError) throw sentError;

      // Get received gifts stats
      const { data: receivedStats, error: receivedError } = await supabase
        .from('gift_transactions')
        .select('amount, quantity, sender_id, sender:profiles!gift_transactions_sender_id_fkey(id, username)')
        .eq('recipient_id', userId)
        .eq('status', 'completed');

      if (receivedError) throw receivedError;

      // Calculate totals
      const totalSent = sentStats?.reduce((sum, t) => sum + t.quantity, 0) || 0;
      const totalReceived = receivedStats?.reduce((sum, t) => sum + t.quantity, 0) || 0;
      const totalSpent = sentStats?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalEarnings = receivedStats?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Find top sender
      const senderCounts = new Map<string, { count: number, amount: number, sender: any }>();
      receivedStats?.forEach(transaction => {
        const senderId = transaction.sender_id;
        if (!senderCounts.has(senderId)) {
          senderCounts.set(senderId, { 
            count: 0, 
            amount: 0, 
            sender: transaction.sender 
          });
        }
        const current = senderCounts.get(senderId)!;
        current.count += transaction.quantity;
        current.amount += transaction.amount;
      });

      const topSenderEntry = Array.from(senderCounts.entries())
        .sort(([,a], [,b]) => b.amount - a.amount)[0];

      const topSender = topSenderEntry ? {
        id: topSenderEntry[0],
        username: topSenderEntry[1].sender.username,
        totalSent: topSenderEntry[1].count,
      } : undefined;

      // Get recent gifts
      const recentGifts = await this.getUserGiftTransactions(userId, 'received', 10);

      // Get favorite gift (most received)
      const { data: favoriteGiftData } = await supabase
        .from('gift_transactions')
        .select(`
          gift_id,
          gift:virtual_gifts(*),
          quantity
        `)
        .eq('recipient_id', userId)
        .eq('status', 'completed');

      const giftCounts = new Map<string, { count: number, gift: VirtualGift }>();
      favoriteGiftData?.forEach(transaction => {
        const giftId = transaction.gift_id;
        if (!giftCounts.has(giftId)) {
          giftCounts.set(giftId, { count: 0, gift: transaction.gift });
        }
        giftCounts.get(giftId)!.count += transaction.quantity;
      });

      const favoriteGiftEntry = Array.from(giftCounts.entries())
        .sort(([,a], [,b]) => b.count - a.count)[0];

      const favoriteGift = favoriteGiftEntry ? favoriteGiftEntry[1].gift : undefined;

      return {
        totalReceived,
        totalSent,
        totalEarnings,
        totalSpent,
        favoriteGift,
        topSender,
        recentGifts,
      };
    } catch (error) {
      console.error('Failed to fetch gift stats:', error);
      return {
        totalReceived: 0,
        totalSent: 0,
        totalEarnings: 0,
        totalSpent: 0,
        recentGifts: [],
      };
    }
  }

  // ==================== PAYMENT PROCESSING ====================
  
  private static async processGiftPayment(transactionId: string, amount: number): Promise<void> {
    try {
      // Call Stripe payment processing via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('process-gift-payment', {
        body: {
          transactionId,
          amount,
          currency: 'usd'
        }
      });

      if (error) throw error;
      
      // Update transaction with Stripe payment intent ID
      if (data?.paymentIntentId) {
        await supabase
          .from('gift_transactions')
          .update({ stripe_payment_intent_id: data.paymentIntentId })
          .eq('id', transactionId);
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      
      // Mark transaction as failed
      await supabase
        .from('gift_transactions')
        .update({ 
          status: 'failed', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', transactionId);
      
      throw error;
    }
  }

  // ==================== REAL-TIME NOTIFICATIONS ====================
  
  private static async sendGiftNotification(transaction: GiftTransaction): Promise<void> {
    try {
      // Send real-time notification via Supabase channels
      const channel = supabase.channel('gift-notifications');
      
      await channel.send({
        type: 'broadcast',
        event: 'gift-received',
        payload: {
          type: 'GIFT_RECEIVED',
          transaction,
          timestamp: new Date().toISOString(),
        }
      });

      // Also send to sender for confirmation
      await channel.send({
        type: 'broadcast',
        event: 'gift-sent',
        payload: {
          type: 'GIFT_SENT',
          transaction,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Failed to send gift notification:', error);
    }
  }

  // ==================== UTILITY METHODS ====================
  
  private static getCategoryEmoji(category: VirtualGift['category']): string {
    const emojiMap = {
      hearts: '💕',
      stars: '✨',
      luxury: '💎',
      seasonal: '🌸',
      custom: '🎨',
    };
    
    return emojiMap[category] || '🎁';
  }

  static formatPrice(priceInCents: number): string {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  static async validateGiftSend(
    request: GiftSendRequest, 
    senderId: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check if sender and recipient are different
      if (senderId === request.recipientId) {
        return { valid: false, error: 'Cannot send gifts to yourself' };
      }

      // Validate gift exists
      const gift = await this.getGiftById(request.giftId);
      if (!gift) {
        return { valid: false, error: 'Gift not found' };
      }

      // Validate quantity
      if (request.quantity <= 0 || request.quantity > 99) {
        return { valid: false, error: 'Invalid quantity (1-99)' };
      }

      // Check daily spending limit (optional - could be implemented)
      const totalAmount = gift.price * request.quantity;
      if (totalAmount > 100000) { // $1000 max per transaction
        return { valid: false, error: 'Transaction amount too high' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Validation failed' };
    }
  }
}