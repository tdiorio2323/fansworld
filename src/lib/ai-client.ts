import { getApiUrl } from './env'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ContentGeneration {
  type: 'bio' | 'social' | 'email' | 'description' | 'marketing' | 'html'
  content: string
  metadata?: {
    title?: string
    platform?: string
    audience?: string
    tone?: string
  }
}

export interface ChatResponse {
  success: boolean
  data?: {
    message: string
    model: string
    tokensUsed: number
    cached: boolean
    timestamp: string
  }
  error?: string
  details?: string
}

export interface GenerateResponse {
  success: boolean
  data?: {
    content: string
    type: string
    tokensUsed: number
    cached: boolean
    timestamp: string
  }
  error?: string
  details?: string
}

class SecureAIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = getApiUrl()
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`AI API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Chat with AI (Claude or GPT)
  async chat(
    messages: AIMessage[],
    options: {
      model?: 'claude' | 'gpt'
      temperature?: number
      maxTokens?: number
      useCache?: boolean
    } = {}
  ): Promise<string> {
    const response = await this.makeRequest<ChatResponse>('/api/ai/chat', {
      messages,
      ...options
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'AI chat failed')
    }

    return response.data.message
  }

  // Generate content
  async generate(
    prompt: string,
    type: ContentGeneration['type'] = 'social',
    useCache: boolean = true
  ): Promise<string> {
    const response = await this.makeRequest<GenerateResponse>('/api/ai/generate', {
      prompt,
      type,
      useCache
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'AI generation failed')
    }

    return response.data.content
  }

  // Convenience methods for common operations
  async chatWithClaude(messages: AIMessage[]): Promise<string> {
    return this.chat(messages, { model: 'claude' })
  }

  async chatWithGPT(messages: AIMessage[]): Promise<string> {
    return this.chat(messages, { model: 'gpt' })
  }

  async generateBio(prompt: string): Promise<string> {
    return this.generate(prompt, 'bio')
  }

  async generateSocialPost(prompt: string): Promise<string> {
    return this.generate(prompt, 'social')
  }

  async generateEmail(prompt: string): Promise<string> {
    return this.generate(prompt, 'email')
  }

  async generateMarketing(prompt: string): Promise<string> {
    return this.generate(prompt, 'marketing')
  }

  async generateHTML(prompt: string): Promise<string> {
    return this.generate(prompt, 'html')
  }

  // Check API health
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/api/health`)
    if (!response.ok) {
      throw new Error('API health check failed')
    }
    return await response.json()
  }

  // Clear cache
  async clearCache(): Promise<void> {
    await this.makeRequest('/api/cache/clear', {})
  }
}

// Export singleton instance
export const aiClient = new SecureAIClient()

// Legacy compatibility - gradually migrate from ai-engine.ts to this
export default aiClient