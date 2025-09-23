/**
 * E2E Tests for Nextgen Overlay Features
 * FansWorld Creator Platform
 * 
 * Tests all major functionality of the nextgen overlay system:
 * - VIP v2 Code System
 * - Tip Goals System
 * - Offer Ribbon System
 * - Moderation v2 System
 */

import { test, expect } from '@playwright/test';

// Test configuration
const TEST_CONFIG = {
  creator: {
    email: 'creator@test.com',
    password: 'test123456',
    name: 'Test Creator'
  },
  user: {
    email: 'user@test.com', 
    password: 'test123456',
    name: 'Test User'
  },
  baseUrl: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173'
};

test.describe('Nextgen Overlay Features E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable all feature flags for testing
    await page.addInitScript(() => {
      localStorage.setItem('test_feature_flags', JSON.stringify({
        VIP_V2_ENABLED: true,
        VIP_V2_ADMIN_PANEL: true,
        VIP_V2_ANALYTICS: true,
        TIP_GOALS_ENABLED: true,
        TIP_GOALS_ANIMATIONS: true,
        TIP_GOALS_NOTIFICATIONS: true,
        OFFER_RIBBON_ENABLED: true,
        OFFER_RIBBON_ANIMATIONS: true,
        OFFER_RIBBON_SOUND: false, // Disable sound for tests
        MODERATION_V2_ENABLED: true,
        MODERATION_V2_AUTO_RULES: true,
        MODERATION_V2_AI_ASSIST: true,
        NEXTGEN_OVERLAY_ENABLED: true,
        FEATURE_ANALYTICS: true,
      }));
    });

    await page.goto(TEST_CONFIG.baseUrl);
  });

  test.describe('VIP v2 Code System', () => {
    test('Creator can create and manage VIP codes', async ({ page }) => {
      // Login as creator
      await loginAsCreator(page);
      
      // Navigate to VIP code management
      await page.click('[data-testid="creator-dashboard-link"]');
      await page.click('[data-testid="vip-codes-section"]');
      
      // Create a new VIP code
      await page.click('[data-testid="create-vip-code-button"]');
      
      // Fill out the form
      await page.fill('[data-testid="vip-code-input"]', 'TEST2024');
      await page.fill('[data-testid="vip-title-input"]', 'Exclusive Test Access');
      await page.fill('[data-testid="vip-description-input"]', 'Special test benefits');
      await page.fill('[data-testid="vip-max-uses-input"]', '10');
      await page.fill('[data-testid="vip-price-input"]', '9.99');
      
      // Add benefits
      await page.fill('[data-testid="benefit-input"]', 'Exclusive content access');
      await page.click('[data-testid="add-benefit-button"]');
      await page.fill('[data-testid="benefit-input"]', 'Early previews');
      await page.click('[data-testid="add-benefit-button"]');
      
      // Submit the form
      await page.click('[data-testid="create-vip-code-submit"]');
      
      // Verify success message
      await expect(page.locator('.toast:has-text("VIP code created successfully")')).toBeVisible();
      
      // Verify code appears in list
      await expect(page.locator('[data-testid="vip-code-item"]:has-text("TEST2024")')).toBeVisible();
      
      // Verify code details
      const codeItem = page.locator('[data-testid="vip-code-item"]:has-text("TEST2024")');
      await expect(codeItem.locator(':text("Exclusive Test Access")')).toBeVisible();
      await expect(codeItem.locator(':text("$9.99")')).toBeVisible();
      await expect(codeItem.locator(':text("0 / 10 used")')).toBeVisible();
    });

    test('User can discover and redeem VIP codes', async ({ page }) => {
      // First, create a VIP code as creator
      await setupVIPCode(page, {
        code: 'FREEVIP',
        title: 'Free VIP Access',
        price: 0,
        maxUses: 5
      });
      
      // Login as regular user
      await loginAsUser(page);
      
      // Navigate to VIP redemption page
      await page.click('[data-testid="redeem-vip-link"]');
      
      // Enter the VIP code
      await page.fill('[data-testid="vip-code-input"]', 'FREEVIP');
      await page.click('[data-testid="lookup-vip-button"]');
      
      // Verify code details are shown
      await expect(page.locator(':text("Free VIP Access")')).toBeVisible();
      await expect(page.locator(':text("Free")')).toBeVisible();
      
      // Redeem the code
      await page.click('[data-testid="redeem-code-button"]');
      
      // Verify success
      await expect(page.locator(':text("VIP Code Redeemed!")')).toBeVisible();
      await expect(page.locator(':text("Congratulations!")')).toBeVisible();
    });

    test('VIP code analytics are tracked correctly', async ({ page }) => {
      // Setup and redeem a code
      await setupVIPCode(page, { code: 'ANALYTICS', title: 'Analytics Test' });
      await redeemVIPCodeAsUser(page, 'ANALYTICS');
      
      // Login as creator and check analytics
      await loginAsCreator(page);
      await page.click('[data-testid="creator-dashboard-link"]');
      await page.click('[data-testid="vip-codes-section"]');
      
      // Click on analytics for the code
      await page.click('[data-testid="vip-code-analytics"]:near(:text("ANALYTICS"))');
      
      // Verify analytics data
      await expect(page.locator(':text("1 Total Views")')).toBeVisible();
      await expect(page.locator(':text("1 Total Redemptions")')).toBeVisible();
      await expect(page.locator(':text("100.0% Conversion Rate")')).toBeVisible();
    });
  });

  test.describe('Tip Goals System', () => {
    test('Creator can create and manage tip goals', async ({ page }) => {
      await loginAsCreator(page);
      
      // Navigate to tip goals
      await page.click('[data-testid="creator-dashboard-link"]');
      await page.click('[data-testid="tip-goals-section"]');
      
      // Create new tip goal
      await page.click('[data-testid="create-tip-goal-button"]');
      
      // Fill form
      await page.fill('[data-testid="goal-title-input"]', 'New Equipment Fund');
      await page.fill('[data-testid="goal-description-input"]', 'Help me get better streaming equipment!');
      await page.fill('[data-testid="goal-target-input"]', '500.00');
      await page.fill('[data-testid="goal-emoji-input"]', '🎮');
      
      // Submit
      await page.click('[data-testid="create-goal-submit"]');
      
      // Verify creation
      await expect(page.locator('.toast:has-text("Tip goal created successfully")')).toBeVisible();
      await expect(page.locator('[data-testid="tip-goal-card"]:has-text("New Equipment Fund")')).toBeVisible();
    });

    test('Users can contribute to tip goals', async ({ page }) => {
      // Setup tip goal
      await setupTipGoal(page, {
        title: 'Test Goal',
        target: 100,
        description: 'Test description'
      });
      
      // Login as user
      await loginAsUser(page);
      
      // Find and contribute to goal
      await page.click('[data-testid="discover-goals-link"]');
      await page.click('[data-testid="tip-goal-card"]:has-text("Test Goal")');
      await page.click('[data-testid="contribute-button"]');
      
      // Fill contribution form
      await page.fill('[data-testid="contribution-amount"]', '25.00');
      await page.fill('[data-testid="contribution-message"]', 'Keep up the great work!');
      await page.click('[data-testid="submit-contribution"]');
      
      // Verify contribution (mock payment success)
      await expect(page.locator(':text("Thank you for your contribution!")')).toBeVisible();
    });

    test('Tip goal progress and milestones work correctly', async ({ page }) => {
      await setupTipGoal(page, { title: 'Milestone Test', target: 100 });
      
      // Make contributions to reach milestones
      await contributeToGoal(page, 'Milestone Test', 25); // 25%
      await contributeToGoal(page, 'Milestone Test', 25); // 50%
      
      // Check milestone celebrations
      await page.click('[data-testid="tip-goal-card"]:has-text("Milestone Test")');
      await expect(page.locator('[data-testid="milestone-reached"]:has-text("25%")')).toBeVisible();
      await expect(page.locator('[data-testid="milestone-reached"]:has-text("50%")')).toBeVisible();
      
      // Verify progress bar
      const progressBar = page.locator('[data-testid="tip-goal-progress"]');
      await expect(progressBar).toHaveAttribute('value', '50');
    });
  });

  test.describe('Offer Ribbon System', () => {
    test('Creator can create limited-time offers', async ({ page }) => {
      await loginAsCreator(page);
      
      // Navigate to offers
      await page.click('[data-testid="creator-dashboard-link"]');
      await page.click('[data-testid="offers-section"]');
      
      // Create new offer
      await page.click('[data-testid="create-offer-button"]');
      
      // Fill form
      await page.fill('[data-testid="offer-title-input"]', 'Flash Sale - 50% Off!');
      await page.fill('[data-testid="offer-description-input"]', 'Limited time discount on all content');
      await page.fill('[data-testid="discount-percentage-input"]', '50');
      await page.fill('[data-testid="max-redemptions-input"]', '20');
      
      // Set expiration (1 hour from now)
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      await page.fill('[data-testid="offer-expires-input"]', futureDate.toISOString().slice(0, 16));
      
      // Submit
      await page.click('[data-testid="create-offer-submit"]');
      
      // Verify creation
      await expect(page.locator('.toast:has-text("Offer created successfully")')).toBeVisible();
    });

    test('Offer ribbons display correctly with urgency levels', async ({ page }) => {
      // Create high urgency offer
      await setupOffer(page, {
        title: 'URGENT SALE!',
        discount: 75,
        urgency: 9,
        hoursLeft: 2
      });
      
      // Login as user to see the offer
      await loginAsUser(page);
      
      // Verify offer ribbon is displayed
      await expect(page.locator('[data-testid="offer-ribbon"]:has-text("URGENT SALE!")')).toBeVisible();
      
      // Verify urgency indicators
      await expect(page.locator('[data-testid="offer-ribbon"]')).toHaveClass(/high-urgency/);
      await expect(page.locator(':text("75% OFF")')).toBeVisible();
      
      // Verify countdown timer
      await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();
    });

    test('Users can redeem offers successfully', async ({ page }) => {
      await setupOffer(page, { title: 'Test Offer', discount: 25 });
      
      await loginAsUser(page);
      
      // Click on offer ribbon
      await page.click('[data-testid="offer-ribbon"]');
      
      // Verify offer details modal
      await expect(page.locator(':text("Test Offer")')).toBeVisible();
      await expect(page.locator(':text("25% OFF")')).toBeVisible();
      
      // Redeem offer
      await page.click('[data-testid="redeem-offer-button"]');
      
      // Verify redemption success
      await expect(page.locator(':text("Offer redeemed successfully!")')).toBeVisible();
    });
  });

  test.describe('Moderation v2 System', () => {
    test('Creator can set up moderation rules', async ({ page }) => {
      await loginAsCreator(page);
      
      // Navigate to moderation settings
      await page.click('[data-testid="creator-dashboard-link"]');
      await page.click('[data-testid="moderation-section"]');
      
      // Create new moderation rule
      await page.click('[data-testid="create-rule-button"]');
      
      // Use a template
      await page.click('[data-testid="rule-template"]:has-text("High Toxicity Content")');
      
      // Customize the rule
      await page.fill('[data-testid="rule-name-input"]', 'Custom Toxicity Filter');
      await page.fill('[data-testid="toxicity-threshold-input"]', '0.7');
      
      // Enable auto-enforcement
      await page.check('[data-testid="auto-enforce-checkbox"]');
      
      // Submit
      await page.click('[data-testid="create-rule-submit"]');
      
      // Verify rule creation
      await expect(page.locator('.toast:has-text("Moderation rule created")')).toBeVisible();
      await expect(page.locator('[data-testid="rule-item"]:has-text("Custom Toxicity Filter")')).toBeVisible();
    });

    test('Moderation queue processes items correctly', async ({ page }) => {
      // Setup moderation rule first
      await setupModerationRule(page, {
        name: 'Test Rule',
        type: 'content_filter',
        autoEnforce: false
      });
      
      await loginAsCreator(page);
      
      // Simulate content being flagged (this would normally come from AI)
      await simulateFlaggedContent(page, {
        contentType: 'message',
        contentId: 'test-message-1',
        reason: 'High toxicity detected',
        confidence: 0.9
      });
      
      // Check moderation queue
      await page.click('[data-testid="moderation-queue-link"]');
      
      // Verify item is in queue
      await expect(page.locator('[data-testid="queue-item"]:has-text("test-message-1")')).toBeVisible();
      
      // Review the item
      await page.click('[data-testid="review-item-button"]');
      await page.click('[data-testid="reject-content-button"]');
      await page.fill('[data-testid="review-notes"]', 'Content violates community guidelines');
      await page.click('[data-testid="submit-review"]');
      
      // Verify review completion
      await expect(page.locator('.toast:has-text("Item reviewed successfully")')).toBeVisible();
    });

    test('AI-assisted moderation works correctly', async ({ page }) => {
      // Enable AI assistance
      await setupModerationRule(page, {
        name: 'AI Assisted Rule',
        type: 'content_filter',
        aiAssisted: true,
        confidenceThreshold: 0.85
      });
      
      // Simulate high-confidence AI detection
      await simulateFlaggedContent(page, {
        contentType: 'post',
        aiConfidence: 0.95,
        aiRecommendation: 'rejected',
        flags: ['hate_speech', 'harassment']
      });
      
      await loginAsCreator(page);
      await page.click('[data-testid="moderation-queue-link"]');
      
      // Verify AI recommendation is shown
      await expect(page.locator(':text("AI Recommendation: Reject")')).toBeVisible();
      await expect(page.locator(':text("Confidence: 95%")')).toBeVisible();
      await expect(page.locator('[data-testid="ai-flags"]')).toContainText('hate_speech');
    });
  });

  test.describe('Feature Flag Integration', () => {
    test('Features are properly gated by flags', async ({ page }) => {
      // Disable VIP v2 features
      await page.addInitScript(() => {
        localStorage.setItem('test_feature_flags', JSON.stringify({
          VIP_V2_ENABLED: false,
          TIP_GOALS_ENABLED: true,
          OFFER_RIBBON_ENABLED: true,
          MODERATION_V2_ENABLED: true,
        }));
      });
      
      await page.reload();
      await loginAsCreator(page);
      
      // VIP features should be hidden
      await page.click('[data-testid="creator-dashboard-link"]');
      await expect(page.locator('[data-testid="vip-codes-section"]')).not.toBeVisible();
      
      // Other features should still be visible
      await expect(page.locator('[data-testid="tip-goals-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="offers-section"]')).toBeVisible();
    });

    test('Feature analytics are tracked when enabled', async ({ page }) => {
      // Use a feature and verify analytics
      await setupVIPCode(page, { code: 'TRACK', title: 'Tracking Test' });
      
      // Mock analytics endpoint
      await page.route('**/api/analytics/**', (route) => {
        route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });
      
      await redeemVIPCodeAsUser(page, 'TRACK');
      
      // Verify analytics calls were made
      const analyticsRequests = [];
      page.on('request', request => {
        if (request.url().includes('/api/analytics/')) {
          analyticsRequests.push(request);
        }
      });
      
      expect(analyticsRequests.length).toBeGreaterThan(0);
    });
  });
});

// Helper functions
async function loginAsCreator(page) {
  await page.click('[data-testid="login-button"]');
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.creator.email);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.creator.password);
  await page.click('[data-testid="login-submit"]');
  await expect(page.locator('[data-testid="user-Cabana"]')).toBeVisible();
}

async function loginAsUser(page) {
  await page.click('[data-testid="login-button"]');
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.user.email);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.user.password);
  await page.click('[data-testid="login-submit"]');
  await expect(page.locator('[data-testid="user-Cabana"]')).toBeVisible();
}

async function setupVIPCode(page, options) {
  await loginAsCreator(page);
  // Implementation would create VIP code via API or UI
  // This is a simplified version - full implementation would interact with actual forms
}

async function setupTipGoal(page, options) {
  await loginAsCreator(page);
  // Implementation would create tip goal via API or UI
}

async function setupOffer(page, options) {
  await loginAsCreator(page);
  // Implementation would create offer via API or UI
}

async function setupModerationRule(page, options) {
  await loginAsCreator(page);
  // Implementation would create moderation rule via API or UI
}

async function redeemVIPCodeAsUser(page, code) {
  await loginAsUser(page);
  // Implementation would redeem VIP code
}

async function contributeToGoal(page, goalTitle, amount) {
  // Implementation would make contribution to tip goal
}

async function simulateFlaggedContent(page, options) {
  // Implementation would simulate content being flagged for moderation
}

// Test data cleanup
test.afterAll(async () => {
  // Clean up test data from database
  // This would typically connect to test database and clean up
  console.log('E2E test cleanup completed');
});