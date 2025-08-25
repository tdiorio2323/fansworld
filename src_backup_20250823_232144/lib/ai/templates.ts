import { TemplateContext, GenerationType } from './types'

// HTML template management
export class TemplateManager {
  private templates = new Map<string, string>()

  constructor() {
    this.initializeDefaultTemplates()
  }

  private initializeDefaultTemplates(): void {
    // Base HTML structure template
    this.templates.set('base', `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  <style>
    :root {
      --primary-color: {{colors.primary}};
      --secondary-color: {{colors.secondary}};
      --accent-color: {{colors.accent}};
      --background-color: {{colors.background}};
      --text-color: #333;
      --font-heading: {{fonts.heading}};
      --font-body: {{fonts.body}};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--background-color);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 15px;
      }
    }
  </style>
</head>
<body>
  {{content}}
</body>
</html>`)

    // Landing page template
    this.templates.set('landing-page', `
<div class="container">
  <header class="hero">
    <h1>{{title}}</h1>
    <p class="hero-description">{{description}}</p>
    <button class="cta-button">Get Started</button>
  </header>
  
  <main class="content">
    {{content}}
  </main>
</div>

<style>
  .hero {
    text-align: center;
    padding: 100px 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: 20px;
    margin-bottom: 50px;
  }
  
  .hero h1 {
    font-family: var(--font-heading);
    font-size: 3.5rem;
    margin-bottom: 20px;
    font-weight: 700;
  }
  
  .hero-description {
    font-size: 1.25rem;
    margin-bottom: 30px;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-button {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .hero-description {
      font-size: 1.1rem;
    }
  }
</style>`)

    // Component template
    this.templates.set('component', `
<div class="component-wrapper">
  {{content}}
</div>

<style>
  .component-wrapper {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: 1px solid #e1e5e9;
    margin-bottom: 20px;
  }
</style>`)
  }

  getTemplate(type: GenerationType): string {
    return this.templates.get(type) || this.templates.get('base') || ''
  }

  setTemplate(type: string, template: string): void {
    this.templates.set(type, template)
  }

  renderTemplate(template: string, context: TemplateContext): string {
    let rendered = template

    // Replace template variables
    rendered = rendered.replace(/\{\{title\}\}/g, context.title || 'Untitled')
    rendered = rendered.replace(/\{\{description\}\}/g, context.description || 'Generated content')
    
    // Replace color variables
    if (context.colors) {
      rendered = rendered.replace(/\{\{colors\.primary\}\}/g, context.colors.primary || '#007bff')
      rendered = rendered.replace(/\{\{colors\.secondary\}\}/g, context.colors.secondary || '#6c757d')
      rendered = rendered.replace(/\{\{colors\.accent\}\}/g, context.colors.accent || '#28a745')
      rendered = rendered.replace(/\{\{colors\.background\}\}/g, context.colors.background || '#ffffff')
    }
    
    // Replace font variables
    if (context.fonts) {
      rendered = rendered.replace(/\{\{fonts\.heading\}\}/g, context.fonts.heading || 'Inter')
      rendered = rendered.replace(/\{\{fonts\.body\}\}/g, context.fonts.body || 'Inter')
    }

    return rendered
  }

  // Generate responsive CSS
  generateResponsiveCSS(): string {
    return `
/* Responsive Design */
@media (max-width: 1200px) {
  .container {
    max-width: 960px;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 720px;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 540px;
    padding: 0 15px;
  }
  
  .hero {
    padding: 60px 0;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .container {
    max-width: 100%;
    padding: 0 15px;
  }
  
  .hero {
    padding: 40px 0;
  }
  
  .hero h1 {
    font-size: 1.75rem;
  }
  
  .cta-button {
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}`
  }

  // Generate animation CSS
  generateAnimationCSS(): string {
    return `
/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

.bounce {
  animation: bounce 1s ease-in-out;
}`
  }

  // Combine template with base structure
  buildCompleteTemplate(type: GenerationType, context: TemplateContext, content: string): string {
    const baseTemplate = this.getTemplate('base')
    const typeTemplate = this.getTemplate(type)
    
    // Render the type-specific template first
    const renderedContent = this.renderTemplate(typeTemplate, context)
    
    // Then render the base template with the content
    const finalContext = {
      ...context,
      content: renderedContent.replace('{{content}}', content)
    }
    
    let result = this.renderTemplate(baseTemplate, finalContext)
    
    // Add responsive CSS if enabled
    if (context.responsive) {
      result = result.replace('</style>', this.generateResponsiveCSS() + '\n</style>')
    }
    
    // Add animations if enabled
    if (context.animations) {
      result = result.replace('</style>', this.generateAnimationCSS() + '\n</style>')
    }
    
    return result
  }
}

// Export singleton instance
export const templateManager = new TemplateManager()