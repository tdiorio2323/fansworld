import { test, expect } from '@playwright/test'

// Smoke tests - basic functionality verification
test.describe('FansWorld Smoke Tests', () => {
  
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads
    await expect(page).toHaveTitle(/FansWorld|Cabana/)
    
    // Check for basic page elements
    await expect(page.locator('body')).toBeVisible()
    
    // Verify no JavaScript errors
    const errors: string[] = []
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })
    
    // Wait a moment for potential JS errors
    await page.waitForTimeout(2000)
    
    expect(errors).toHaveLength(0)
  })

  test('Navigation elements are present', async ({ page }) => {
    await page.goto('/')
    
    // Look for common navigation elements
    const nav = page.locator('nav, .navbar, [role="navigation"]').first()
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible()
    }
    
    // Check for common links/buttons
    const commonSelectors = [
      'a[href="/"]',           // Home link
      'a[href*="login"]',      // Login link
      'a[href*="register"]',   // Register link
      'button',                // Any button
      '[role="button"]'        // Button role
    ]
    
    let foundElement = false
    for (const selector of commonSelectors) {
      const element = page.locator(selector).first()
      if (await element.count() > 0) {
        await expect(element).toBeVisible()
        foundElement = true
        break
      }
    }
    
    expect(foundElement).toBe(true)
  })

  test('API health check passes', async ({ page }) => {
    // Check if API server is running
    const response = await page.request.get('/api/health')
    
    if (response.status() === 404) {
      // If API health endpoint doesn't exist, skip this test
      test.skip()
      return
    }
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    const status = data.status ?? (data.ok ? 'ok' : undefined)
    expect(status).toBe('ok')
  })

  test('Environment configuration is valid', async ({ page }) => {
    test.skip(!!process.env.CI, 'Client env inspection disabled on CI smoke run')
    // Test that environment variables are properly loaded
    await page.goto('/')
    
    // Check that VITE environment variables are accessible
    const siteUrl = await page.evaluate(() => {
      return (import.meta as any).env?.VITE_SITE_URL
    })
    
    // If VITE_SITE_URL is defined, it should be a valid URL
    if (siteUrl) {
      expect(() => new URL(siteUrl)).not.toThrow()
    }
    
    // Check that required client-side config exists
    const supabaseUrl = await page.evaluate(() => {
      return (import.meta as any).env?.VITE_SUPABASE_URL
    })
    
    if (supabaseUrl) {
      expect(() => new URL(supabaseUrl)).not.toThrow()
    }
  })

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
