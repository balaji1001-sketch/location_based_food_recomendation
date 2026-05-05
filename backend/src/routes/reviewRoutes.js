/**
 * Review Routes
 * Review submission and management endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  submitReview,
  getReviews,
  markHelpful,
} = require('../controllers/reviewController');

/**
 * @route POST /api/reviews/:restaurantId
 * @desc Submit a new review
 * @access Private
 */
router.post('/:restaurantId', authenticate, submitReview);

/**
 * @route GET /api/reviews/:restaurantId
 * @desc Get reviews for a restaurant
 * @access Public
 */
router.get('/:restaurantId', getReviews);

/**
 * @route POST /api/reviews/:id/helpful
 * @desc Mark a review as helpful
 * @access Private
 */
router.post('/:id/helpful', authenticate, markHelpful);

module.exports = router;
