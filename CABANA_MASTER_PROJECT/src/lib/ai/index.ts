// AI Module - Secure, modular AI integration for FansWorld
// Replaces the monolithic ai-html-generator.ts with focused, maintainable modules

export * from './types'
export * from './cache'
export * from './templates'
export * from './client'
export * from './generator'

// Main exports for backward compatibility
export { htmlGenerator as default } from './generator'
export { htmlGenerator, aiHTMLClient, templateManager } from './generator'
export { MemoryCache, htmlCache, promptCache, templateCache } from './cache'

// Re-export types for convenience
export type { 
  AIGenerationOptions,
  GenerationResult,
  TemplateContext,
  CacheItem,
  GenerationType
} from './types'