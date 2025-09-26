import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { logger } from './security-enhanced';

// Initialize Supabase client for auth operations
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

// User roles enum
export enum UserRole {
  FAN = 'fan',
  CREATOR = 'creator',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Extended user interface
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      userId?: string;
      userRole?: UserRole;
    }
  }
}

// JWT token validation schema
const tokenSchema = z.object({
  sub: z.string(), // User ID
  email: z.string().email(),
  role: z.nativeEnum(UserRole).default(UserRole.FAN),
  aud: z.string(),
  exp: z.number(),
  iat: z.number()
});

/**
 * Extract and validate Bearer token from Authorization header
 */
const extractBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Verify JWT token with Supabase
 */
const verifyToken = async (token: string): Promise<AuthenticatedUser | null> => {
  try {
    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn('Token verification failed', { error: error?.message });
      return null;
    }

    // Get additional user data from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username, role, verified, created_at')
      .eq('id', user.id)
      .single();

    if (userError) {
      logger.warn('Failed to fetch user data', {
        userId: user.id,
        error: userError.message
      });
      // Return basic user info if custom data unavailable
      return {
        id: user.id,
        email: user.email!,
        username: user.email!.split('@')[0], // Fallback username
        role: UserRole.FAN,
        verified: user.email_confirmed_at !== null,
        createdAt: user.created_at
      };
    }

    return {
      id: user.id,
      email: user.email!,
      username: userData.username || user.email!.split('@')[0],
      role: userData.role || UserRole.FAN,
      verified: userData.verified || user.email_confirmed_at !== null,
      createdAt: userData.created_at || user.created_at
    };

  } catch (error) {
    logger.error('Token verification error', { error });
    return null;
  }
};

/**
 * Middleware to authenticate requests
 * Sets req.user if valid token is provided
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      // No token provided - continue without authentication
      return next();
    }

    const user = await verifyToken(token);

    if (user) {
      req.user = user;
      req.userId = user.id;
      req.userRole = user.role;

      logger.debug('User authenticated', {
        userId: user.id,
        role: user.role,
        correlationId: req.correlationId
      });
    } else {
      logger.warn('Invalid token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        correlationId: req.correlationId
      });
    }

    next();
  } catch (error) {
    logger.error('Authentication middleware error', {
      error,
      correlationId: req.correlationId
    });
    next(); // Continue without authentication
  }
};

/**
 * Middleware to require authentication
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn('Unauthenticated request to protected route', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      correlationId: req.correlationId
    });

    return res.status(401).json({
      error: 'authentication_required',
      message: 'Authentication required to access this resource',
      correlationId: req.correlationId
    });
  }

  next();
};

/**
 * Middleware to require specific role
 */
export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: req.correlationId
      });
    }

    if (req.user.role !== requiredRole) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        requiredRole,
        userRole: req.user.role,
        path: req.path,
        correlationId: req.correlationId
      });

      return res.status(403).json({
        error: 'insufficient_permissions',
        message: `${requiredRole} role required`,
        correlationId: req.correlationId
      });
    }

    next();
  };
};

/**
 * Middleware to require any of the specified roles
 */
export const requireAnyRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: req.correlationId
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        allowedRoles,
        userRole: req.user.role,
        path: req.path,
        correlationId: req.correlationId
      });

      return res.status(403).json({
        error: 'insufficient_permissions',
        message: `One of the following roles required: ${allowedRoles.join(', ')}`,
        correlationId: req.correlationId
      });
    }

    next();
  };
};

/**
 * Middleware to require resource ownership or admin/moderator role
 */
export const requireResourceOwnershipOrRole = (
  resourceUserIdParam: string,
  allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MODERATOR]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: req.correlationId
      });
    }

    const resourceUserId = req.params[resourceUserIdParam] || req.body[resourceUserIdParam];

    // Allow if user owns the resource
    if (req.user.id === resourceUserId) {
      return next();
    }

    // Allow if user has required role
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    logger.warn('Access denied - not owner and insufficient role', {
      userId: req.user.id,
      resourceUserId,
      userRole: req.user.role,
      allowedRoles,
      path: req.path,
      correlationId: req.correlationId
    });

    return res.status(403).json({
      error: 'access_denied',
      message: 'You can only access your own resources',
      correlationId: req.correlationId
    });
  };
};

/**
 * Middleware to require verified email
 */
export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'authentication_required',
      message: 'Authentication required',
      correlationId: req.correlationId
    });
  }

  if (!req.user.verified) {
    logger.warn('Unverified user attempting protected action', {
      userId: req.user.id,
      path: req.path,
      correlationId: req.correlationId
    });

    return res.status(403).json({
      error: 'email_verification_required',
      message: 'Email verification required to perform this action',
      correlationId: req.correlationId
    });
  }

  next();
};

/**
 * Role hierarchy check - higher roles include lower role permissions
 */
const roleHierarchy: Record<UserRole, number> = {
  [UserRole.FAN]: 1,
  [UserRole.CREATOR]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4
};

/**
 * Middleware to require minimum role level
 */
export const requireMinimumRole = (minimumRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: req.correlationId
      });
    }

    const userRoleLevel = roleHierarchy[req.user.role];
    const requiredRoleLevel = roleHierarchy[minimumRole];

    if (userRoleLevel < requiredRoleLevel) {
      logger.warn('Insufficient role level', {
        userId: req.user.id,
        userRole: req.user.role,
        userRoleLevel,
        requiredRole: minimumRole,
        requiredRoleLevel,
        path: req.path,
        correlationId: req.correlationId
      });

      return res.status(403).json({
        error: 'insufficient_permissions',
        message: `Minimum role required: ${minimumRole}`,
        correlationId: req.correlationId
      });
    }

    next();
  };
};

/**
 * Utility function to check if user has permission
 */
export const hasPermission = (user: AuthenticatedUser | undefined, requiredRole: UserRole): boolean => {
  if (!user) return false;
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * Get user profile data safely
 */
export const getUserProfile = (user: AuthenticatedUser): Partial<AuthenticatedUser> => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    verified: user.verified
  };
};

export default {
  authenticate,
  requireAuth,
  requireRole,
  requireAnyRole,
  requireResourceOwnershipOrRole,
  requireVerified,
  requireMinimumRole,
  hasPermission,
  getUserProfile,
  UserRole
};