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
            await page.waitForURL(url => url.pathname.includes('/auth') || url.pathname === '/', { timeout: 10000 });
            const currentUrl = page.url();
            expect(currentUrl, `Route ${route} failed to redirect to auth`).toMatch(/.*(auth|127.0.0.1:3000\/$)/);
        }
    });

    test('should display the main navigation and handle links to core pages', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('navigation')).toBeVisible();
        await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /discover/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /community/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /anime world/i })).toBeVisible();
    });

    test('should show login form when navigating to /auth', async ({ page }) => {
        await page.goto('/auth');
        await expect(page.getByRole('heading', { name: /access node|initialize node/i })).toBeVisible();
        await expect(page.getByLabel(/node identity/i)).toBeVisible();
        await expect(page.getByLabel(/cryptographic key/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /establish neural link|initialize node/i })).toBeVisible();
    });
});
