/**
 * Recommendation Controller
 * Handles ML-based recommendations
 */

const mockDB = require('../config/mockDB');
const axios = require('axios');

// Only load Mongoose models if MongoDB is being used
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
let Restaurant, UserRating;

if (!USE_MOCK_DB) {
  try {
    Restaurant = require('../models/Restaurant');
    UserRating = require('../models/UserRating');
  } catch (e) {
    Restaurant = null;
    UserRating = null;
  }
}

/**
 * Get personalized recommendations
 * @route GET /api/recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    // Get user's preferences and rating history
    const userRatings = await UserRating.find({ user: userId }).populate(
      'restaurant'
    );

    const ratedRestaurantIds = userRatings.map((r) => r.restaurant._id);

    // Call ML service for recommendations
    try {
      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/recommendations`,
        {
          userId,
          userPreferences: req.user.preferences,
          ratedRestaurants: userRatings,
        }
      );

      const recommendedRestaurantIds = mlResponse.data.recommendations;

      // Fetch recommended restaurants
      const recommendations = await Restaurant.find({
        _id: { $in: recommendedRestaurantIds, $nin: ratedRestaurantIds },
      }).limit(parseInt(limit));

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      // Fallback to content-based recommendations
      console.log('ML service unavailable, using fallback recommendations');

      const fallbackRecommendations = await Restaurant.find({
        cuisines: { $in: req.user.preferences.cuisines || [] },
        _id: { $nin: ratedRestaurantIds },
      })
        .sort({ rating: -1 })
        .limit(parseInt(limit));

      res.status(200).json({
        success: true,
        data: fallbackRecommendations,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Rate a recommendation (for feedback)
 * @route POST /api/recommendations/rate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.rateRecommendation = async (req, res) => {
  try {
    const { restaurantId, rating } = req.body;
    const userId = req.user._id;

    // Save user rating
    const userRating = await UserRating.findOneAndUpdate(
      { user: userId, restaurant: restaurantId },
      { rating },
      { upsert: true, new: true }
    );

    // Update user's rating count
    await require('../models/User').findByIdAndUpdate(userId, {
      $inc: { totalRatings: 1 },
    });

    res.status(200).json({
      success: true,
      message: 'Recommendation rated successfully',
      data: userRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
