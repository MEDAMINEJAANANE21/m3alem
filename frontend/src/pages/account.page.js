import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { describeError, el, setBusy, showAlert } from '../utils/dom.util.js';
import { formatDateTime, formatPrice, formatQuantity } from '../utils/format.util.js';
import { session } from '../stores/session.store.js';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const ROLE_LABELS = { client: 'Client', prestataire: 'Prestataire', admin: 'Administrateur' };
const REFERENCE_LENGTH = 6;

const cancel = { status: 'cancelled', label: 'Annuler', style: 'btn-outline-danger' };
const confirm = { status: 'confirmed', label: 'Confirmer', style: 'btn-primary' };
const complete = { status: 'completed', label: 'Marquer terminée', style: 'btn-primary' };
const PROVIDER_ACTIONS = { pending: [confirm, cancel], confirmed: [complete, cancel] };

// Pattern: Strategy — the actions offered on a booking depend on the user's role.
const ACTIONS_BY_ROLE = {
  client: { pending: [cancel], confirmed: [cancel] },
  prestataire: PROVIDER_ACTIONS,
  admin: PROVIDER_ACTIONS,
};

const dom = {
  summary: document.getElementById('account-summary'),
  feedback: document.getElementById('account-feedback'),
  bookings: document.getElementById('bookings'),
};

function renderActions(booking) {
  const actions = ACTIONS_BY_ROLE[session.user.role]?.[booking.status] ?? [];
  return actions.map((action) =>
    el('button', {
      type: 'button',
      className: `btn btn-sm ${action.style}`,
      text: action.label,
      on: {
        click: async (event) => {
          setBusy(event.currentTarget, true);
          try {
            await apiClient.updateBookingStatus(booking._id, action.status);
            await loadBookings();
          } catch (error) {
            showAlert(dom.feedback, describeError(error));
            setBusy(event.currentTarget, false);
          }
        },
      },
    }),
  );
}

function describeCounterpart(booking) {
  const isClient = session.hasRole('client');
  const person = isClient ? booking.provider : booking.client;
  if (!person) return '';
  const role = isClient ? 'Prestataire' : 'Client';
  return `${role} : ${person.name}${person.phone ? ` · ${person.phone}` : ''}`;
}

// Short, human-readable work order number derived from the booking id.
const toReference = (bookingId) => `N° ${bookingId.slice(-REFERENCE_LENGTH).toUpperCase()}`;

function renderBooking(booking) {
  const service = booking.service ?? { title: 'Service supprimé' };
  const quantity = formatQuantity(booking.quantity, service.pricingUnit);
  const details = (text) => el('p', { className: 'booking-card__details', text });

  return el('article', { className: 'booking-card' }, [
    el('div', { className: 'booking-card__header' }, [
      el('span', {
        className: `booking-status booking-status--${booking.status}`,
        text: STATUS_LABELS[booking.status],
      }),
      el('span', { className: 'work-order-ref', text: toReference(booking._id) }),
    ]),
    el('h3', {
      className: 'booking-card__title',
      text: quantity ? `${service.title} (${quantity})` : service.title,
    }),
    el('div', { className: 'booking-card__tear', 'aria-hidden': 'true' }),
    details(`${formatDateTime(booking.scheduledAt)} · ${booking.address}`),
    details(describeCounterpart(booking)),
    booking.notes ? details(booking.notes) : '',
    el('div', { className: 'booking-card__footer' }, [
      el('span', { className: 'booking-card__total', text: formatPrice(booking.totalPrice) }),
      el('div', { className: 'booking-card__actions' }, renderActions(booking)),
    ]),
  ]);
}

async function loadBookings() {
  try {
    const { bookings } = await apiClient.listMyBookings();
    dom.bookings.replaceChildren(
      ...(bookings.length
        ? bookings.map(renderBooking)
        : [
            el('p', { className: 'text-muted' }, [
              'Aucune réservation pour le moment. ',
              el('a', { href: '/services.html', text: 'Découvrir les services' }),
            ]),
          ]),
    );
  } catch (error) {
    showAlert(dom.feedback, describeError(error));
  }
}

function redirectIfLoggedOut() {
  if (!session.isLoggedIn()) window.location.replace('/auth.html?next=/account.html');
}

redirectIfLoggedOut();
session.subscribe(redirectIfLoggedOut);

if (session.isLoggedIn()) {
  const { name, email, role } = session.user;
  dom.summary.textContent = `${name} · ${email} · ${ROLE_LABELS[role] ?? role}`;
  loadBookings();
}
