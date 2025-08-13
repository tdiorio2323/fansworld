// SECURE AI ENGINE - All API calls now go through secure server
import { aiClient } from './ai-client'

// Remove direct API clients for security
// All AI operations now go through secure server endpoints

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ContentGeneration {
  type: 'bio' | 'social' | 'email' | 'description' | 'marketing'
  content: string
  metadata?: {
    title?: string
    tags?: string[]
    wordCount?: number
    generatedAt?: string
    model?: string
    [key: string]: string | number | boolean | string[] | undefined
  }
}

export class AIEngine {
  private modelSelector: Map<string, string> = new Map([
    ['creative', 'claude-3-5-sonnet-20241022'],
    ['marketing', 'gpt-4'],
    ['description', 'claude-3-5-sonnet-20241022'],
    ['bio', 'gpt-4'],
    ['quick', 'gpt-3.5-turbo']
  ])

  // AI Model Orchestration - chooses best AI for each task
  async selectOptimalModel(taskType: string, complexity: 'low' | 'medium' | 'high'): Promise<{model: string, provider: 'claude' | 'openai'}> {
    const baseModel = this.modelSelector.get(taskType) || 'claude-3-5-sonnet-20241022'

    // High complexity creative tasks → Claude
    if (complexity === 'high' && (taskType === 'creative' || taskType === 'description')) {
      return { model: 'claude-3-5-sonnet-20241022', provider: 'claude' }
    }

    // Quick simple tasks → GPT-3.5
    if (complexity === 'low') {
      return { model: 'gpt-3.5-turbo', provider: 'openai' }
    }

    return baseModel.includes('claude')
      ? { model: baseModel, provider: 'claude' }
      : { model: baseModel, provider: 'openai' }
  }

  // Main AI processing with automatic provider selection and fallback
  async processWithOptimalAI(prompt: string, taskType: string, complexity: 'low' | 'medium' | 'high' = 'medium'): Promise<{
    response: string,
    model: string,
    provider: string,
    processingTime: number
  }> {
    const startTime = Date.now()
    const { model, provider } = await this.selectOptimalModel(taskType, complexity)

    try {
      let response: string
      if (provider === 'claude') {
        response = await aiClient.chatWithClaude([{ role: 'user', content: prompt }])
      } else {
        response = await aiClient.chatWithGPT([{ role: 'user', content: prompt }])
      }

      return {
        response,
        model,
        provider,
        processingTime: Date.now() - startTime
      }
    } catch (error) {
      console.warn(`${provider} failed, trying fallback:`, error)
      
      // Automatic fallback to other provider
      const fallbackProvider = provider === 'claude' ? 'openai' : 'claude'
      let fallbackResponse: string
      
      if (fallbackProvider === 'claude') {
        fallbackResponse = await aiClient.chatWithClaude([{ role: 'user', content: prompt }])
      } else {
        fallbackResponse = await aiClient.chatWithGPT([{ role: 'user', content: prompt }])
      }

      return {
        response: fallbackResponse,
        model: `fallback-${fallbackProvider}`,
        provider: fallbackProvider,
        processingTime: Date.now() - startTime
      }
    }
  }

  // Secure Claude API integration via server
  async chatWithClaude(messages: AIMessage[], model: string = 'claude-3-5-sonnet-20241022'): Promise<string> {
    return await aiClient.chatWithClaude(messages)
  }

  // Secure OpenAI API integration via server
  async chatWithGPT(messages: AIMessage[], model: string = 'gpt-4'): Promise<string> {
    return await aiClient.chatWithGPT(messages)
  }

  // CREATOR-SPECIFIC AI FEATURES FOR CABANA

  // Generate creator bio with personality
  async generateCreatorBio(creatorName: string, niche: string, personality: string): Promise<ContentGeneration> {
    const prompt = `Write an engaging creator bio for ${creatorName}, a ${niche} creator with a ${personality} personality. 
    
    Make it:
    - Magnetic and attention-grabbing
    - 2-3 sentences max
    - Include their niche naturally
    - Show personality without being cringe
    - End with a call-to-action
    
    Just return the bio text, nothing else.`

    const result = await this.processWithOptimalAI(prompt, 'bio', 'high')
    
    return {
      type: 'bio',
      content: result.response.trim(),
      metadata: {
        generatedAt: new Date().toISOString(),
        model: result.model,
        wordCount: result.response.split(' ').length
      }
    }
  }

  // Generate social media captions
  async generateSocialCaption(contentType: string, mood: string = 'engaging'): Promise<ContentGeneration> {
    const prompt = `Create a ${mood} social media caption for ${contentType} content.
    
    Make it:
    - Hook readers in the first line
    - Include relevant emojis naturally
    - Ask a question to boost engagement
    - Under 280 characters
    - Include 3-5 relevant hashtags at the end
    
    Just return the caption, nothing else.`

    const result = await this.processWithOptimalAI(prompt, 'creative', 'medium')
    
    return {
      type: 'social',
      content: result.response.trim(),
      metadata: {
        generatedAt: new Date().toISOString(),
        model: result.model,
        contentType,
        mood
      }
    }
  }

  // Generate marketing copy for subscription tiers
  async generateSubscriptionCopy(tierName: string, price: number, benefits: string[]): Promise<ContentGeneration> {
    const prompt = `Create compelling marketing copy for a creator subscription tier:
    
    Tier: ${tierName}
    Price: $${price}/month
    Benefits: ${benefits.join(', ')}
    
    Write:
    - Catchy tier title (if different from ${tierName})
    - 2-3 sentence description that sells the value
    - Emphasize exclusivity and value
    - Make subscribers feel special
    
    Format as JSON:
    {
      "title": "tier title",
      "description": "compelling description"
    }`

    const result = await this.processWithOptimalAI(prompt, 'marketing', 'high')
    
    try {
      const parsed = JSON.parse(result.response.match(/\{[\s\S]*\}/)?.[0] || '{}')
      return {
        type: 'marketing',
        content: `${parsed.title}\n\n${parsed.description}`,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: result.model,
          tierName,
          price,
          parsed
        }
      }
    } catch {
      return {
        type: 'marketing',
        content: result.response.trim(),
        metadata: {
          generatedAt: new Date().toISOString(),
          model: result.model,
          tierName,
          price
        }
      }
    }
  }

  // Generate email sequences for fan engagement
  async generateFanEmail(emailType: 'welcome' | 'exclusive' | 'milestone', creatorName: string): Promise<ContentGeneration> {
    const prompts = {
      welcome: `Write a warm welcome email for ${creatorName}'s new subscriber. Make it personal, appreciative, and set expectations for what they'll receive.`,
      exclusive: `Write an email announcing exclusive content for ${creatorName}'s premium subscribers. Build excitement and make them feel special.`,
      milestone: `Write a milestone celebration email from ${creatorName} thanking their community for support. Be genuine and grateful.`
    }

    const result = await this.processWithOptimalAI(prompts[emailType], 'creative', 'medium')
    
    return {
      type: 'email',
      content: result.response.trim(),
      metadata: {
        generatedAt: new Date().toISOString(),
        model: result.model,
        emailType,
        creatorName
      }
    }
  }

  // Quick content ideas generator
  async generateContentIdeas(niche: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} creative content ideas for a ${niche} creator. 
    
    Make them:
    - Engaging and clickable
    - Specific and actionable
    - Varied in format (posts, stories, videos, etc.)
    - Trending but authentic
    
    Return as a simple numbered list.`

    const result = await this.processWithOptimalAI(prompt, 'creative', 'medium')
    
    // Extract numbered list items
    const ideas = result.response
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, count)
    
    return ideas.length > 0 ? ideas : [result.response.trim()]
  }
}

// Export singleton instance
export const aiEngine = new AIEngine()

// Utility functions for easy access
export const generateBio = (name: string, niche: string, personality: string) => 
  aiEngine.generateCreatorBio(name, niche, personality)

export const generateCaption = (contentType: string, mood?: string) =>
  aiEngine.generateSocialCaption(contentType, mood)

export const generateSubscriptionTier = (tierName: string, price: number, benefits: string[]) =>
  aiEngine.generateSubscriptionCopy(tierName, price, benefits)

export const generateEmail = (type: 'welcome' | 'exclusive' | 'milestone', creatorName: string) =>
  aiEngine.generateFanEmail(type, creatorName)

export const getContentIdeas = (niche: string, count?: number) =>
  aiEngine.generateContentIdeas(niche, count)