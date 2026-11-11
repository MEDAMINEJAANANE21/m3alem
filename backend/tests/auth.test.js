import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { DEFAULT_PASSWORD, registerUser, useTestApp } from './helpers/test-app.helper.js';

describe('Auth API', () => {
  const ctx = useTestApp();

  it('registers a client and never returns the password', async () => {
    const { token, user } = await registerUser(ctx.api, { email: 'salma@test.local' });

    assert.ok(token);
    assert.equal(user.email, 'salma@test.local');
    assert.equal(user.role, 'client');
    assert.equal(user.password, undefined);
  });

  it('refuses admin self-registration', async () => {
    const response = await ctx.api
      .post('/api/auth/register')
      .send({ name: 'Hacker', email: 'h@test.local', password: DEFAULT_PASSWORD, role: 'admin' })
      .expect(400);
    assert.equal(response.body.error.details[0].field, 'role');
  });

  it('refuses a duplicate e-mail', async () => {
    await registerUser(ctx.api, { email: 'dup@test.local' });
    await ctx.api
      .post('/api/auth/register')
      .send({ name: 'Dup', email: 'DUP@test.local', password: DEFAULT_PASSWORD })
      .expect(409);
  });

  it('logs in with valid credentials', async () => {
    await registerUser(ctx.api, { email: 'login@test.local' });
    const response = await ctx.api
      .post('/api/auth/login')
      .send({ email: 'login@test.local', password: DEFAULT_PASSWORD })
      .expect(200);
    assert.ok(response.body.token);
  });

  it('rejects a wrong password with 401', async () => {
    await registerUser(ctx.api, { email: 'wrong@test.local' });
    await ctx.api
      .post('/api/auth/login')
      .send({ email: 'wrong@test.local', password: 'not-the-password' })
      .expect(401);
  });

  it('GET /me requires a valid token', async () => {
    await ctx.api.get('/api/auth/me').expect(401);
    await ctx.api.get('/api/auth/me').set('Authorization', 'Bearer invalid').expect(401);

    const { auth, user } = await registerUser(ctx.api);
    const response = await ctx.api.get('/api/auth/me').set('Authorization', auth).expect(200);
    assert.equal(response.body.user._id, user._id);
  });
});
