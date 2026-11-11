import { Router } from 'express';

import { ROLES } from '../constants/roles.js';
import { reviewController } from '../controllers/review.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamRules } from '../validators/common.validators.js';
import { createReviewRules } from '../validators/review.validators.js';

export function createReviewRouter({ tokenService, limiters }) {
  const router = Router();

  router.get('/', reviewController.list);
  router.post('/', limiters.publicWrite, validate(createReviewRules), reviewController.create);
  router.delete(
    '/:id',
    authenticate(tokenService),
    authorize(ROLES.ADMIN),
    validate(idParamRules),
    reviewController.remove,
  );

  return router;
}
