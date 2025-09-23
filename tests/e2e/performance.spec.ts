import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Bypass VIP gate for performance tests
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
  });

  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Homepage should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have acceptable First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('paint'));
    });
    
    const paintEntries = JSON.parse(performanceEntries);
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (fcp) {
      // FCP should be under 1.5 seconds
      expect(fcp.startTime).toBeLessThan(1500);
    }
  });

  test('should load critical resources efficiently', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const resourceType = response.request().resourceType();
      
      // Track critical resources
      if (resourceType === 'document' || resourceType === 'stylesheet' || resourceType === 'script') {
        responses.push({
          url,
          status: response.status(),
          timing: response.timing(),
          resourceType
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that critical resources loaded successfully
    const criticalResources = responses.filter(r => 
      r.resourceType === 'document' || 
      r.resourceType === 'stylesheet' || 
      r.resourceType === 'script'
    );
    
    criticalResources.forEach(resource => {
      expect(resource.status).toBeLessThan(400);
    });
    
    // No resource should take more than 5 seconds
    criticalResources.forEach(resource => {
      if (resource.timing) {
        const totalTime = resource.timing.responseEnd - resource.timing.requestStart;
        expect(totalTime).toBeLessThan(5000);
      }
    });
  });

  test('should handle large lists efficiently', async ({ page }) => {
    // Navigate to a page with potentially large lists
    await page.goto('/feed');
    
    const startTime = Date.now();
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="feed-item"], .feed-item', { timeout: 10000 });
    
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    
    // Large lists should render within 2 seconds
    expect(renderTime).toBeLessThan(2000);
    
    // Check for virtualization or pagination
    const feedItems = await page.locator('[data-testid="feed-item"], .feed-item').count();
    
    // If there are many items, they should be paginated or virtualized
    if (feedItems > 50) {
      // Should have pagination controls or infinite scroll
      const hasLoadMore = await page.getByText(/load.*more|show.*more/i).isVisible();
      const hasPagination = await page.getByRole('navigation', { name: /pagination/i }).isVisible();
      
      expect(hasLoadMore || hasPagination).toBeTruthy();
    }
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/feed');
    
    // Wait for images to start loading
    await page.waitForTimeout(1000);
    
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 5)) { // Test first 5 images
      // Check for lazy loading
      const loading = await img.getAttribute('loading');
      const hasLazy = loading === 'lazy';
      
      // Check for responsive images
      const srcset = await img.getAttribute('srcset');
      const hasSrcset = Boolean(srcset);
      
      // At least one optimization should be present
      expect(hasLazy || hasSrcset).toBeTruthy();
    }
  });

  test('should have minimal bundle size impact', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') || url.includes('.css')) {
        responses.push({
          url,
          size: response.headers()['content-length'],
          compressed: response.headers()['content-encoding']
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JavaScript size
    const jsResponses = responses.filter(r => r.url.includes('.js'));
    const totalJSSize = jsResponses.reduce((total, r) => total + (parseInt(r.size) || 0), 0);
    
    // Calculate total CSS size
    const cssResponses = responses.filter(r => r.url.includes('.css'));
    const totalCSSSize = cssResponses.reduce((total, r) => total + (parseInt(r.size) || 0), 0);
    
    console.log(`Total JS size: ${totalJSSize} bytes`);
    console.log(`Total CSS size: ${totalCSSSize} bytes`);
    
    // Reasonable size limits (these can be adjusted based on requirements)
    expect(totalJSSize).toBeLessThan(1024 * 1024); // 1MB for JS
    expect(totalCSSSize).toBeLessThan(512 * 1024);  // 512KB for CSS
    
    // Check for compression
    const compressedResources = responses.filter(r => r.compressed === 'gzip' || r.compressed === 'br');
    const compressionRatio = compressedResources.length / responses.length;
    
    // At least 80% of assets should be compressed
    expect(compressionRatio).toBeGreaterThan(0.8);
  });

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/ui-demo');
    
    // Test animation performance
    const startTime = Date.now();
    
    // Trigger some animations
    const animatedElements = await page.locator('[class*="animate-"], [class*="transition-"]').all();
    
    if (animatedElements.length > 0) {
      // Click on animated elements to trigger transitions
      for (const element of animatedElements.slice(0, 3)) {
        if (await element.isVisible()) {
          await element.hover();
          await page.waitForTimeout(100);
        }
      }
    }
    
    const endTime = Date.now();
    const animationTime = endTime - startTime;
    
    // Animations should be responsive
    expect(animationTime).toBeLessThan(1000);
  });

  test('should maintain performance with skeleton loaders', async ({ page }) => {
    await page.goto('/ui-demo');
    
    // Enable skeleton loaders
    const skeletonToggle = page.getByRole('switch', { name: /show.*skeleton/i });
    if (await skeletonToggle.isVisible()) {
      const startTime = Date.now();
      
      await skeletonToggle.click();
      
      // Wait for skeletons to appear
      await page.waitForSelector('[data-testid*="skeleton"]', { timeout: 2000 });
      
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      // Skeleton rendering should be fast
      expect(renderTime).toBeLessThan(500);
      
      // Toggle off and measure again
      const toggleOffStart = Date.now();
      
      await skeletonToggle.click();
      
      // Wait for content to appear
      await page.waitForTimeout(100);
      
      const toggleOffEnd = Date.now();
      const toggleOffTime = toggleOffEnd - toggleOffStart;
      
      // Toggling should be smooth
      expect(toggleOffTime).toBeLessThan(500);
    }
  });

  test('should handle progressive disclosure efficiently', async ({ page }) => {
    await page.goto('/ui-demo');
    
    const expandButtons = await page.getByText(/show.*more|expand/i).all();
    
    if (expandButtons.length > 0) {
      const startTime = Date.now();
      
      // Expand several sections
      for (const button of expandButtons.slice(0, 3)) {
        if (await button.isVisible()) {
          await button.click();
          await page.waitForTimeout(50);
        }
      }
      
      const endTime = Date.now();
      const expansionTime = endTime - startTime;
      
      // Progressive disclosure should be smooth
      expect(expansionTime).toBeLessThan(1000);
    }
  });

  test('should optimize search and filtering performance', async ({ page }) => {
    // Navigate to a page with search functionality
    await page.goto('/discover');
    
    const searchInput = page.getByRole('textbox', { name: /search/i });
    
    if (await searchInput.isVisible()) {
      const startTime = Date.now();
      
      // Type search query
      await searchInput.fill('test query');
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      const endTime = Date.now();
      const searchTime = endTime - startTime;
      
      // Search should provide immediate feedback
      expect(searchTime).toBeLessThan(1000);
      
      // Check for debouncing (no excessive requests)
      const networkRequests: string[] = [];
      
      page.on('request', request => {
        if (request.url().includes('search') || request.url().includes('filter')) {
          networkRequests.push(request.url());
        }
      });
      
      // Type multiple characters quickly
      await searchInput.fill('');
      await searchInput.type('quick typing test', { delay: 50 });
      
      await page.waitForTimeout(1000);
      
      // Should not make excessive requests
      expect(networkRequests.length).toBeLessThan(5);
    }
  });
});