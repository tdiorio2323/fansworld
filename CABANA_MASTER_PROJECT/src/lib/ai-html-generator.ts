// LEGACY: AI HTML Generator Service - REPLACED WITH MODULAR SYSTEM
// This file is now a thin wrapper around the new modular AI system
// Import from ./ai/ modules for new implementations

// New modular AI system
import { htmlGenerator } from './ai'
export { htmlGenerator as default }

// Legacy compatibility exports
export * from './ai/types'
export { htmlGenerator, aiHTMLClient, templateManager } from './ai'

// Legacy interface re-exports for backward compatibility
export type {
  AIGenerationOptions,
  GenerationResult,
  TemplateContext,
  GenerationType
} from './ai/types'

