import { test, expect } from '@playwright/test';

// Common test that runs on all browsers
test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

// Browser-specific tests
test.describe('Chromium-specific tests', () => {
  test('chromium navigation test', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'This test is only for Chromium');
    
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page.locator('h1')).toContainText('Installation');
    
    // Chromium-specific actions
    await page.getByRole('link', { name: 'Getting started' }).click();
    await expect(page.locator('h1')).toContainText('Getting started');
  });
});

test.describe('Firefox-specific tests', () => {
  test('firefox navigation test', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'This test is only for Firefox');
    
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'API' }).click();
    await expect(page.locator('h1')).toContainText('API reference');
    
    // Firefox-specific actions
    await page.getByPlaceholder('Search').fill('test');
  });
});

test.describe('WebKit-specific tests', () => {
  test('webkit navigation test', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'This test is only for WebKit');
    
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'Community' }).click();
    await expect(page.locator('h1')).toContainText('Welcome');
    
    // WebKit-specific actions
    await page.getByRole('link', { name: 'Discord' }).first().click();
  });
});