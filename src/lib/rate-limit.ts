import rateLimit from 'express-rate-limit';

// Basic rate limiting for sensitive routes
export const createRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs, // 15 minutes default
    max, // limit each IP to max requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests (only count errors/failures)
    skipSuccessfulRequests: false,
    // Skip failed requests (only count successful requests)
    skipFailedRequests: false,
  });
};

// Stricter rate limiting for auth endpoints
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 requests per 15 minutes

// Moderate rate limiting for API endpoints
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// Stricter rate limiting for payment endpoints
export const paymentRateLimit = createRateLimit(60 * 60 * 1000, 10); // 10 requests per hour

// Very strict rate limiting for admin endpoints
export const adminRateLimit = createRateLimit(15 * 60 * 1000, 20); // 20 requests per 15 minutes