import { Router } from 'express';
import { body } from 'express-validator';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import {
  authenticate,
  requireAuth,
  UserRole,
  getUserProfile
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  referralCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Registration endpoint
router.post('/register',
  securityAuditLog('user_registration'),
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/)
  ]),
  async (req, res) => {
    try {
      const { email, password, username, referralCode } = registerSchema.parse(req.body);

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return res.status(409).json({
          error: 'username_taken',
          message: 'Username is already taken',
          correlationId: req.correlationId
        });
      }

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // Require email verification
        user_metadata: {
          username,
          referralCode
        }
      });

      if (authError) {
        logger.error('User registration failed', {
          error: authError.message,
          correlationId: req.correlationId
        });

        if (authError.message.includes('already registered')) {
          return res.status(409).json({
            error: 'email_taken',
            message: 'Email is already registered',
            correlationId: req.correlationId
          });
        }

        return res.status(400).json({
          error: 'registration_failed',
          message: authError.message,
          correlationId: req.correlationId
        });
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      // Create user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          username,
          role: UserRole.FAN,
          verified: false,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        logger.error('User profile creation failed', {
          userId: authData.user.id,
          error: profileError.message,
          correlationId: req.correlationId
        });

        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);

        return res.status(500).json({
          error: 'profile_creation_failed',
          message: 'Failed to create user profile',
          correlationId: req.correlationId
        });
      }

      logger.info('User registered successfully', {
        userId: authData.user.id,
        username,
        email,
        correlationId: req.correlationId
      });

      // Generate access token
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email,
        password,
      });

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email,
          username,
          role: UserRole.FAN,
          verified: false
        },
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Registration endpoint error', {
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
        error: 'registration_failed',
        message: 'Registration failed. Please try again.',
        correlationId: req.correlationId
      });
    }
  }
);

// Login endpoint
router.post('/login',
  securityAuditLog('user_login'),
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ]),
  async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        logger.warn('Login attempt failed', {
          email,
          error: error?.message,
          ip: req.ip,
          correlationId: req.correlationId
        });

        return res.status(401).json({
          error: 'invalid_credentials',
          message: 'Invalid email or password',
          correlationId: req.correlationId
        });
      }

      // Get user profile from our users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('username, role, verified')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        logger.error('Failed to fetch user profile on login', {
          userId: data.user.id,
          error: profileError.message,
          correlationId: req.correlationId
        });
      }

      const user = {
        id: data.user.id,
        email: data.user.email!,
        username: userProfile?.username || data.user.email!.split('@')[0],
        role: userProfile?.role || UserRole.FAN,
        verified: userProfile?.verified || data.user.email_confirmed_at !== null
      };

      logger.info('User logged in successfully', {
        userId: user.id,
        username: user.username,
        role: user.role,
        correlationId: req.correlationId
      });

      res.json({
        message: 'Login successful',
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        correlationId: req.correlationId
      });

    } catch (error) {
      logger.error('Login endpoint error', {
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
        error: 'login_failed',
        message: 'Login failed. Please try again.',
        correlationId: req.correlationId
      });
    }
  }
);

// Logout endpoint
router.post('/logout',
  authenticate,
  securityAuditLog('user_logout'),
  async (req, res) => {
    try {
      if (req.user) {
        // Extract JWT token
        const token = req.headers.authorization?.substring(7);

        if (token) {
          // Sign out the session
          const { error } = await supabase.auth.admin.signOut(token);

          if (error) {
            logger.warn('Logout error', {
              userId: req.user.id,
              error: error.message,
              correlationId: req.correlationId
            });
          } else {
            logger.info('User logged out successfully', {
              userId: req.user.id,
              correlationId: req.correlationId
            });
          }
        }
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
  async (req, res) => {
    try {
      res.json({
        user: getUserProfile(req.user!),
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
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data.session) {
        logger.warn('Token refresh failed', {
          error: error?.message,
          ip: req.ip,
          correlationId: req.correlationId
        });

        return res.status(401).json({
          error: 'invalid_refresh_token',
          message: 'Invalid or expired refresh token',
          correlationId: req.correlationId
        });
      }

      logger.info('Token refreshed successfully', {
        userId: data.user?.id,
        correlationId: req.correlationId
      });

      res.json({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
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

export default router;