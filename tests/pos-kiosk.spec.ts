import { test, expect, chromium } from '@playwright/test';

// POS Kiosk Mode Tests
test.describe('POS Kiosk Application Tests', () => {
  
  test('pos kiosk basic functionality', async ({ page }) => {
    test.skip(test.info().project.name !== 'pos-kiosk', 'This test is only for POS kiosk mode');
    
    // Replace with your actual POS application URL
    await page.goto('http://your-pos-app-url.com');
    
    // Example POS interactions - customize for your application
    await expect(page).toHaveTitle(/POS|Point of Sale/i);
    
    // Test touch interactions (common in POS)
    await page.locator('[data-testid="product-button"]').first().click();
    await page.locator('[data-testid="add-to-cart"]').click();
    
    // Test payment flow
    await page.locator('[data-testid="checkout"]').click();
    await expect(page.locator('[data-testid="total-amount"]')).toBeVisible();
    
    // Test receipt generation
    await page.locator('[data-testid="print-receipt"]').click();
    await expect(page.locator('[data-testid="receipt-preview"]')).toBeVisible();
  });

  test('pos kiosk keyboard navigation', async ({ page }) => {
    test.skip(test.info().project.name !== 'pos-kiosk', 'This test is only for POS kiosk mode');
    
    await page.goto('http://your-pos-app-url.com');
    
    // Test keyboard shortcuts common in POS systems
    await page.keyboard.press('F1'); // Help
    await page.keyboard.press('F2'); // Search
    await page.keyboard.press('F12'); // Admin functions
    
    // Test numeric keypad for price entry
    await page.locator('[data-testid="price-input"]').fill('12.99');
    await page.keyboard.press('Enter');
  });

  test('pos kiosk error handling', async ({ page }) => {
    test.skip(test.info().project.name !== 'pos-kiosk', 'This test is only for POS kiosk mode');
    
    await page.goto('http://your-pos-app-url.com');
    
    // Test network disconnection scenarios
    await page.route('**/api/**', route => route.abort());
    
    // Attempt transaction and verify error handling
    await page.locator('[data-testid="process-payment"]').click();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/network|connection/i);
  });

  test('pos kiosk fullscreen behavior', async ({ page }) => {
    test.skip(test.info().project.name !== 'pos-kiosk', 'This test is only for POS kiosk mode');
    
    await page.goto('http://your-pos-app-url.com');
    
    // Verify kiosk mode prevents navigation away
    await page.keyboard.press('Alt+Tab'); // Should not work in kiosk
    await page.keyboard.press('F11'); // Should not exit fullscreen
    
    // Verify application remains in focus
    await expect(page).toHaveTitle(/POS|Point of Sale/i);
  });
});

// Remote debugging connection test (for existing kiosk)
test.describe('Connect to Existing POS Kiosk', () => {
  test('connect to running kiosk browser', async () => {
    // This test connects to an already running kiosk browser
    // Enable remote debugging on your POS system with: --remote-debugging-port=9222
    
    try {
      const browser = await chromium.connectOverCDP('http://localhost:9222');
      const contexts = browser.contexts();
      
      if (contexts.length > 0) {
        const context = contexts[0];
        const pages = context.pages();
        
        if (pages.length > 0) {
          const page = pages[0];
          
          // Now you can interact with the existing kiosk application
          await expect(page).toHaveTitle(/POS|Point of Sale/i);
          
          // Perform your POS tests here
          console.log('Successfully connected to existing kiosk browser');
        }
      }
      
      await browser.close();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Could not connect to existing browser:', errorMessage);
      test.skip(true, 'No existing browser found for connection');
    }
  });
});
