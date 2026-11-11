import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createAdmin, createService, registerUser, useTestApp } from './helpers/test-app.helper.js';

describe('Services API', () => {
  const ctx = useTestApp();

  it('lets a provider create a service', async () => {
    const provider = await registerUser(ctx.api, { role: 'prestataire' });
    const service = await createService(ctx.api, provider.auth);

    assert.equal(service.title, 'Installation WC');
    assert.equal(service.provider, provider.user._id);
  });

  it('forbids clients from creating services', async () => {
    const client = await registerUser(ctx.api);
    await ctx.api
      .post('/api/services')
      .set('Authorization', client.auth)
      .send({ title: 'X', category: 'plombier', price: 10 })
      .expect(403);
  });

  it('ignores fields that are not editable (no mass assignment)', async () => {
    const provider = await registerUser(ctx.api, { role: 'prestataire' });
    const other = await registerUser(ctx.api, { role: 'prestataire' });
    const service = await createService(ctx.api, provider.auth, { provider: other.user._id });

    assert.equal(service.provider, provider.user._id);
  });

  it('filters by category and escapes the location regex', async () => {
    const provider = await registerUser(ctx.api, { role: 'prestataire' });
    await createService(ctx.api, provider.auth, { category: 'plombier', location: 'Casablanca' });
    await createService(ctx.api, provider.auth, { category: 'menage', location: 'Rabat' });

    const byCategory = await ctx.api.get('/api/services?category=menage').expect(200);
    assert.equal(byCategory.body.services.length, 1);

    const byLocation = await ctx.api.get('/api/services?location=casa').expect(200);
    assert.equal(byLocation.body.services.length, 1);

    const malicious = await ctx.api.get('/api/services?location=(.*)%2B').expect(200);
    assert.equal(malicious.body.services.length, 0);
  });

  it('only the owner or an admin can update / delete', async () => {
    const owner = await registerUser(ctx.api, { role: 'prestataire' });
    const intruder = await registerUser(ctx.api, { role: 'prestataire' });
    const admin = await createAdmin(ctx.api);
    const service = await createService(ctx.api, owner.auth);

    await ctx.api
      .patch(`/api/services/${service._id}`)
      .set('Authorization', intruder.auth)
      .send({ price: 1 })
      .expect(403);

    const updated = await ctx.api
      .patch(`/api/services/${service._id}`)
      .set('Authorization', owner.auth)
      .send({ price: 175 })
      .expect(200);
    assert.equal(updated.body.service.price, 175);

    await ctx.api
      .delete(`/api/services/${service._id}`)
      .set('Authorization', admin.auth)
      .expect(204);
    await ctx.api.get(`/api/services/${service._id}`).expect(404);
  });

  it('returns 400 for an invalid id', async () => {
    await ctx.api.get('/api/services/not-an-id').expect(400);
  });
});
