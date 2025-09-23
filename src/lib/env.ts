import { z } from 'zod'

// Server-side environment schema
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default(3001),
  
  // AI Services (server-only)
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  
  // Database
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  
  // Email
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required'),
  
  // Security
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
})

// Client-side environment schema (VITE_ prefixed)
const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  VITE_VIP_CODE: z.string().min(1, 'VIP code is required'),
  VITE_GA_TRACKING_ID: z.string().optional(),
  VITE_CORS_ORIGIN: z.string().url('Invalid CORS origin').default('http://localhost:5173'),
  VITE_API_URL: z.string().url('Invalid API URL').default('http://localhost:3001'),
  VITE_SITE_URL: z.string().url('Invalid site URL').default('http://localhost:5173'),
  
  // Feature flags
  FLAG_VIP_V2: z.string().transform(val => val === 'true').default(false),
  FLAG_TIP_GOALS: z.string().transform(val => val === 'true').default(false),
  FLAG_LT_OFFERS: z.string().transform(val => val === 'true').default(false),
  FLAG_MOD_QUEUE_V2: z.string().transform(val => val === 'true').default(false),
})

// Server environment validation
function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid server environment variables:', error)
    throw new Error('Server environment validation failed')
  }
}

// Client environment validation
function validateClientEnv() {
  try {
    // Handle both Vite and Next.js environments
    const env = typeof window !== 'undefined' ? 
      {...process.env, ...(window as any).process?.env} : 
      process.env;
    return clientEnvSchema.parse(env)
  } catch (error) {
    console.warn('❌ Invalid client environment variables:', error)
    // Return safe defaults for development
    return {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      VITE_STRIPE_PUBLISHABLE_KEY: '',
      VITE_VIP_CODE: '',
      VITE_CORS_ORIGIN: 'http://localhost:5173',
      VITE_API_URL: 'http://localhost:3001',
      VITE_SITE_URL: 'http://localhost:5173',
      FLAG_VIP_V2: false,
      FLAG_TIP_GOALS: false,
      FLAG_LT_OFFERS: false,
      FLAG_MOD_QUEUE_V2: false,
    }
  }
}

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

// Validated environment exports
export const serverEnv = typeof process !== 'undefined' ? validateServerEnv() : null
export const clientEnv = typeof window !== 'undefined' ? validateClientEnv() : null

// Utility functions
export function getApiUrl(path: string = ''): string {
  const baseUrl = clientEnv?.VITE_API_URL || 'http://localhost:3001'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function isProduction(): boolean {
  return (serverEnv?.NODE_ENV || clientEnv?.MODE) === 'production'
}

export function isDevelopment(): boolean {
  return (serverEnv?.NODE_ENV || clientEnv?.MODE) === 'development'
}