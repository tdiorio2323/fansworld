import { Router } from 'express';
import { body, param } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
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
  logger
} from '../lib/security-enhanced';

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validation schemas
const updateUserSchema = z.object({
  displayName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional()
});

// Get user by ID or username
router.get('/:identifier',
  authenticate,
  securityAuditLog('get_user'),
  validateRequest([
    param('identifier').isLength({ min: 1, max: 50 })
  ]),
  async (req, res) => {
    try {
      const { identifier } = req.params;

      // Check if identifier is UUID (ID) or username
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

      const query = supabase
        .from('users')
        .select(`
          id,
          username,
          display_name,
          bio,
          avatar_url,
          verified,
          role,
          created_at
        `);

      if (isUUID) {
        query.eq('id', identifier);
      } else {
        query.eq('username', identifier);
      }

      const { data: user, error } = await query.single();

      if (error || !user) {
        return res.status(404).json({
          error: 'user_not_found',
          message: 'User not found',
          correlationId: req.correlationId
        });
      }

      // Return public profile (hide sensitive info)
      const publicProfile = {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        verified: user.verified,
        role: user.role,
        createdAt: user.created_at
      };

      res.json({
        user: publicProfile,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Get user error', {
        identifier: req.params.identifier,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'user_fetch_failed',
        message: 'Failed to fetch user',
        correlationId: req.correlationId
      });
    }
  }
);

// Update current user profile
router.put('/me',
  authenticate,
  requireAuth,
  securityAuditLog('update_user_profile'),
  validateRequest([
    body('displayName').optional().isLength({ max: 100 }),
    body('bio').optional().isLength({ max: 500 }),
    body('avatarUrl').optional().isURL()
  ]),
  async (req, res) => {
    try {
      const updates = updateUserSchema.parse(req.body);

      // Remove empty values
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key === 'displayName' ? 'display_name' :
              key === 'avatarUrl' ? 'avatar_url' : key] = value;
        }
        return acc;
      }, {} as any);

      if (Object.keys(cleanUpdates).length === 0) {
        return res.status(400).json({
          error: 'no_updates',
          message: 'No valid updates provided',
          correlationId: req.correlationId
        });
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user!.id)
        .select()
        .single();

      if (error) {
        logger.error('User update failed', {
          userId: req.user!.id,
          error: error.message,
          correlationId: req.correlationId
        });

        return res.status(500).json({
          error: 'update_failed',
          message: 'Failed to update profile',
          correlationId: req.correlationId
        });
      }

      logger.info('User profile updated', {
        userId: req.user!.id,
        updates: Object.keys(cleanUpdates),
        correlationId: req.correlationId
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          verified: data.verified,
          role: data.role
        },
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Update user profile error', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid input data',
          details: error.errors,
          correlationId: req.correlationId
        });
      }

      res.status(500).json({
        error: 'update_failed',
        message: 'Profile update failed',
        correlationId: req.correlationId
      });
    }
  }
);

// Delete user account (soft delete)
router.delete('/me',
  authenticate,
  requireAuth,
  securityAuditLog('delete_user_account'),
  async (req, res) => {
    try {
      const userId = req.user!.id;

      // Soft delete - mark as deleted instead of removing
      const { error: updateError } = await supabase
        .from('users')
        .update({
          deleted_at: new Date().toISOString(),
          username: `deleted_${userId}`,
          email: `deleted_${userId}@deleted.com`
        })
        .eq('id', userId);

      if (updateError) {
        logger.error('User soft delete failed', {
          userId,
          error: updateError.message,
          correlationId: req.correlationId
        });

        return res.status(500).json({
          error: 'delete_failed',
          message: 'Failed to delete account',
          correlationId: req.correlationId
        });
      }

      // Also disable the auth user
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          ban_duration: 'none',
          user_metadata: { deleted: true }
        }
      );

      if (authError) {
        logger.warn('Auth user update failed during deletion', {
          userId,
          error: authError.message,
          correlationId: req.correlationId
        });
      }

      logger.info('User account deleted', {
        userId,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Account deleted successfully',
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Delete user account error', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'delete_failed',
        message: 'Account deletion failed',
        correlationId: req.correlationId
      });
    }
  }
);

// Get user's subscriptions
router.get('/me/subscriptions',
  authenticate,
  requireAuth,
  securityAuditLog('get_user_subscriptions'),
  async (req, res) => {
    try {
      // Stub implementation - return empty array until subscriptions are implemented
      const subscriptions = [];

      logger.info('User subscriptions fetched', {
        userId: req.user!.id,
        count: subscriptions.length,
        correlationId: req.correlationId
      });

      res.json({
        subscriptions,
        total: subscriptions.length,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Get user subscriptions error', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'subscriptions_fetch_failed',
        message: 'Failed to fetch subscriptions',
        correlationId: req.correlationId
      });
    }
  }
);

export default router;