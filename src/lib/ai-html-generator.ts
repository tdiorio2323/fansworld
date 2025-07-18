// AI HTML Generator Service
// This integrates with multiple AI providers for HTML generation

interface AIGenerationOptions {
  provider?: 'openai' | 'anthropic' | 'local';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface GenerationResult {
  html: string;
  metadata?: {
    tokensUsed?: number;
    generationTime?: number;
    provider?: string;
  };
}

const SYSTEM_PROMPT = `You are an expert HTML/CSS/JavaScript generator. Create beautiful, modern, responsive web pages based on user descriptions.

REQUIREMENTS:
1. Generate complete HTML with embedded CSS and JavaScript in a single file
2. Use modern CSS (Flexbox, Grid, CSS custom properties, modern selectors)
3. Include responsive design with mobile-first approach
4. Add smooth animations and transitions
5. Use semantic HTML5 elements
6. Include proper meta tags and viewport settings
7. Add interactive elements where appropriate (forms, buttons, navigation)
8. Use modern color palettes and typography
9. Include hover effects and micro-interactions
10. Make it production-ready and accessible

STYLE GUIDELINES:
- Clean, minimal, professional design
- Modern typography (Inter, system fonts)
- Subtle shadows, gradients, and depth
- Smooth transitions (0.2-0.3s ease)
- Proper spacing using consistent scale
- Mobile-responsive breakpoints (320px, 768px, 1024px, 1440px)
- High contrast ratios for accessibility
- Focus states for keyboard navigation

STRUCTURE:
- Always include <!DOCTYPE html> and proper HTML structure
- Use CSS custom properties for colors and spacing
- Include viewport meta tag
- Add title and meta description
- Structure with semantic HTML5 elements
- Include CSS reset/normalize
- Add JavaScript for interactivity when needed

RESPOND WITH ONLY THE HTML CODE - NO EXPLANATIONS OR MARKDOWN.`;

// OpenAI Integration
const generateWithOpenAI = async (prompt: string, options: AIGenerationOptions = {}): Promise<GenerationResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  const startTime = Date.now();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: options.model || 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Create a web page: ${prompt}` }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generationTime = Date.now() - startTime;
  
  return {
    html: data.choices[0]?.message?.content || '',
    metadata: {
      tokensUsed: data.usage?.total_tokens,
      generationTime,
      provider: 'openai'
    }
  };
};

// Anthropic Claude Integration
const generateWithAnthropic = async (prompt: string, options: AIGenerationOptions = {}): Promise<GenerationResult> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your environment variables.');
  }

  const startTime = Date.now();
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: options.model || 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `Create a web page: ${prompt}` }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generationTime = Date.now() - startTime;
  
  return {
    html: data.content[0]?.text || '',
    metadata: {
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
      generationTime,
      provider: 'anthropic'
    }
  };
};

// Local AI Integration (for self-hosted models)
const generateWithLocal = async (prompt: string, options: AIGenerationOptions = {}): Promise<GenerationResult> => {
  const localEndpoint = import.meta.env.VITE_LOCAL_AI_ENDPOINT || 'http://localhost:1234/v1/chat/completions';
  
  const startTime = Date.now();
  
  const response = await fetch(localEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || 'local-model',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Create a web page: ${prompt}` }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 4000
    })
  });

  if (!response.ok) {
    throw new Error(`Local AI endpoint error: ${response.statusText}`);
  }

  const data = await response.json();
  const generationTime = Date.now() - startTime;
  
  return {
    html: data.choices[0]?.message?.content || '',
    metadata: {
      generationTime,
      provider: 'local'
    }
  };
};

// Enhanced Fallback Generator (improved mock)
const generateFallback = async (prompt: string): Promise<GenerationResult> => {
  const startTime = Date.now();
  
  // Analyze prompt for better template selection
  const analysis = analyzePrompt(prompt);
  let html = '';
  
  switch (analysis.type) {
    case 'landing':
      html = generateLandingPage(analysis);
      break;
    case 'dashboard':
      html = generateDashboard(analysis);
      break;
    case 'form':
      html = generateForm(analysis);
      break;
    case 'portfolio':
      html = generatePortfolio(analysis);
      break;
    case 'blog':
      html = generateBlog(analysis);
      break;
    case 'ecommerce':
      html = generateEcommerce(analysis);
      break;
    default:
      html = generateGeneric(analysis);
  }
  
  const generationTime = Date.now() - startTime;
  
  return {
    html,
    metadata: {
      generationTime,
      provider: 'fallback'
    }
  };
};

// Main generation function with provider fallback
export const generateHTML = async (prompt: string, options: AIGenerationOptions = {}): Promise<GenerationResult> => {
  const provider = options.provider || 'fallback';
  
  try {
    switch (provider) {
      case 'openai':
        return await generateWithOpenAI(prompt, options);
      case 'anthropic':
        return await generateWithAnthropic(prompt, options);
      case 'local':
        return await generateWithLocal(prompt, options);
      default:
        return await generateFallback(prompt);
    }
  } catch (error) {
    console.warn(`AI generation failed with ${provider}, falling back to template generation:`, error);
    
    // Fallback to template generation if AI fails
    return await generateFallback(prompt);
  }
};

// Prompt analysis for better template selection
interface PromptAnalysis {
  type: 'landing' | 'dashboard' | 'form' | 'portfolio' | 'blog' | 'ecommerce' | 'generic';
  title: string;
  colors: string[];
  features: string[];
  style: 'modern' | 'minimal' | 'corporate' | 'creative' | 'dark';
}

const analyzePrompt = (prompt: string): PromptAnalysis => {
  const lower = prompt.toLowerCase();
  
  // Determine page type
  let type: PromptAnalysis['type'] = 'generic';
  if (lower.includes('landing') || lower.includes('homepage') || lower.includes('hero')) type = 'landing';
  else if (lower.includes('dashboard') || lower.includes('admin') || lower.includes('analytics')) type = 'dashboard';
  else if (lower.includes('form') || lower.includes('contact') || lower.includes('signup')) type = 'form';
  else if (lower.includes('portfolio') || lower.includes('gallery') || lower.includes('showcase')) type = 'portfolio';
  else if (lower.includes('blog') || lower.includes('article') || lower.includes('news')) type = 'blog';
  else if (lower.includes('shop') || lower.includes('store') || lower.includes('product')) type = 'ecommerce';
  
  // Extract title
  const titleMatch = prompt.match(/for\s+([^,\.]+)/i) || prompt.match(/about\s+([^,\.]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Your Website';
  
  // Extract colors
  const colorKeywords = {
    blue: ['blue', 'navy', 'azure', 'cyan'],
    red: ['red', 'crimson', 'rose', 'pink'],
    green: ['green', 'emerald', 'forest', 'mint'],
    purple: ['purple', 'violet', 'indigo', 'lavender'],
    orange: ['orange', 'amber', 'yellow', 'gold'],
    gray: ['gray', 'grey', 'black', 'white', 'silver']
  };
  
  const colors: string[] = [];
  Object.entries(colorKeywords).forEach(([color, keywords]) => {
    if (keywords.some(keyword => lower.includes(keyword))) {
      colors.push(color);
    }
  });
  
  // Extract features
  const features: string[] = [];
  if (lower.includes('responsive')) features.push('responsive');
  if (lower.includes('animation')) features.push('animated');
  if (lower.includes('interactive')) features.push('interactive');
  if (lower.includes('modern')) features.push('modern');
  if (lower.includes('minimal')) features.push('minimal');
  if (lower.includes('card')) features.push('cards');
  if (lower.includes('button')) features.push('buttons');
  if (lower.includes('navigation')) features.push('navigation');
  
  // Determine style
  let style: PromptAnalysis['style'] = 'modern';
  if (lower.includes('minimal') || lower.includes('clean')) style = 'minimal';
  else if (lower.includes('corporate') || lower.includes('business')) style = 'corporate';
  else if (lower.includes('creative') || lower.includes('artistic')) style = 'creative';
  else if (lower.includes('dark') || lower.includes('black')) style = 'dark';
  
  return { type, title, colors, features, style };
};

// Template generators (enhanced versions of existing functions)
const generateLandingPage = (analysis: PromptAnalysis): string => {
  const primaryColor = analysis.colors[0] || 'blue';
  const colorMap = {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f59e0b',
    gray: '#6b7280'
  };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title}</title>
    <style>
        :root {
            --primary: ${colorMap[primaryColor as keyof typeof colorMap]};
            --primary-dark: ${colorMap[primaryColor as keyof typeof colorMap]}dd;
            --background: ${analysis.style === 'dark' ? '#0f172a' : '#ffffff'};
            --text: ${analysis.style === 'dark' ? '#f1f5f9' : '#1e293b'};
            --text-muted: ${analysis.style === 'dark' ? '#94a3b8' : '#64748b'};
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', roboto, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--background);
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            text-align: center;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            margin-bottom: 1rem;
            animation: fadeInUp 0.8s ease;
        }
        
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: fadeInUp 0.8s ease 0.2s both;
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: white;
            color: var(--primary);
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: transform 0.2s ease;
            animation: fadeInUp 0.8s ease 0.4s both;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .hero { padding: 2rem 0; }
            .hero h1 { font-size: 2.5rem; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Welcome to ${analysis.title}</h1>
            <p>Beautiful, modern, and responsive web experience crafted just for you.</p>
            <a href="#" class="cta-button">Get Started</a>
        </div>
    </section>
</body>
</html>`;
};

const generateDashboard = (analysis: PromptAnalysis): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title} Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        
        .sidebar {
            background: white;
            border-right: 1px solid #e2e8f0;
            padding: 2rem 0;
        }
        
        .main-content {
            padding: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #3b82f6;
        }
        
        @media (max-width: 768px) {
            .dashboard { grid-template-columns: 1fr; }
            .sidebar { display: none; }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <nav>
                <h2 style="padding: 0 1.5rem; margin-bottom: 1rem;">${analysis.title}</h2>
            </nav>
        </aside>
        <main class="main-content">
            <h1>Dashboard Overview</h1>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">1,234</div>
                    <div>Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$12,345</div>
                    <div>Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">89%</div>
                    <div>Satisfaction</div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;
};

const generateForm = (analysis: PromptAnalysis): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title} Form</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .form-container {
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 500px;
        }
        
        h1 { margin-bottom: 2rem; text-align: center; color: #1e293b; }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        input, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        button {
            width: 100%;
            padding: 1rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        button:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>${analysis.title}</h1>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
</body>
</html>`;
};

const generatePortfolio = (analysis: PromptAnalysis): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title} Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1e293b;
        }
        
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(45deg, #1e293b, #475569);
            color: white;
            text-align: center;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .project-card {
            background: white;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
        }
        
        .project-image {
            height: 200px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        h1 { font-size: 3rem; margin-bottom: 1rem; }
        h3 { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>${analysis.title}</h1>
            <p>Creative Portfolio & Showcase</p>
        </div>
    </section>
    
    <section class="portfolio-grid">
        <div class="project-card">
            <div class="project-image"></div>
            <div class="project-content">
                <h3>Project One</h3>
                <p>Beautiful web application with modern design.</p>
            </div>
        </div>
        <div class="project-card">
            <div class="project-image"></div>
            <div class="project-content">
                <h3>Project Two</h3>
                <p>Responsive mobile-first experience.</p>
            </div>
        </div>
        <div class="project-card">
            <div class="project-image"></div>
            <div class="project-content">
                <h3>Project Three</h3>
                <p>Interactive dashboard with real-time data.</p>
            </div>
        </div>
    </section>
</body>
</html>`;
};

const generateBlog = (analysis: PromptAnalysis): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title} Blog</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: Georgia, serif;
            line-height: 1.8;
            color: #1e293b;
            background: #fafafa;
        }
        
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 3rem 0;
            background: white;
            border-radius: 1rem;
        }
        
        .article {
            background: white;
            padding: 3rem;
            margin-bottom: 2rem;
            border-radius: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
        
        .meta {
            color: #64748b;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${analysis.title}</h1>
            <p>Thoughts, ideas, and insights</p>
        </header>
        
        <article class="article">
            <h2>Welcome to Our Blog</h2>
            <div class="meta">Published on ${new Date().toLocaleDateString()}</div>
            <p>This is a beautiful, readable blog layout designed for sharing your thoughts and ideas with the world. The typography is carefully chosen for maximum readability.</p>
        </article>
    </div>
</body>
</html>`;
};

const generateEcommerce = (analysis: PromptAnalysis): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.title} Store</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1e293b;
        }
        
        header {
            background: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 3rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .product-card {
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .product-card:hover { transform: translateY(-5px); }
        
        .product-image {
            height: 200px;
            background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
        }
        
        .product-info {
            padding: 1.5rem;
        }
        
        .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #059669;
        }
        
        .add-to-cart {
            width: 100%;
            padding: 0.75rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <h1>${analysis.title}</h1>
            <div>Cart (0)</div>
        </div>
    </header>
    
    <main class="product-grid">
        <div class="product-card">
            <div class="product-image"></div>
            <div class="product-info">
                <h3>Premium Product</h3>
                <p>High-quality item with excellent features.</p>
                <div class="price">$99.99</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image"></div>
            <div class="product-info">
                <h3>Featured Item</h3>
                <p>Popular choice among customers.</p>
                <div class="price">$149.99</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
        <div class="product-card">
            <div class="product-image"></div>
            <div class="product-info">
                <h3>Best Seller</h3>
                <p>Top-rated product with great reviews.</p>
                <div class="price">$79.99</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    </main>
</body>
</html>`;
};

const generateGeneric = (analysis: PromptAnalysis): string => {
  return generateLandingPage(analysis); // Default to landing page
};

// Utility function to check if AI providers are configured
export const getAvailableProviders = (): string[] => {
  const providers: string[] = ['fallback']; // Always available
  
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    providers.push('openai');
  }
  
  if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
    providers.push('anthropic');
  }
  
  if (import.meta.env.VITE_LOCAL_AI_ENDPOINT) {
    providers.push('local');
  }
  
  return providers;
};

// Export types for use in components
export type { AIGenerationOptions, GenerationResult };