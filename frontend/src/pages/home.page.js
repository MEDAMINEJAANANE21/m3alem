import 'bootstrap/js/dist/collapse.js';
import '../components/layout.component.js';
import { apiClient } from '../api/api.client.js';
import { clearAlert, describeError, el, setBusy, showAlert } from '../utils/dom.util.js';
import { formatDate, formatStars } from '../utils/format.util.js';

function animateTimeline() {
  const items = document.querySelectorAll('.timeline__item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
    },
    { threshold: 0.4 },
  );
  items.forEach((item) => observer.observe(item));
}

function renderReview(review) {
  return el('article', { className: 'review-card' }, [
    el('h3', { text: review.authorName }),
    el('p', {
      className: 'review-card__stars',
      text: formatStars(review.rating),
      'aria-label': `Note : ${review.rating} sur 5`,
    }),
    el('p', { text: review.comment }),
    el('small', { text: `Posté le ${formatDate(review.createdAt)}` }),
  ]);
}

async function loadReviews(list) {
  try {
    const { reviews } = await apiClient.listReviews();
    list.replaceChildren(
      ...(reviews.length
        ? reviews.map(renderReview)
        : [el('p', { className: 'text-muted', text: 'Soyez le premier à laisser un avis !' })]),
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
      showAlert(feedback, 'Merci pour votre avis !', 'success');
    } catch (error) {
      showAlert(feedback, describeError(error));
    } finally {
      setBusy(submitButton, false);
    }
  });
  form.addEventListener('input', () => clearAlert(feedback));
}

const reviewsList = document.getElementById('reviews-list');
animateTimeline();
loadReviews(reviewsList);
setUpReviewForm(document.getElementById('review-form'), reviewsList);
