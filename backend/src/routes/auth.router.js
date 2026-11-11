import { Router } from 'express';

import { createAuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginRules, registerRules } from '../validators/auth.validator.js';

export function createAuthRouter({ tokenService, limiters }) {
  const router = Router();
  const controller = createAuthController(tokenService);

  router.post('/register', limiters.auth, validate(registerRules), controller.register);
  router.post('/login', limiters.auth, validate(loginRules), controller.login);
  router.get('/me', authenticate(tokenService), controller.me);

  return router;
}
