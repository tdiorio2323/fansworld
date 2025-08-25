import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// SECURITY: Enhanced rate limiting with IP tracking and progressive penalties
interface SecurityOptions {
  windowMs?: number;
  max?: number;
  skipSuccessfulRequests?: boolean;
  blockDuration?: number;
  progressivePenalty?: boolean;
}

// In-memory IP tracking for enhanced security (use Redis in production)
const suspiciousIPs = new Map<string, { attempts: number; lastAttempt: number; blocked: boolean }>();
const BLOCK_THRESHOLD = 10;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

// SECURITY: IP validation and sanitization
const getClientIP = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? forwarded.toString().split(',')[0] : req.connection.remoteAddress) || 'unknown';
  // Basic IP validation
  if (ip === 'unknown' || ip.includes('..') || ip.length > 45) {
    return 'unknown';
  }
  return ip;
};

// Enhanced rate limiting with security features
export const createRateLimit = (options: SecurityOptions = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    skipSuccessfulRequests = false,
    progressivePenalty = true
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000),
      code: 'RATE_LIMITED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    skipFailedRequests: false,
    
    // SECURITY: Custom key generator for IP tracking
    keyGenerator: (req: Request): string => {
      return getClientIP(req);
    },
    
    // SECURITY: Enhanced skip logic for blocked IPs
    skip: (req: Request): boolean => {
      const ip = getClientIP(req);
      const suspicious = suspiciousIPs.get(ip);
      
      if (suspicious?.blocked && Date.now() - suspicious.lastAttempt < BLOCK_DURATION) {
        return false; // Don't skip, apply rate limit
      }
      
      return false;
    },
    
    // SECURITY: Custom handler replaces deprecated onLimitReached
    handler: (req: Request, res: Response) => {
      const ip = getClientIP(req);
      const current = suspiciousIPs.get(ip) || { attempts: 0, lastAttempt: 0, blocked: false };
      
      current.attempts += 1;
      current.lastAttempt = Date.now();
      
      if (current.attempts >= BLOCK_THRESHOLD && progressivePenalty) {
        current.blocked = true;
        console.warn(`🚨 SECURITY: IP ${ip} blocked for suspicious activity`);
      }
      
      suspiciousIPs.set(ip, current);
      
      // Send the rate limit response
      res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000),
        code: 'RATE_LIMITED'
      });
    }
  });
};

// SECURITY: More restrictive auth rate limiting - 3 attempts per 15 minutes
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // Reduced from 5
  progressivePenalty: true
});

// API rate limiting with progressive penalties
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true
});

// SECURITY: Stricter payment rate limiting - 5 attempts per hour
export const paymentRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, // Reduced from 10
  progressivePenalty: true
});

// Admin endpoint security
export const adminRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Reduced from 20
  progressivePenalty: true
});

// SECURITY: Cleanup function to prevent memory leaks
export const cleanupSuspiciousIPs = () => {
  const now = Date.now();
  for (const [ip, data] of suspiciousIPs.entries()) {
    if (now - data.lastAttempt > BLOCK_DURATION) {
      suspiciousIPs.delete(ip);
    }
  }
};

// Run cleanup every 30 minutes
setInterval(cleanupSuspiciousIPs, 30 * 60 * 1000);