// 💌 CUSTOM CONTENT REQUESTS - SERVICE LAYER

import { supabase } from '@/integrations/supabase/client';
import {
  ContentRequest,
  RequestTemplate,
  RequestOffer,
  RequestCreateRequest,
  RequestUpdateRequest,
  TemplateCreateRequest,
  RequestFilter,
  RequestStats,
  RequestAnalytics,
  DeliveredContent,
  RequestMessage,
  RewardRedemption
} from '../types';
import { 
  calculateRequestPrice, 
  calculatePlatformFee, 
  calculateCreatorEarnings,
  getRequestTypeInfo,
  DEFAULT_REQUEST_CONFIG
} from '../config';

export class RequestsService {
  // ==================== REQUEST CRUD OPERATIONS ====================
  
  static async createRequest(data: RequestCreateRequest, requesterId: string): Promise<ContentRequest> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user || user.id !== requesterId) {
        throw new Error('Not authenticated or invalid requester ID');
      }

      // Calculate final price with priority adjustments
      const basePrice = data.budget;
      const finalPrice = calculateRequestPrice(basePrice, data.priority);
      const platformFee = calculatePlatformFee(finalPrice);
      const creatorEarnings = calculateCreatorEarnings(finalPrice);

      // Get estimated delivery based on request type and priority
      const typeInfo = getRequestTypeInfo(data.type);
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + typeInfo.estimatedDelivery);

      const requestData = {
        requester_id: requesterId,
        creator_id: data.creatorId,
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        specifications: data.specifications,
        duration: data.duration,
        deliverables: data.deliverables,
        budget: basePrice,
        final_price: finalPrice,
        is_premium: finalPrice > 5000, // $50+ is premium
        payment_status: 'pending',
        deadline: data.deadline,
        preferred_completion_time: data.preferredCompletionTime,
        is_private: data.isPrivate,
        allow_creator_sharing: data.allowCreatorSharing,
        is_anonymous: data.isAnonymous,
        status: 'submitted',
        priority: data.priority,
        allow_messages: data.allowMessages,
        estimated_delivery: estimatedDelivery.toISOString(),
        platform_fee: platformFee,
        creator_earnings: creatorEarnings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: request, error } = await supabase
        .from('content_requests')
        .insert(requestData)
        .select(`
          *,
          requester:profiles!content_requests_requester_id_fkey(id, username, display_name, avatar_url),
          creator:profiles!content_requests_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `)
        .single();

      if (error) throw error;

      // Send notification to creator
      await this.sendRequestNotification(request.id, 'REQUEST_SUBMITTED');

      return this.mapRequestFromDB(request);
    } catch (error) {
      console.error('Failed to create request:', error);
      throw error;
    }
  }

  static async getRequest(id: string): Promise<ContentRequest | null> {
    try {
      const { data, error } = await supabase
        .from('content_requests')
        .select(`
          *,
          requester:profiles!content_requests_requester_id_fkey(id, username, display_name, avatar_url),
          creator:profiles!content_requests_creator_id_fkey(id, username, display_name, avatar_url, is_verified),
          delivered_content,
          message_thread:request_messages(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return this.mapRequestFromDB(data);
    } catch (error) {
      console.error('Failed to fetch request:', error);
      return null;
    }
  }

  static async getRequests(filter: RequestFilter = {}): Promise<ContentRequest[]> {
    try {
      let query = supabase
        .from('content_requests')
        .select(`
          *,
          requester:profiles!content_requests_requester_id_fkey(id, username, display_name, avatar_url),
          creator:profiles!content_requests_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `);

      // Apply filters
      if (filter.creatorId) {
        query = query.eq('creator_id', filter.creatorId);
      }

      if (filter.requesterId) {
        query = query.eq('requester_id', filter.requesterId);
      }

      if (filter.status && filter.status.length > 0) {
        query = query.in('status', filter.status);
      }

      if (filter.type) {
        query = query.eq('type', filter.type);
      }

      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.priority) {
        query = query.eq('priority', filter.priority);
      }

      if (filter.isPremium !== undefined) {
        query = query.eq('is_premium', filter.isPremium);
      }

      if (filter.priceRange) {
        query = query.gte('final_price', filter.priceRange.min);
        query = query.lte('final_price', filter.priceRange.max);
      }

      if (filter.hasDeadline !== undefined) {
        if (filter.hasDeadline) {
          query = query.not('deadline', 'is', null);
        } else {
          query = query.is('deadline', null);
        }
      }

      // Apply sorting
      switch (filter.sortBy) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'price_high':
          query = query.order('final_price', { ascending: false });
          break;
        case 'price_low':
          query = query.order('final_price', { ascending: true });
          break;
        case 'deadline':
          query = query.order('deadline', { ascending: true, nullsLast: true });
          break;
        case 'priority':
          query = query.order('priority', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
      if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 20) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(this.mapRequestFromDB);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      return [];
    }
  }

  static async updateRequest(id: string, data: RequestUpdateRequest, userId: string): Promise<ContentRequest> {
    try {
      // Verify user owns the request or is the creator
      const request = await this.getRequest(id);
      if (!request || (request.requesterId !== userId && request.creatorId !== userId)) {
        throw new Error('Not authorized to update this request');
      }

      const updateData: any = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      // Handle creator-specific updates
      if (request.creatorId === userId) {
        // Creator can update status, quote, response, etc.
        if (data.status) {
          updateData.status = data.status;
          
          // Update timestamps based on status
          if (data.status === 'accepted') {
            updateData.accepted_at = new Date().toISOString();
          } else if (data.status === 'in_progress') {
            updateData.started_at = new Date().toISOString();
          } else if (data.status === 'completed') {
            updateData.completed_at = new Date().toISOString();
          } else if (data.status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
          }
        }
      }

      const { data: updatedRequest, error } = await supabase
        .from('content_requests')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          requester:profiles!content_requests_requester_id_fkey(id, username, display_name, avatar_url),
          creator:profiles!content_requests_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `)
        .single();

      if (error) throw error;

      // Send notification for status changes
      if (data.status) {
        await this.sendRequestNotification(id, `REQUEST_${data.status.toUpperCase()}` as any);
      }

      return this.mapRequestFromDB(updatedRequest);
    } catch (error) {
      console.error('Failed to update request:', error);
      throw error;
    }
  }

  static async deleteRequest(id: string, userId: string): Promise<void> {
    try {
      // Verify user owns the request
      const request = await this.getRequest(id);
      if (!request || request.requesterId !== userId) {
        throw new Error('Not authorized to delete this request');
      }

      // Can only delete draft or submitted requests
      if (!['draft', 'submitted'].includes(request.status)) {
        throw new Error('Cannot delete request in current status');
      }

      const { error } = await supabase
        .from('content_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete request:', error);
      throw error;
    }
  }

  // ==================== REQUEST OFFERS ====================
  
  static async createOffer(requestId: string, creatorId: string, offer: any): Promise<RequestOffer> {
    try {
      const offerData = {
        request_id: requestId,
        creator_id: creatorId,
        price: offer.price,
        delivery_time: offer.deliveryTime,
        message: offer.message,
        revisions: offer.revisions,
        rush_delivery: offer.rushDelivery || null,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('request_offers')
        .insert(offerData)
        .select(`
          *,
          creator:profiles!request_offers_creator_id_fkey(id, username, display_name, avatar_url, is_verified)
        `)
        .single();

      if (error) throw error;

      // Send notification to requester
      await this.sendRequestNotification(requestId, 'OFFER_RECEIVED');

      return this.mapOfferFromDB(data);
    } catch (error) {
      console.error('Failed to create offer:', error);
      throw error;
    }
  }

  // ==================== REQUEST MESSAGES ====================
  
  static async sendMessage(requestId: string, senderId: string, content: string, attachmentUrl?: string): Promise<RequestMessage> {
    try {
      // Verify user is involved in the request
      const request = await this.getRequest(requestId);
      if (!request || (request.requesterId !== senderId && request.creatorId !== senderId)) {
        throw new Error('Not authorized to message on this request');
      }

      const messageData = {
        request_id: requestId,
        sender_id: senderId,
        content,
        attachment_url: attachmentUrl,
        is_from_creator: request.creatorId === senderId,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('request_messages')
        .insert(messageData)
        .select(`
          *,
          sender:profiles!request_messages_sender_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Send real-time notification
      await this.sendMessageNotification(requestId, this.mapMessageFromDB(data));

      return this.mapMessageFromDB(data);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // ==================== CONTENT DELIVERY ====================
  
  static async deliverContent(requestId: string, creatorId: string, content: DeliveredContent[]): Promise<void> {
    try {
      // Verify creator owns the request
      const request = await this.getRequest(requestId);
      if (!request || request.creatorId !== creatorId) {
        throw new Error('Not authorized to deliver content for this request');
      }

      if (request.status !== 'completed') {
        throw new Error('Request must be completed before delivering content');
      }

      const { error } = await supabase
        .from('content_requests')
        .update({
          delivered_content: content,
          status: 'delivered',
          delivered_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Send notification to requester
      await this.sendRequestNotification(requestId, 'REQUEST_DELIVERED');
    } catch (error) {
      console.error('Failed to deliver content:', error);
      throw error;
    }
  }

  // ==================== PAYMENT PROCESSING ====================
  
  static async processPayment(requestId: string, paymentMethodId: string): Promise<void> {
    try {
      const request = await this.getRequest(requestId);
      if (!request) throw new Error('Request not found');

      // Create payment intent via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('process-request-payment', {
        body: {
          requestId,
          amount: request.finalPrice || request.budget,
          paymentMethodId,
          creatorId: request.creatorId,
          platformFee: request.finalPrice ? calculatePlatformFee(request.finalPrice) : 0,
        }
      });

      if (error) throw error;

      // Update request with payment information
      await supabase
        .from('content_requests')
        .update({
          payment_status: 'escrowed',
          stripe_payment_intent_id: data.paymentIntentId,
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      // Send notification to creator
      await this.sendRequestNotification(requestId, 'REQUEST_ACCEPTED');
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  // ==================== TEMPLATES ====================
  
  static async createTemplate(creatorId: string, data: TemplateCreateRequest): Promise<RequestTemplate> {
    try {
      const templateData = {
        creator_id: creatorId,
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        base_price: data.basePrice,
        specifications: data.specifications,
        estimated_delivery_days: data.estimatedDeliveryDays,
        max_revisions: data.maxRevisions,
        allow_customizations: data.allowCustomizations,
        requires_approval: data.requiresApproval,
        is_active: true,
        order_count: 0,
        average_rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: template, error } = await supabase
        .from('request_templates')
        .insert(templateData)
        .select(`
          *,
          creator:profiles!request_templates_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return this.mapTemplateFromDB(template);
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  }

  static async getCreatorTemplates(creatorId: string): Promise<RequestTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('request_templates')
        .select(`
          *,
          creator:profiles!request_templates_creator_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .order('order_count', { ascending: false });

      if (error) throw error;
      return data.map(this.mapTemplateFromDB);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  }

  // ==================== ANALYTICS ====================
  
  static async getRequestStats(creatorId: string): Promise<RequestStats> {
    try {
      const { data: stats, error } = await supabase
        .from('request_stats_view')
        .select('*')
        .eq('creator_id', creatorId)
        .single();

      if (error) throw error;

      return {
        totalRequests: stats.total_requests,
        activeRequests: stats.active_requests,
        completedRequests: stats.completed_requests,
        totalRevenue: stats.total_revenue,
        averageOrderValue: stats.average_order_value,
        completionRate: stats.completion_rate,
        averageDeliveryTime: stats.average_delivery_time,
        averageRating: stats.average_rating,
        repeatCustomerRate: stats.repeat_customer_rate,
        pendingEarnings: stats.pending_earnings,
        monthlyRevenue: stats.monthly_revenue,
        topEarningCategory: stats.top_earning_category,
        responseTime: stats.response_time,
        acceptanceRate: stats.acceptance_rate,
        requestsByType: stats.requests_by_type || {},
        requestsByCategory: stats.requests_by_category || {},
        revenueByMonth: stats.revenue_by_month || [],
        topRequestersBySpent: stats.top_requesters_by_spent || [],
      };
    } catch (error) {
      console.error('Failed to fetch request stats:', error);
      return {
        totalRequests: 0,
        activeRequests: 0,
        completedRequests: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        completionRate: 0,
        averageDeliveryTime: 0,
        averageRating: 0,
        repeatCustomerRate: 0,
        pendingEarnings: 0,
        monthlyRevenue: 0,
        topEarningCategory: '',
        responseTime: 0,
        acceptanceRate: 0,
        requestsByType: {},
        requestsByCategory: {},
        revenueByMonth: [],
        topRequestersBySpent: [],
      };
    }
  }

  // ==================== NOTIFICATIONS ====================
  
  private static async sendRequestNotification(requestId: string, type: string): Promise<void> {
    try {
      const channel = supabase.channel('request-notifications');
      
      await channel.send({
        type: 'broadcast',
        event: 'request-update',
        payload: {
          type,
          requestId,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Failed to send request notification:', error);
    }
  }

  private static async sendMessageNotification(requestId: string, message: RequestMessage): Promise<void> {
    try {
      const channel = supabase.channel('request-messages');
      
      await channel.send({
        type: 'broadcast',
        event: 'new-message',
        payload: {
          type: 'REQUEST_MESSAGE',
          requestId,
          message,
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Failed to send message notification:', error);
    }
  }

  // ==================== UTILITY METHODS ====================
  
  private static mapRequestFromDB(data: any): ContentRequest {
    return {
      id: data.id,
      requesterId: data.requester_id,
      creatorId: data.creator_id,
      title: data.title,
      description: data.description,
      type: data.type,
      category: data.category,
      specifications: data.specifications || [],
      duration: data.duration,
      deliverables: data.deliverables || [],
      budget: data.budget,
      finalPrice: data.final_price,
      isPremium: data.is_premium,
      paymentStatus: data.payment_status,
      stripePaymentIntentId: data.stripe_payment_intent_id,
      deadline: data.deadline,
      preferredCompletionTime: data.preferred_completion_time,
      estimatedDelivery: data.estimated_delivery,
      isPrivate: data.is_private,
      allowCreatorSharing: data.allow_creator_sharing,
      isAnonymous: data.is_anonymous,
      status: data.status,
      priority: data.priority,
      creatorResponse: data.creator_response,
      creatorQuote: data.creator_quote,
      creatorDeadline: data.creator_deadline,
      acceptedAt: data.accepted_at,
      startedAt: data.started_at,
      completedAt: data.completed_at,
      deliveredAt: data.delivered_at,
      deliveredContent: data.delivered_content || [],
      allowMessages: data.allow_messages,
      requesterRating: data.requester_rating,
      requesterReview: data.requester_review,
      creatorRating: data.creator_rating,
      creatorReview: data.creator_review,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      requester: data.requester ? {
        id: data.requester.id,
        username: data.requester.username,
        displayName: data.requester.display_name,
        avatarUrl: data.requester.avatar_url,
      } : undefined,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
        isVerified: data.creator.is_verified,
      } : undefined,
      messageThread: data.message_thread?.map(this.mapMessageFromDB) || [],
    };
  }

  private static mapOfferFromDB(data: any): RequestOffer {
    return {
      id: data.id,
      requestId: data.request_id,
      creatorId: data.creator_id,
      price: data.price,
      deliveryTime: data.delivery_time,
      message: data.message,
      revisions: data.revisions,
      rushDelivery: data.rush_delivery,
      status: data.status,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      creator: data.creator ? {
        id: data.creator.id,
        username: data.creator.username,
        displayName: data.creator.display_name,
        avatarUrl: data.creator.avatar_url,
        isVerified: data.creator.is_verified,
      } : undefined,
    };
  }

  private static mapMessageFromDB(data: any): RequestMessage {
    return {
      id: data.id,
      requestId: data.request_id,
      senderId: data.sender_id,
      content: data.content,
      attachmentUrl: data.attachment_url,
      isFromCreator: data.is_from_creator,
      createdAt: data.created_at,
      sender: data.sender ? {
        id: data.sender.id,
        username: data.sender.username,
        displayName: data.sender.display_name,
        avatarUrl: data.sender.avatar_url,
      } : undefined,
    };
  }

  private static mapTemplateFromDB(data: any): RequestTemplate {
    return {
      id: data.id,
      creatorId: data.creator_id,
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category,
      basePrice: data.base_price,
      specifications: data.specifications || [],
      estimatedDeliveryDays: data.estimated_delivery_days,
      maxRevisions: data.max_revisions,
      allowCustomizations: data.allow_customizations,
      requiresApproval: data.requires_approval,
      isActive: data.is_active,
      orderCount: data.order_count,
      averageRating: data.average_rating,
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
}