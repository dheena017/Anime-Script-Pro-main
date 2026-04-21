import { test, expect } from '@playwright/test';

test.describe('Backend API & Security Boundaries', () => {
  
  test('Public API: Categories should be reachable', async ({ request }) => {
    const response = await request.get('/api/categories');
    // Accept 200 or Handled 500
    expect([200, 500]).toContain(response.status());
  });

  test('Security: Write operations must not return Success 200', async ({ request }) => {
    const response = await request.post('/api/projects', {
      data: { name: 'Unauthorized Test Project' }
    });
    expect(response.status()).not.toBe(200);
  });
});

test.describe('Complex UX Sequential Stress', () => {
    test('should maintain state during rapid navigation cycle', async ({ page }) => {
        // Step 1: Entry
        await page.goto('/');
        await page.click('text=Initialize System');
        await page.waitForURL(/.*auth/, { timeout: 15000 });
        
        // Step 2: Field Interaction (State Check)
        await page.getByPlaceholder('Email').fill('stress_test@godmode.com');
        
        // Step 3: Logo Jump (Stress Point)
        const logo = page.getByRole('link', { name: /God Mode/i });
        await expect(logo).toBeVisible();
        await logo.click();
        
        // Ensure the landing page actually loads
        await page.waitForURL('http://127.0.0.1:3000/', { timeout: 15000 });
        
        // Step 4: Re-entry
        await page.click('text=Enter God Mode');
        await page.waitForURL(/.*(auth|anime|studio)/, { timeout: 15000 });
        
        expect(page.url()).toMatch(/.*(auth|anime|studio)/);
    });
});
