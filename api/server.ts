import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from 'dotenv';
import { z } from 'zod';
import pinoHttp from 'pino-http';
import {
  securityHeaders,
  trustProxyConfig,
  authRateLimit,
  apiRateLimit,
  mediaUploadRateLimit,
  adminRateLimit,
  speedLimiter,
  bruteForceProtection,
  correlationId,
  securityAuditLog,
  configureForEnvironment,
  secureErrorHandler,
  healthCheck,
  readinessCheck,
  logger,
  bodySizeLimits
} from '../src/lib/security-enhanced';
import { getContainer } from '../src/infrastructure/container/Container';
import { SecureAIService } from '../src/infrastructure/services/SecureAIService';

// Load environment variables
config();

// SECURITY: Enhanced environment validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).default(3001),
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  VITE_SITE_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

const env = envSchema.parse(process.env);

logger.info('Server starting', {
  environment: env.NODE_ENV,
  port: env.PORT,
  logLevel: env.LOG_LEVEL
});

const app = express();

// Get AI service from the container
const aiService = getContainer().resolve<SecureAIService>('aiService');

// Get environment-specific configuration
const configObj = configureForEnvironment();

// SECURITY: Production-grade middleware stack
app.use(trustProxyConfig); // Trust proxy configuration
app.use(correlationId); // Request correlation IDs
app.use(pinoHttp({ logger })); // Request logging
app.use(securityHeaders); // Security headers (Helmet)
app.use(compression()); // Gzip compression
app.use(cors(configObj.cors)); // CORS with environment-specific settings

// Body parsing with size limits
app.use(express.json({ limit: bodySizeLimits.json }));
app.use(express.urlencoded({ extended: true, limit: bodySizeLimits.urlencoded }));
app.use(express.raw({ limit: bodySizeLimits.raw, type: 'application/octet-stream' })); // For media uploads
app.use(express.text({ limit: bodySizeLimits.text }));

// Global rate limiting and slowdown
app.use(speedLimiter);
app.use(apiRateLimit);

// Route-specific rate limiting (applied before routes)
app.use('/api/v1/auth/login', bruteForceProtection.prevent);
app.use('/api/v1/auth/register', authRateLimit);
app.use('/api/v1/media', mediaUploadRateLimit);
app.use('/api/v1/admin', adminRateLimit);

// Health and readiness checks (no auth required)
app.get('/health', healthCheck);
app.get('/ready', readinessCheck);

// Import and mount API routes
import authRoutes from '../src/routes/auth';
import userRoutes from '../src/routes/users';
import mediaRoutes from '../src/routes/media';
import messagingRoutes from '../src/routes/messaging';
import subscriptionRoutes from '../src/routes/subscriptions';
import contentRoutes from '../src/routes/content';
import { authenticate } from '../src/lib/auth-middleware';

// Apply authentication middleware globally
app.use(authenticate);

// Mount API routes with versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/messaging', messagingRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/content', contentRoutes);

// SECURITY: Enhanced health check with security status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
    security: {
      corsEnabled: true,
      rateLimitActive: true,
      securityHeadersActive: true,
      cacheStats: aiService.getCacheStats()
    }
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Cabana API!' });
});

// SECURITY: Enhanced error handling
app.use(secureErrorHandler);

// 404 handler with security audit
app.use((req, res) => {
  logger.warn('404 - Endpoint not found', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    correlationId: (req as any).correlationId
  });

  res.status(404).json({
    error: 'not_found',
    message: 'Endpoint not found',
    path: req.path,
    correlationId: (req as any).correlationId
  });
});

// Graceful shutdown handling
const server = app.listen(env.PORT, () => {
  logger.info('🚀 Production-Ready API Server Started', {
    port: env.PORT,
    environment: env.NODE_ENV,
    features: {
      security_headers: true,
      rate_limiting: true,
      cors_protection: true,
      request_logging: true,
      error_handling: true,
      health_checks: true,
      ai_caching: true,
      brute_force_protection: true
    }
  });
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connections, clear caches, etc.
    aiService.clearCache();

    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;