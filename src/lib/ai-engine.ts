import { Anthropic } from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// AI clients initialized with environment variables
let claude: Anthropic | null = null
let openai: OpenAI | null = null

// Initialize AI clients with environment variables
async function initializeClients() {
  try {
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY

    if (anthropicKey) {
      claude = new Anthropic({
        apiKey: anthropicKey,
        dangerouslyAllowBrowser: true // For client-side usage
      })
      console.log('Claude client initialized')
    } else {
      console.warn('Anthropic API key not available')
    }

    if (openaiKey) {
      openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true // For client-side usage
      })
      console.log('OpenAI client initialized')
    } else {
      console.warn('OpenAI API key not available')
    }
  } catch (error) {
    console.error('AI engine initialization error:', error)
  }
}

// Initialize clients on module load
initializeClients()

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
    [key: string]: any
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
      if (provider === 'claude' && claude) {
        response = await this.chatWithClaude([{ role: 'user', content: prompt }], model)
      } else if (provider === 'openai' && openai) {
        response = await this.chatWithGPT([{ role: 'user', content: prompt }], model)
      } else {
        throw new Error(`${provider} client not available`)
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
      
      if (fallbackProvider === 'claude' && claude) {
        fallbackResponse = await this.chatWithClaude([{ role: 'user', content: prompt }])
      } else if (fallbackProvider === 'openai' && openai) {
        fallbackResponse = await this.chatWithGPT([{ role: 'user', content: prompt }])
      } else {
        throw new Error('Both AI providers unavailable')
      }

      return {
        response: fallbackResponse,
        model: `fallback-${fallbackProvider}`,
        provider: fallbackProvider,
        processingTime: Date.now() - startTime
      }
    }
  }

  // Claude API integration
  async chatWithClaude(messages: AIMessage[], model: string = 'claude-3-5-sonnet-20241022'): Promise<string> {
    if (!claude) {
      throw new Error('Claude client not initialized')
    }

    try {
      const response = await claude.messages.create({
        model,
        max_tokens: 4000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })

      return response.content[0].type === 'text' ? response.content[0].text : 'No response'
    } catch (error) {
      console.error('Claude API error:', error)
      throw error
    }
  }

  // OpenAI API integration  
  async chatWithGPT(messages: AIMessage[], model: string = 'gpt-4'): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized')
    }

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4000
      })

      return response.choices[0]?.message?.content || 'No response'
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
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