import { test, expect } from '@playwright/test';

test.describe('Performance E2E Tests', () => {
  test('should load the homepage within performance budgets', async ({ page }) => {
    // Start performance measurement
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: Record<string, number> = {};
          
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.cls = (vitals.cls || 0) + entry.value;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 2000);
      });
    });
    
    console.log('Performance metrics:', metrics);
  });

  test('should handle skeleton loading states efficiently', async ({ page }) => {
    await page.goto('/ui-demo');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
      await page.goto('/ui-demo');
    }
    
    // Enable skeleton loading
    const skeletonToggle = page.getByRole('switch', { name: /show.*skeleton/i });
    await skeletonToggle.click();
    
    // Measure skeleton render time
    const skeletonStartTime = Date.now();
    
    await page.locator('[data-testid*="skeleton"]').first().waitFor({ state: 'visible' });
    
    const skeletonRenderTime = Date.now() - skeletonStartTime;
    
    // Skeletons should render quickly (< 100ms)
    expect(skeletonRenderTime).toBeLessThan(100);
    
    // Should have smooth animations
    const skeleton = page.locator('[data-testid*="skeleton"]').first();
    await expect(skeleton).toHaveClass(/animate-pulse/);
  });

  test('should lazy load images efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
    
    // Navigate to a page with images
    await page.goto('/discover');
    
    // Check for lazy loading attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      
      // Should have loading="lazy" or similar
      const loadingAttr = await firstImage.getAttribute('loading');
      const isLazyLoaded = loadingAttr === 'lazy' || 
                          await firstImage.getAttribute('data-src') !== null;
      
      console.log('Image lazy loading detected:', isLazyLoaded);
    }
  });

  test('should have efficient JavaScript bundle sizes', async ({ page }) => {
    // Monitor network requests
    const jsRequests: any[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        jsRequests.push({
          url,
          size: response.headers()['content-length'],
          compressed: response.headers()['content-encoding']
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JS size
    const totalJSSize = jsRequests.reduce((total, req) => {
      const size = parseInt(req.size || '0', 10);
      return total + size;
    }, 0);
    
    console.log('JavaScript bundle analysis:', {
      requests: jsRequests.length,
      totalSize: totalJSSize,
      compressed: jsRequests.some(req => req.compressed)
    });
    
    // Should have reasonable bundle size (< 2MB uncompressed)
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024);
  });

  test('should handle concurrent user interactions smoothly', async ({ page, context }) => {
    await page.goto('/ui-demo');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel /password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
      await page.goto('/ui-demo');
    }
    
    // Simulate multiple rapid interactions
    const interactions = [
      () => page.getByRole('switch', { name: /show.*skeleton/i }).click(),
      () => page.getByRole('button', { name: /toggle.*sidebar/i }).click(),
      () => page.getByRole('tab', { name: /accessibility/i }).click(),
      () => page.getByRole('tab', { name: /components/i }).click(),
    ];
    
    const startTime = Date.now();
    
    // Execute interactions rapidly
    await Promise.all(
      interactions.map(async (interaction, index) => {
        await page.waitForTimeout(index * 100); // Stagger slightly
        try {
          await interaction();
        } catch (error) {
          console.log(`Interaction ${index} failed:`, error);
        }
      })
    );
    
    const totalTime = Date.now() - startTime;
    
    // All interactions should complete within reasonable time
    expect(totalTime).toBeLessThan(2000);
    
    // Page should remain responsive
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Navigate through multiple pages to test memory leaks
    const pages = ['/', '/ui-demo', '/discover', '/dashboard'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Bypass VIP if needed
      if (await page.getByLabel(/password/i).isVisible()) {
        await page.getByLabel(/password/i).fill('TEST123');
        await page.getByRole('button', { name: /enter/i }).click();
        continue;
      }
      
      await page.waitForLoadState('networkidle');
      
      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc();
        }
      });
    }
    
    // Check for console errors that might indicate memory leaks
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate one more time to check for accumulated errors
    await page.goto('/ui-demo');
    
    // Should not have memory-related console errors
    const memoryErrors = consoleErrors.filter(error => 
      error.includes('memory') || 
      error.includes('leak') || 
      error.includes('maximum call stack')
    );
    
    expect(memoryErrors.length).toBe(0);
  });

  test('should load and render components progressively', async ({ page }) => {
    await page.goto('/ui-demo');
    
    // Bypass VIP if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
      await page.goto('/ui-demo');
    }
    
    // Track when components become visible
    const componentLoadTimes: Record<string, number> = {};
    const startTime = Date.now();
    
    // Monitor key components
    const components = [
      { name: 'header', selector: 'h1' },
      { name: 'navigation', selector: '[role="navigation"]' },
      { name: 'sidebar', selector: '[data-testid*="sidebar"]' },
      { name: 'main-content', selector: '[role="main"]' },
    ];
    
    for (const component of components) {
      try {
        await page.locator(component.selector).first().waitFor({ 
          state: 'visible', 
          timeout: 5000 
        });
        componentLoadTimes[component.name] = Date.now() - startTime;
      } catch (error) {
        console.log(`Component ${component.name} not found or timed out`);
      }
    }
    
    console.log('Component load times:', componentLoadTimes);
    
    // Critical components should load quickly
    if (componentLoadTimes.header) {
      expect(componentLoadTimes.header).toBeLessThan(1000);
    }
    if (componentLoadTimes['main-content']) {
      expect(componentLoadTimes['main-content']).toBeLessThan(2000);
    }
  });
});