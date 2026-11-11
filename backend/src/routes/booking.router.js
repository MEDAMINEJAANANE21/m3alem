import { Router } from 'express';

import { ROLES } from '../constants/roles.constants.js';
import { bookingController } from '../controllers/booking.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createBookingRules, updateBookingStatusRules } from '../validators/booking.validator.js';

export function createBookingRouter({ tokenService }) {
  const router = Router();
  router.use(authenticate(tokenService));

  router.post('/', authorize(ROLES.CLIENT), validate(createBookingRules), bookingController.create);
  router.get('/me', bookingController.listMine);
  router.patch('/:id/status', validate(updateBookingStatusRules), bookingController.updateStatus);

  return router;
}
