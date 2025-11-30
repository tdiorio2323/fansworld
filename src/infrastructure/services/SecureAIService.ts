import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { logger } from '../../lib/security-enhanced';
import { DomainError } from '../../domain/errors';

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatOptions {
  model?: 'claude' | 'gpt';
  temperature?: number;
  maxTokens?: number;
  useCache?: boolean;
}

export interface AIChatResponse {
  message: string;
  model: string;
  tokensUsed: number;
  cached: boolean;
}

export interface AIGenerationResponse {
  content: string;
  type: string;
  tokensUsed: number;
  cached: boolean;
}

export class SecureAIService {
  private readonly claude: Anthropic;
  private readonly openai: OpenAI;
  private readonly cache = new Map<string, { data: any; expires: number }>();

  constructor() {
    // Ensure keys are only used server-side, not exposed in client builds
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!anthropicApiKey) {
      throw new DomainError('Anthropic API key is required');
    }

    if (!openaiApiKey) {
      throw new DomainError('OpenAI API key is required');
    }

    this.claude = new Anthropic({
      apiKey: anthropicApiKey,
    });

    this.openai = new OpenAI({
      apiKey: openaiApiKey,
    });
  }

  async chat(
    messages: AIChatMessage[],
    options: AIChatOptions = {}
  ): Promise<AIChatResponse> {
    const { model = 'claude', temperature = 0.7, maxTokens = 1000, useCache = true } = options;

    // Create cache key
    const cacheKey = this.createCacheKey('chat', model, messages, temperature, maxTokens);

    // Check cache first
    if (useCache) {
      const cached = this.getFromCache<AIChatResponse>(cacheKey);
      if (cached) {
        return {
          ...cached,
          cached: true
        };
      }
    }

    let response: string;
    let tokensUsed = 0;

    try {
      if (model === 'claude') {
        const result = await this.claude.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          temperature,
          messages: messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            }))
        });

        response = result.content[0]?.type === 'text' ? result.content[0].text : '';
        tokensUsed = result.usage?.input_tokens + result.usage?.output_tokens || 0;
      } else {
        const result = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: messages.map(m => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content
          })),
          temperature,
          max_tokens: maxTokens
        });

        response = result.choices[0]?.message?.content || '';
        tokensUsed = result.usage?.total_tokens || 0;
      }

      const result: AIChatResponse = {
        message: response,
        model,
        tokensUsed,
        cached: false
      };

      // Cache the response
      if (useCache && response) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      logger.error('AI chat error', { error, messages, model });
      throw new DomainError(`AI service error: ${error}`);
    }
  }

  async generate(
    prompt: string,
    type: string = 'social',
    useCache: boolean = true
  ): Promise<AIGenerationResponse> {
    const cacheKey = this.createCacheKey('generate', type, prompt);

    // Check cache first
    if (useCache) {
      const cached = this.getFromCache<AIGenerationResponse>(cacheKey);
      if (cached) {
        return {
          ...cached,
          cached: true
        };
      }
    }

    // Generate system prompt based on type
    const systemPrompts: Record<string, string> = {
      bio: 'You are an expert at writing engaging personal bios for content creators. Write compelling, authentic bios that highlight personality and appeal.',
      social: 'You are a social media expert. Create engaging, shareable content that drives interaction and builds community.',
      email: 'You are an email marketing specialist. Write compelling email content that converts and builds relationships.',
      description: 'You are a copywriter specializing in product and service descriptions. Write clear, compelling descriptions that drive action.',
      marketing: 'You are a marketing expert. Create persuasive marketing copy that drives conversions and builds brand awareness.',
      html: 'You are an expert HTML/CSS generator. Create modern, responsive, accessible web components.'
    };

    const systemPrompt = systemPrompts[type] || systemPrompts.social;
    const messages: AIChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const result = await this.claude.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.8,
      messages: messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    });

    const response = result.content[0]?.type === 'text' ? result.content[0].text : '';
    const tokensUsed = result.usage?.input_tokens + result.usage?.output_tokens || 0;

    const generationResult: AIGenerationResponse = {
      content: response,
      type,
      tokensUsed,
      cached: false
    };

    // Cache the response
    if (useCache && response) {
      this.setCache(cacheKey, generationResult);
    }

    return generationResult;
  }

  private createCacheKey(operation: string, ...params: any[]): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data as T;
  }

  private setCache(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}