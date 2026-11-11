import { matchedData, validationResult } from 'express-validator';

import { ApiError } from '../errors/api-error.js';

// Runs the given express-validator chains, then exposes only validated fields
// in `req.validated`, so controllers never read unchecked input from `req.body`.
export function validate(chains) {
  return [
    ...chains,
    (req, _res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const details = result.array().map(({ path, msg }) => ({ field: path, message: msg }));
        throw ApiError.badRequest('Données invalides', details);
      }
      req.validated = matchedData(req);
      next();
    },
  ];
}
