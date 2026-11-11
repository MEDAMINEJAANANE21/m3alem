import { BOOKING_STATUS, BOOKING_TRANSITIONS } from '../constants/booking-status.js';
import { ROLES } from '../constants/roles.js';
import { ApiError } from '../errors/api-error.js';
import { Booking } from '../models/booking.model.js';
import { Service } from '../models/service.model.js';

// Strategy: each role sees a different subset of bookings.
const BOOKING_SCOPE_BY_ROLE = {
  [ROLES.CLIENT]: (user) => ({ client: user.id }),
  [ROLES.PROVIDER]: (user) => ({ provider: user.id }),
  [ROLES.ADMIN]: () => ({}),
};

function resolveQuantity(service, requestedQuantity = service.minQuantity) {
  if (!service.isQuantityBased()) return 1;
  if (requestedQuantity < service.minQuantity) {
    throw ApiError.badRequest(`Quantité minimale pour ce service : ${service.minQuantity}`);
  }
  return requestedQuantity;
}

function assertCanChangeStatus(booking, user, nextStatus) {
  const isClient = booking.client.equals(user.id);
  const isProvider = booking.provider.equals(user.id);
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isClient && !isProvider && !isAdmin) {
    throw ApiError.notFound('Réservation introuvable');
  }
  if (isClient && !isAdmin && nextStatus !== BOOKING_STATUS.CANCELLED) {
    throw ApiError.forbidden('Un client peut uniquement annuler sa réservation');
  }
  if (!BOOKING_TRANSITIONS[booking.status].includes(nextStatus)) {
    throw ApiError.conflict(`Impossible de passer de « ${booking.status} » à « ${nextStatus} »`);
  }
}

export const bookingController = {
  async create(req, res) {
    const { service: serviceId, quantity, ...details } = req.validated;

    const service = await Service.findById(serviceId);
    if (!service) throw ApiError.notFound('Service introuvable');

    const finalQuantity = resolveQuantity(service, quantity);
    const booking = await Booking.create({
      ...details,
      client: req.user.id,
      provider: service.provider,
      service: service.id,
      quantity: finalQuantity,
      totalPrice: service.computeTotal(finalQuantity),
    });

    res.status(201).json({ booking });
  },

  async listMine(req, res) {
    const scope = BOOKING_SCOPE_BY_ROLE[req.user.role](req.user);
    const bookings = await Booking.find(scope)
      .populate('service', 'title category pricingUnit')
      .populate('client', 'name phone')
      .populate('provider', 'name phone')
      .sort({ scheduledAt: -1 });
    res.json({ bookings });
  },

  async updateStatus(req, res) {
    const { id, status } = req.validated;

    const booking = await Booking.findById(id);
    if (!booking) throw ApiError.notFound('Réservation introuvable');

    assertCanChangeStatus(booking, req.user, status);
    booking.status = status;
    await booking.save();

    res.json({ booking });
  },
};
