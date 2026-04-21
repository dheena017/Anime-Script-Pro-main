import { test, expect } from '@playwright/test';

test.describe('Community Module', () => {
  test('should load community feed', async ({ page }) => {
    await page.goto('/community');
    // Actual heading in Community.tsx is 'Social Hub'
    await expect(page.getByRole('heading', { name: 'Social Hub', exact: true })).toBeVisible();
  });
});
