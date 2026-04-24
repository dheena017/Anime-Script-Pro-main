import { test, expect } from '@playwright/test';

test.describe('Anime Studio Roadmap: Global Audit', () => {
    
    test.describe('Phases 1-4 Module Integrity', () => {
        const studioModules = [

            { id: 'Phase 1: Template', path: '/anime/template', marker: 'Forge Library' },
            { id: 'Phase 1: World Lore', path: '/anime/world', marker: 'World Architecture' },
            { id: 'Phase 2: Cast', path: '/anime/cast', marker: 'Character Cast' },
            { id: 'Phase 2: Beats', path: '/anime/beats', marker: 'Narrative Beats' },
            { id: 'Phase 2: Series', path: '/anime/series', marker: 'Series Planning' },
            { id: 'Phase 3: Script', path: '/anime/script', marker: 'Production Script' },
            { id: 'Phase 3: Storyboard', path: '/anime/storyboard', marker: 'Visual Storyboard' },
            { id: 'Phase 4: Prompts', path: '/anime/prompts', marker: 'AI Image Prompts' },
            { id: 'Phase 4: Screening', path: '/anime/example', marker: 'Screening Room' },
            { id: 'Phase 4: SEO', path: '/anime/seo', marker: 'Marketing Specs' },
        ];

        for (const module of studioModules) {
            test(`Panel Integrity: ${module.id}`, async ({ page }) => {
                await page.goto(module.path);
                
                // 1. Verify Security/Access (Auth or Module)
                if (page.url().includes('/auth')) {
                    await expect(page.getByText('Sign In')).toBeVisible();
                } else {
                    // 2. Verify Unified Branding
                    const logo = page.getByRole('link', { name: /God Mode/i });
                    await expect(logo).toBeVisible();

                    // 3. Verify Module Marker (Scoped to Main Content)
                    // Use data-testid for strict selector if available
                    const markerTestId = `marker-${module.marker.toLowerCase().replace(/\s+/g, '-')}`;
                    const marker = page.getByTestId(markerTestId);
                    await expect(marker).toBeVisible();
                    console.log(`[Audit] ${module.id} verified with marker: ${module.marker}`);
                }
            });
        }
    });

    test('Script Panel should handle Generation states', async ({ page }) => {
        await page.goto('/anime/script');
        if (!page.url().includes('/auth')) {
            const emptyState = page.getByText(/Production Script/i).first();
            await expect(emptyState).toBeVisible();
        }
    });
});
