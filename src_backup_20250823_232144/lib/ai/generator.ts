import { aiHTMLClient } from './client'
import { templateManager } from './templates'
import { htmlCache, createCacheKey, createHashKey } from './cache'
import { 
  AIGenerationOptions, 
  GenerationResult, 
  TemplateContext, 
  GenerationType 
} from './types'
import pLimit from 'p-limit'

// Main HTML generator class - orchestrates all AI HTML generation
export class HTMLGenerator {
  // Generate HTML with caching and template management
  async generate(
    prompt: string,
    type: GenerationType = 'landing-page',
    context: TemplateContext = {},
    options: AIGenerationOptions = {}
  ): Promise<GenerationResult> {
    // Create cache key
    const cacheKey = createCacheKey('html', type, createHashKey({ prompt, context, options }))
    
    // Check cache first
    const cached = htmlCache.get(cacheKey)
    if (cached) {
      return {
        html: cached,
        metadata: {
          generationTime: 0,
          provider: 'cache',
          tokensUsed: 0
        }
      }
    }

    try {
      // Generate HTML using AI
      const result = await aiHTMLClient.generateHTML(prompt, type, options)
      
      // Post-process the generated HTML
      const processedHTML = this.postProcess(result.html, context)
      
      // Cache the result
      htmlCache.set(cacheKey, processedHTML, 600000) // 10 minutes
      
      return {
        html: processedHTML,
        metadata: result.metadata
      }
    } catch (error) {
      console.error('HTML generation failed:', error)
      
      // Fallback to template if AI fails
      return this.generateFallback(type, context, prompt)
    }
  }

  // Post-process generated HTML
  private postProcess(html: string, context: TemplateContext): string {
    let processed = html

    // Add responsive meta tag if missing
    if (!processed.includes('viewport')) {
      processed = processed.replace(
        '<head>',
        '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">'
      )
    }

    // Add charset if missing
    if (!processed.includes('charset')) {
      processed = processed.replace(
        '<head>',
        '<head>\n  <meta charset="UTF-8">'
      )
    }

    // Inject custom context if provided
    if (context.colors || context.fonts) {
      const customCSS = this.generateContextCSS(context)
      processed = processed.replace('</style>', `\n${customCSS}\n</style>`)
    }

    // Add animations if requested
    if (context.animations) {
      const animationCSS = templateManager.generateAnimationCSS()
      processed = processed.replace('</style>', `\n${animationCSS}\n</style>`)
    }

    // Minify CSS (simple version)
    if (process.env.NODE_ENV === 'production') {
      processed = this.minifyCSS(processed)
    }

    return processed
  }

  // Generate CSS from template context
  private generateContextCSS(context: TemplateContext): string {
    let css = ''

    if (context.colors) {
      css += `\n/* Custom Color Palette */\n:root {\n`
      if (context.colors.primary) css += `  --primary: ${context.colors.primary};\n`
      if (context.colors.secondary) css += `  --secondary: ${context.colors.secondary};\n`
      if (context.colors.accent) css += `  --accent: ${context.colors.accent};\n`
      if (context.colors.background) css += `  --background: ${context.colors.background};\n`
      css += `}\n`
    }

    if (context.fonts) {
      css += `\n/* Custom Typography */\n`
      if (context.fonts.heading) {
        css += `h1, h2, h3, h4, h5, h6 { font-family: '${context.fonts.heading}', sans-serif; }\n`
      }
      if (context.fonts.body) {
        css += `body, p, span, div { font-family: '${context.fonts.body}', sans-serif; }\n`
      }
    }

    return css
  }

  // Simple CSS minification
  private minifyCSS(html: string): string {
    return html.replace(/<style>([\s\S]*?)<\/style>/g, (match, css) => {
      const minified = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
        .replace(/\s*{\s*/g, '{') // Clean up braces
        .replace(/;\s*/g, ';') // Clean up semicolons
        .trim()
      
      return `<style>${minified}</style>`
    })
  }

  // Fallback template generation when AI fails
  private generateFallback(
    type: GenerationType,
    context: TemplateContext,
    originalPrompt: string
  ): GenerationResult {
    const fallbackContent = `
      <div class="fallback-content">
        <h1>Content Generated</h1>
        <p>Based on your request: "${originalPrompt}"</p>
        <p>This is a fallback template while AI services are unavailable.</p>
        <div class="placeholder-content">
          <div class="placeholder-box"></div>
          <div class="placeholder-text"></div>
        </div>
      </div>
      
      <style>
        .fallback-content {
          max-width: 800px;
          margin: 50px auto;
          padding: 40px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
        }
        
        .placeholder-box {
          width: 200px;
          height: 120px;
          background: rgba(255,255,255,0.2);
          margin: 20px auto;
          border-radius: 10px;
          animation: pulse 2s infinite;
        }
        
        .placeholder-text {
          width: 300px;
          height: 20px;
          background: rgba(255,255,255,0.2);
          margin: 10px auto;
          border-radius: 5px;
          animation: pulse 2s infinite 0.5s;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      </style>
    `

    const fallbackHTML = templateManager.buildCompleteTemplate(type, {
      title: 'Generated Content',
      description: 'AI-generated content',
      ...context
    }, fallbackContent)

    return {
      html: fallbackHTML,
      metadata: {
        generationTime: 0,
        provider: 'fallback-template',
        tokensUsed: 0
      }
    }
  }

  // Batch generate multiple HTML pieces with concurrency control
  async generateBatch(
    requests: Array<{
      prompt: string
      type?: GenerationType
      context?: TemplateContext
      options?: AIGenerationOptions
    }>,
    concurrency: number = 5
  ): Promise<GenerationResult[]> {
    const limit = pLimit(concurrency)
    
    const results = await Promise.allSettled(
      requests.map(req => 
        limit(() => this.generate(
          req.prompt, 
          req.type || 'component',
          req.context || {},
          req.options || {}
        ))
      )
    )

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : {
            html: '<div class="error">Generation failed</div>',
            metadata: { generationTime: 0, provider: 'error', tokensUsed: 0 }
          }
    )
  }

  // Clear all caches
  async clearCache(): Promise<void> {
    htmlCache.clear()
    await aiHTMLClient.checkHealth() // Also clear API cache
  }

  // Get generation statistics
  getStats(): {
    cacheStats: any
    systemHealth: Promise<{ status: string; responsive: boolean }>
  } {
    return {
      cacheStats: htmlCache.getStats(),
      systemHealth: aiHTMLClient.checkHealth()
    }
  }
}

// Export singleton instance
export const htmlGenerator = new HTMLGenerator()

// Export all classes for advanced usage
export { HTMLGenerator, aiHTMLClient, templateManager }