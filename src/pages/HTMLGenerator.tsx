import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Download, 
  Copy, 
  Eye, 
  Wand2, 
  Sparkles,
  FileCode,
  Palette,
  Layout,
  Smartphone,
  Monitor
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HTML_GENERATOR_PROMPT = `You are an expert HTML/CSS/JavaScript generator. Create beautiful, modern, responsive HTML pages based on user descriptions.

REQUIREMENTS:
1. Generate complete HTML with embedded CSS and JavaScript
2. Use modern CSS (Flexbox, Grid, custom properties)
3. Include responsive design (mobile-first)
4. Add smooth animations and transitions
5. Use semantic HTML5 elements
6. Include proper meta tags and viewport
7. Add interactive elements where appropriate
8. Use a modern color palette and typography
9. Include hover effects and micro-interactions
10. Make it production-ready

STYLE GUIDELINES:
- Clean, minimal design
- Modern typography (Inter, Roboto, or similar)
- Subtle shadows and gradients
- Smooth transitions (0.3s ease)
- Proper spacing and visual hierarchy
- Mobile-responsive breakpoints
- Accessibility considerations

Generate ONLY the HTML code, no explanation or markdown.`;

export function HTMLGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const generateHTML = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a description of what you want to create.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // This is a mock implementation - you'll need to integrate with your preferred AI service
      // Options: OpenAI GPT-4, Anthropic Claude, or local AI models
      
      const mockHTML = generateMockHTML(prompt);
      setGeneratedHTML(mockHTML);
      
      // Update preview
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = mockHTML;
      }
      
      toast({
        title: "HTML Generated!",
        description: "Your custom HTML has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating HTML:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate HTML. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockHTML = (userPrompt: string) => {
    // This is a sophisticated mock - replace with actual AI integration
    const isLanding = userPrompt.toLowerCase().includes('landing');
    const isDashboard = userPrompt.toLowerCase().includes('dashboard');
    const isForm = userPrompt.toLowerCase().includes('form');
    const isPortfolio = userPrompt.toLowerCase().includes('portfolio');
    
    if (isLanding) {
      return generateLandingPageHTML(userPrompt);
    } else if (isDashboard) {
      return generateDashboardHTML(userPrompt);
    } else if (isForm) {
      return generateFormHTML(userPrompt);
    } else if (isPortfolio) {
      return generatePortfolioHTML(userPrompt);
    } else {
      return generateGenericHTML(userPrompt);
    }
  };

  const generateLandingPageHTML = (prompt: string) => {
    const title = extractTitle(prompt) || "Modern Landing Page";
    const primaryColor = extractColor(prompt) || "#6366f1";
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 600px;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            animation: fadeInUp 0.8s ease-out;
        }
        
        .hero p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .cta-button {
            background: ${primaryColor};
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .features {
            padding: 5rem 0;
            background: white;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: ${primaryColor};
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>${title}</h1>
                <p>Experience the future of web design with our innovative solutions that drive results and exceed expectations.</p>
                <a href="#features" class="cta-button">Get Started</a>
            </div>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem;">Features</h2>
            <p style="text-align: center; color: #6b7280; font-size: 1.1rem;">Everything you need to succeed</p>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast loading times and optimized performance for the best user experience.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Modern, clean designs that capture attention and convert visitors into customers.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile First</h3>
                    <p>Responsive design that looks perfect on all devices and screen sizes.</p>
                </div>
            </div>
        </div>
    </section>
    
    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
    </script>
</body>
</html>`;
  };

  const generateDashboardHTML = (prompt: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #1e293b;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        
        .sidebar {
            background: #1e293b;
            color: white;
            padding: 2rem 0;
        }
        
        .sidebar h2 {
            padding: 0 1.5rem;
            margin-bottom: 2rem;
            font-size: 1.5rem;
        }
        
        .nav-item {
            padding: 1rem 1.5rem;
            cursor: pointer;
            transition: background 0.3s ease;
            border-left: 3px solid transparent;
        }
        
        .nav-item:hover, .nav-item.active {
            background: #334155;
            border-left-color: #3b82f6;
        }
        
        .main-content {
            padding: 2rem;
        }
        
        .header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 2rem;
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
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #3b82f6;
        }
        
        .stat-label {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .chart-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .sidebar {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="sidebar">
            <h2>Dashboard</h2>
            <div class="nav-item active">Overview</div>
            <div class="nav-item">Analytics</div>
            <div class="nav-item">Users</div>
            <div class="nav-item">Settings</div>
        </div>
        
        <div class="main-content">
            <div class="header">
                <h1>Dashboard Overview</h1>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">12,345</div>
                    <div class="stat-label">Total Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$98,765</div>
                    <div class="stat-label">Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">85%</div>
                    <div class="stat-label">Growth</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">456</div>
                    <div class="stat-label">New Orders</div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>Analytics Chart</h3>
                <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f1f5f9; border-radius: 5px; margin-top: 1rem;">
                    <p style="color: #64748b;">Chart placeholder - integrate with your preferred charting library</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const generateFormHTML = (prompt: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Form</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
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
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
        }
        
        .form-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .form-header h1 {
            font-size: 2rem;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .form-header p {
            color: #64748b;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
        }
        
        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
            background: #2563eb;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        @media (max-width: 600px) {
            .form-container {
                padding: 2rem;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="form-header">
            <h1>Contact Form</h1>
            <p>Get in touch with us</p>
        </div>
        
        <form id="contactForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="subject">Subject</label>
                <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Support</option>
                    <option value="business">Business</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Send Message</button>
        </form>
    </div>
    
    <script>
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message
            alert('Thank you! Your message has been sent.');
            
            // Reset form
            this.reset();
        });
    </script>
</body>
</html>`;
  };

  const generatePortfolioHTML = (prompt: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1f2937;
        }
        
        .hero {
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease;
        }
        
        .hero p {
            font-size: 1.5rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease 0.3s both;
        }
        
        .section {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .portfolio-item {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .portfolio-item:hover {
            transform: translateY(-10px);
        }
        
        .portfolio-image {
            height: 200px;
            background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
        }
        
        .portfolio-content {
            padding: 2rem;
        }
        
        .portfolio-content h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .skills {
            background: #f8fafc;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .skill-item {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .skill-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>Creative Portfolio</h1>
            <p>Bringing ideas to life through design</p>
        </div>
    </section>
    
    <section class="section">
        <h2>Featured Work</h2>
        <div class="portfolio-grid">
            <div class="portfolio-item">
                <div class="portfolio-image">Project Image</div>
                <div class="portfolio-content">
                    <h3>Project Title</h3>
                    <p>Description of the project and technologies used to create this amazing work.</p>
                </div>
            </div>
            
            <div class="portfolio-item">
                <div class="portfolio-image">Project Image</div>
                <div class="portfolio-content">
                    <h3>Another Project</h3>
                    <p>Another description of creative work that showcases skills and expertise.</p>
                </div>
            </div>
            
            <div class="portfolio-item">
                <div class="portfolio-image">Project Image</div>
                <div class="portfolio-content">
                    <h3>Third Project</h3>
                    <p>More amazing work that demonstrates creativity and technical ability.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="section skills">
        <h2>Skills</h2>
        <div class="skills-grid">
            <div class="skill-item">
                <div class="skill-icon">🎨</div>
                <h3>Design</h3>
                <p>Creative visual design</p>
            </div>
            
            <div class="skill-item">
                <div class="skill-icon">💻</div>
                <h3>Development</h3>
                <p>Modern web development</p>
            </div>
            
            <div class="skill-item">
                <div class="skill-icon">📱</div>
                <h3>Mobile</h3>
                <p>Mobile-first design</p>
            </div>
            
            <div class="skill-item">
                <div class="skill-icon">🚀</div>
                <h3>Performance</h3>
                <p>Optimized solutions</p>
            </div>
        </div>
    </section>
</body>
</html>`;
  };

  const generateGenericHTML = (prompt: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .header h1 {
            font-size: 3rem;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        
        .header p {
            font-size: 1.2rem;
            color: #64748b;
        }
        
        .content {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .button {
            display: inline-block;
            padding: 1rem 2rem;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: background 0.3s ease;
        }
        
        .button:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Custom Page</h1>
            <p>Generated based on your prompt: "${prompt}"</p>
        </div>
        
        <div class="content">
            <h2>Welcome</h2>
            <p>This is a custom HTML page generated based on your description. The content and styling have been tailored to match your requirements.</p>
            <br>
            <a href="#" class="button">Get Started</a>
        </div>
    </div>
</body>
</html>`;
  };

  const extractTitle = (prompt: string) => {
    const titleMatch = prompt.match(/title[:\s]+["']?([^"'\n]+)["']?/i);
    return titleMatch ? titleMatch[1] : null;
  };

  const extractColor = (prompt: string) => {
    const colorMatch = prompt.match(/(blue|red|green|purple|orange|pink|yellow|#[0-9a-f]{6})/i);
    if (colorMatch) {
      const colors = {
        blue: '#3b82f6',
        red: '#ef4444',
        green: '#10b981',
        purple: '#8b5cf6',
        orange: '#f59e0b',
        pink: '#ec4899',
        yellow: '#eab308'
      };
      return colors[colorMatch[1].toLowerCase()] || colorMatch[1];
    }
    return null;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHTML);
      toast({
        title: "Copied!",
        description: "HTML code copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy HTML code.",
        variant: "destructive"
      });
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wand2 className="h-12 w-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white font-['Playfair_Display']">
              HTML Generator
            </h1>
          </div>
          <p className="text-gray-300 text-lg font-['Cormorant_Garamond']">
            Describe what you want and watch it come to life
          </p>
          <Badge className="mt-2 bg-purple-600 text-white">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-Powered
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-['Playfair_Display'] flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Describe Your Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what you want to create... 

Examples:
• Create a modern landing page for a tech startup with blue theme
• Build a dashboard with sidebar navigation and stats cards
• Make a contact form with gradient background
• Design a portfolio page with image grid
• Create an e-commerce product page with reviews"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/20 border-white/10 text-white placeholder-gray-400 min-h-[200px] resize-none"
                />
                
                <Button
                  onClick={generateHTML}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate HTML
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            {generatedHTML && (
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-['Playfair_Display']">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button
                      onClick={downloadHTML}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-['Playfair_Display'] flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                      className="p-2"
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('tablet')}
                      className="p-2"
                    >
                      <Layout className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                      className="p-2"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 min-h-[400px]">
                  {generatedHTML ? (
                    <div className="flex justify-center">
                      <iframe
                        ref={iframeRef}
                        srcDoc={generatedHTML}
                        className="border-0 rounded-lg shadow-lg"
                        style={{
                          width: getPreviewWidth(),
                          height: '500px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enter a description and click "Generate HTML" to see your creation</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Code View */}
            {generatedHTML && (
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-['Playfair_Display'] flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Generated Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="html" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html" className="space-y-4">
                      <pre className="bg-black/40 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-[300px] overflow-y-auto">
                        <code>{generatedHTML}</code>
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}