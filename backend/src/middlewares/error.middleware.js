import mongoose from 'mongoose';

import { ApiError } from '../errors/api.error.js';

const MONGO_DUPLICATE_KEY = 11000;

function toApiError(error) {
  if (error instanceof ApiError) return error;
  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map(({ path, message }) => ({
      field: path,
      message,
    }));
    return ApiError.badRequest('Données invalides', details);
  }
  if (error instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Valeur invalide pour « ${error.path} »`);
  }
  if (error.code === MONGO_DUPLICATE_KEY) {
    return ApiError.conflict('Cette ressource existe déjà');
  }
  if (error.type === 'entity.parse.failed') {
    return ApiError.badRequest('JSON invalide');
  }
  return null;
}

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route introuvable : ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  const apiError = toApiError(error);

  if (!apiError) {
    console.error(error);
    res.status(500).json({ error: { message: 'Erreur interne du serveur' } });
    return;
  }

  res.status(apiError.statusCode).json({
    error: { message: apiError.message, details: apiError.details },
  });
}
