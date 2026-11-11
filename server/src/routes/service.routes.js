import { Router } from 'express';

import { ROLES } from '../constants/roles.js';
import { serviceController } from '../controllers/service.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamRules } from '../validators/common.validators.js';
import {
  createServiceRules,
  listServicesRules,
  updateServiceRules,
} from '../validators/service.validators.js';

export function createServiceRouter({ tokenService }) {
  const router = Router();
  const canManage = [authenticate(tokenService), authorize(ROLES.PROVIDER, ROLES.ADMIN)];

  router.get('/', validate(listServicesRules), serviceController.list);
  router.get('/:id', validate(idParamRules), serviceController.getById);
  router.post(
    '/',
    authenticate(tokenService),
    authorize(ROLES.PROVIDER),
    validate(createServiceRules),
    serviceController.create,
  );
  router.patch('/:id', ...canManage, validate(updateServiceRules), serviceController.update);
  router.delete('/:id', ...canManage, validate(idParamRules), serviceController.remove);

  return router;
}
