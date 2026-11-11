import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { Cart } from '../stores/cart.store.js';
import { describeError, el, setBusy, showAlert } from '../utils/dom.util.js';
import { formatPrice, formatQuantity, formatServicePrice } from '../utils/format.util.js';
import { session } from '../stores/session.store.js';

const ADDED_FEEDBACK_MS = 1500;

const cart = new Cart();
const dom = {
  categories: document.getElementById('categories'),
  catalogFeedback: document.getElementById('catalog-feedback'),
  cartItems: document.getElementById('cart-items'),
  cartCount: document.getElementById('cart-count'),
  cartTotal: document.getElementById('cart-total'),
  checkoutForm: document.getElementById('checkout-form'),
  checkoutButton: document.getElementById('checkout-button'),
  checkoutFeedback: document.getElementById('checkout-feedback'),
};

function flashAdded(button) {
  button.textContent = '✓ Ajouté';
  button.classList.replace('btn-primary', 'btn-success');
  setTimeout(() => {
    button.textContent = 'Réserver';
    button.classList.replace('btn-success', 'btn-primary');
  }, ADDED_FEEDBACK_MS);
}

function renderServiceItem(service) {
  const isQuantityBased = service.pricingUnit !== 'fixed';
  const quantityInput = isQuantityBased
    ? el('input', {
        type: 'number',
        className: 'form-control form-control-sm service-item__quantity',
        min: String(service.minQuantity),
        value: String(service.minQuantity),
        'aria-label': `Quantité pour ${service.title}`,
      })
    : null;

  const addButton = el('button', {
    type: 'button',
    className: 'btn btn-primary btn-sm',
    text: 'Réserver',
    on: {
      click: (event) => {
        const quantity = Math.max(service.minQuantity, Number(quantityInput?.value) || 1);
        cart.add(service, quantity);
        flashAdded(event.currentTarget);
      },
    },
  });

  return el('li', { className: 'service-item' }, [
    el('div', { className: 'service-item__info' }, [
      el('p', { className: 'service-item__name', text: service.title }),
      el('p', { className: 'service-item__desc', text: service.description }),
    ]),
    el('span', { className: 'service-item__price', text: formatServicePrice(service) }),
    el('div', { className: 'service-item__actions' }, [quantityInput ?? '', addButton]),
  ]);
}

function renderCategory(category, services, isOpen) {
  return el('details', { className: 'category', id: category.slug, open: isOpen }, [
    el('summary', { className: 'category__title', text: category.label }),
    el('ul', { className: 'category__services' }, services.map(renderServiceItem)),
    category.note ? el('p', { className: 'category__note', text: category.note }) : '',
  ]);
}

function groupByCategory(services) {
  return services.reduce((groups, service) => {
    (groups[service.category] ??= []).push(service);
    return groups;
  }, {});
}

async function loadCatalog() {
  try {
    const [{ categories }, { services }] = await Promise.all([
      apiClient.listCategories(),
      apiClient.listServices(),
    ]);
    const servicesByCategory = groupByCategory(services);
    const requestedSlug = window.location.hash.slice(1);
    const available = categories.filter((category) => servicesByCategory[category.slug]);

    if (available.length === 0) {
      dom.categories.replaceChildren(
        el('p', { className: 'text-muted', text: 'Aucun service disponible pour le moment.' }),
      );
      return;
    }

    dom.categories.replaceChildren(
      ...available.map((category, index) =>
        renderCategory(
          category,
          servicesByCategory[category.slug],
          requestedSlug ? category.slug === requestedSlug : index === 0,
        ),
      ),
    );
    document.getElementById(requestedSlug)?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    dom.categories.replaceChildren();
    showAlert(dom.catalogFeedback, describeError(error));
  }
}

function renderCartItem(item) {
  const quantity = formatQuantity(item.quantity, item.pricingUnit);
  return el('li', { className: 'cart__item' }, [
    el('div', {}, [
      el('p', {
        className: 'cart__item-name',
        text: quantity ? `${item.title} (${quantity})` : item.title,
      }),
      el('small', { text: formatPrice(item.total) }),
    ]),
    el(
      'button',
      {
        type: 'button',
        className: 'btn btn-link btn-sm text-danger',
        'aria-label': `Retirer ${item.title} du panier`,
        on: { click: () => cart.remove(item.id) },
      },
      [el('i', { className: 'bi bi-x-lg', 'aria-hidden': 'true' })],
    ),
  ]);
}

function renderCart() {
  dom.cartCount.textContent = String(cart.items.length);
  dom.cartTotal.textContent = formatPrice(cart.total);
  dom.cartItems.replaceChildren(
    ...(cart.isEmpty()
      ? [el('li', { className: 'cart__empty', text: 'Votre panier est vide' })]
      : cart.items.map(renderCartItem)),
  );
  dom.checkoutForm.hidden = cart.isEmpty();
}

function getCheckoutBlocker() {
  if (!session.isLoggedIn()) {
    return el('div', { className: 'alert alert-info' }, [
      'Connectez-vous pour finaliser votre commande. ',
      el('a', { href: '/auth.html?next=/services.html', text: 'Se connecter' }),
    ]);
  }
  if (!session.hasRole('client')) {
    return el('div', {
      className: 'alert alert-warning',
      text: 'Seuls les comptes client peuvent passer commande.',
    });
  }
  return null;
}

async function submitBookings(details) {
  const items = cart.items;
  const results = await Promise.allSettled(
    items.map((item) =>
      apiClient.createBooking({ ...details, service: item.serviceId, quantity: item.quantity }),
    ),
  );
  const bookedIds = items
    .filter((_item, index) => results[index].status === 'fulfilled')
    .map((item) => item.id);
  const firstFailure = results.find((result) => result.status === 'rejected');
  cart.removeMany(bookedIds);
  return { bookedCount: bookedIds.length, failure: firstFailure?.reason };
}

function setUpCheckout() {
  dom.checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const blocker = getCheckoutBlocker();
    if (blocker) {
      dom.checkoutFeedback.replaceChildren(blocker);
      return;
    }
    if (!dom.checkoutForm.reportValidity()) return;

    const data = new FormData(dom.checkoutForm);
    setBusy(dom.checkoutButton, true, 'Envoi…');
    const { bookedCount, failure } = await submitBookings({
      scheduledAt: new Date(data.get('scheduledAt')).toISOString(),
      address: data.get('address'),
      phone: data.get('phone') || undefined,
      notes: data.get('notes') || undefined,
    });
    setBusy(dom.checkoutButton, false);

    if (failure) {
      showAlert(dom.checkoutFeedback, describeError(failure));
      return;
    }
    dom.checkoutForm.reset();
    dom.checkoutFeedback.replaceChildren(
      el('div', { className: 'alert alert-success' }, [
        `${bookedCount} réservation(s) envoyée(s) ! Un professionnel vous contactera sous 24h. `,
        el('a', { href: '/account.html', text: 'Voir mes réservations' }),
      ]),
    );
  });
}

function toLocalInputValue(date) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

dom.checkoutForm.elements.scheduledAt.min = toLocalInputValue(new Date());

cart.subscribe(renderCart);
renderCart();
setUpCheckout();
loadCatalog();
