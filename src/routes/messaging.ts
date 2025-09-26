import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { z } from 'zod';
import {
  authenticate,
  requireAuth,
  UserRole
} from '../lib/auth-middleware';
import {
  validateRequest,
  securityAuditLog,
  apiRateLimit,
  logger
} from '../lib/security-enhanced';
import {
  messagingService,
  MessageType,
  ConversationType
} from '../lib/messaging-service';

const router = Router();

// Validation schemas
const createConversationSchema = z.object({
  participantIds: z.array(z.string().uuid()).min(1).max(10),
  type: z.nativeEnum(ConversationType).default(ConversationType.DIRECT),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional()
});

const sendMessageSchema = z.object({
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  content: z.string().max(2000).optional(),
  mediaIds: z.array(z.string().uuid()).max(5).optional(),
  isLocked: z.boolean().default(false),
  price: z.number().min(0).max(1000).optional(),
  replyToId: z.string().uuid().optional()
});

const messagesQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  before: z.string().optional(),
  after: z.string().optional()
});

/**
 * Get user conversations
 * GET /api/v1/messaging/conversations
 */
router.get('/conversations',
  authenticate,
  requireAuth,
  apiRateLimit,
  securityAuditLog('get_conversations'),
  validateRequest([
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ]),
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const conversations = await messagingService.getUserConversations(
        req.user!.id,
        { limit, offset }
      );

      logger.info('User conversations retrieved', {
        userId: req.user!.id,
        count: conversations.length,
        correlationId: req.correlationId
      });

      res.json({
        conversations,
        pagination: {
          limit,
          offset,
          hasMore: conversations.length === limit
        },
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to get conversations', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'conversations_fetch_failed',
        message: 'Failed to retrieve conversations',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Create new conversation
 * POST /api/v1/messaging/conversations
 */
router.post('/conversations',
  authenticate,
  requireAuth,
  securityAuditLog('create_conversation'),
  validateRequest([
    body('participantIds').isArray({ min: 1, max: 10 }),
    body('participantIds.*').isUUID(),
    body('type').optional().isIn(Object.values(ConversationType)),
    body('title').optional().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 })
  ]),
  async (req, res) => {
    try {
      const conversationData = createConversationSchema.parse(req.body);

      // Add current user to participants if not included
      if (!conversationData.participantIds.includes(req.user!.id)) {
        conversationData.participantIds.push(req.user!.id);
      }

      const conversation = await messagingService.createOrGetConversation(
        conversationData.participantIds,
        req.user!.id,
        conversationData.type
      );

      logger.info('Conversation created', {
        conversationId: conversation.id,
        participants: conversationData.participantIds,
        type: conversationData.type,
        initiatorId: req.user!.id,
        correlationId: req.correlationId
      });

      res.status(201).json({
        conversation,
        message: 'Conversation created successfully',
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to create conversation', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid conversation data',
          details: error.errors,
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'conversation_creation_failed',
        message: error instanceof Error ? error.message : 'Failed to create conversation',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Get conversation messages
 * GET /api/v1/messaging/conversations/:conversationId/messages
 */
router.get('/conversations/:conversationId/messages',
  authenticate,
  requireAuth,
  securityAuditLog('get_messages'),
  validateRequest([
    param('conversationId').isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('before').optional().isISO8601(),
    query('after').optional().isISO8601()
  ]),
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const queryOptions = messagesQuerySchema.parse(req.query);

      const messages = await messagingService.getMessages(
        conversationId,
        req.user!.id,
        queryOptions
      );

      logger.info('Conversation messages retrieved', {
        conversationId,
        userId: req.user!.id,
        messageCount: messages.length,
        correlationId: req.correlationId
      });

      res.json({
        messages,
        pagination: {
          limit: queryOptions.limit,
          hasMore: messages.length === queryOptions.limit
        },
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to get messages', {
        conversationId: req.params.conversationId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof Error && error.message.includes('Access denied')) {
        return res.status(403).json({
          error: 'access_denied',
          message: 'You do not have access to this conversation',
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'messages_fetch_failed',
        message: 'Failed to retrieve messages',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Send message
 * POST /api/v1/messaging/conversations/:conversationId/messages
 */
router.post('/conversations/:conversationId/messages',
  authenticate,
  requireAuth,
  securityAuditLog('send_message'),
  validateRequest([
    param('conversationId').isUUID(),
    body('type').optional().isIn(Object.values(MessageType)),
    body('content').optional().isLength({ max: 2000 }),
    body('mediaIds').optional().isArray({ max: 5 }),
    body('mediaIds.*').optional().isUUID(),
    body('isLocked').optional().isBoolean(),
    body('price').optional().isFloat({ min: 0, max: 1000 }),
    body('replyToId').optional().isUUID()
  ]),
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messageData = sendMessageSchema.parse(req.body);

      // Validate message content
      if (messageData.type === MessageType.TEXT && !messageData.content) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Text messages require content',
          correlationId: req.correlationId
        });
      }

      if (messageData.type !== MessageType.TEXT && !messageData.mediaIds?.length) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Media messages require media IDs',
          correlationId: req.correlationId
        });
      }

      // Validate PPV settings
      if (messageData.isLocked && (!messageData.price || messageData.price <= 0)) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Locked messages require a price greater than 0',
          correlationId: req.correlationId
        });
      }

      const message = await messagingService.sendMessage(
        conversationId,
        req.user!.id,
        messageData
      );

      logger.info('Message sent', {
        messageId: message.id,
        conversationId,
        senderId: req.user!.id,
        type: messageData.type,
        isLocked: messageData.isLocked,
        correlationId: req.correlationId
      });

      res.status(201).json({
        message,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to send message', {
        conversationId: req.params.conversationId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid message data',
          details: error.errors,
          correlationId: req.correlationId
        });
      }

      if (error instanceof Error && error.message.includes('Access denied')) {
        return res.status(403).json({
          error: 'access_denied',
          message: 'You do not have access to this conversation',
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'message_send_failed',
        message: error instanceof Error ? error.message : 'Failed to send message',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Mark message as read
 * PUT /api/v1/messaging/messages/:messageId/read
 */
router.put('/messages/:messageId/read',
  authenticate,
  requireAuth,
  securityAuditLog('mark_message_read'),
  validateRequest([
    param('messageId').isUUID()
  ]),
  async (req, res) => {
    try {
      const { messageId } = req.params;

      await messagingService.markMessageRead(messageId, req.user!.id);

      logger.debug('Message marked as read', {
        messageId,
        userId: req.user!.id,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Message marked as read',
        messageId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to mark message as read', {
        messageId: req.params.messageId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'mark_read_failed',
        message: 'Failed to mark message as read',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Handle typing indicators
 * POST /api/v1/messaging/conversations/:conversationId/typing
 */
router.post('/conversations/:conversationId/typing',
  authenticate,
  requireAuth,
  validateRequest([
    param('conversationId').isUUID(),
    body('isTyping').isBoolean()
  ]),
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { isTyping } = req.body;

      await messagingService.handleTyping(
        conversationId,
        req.user!.id,
        isTyping
      );

      logger.debug('Typing status updated', {
        conversationId,
        userId: req.user!.id,
        isTyping,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Typing status updated',
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to update typing status', {
        conversationId: req.params.conversationId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'typing_update_failed',
        message: 'Failed to update typing status',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Get conversation info
 * GET /api/v1/messaging/conversations/:conversationId
 */
router.get('/conversations/:conversationId',
  authenticate,
  requireAuth,
  securityAuditLog('get_conversation'),
  validateRequest([
    param('conversationId').isUUID()
  ]),
  async (req, res) => {
    try {
      const { conversationId } = req.params;

      // TODO: Implement get single conversation with access control
      // This would check if user is a participant and return conversation details

      res.json({
        message: 'Get conversation endpoint not yet implemented',
        conversationId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to get conversation', {
        conversationId: req.params.conversationId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'conversation_fetch_failed',
        message: 'Failed to retrieve conversation',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Update conversation settings
 * PUT /api/v1/messaging/conversations/:conversationId/settings
 */
router.put('/conversations/:conversationId/settings',
  authenticate,
  requireAuth,
  securityAuditLog('update_conversation_settings'),
  validateRequest([
    param('conversationId').isUUID(),
    body('ppvEnabled').optional().isBoolean(),
    body('defaultMessagePrice').optional().isFloat({ min: 0 }),
    body('allowMedia').optional().isBoolean(),
    body('moderationEnabled').optional().isBoolean()
  ]),
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const settings = req.body;

      // TODO: Implement conversation settings update
      // This would update conversation settings with proper authorization

      logger.info('Conversation settings updated', {
        conversationId,
        userId: req.user!.id,
        settings: Object.keys(settings),
        correlationId: req.correlationId
      });

      res.json({
        message: 'Conversation settings updated',
        conversationId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to update conversation settings', {
        conversationId: req.params.conversationId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'settings_update_failed',
        message: 'Failed to update conversation settings',
        correlationId: req.correlationId
      });
    }
  }
);

export default router;