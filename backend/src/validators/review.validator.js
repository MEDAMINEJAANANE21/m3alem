import { body } from 'express-validator';

export const createReviewRules = [
  body('authorName')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Nom requis (2 à 60 caractères)'),
  body('comment').trim().isLength({ min: 5, max: 1000 }).withMessage('Commentaire requis'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5').toInt(),
];
