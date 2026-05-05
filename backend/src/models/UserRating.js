/**
 * User Ratings Schema and Model
 * Tracks user ratings for collaborative filtering
 */

const mongoose = require('mongoose');

const userRatingSchema = new mongoose.Schema(
  {
    // References
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },

    // Rating
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Additional Info
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
    visitDate: Date,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate ratings
userRatingSchema.index({ user: 1, restaurant: 1 }, { unique: true });

const UserRating = mongoose.model('UserRating', userRatingSchema);
module.exports = UserRating;
