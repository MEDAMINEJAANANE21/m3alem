import { CURRENCY } from '../config/app.config.js';

const UNIT_SUFFIX = { fixed: '', hour: '/h', unit: '/unité' };
const QUANTITY_LABEL = { hour: 'h', unit: 'unité(s)' };
const MAX_RATING = 5;

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

export const formatPrice = (amount) => `${amount} ${CURRENCY}`;

export function formatServicePrice(service) {
  return (
    service.priceLabel || `${formatPrice(service.price)}${UNIT_SUFFIX[service.pricingUnit] ?? ''}`
  );
}

export function formatQuantity(quantity, pricingUnit) {
  return QUANTITY_LABEL[pricingUnit] ? `${quantity} ${QUANTITY_LABEL[pricingUnit]}` : '';
}

export const formatDateTime = (isoDate) => dateTimeFormatter.format(new Date(isoDate));

export const formatDate = (isoDate) => dateFormatter.format(new Date(isoDate));

export const formatStars = (rating) => '★'.repeat(rating) + '☆'.repeat(MAX_RATING - rating);
