// AI module type definitions

export interface AIGenerationOptions {
  provider?: 'openai' | 'anthropic' | 'local';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerationResult {
  html: string;
  metadata?: {
    tokensUsed?: number;
    generationTime?: number;
    provider?: string;
  };
}

export interface TemplateContext {
  title?: string;
  description?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  layout?: 'single' | 'multi' | 'grid';
  responsive?: boolean;
  animations?: boolean;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export type GenerationType = 
  | 'landing-page' 
  | 'portfolio' 
  | 'blog-post' 
  | 'component' 
  | 'email-template'
  | 'dashboard'
  | 'form'
  | 'gallery';