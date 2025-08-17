import { aiClient } from '../ai-client'
import { AIGenerationOptions, GenerationResult, GenerationType } from './types'

// AI client wrapper for HTML generation
export class AIHTMLClient {
  // Generate HTML using AI
  async generateHTML(
    prompt: string, 
    type: GenerationType = 'landing-page',
    options: AIGenerationOptions = {}
  ): Promise<GenerationResult> {
    const startTime = Date.now()
    
    try {
      // Enhanced prompt for HTML generation
      const enhancedPrompt = this.buildHTMLPrompt(prompt, type, options)
      
      // Use the secure AI client
      const html = await aiClient.generateHTML(enhancedPrompt)
      
      return {
        html,
        metadata: {
          generationTime: Date.now() - startTime,
          provider: 'secure-api',
          tokensUsed: 0 // Will be filled by API response if available
        }
      }
    } catch (error) {
      console.error('HTML generation failed:', error)
      throw new Error(`Failed to generate ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Build comprehensive HTML generation prompt
  private buildHTMLPrompt(userPrompt: string, type: GenerationType, options: AIGenerationOptions): string {
    const systemPrompts = {
      'landing-page': `Create a modern, professional landing page with the following requirements:
- Hero section with compelling headline and CTA
- Responsive design that works on all devices
- Modern CSS with gradients, shadows, and smooth animations
- Clean typography and proper spacing
- SEO-friendly structure with semantic HTML`,
      
      'portfolio': `Design a creative portfolio page with:
- Grid layout for showcasing work
- Elegant hover effects and transitions
- Professional typography and color scheme
- Contact section with social links
- Optimized for visual impact`,
      
      'dashboard': `Build a clean dashboard interface with:
- Sidebar navigation and main content area
- Card-based layout for data display
- Interactive elements and charts
- Dark/light mode toggle
- Professional business aesthetic`,
      
      'component': `Create a reusable UI component with:
- Clean, modular design
- Proper state management
- Accessibility features
- Responsive behavior
- Well-documented structure`,
      
      'blog-post': `Generate a blog post layout with:
- Clean typography optimized for reading
- Author bio and metadata
- Social sharing buttons
- Related posts section
- SEO optimization`,
      
      'email-template': `Design a responsive email template with:
- Mobile-first approach
- Cross-client compatibility
- Clear call-to-action buttons
- Professional branding
- Table-based layout for reliability`,
      
      'form': `Create an interactive form with:
- Proper validation and error states
- Accessibility features
- Clean UX patterns
- Success/error messaging
- Mobile-optimized inputs`,
      
      'gallery': `Build an image gallery with:
- Responsive grid layout
- Lightbox functionality
- Loading animations
- Filtering/search capabilities
- Touch-friendly navigation`
    }

    const systemPrompt = systemPrompts[type] || systemPrompts['component']
    
    const temperaturePrompt = options.temperature 
      ? `Use a creativity level of ${options.temperature} (0-2 scale).`
      : ''

    return `${systemPrompt}

SPECIFIC REQUIREMENTS:
${userPrompt}

TECHNICAL SPECIFICATIONS:
- Generate complete HTML with embedded CSS and JavaScript
- Use modern CSS features (Grid, Flexbox, CSS Custom Properties)
- Include responsive breakpoints: 320px, 768px, 1024px, 1440px
- Add smooth transitions and hover effects
- Ensure proper semantic HTML5 structure
- Include viewport meta tag and basic SEO tags
- Use a modern color palette and typography
- Add loading states and micro-interactions
- Ensure cross-browser compatibility
- Include accessibility features (ARIA labels, focus states)

${temperaturePrompt}

Return only the complete HTML code with embedded CSS and JavaScript. No explanations or markdown formatting.`
  }

  // Generate component-specific HTML
  async generateComponent(
    componentName: string,
    description: string,
    props?: Record<string, any>
  ): Promise<GenerationResult> {
    const prompt = `Create a ${componentName} component with the following specifications:
    
Description: ${description}

${props ? `Props: ${JSON.stringify(props, null, 2)}` : ''}

Requirements:
- Reusable and modular design
- Props-based customization
- Responsive behavior
- Clean, modern styling
- Proper event handling
- Accessibility features`

    return this.generateHTML(prompt, 'component')
  }

  // Generate page layouts
  async generatePage(
    pageType: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<GenerationResult> {
    const prompt = `Create a complete ${pageType} page with:
    
Content: ${content}

${metadata ? `Additional requirements: ${JSON.stringify(metadata, null, 2)}` : ''}

The page should be production-ready with proper SEO, performance optimization, and user experience considerations.`

    const type = pageType.toLowerCase().includes('landing') ? 'landing-page' as GenerationType
      : pageType.toLowerCase().includes('portfolio') ? 'portfolio' as GenerationType
      : pageType.toLowerCase().includes('dashboard') ? 'dashboard' as GenerationType
      : 'landing-page' as GenerationType

    return this.generateHTML(prompt, type)
  }

  // Health check for AI service
  async checkHealth(): Promise<{ status: string; responsive: boolean }> {
    try {
      const health = await aiClient.checkHealth()
      return {
        status: health.status,
        responsive: true
      }
    } catch (error) {
      return {
        status: 'error',
        responsive: false
      }
    }
  }
}

// Export singleton instance
export const aiHTMLClient = new AIHTMLClient()