import mongoose from 'mongoose';

import { CATEGORY_SLUGS } from '../constants/categories.js';

export const PRICING_UNITS = Object.freeze({
  FIXED: 'fixed',
  HOUR: 'hour',
  UNIT: 'unit',
});

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    category: { type: String, required: true, enum: CATEGORY_SLUGS, index: true },
    price: { type: Number, required: true, min: 0 },
    // Optional human-friendly price shown instead of `price`, e.g. "70-120 €".
    priceLabel: { type: String, trim: true, maxlength: 40 },
    pricingUnit: { type: String, enum: Object.values(PRICING_UNITS), default: PRICING_UNITS.FIXED },
    minQuantity: { type: Number, min: 1, default: 1 },
    location: { type: String, trim: true, maxlength: 100 },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false },
);

serviceSchema.methods.isQuantityBased = function isQuantityBased() {
  return this.pricingUnit !== PRICING_UNITS.FIXED;
};

serviceSchema.methods.computeTotal = function computeTotal(quantity = 1) {
  return this.isQuantityBased() ? this.price * quantity : this.price;
};

export const Service = mongoose.model('Service', serviceSchema);
