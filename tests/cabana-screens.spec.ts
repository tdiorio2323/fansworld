import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Screenshot configuration
const SCREENSHOT_CONFIG = {
  desktop: {
    width: 1920,
    height: 1080,
  },
  mobile: {
    width: 375,
    height: 812,
  }
};

// Ensure screenshots directory exists
async function ensureScreenshotsDir() {
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!existsSync(screenshotsDir)) {
    await mkdir(screenshotsDir, { recursive: true });
  }
  return screenshotsDir;
}

test.describe('CABANA Screens Screenshot Capture', () => {
  let screenshotsDir: string;

  test.beforeAll(async () => {
    screenshotsDir = await ensureScreenshotsDir();
  });

  test('Visit /auth/login and take screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(SCREENSHOT_CONFIG.desktop);
    
    // Navigate to login page
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, 'auth-login-desktop.png'),
      fullPage: true,
      type: 'png'
    });
    
    // Verify page loaded correctly
    expect(await page.title()).not.toBe('');
  });

  test('Visit /pricing and take screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(SCREENSHOT_CONFIG.desktop);
    
    // Navigate to pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, 'pricing-desktop.png'),
      fullPage: true,
      type: 'png'
    });
    
    // Verify page loaded correctly
    expect(await page.title()).not.toBe('');
  });

  test('Visit creator page and take screenshot', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(SCREENSHOT_CONFIG.desktop);
    
    // Navigate to creator page (using demo creator)
    await page.goto('/creator/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, 'creator-page-desktop.png'),
      fullPage: true,
      type: 'png'
    });
    
    // Verify page loaded correctly
    expect(await page.title()).not.toBe('');
  });

  test('Visit creator page and look for paywalled content', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize(SCREENSHOT_CONFIG.desktop);
    
    // Navigate to creator page
    await page.goto('/creator/demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for paywalled content indicators
    const paywallElements = [
      '[data-testid="paywall"]',
      '.paywall',
      '.locked-content',
      'button:has-text("Unlock")',
      'button:has-text("Subscribe")',
      'div:has-text("Subscriber Only")',
      'div:has-text("Premium Content")'
    ];
    
    let foundPaywall = false;
    
    for (const selector of paywallElements) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          foundPaywall = true;
          
          // Take screenshot of paywalled content
          await page.screenshot({
            path: path.join(screenshotsDir, 'paywalled-content-desktop.png'),
            fullPage: true,
            type: 'png'
          });
          
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!foundPaywall) {
      // Take a general screenshot anyway for documentation
      await page.screenshot({
        path: path.join(screenshotsDir, 'creator-content-desktop.png'),
        fullPage: true,
        type: 'png'
      });
    }
    
    // Page should have loaded
    expect(await page.title()).not.toBe('');
  });

  test('Take mobile screenshots', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(SCREENSHOT_CONFIG.mobile);
    
    const pages = [
      { url: '/auth/login', filename: 'auth-login-mobile.png' },
      { url: '/pricing', filename: 'pricing-mobile.png' },
      { url: '/creator/demo', filename: 'creator-page-mobile.png' }
    ];
    
    for (const pageConfig of pages) {
      await page.goto(pageConfig.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({
        path: path.join(screenshotsDir, pageConfig.filename),
        fullPage: true,
        type: 'png'
      });
    }
    
    // Verify the last page loaded correctly
    expect(await page.title()).not.toBe('');
  });

  test('Generate screenshot report', async () => {
    const reportPath = path.join(screenshotsDir, 'cabana-screens-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      screenshots: [
        'auth-login-desktop.png',
        'auth-login-mobile.png',
        'pricing-desktop.png',
        'pricing-mobile.png',
        'creator-page-desktop.png',
        'creator-page-mobile.png',
        'paywalled-content-desktop.png',
        'creator-content-desktop.png'
      ],
      description: 'CABANA platform screen captures for login, pricing, creator pages, and paywalled content'
    };
    
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Screenshot report generated: ${reportPath}`);
  });
});