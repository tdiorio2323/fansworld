// ENHANCED SECURITY UTILITIES - TD Studios Ecosystem
// Comprehensive security middleware, validation, and protection
// CRITICAL: Server-side security implementation

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { z } from 'zod';

// SECURITY: Comprehensive security middleware for TD Studios ecosystem

// Security headers configuration
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // CSRF Protection
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// CSRF Token Management
const csrfTokens = new Map<string, { token: string; expires: number; used: boolean }>();
const CSRF_EXPIRY = 30 * 60 * 1000; // 30 minutes

export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const setCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    const token = generateCSRFToken();
    const expires = Date.now() + CSRF_EXPIRY;
    
    csrfTokens.set(token, { token, expires, used: false });
    
    res.cookie('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: CSRF_EXPIRY
    });
    
    res.setHeader('X-CSRF-Token', token);
  }
  
  next();
};

export const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] as string || req.cookies['csrf-token'];
  
  if (!token) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing',
      code: 'CSRF_MISSING'
    });
  }
  
  const tokenData = csrfTokens.get(token);
  
  if (!tokenData || tokenData.used || Date.now() > tokenData.expires) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired CSRF token',
      code: 'CSRF_INVALID'
    });
  }
  
  // Mark token as used
  tokenData.used = true;
  
  next();
};

// Enhanced input sanitization (server-side)
export const sanitizeServerInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeServerInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeServerInput(value);
    }
    return sanitized;
  }
  
  return input;
};

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeServerInput(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeServerInput(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeServerInput(req.params);
  }
  
  next();
};

// API Key validation
export const validateApiKeys = () => {
  const requiredKeys = [
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'JWT_SECRET'
  ];
  
  const missing: string[] = [];
  const weak: string[] = [];
  
  for (const key of requiredKeys) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else if (value.length < 32) {
      weak.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing API keys: ${missing.join(', ')}`);
  }
  
  if (weak.length > 0) {
    console.warn(`⚠️ WARNING: Weak API keys detected: ${weak.join(', ')}`);
  }
  
  console.log('✅ All API keys validated');
};

// Enhanced error handler
export const secureErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Log full error details
  console.error('🚨 SERVER ERROR:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Determine error type
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
  }
  
  // Send sanitized error response
  res.status(statusCode).json({
    success: false,
    error: isDev ? error.message : 'An error occurred',
    code: errorCode,
    details: isDev ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID()
  });
};

// Validation schemas
export const commonValidationSchemas = {
  email: z.string().email().max(255),
  password: z.string().min(8).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes'),
  uuid: z.string().uuid(),
  url: z.string().url().max(2048),
  text: z.string().max(10000),
  amount: z.number().positive().max(999999.99)
};

// CLIENT-SIDE UTILITIES (original functions preserved)

/**
 * ENHANCED: Generates a cryptographically secure VIP code
 * @returns {Promise<string>} A secure VIP code
 */
export const generateSecureVipCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const array = new Uint8Array(8)
  
  // Use secure crypto API
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Node.js environment
    const crypto = await import('crypto')
    crypto.randomFillSync(array)
  }
  
  let result = ''
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length]
  }
  
  return result
}

/**
 * Sanitizes error messages for user display
 * @param {any} error - Error object or message
 * @returns {string} Sanitized error message
 */
export const sanitizeErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    // Remove sensitive information from error messages
    const sanitized = error.message
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
      .replace(/\b\d{16,19}\b/g, '[card]')
      .replace(/\b[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}\b/gi, '[id]')
    
    return sanitized
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * ENHANCED: Client-side rate limiting with better security
 * @param {string} key - Unique identifier for rate limiting
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} Whether the action is allowed
 */
export const checkRateLimit = (key: string, maxAttempts: number = 3, windowMs: number = 300000): boolean => {
  const now = Date.now()
  const storageKey = `rateLimit_${key}`
  
  try {
    const stored = localStorage.getItem(storageKey)
    const attempts = stored ? JSON.parse(stored) : []
    
    // Validate stored data
    if (!Array.isArray(attempts)) {
      localStorage.removeItem(storageKey)
      return true
    }
    
    // Remove expired attempts
    const validAttempts = attempts.filter((time: number) => 
      typeof time === 'number' && now - time < windowMs
    )
    
    // Check if we've exceeded the limit (more restrictive default)
    if (validAttempts.length >= maxAttempts) {
      return false
    }
    
    // Add current attempt
    validAttempts.push(now)
    localStorage.setItem(storageKey, JSON.stringify(validAttempts))
    
    return true
  } catch {
    // If localStorage is not available, be more restrictive
    console.warn('Rate limiting unavailable - storage access denied')
    return false
  }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates VIP code format
 * @param {string} code - VIP code to validate
 * @returns {boolean} Whether code format is valid
 */
export const validateVipCode = (code: string): boolean => {
  const codeRegex = /^[A-Z0-9]{8}$/
  return codeRegex.test(code)
}

/**
 * ENHANCED: Client-side input sanitization (basic protection)
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, '') // Remove remaining HTML brackets
    .slice(0, 1000) // Limit length
}

/**
 * Generates a secure session token
 * @returns {string} Session token
 */
export const generateSessionToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Generates a secure session ID
 * @returns {string} Session ID
 */
export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validates VIP code format
 * @param {string} code - VIP code to validate
 * @returns {boolean} Whether code format is valid
 */
export const isValidVipCodeFormat = (code: string): boolean => {
  // Allow various formats: FOUNDER123456, PLATINUM123, GOLD123, EARLY123, or 8-character alphanumeric
  const patterns = [
    /^FOUNDER[A-Z0-9]{6}$/,
    /^PLATINUM[A-Z0-9]{3,6}$/,
    /^GOLD[A-Z0-9]{3,6}$/,
    /^EARLY[A-Z0-9]{3,6}$/,
    /^[A-Z0-9]{8}$/,
    /^[A-Z0-9]{6,12}$/
  ]
  
  return patterns.some(pattern => pattern.test(code))
}