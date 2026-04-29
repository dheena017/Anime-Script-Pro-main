import { test, expect } from '@playwright/test';

test.describe('Public Access & Branding', () => {
  
  test('should load Landing Page with AI branding', async ({ page }) => {
    await page.goto('/');
    // Updated to match actual text in LandingPage.tsx
    await expect(page.getByText('Autonomous', { exact: false })).toBeVisible();
    await expect(page.getByText('Creation.', { exact: false })).toBeVisible();
  });

  test('should load Tutorials page (Learning Center)', async ({ page }) => {
    await page.goto('/tutorials');
    await expect(page.getByRole('heading', { name: 'LEARNING CENTER', exact: true })).toBeVisible();
  });

  test('should load Auth portal with scoped selector', async ({ page }) => {
    await page.goto('/auth');
    // Using main scope to avoid clashing with header buttons
    const mainForm = page.locator('main');
    await expect(mainForm.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});

test.describe('Thematic Aesthetics (Noir System)', () => {
  test('Buttons should have pointer cursor', async ({ page }) => {
    await page.goto('/auth');
    // Targeting the form button specifically
    const submitBtn = page.locator('main').getByRole('button', { name: 'Sign In' });
    await expect(submitBtn).toHaveCSS('cursor', 'pointer');
  });
});
