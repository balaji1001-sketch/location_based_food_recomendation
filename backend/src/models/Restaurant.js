/**
 * Restaurant Schema and Model
 * Defines restaurant document structure
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
      index: true,
    },
    description: String,
    image: String,
    banner: String,
    thumbnail: String, // Emoji or image URL for quick visual reference

    // Contact Information
    email: String,
    phone: {
      type: String,
      required: true,
    },
    website: String,

    // Location (Geospatial Index for location-based queries)
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere', // Geospatial index for location-based queries
      },
    },

    // Restaurant Details
    cuisines: {
      type: [String],
      index: true,
    },
    timing: String,
    operatingHours: {
      monday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '23:00' },
        closed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '23:00' },
        closed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, default: '11:00' },
        close: { type: String, default: '22:00' },
        closed: { type: Boolean, default: false },
      },
    },
    deliveryAvailable: {
      type: Boolean,
      default: false,
    },
    diningOptions: [String], // e.g., ['Dine-in', 'Takeaway', 'Delivery']

    // Pricing
    avgPrice: {
      type: Number,
      required: true,
    },
    priceRange: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },

    // Ratings and Reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    ratingDistribution: {
      type: {
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
      },
      default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },

    // Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },

    // Menu Items
    menu: [
      {
        name: String,
        price: Number,
        category: String,
        description: String,
      },
    ],

    // Reviews Reference
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual fields for latitude and longitude to match mock database format
restaurantSchema.virtual('latitude').get(function() {
  if (this.coordinates && this.coordinates.coordinates && this.coordinates.coordinates.length >= 2) {
    return this.coordinates.coordinates[1]; // GeoJSON format is [longitude, latitude]
  }
  return 0;
});

restaurantSchema.virtual('longitude').get(function() {
  if (this.coordinates && this.coordinates.coordinates && this.coordinates.coordinates.length >= 2) {
    return this.coordinates.coordinates[0]; // GeoJSON format is [longitude, latitude]
  }
  return 0;
});

// Create geospatial index for location-based queries
restaurantSchema.index({ coordinates: '2dsphere' });
restaurantSchema.index({ city: 1, rating: -1 });
restaurantSchema.index({ cuisines: 1, avgPrice: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
