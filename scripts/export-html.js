#!/usr/bin/env node

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Starting Cabana HTML export...');

// List of all routes from your AppRoutes.tsx
const routes = [
  // Public Routes
  '/',
  '/about',
  '/features', 
  '/pricing',
  '/blog',
  '/contact',
  '/careers',
  '/press',
  '/investors',
  '/discover',
  '/categories',

  // Auth Routes  
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/two-factor',

  // Creator Routes
  '/creator',
  '/creator/dashboard',
  '/creator/analytics',
  '/creator/earnings',
  '/creator/content',
  '/creator/content/new',
  '/creator/content/scheduler',
  '/creator/fans',
  '/creator/messaging',
  '/creator/settings',
  '/creator/tools',

  // User Routes
  '/user/profile',
  '/user/settings',
  '/user/subscriptions',
  '/user/favorites',
  '/user/history',
  '/user/notifications',

  // Forum Routes
  '/forum',
  '/forum/categories',
  '/forum/search',

  // Community Routes
  '/community',
  '/community/groups',
  '/community/events',
  '/community/challenges',
  '/community/leaderboards',
  '/community/achievements',

  // Legal Routes
  '/legal/terms',
  '/legal/privacy',
  '/legal/dmca',
  '/legal/compliance',
  '/legal/cookies',

  // Support Routes
  '/support',
  '/support/help',
  '/support/faq',
  '/support/contact',
  '/support/tickets',
  '/support/guides',
  '/support/tutorials',
  '/support/troubleshooting',

  // Marketing Routes
  '/marketing/campaigns',
  '/marketing/referrals',
  '/marketing/affiliates',
  '/marketing/partnerships',
  '/marketing/promotions',

  // Error Routes
  '/error/403',
  '/error/500',
  '/error/maintenance',
  '/error/offline',

  // Mobile Routes
  '/mobile/app',
  '/mobile/responsive',

  // Analytics Routes
  '/analytics/tracking',
  '/analytics/reports',
  '/analytics/insights'
];

async function buildProject() {
  console.log('📦 Building project...');
  
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

async function startDevServer() {
  console.log('🌐 Starting development server...');
  
  return new Promise((resolve) => {
    const server = spawn('npm', ['run', 'dev'], { 
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      // Wait for server to be ready
      if (output.includes('Local:') && output.includes('5173')) {
        setTimeout(() => resolve(server), 2000); // Give it 2 seconds to fully start
      }
    });

    server.stderr.on('data', (data) => {
      console.log(data.toString());
    });
  });
}

async function exportRoutes(server) {
  console.log('📄 Exporting HTML pages...');
  
  const outputDir = join(projectRoot, 'out');
  
  // Create output directory
  spawn('mkdir', ['-p', outputDir], { stdio: 'inherit' });
  
  const promises = routes.map(async (route) => {
    try {
      const url = `http://localhost:5173${route}`;
      console.log(`📥 Fetching ${route}...`);
      
      const response = await fetch(url);
      const html = await response.text();
      
      // Create directory structure
      const filePath = route === '/' ? 'index.html' : `${route.replace(/^\//, '').replace(/\//g, '_')}.html`;
      const fullPath = join(outputDir, filePath);
      
      writeFileSync(fullPath, html);
      console.log(`✅ Exported: ${filePath}`);
      
      return { route, filePath };
    } catch (error) {
      console.error(`❌ Failed to export ${route}:`, error.message);
      return null;
    }
  });
  
  const results = await Promise.all(promises);
  server.kill(); // Stop the dev server
  
  return results.filter(Boolean);
}

function createIndex(exportedPages) {
  console.log('📋 Creating index page...');
  
  const indexPath = join(projectRoot, 'out', 'all_pages.html');
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cabana - All Exported Pages</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 15px; 
            backdrop-filter: blur(10px);
        }
        h1 { 
            text-align: center; 
            margin-bottom: 30px; 
            font-size: 2.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .stats { 
            text-align: center; 
            margin-bottom: 30px; 
            font-size: 1.1rem;
            opacity: 0.9;
        }
        ul { 
            list-style: none; 
            padding: 0; 
        }
        li { 
            margin: 8px 0; 
        }
        a { 
            display: block;
            color: white; 
            text-decoration: none; 
            padding: 12px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.2);
        }
        a:hover { 
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .route-path {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-left: 10px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏖️ Cabana - All Pages</h1>
        <div class="stats">
            <strong>${exportedPages.length}</strong> pages exported successfully
        </div>
        
        <div class="section">
            <div class="section-title">📄 All Exported Pages</div>
            <ul>
                ${exportedPages.map(page => 
                    `<li>
                        <a href="./${page.filePath}">
                            ${page.route} 
                            <span class="route-path">${page.filePath}</span>
                        </a>
                    </li>`
                ).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;
  
  writeFileSync(indexPath, html);
  console.log('✅ Created index: all_pages.html');
  
  return indexPath;
}

async function main() {
  try {
    // Step 1: Build the project
    await buildProject();
    
    // Step 2: Start dev server
    const server = await startDevServer();
    
    // Step 3: Export all routes
    const exportedPages = await exportRoutes(server);
    
    // Step 4: Create index page
    const indexPath = createIndex(exportedPages);
    
    console.log('\n🎉 HTML export completed!');
    console.log(`📁 Output directory: ${join(projectRoot, 'out')}`);
    console.log(`🌐 Index page: ${indexPath}`);
    console.log(`📊 ${exportedPages.length} pages exported`);
    
    // Open the index page on macOS
    spawn('open', [indexPath], { stdio: 'ignore' });
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

main();
