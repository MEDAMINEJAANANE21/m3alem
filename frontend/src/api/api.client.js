import { http } from './http.client.js';

// Pattern: Facade — pages call meaningful methods and never build URLs themselves.
export const apiClient = {
  login: (credentials) => http.post('/auth/login', credentials),
  register: (account) => http.post('/auth/register', account),
  getCurrentUser: () => http.get('/auth/me'),

  listCategories: () => http.get('/categories'),
  listServices: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return http.get(`/services${query ? `?${query}` : ''}`);
  },

  createBooking: (booking) => http.post('/bookings', booking),
  listMyBookings: () => http.get('/bookings/me'),
  updateBookingStatus: (bookingId, status) =>
    http.patch(`/bookings/${encodeURIComponent(bookingId)}/status`, { status }),

  listReviews: () => http.get('/reviews'),
  createReview: (review) => http.post('/reviews', review),
};
