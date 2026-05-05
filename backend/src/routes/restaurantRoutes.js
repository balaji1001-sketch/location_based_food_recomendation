/**
 * Restaurant Routes
 * Restaurant search, filtering, and details endpoints
 */

const express = require('express');
const router = express.Router();
const { authenticateOptional } = require('../middleware/auth');
const {
  getRestaurants,
  getRestaurantDetails,
  searchRestaurants,
  getTrendingRestaurants,
  createRestaurant,
  updateRestaurant,
} = require('../controllers/restaurantController');

/**
 * @route GET /api/restaurants
 * @desc Get restaurants with filters and location-based search
 * @access Public
 */
router.get('/', authenticateOptional, getRestaurants);

/**
 * @route POST /api/restaurants
 * @desc Create a new restaurant
 * @access Private (admin)
 */
router.post('/', createRestaurant);

/**
 * @route GET /api/restaurants/search
 * @desc Search restaurants by name or cuisine
 * @access Public
 */
router.get('/search', searchRestaurants);

/**
 * @route GET /api/restaurants/trending
 * @desc Get trending restaurants
 * @access Public
 */
router.get('/trending', getTrendingRestaurants);

/**
 * @route GET /api/restaurants/:id
 * @desc Get restaurant details by ID
 * @access Public
 */
router.get('/:id', getRestaurantDetails);

/**
 * @route PUT /api/restaurants/:id
 * @desc Update restaurant details
 * @access Private (admin)
 */
router.put('/:id', updateRestaurant);

module.exports = router;
