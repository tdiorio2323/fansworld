import { test, expect } from '@playwright/test';

test.describe('Enhanced UI Components E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to UI demo page (bypass VIP if needed)
    await page.goto('/');
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
    await page.goto('/ui-demo');
  });

  test('should display enhanced UI demo page', async ({ page }) => {
    // Should show the main heading
    await expect(page.getByRole('heading', { name: /enhanced.*ui.*components/i })).toBeVisible();
    
    // Should show component sections
    await expect(page.getByText(/skeleton.*loading/i)).toBeVisible();
    await expect(page.getByText(/navigation.*components/i)).toBeVisible();
    await expect(page.getByText(/accessibility.*features/i)).toBeVisible();
  });

  test('should demonstrate skeleton loading states', async ({ page }) => {
    // Find and click skeleton toggle
    const skeletonToggle = page.getByRole('switch', { name: /show.*skeleton/i });
    await skeletonToggle.click();
    
    // Should show skeleton loaders
    await expect(page.locator('[data-testid*="skeleton"]').first()).toBeVisible();
    
    // Skeletons should have animation class
    const skeleton = page.locator('[data-testid*="skeleton"]').first();
    await expect(skeleton).toHaveClass(/animate-pulse/);
    
    // Toggle off
    await skeletonToggle.click();
    
    // Should hide skeletons
    await expect(page.locator('[data-testid*="skeleton"]').first()).not.toBeVisible();
  });

  test('should show breadcrumb navigation', async ({ page }) => {
    // Should show breadcrumb navigation
    const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i });
    await expect(breadcrumb).toBeVisible();
    
    // Should show breadcrumb items
    await expect(breadcrumb.getByText('Dashboard')).toBeVisible();
    await expect(breadcrumb.getByText('UI Components')).toBeVisible();
    await expect(breadcrumb.getByText('Enhanced Demo')).toBeVisible();
    
    // Breadcrumb links should be clickable
    const homeLink = breadcrumb.getByRole('link', { name: 'Dashboard' });
    if (await homeLink.isVisible()) {
      await expect(homeLink).toHaveAttribute('href', '/dashboard');
    }
  });

  test('should toggle sidebar collapse state', async ({ page }) => {
    // Find sidebar toggle
    const sidebarToggle = page.getByRole('button', { name: /toggle.*sidebar/i });
    await expect(sidebarToggle).toBeVisible();
    
    // Click to collapse
    await sidebarToggle.click();
    
    // Should change sidebar state (check for visual changes)
    const sidebar = page.locator('[data-testid="enhanced-sidebar"]');
    if (await sidebar.isVisible()) {
      // Check if sidebar has collapsed state class or reduced width
      await expect(sidebar).toHaveClass(/collapsed|w-16|w-20/);
    }
    
    // Click to expand
    await sidebarToggle.click();
    
    // Should restore sidebar
    if (await sidebar.isVisible()) {
      await expect(sidebar).not.toHaveClass(/collapsed/);
    }
  });

  test('should navigate between demo tabs', async ({ page }) => {
    // Should have tabs
    const componentsTab = page.getByRole('tab', { name: /components/i });
    const accessibilityTab = page.getByRole('tab', { name: /accessibility/i });
    const examplesTab = page.getByRole('tab', { name: /examples/i });
    
    await expect(componentsTab).toBeVisible();
    await expect(accessibilityTab).toBeVisible();
    
    // Switch to accessibility tab
    await accessibilityTab.click();
    
    // Should show accessibility content
    await expect(page.getByText(/keyboard.*shortcuts/i)).toBeVisible();
    
    // Switch to examples tab if it exists
    if (await examplesTab.isVisible()) {
      await examplesTab.click();
      await expect(page.getByText(/examples/i)).toBeVisible();
    }
  });

  test('should display empty states correctly', async ({ page }) => {
    // Should show different empty state variants
    await expect(page.getByText(/no.*data.*available/i)).toBeVisible();
    await expect(page.getByText(/no.*results.*found/i)).toBeVisible();
    await expect(page.getByText(/no.*content.*yet/i)).toBeVisible();
    
    // Empty states should have action buttons
    const actionButtons = page.getByRole('button', { name: /create|add|get.*started/i });
    const buttonCount = await actionButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Action buttons should be clickable
    if (buttonCount > 0) {
      await actionButtons.first().click();
      // Should handle the action (implementation dependent)
    }
  });

  test('should demonstrate progressive disclosure', async ({ page }) => {
    // Look for expandable content
    const showMoreButtons = page.getByRole('button', { name: /show.*more/i });
    const expandButtons = page.getByRole('button', { name: /expand/i });
    
    if (await showMoreButtons.count() > 0) {
      await showMoreButtons.first().click();
      
      // Should expand content
      await expect(page.getByText(/show.*less/i)).toBeVisible();
      
      // Should show additional content
      await expect(page.locator('[data-testid*="expanded-content"]')).toBeVisible();
    }
    
    if (await expandButtons.count() > 0) {
      await expandButtons.first().click();
      
      // Should expand section
      await expect(page.getByRole('button', { name: /collapse/i })).toBeVisible();
    }
  });

  test('should handle stepper navigation', async ({ page }) => {
    // Look for stepper component
    const stepper = page.locator('[data-testid*="stepper"]');
    if (await stepper.isVisible()) {
      // Should show current step
      await expect(stepper.getByText(/step.*1/i)).toBeVisible();
      
      // Find next button
      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        
        // Should advance to next step
        await expect(stepper.getByText(/step.*2/i)).toBeVisible();
        
        // Should show back button
        await expect(page.getByRole('button', { name: /back|previous/i })).toBeVisible();
      }
    }
  });
});

test.describe('Accessibility Features E2E Tests', () => {
  test('should support keyboard navigation', async ({ page }) => {
    // Focus should be manageable with keyboard
    await page.keyboard.press('Tab');
    
    // Should have visible focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Should be able to navigate with arrow keys in appropriate components
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
  });

  test('should show keyboard shortcuts help', async ({ page }) => {
    // Press help key
    await page.keyboard.press('?');
    
    // Should show keyboard shortcuts modal
    await expect(page.getByRole('dialog', { name: /keyboard.*shortcuts/i })).toBeVisible();
    
    // Should show shortcut list
    await expect(page.getByText(/ctrl.*k/i)).toBeVisible();
    await expect(page.getByText(/search/i)).toBeVisible();
    
    // Should be able to close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: /keyboard.*shortcuts/i })).not.toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check for ARIA landmarks
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    
    // Interactive elements should have proper labels
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(5, buttonCount); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Should have accessible name
        const accessibleName = await button.getAttribute('aria-label') || 
                              await button.textContent();
        expect(accessibleName).toBeTruthy();
      }
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for skip links
    const skipLink = page.getByRole('link', { name: /skip.*content/i });
    if (await skipLink.isVisible()) {
      await skipLink.click();
      
      // Should jump to main content
      const mainContent = page.getByRole('main');
      await expect(mainContent).toBeFocused();
    }
    
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    
    const h2s = page.getByRole('heading', { level: 2 });
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });
});

test.describe('Responsive Design E2E Tests', () => {
  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should adapt layout for mobile
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Mobile navigation should work
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
    
    // Components should be touch-friendly
    const buttons = page.getByRole('button').first();
    const buttonBox = await buttons.boundingBox();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44); // Minimum touch target
    }
  });

  test('should work on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Should show tablet-optimized layout
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Should have appropriate spacing and sizing
    const mainContent = page.getByRole('main');
    await expect(mainContent).toBeVisible();
  });

  test('should work on desktop devices', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Should show full desktop layout
    await expect(page.getByRole('heading')).toBeVisible();
    
    // Should utilize available space effectively
    const sidebar = page.locator('[data-testid="enhanced-sidebar"]');
    if (await sidebar.isVisible()) {
      const sidebarBox = await sidebar.boundingBox();
      if (sidebarBox) {
        expect(sidebarBox.width).toBeGreaterThan(200); // Expanded sidebar on desktop
      }
    }
  });
});