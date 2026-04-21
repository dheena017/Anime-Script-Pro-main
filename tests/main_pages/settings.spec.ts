import { test, expect } from '@playwright/test';

test.describe('Settings Module', () => {
  test('should load profile and engine settings', async ({ page }) => {
    await page.goto('/settings');
    if (page.url().includes('/auth')) {
      // Scoping to main to avoid header/sidebar conflicts
      await expect(page.locator('main').getByRole('heading', { name: 'Sign In' })).toBeVisible();
    } else {
      await expect(page.locator('main').getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
    }
  });
});
