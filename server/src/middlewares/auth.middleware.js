import { ApiError } from '../errors/api-error.js';

const BEARER_PREFIX = 'Bearer ';

export function authenticate(tokenService) {
  return (req, _res, next) => {
    const header = req.get('Authorization') ?? '';
    if (!header.startsWith(BEARER_PREFIX)) {
      throw ApiError.unauthorized();
    }

    try {
      req.user = tokenService.verify(header.slice(BEARER_PREFIX.length));
    } catch {
      throw ApiError.unauthorized('Session invalide ou expirée');
    }
    next();
  };
}

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      throw ApiError.forbidden();
    }
    next();
  };
}
