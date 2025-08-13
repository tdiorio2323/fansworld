import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { config } from 'dotenv'
import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { z } from 'zod'
import { authRateLimit, apiRateLimit, paymentRateLimit, adminRateLimit } from '../src/lib/rate-limit'

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3001

// Environment validation
const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'Anthropic API key is required'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  VITE_SITE_URL: z.string().url().default('http://localhost:5173'),
})

const env = envSchema.parse(process.env)

// Initialize AI clients (server-side only)
const claude = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
  // No dangerouslyAllowBrowser - secure server-side only
})

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  // No dangerouslyAllowBrowser - secure server-side only
})

// CORS configuration - strict origin checking
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [env.VITE_SITE_URL, 'http://localhost:5173', 'http://localhost:4173']
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS policy violation: ${origin} not allowed`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

// Rate limiting - 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use('/api', apiRateLimit) // General API rate limiting
app.use('/api/auth', authRateLimit) // Stricter auth rate limiting  
app.use('/api/payment', paymentRateLimit) // Payment endpoint rate limiting
app.use('/api/admin', adminRateLimit) // Admin endpoint rate limiting

// Simple in-memory cache with TTL
interface CacheItem<T> {
  data: T
  expires: number
}

class SimpleCache<T> {
  private cache = new Map<string, CacheItem<T>>()

  set(key: string, data: T, ttlMs: number = 300000): void { // 5 min default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear(): void {
    this.cache.clear()
  }
}

const aiCache = new SimpleCache<string>()

// AI endpoint schemas
const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000)
  })).min(1).max(50),
  model: z.enum(['claude', 'gpt']).default('claude'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(1000),
  useCache: z.boolean().default(true)
})

const generateRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
  type: z.enum(['bio', 'social', 'email', 'description', 'marketing', 'html']).default('social'),
  useCache: z.boolean().default(true)
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  })
})

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const body = chatRequestSchema.parse(req.body)
    const { messages, model, temperature, maxTokens, useCache } = body
    
    // Create cache key
    const cacheKey = `chat:${model}:${JSON.stringify(messages)}:${temperature}:${maxTokens}`
    
    // Check cache first
    if (useCache) {
      const cached = aiCache.get(cacheKey)
      if (cached) {
        return res.json({
          success: true,
          data: {
            message: cached,
            model,
            cached: true,
            timestamp: new Date().toISOString()
          }
        })
      }
    }

    let response: string
    let tokensUsed = 0

    if (model === 'claude') {
      const result = await claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        temperature,
        messages: messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      })
      
      response = result.content[0]?.type === 'text' ? result.content[0].text : ''
      tokensUsed = result.usage.input_tokens + result.usage.output_tokens
    } else {
      const result = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content
        })),
        temperature,
        max_tokens: maxTokens
      })
      
      response = result.choices[0]?.message?.content || ''
      tokensUsed = result.usage?.total_tokens || 0
    }

    // Cache the response
    if (useCache && response) {
      aiCache.set(cacheKey, response)
    }

    res.json({
      success: true,
      data: {
        message: response,
        model,
        tokensUsed,
        cached: false,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// AI Generation endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const body = generateRequestSchema.parse(req.body)
    const { prompt, type, useCache } = body
    
    const cacheKey = `generate:${type}:${prompt}`
    
    // Check cache first
    if (useCache) {
      const cached = aiCache.get(cacheKey)
      if (cached) {
        return res.json({
          success: true,
          data: {
            content: cached,
            type,
            cached: true,
            timestamp: new Date().toISOString()
          }
        })
      }
    }

    // Generate system prompt based on type
    const systemPrompts = {
      bio: 'You are an expert at writing engaging personal bios for content creators. Write compelling, authentic bios that highlight personality and appeal.',
      social: 'You are a social media expert. Create engaging, shareable content that drives interaction and builds community.',
      email: 'You are an email marketing specialist. Write compelling email content that converts and builds relationships.',
      description: 'You are a copywriter specializing in product and service descriptions. Write clear, compelling descriptions that drive action.',
      marketing: 'You are a marketing expert. Create persuasive marketing copy that drives conversions and builds brand awareness.',
      html: 'You are an expert HTML/CSS generator. Create modern, responsive, accessible web components.'
    }

    const systemPrompt = systemPrompts[type]
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: prompt }
    ]

    const result = await claude.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.8,
      messages
    })
    
    const response = result.content[0]?.type === 'text' ? result.content[0].text : ''
    
    // Cache the response
    if (useCache && response) {
      aiCache.set(cacheKey, response)
    }

    res.json({
      success: true,
      data: {
        content: response,
        type,
        tokensUsed: result.usage.input_tokens + result.usage.output_tokens,
        cached: false,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Cache management endpoints
app.post('/api/cache/clear', (req, res) => {
  aiCache.clear()
  res.json({ success: true, message: 'Cache cleared successfully' })
})

app.get('/api/cache/stats', (req, res) => {
  res.json({ 
    success: true, 
    stats: {
      // Note: Simple cache doesn't track these stats, but we provide structure
      size: 0,
      hits: 0,
      misses: 0
    }
  })
})

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Secure API server running on port ${PORT}`)
  console.log(`📡 CORS enabled for: ${env.VITE_SITE_URL}`)
  console.log(`⚡ Rate limit: 60 requests/minute`)
  console.log(`🔒 AI keys secure (server-side only)`)
})

export default app