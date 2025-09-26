import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import ExpressBrute from 'express-brute';
import { z } from 'zod';
import pino from 'pino';

// Enhanced logging
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: process.env.NODE_ENV === 'development'
    }
  },
  base: {
    pid: false
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

// Enhanced Helmet configuration for content platform
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'", // Required for development
        "'unsafe-inline'", // Required for Next.js
        "https://js.stripe.com",
        "https://checkout.stripe.com"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://uploads.stripe.com",
        "https://*.supabase.co",
        "wss://*.supabase.co", // WebSocket for real-time
        process.env.VITE_SITE_URL || 'http://localhost:5173'
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:", // Allow HTTPS images from CDNs
        "https://*.supabase.co", // Supabase storage
      ],
      mediaSrc: [
        "'self'",
        "blob:",
        "https:", // Allow HTTPS media from CDNs
        "https://*.supabase.co"
      ],
      frameSrc: [
        "https://js.stripe.com",
        "https://hooks.stripe.com"
      ],
      formAction: ["'self'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Trust proxy settings for production
export const trustProxyConfig = (req: Request, res: Response, next: NextFunction) => {
  // Trust first proxy in production (Vercel, Railway, etc.)
  if (process.env.NODE_ENV === 'production') {
    req.app.set('trust proxy', 1);
  }
  next();
};

// Enhanced rate limiting with different tiers
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'rate_limit_exceeded',
    message: 'Too many authentication attempts, please try again later',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1'
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: {
    error: 'rate_limit_exceeded',
    message: 'API rate limit exceeded, please slow down',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const mediaUploadRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: {
    error: 'upload_rate_limit_exceeded',
    message: 'Upload rate limit exceeded, please wait before uploading again',
    retryAfter: 60
  },
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return (req as any).userId || req.ip;
  }
});

export const adminRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // Higher limit for admin operations
  message: {
    error: 'admin_rate_limit_exceeded',
    message: 'Admin rate limit exceeded',
    retryAfter: 60
  }
});

// Slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 50, // Start slowing down after 50 requests
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 10000 // Maximum delay of 10 seconds
});

// Brute force protection for login attempts
export const bruteForceProtection = new ExpressBrute(
  // In-memory store (use Redis in production)
  new ExpressBrute.MemoryStore(),
  {
    freeRetries: 3, // Allow 3 free attempts
    minWait: 5 * 60 * 1000, // 5 minutes
    maxWait: 15 * 60 * 1000, // 15 minutes
    lifetime: 24 * 60 * 60, // 24 hours
    failCallback: (req, res, next, nextValidRequestDate) => {
      logger.warn('Brute force attack detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        nextValidRequestDate
      });

      res.status(429).json({
        error: 'brute_force_detected',
        message: 'Too many failed attempts, account temporarily locked',
        retryAfter: Math.round((nextValidRequestDate.getTime() - Date.now()) / 1000)
      });
    }
  }
);

// Input validation and sanitization
export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorDetails = errors.array().map((error: ValidationError) => ({
        field: 'path' in error ? error.path : 'unknown',
        message: error.msg,
        value: 'value' in error ? error.value : undefined
      }));

      logger.warn('Validation error', {
        ip: req.ip,
        path: req.path,
        errors: errorDetails
      });

      return res.status(400).json({
        error: 'validation_error',
        message: 'Invalid request data',
        details: errorDetails
      });
    }

    next();
  };
};

// Body size limits
export const bodySizeLimits = {
  json: '10mb', // General API requests
  raw: '100mb', // Media uploads
  urlencoded: '10mb',
  text: '1mb'
};

// Request correlation ID
export const correlationId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers['x-correlation-id'] as string ||
             `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  req.correlationId = id;
  res.setHeader('X-Correlation-ID', id);

  next();
};

// Security audit logging
export const securityAuditLog = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logData = {
        action,
        userId: (req as any).userId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        correlationId: req.correlationId
      };

      if (res.statusCode >= 400) {
        logger.warn('Security audit - Error response', logData);
      } else {
        logger.info('Security audit - Success', logData);
      }
    });

    next();
  };
};

// Environment-based configuration
export const configureForEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    cors: {
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-CSRF-Token',
        'X-Correlation-ID'
      ],
      exposedHeaders: ['X-CSRF-Token', 'X-Correlation-ID'],
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = new Set([
          process.env.VITE_SITE_URL,
          process.env.FRONTEND_URL,
          'https://fansworld.com',
          'https://www.fansworld.com'
        ].filter(Boolean));

        // Add development origins
        if (isDevelopment) {
          allowedOrigins.add('http://localhost:3000');
          allowedOrigins.add('http://localhost:5173');
          allowedOrigins.add('http://localhost:4173');
          allowedOrigins.add('https://localhost:3000');
          allowedOrigins.add('https://localhost:5173');
        }

        // Production: require origin header
        if (isProduction && !origin) {
          return callback(new Error('CORS: Origin header required in production'));
        }

        // Development: allow requests without origin (e.g., Postman)
        if (isDevelopment && !origin) {
          return callback(null, true);
        }

        if (allowedOrigins.has(origin!)) {
          callback(null, true);
        } else {
          logger.warn('CORS violation', { origin, allowedOrigins: Array.from(allowedOrigins) });
          callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
      }
    },

    rateLimit: isProduction ? {
      api: 60, // Stricter in production
      auth: 3,
      upload: 5,
      admin: 100
    } : {
      api: 1000, // More lenient in development
      auth: 20,
      upload: 50,
      admin: 500
    }
  };
};

// Global error handler with security considerations
export const secureErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.correlationId;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log the full error server-side
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    correlationId,
    ip: req.ip,
    path: req.path,
    method: req.method,
    userId: (req as any).userId
  });

  // Determine response based on error type
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errorCode = err.code || 'internal_error';

  // Security: Don't leak sensitive information in production
  if (isProduction && statusCode === 500) {
    message = 'Internal server error';
    errorCode = 'internal_error';
  }

  // Rate limit errors
  if (err.name === 'RateLimitError') {
    statusCode = 429;
    errorCode = 'rate_limit_exceeded';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'validation_error';
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    statusCode = 403;
    errorCode = 'cors_error';
    message = 'CORS policy violation';
  }

  res.status(statusCode).json({
    error: errorCode,
    message,
    correlationId,
    ...(isDevelopment && { stack: err.stack })
  });
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    correlationId: req.correlationId
  };

  res.json(healthData);
};

// Ready check endpoint (for k8s readiness probes)
export const readinessCheck = async (req: Request, res: Response) => {
  try {
    // Check database connectivity (stub for now)
    // await checkDatabaseConnection();

    // Check external services
    // await checkExternalServices();

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok', // Stub
        storage: 'ok', // Stub
        ai_services: 'ok' // Stub
      },
      correlationId: req.correlationId
    });
  } catch (error) {
    logger.error('Readiness check failed', { error, correlationId: req.correlationId });
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: 'Service dependencies unavailable',
      correlationId: req.correlationId
    });
  }
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
      userId?: string;
      userRole?: string;
    }
  }
}

export default {
  securityHeaders,
  trustProxyConfig,
  authRateLimit,
  apiRateLimit,
  mediaUploadRateLimit,
  adminRateLimit,
  speedLimiter,
  bruteForceProtection,
  validateRequest,
  correlationId,
  securityAuditLog,
  configureForEnvironment,
  secureErrorHandler,
  healthCheck,
  readinessCheck,
  logger
};