// Enhanced security middleware following clean architecture principles
import { Request, Response, NextFunction } from 'express';
import { getContainer } from '../infrastructure/container/Container';
import { AuthService } from '../domain/services/AuthService';
import { logger } from './security-enhanced';
import { UnauthorizedError } from '../domain/errors';
import { Role } from '../domain/value-objects/Role';

interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: string;
  verified: boolean;
  createdAt: Date;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Authentication middleware that validates JWT tokens
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authService = getContainer().resolve<AuthService>('authService');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      return next();
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await authService.verifyToken(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.value,
        verified: user.verified,
        createdAt: user.createdAt
      };
      req.userId = user.id;
      req.userRole = user.role.value;

      logger.debug('User authenticated', {
        userId: user.id,
        role: user.role.value,
        correlationId: (req as any).correlationId
      });
    } else {
      logger.warn('Invalid token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        correlationId: (req as any).correlationId
      });
    }

    next();
  } catch (error) {
    logger.error('Authentication middleware error', {
      error,
      correlationId: (req as any).correlationId
    });
    next(); // Continue without authentication to maintain current behavior
  }
};

/**
 * Require authentication middleware
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn('Unauthenticated request to protected route', {
      path: req.path,
      method: req.method,
      ip: req.ip,
      correlationId: (req as any).correlationId
    });

    return res.status(401).json({
      error: 'authentication_required',
      message: 'Authentication required to access this resource',
      correlationId: (req as any).correlationId
    });
  }

  next();
};

/**
 * Require specific role middleware
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: (req as any).correlationId
      });
    }

    if (req.user.role !== requiredRole) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        requiredRole,
        userRole: req.user.role,
        path: req.path,
        correlationId: (req as any).correlationId
      });

      return res.status(403).json({
        error: 'insufficient_permissions',
        message: `${requiredRole} role required`,
        correlationId: (req as any).correlationId
      });
    }

    next();
  };
};

/**
 * Require any of the specified roles
 */
export const requireAnyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: (req as any).correlationId
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        allowedRoles,
        userRole: req.user.role,
        path: req.path,
        correlationId: (req as any).correlationId
      });

      return res.status(403).json({
        error: 'insufficient_permissions',
        message: `One of the following roles required: ${allowedRoles.join(', ')}`,
        correlationId: (req as any).correlationId
      });
    }

    next();
  };
};

/**
 * Require resource ownership or admin/moderator role
 */
export const requireResourceOwnershipOrRole = (
  resourceUserIdParam: string,
  allowedRoles: string[] = [Role.ADMIN.value, Role.MODERATOR.value]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'authentication_required',
        message: 'Authentication required',
        correlationId: (req as any).correlationId
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
      correlationId: (req as any).correlationId
    });

    return res.status(403).json({
      error: 'access_denied',
      message: 'You can only access your own resources',
      correlationId: (req as any).correlationId
    });
  };
};

export default {
  authenticate,
  requireAuth,
  requireRole,
  requireAnyRole,
  requireResourceOwnershipOrRole
};