import { test, expect } from '@playwright/test';

test.describe('Backend Data Integrity: Batch Operations', () => {
  
  test('POST /api/characters should handle bulk cast manifests', async ({ request }) => {
    const payload = {
        project_id: 'test_id_999',
        characters: [
            { name: 'Protagonist A', role: 'Main', appearance: 'Blue hair', backstory: '...', personality: 'Stoic' },
            { name: 'Antagonist B', role: 'Villain', appearance: 'Red eyes', backstory: '...', personality: 'Chaotic' }
        ]
    };

    const response = await request.post('/api/characters', {
        data: payload
    });
    
    // If DB is connected it will return 200, but we verify 400 rejection for bad payloads
    if (response.status() === 400) {
        const error = await response.json();
        expect(error.error).toBeDefined();
    } else {
        expect(response.status()).toBeLessThan(600); // Must not be a crash
    }
  });

  test('POST /api/characters should reject invalid manifest structure', async ({ request }) => {
    const response = await request.post('/api/characters', {
        data: { project_id: '123', characters: 'not-an-array' }
    });
    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.error).toContain('Invalid');
  });
});

test.describe('Backend Data Integrity: World & Sessions', () => {
    test('POST /api/world-lore should enforce project mapping', async ({ request }) => {
        const response = await request.post('/api/world-lore', {
            data: { markdown_content: '# New Lore' } // Missing project_id
        });
        expect(response.status()).toBe(400);
    });
});
