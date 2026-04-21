import { test, expect } from '@playwright/test';

test.describe('Tutorials Module', () => {
  test('should load help and training content', async ({ page }) => {
    await page.goto('/tutorials');
    // Actual heading in Tutorials.tsx is 'LEARNING CENTER'
    await expect(page.getByRole('heading', { name: 'LEARNING CENTER', exact: true })).toBeVisible();
  });
});
