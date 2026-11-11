import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { useTestApp } from './helpers/test-app.helper.js';

describe('Health & misc', () => {
  const ctx = useTestApp();

  it('GET /api/health returns ok', async () => {
    const response = await ctx.api.get('/api/health').expect(200);
    assert.deepEqual(response.body, { status: 'ok' });
  });

  it('GET /api/categories lists the 9 categories', async () => {
    const response = await ctx.api.get('/api/categories').expect(200);
    assert.equal(response.body.categories.length, 9);
  });

  it('unknown API route returns a JSON 404', async () => {
    const response = await ctx.api.get('/api/does-not-exist').expect(404);
    assert.match(response.body.error.message, /Route introuvable/);
  });

  it('malformed JSON returns 400', async () => {
    await ctx.api
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ not json')
      .expect(400);
  });

  it('does not serve HTML pages (the frontend does)', async () => {
    const response = await ctx.api.get('/').expect(404);
    assert.ok(response.body.error);
  });
});
