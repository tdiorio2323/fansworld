import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  is_archived: boolean;
  last_message_id?: string;
  last_message_at: string;
  message_count: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'moderator';
  joined_at: string;
  left_at?: string;
  is_muted: boolean;
  is_pinned: boolean;
  last_read_message_id?: string;
  last_read_at: string;
  unread_count: number;
  notification_settings: {
    all: boolean;
    mentions: boolean;
    paid: boolean;
  };
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    profiles: {
      display_name: string;
      avatar_url: string;
      is_verified: boolean;
    };
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'paid' | 'tip' | 'system';
  is_paid: boolean;
  price_cents: number;
  currency: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  is_edited: boolean;
  is_deleted: boolean;
  deleted_at?: string;
  reply_to_message_id?: string;
  system_message_type?: 'user_joined' | 'user_left' | 'conversation_created' | 'title_changed' | 'avatar_changed';
  metadata?: Record<string, unknown>;
  sent_at: string;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    email: string;
    profiles: {
      display_name: string;
      avatar_url: string;
      is_verified: boolean;
    };
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  read_receipts?: MessageReadReceipt[];
  reply_to?: Message;
  payment?: MessagePayment;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  storage_bucket: string;
  storage_path: string;
  upload_status: 'uploading' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface MessagePayment {
  id: string;
  message_id: string;
  payer_id: string;
  recipient_id: string;
  amount_cents: number;
  currency: string;
  stripe_payment_intent_id?: string;
  stripe_payment_method_id?: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  created_at: string;
  user?: {
    id: string;
    profiles: {
      display_name: string;
      avatar_url: string;
    };
  };
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
  user?: {
    id: string;
    profiles: {
      display_name: string;
      avatar_url: string;
    };
  };
}

export interface UserPresence {
  id: string;
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at: string;
  is_typing_in_conversation?: string;
  typing_started_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MessageReport {
  id: string;
  message_id: string;
  reported_by: string;
  reason: 'spam' | 'harassment' | 'inappropriate_content' | 'scam' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export class MessagingService {
  private static instance: MessagingService;
  private realtimeChannels: Map<string, RealtimeChannel> = new Map();

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          user:auth.users(
            id,
            email,
            profiles(display_name, avatar_url, is_verified)
          )
        ),
        last_message:messages(
          *,
          sender:auth.users(
            id,
            email,
            profiles(display_name, avatar_url, is_verified)
          )
        )
      `)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data as Conversation[];
  }

  /**
   * Get or create a direct conversation with another user
   */
  async getOrCreateDirectConversation(otherUserId: string): Promise<Conversation> {
    const { data, error } = await supabase.rpc('create_direct_conversation', {
      user1_id: (await supabase.auth.getUser()).data.user?.id,
      user2_id: otherUserId
    });

    if (error) throw error;

    // Fetch the full conversation data
    const conversation = await this.getConversation(data);
    return conversation;
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          *,
          user:auth.users(
            id,
            email,
            profiles(display_name, avatar_url, is_verified)
          )
        ),
        last_message:messages(
          *,
          sender:auth.users(
            id,
            email,
            profiles(display_name, avatar_url, is_verified)
          )
        )
      `)
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    return data as Conversation;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    limit = 50,
    offset = 0
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:auth.users(
          id,
          email,
          profiles(display_name, avatar_url, is_verified)
        ),
        attachments:message_attachments(*),
        reactions:message_reactions(
          *,
          user:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        read_receipts:message_read_receipts(
          *,
          user:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        reply_to:messages(
          *,
          sender:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        payment:message_payments(*)
      `)
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data as Message[]).reverse(); // Reverse to show oldest first
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: Message['message_type'] = 'text',
    replyToMessageId?: string,
    isPaid = false,
    priceCents = 0
  ): Promise<Message> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('send_message', {
      p_conversation_id: conversationId,
      p_sender_id: user.id,
      p_content: content,
      p_message_type: messageType,
      p_reply_to: replyToMessageId,
      p_is_paid: isPaid,
      p_price_cents: priceCents
    });

    if (error) throw error;

    // Fetch the full message data
    const message = await this.getMessage(data);
    return message;
  }

  /**
   * Get a specific message
   */
  async getMessage(messageId: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:auth.users(
          id,
          email,
          profiles(display_name, avatar_url, is_verified)
        ),
        attachments:message_attachments(*),
        reactions:message_reactions(
          *,
          user:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        read_receipts:message_read_receipts(
          *,
          user:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        reply_to:messages(
          *,
          sender:auth.users(
            id,
            profiles(display_name, avatar_url)
          )
        ),
        payment:message_payments(*)
      `)
      .eq('id', messageId)
      .single();

    if (error) throw error;
    return data as Message;
  }

  /**
   * Edit a message
   */
  async editMessage(messageId: string, newContent: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        is_edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) throw error;
  }

  /**
   * Add reaction to a message
   */
  async addReaction(
    messageId: string,
    reactionType: MessageReaction['reaction_type']
  ): Promise<MessageReaction> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.id,
        reaction_type: reactionType
      })
      .select(`
        *,
        user:auth.users(
          id,
          profiles(display_name, avatar_url)
        )
      `)
      .single();

    if (error) throw error;
    return data as MessageReaction;
  }

  /**
   * Remove reaction from a message
   */
  async removeReaction(
    messageId: string,
    reactionType: MessageReaction['reaction_type']
  ): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType);

    if (error) throw error;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(
    conversationId: string,
    upToMessageId?: string
  ): Promise<number> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('mark_messages_as_read', {
      p_conversation_id: conversationId,
      p_user_id: user.id,
      p_up_to_message_id: upToMessageId
    });

    if (error) throw error;
    return data as number;
  }

  /**
   * Update user presence
   */
  async updatePresence(
    status: UserPresence['status'],
    typingInConversation?: string
  ): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('update_user_presence', {
      p_user_id: user.id,
      p_status: status,
      p_typing_conversation_id: typingInConversation
    });

    if (error) throw error;
  }

  /**
   * Get user presence
   */
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserPresence | null;
  }

  /**
   * Upload file attachment
   */
  async uploadAttachment(
    messageId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<MessageAttachment> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${messageId}-${Date.now()}.${fileExt}`;
    const filePath = `message-attachments/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('message-attachments')
      .upload(filePath, file, {
        onUploadProgress: (progress) => {
          if (onProgress) {
            onProgress((progress.loaded / progress.total) * 100);
          }
        }
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('message-attachments')
      .getPublicUrl(filePath);

    // Create attachment record
    const { data, error } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: urlData.publicUrl,
        storage_bucket: 'message-attachments',
        storage_path: filePath,
        upload_status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;
    return data as MessageAttachment;
  }

  /**
   * Subscribe to real-time updates for a conversation
   */
  subscribeToConversation(
    conversationId: string,
    callbacks: {
      onMessageReceived?: (message: Message) => void;
      onMessageUpdated?: (message: Message) => void;
      onMessageDeleted?: (messageId: string) => void;
      onTypingUpdate?: (userId: string, isTyping: boolean) => void;
      onPresenceUpdate?: (presence: UserPresence) => void;
    }
  ): () => void {
    const channelName = `conversation:${conversationId}`;
    
    // Remove existing channel if it exists
    if (this.realtimeChannels.has(channelName)) {
      this.realtimeChannels.get(channelName)?.unsubscribe();
      this.realtimeChannels.delete(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (callbacks.onMessageReceived) {
            callbacks.onMessageReceived(payload.new as Message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (callbacks.onMessageUpdated) {
            callbacks.onMessageUpdated(payload.new as Message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          if (callbacks.onMessageDeleted) {
            callbacks.onMessageDeleted(payload.old.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        (payload) => {
          if (callbacks.onPresenceUpdate) {
            callbacks.onPresenceUpdate(payload.new as UserPresence);
          }
        }
      )
      .subscribe();

    this.realtimeChannels.set(channelName, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.realtimeChannels.delete(channelName);
    };
  }

  /**
   * Subscribe to all conversations for the current user
   */
  subscribeToAllConversations(
    callbacks: {
      onConversationUpdated?: (conversation: Conversation) => void;
      onNewMessage?: (message: Message) => void;
    }
  ): () => void {
    const channelName = 'user-conversations';
    
    // Remove existing channel if it exists
    if (this.realtimeChannels.has(channelName)) {
      this.realtimeChannels.get(channelName)?.unsubscribe();
      this.realtimeChannels.delete(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          if (callbacks.onConversationUpdated) {
            callbacks.onConversationUpdated(payload.new as Conversation);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (callbacks.onNewMessage) {
            callbacks.onNewMessage(payload.new as Message);
          }
        }
      )
      .subscribe();

    this.realtimeChannels.set(channelName, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.realtimeChannels.delete(channelName);
    };
  }

  /**
   * Report a message
   */
  async reportMessage(
    messageId: string,
    reason: MessageReport['reason'],
    description?: string
  ): Promise<MessageReport> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('message_reports')
      .insert({
        message_id: messageId,
        reported_by: user.id,
        reason,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data as MessageReport;
  }

  /**
   * Search messages
   */
  async searchMessages(
    query: string,
    conversationId?: string,
    limit = 20
  ): Promise<Message[]> {
    let queryBuilder = supabase
      .from('messages')
      .select(`
        *,
        sender:auth.users(
          id,
          email,
          profiles(display_name, avatar_url, is_verified)
        ),
        attachments:message_attachments(*)
      `)
      .textSearch('content', query)
      .eq('is_deleted', false)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (conversationId) {
      queryBuilder = queryBuilder.eq('conversation_id', conversationId);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data as Message[];
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<number> {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select('unread_count')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    return data.reduce((total, participant) => total + participant.unread_count, 0);
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.realtimeChannels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.realtimeChannels.clear();
  }
}

export const messagingService = MessagingService.getInstance();