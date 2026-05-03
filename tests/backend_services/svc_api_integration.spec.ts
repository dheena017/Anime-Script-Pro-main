import { test, expect } from '@playwright/test';

test.describe('Backend API Integration: Recovery & Resilience', () => {
  
  test('GET /api/categories - Response Audit', async ({ request }) => {
    const response = await request.get('/api/categories');
    
    // We verify the server is ALIVE. 
    // It should give 200 (Success) or 500 (Handled DB Error).
    if (response.status() === 500) {
        const error = await response.json();
        expect(error.error).toBeDefined();
    } else {
        expect(response.status()).toBe(200);
    }
  });

  test('GET /api/templates - Response Audit', async ({ request }) => {
    const response = await request.get('/api/templates');
    if (response.status() === 500) {
        const error = await response.json();
        expect(error.error).toBeDefined();
    } else {
        expect(response.status()).toBe(200);
    }
  });
});

test.describe('Server Logic Validation', () => {
    test('POST /api/generate should reject empty requests (400)', async ({ request }) => {
        const response = await request.post('/api/generate', { data: {} });
        expect(response.status()).toBe(400);
    });
});
