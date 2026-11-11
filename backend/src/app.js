import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { createRateLimiters } from './middlewares/rate-limit.middleware.js';
import { createApiRouter } from './routes/api.router.js';
import { createTokenService } from './services/token.service.js';

function buildCorsOptions(corsOrigins) {
  return corsOrigins.length > 0 ? { origin: corsOrigins } : { origin: false };
}

// Pattern: Factory — building the app from a config makes it easy to test without a real server.
// The API only serves JSON: HTML pages are served by the frontend (Vite in dev, nginx in production),
// which proxies /api requests here.
export function createApp(config) {
  const isTest = config.nodeEnv === 'test';
  const tokenService = createTokenService({
    secret: config.jwtSecret,
    expiresIn: config.jwtExpiresIn,
  });
  const limiters = createRateLimiters({ enabled: !isTest });

  const app = express();
  app.disable('x-powered-by');
  // Behind a reverse proxy, the client IP comes from X-Forwarded-For (needed by the rate limiter).
  app.set('trust proxy', config.trustProxy);

  app.use(helmet());
  if (!isTest) app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '100kb' }));

  app.use(
    '/api',
    cors(buildCorsOptions(config.corsOrigins)),
    limiters.api,
    createApiRouter({ tokenService, limiters }),
  );
  app.use(notFoundHandler);

  app.use(errorHandler);
  return app;
}
