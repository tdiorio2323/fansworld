import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should allow VIP entry with correct code', async ({ page }) => {
    // Should show VIP entry form
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Enter VIP code
    await page.getByLabel(/password/i).fill('TEST123');
    await page.getByRole('button', { name: /enter/i }).click();
    
    // Should proceed to main application
    await expect(page).toHaveURL(/dashboard|discover|feed/);
  });

  test('should show error for incorrect VIP code', async ({ page }) => {
    // Enter incorrect VIP code
    await page.getByLabel(/password/i).fill('WRONG123');
    await page.getByRole('button', { name: /enter/i }).click();
    
    // Should show error message
    await expect(page.getByText(/incorrect.*password/i)).toBeVisible();
    
    // Should remain on VIP entry page
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Bypass VIP entry if needed
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
    
    // Navigate to registration
    await page.getByRole('link', { name: /register/i }).click();
    
    // Should be on registration page
    await expect(page).toHaveURL(/register/);
    await expect(page.getByRole('heading', { name: /sign.*up/i })).toBeVisible();
  });

  test('should handle user registration flow', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');
    
    // Fill out registration form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('SecurePass123!');
    
    // Submit registration
    await page.getByRole('button', { name: /sign.*up/i }).click();
    
    // Should show success message or redirect
    await expect(
      page.getByText(/check.*email|registration.*successful|welcome/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('should validate registration form fields', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign.*up/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/email.*required/i)).toBeVisible();
    await expect(page.getByText(/password.*required/i)).toBeVisible();
  });

  test('should handle password visibility toggle', async ({ page }) => {
    await page.goto('/register');
    
    const passwordInput = page.getByLabel(/password/i);
    const visibilityToggle = page.locator('[data-testid="password-visibility-toggle"]');
    
    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click visibility toggle
    if (await visibilityToggle.isVisible()) {
      await visibilityToggle.click();
      
      // Password should now be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});

test.describe('Authentication State Management', () => {
  test('should maintain session across page refreshes', async ({ page }) => {
    // Login or bypass VIP entry
    await page.goto('/');
    if (await page.getByLabel(/password/i).isVisible()) {
      await page.getByLabel(/password/i).fill('TEST123');
      await page.getByRole('button', { name: /enter/i }).click();
    }
    
    // Navigate to a protected page
    await page.goto('/dashboard');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on the protected page
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should redirect to login when session expires', async ({ page, context }) => {
    // Clear all cookies to simulate session expiration
    await context.clearCookies();
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login or VIP entry
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});

test.describe('Responsive Authentication UI', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Should show mobile-optimized VIP entry
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Should be usable on mobile
    await page.getByLabel(/password/i).fill('TEST123');
    await page.getByRole('button', { name: /enter/i }).click();
    
    // Should work normally
    await expect(page).toHaveURL(/dashboard|discover|feed/);
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/register');
    
    // Should show tablet-optimized registration
    await expect(page.getByRole('heading', { name: /sign.*up/i })).toBeVisible();
    
    // Form should be properly sized
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });
});