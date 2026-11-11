import { after, afterEach, before } from 'node:test';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApp } from '../../src/app.js';
import { ROLES } from '../../src/constants/roles.constants.js';
import { User } from '../../src/models/user.model.js';

const TEST_CONFIG = Object.freeze({
  nodeEnv: 'test',
  jwtSecret: 'test-secret',
  jwtExpiresIn: '1h',
  corsOrigins: [],
  trustProxy: 0,
});

export const DEFAULT_PASSWORD = 'Password123!';

// Registers node:test hooks that give each test file its own in-memory MongoDB.
export function useTestApp() {
  const context = { api: null };
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    context.api = request(createApp(TEST_CONFIG));
  });

  afterEach(async () => {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  return context;
}

export async function registerUser(api, overrides = {}) {
  const payload = {
    name: 'Test User',
    email: `user-${crypto.randomUUID()}@test.local`,
    password: DEFAULT_PASSWORD,
    role: ROLES.CLIENT,
    ...overrides,
  };
  const response = await api.post('/api/auth/register').send(payload).expect(201);
  return { ...response.body, auth: `Bearer ${response.body.token}` };
}

// Admins cannot self-register, so they are inserted directly, then logged in.
export async function createAdmin(api) {
  const email = `admin-${crypto.randomUUID()}@test.local`;
  await User.create({ name: 'Admin', email, password: DEFAULT_PASSWORD, role: ROLES.ADMIN });
  const response = await api.post('/api/auth/login').send({ email, password: DEFAULT_PASSWORD });
  return { ...response.body, auth: `Bearer ${response.body.token}` };
}

export async function createService(api, providerAuth, overrides = {}) {
  const payload = { title: 'Installation WC', category: 'plombier', price: 150, ...overrides };
  const response = await api
    .post('/api/services')
    .set('Authorization', providerAuth)
    .send(payload)
    .expect(201);
  return response.body.service;
}

export function tomorrow() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}
