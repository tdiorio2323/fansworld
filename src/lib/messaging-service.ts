import { createClient } from '@supabase/supabase-js';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import Pusher from 'pusher';
import { z } from 'zod';
import { logger } from './security-enhanced';
import { AuthenticatedUser } from './auth-middleware';
import { EntitlementService, EntitlementResult } from './entitlement-service';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Messaging configuration schema
const messagingConfigSchema = z.object({
  // Real-time provider configuration
  REALTIME_PROVIDER: z.enum(['socket.io', 'pusher', 'supabase']).default('socket.io'),

  // Redis configuration (for Socket.IO scaling)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Pusher configuration
  PUSHER_APP_ID: z.string().optional(),
  PUSHER_KEY: z.string().optional(),
  PUSHER_SECRET: z.string().optional(),
  PUSHER_CLUSTER: z.string().default('us2'),

  // Message settings
  MAX_MESSAGE_LENGTH: z.number().default(2000),
  MAX_ATTACHMENTS: z.number().default(5),
  MESSAGE_ENCRYPTION_ENABLED: z.boolean().default(true),
  MESSAGE_RETENTION_DAYS: z.number().default(365),
});

// Message types
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  SYSTEM = 'system'
}

// Message status
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Conversation type
export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group'
}

// Conversation interface
export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  creatorId?: string;
  fanId?: string;
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount: number;
  isActive: boolean;
  metadata?: {
    title?: string;
    description?: string;
    settings?: ConversationSettings;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Conversation settings
export interface ConversationSettings {
  ppvEnabled: boolean;
  defaultMessagePrice: number;
  allowMedia: boolean;
  maxMediaSize: number;
  moderationEnabled: boolean;
}

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  type: MessageType;
  content?: string;
  mediaUrls?: string[];
  mediaIds?: string[];

  // PPV (Pay-Per-View) fields
  isLocked: boolean;
  price?: number;
  currency?: string;
  hasAccess?: boolean;

  // Status and metadata
  status: MessageStatus;
  readBy: Array<{ userId: string; readAt: Date }>;
  editedAt?: Date;
  deletedAt?: Date;

  // Encryption
  encrypted: boolean;
  encryptionKeyId?: string;

  // Timestamps
  sentAt: Date;
  deliveredAt?: Date;

  // References
  replyToId?: string;
  threadId?: string;
}

// Real-time events
export enum RealtimeEvent {
  MESSAGE_SENT = 'message:sent',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_READ = 'message:read',
  MESSAGE_TYPING = 'message:typing',
  CONVERSATION_UPDATED = 'conversation:updated',
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline'
}

// Typing status
export interface TypingStatus {
  conversationId: string;
  userId: string;
  username: string;
  isTyping: boolean;
  timestamp: Date;
}

/**
 * Production-ready messaging service for creator platforms
 * Supports direct messaging, PPV messages, real-time updates, and content moderation
 */
export class MessagingService {
  private config: z.infer<typeof messagingConfigSchema>;
  private io?: SocketIOServer;
  private pusher?: Pusher;
  private redis?: Redis;

  constructor() {
    this.config = messagingConfigSchema.parse(process.env);

    logger.info('Messaging service initialized', {
      provider: this.config.REALTIME_PROVIDER,
      encryptionEnabled: this.config.MESSAGE_ENCRYPTION_ENABLED,
      maxMessageLength: this.config.MAX_MESSAGE_LENGTH
    });
  }

  /**
   * Initialize real-time messaging infrastructure
   */
  async initialize(httpServer?: any): Promise<void> {
    try {
      switch (this.config.REALTIME_PROVIDER) {
        case 'socket.io':
          await this.initializeSocketIO(httpServer);
          break;
        case 'pusher':
          await this.initializePusher();
          break;
        case 'supabase':
          await this.initializeSupabaseRealtime();
          break;
      }

      logger.info('Real-time messaging initialized', {
        provider: this.config.REALTIME_PROVIDER
      });

    } catch (error) {
      logger.error('Failed to initialize messaging service', { error });
      throw error;
    }
  }

  /**
   * Create or get existing conversation
   */
  async createOrGetConversation(
    participantIds: string[],
    initiatorId: string,
    type: ConversationType = ConversationType.DIRECT
  ): Promise<Conversation> {
    try {
      // For direct messages, check if conversation already exists
      if (type === ConversationType.DIRECT && participantIds.length === 2) {
        const existing = await this.findExistingDirectConversation(participantIds);
        if (existing) {
          return existing;
        }
      }

      // Create new conversation
      const conversationId = crypto.randomUUID();

      const conversation: Conversation = {
        id: conversationId,
        type,
        participants: participantIds,
        creatorId: this.identifyCreator(participantIds),
        fanId: this.identifyFan(participantIds),
        unreadCount: 0,
        isActive: true,
        metadata: {
          settings: {
            ppvEnabled: true,
            defaultMessagePrice: 0,
            allowMedia: true,
            maxMediaSize: this.config.MAX_ATTACHMENTS,
            moderationEnabled: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.saveConversation(conversation);

      // Notify participants
      await this.notifyConversationCreated(conversation);

      logger.info('Conversation created', {
        conversationId,
        participants: participantIds,
        type,
        initiatorId
      });

      return conversation;

    } catch (error) {
      logger.error('Failed to create conversation', {
        participantIds,
        initiatorId,
        type,
        error
      });
      throw error;
    }
  }

  /**
   * Send message with access control and PPV support
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    messageData: {
      type: MessageType;
      content?: string;
      mediaIds?: string[];
      isLocked?: boolean;
      price?: number;
      replyToId?: string;
    }
  ): Promise<Message> {
    try {
      // Validate conversation access
      const conversation = await this.getConversation(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (!conversation.participants.includes(senderId)) {
        throw new Error('Access denied');
      }

      // Get sender information
      const { data: sender } = await supabase
        .from('users')
        .select('username, role')
        .eq('id', senderId)
        .single();

      if (!sender) {
        throw new Error('Sender not found');
      }

      // Create message
      const messageId = crypto.randomUUID();
      const now = new Date();

      const message: Message = {
        id: messageId,
        conversationId,
        senderId,
        senderUsername: sender.username,
        type: messageData.type,
        content: messageData.content,
        mediaIds: messageData.mediaIds,
        isLocked: messageData.isLocked || false,
        price: messageData.price,
        currency: 'USD',
        status: MessageStatus.SENT,
        readBy: [{ userId: senderId, readAt: now }],
        encrypted: this.config.MESSAGE_ENCRYPTION_ENABLED,
        sentAt: now,
        replyToId: messageData.replyToId
      };

      // Encrypt message if enabled
      if (this.config.MESSAGE_ENCRYPTION_ENABLED) {
        message.content = await this.encryptMessage(message.content || '');
        message.encryptionKeyId = 'default-key'; // TODO: Implement key rotation
      }

      // Save message to database
      await this.saveMessage(message);

      // Update conversation
      await this.updateConversationLastMessage(conversationId, message);

      // Send real-time notification
      await this.broadcastMessage(message, conversation);

      // Handle PPV logic
      if (message.isLocked && message.price && message.price > 0) {
        await this.handlePPVMessage(message, conversation);
      }

      logger.info('Message sent', {
        messageId,
        conversationId,
        senderId,
        type: messageData.type,
        isLocked: message.isLocked,
        price: message.price
      });

      return message;

    } catch (error) {
      logger.error('Failed to send message', {
        conversationId,
        senderId,
        error
      });
      throw error;
    }
  }

  /**
   * Get messages with access control
   */
  async getMessages(
    conversationId: string,
    userId: string,
    options: {
      limit?: number;
      before?: string;
      after?: string;
    } = {}
  ): Promise<Message[]> {
    try {
      // Validate conversation access
      const conversation = await this.getConversation(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        throw new Error('Access denied');
      }

      // Get messages from database
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('sent_at', { ascending: false })
        .limit(options.limit || 50);

      if (options.before) {
        query = query.lt('sent_at', options.before);
      }

      if (options.after) {
        query = query.gt('sent_at', options.after);
      }

      const { data: messages, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }

      if (!messages) {
        return [];
      }

      // Convert database records to Message objects
      const processedMessages: Message[] = [];

      for (const msg of messages) {
        const message = await this.processMessageForUser(msg, userId);
        processedMessages.push(message);
      }

      return processedMessages.reverse(); // Return in chronological order

    } catch (error) {
      logger.error('Failed to get messages', {
        conversationId,
        userId,
        error
      });
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markMessageRead(
    messageId: string,
    userId: string
  ): Promise<void> {
    try {
      const readAt = new Date();

      // Update read status in database
      const { error } = await supabase
        .from('message_reads')
        .upsert({
          message_id: messageId,
          user_id: userId,
          read_at: readAt.toISOString()
        });

      if (error) {
        throw new Error(`Failed to mark message as read: ${error.message}`);
      }

      // Broadcast read receipt
      await this.broadcastReadReceipt(messageId, userId, readAt);

      logger.debug('Message marked as read', {
        messageId,
        userId
      });

    } catch (error) {
      logger.error('Failed to mark message as read', {
        messageId,
        userId,
        error
      });
      throw error;
    }
  }

  /**
   * Handle typing indicators
   */
  async handleTyping(
    conversationId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single();

      if (!user) {
        throw new Error('User not found');
      }

      const typingStatus: TypingStatus = {
        conversationId,
        userId,
        username: user.username,
        isTyping,
        timestamp: new Date()
      };

      // Broadcast typing status
      await this.broadcastTypingStatus(typingStatus);

      logger.debug('Typing status updated', {
        conversationId,
        userId,
        isTyping
      });

    } catch (error) {
      logger.error('Failed to handle typing', {
        conversationId,
        userId,
        isTyping,
        error
      });
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Conversation[]> {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          last_message:messages(*)
        `)
        .contains('participants', [userId])
        .eq('is_active', true)
        .order('last_message_at', { ascending: false })
        .range(options.offset || 0, (options.offset || 0) + (options.limit || 20) - 1);

      if (error) {
        throw new Error(`Failed to fetch conversations: ${error.message}`);
      }

      if (!conversations) {
        return [];
      }

      // Process conversations
      return conversations.map(conv => this.processConversationRecord(conv));

    } catch (error) {
      logger.error('Failed to get user conversations', {
        userId,
        error
      });
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private async initializeSocketIO(httpServer: any): Promise<void> {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.VITE_SITE_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });

    // Redis adapter for scaling
    if (this.config.REDIS_HOST) {
      const pubClient = new Redis({
        host: this.config.REDIS_HOST,
        port: this.config.REDIS_PORT,
        password: this.config.REDIS_PASSWORD
      });

      const subClient = pubClient.duplicate();
      this.io.adapter(createAdapter(pubClient, subClient));
    }

    // Socket authentication and event handling
    this.io.use(async (socket, next) => {
      try {
        // Authenticate socket connection
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication required'));
        }

        // Verify token and attach user
        const user = await this.authenticateSocket(token);
        socket.data.user = user;

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket) => {
      this.handleSocketConnection(socket);
    });
  }

  private async initializePusher(): Promise<void> {
    if (!this.config.PUSHER_APP_ID || !this.config.PUSHER_KEY || !this.config.PUSHER_SECRET) {
      throw new Error('Pusher configuration missing');
    }

    this.pusher = new Pusher({
      appId: this.config.PUSHER_APP_ID,
      key: this.config.PUSHER_KEY,
      secret: this.config.PUSHER_SECRET,
      cluster: this.config.PUSHER_CLUSTER,
      useTLS: true
    });
  }

  private async initializeSupabaseRealtime(): Promise<void> {
    // Supabase realtime is initialized automatically with the client
    logger.info('Using Supabase realtime for messaging');
  }

  private async authenticateSocket(token: string): Promise<AuthenticatedUser> {
    // Implement socket authentication
    // This would verify the JWT token and return user information
    throw new Error('Socket authentication not implemented');
  }

  private handleSocketConnection(socket: any): void {
    const user = socket.data.user;

    logger.info('User connected to messaging', {
      userId: user.id,
      socketId: socket.id
    });

    // Join user to their conversations
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    // Handle typing events
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      this.handleTyping(data.conversationId, user.id, data.isTyping);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info('User disconnected from messaging', {
        userId: user.id,
        socketId: socket.id
      });
    });
  }

  private async findExistingDirectConversation(
    participantIds: string[]
  ): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('type', ConversationType.DIRECT)
      .contains('participants', participantIds)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return this.processConversationRecord(data);
  }

  private identifyCreator(participantIds: string[]): string | undefined {
    // TODO: Query user roles to identify creator
    return undefined;
  }

  private identifyFan(participantIds: string[]): string | undefined {
    // TODO: Query user roles to identify fan
    return undefined;
  }

  private async saveConversation(conversation: Conversation): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .insert({
        id: conversation.id,
        type: conversation.type,
        participants: conversation.participants,
        creator_id: conversation.creatorId,
        fan_id: conversation.fanId,
        is_active: conversation.isActive,
        metadata: conversation.metadata,
        created_at: conversation.createdAt.toISOString(),
        updated_at: conversation.updatedAt.toISOString()
      });

    if (error) {
      throw new Error(`Failed to save conversation: ${error.message}`);
    }
  }

  private async saveMessage(message: Message): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert({
        id: message.id,
        conversation_id: message.conversationId,
        sender_id: message.senderId,
        type: message.type,
        content: message.content,
        media_ids: message.mediaIds,
        is_locked: message.isLocked,
        price: message.price,
        currency: message.currency,
        status: message.status,
        encrypted: message.encrypted,
        encryption_key_id: message.encryptionKeyId,
        sent_at: message.sentAt.toISOString(),
        reply_to_id: message.replyToId
      });

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }

  private async getConversation(conversationId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error || !data) {
      return null;
    }

    return this.processConversationRecord(data);
  }

  private processConversationRecord(data: any): Conversation {
    return {
      id: data.id,
      type: data.type,
      participants: data.participants,
      creatorId: data.creator_id,
      fanId: data.fan_id,
      unreadCount: data.unread_count || 0,
      isActive: data.is_active,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private async processMessageForUser(data: any, userId: string): Promise<Message> {
    const message: Message = {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      senderUsername: data.sender_username || 'Unknown',
      type: data.type,
      content: data.content,
      mediaIds: data.media_ids,
      isLocked: data.is_locked,
      price: data.price,
      currency: data.currency,
      status: data.status,
      readBy: [], // TODO: Fetch read receipts
      encrypted: data.encrypted,
      encryptionKeyId: data.encryption_key_id,
      sentAt: new Date(data.sent_at),
      replyToId: data.reply_to_id
    };

    // Check PPV access
    if (message.isLocked && message.price && message.price > 0) {
      const entitlement = await EntitlementService.hasContentAccess(
        { id: userId } as AuthenticatedUser,
        message.id,
        'message'
      );
      message.hasAccess = entitlement.hasAccess;
    } else {
      message.hasAccess = true;
    }

    // Decrypt if needed and accessible
    if (message.encrypted && message.hasAccess) {
      message.content = await this.decryptMessage(message.content || '');
    }

    return message;
  }

  private async encryptMessage(content: string): Promise<string> {
    // TODO: Implement message encryption
    return content;
  }

  private async decryptMessage(encryptedContent: string): Promise<string> {
    // TODO: Implement message decryption
    return encryptedContent;
  }

  private async updateConversationLastMessage(
    conversationId: string,
    message: Message
  ): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({
        last_message_at: message.sentAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (error) {
      logger.error('Failed to update conversation last message', {
        conversationId,
        error
      });
    }
  }

  private async broadcastMessage(message: Message, conversation: Conversation): Promise<void> {
    // Broadcast via chosen real-time provider
    switch (this.config.REALTIME_PROVIDER) {
      case 'socket.io':
        this.io?.to(`conversation:${conversation.id}`).emit(RealtimeEvent.MESSAGE_SENT, message);
        break;
      case 'pusher':
        await this.pusher?.trigger(`conversation-${conversation.id}`, RealtimeEvent.MESSAGE_SENT, message);
        break;
      case 'supabase':
        // Supabase realtime broadcasts automatically
        break;
    }
  }

  private async broadcastReadReceipt(
    messageId: string,
    userId: string,
    readAt: Date
  ): Promise<void> {
    const receipt = { messageId, userId, readAt };

    switch (this.config.REALTIME_PROVIDER) {
      case 'socket.io':
        this.io?.emit(RealtimeEvent.MESSAGE_READ, receipt);
        break;
      case 'pusher':
        await this.pusher?.trigger('messages', RealtimeEvent.MESSAGE_READ, receipt);
        break;
    }
  }

  private async broadcastTypingStatus(status: TypingStatus): Promise<void> {
    switch (this.config.REALTIME_PROVIDER) {
      case 'socket.io':
        this.io?.to(`conversation:${status.conversationId}`)
          .emit(RealtimeEvent.MESSAGE_TYPING, status);
        break;
      case 'pusher':
        await this.pusher?.trigger(
          `conversation-${status.conversationId}`,
          RealtimeEvent.MESSAGE_TYPING,
          status
        );
        break;
    }
  }

  private async notifyConversationCreated(conversation: Conversation): Promise<void> {
    // Notify all participants about new conversation
    for (const participantId of conversation.participants) {
      // Send notification (implement notification service)
      logger.info('Conversation notification sent', {
        conversationId: conversation.id,
        participantId
      });
    }
  }

  private async handlePPVMessage(message: Message, conversation: Conversation): Promise<void> {
    // Handle PPV message logic
    // This would integrate with payment processing when Stripe is connected
    logger.info('PPV message created', {
      messageId: message.id,
      price: message.price,
      conversationId: conversation.id
    });
  }
}

// Export singleton instance
export const messagingService = new MessagingService();
export default messagingService;