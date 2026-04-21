import { test, expect } from '@playwright/test';

test.describe('Discover Module', () => {
  test('should load discover page', async ({ page }) => {
    await page.goto('/discover');
    // Using level: 1 to ensure we hit the main page title, not a nav link
    await expect(page.getByRole('heading', { name: 'Discover', level: 1, exact: true })).toBeVisible();
  });
});
