/**
 * Price Tracking Schema and Model
 * Tracks historical price data for restaurants and menu items
 */

const mongoose = require('mongoose');

const priceTrackingSchema = new mongoose.Schema(
  {
    // Item Reference
    foodItem: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    restaurantName: String,

    // Price Data
    price: {
      type: Number,
      required: true,
    },
    originalPrice: Number,
    discount: Number,

    // Category
    category: String,
    description: String,

    // Status
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

// Index for efficient price queries
priceTrackingSchema.index({ foodItem: 1, restaurant: 1, recordedAt: -1 });
priceTrackingSchema.index({ foodItem: 1, recordedAt: -1 });

const PriceTracking = mongoose.model('PriceTracking', priceTrackingSchema);
module.exports = PriceTracking;
