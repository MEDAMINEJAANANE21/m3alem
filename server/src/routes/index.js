import { Router } from 'express';

import { serviceController } from '../controllers/service.controller.js';
import { createAdminRouter } from './admin.routes.js';
import { createAuthRouter } from './auth.routes.js';
import { createBookingRouter } from './booking.routes.js';
import { createReviewRouter } from './review.routes.js';
import { createServiceRouter } from './service.routes.js';

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
