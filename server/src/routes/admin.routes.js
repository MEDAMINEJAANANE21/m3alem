import { Router } from 'express';

import { ROLES } from '../constants/roles.js';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

export function createAdminRouter({ tokenService }) {
  const router = Router();
  router.use(authenticate(tokenService), authorize(ROLES.ADMIN));

  router.get('/users', adminController.listUsers);

  return router;
}
