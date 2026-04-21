import { test, expect } from '@playwright/test';

test.describe('My Library Module', () => {
  test('should load library or redirect', async ({ page }) => {
    await page.goto('/library');
    if (page.url().includes('/auth')) {
      await expect(page.locator('main').getByRole('heading', { name: 'Sign In' })).toBeVisible();
    } else {
      await expect(page.locator('main').getByText('Production History', { exact: false })).toBeVisible();
    }
  });
});
