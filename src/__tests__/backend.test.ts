import request from 'supertest';
import { Server } from 'http';

// Assume your server exports the app or server instance
import { createServer } from '../../server';
import { Express } from 'express';

describe('API Endpoints', () => {
  let server: Server;
  let app: Express;

  beforeAll(async () => {
    const result = await createServer();
    app = result.app;
    return new Promise((resolve) => {
      server = app.listen(4001, () => resolve(null));
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return 400 for missing model or prompt', async () => {
    const res = await request(server)
      .post('/api/generate')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing model or prompt');
  });

  it('should return 400 for unsupported model', async () => {
    const res = await request(server)
      .post('/api/generate')
      .send({ model: 'unknown', prompt: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Unsupported or unconfigured model.');
  });

  // Add more endpoint tests as needed
});


