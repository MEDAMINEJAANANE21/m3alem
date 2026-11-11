import mongoose from 'mongoose';

import { ALL_BOOKING_STATUSES, BOOKING_STATUS } from '../constants/booking-status.constants.js';

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    client: { type: ObjectId, ref: 'User', required: true, index: true },
    // Copied from the service so a provider can list their bookings with one query.
    provider: { type: ObjectId, ref: 'User', required: true, index: true },
    service: { type: ObjectId, ref: 'Service', required: true },
    scheduledAt: { type: Date, required: true },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 20 },
    notes: { type: String, trim: true, maxlength: 500 },
    quantity: { type: Number, min: 1, default: 1 },
    // Frozen at booking time so later price changes do not alter existing bookings.
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ALL_BOOKING_STATUSES, default: BOOKING_STATUS.PENDING },
  },
  { timestamps: true, versionKey: false },
);

export const Booking = mongoose.model('Booking', bookingSchema);
