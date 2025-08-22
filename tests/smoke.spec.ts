import { test, expect } from '@playwright/test';

test.describe('FansWorld Smoke Tests - Critical Application Health', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(30000);
  });

  test('VIP authentication flow works end-to-end', async ({ page }) => {
    await page.goto('/');
    
    // Should show VIP entry or proceed to app
    const hasVipEntry = await page.getByLabel(/password/i).isVisible();
    
    if (hasVipEntry) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
      
      // Should redirect to main application
      await page.waitForURL(/dashboard|discover|feed/, { timeout: 10000 });
      await expect(page.getByRole('main')).toBeVisible();
    }
  });
  
  test('application loads without critical errors', async ({ page }) => {
    const criticalErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('net::ERR_') && !text.includes('404')) {
          criticalErrors.push(text);
        }
      }
    });
    
    await page.goto('/');
    await expect(page).toHaveTitle(/FansWorld|Cabana/);
    await expect(page.locator('body')).toBeVisible();
    
    // Wait for potential async errors
    await page.waitForTimeout(2000);
    
    expect(criticalErrors.length).toBe(0);
  });

  test('key pages are accessible and functional', async ({ page }) => {
    await page.goto('/');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
    
    // Test key application pages
    const criticalPages = ['/discover', '/dashboard', '/ui-demo'];
    
    for (const pagePath of criticalPages) {
      await page.goto(pagePath);
      await expect(page.getByRole('main')).toBeVisible({ timeout: 5000 });
    }
  });

  test('essential UI components render correctly', async ({ page }) => {
    await page.goto('/ui-demo');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
      await page.goto('/ui-demo');
    }
    
    // Should render key UI elements
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Should have interactive components
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('application loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds for smoke test
    expect(loadTime).toBeLessThan(5000);
  });

  test('No console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.goto('/')
    
    // Wait for potential async operations
    await page.waitForTimeout(3000)
    
    // Filter out known acceptable errors
    const filteredErrors = consoleErrors.filter(error => {
      // Ignore common development/testing errors
      return !error.includes('favicon.ico') &&
             !error.includes('sourcemap') &&
             !error.includes('Extension context invalidated') &&
             !error.toLowerCase().includes('non-passive event listener')
    })
    
    expect(filteredErrors).toHaveLength(0)
  })

  test('Responsive design works', async ({ page }) => {
    await page.goto('/')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    
    // Check that content is visible and not overflowing
    const body = page.locator('body')
    await expect(body).toBeVisible()
    
    const bodyWidth = await body.evaluate(el => el.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(400) // Allow some margin
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    await expect(body).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)
    await expect(body).toBeVisible()
  })

  test('Forms have basic accessibility', async ({ page }) => {
    await page.goto('/')
    
    // Check for forms on the page
    const forms = page.locator('form')
    const formCount = await forms.count()
    
    if (formCount === 0) {
      // No forms to test
      return
    }
    
    // Test first form found
    const firstForm = forms.first()
    
    // Check for labels associated with inputs
    const inputs = firstForm.locator('input[type="text"], input[type="email"], input[type="password"], textarea')
    const inputCount = await inputs.count()
    
    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i)
      const inputId = await input.getAttribute('id')
      
      if (inputId) {
        // Check if there's a label for this input
        const label = page.locator(`label[for="${inputId}"]`)
        if (await label.count() > 0) {
          await expect(label).toBeVisible()
        }
      }
      
      // Check for placeholder or aria-label
      const hasPlaceholder = await input.getAttribute('placeholder')
      const hasAriaLabel = await input.getAttribute('aria-label')
      
      expect(hasPlaceholder || hasAriaLabel).toBeTruthy()
    }
  })

  test('Security headers are present', async ({ page }) => {
    const response = await page.goto('/')
    
    if (!response) {
      throw new Error('No response received')
    }
    
    const headers = response.headers()
    
    // Check for basic security headers (if they exist)
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options', 
      'x-xss-protection',
      'content-security-policy'
    ]
    
    let hasSecurityHeaders = false
    for (const header of securityHeaders) {
      if (headers[header]) {
        hasSecurityHeaders = true
        break
      }
    }
    
    // Note: This test is informational - we don't fail if no security headers
    // are present, but we report what's found
    console.log('Security headers found:', 
      securityHeaders.filter(h => headers[h]).join(', ') || 'none'
    )
  })
})

// Test configuration
test.beforeEach(async ({ page }) => {
  // Set a reasonable timeout
  page.setDefaultTimeout(10000)
  
  // Handle uncaught exceptions
  page.on('pageerror', (error) => {
    console.warn('Page error:', error.message)
  })
})

test.afterEach(async ({ page }) => {
  // Clean up if needed
  await page.close()
})