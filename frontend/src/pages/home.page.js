import 'bootstrap/js/dist/collapse.js';
import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { clearAlert, describeError, el, setBusy, showAlert } from '../utils/dom.util.js';
import { formatDate, formatStars } from '../utils/format.util.js';

const EMPTY_REVIEWS_MESSAGE = 'Aucun avis pour le moment';

function renderReview(review) {
  return el('article', { className: 'review-card' }, [
    el('div', { className: 'review-card__head' }, [
      el('h3', { text: review.authorName }),
      el('span', { className: 'review-card__date', text: formatDate(review.createdAt) }),
    ]),
    el('p', {
      className: 'review-card__stars',
      text: formatStars(review.rating),
      'aria-label': `Note : ${review.rating} sur 5`,
    }),
    el('p', { className: 'review-card__comment', text: review.comment }),
  ]);
}

async function loadReviews(list) {
  try {
    const { reviews } = await apiClient.listReviews();
    list.replaceChildren(
      ...(reviews.length
        ? reviews.map(renderReview)
        : [el('p', { className: 'text-muted', text: EMPTY_REVIEWS_MESSAGE })]),
    );
  } catch (error) {
    showAlert(list, describeError(error), 'warning');
  }
}

function setUpReviewForm(form, list) {
  const feedback = document.getElementById('review-feedback');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    setBusy(submitButton, true);
    try {
      const { review } = await apiClient.createReview({
        authorName: data.get('authorName'),
        comment: data.get('comment'),
        rating: Number(data.get('rating')),
      });
      list.querySelector('p.text-muted')?.remove();
      list.prepend(renderReview(review));
      form.reset();
      showAlert(feedback, 'Merci, votre avis est publié', 'success');
    } catch (error) {
      showAlert(feedback, describeError(error));
    } finally {
      setBusy(submitButton, false);
    }
  });
  form.addEventListener('input', () => clearAlert(feedback));
}

const reviewsList = document.getElementById('reviews-list');
loadReviews(reviewsList);
setUpReviewForm(document.getElementById('review-form'), reviewsList);
