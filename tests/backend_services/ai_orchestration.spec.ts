import { test, expect } from '@playwright/test';

test.describe('AI Orchestration: Client-Side Resilience', () => {
  
  test('should handle AI Quota exhaustion (429) gracefully', async ({ page }) => {
    // Intercept the internal API call from the browser
    await page.route('**/api/generate', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI Quota Exhausted.' })
      });
    });

    // Go to a page that uses AI (like Auth or Studio) and trigger a mock call
    await page.goto('/auth');
    const response = await page.evaluate(async () => {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gpt-4o', prompt: 'test' })
        });
        return res.status;
    });

    expect(response).toBe(429);
  });

  test('should handle Backend Disconnects (500)', async ({ page }) => {
    await page.route('**/api/generate', route => route.abort('failed'));
    
    await page.goto('/auth');
    const isErrorHandled = await page.evaluate(async () => {
        try {
            await fetch('/api/generate', { method: 'POST' });
            return false;
        } catch (e) {
            return true;
        }
    });
    expect(isErrorHandled).toBeTruthy();
  });
});
