const { chromium } = require('playwright');

(async () => {
  console.log('📸 Starting screenshot capture of updated pages...\n');
  
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/discover', name: 'discover' },
    { path: '/signin', name: 'signin' },
    { path: '/register', name: 'register' },
    { path: '/about', name: 'about' },
    { path: '/features', name: 'features' },
    { path: '/pricing', name: 'pricing' },
    { path: '/help', name: 'help' },
    { path: '/forum', name: 'forum' },
    { path: '/landing', name: 'landing' }
  ];
  
  for (const pageInfo of pages) {
    try {
      console.log(`Capturing ${pageInfo.name}...`);
      await page.goto(`http://localhost:8080${pageInfo.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: `screenshots/updated-${pageInfo.name}.png`,
        fullPage: true
      });
      console.log(`✅ Captured ${pageInfo.name}`);
    } catch (error) {
      console.log(`❌ Failed to capture ${pageInfo.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✨ Screenshot capture complete!');
})();