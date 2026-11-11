import { body, query } from 'express-validator';

import { CATEGORY_SLUGS } from '../constants/categories.constants.js';
import { PRICING_UNITS } from '../models/service.model.js';
import { idParamRules } from './common.validator.js';

function serviceBodyRules({ partial }) {
  const field = (name) => (partial ? body(name).optional() : body(name));

  return [
    field('title').trim().isLength({ min: 2, max: 120 }).withMessage('Titre requis (2 à 120 caractères)'),
    body('description').optional().trim().isLength({ max: 500 }),
    field('category').isIn(CATEGORY_SLUGS).withMessage('Catégorie inconnue'),
    field('price').isFloat({ min: 0 }).withMessage('Prix invalide').toFloat(),
    body('priceLabel').optional().trim().isLength({ max: 40 }),
    body('pricingUnit').optional().isIn(Object.values(PRICING_UNITS)),
    body('minQuantity').optional().isInt({ min: 1 }).toInt(),
    body('location').optional().trim().isLength({ max: 100 }),
  ];
}

export const listServicesRules = [
  query('category').optional().isIn(CATEGORY_SLUGS).withMessage('Catégorie inconnue'),
  query('location').optional().trim().isLength({ max: 100 }),
  query('provider').optional().isMongoId(),
];

export const createServiceRules = serviceBodyRules({ partial: false });

export const updateServiceRules = [...idParamRules, ...serviceBodyRules({ partial: true })];
