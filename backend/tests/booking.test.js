import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { createService, registerUser, tomorrow, useTestApp } from './helpers/test-app.helper.js';

describe('Bookings API', () => {
  const ctx = useTestApp();
  let client;
  let provider;

  beforeEach(async () => {
    client = await registerUser(ctx.api);
    provider = await registerUser(ctx.api, { role: 'prestataire' });
  });

  const book = (service, overrides = {}) =>
    ctx.api
      .post('/api/bookings')
      .set('Authorization', client.auth)
      .send({
        service: service._id,
        scheduledAt: tomorrow(),
        address: '12 rue Atlas, Rabat',
        ...overrides,
      });

  it('computes the price on the server for hourly services', async () => {
    const service = await createService(ctx.api, provider.auth, {
      category: 'menage',
      price: 20,
      pricingUnit: 'hour',
      minQuantity: 2,
    });

    const response = await book(service, { quantity: 3, totalPrice: 1 }).expect(201);
    assert.equal(response.body.booking.totalPrice, 60);
    assert.equal(response.body.booking.status, 'pending');
  });

  it('rejects a quantity below the minimum', async () => {
    const service = await createService(ctx.api, provider.auth, {
      price: 20,
      pricingUnit: 'hour',
      minQuantity: 3,
    });
    await book(service, { quantity: 1 }).expect(400);
  });

  it('rejects a date in the past', async () => {
    const service = await createService(ctx.api, provider.auth);
    await book(service, { scheduledAt: '2000-01-01T10:00:00Z' }).expect(400);
  });

  it('shows each role only its own bookings', async () => {
    const service = await createService(ctx.api, provider.auth);
    await book(service).expect(201);
    const otherClient = await registerUser(ctx.api);

    const forClient = await ctx.api.get('/api/bookings/me').set('Authorization', client.auth);
    const forProvider = await ctx.api.get('/api/bookings/me').set('Authorization', provider.auth);
    const forOther = await ctx.api.get('/api/bookings/me').set('Authorization', otherClient.auth);

    assert.equal(forClient.body.bookings.length, 1);
    assert.equal(forProvider.body.bookings.length, 1);
    assert.equal(forOther.body.bookings.length, 0);
  });

  it('follows the status workflow', async () => {
    const service = await createService(ctx.api, provider.auth);
    const { body } = await book(service).expect(201);
    const statusUrl = `/api/bookings/${body.booking._id}/status`;

    await ctx.api
      .patch(statusUrl)
      .set('Authorization', client.auth)
      .send({ status: 'confirmed' })
      .expect(403);
    await ctx.api
      .patch(statusUrl)
      .set('Authorization', provider.auth)
      .send({ status: 'confirmed' })
      .expect(200);
    await ctx.api
      .patch(statusUrl)
      .set('Authorization', provider.auth)
      .send({ status: 'completed' })
      .expect(200);
    await ctx.api
      .patch(statusUrl)
      .set('Authorization', client.auth)
      .send({ status: 'cancelled' })
      .expect(409);
  });

  it('hides bookings from unrelated users', async () => {
    const service = await createService(ctx.api, provider.auth);
    const { body } = await book(service).expect(201);
    const stranger = await registerUser(ctx.api, { role: 'prestataire' });

    await ctx.api
      .patch(`/api/bookings/${body.booking._id}/status`)
      .set('Authorization', stranger.auth)
      .send({ status: 'cancelled' })
      .expect(404);
  });
});
