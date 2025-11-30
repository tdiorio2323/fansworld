import { Router, Request, Response } from 'express';
import { getContainer } from '../infrastructure/container/Container';
import { AuthController } from '../application/controllers/AppController';
import { authenticate, requireAuth } from '../application/middlewares/AuthMiddleware';
import { validateRequest, securityAuditLog, logger } from '../lib/security-enhanced';
import { body } from 'express-validator';
import { SecureAIService } from '../infrastructure/services/SecureAIService';

const router = Router();
const secureAIService = new SecureAIService();

// Get controllers from DI container
const authController = getContainer().resolve<AuthController>('authController');

// Validation schemas as middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/)
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Registration endpoint
router.post('/register',
  securityAuditLog('user_registration'),
  validateRequest(registerValidation),
  async (req: Request, res: Response) => {
    await authController.register(req, res);
  }
);

// Login endpoint
router.post('/login',
  securityAuditLog('user_login'),
  validateRequest(loginValidation),
  async (req: Request, res: Response) => {
    await authController.login(req, res);
  }
);

// Logout endpoint
router.post('/logout',
  authenticate,
  securityAuditLog('user_logout'),
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const authService = getContainer().resolve('authService');
        await authService.logout(req.headers.authorization?.substring(7) || '');
        
        logger.info('User logged out successfully', {
          userId: req.user.id,
          correlationId: req.correlationId
        });
      }

      res.json({
        message: 'Logout successful',
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Logout endpoint error', {
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'logout_failed',
        message: 'Logout failed',
        correlationId: req.correlationId
      });
    }
  }
);

// Get current user profile
router.get('/me',
  authenticate,
  requireAuth,
  securityAuditLog('get_user_profile'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'authentication_required',
          message: 'Authentication required',
          correlationId: req.correlationId
        });
      }

      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          username: req.user.username,
          role: req.user.role,
          verified: req.user.verified
        },
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Get user profile error', {
        userId: req.user?.id,
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'profile_fetch_failed',
        message: 'Failed to fetch user profile',
        correlationId: req.correlationId
      });
    }
  }
);

// Refresh token endpoint
router.post('/refresh',
  validateRequest([
    body('refreshToken').notEmpty()
  ]),
  securityAuditLog('token_refresh'),
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      const authService = getContainer().resolve('authService');
      const result = await authService.refreshToken(refreshToken);

      logger.info('Token refreshed successfully', {
        correlationId: req.correlationId
      });

      res.json({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Token refresh error', {
        error,
        correlationId: req.correlationId
      });

      res.status(500).json({
        error: 'refresh_failed',
        message: 'Token refresh failed',
        correlationId: req.correlationId
      });
    }
  }
);

// AI Chat endpoint - secured and not exposing keys to client
router.post('/ai/chat',
  authenticate,
  securityAuditLog('ai_chat'),
  async (req: Request, res: Response) => {
    try {
      const { messages, model, temperature, maxTokens, useCache } = req.body;

      const response = await secureAIService.chat(
        messages,
        { model, temperature, maxTokens, useCache }
      );

      res.json({
        success: true,
        data: {
          ...response,
          timestamp: new Date().toISOString()
        },
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('AI Chat Error:', error);
      res.status(500).json({
        success: false,
        error: 'AI service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error',
        correlationId: req.correlationId
      });
    }
  }
);

// AI Generation endpoint
router.post('/ai/generate',
  authenticate,
  securityAuditLog('ai_generate'),
  async (req: Request, res: Response) => {
    try {
      const { prompt, type, useCache } = req.body;

      const response = await secureAIService.generate(prompt, type, useCache);

      res.json({
        success: true,
        data: {
          ...response,
          timestamp: new Date().toISOString()
        },
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('AI Generation Error:', error);
      res.status(500).json({
        success: false,
        error: 'AI service temporarily unavailable',
        details: error instanceof Error ? error.message : 'Unknown error',
        correlationId: req.correlationId
      });
    }
  }
);

// Cache management endpoints (admin only)
router.post('/cache/clear',
  authenticate,
  async (req: Request, res: Response) => {
    // In a real implementation, check if user is admin
    secureAIService.clearCache();
    logger.info('Cache cleared by admin request', {
      userId: req.user?.id,
      correlationId: req.correlationId
    });

    res.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      correlationId: req.correlationId
    });
  }
);

router.get('/cache/stats',
  authenticate,
  async (req: Request, res: Response) => {
    const stats = secureAIService.getCacheStats();
    
    res.json({
      success: true,
      stats,
      correlationId: req.correlationId
    });
  }
);

export default router;