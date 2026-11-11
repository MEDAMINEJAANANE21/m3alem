import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true, trim: true, maxlength: 60 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true, versionKey: false },
);

export const Review = mongoose.model('Review', reviewSchema);
