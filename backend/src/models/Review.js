/**
 * Review Schema and Model
 * Defines restaurant reviews and ratings
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // Review Content
    text: {
      type: String,
      required: [true, 'Please provide review text'],
      maxlength: 500,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },

    // References
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Metadata
    userName: String,
    userEmail: String,
    helpfulCount: {
      type: Number,
      default: 0,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },

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

/**
 * Post-save middleware: Update restaurant rating
 */
reviewSchema.post('save', async function () {
  const Restaurant = mongoose.model('Restaurant');

  // Recalculate restaurant rating
  const reviews = await this.constructor.find({
    restaurant: this.restaurant,
  });

  const avgRating =
    reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  // Update rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    distribution[review.rating]++;
  });

  await Restaurant.findByIdAndUpdate(this.restaurant, {
    rating: avgRating,
    reviewCount: reviews.length,
    ratingDistribution: distribution,
  });
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
