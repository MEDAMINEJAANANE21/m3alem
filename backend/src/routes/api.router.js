import { Router } from 'express';

import { serviceController } from '../controllers/service.controller.js';
import { createAdminRouter } from './admin.router.js';
import { createAuthRouter } from './auth.router.js';
import { createBookingRouter } from './booking.router.js';
import { createReviewRouter } from './review.router.js';
import { createServiceRouter } from './service.router.js';

export function createApiRouter(dependencies) {
  const router = Router();

  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.get('/categories', serviceController.listCategories);
  router.use('/auth', createAuthRouter(dependencies));
  router.use('/services', createServiceRouter(dependencies));
  router.use('/bookings', createBookingRouter(dependencies));
  router.use('/reviews', createReviewRouter(dependencies));
  router.use('/admin', createAdminRouter(dependencies));

  return router;
}
