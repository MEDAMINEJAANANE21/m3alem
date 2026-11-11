import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { describeError, el, setBusy, showAlert } from '../utils/dom.util.js';
import { formatDateTime, formatPrice, formatQuantity } from '../utils/format.util.js';
import { session } from '../stores/session.store.js';

const STATUS_BADGES = {
  pending: { label: 'En attente', className: 'text-bg-warning' },
  confirmed: { label: 'Confirmée', className: 'text-bg-primary' },
  completed: { label: 'Terminée', className: 'text-bg-success' },
  cancelled: { label: 'Annulée', className: 'text-bg-secondary' },
};

const ROLE_LABELS = { client: 'Client', prestataire: 'Prestataire', admin: 'Administrateur' };

const cancel = { status: 'cancelled', label: 'Annuler', style: 'btn-outline-danger' };
const confirm = { status: 'confirmed', label: 'Confirmer', style: 'btn-primary' };
const complete = { status: 'completed', label: 'Marquer terminée', style: 'btn-success' };
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

function renderBooking(booking) {
  const badge = STATUS_BADGES[booking.status];
  const service = booking.service ?? { title: 'Service supprimé' };
  const quantity = formatQuantity(booking.quantity, service.pricingUnit);

  return el('article', { className: 'booking-card' }, [
    el('div', { className: 'booking-card__header' }, [
      el('h3', {
        className: 'h6 mb-0',
        text: quantity ? `${service.title} (${quantity})` : service.title,
      }),
      el('span', { className: `badge ${badge.className}`, text: badge.label }),
    ]),
    el('p', {
      className: 'mb-1',
      text: `${formatDateTime(booking.scheduledAt)} · ${booking.address}`,
    }),
    el('p', { className: 'mb-1 text-muted', text: describeCounterpart(booking) }),
    booking.notes ? el('p', { className: 'mb-1 fst-italic', text: booking.notes }) : '',
    el('div', { className: 'booking-card__footer' }, [
      el('strong', { text: formatPrice(booking.totalPrice) }),
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
