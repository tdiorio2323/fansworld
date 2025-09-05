import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const routes = [
  { path: '/', name: 'Homepage_SimpleVipEntry' },
  { path: '/signin', name: 'Sign_In' },
  { path: '/register', name: 'Register' },
  { path: '/discover', name: 'Discover_Creators' },
  { path: '/creator/testuser', name: 'Creator_Profile' },
  { path: '/agency', name: 'Agency_Landing' },
  { path: '/landing', name: 'Landing_Page' },
  { path: '/vip', name: 'VIP_Entry' },
  { path: '/subscription-plans', name: 'Subscription_Plans' },
  { path: '/feed', name: 'Public_Feed' },
  { path: '/admin', name: 'Admin_Dashboard' },
  { path: '/analytics', name: 'Analytics_Dashboard' },
  { path: '/creator-dashboard', name: 'Creator_Dashboard' },
  { path: '/content-manager', name: 'Content_Manager' },
  { path: '/messages', name: 'Messages' },
  { path: '/billing', name: 'Billing' },
  { path: '/settings', name: 'Settings' },
  { path: '/referrals', name: 'Referral_Program' },
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const screenshots = [];
  const outputDir = './screenshots';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Starting screenshot capture...');
  
  for (const route of routes) {
    try {
      console.log(`Capturing: ${route.name} (${route.path})`);
      
      await page.goto(`http://localhost:8080${route.path}`, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for page to load
      await page.waitForSelector('body', { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const filename = `${route.name}.png`;
      const filepath = path.join(outputDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true
      });
      
      screenshots.push({
        name: route.name.replace(/_/g, ' '),
        path: route.path,
        file: filepath
      });
      
      console.log(`✓ Captured: ${route.name}`);
      
    } catch (error) {
      console.log(`✗ Failed to capture ${route.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  return screenshots;
}

async function main() {
  try {
    console.log('CABANA Frontend Screenshot Generator');
    console.log('====================================');
    
    const screenshots = await captureScreenshots();
    
    console.log(`\n✓ Screenshot generation complete! Captured ${screenshots.length} pages`);
    console.log('Screenshots saved in ./screenshots/ directory');
    console.log('\nCaptured pages:');
    screenshots.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} (${s.path})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();