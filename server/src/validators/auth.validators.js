import { body } from 'express-validator';

import { ROLES, SELF_REGISTRATION_ROLES } from '../constants/roles.js';

const PASSWORD_MIN_LENGTH = 8;

const emailRule = () =>
  body('email').trim().isEmail().withMessage('Adresse e-mail invalide').toLowerCase();

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nom requis (2 à 100 caractères)'),
  emailRule(),
  body('password')
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .matches(/^\+?[0-9 ]{8,20}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('role')
    .default(ROLES.CLIENT)
    .isIn(SELF_REGISTRATION_ROLES)
    .withMessage(`Rôle autorisé : ${SELF_REGISTRATION_ROLES.join(' ou ')}`),
];

export const loginRules = [
  emailRule(),
  body('password').isString().notEmpty().withMessage('Mot de passe requis'),
];
