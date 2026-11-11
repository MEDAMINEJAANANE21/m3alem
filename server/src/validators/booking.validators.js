import { body } from 'express-validator';

import { ALL_BOOKING_STATUSES } from '../constants/booking-status.js';
import { idParamRules } from './common.validators.js';

export const createBookingRules = [
  body('service').isMongoId().withMessage('Service invalide'),
  body('scheduledAt')
    .isISO8601()
    .withMessage('Date invalide')
    .bail()
    .custom((value) => new Date(value) > new Date())
    .withMessage('La date doit être dans le futur')
    .toDate(),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Adresse requise'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }),
  body('notes').optional().trim().isLength({ max: 500 }),
  body('quantity').optional().isInt({ min: 1, max: 100 }).withMessage('Quantité invalide').toInt(),
];

export const updateBookingStatusRules = [
  ...idParamRules,
  body('status').isIn(ALL_BOOKING_STATUSES).withMessage('Statut inconnu'),
];
