import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { createRateLimiters } from './middlewares/rate-limit.middleware.js';
import { createApiRouter } from './routes/index.js';
import { createTokenService } from './services/token.service.js';

const PUBLIC_DIR = fileURLToPath(new URL('../../public', import.meta.url));
const NOT_FOUND_PAGE = path.join(PUBLIC_DIR, '404.html');

const CONTENT_SECURITY_POLICY = {
  directives: {
    'connect-src': ["'self'", 'https://api.web3forms.com'],
    'frame-src': ['https://www.google.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'style-src': ["'self'", 'https://fonts.googleapis.com'],
  },
};

function buildCorsOptions(corsOrigins) {
  return corsOrigins.length > 0 ? { origin: corsOrigins } : { origin: false };
}

// Pattern: Factory — building the app from a config makes it easy to test without a real server.
export function createApp(config) {
  const isTest = config.nodeEnv === 'test';
  const tokenService = createTokenService({
    secret: config.jwtSecret,
    expiresIn: config.jwtExpiresIn,
  });
  const limiters = createRateLimiters({ enabled: !isTest });

  const app = express();
  app.disable('x-powered-by');

  app.use(helmet({ contentSecurityPolicy: CONTENT_SECURITY_POLICY }));
  if (!isTest) app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '100kb' }));

  app.use(
    '/api',
    cors(buildCorsOptions(config.corsOrigins)),
    limiters.api,
    createApiRouter({ tokenService, limiters }),
  );
  app.use('/api', notFoundHandler);

  app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
  app.use((_req, res) => res.status(404).sendFile(NOT_FOUND_PAGE));

  app.use(errorHandler);
  return app;
}
