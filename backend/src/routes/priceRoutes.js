/**
 * Price Comparison Routes
 * Price comparison and trend endpoints
 */

const express = require('express');
const router = express.Router();
const {
  getPriceComparison,
  getPriceTrends,
  recordPrice,
} = require('../controllers/priceController');

/**
 * @route GET /api/price-comparison
 * @desc Get price comparison for a food item
 * @access Public
 */
router.get('/', getPriceComparison);

/**
 * @route GET /api/price-trends
 * @desc Get price trends for a food item
 * @access Public
 */
router.get('/trends', getPriceTrends);

/**
 * @route POST /api/price-tracking
 * @desc Record price data (internal endpoint)
 * @access Private
 */
router.post('/', recordPrice);

module.exports = router;
