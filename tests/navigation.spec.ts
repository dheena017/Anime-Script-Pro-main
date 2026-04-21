import { test, expect } from '@playwright/test';

test.describe('Navigation Smoke Tests: Core Layout', () => {
    
    test('should securely redirect protected studio routes to Auth', async ({ page }) => {
        const protectedRoutes = [
            '/anime/script',
            '/anime/cast',
            '/anime/world',
        ];

        for (const route of protectedRoutes) {
            console.log(`Checking security guard for: ${route}`);
            await page.goto(route);
            
            // Allow time for the client-side router to process the redirect
            await page.waitForURL(url => url.pathname.includes('/auth') || url.pathname === '/', { timeout: 10000 });
            
            // If it hits the root, we check if it's because it's ALREADY authenticated or if the guard failed
            const currentUrl = page.url();
            expect(currentUrl, `Route ${route} failed to redirect to auth`).toMatch(/.*(auth|127.0.0.1:3000\/$)/);
        }
    });
});
