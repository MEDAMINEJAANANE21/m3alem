import { ApiError } from '../errors/api-error.js';
import { Review } from '../models/review.model.js';

const LATEST_REVIEWS_LIMIT = 20;

export const reviewController = {
  async list(_req, res) {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(LATEST_REVIEWS_LIMIT);
    res.json({ reviews });
  },

  async create(req, res) {
    const { authorName, comment, rating } = req.validated;
    const review = await Review.create({ authorName, comment, rating });
    res.status(201).json({ review });
  },

  async remove(req, res) {
    const review = await Review.findByIdAndDelete(req.validated.id);
    if (!review) throw ApiError.notFound('Avis introuvable');
    res.status(204).end();
  },
};
