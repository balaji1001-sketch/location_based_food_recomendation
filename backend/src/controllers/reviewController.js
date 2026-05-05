/**
 * Review Controller
 * Handles restaurant reviews and ratings
 */

const mockDB = require('../config/mockDB');
const axios = require('axios');

// Only load Mongoose models if MongoDB is being used
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
let Review, Restaurant, UserRating;

if (!USE_MOCK_DB) {
  try {
    Review = require('../models/Review');
    Restaurant = require('../models/Restaurant');
    UserRating = require('../models/UserRating');
  } catch (e) {
    Review = null;
    Restaurant = null;
    UserRating = null;
  }
}

/**
 * Submit a review
 * @route POST /api/restaurants/:id/reviews
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.submitReview = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { rating, text } = req.body;
    const userId = req.user._id;

    // Validation
    if (!rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Rating and review text are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Create review
    const review = await Review.create({
      restaurant: restaurantId,
      user: userId,
      rating,
      text,
      userName: req.user.name,
      userEmail: req.user.email,
    });

    // Call ML service for sentiment analysis (optional)
    try {
      const sentimentResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/sentiment-analysis`,
        { text }
      );

      review.sentiment = sentimentResponse.data.sentiment;
      review.sentimentScore = sentimentResponse.data.score;
      await review.save();
    } catch (error) {
      console.log('Sentiment analysis service unavailable');
    }

    // Save user rating for collaborative filtering
    await UserRating.findOneAndUpdate(
      { user: userId, restaurant: restaurantId },
      { rating, reviewId: review._id },
      { upsert: true }
    );

    // Update user's review count
    await require('../models/User').findByIdAndUpdate(userId, {
      $inc: { totalReviews: 1, totalRatings: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get reviews for a restaurant
 * @route GET /api/restaurants/:id/reviews
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getReviews = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { limit = 10, page = 1, sortBy = 'recent' } = req.query;

    // Sort options
    let sort = { createdAt: -1 };
    if (sortBy === 'helpful') {
      sort = { helpfulCount: -1 };
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ restaurant: restaurantId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'name');

    const totalCount = await Review.countDocuments({
      restaurant: restaurantId,
    });

    res.status(200).json({
      success: true,
      totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Mark review as helpful
 * @route POST /api/reviews/:id/helpful
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markHelpful = async (req, res) => {
  try {
    const { id: reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
