import { test, expect, Page, BrowserContext } from '@playwright/test';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

// Screenshot configuration
const SCREENSHOT_CONFIG = {
  desktop: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
  mobile: {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
  },
  tablet: {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
  }
};

// COMPREHENSIVE Routes configuration - EVERY SINGLE PAGE on CABANA platform
const ROUTES_CONFIG = [
  // MAIN PUBLIC ENTRY PAGES
  { path: '/', name: '01-homepage-vip-entry', auth: false },
  { path: '/SimpleVipEntry', name: '02-simple-vip-entry', auth: false },
  { path: '/vip', name: '03-vip-entry', auth: false },
  { path: '/test', name: '04-test-page', auth: false },
  { path: '/ui-demo', name: '05-enhanced-ui-demo', auth: false },
  
  // AUTHENTICATION PAGES
  { path: '/signin', name: '06-signin-page', auth: false },
  { path: '/login', name: '07-login-page', auth: false },
  { path: '/register', name: '08-register-page', auth: false },
  { path: '/signup', name: '09-signup-page', auth: false },
  { path: '/auth/callback', name: '10-auth-callback', auth: false },
  { path: '/AuthCallback', name: '11-auth-callback-alt', auth: false },
  
  // DISCOVERY & BROWSING PAGES
  { path: '/discover', name: '12-discover-page', auth: false },
  { path: '/feed', name: '13-feed-page', auth: false },
  { path: '/agency', name: '14-agency-page', auth: false },
  
  // ANALYTICS & DASHBOARD PAGES
  { path: '/analytics', name: '15-analytics-page', auth: false },
  { path: '/AnalyticsDashboard', name: '16-analytics-dashboard', auth: false },
  
  // SUBSCRIPTION & PAYMENT PAGES
  { path: '/subscription-plans', name: '17-subscription-plans', auth: false },
  { path: '/payment-success', name: '18-payment-success', auth: false },
  { path: '/PaymentSuccess', name: '19-payment-success-alt', auth: false },
  
  // LANDING PAGES
  { path: '/landing', name: '20-landing-page', auth: false },
  { path: '/LandingPage', name: '21-landing-page-alt', auth: false },
  
  // CREATOR PROFILE PAGES (Test with sample creator)
  { path: '/creator/demo-creator', name: '22-creator-profile-demo', auth: false },
  { path: '/creator/test-user', name: '23-creator-profile-test', auth: false },
  
  // ===== PROTECTED ROUTES (REQUIRE AUTHENTICATION) =====
  
  // REELS & CONTENT
  { path: '/reels', name: '24-reels-page', auth: true },
  
  // CREATOR APPLICATION & DASHBOARD
  { path: '/creator-application', name: '25-creator-application', auth: true },
  { path: '/creator-dashboard', name: '26-creator-dashboard', auth: true },
  { path: '/content-manager', name: '27-content-manager', auth: true },
  
  // REFERRALS & MARKETING
  { path: '/referrals', name: '28-referrals-page', auth: true },
  
  // USER MESSAGING
  { path: '/messages', name: '29-messages-page', auth: true },
  { path: '/Messages', name: '30-messages-alt', auth: true },
  
  // BILLING & PAYMENTS
  { path: '/billing', name: '31-billing-page', auth: true },
  { path: '/Billing', name: '32-billing-alt', auth: true },
  
  // USER SETTINGS
  { path: '/settings', name: '33-settings-page', auth: true },
  { path: '/Settings', name: '34-settings-alt', auth: true },
  
  // ===== ADMIN ROUTES (REQUIRE ADMIN AUTH) =====
  { path: '/admin', name: '35-admin-dashboard', auth: 'admin' },
  
  // ===== ERROR & FALLBACK PAGES =====
  { path: '/404-test-page', name: '36-404-not-found', auth: false },
  { path: '/invalid-route-test', name: '37-invalid-route-fallback', auth: false },
];

// Screenshot capture utility
class ScreenshotCapture {
  private screenshotsDir: string;
  private reportData: any[] = [];
  
  constructor() {
    this.screenshotsDir = path.join(process.cwd(), 'screenshots');
  }
  
  async ensureDirectoryExists(dirPath: string) {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }
  
  async captureScreenshot(
    page: Page, 
    route: typeof ROUTES_CONFIG[0], 
    viewport: 'desktop' | 'mobile' | 'tablet'
  ) {
    const { width, height, deviceScaleFactor } = SCREENSHOT_CONFIG[viewport];
    
    // Set viewport
    await page.setViewportSize({ width, height });
    
    const screenshotDir = path.join(this.screenshotsDir, viewport);
    await this.ensureDirectoryExists(screenshotDir);
    
    const filename = `${route.name}-${viewport}.png`;
    const screenshotPath = path.join(screenshotDir, filename);
    
    try {
      // Navigate to route with full URL
      console.log(`📸 Capturing ${route.path} (${viewport})...`);
      const fullUrl = `http://localhost:8080${route.path}`;
      await page.goto(fullUrl);
      
      // Wait for page to load and animations to settle
      await page.waitForLoadState('networkidle');
      
      // Wait for React to render - look for React-specific content
      try {
        // Wait for React components to mount (look for common React patterns)
        await page.waitForSelector('[data-testid], .react-component, #root > div', { timeout: 5000 });
      } catch (e) {
        console.log(`⚠️  No React content detected for ${route.path}`);
      }
      
      await page.waitForTimeout(2000); // Extra time for React routing
      
      // Take full page screenshot
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png',
        animations: 'disabled'
      });
      
      console.log(`✅ Screenshot saved: ${filename}`);
      
      this.reportData.push({
        route: route.path,
        name: route.name,
        viewport,
        filename,
        status: 'success',
        auth: route.auth,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error(`❌ Failed to capture ${route.path} (${viewport}):`, error);
      
      this.reportData.push({
        route: route.path,
        name: route.name,
        viewport,
        filename: null,
        status: 'error',
        error: error.message,
        auth: route.auth,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  async createTestUser(page: Page): Promise<boolean> {
    try {
      console.log('🔐 Creating test user...');
      
      // Go to register page  
      await page.goto('http://localhost:8080/register');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Generate unique test user
      const timestamp = Date.now();
      const testEmail = `cabana-test-${timestamp}@example.com`;
      const testPassword = 'TestPass123!@#';
      
      // Try multiple selectors for email input
      const emailSelectors = [
        'input[type="email"]',
        'input[name="email"]', 
        'input[placeholder*="email" i]',
        'input[autocomplete="email"]',
        '[data-testid="email"]'
      ];
      
      let emailFound = false;
      for (const selector of emailSelectors) {
        try {
          if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
            await page.locator(selector).first().fill(testEmail);
            emailFound = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!emailFound) {
        console.log('⚠️  Email field not found, trying login instead...');
        return await this.loginTestUser(page);
      }
      
      // Try multiple selectors for password
      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        '[data-testid="password"]'
      ];
      
      const passwordFields = [];
      for (const selector of passwordSelectors) {
        try {
          const fields = await page.locator(selector).all();
          passwordFields.push(...fields);
        } catch (e) {
          continue;
        }
      }
      
      if (passwordFields.length === 0) {
        console.log('⚠️  Password field not found');
        return false;
      }
      
      // Fill password field(s)
      await passwordFields[0].fill(testPassword);
      if (passwordFields.length > 1) {
        // Confirm password field
        await passwordFields[1].fill(testPassword);
      }
      
      // Submit form - try multiple selectors
      const submitSelectors = [
        'button[type="submit"]',
        'button:has-text("Sign Up")',
        'button:has-text("Register")',
        'button:has-text("Create Account")',
        '[data-testid="submit"]'
      ];
      
      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
            await page.locator(selector).first().click();
            submitted = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!submitted) {
        console.log('⚠️  Submit button not found');
        return false;
      }
      
      // Wait for registration to complete
      await page.waitForTimeout(5000);
      
      // Check for success indicators
      const currentUrl = page.url();
      const successIndicators = [
        '/dashboard',
        '/creator',
        '/feed',
        '/discover',
        'success',
        'welcome'
      ];
      
      const isSuccess = successIndicators.some(indicator => 
        currentUrl.toLowerCase().includes(indicator)
      );
      
      if (isSuccess) {
        console.log('✅ Test user created and logged in successfully');
        return true;
      }
      
      // Check for error messages
      const errorSelectors = [
        '[role="alert"]',
        '.error',
        '.alert-error',
        '[data-testid="error"]'
      ];
      
      for (const selector of errorSelectors) {
        try {
          if (await page.locator(selector).isVisible({ timeout: 1000 })) {
            const errorText = await page.locator(selector).textContent();
            console.log(`⚠️  Registration error: ${errorText}`);
          }
        } catch (e) {
          continue;
        }
      }
      
      console.log('⚠️  Registration may have failed, trying login...');
      return await this.loginTestUser(page);
      
    } catch (error) {
      console.error('❌ Failed to create test user:', error);
      return await this.loginTestUser(page);
    }
  }
  
  async loginTestUser(page: Page): Promise<boolean> {
    try {
      console.log('🔐 Attempting to login with demo credentials...');
      
      // Try common demo credentials
      const demoCredentials = [
        { email: 'demo@cabana.com', password: 'demo123' },
        { email: 'test@test.com', password: 'test123' },
        { email: 'admin@cabana.com', password: 'admin123' },
        { email: 'creator@cabana.com', password: 'creator123' }
      ];
      
      for (const creds of demoCredentials) {
        await page.goto('/signin');
        await page.waitForLoadState('networkidle');
        
        const emailSelector = 'input[type="email"], input[name="email"], input[placeholder*="email" i]';
        const passwordSelector = 'input[type="password"], input[name="password"]';
        const submitSelector = 'button[type="submit"], button:has-text("Sign In"), button:has-text("Login")';
        
        if (await page.locator(emailSelector).first().isVisible()) {
          await page.locator(emailSelector).first().fill(creds.email);
          await page.locator(passwordSelector).first().fill(creds.password);
          await page.locator(submitSelector).first().click();
          await page.waitForTimeout(3000);
          
          // Check if login was successful
          const currentUrl = page.url();
          if (!currentUrl.includes('/signin') && !currentUrl.includes('/login')) {
            console.log(`✅ Logged in successfully with ${creds.email}`);
            return true;
          }
        }
      }
      
      console.log('⚠️  No demo credentials worked, continuing without auth...');
      return false;
      
    } catch (error) {
      console.error('❌ Failed to login:', error);
      return false;
    }
  }
  
  async generateReport() {
    const reportPath = path.join(this.screenshotsDir, 'screenshot-report.json');
    const htmlReportPath = path.join(this.screenshotsDir, 'screenshot-report.html');
    
    // JSON Report
    await writeFile(reportPath, JSON.stringify(this.reportData, null, 2));
    
    // HTML Report
    const htmlReport = this.generateHTMLReport();
    await writeFile(htmlReportPath, htmlReport);
    
    console.log(`📊 Report generated: ${reportPath}`);
    console.log(`🌐 HTML Report: ${htmlReportPath}`);
  }
  
  private generateHTMLReport(): string {
    const successCount = this.reportData.filter(r => r.status === 'success').length;
    const errorCount = this.reportData.filter(r => r.status === 'error').length;
    const totalCount = this.reportData.length;
    
    return `<!DOCTYPE html>
<html>
<head>
    <title>CABANA Screenshot Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #ff6b9d 0%, #c44b9f 100%); }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { text-align: center; padding: 20px; border-radius: 8px; color: white; }
        .success { background: #4ade80; }
        .error { background: #f87171; }
        .total { background: #6366f1; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .screenshot-card img { width: 100%; height: 200px; object-fit: cover; }
        .card-content { padding: 15px; }
        .error-card { background: #fef2f2; border-color: #fca5a5; }
        h1 { color: #333; text-align: center; }
        h2 { color: #666; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>CABANA Platform Screenshot Report</h1>
        <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleString()}</p>
        
        <div class="stats">
            <div class="stat-card total">
                <h3>Total Screenshots</h3>
                <div style="font-size: 2em; font-weight: bold;">${totalCount}</div>
            </div>
            <div class="stat-card success">
                <h3>Successful</h3>
                <div style="font-size: 2em; font-weight: bold;">${successCount}</div>
            </div>
            <div class="stat-card error">
                <h3>Failed</h3>
                <div style="font-size: 2em; font-weight: bold;">${errorCount}</div>
            </div>
        </div>
        
        <h2>Screenshot Gallery</h2>
        <div class="gallery">
            ${this.reportData.map(item => `
                <div class="screenshot-card ${item.status === 'error' ? 'error-card' : ''}">
                    ${item.filename ? `<img src="${item.viewport}/${item.filename}" alt="${item.name}" loading="lazy">` : '<div style="height: 200px; display: flex; align-items: center; justify-content: center; background: #f9fafb; color: #6b7280;">Screenshot Failed</div>'}
                    <div class="card-content">
                        <h4>${item.name}</h4>
                        <p><strong>Route:</strong> ${item.route}</p>
                        <p><strong>Viewport:</strong> ${item.viewport}</p>
                        <p><strong>Auth Required:</strong> ${item.auth}</p>
                        <p><strong>Status:</strong> <span style="color: ${item.status === 'success' ? 'green' : 'red'}">${item.status}</span></p>
                        ${item.error ? `<p style="color: red;"><strong>Error:</strong> ${item.error}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }
}

// Main test suite
test.describe('CABANA Platform Screenshot Capture', () => {
  let capture: ScreenshotCapture;
  let userLoggedIn = false;
  
  test.beforeAll(async () => {
    capture = new ScreenshotCapture();
  });
  
  test.afterAll(async () => {
    await capture.generateReport();
  });
  
  test('Capture all CABANA platform screenshots', async ({ browser }) => {
    // Set extended timeout for comprehensive screenshot capture
    test.setTimeout(300000); // 5 minutes
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      permissions: ['notifications', 'geolocation'],
    });
    
    const page = await context.newPage();
    
    // Set base URL
    const baseURL = 'http://localhost:8080';
    
    try {
      // Test if server is running
      console.log('🔍 Testing server connection...');
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
      console.log('✅ Server is running');
      
    } catch (error) {
      console.error('❌ Server is not running on http://localhost:8080');
      console.error('Please start the server with: npm run dev');
      throw new Error('Server not accessible');
    }
    
    // Try to create/login user for protected routes
    const authSuccess = await capture.createTestUser(page) || await capture.loginTestUser(page);
    if (authSuccess) {
      userLoggedIn = true;
    }
    
    // Capture screenshots for each route and viewport
    for (const route of ROUTES_CONFIG) {
      // For auth-required routes, try to capture anyway (for demo purposes)
      if (route.auth && !userLoggedIn) {
        console.log(`🔐 Attempting to capture protected route ${route.path} anyway...`);
        // Still capture but note it's protected
      }
      
      // Capture desktop screenshots
      await capture.captureScreenshot(page, route, 'desktop');
      
      // Capture mobile screenshots
      await capture.captureScreenshot(page, route, 'mobile');
      
      // Small delay between routes
      await page.waitForTimeout(500);
    }
    
    // Try to capture some dynamic content states
    await capture.captureStates(page);
    
    await context.close();
  });
  
  // Additional test for modal/overlay states
  test('Capture modal and overlay states', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Capture modals if they exist
      await page.goto('http://localhost:8080/');
      await page.waitForLoadState('networkidle');
      
      // Look for modal triggers
      const modalTriggers = await page.locator('button:has-text("Sign Up"), button:has-text("Login"), button:has-text("Get Started")').all();
      
      for (let i = 0; i < Math.min(modalTriggers.length, 3); i++) {
        try {
          await modalTriggers[i].click();
          await page.waitForTimeout(1000);
          
          await page.screenshot({
            path: `screenshots/desktop/modal-state-${i + 1}.png`,
            fullPage: true,
            type: 'png'
          });
          
          // Close modal (try common close methods)
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);
        } catch (error) {
          console.log(`Modal ${i + 1} capture failed:`, error.message);
        }
      }
      
    } catch (error) {
      console.log('Modal capture failed:', error.message);
    }
    
    await context.close();
  });
});

// Extend ScreenshotCapture class with additional state capture methods
declare module './screenshot-capture.spec' {
  interface ScreenshotCapture {
    captureStates(page: Page): Promise<void>;
  }
}

ScreenshotCapture.prototype.captureStates = async function(page: Page) {
  // Capture loading states
  try {
    await page.goto('http://localhost:8080/discover');
    await page.screenshot({
      path: `screenshots/desktop/loading-state.png`,
      type: 'png'
    });
  } catch (error) {
    console.log('Loading state capture failed:', error.message);
  }
};