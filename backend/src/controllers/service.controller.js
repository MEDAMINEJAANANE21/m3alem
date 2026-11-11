import { CATEGORIES } from '../constants/categories.constants.js';
import { ROLES } from '../constants/roles.constants.js';
import { ApiError } from '../errors/api.error.js';
import { Service } from '../models/service.model.js';
import { escapeRegex } from '../utils/escape-regex.util.js';
import { pick } from '../utils/pick.util.js';

const EDITABLE_FIELDS = [
  'title',
  'description',
  'category',
  'price',
  'priceLabel',
  'pricingUnit',
  'minQuantity',
  'location',
];
const PUBLIC_PROVIDER_FIELDS = 'name phone';

function buildFilters({ category, location, provider }) {
  const filters = {};
  if (category) filters.category = category;
  if (provider) filters.provider = provider;
  if (location) filters.location = new RegExp(escapeRegex(location), 'i');
  return filters;
}

async function findEditableService(serviceId, user) {
  const service = await Service.findById(serviceId);
  if (!service) throw ApiError.notFound('Service introuvable');

  const isOwner = service.provider.equals(user.id);
  if (!isOwner && user.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Ce service ne vous appartient pas');
  }
  return service;
}

export const serviceController = {
  listCategories(_req, res) {
    res.json({ categories: CATEGORIES });
  },

  async list(req, res) {
    const services = await Service.find(buildFilters(req.validated))
      .populate('provider', PUBLIC_PROVIDER_FIELDS)
      .sort({ category: 1, createdAt: 1 });
    res.json({ services });
  },

  async getById(req, res) {
    const service = await Service.findById(req.validated.id).populate(
      'provider',
      PUBLIC_PROVIDER_FIELDS,
    );
    if (!service) throw ApiError.notFound('Service introuvable');
    res.json({ service });
  },

  async create(req, res) {
    const service = await Service.create({
      ...pick(req.validated, EDITABLE_FIELDS),
      provider: req.user.id,
    });
    res.status(201).json({ service });
  },

  async update(req, res) {
    const service = await findEditableService(req.validated.id, req.user);
    service.set(pick(req.validated, EDITABLE_FIELDS));
    await service.save();
    res.json({ service });
  },

  async remove(req, res) {
    const service = await findEditableService(req.validated.id, req.user);
    await service.deleteOne();
    res.status(204).end();
  },
};
