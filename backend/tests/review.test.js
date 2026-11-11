import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createAdmin, registerUser, useTestApp } from './helpers/test-app.helper.js';

describe('Reviews API', () => {
  const ctx = useTestApp();
  const validReview = { authorName: 'Youssef', comment: 'Très bon service !', rating: 5 };

  it('creates and lists reviews, newest first', async () => {
    await ctx.api
      .post('/api/reviews')
      .send({ ...validReview, authorName: 'Premier' })
      .expect(201);
    await ctx.api
      .post('/api/reviews')
      .send({ ...validReview, authorName: 'Second' })
      .expect(201);

    const response = await ctx.api.get('/api/reviews').expect(200);
    assert.deepEqual(
      response.body.reviews.map((review) => review.authorName),
      ['Second', 'Premier'],
    );
  });

  it('stores HTML as plain text (rendering is escaped by the frontend)', async () => {
    const payload = { ...validReview, comment: '<img src=x onerror=alert(1)>' };
    const response = await ctx.api.post('/api/reviews').send(payload).expect(201);
    assert.equal(response.body.review.comment, payload.comment);
  });

  it('rejects an out-of-range rating', async () => {
    await ctx.api
      .post('/api/reviews')
      .send({ ...validReview, rating: 6 })
      .expect(400);
  });

  it('only admins can delete a review', async () => {
    const { body } = await ctx.api.post('/api/reviews').send(validReview).expect(201);
    const client = await registerUser(ctx.api);
    const admin = await createAdmin(ctx.api);
    const url = `/api/reviews/${body.review._id}`;

    await ctx.api.delete(url).set('Authorization', client.auth).expect(403);
    await ctx.api.delete(url).set('Authorization', admin.auth).expect(204);
  });

  it('admin can list users without passwords', async () => {
    const admin = await createAdmin(ctx.api);
    const response = await ctx.api
      .get('/api/admin/users')
      .set('Authorization', admin.auth)
      .expect(200);
    assert.ok(response.body.users.every((user) => user.password === undefined));
  });
});
