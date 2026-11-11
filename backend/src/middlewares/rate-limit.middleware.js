import { rateLimit } from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

function createLimiter(limit, enabled) {
  return rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => !enabled,
    message: { error: { message: 'Trop de requêtes, réessayez plus tard' } },
  });
}

export function createRateLimiters({ enabled }) {
  return {
    api: createLimiter(300, enabled),
    auth: createLimiter(20, enabled),
    publicWrite: createLimiter(10, enabled),
  };
}
