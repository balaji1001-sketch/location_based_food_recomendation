/**
 * Recommendation Routes
 * Personalized recommendation endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getRecommendations,
  rateRecommendation,
} = require('../controllers/recommendationController');

/**
 * @route GET /api/recommendations
 * @desc Get personalized recommendations
 * @access Private
 */
router.get('/', authenticate, getRecommendations);

/**
 * @route POST /api/recommendations/rate
 * @desc Rate a recommendation
 * @access Private
 */
router.post('/rate', authenticate, rateRecommendation);

module.exports = router;
