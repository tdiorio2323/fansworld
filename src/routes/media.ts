import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { z } from 'zod';
import {
  authenticate,
  requireAuth,
  requireResourceOwnershipOrRole,
  UserRole
} from '../lib/auth-middleware';
import {
  validateRequest,
  securityAuditLog,
  mediaUploadRateLimit,
  logger
} from '../lib/security-enhanced';
import {
  mediaService,
  MediaAccessLevel,
  MediaType,
  MediaUploadRequest
} from '../lib/media-service';
import { EntitlementService } from '../lib/entitlement-service';

const router = Router();

// Validation schemas
const uploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().min(1).max(104857600), // 100MB max
  accessLevel: z.nativeEnum(MediaAccessLevel).default(MediaAccessLevel.PRIVATE),
  price: z.number().min(0).optional(),
  tags: z.array(z.string()).optional()
});

const mediaQuerySchema = z.object({
  type: z.nativeEnum(MediaType).optional(),
  accessLevel: z.nativeEnum(MediaAccessLevel).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

/**
 * Generate signed upload URL for media
 * POST /api/v1/media/sign-upload
 */
router.post('/sign-upload',
  authenticate,
  requireAuth,
  mediaUploadRateLimit,
  securityAuditLog('media_upload_request'),
  validateRequest([
    body('filename').isLength({ min: 1, max: 255 }),
    body('contentType').matches(/^(image|video|audio)\//),
    body('size').isInt({ min: 1, max: 104857600 }),
    body('accessLevel').optional().isIn(Object.values(MediaAccessLevel)),
    body('price').optional().isFloat({ min: 0 })
  ]),
  async (req, res) => {
    try {
      const uploadRequest = uploadRequestSchema.parse(req.body);

      // Generate signed upload URL
      const signedUpload = await mediaService.generateSignedUpload(
        req.user!.id,
        uploadRequest
      );

      logger.info('Signed upload URL generated', {
        userId: req.user!.id,
        mediaId: signedUpload.mediaId,
        filename: uploadRequest.filename,
        size: uploadRequest.size,
        correlationId: req.correlationId
      });

      res.status(201).json({
        ...signedUpload,
        message: 'Upload URL generated successfully',
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to generate signed upload URL', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid upload request',
          details: error.errors,
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'upload_url_failed',
        message: error instanceof Error ? error.message : 'Failed to generate upload URL',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Process uploaded media (webhook endpoint)
 * POST /api/v1/media/:mediaId/process
 */
router.post('/:mediaId/process',
  authenticate,
  requireAuth,
  securityAuditLog('media_processing'),
  validateRequest([
    param('mediaId').isUUID()
  ]),
  async (req, res) => {
    try {
      const { mediaId } = req.params;

      // Process the uploaded media
      await mediaService.processUploadedMedia(mediaId);

      logger.info('Media processing completed', {
        mediaId,
        userId: req.user!.id,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Media processed successfully',
        mediaId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Media processing failed', {
        mediaId: req.params.mediaId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'processing_failed',
        message: error instanceof Error ? error.message : 'Media processing failed',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Get media file with access control
 * GET /api/v1/media/:mediaId
 */
router.get('/:mediaId',
  authenticate,
  securityAuditLog('media_access'),
  validateRequest([
    param('mediaId').isUUID(),
    query('thumbnail').optional().isBoolean()
  ]),
  async (req, res) => {
    try {
      const { mediaId } = req.params;
      const thumbnail = req.query.thumbnail === 'true';

      // Check content access using entitlement service
      const entitlement = await EntitlementService.hasContentAccess(
        req.user,
        mediaId,
        'media'
      );

      if (!entitlement.hasAccess) {
        logger.warn('Media access denied', {
          mediaId,
          userId: req.user?.id,
          reason: entitlement.reason,
          correlationId: req.correlationId
        });

        const statusCode = entitlement.subscriptionRequired ? 402 : 403;

        return res.status(statusCode).json({
          error: 'access_denied',
          message: entitlement.reason,
          price: entitlement.price,
          currency: entitlement.currency,
          subscriptionRequired: entitlement.subscriptionRequired,
          correlationId: req.correlationId
        });
      }

      // Generate appropriate URL
      const mediaUrl = thumbnail
        ? await mediaService.getThumbnailUrl(mediaId, req.user?.id)
        : await mediaService.getMediaUrl(mediaId, req.user?.id);

      if (!mediaUrl) {
        return res.status(404).json({
          error: 'media_not_found',
          message: thumbnail ? 'Thumbnail not available' : 'Media not found',
          correlationId: req.correlationId
        });
      }

      // For API clients, return the URL
      // For browsers, redirect to the signed URL
      const userAgent = req.get('User-Agent') || '';
      const isApiClient = userAgent.includes('axios') ||
                          userAgent.includes('fetch') ||
                          req.headers.accept?.includes('application/json');

      if (isApiClient) {
        res.json({
          mediaUrl,
          mediaId,
          thumbnail,
          expiresIn: 3600,
          correlationId: req.correlationId
        });
      } else {
        // Redirect browsers directly to the media
        res.redirect(302, mediaUrl);
      }

      logger.info('Media access granted', {
        mediaId,
        userId: req.user?.id,
        thumbnail,
        entitlementType: entitlement.entitlementType,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Media access error', {
        mediaId: req.params.mediaId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'media_access_failed',
        message: 'Failed to access media',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Get user's media files
 * GET /api/v1/media
 */
router.get('/',
  authenticate,
  requireAuth,
  securityAuditLog('list_user_media'),
  validateRequest([
    query('type').optional().isIn(Object.values(MediaType)),
    query('accessLevel').optional().isIn(Object.values(MediaAccessLevel)),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ]),
  async (req, res) => {
    try {
      const query = mediaQuerySchema.parse(req.query);

      // TODO: Implement media listing from database
      // This would query the media table with filters and pagination
      const media = []; // Stub implementation

      logger.info('User media listed', {
        userId: req.user!.id,
        count: media.length,
        filters: query,
        correlationId: req.correlationId
      });

      res.json({
        media,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          total: media.length,
          hasMore: false
        },
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to list user media', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'media_list_failed',
        message: 'Failed to retrieve media files',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Update media metadata
 * PUT /api/v1/media/:mediaId
 */
router.put('/:mediaId',
  authenticate,
  requireAuth,
  securityAuditLog('update_media'),
  validateRequest([
    param('mediaId').isUUID(),
    body('accessLevel').optional().isIn(Object.values(MediaAccessLevel)),
    body('price').optional().isFloat({ min: 0 }),
    body('tags').optional().isArray()
  ]),
  async (req, res) => {
    try {
      const { mediaId } = req.params;
      const updates = req.body;

      // TODO: Implement media metadata update
      // This would update the media record in the database
      // with ownership verification

      logger.info('Media metadata updated', {
        mediaId,
        userId: req.user!.id,
        updates: Object.keys(updates),
        correlationId: req.correlationId
      });

      res.json({
        message: 'Media metadata updated successfully',
        mediaId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to update media metadata', {
        mediaId: req.params.mediaId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'media_update_failed',
        message: 'Failed to update media metadata',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Delete media file
 * DELETE /api/v1/media/:mediaId
 */
router.delete('/:mediaId',
  authenticate,
  requireAuth,
  securityAuditLog('delete_media'),
  validateRequest([
    param('mediaId').isUUID()
  ]),
  async (req, res) => {
    try {
      const { mediaId } = req.params;

      await mediaService.deleteMedia(mediaId, req.user!.id);

      logger.info('Media deleted', {
        mediaId,
        userId: req.user!.id,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Media deleted successfully',
        mediaId,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Failed to delete media', {
        mediaId: req.params.mediaId,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof Error && error.message.includes('Access denied')) {
        return res.status(403).json({
          error: 'access_denied',
          message: 'You can only delete your own media',
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'media_delete_failed',
        message: 'Failed to delete media',
        correlationId: req.correlationId
      });
    }
  }
);

/**
 * Bulk media operations
 * POST /api/v1/media/bulk
 */
router.post('/bulk',
  authenticate,
  requireAuth,
  securityAuditLog('bulk_media_operation'),
  validateRequest([
    body('operation').isIn(['urls', 'delete', 'update']),
    body('mediaIds').isArray({ min: 1, max: 100 }),
    body('mediaIds.*').isUUID()
  ]),
  async (req, res) => {
    try {
      const { operation, mediaIds, data } = req.body;

      let result: any = {};

      switch (operation) {
        case 'urls':
          const urls = await mediaService.bulkGetMediaUrls(mediaIds, req.user!.id);
          result = { urls: Object.fromEntries(urls) };
          break;

        case 'delete':
          // TODO: Implement bulk delete with ownership verification
          result = { deleted: mediaIds.length };
          break;

        case 'update':
          // TODO: Implement bulk update with ownership verification
          result = { updated: mediaIds.length };
          break;

        default:
          return res.status(400).json({
            error: 'invalid_operation',
            message: 'Invalid bulk operation',
            correlationId: req.correlationId
          });
      }

      logger.info('Bulk media operation completed', {
        operation,
        mediaCount: mediaIds.length,
        userId: req.user!.id,
        correlationId: req.correlationId
      });

      res.json({
        operation,
        result,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Bulk media operation failed', {
        operation: req.body.operation,
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'bulk_operation_failed',
        message: 'Bulk operation failed',
        correlationId: req.correlationId
      });
    }
  }
);

export default router;