/**
 * Restaurant Controller
 * Handles restaurant queries and filtering
 * Supports both MongoDB and Mock Database
 */

const mockDB = require('../config/mockDB');
const mongoose = require('mongoose');
const { isRestaurantOpen } = require('../utils/timeUtils');

// Only load Mongoose models if MongoDB is being used
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
let Restaurant, Review;

if (!USE_MOCK_DB) {
  try {
    Restaurant = require('../models/Restaurant');
    Review = require('../models/Review');
  } catch (e) {
    Restaurant = null;
    Review = null;
  }
}

/**
 * Add open/closed status to restaurant objects
 * @param {Array|Object} restaurants - Restaurant(s) to add status to
 * @returns {Array|Object} Restaurant(s) with status added
 */
function addOpenStatus(restaurants) {
  const isArray = Array.isArray(restaurants);
  const restaurantArray = isArray ? restaurants : [restaurants];

  const updated = restaurantArray.map(restaurant => {
    const restObj = restaurant.toObject ? restaurant.toObject() : { ...restaurant };
    const status = isRestaurantOpen(restObj.operatingHours);
    return {
      ...restObj,
      isOpen: status.isOpen,
      statusText: status.statusText,
      nextStatus: status.nextStatus,
    };
  });

  return isArray ? updated : updated[0];
}

/**
 * Get all restaurants with filters
 * @route GET /api/restaurants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRestaurants = async (req, res) => {
  try {
    const {
      minRating = 0,
      sortBy = 'rating',
      search,
    } = req.query;

    let restaurants;

    if (Restaurant) {
      // MongoDB path
      let query = {};
      if (minRating) query.rating = { $gte: parseFloat(minRating) };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
        ];
      }
      restaurants = await Restaurant.find(query);
    } else {
      // Mock DB path - get all restaurants
      restaurants = mockDB.findRestaurants({});

      // Apply filters
      if (minRating) {
        restaurants = restaurants.filter(r => r.rating >= parseFloat(minRating));
      }

      if (search) {
        restaurants = restaurants.filter(r => {
          const searchLower = search.toLowerCase();
          const matchesName = r.name.toLowerCase().includes(searchLower);
          const matchesCuisine = (r.cuisines || []).some(c => c.toLowerCase().includes(searchLower)) || 
                                 (r.cuisine && r.cuisine.toLowerCase().includes(searchLower));
          const matchesLocation = (r.location && r.location.toLowerCase().includes(searchLower)) ||
                                  (r.city && r.city.toLowerCase().includes(searchLower)) ||
                                  (r.address && r.address.toLowerCase().includes(searchLower));
          return matchesName || matchesCuisine || matchesLocation;
        });
      }

      // Sort by rating descending
      if (sortBy === 'rating') {
        restaurants.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'name') {
        restaurants.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        restaurants.sort((a, b) => b.rating - a.rating);
      }
    }

    // Add open/closed status to each restaurant
    const restaurantsWithStatus = addOpenStatus(restaurants);

    res.status(200).json({
      success: true,
      count: restaurantsWithStatus.length,
      data: restaurantsWithStatus,
    });
  } catch (error) {
    console.error('Error in getRestaurants:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get restaurant details by ID
 * @route GET /api/restaurants/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let restaurant;
    if (Restaurant) {
      restaurant = await Restaurant.findById(id).populate({
        path: 'reviews',
        select: 'rating text userName createdAt',
        options: { limit: 10, sort: { createdAt: -1 } },
      });
    } else {
      // Try multiple ID formats for mock database
      restaurant = mockDB.findRestaurant({ _id: id });
      if (!restaurant) {
        restaurant = mockDB.findRestaurant({ id: id });
      }
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `Restaurant with ID ${id} not found`,
      });
    }

    // Add open/closed status
    const restaurantWithStatus = addOpenStatus(restaurant);

    res.status(200).json({
      success: true,
      data: restaurantWithStatus,
    });
  } catch (error) {
    console.error('Error in getRestaurantDetails:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Search restaurants
 * @route GET /api/restaurants/search
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchRestaurants = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    let restaurants;
    if (Restaurant) {
      restaurants = await Restaurant.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { cuisine: { $regex: q, $options: 'i' } },
        ],
      });
    } else {
      restaurants = mockDB.findRestaurants({});
      restaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(q.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: addOpenStatus(restaurants),
    });
  } catch (error) {
    console.error('Error in searchRestaurants:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get trending restaurants
 * @route GET /api/restaurants/trending
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTrendingRestaurants = async (req, res) => {
  try {
    let restaurants;
    if (Restaurant) {
      restaurants = await Restaurant.find().sort({ rating: -1 }).limit(10);
    } else {
      restaurants = mockDB.findRestaurants({}).sort((a, b) => b.rating - a.rating).slice(0, 10);
    }

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: addOpenStatus(restaurants),
    });
  } catch (error) {
    console.error('Error in getTrendingRestaurants:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create a new restaurant
 * @route POST /api/restaurants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      phone,
      email,
      website,
      address,
      city,
      thumbnail,
      latitude,
      longitude,
      avgPrice,
      cuisines,
    } = req.body;

    if (!name || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, address, and city are required',
      });
    }

    let restaurant;
    if (Restaurant) {
      // MongoDB path
      restaurant = new Restaurant({
        name,
        description,
        phone,
        email,
        website,
        address,
        city,
        thumbnail: thumbnail || '🍽️',
        coordinates: {
          type: 'Point',
          coordinates: [longitude || 79.0, latitude || 11.0],
        },
        avgPrice: avgPrice || 200,
        cuisines: cuisines || [],
        operatingHours: {
          monday: { open: '10:00', close: '22:00', closed: false },
          tuesday: { open: '10:00', close: '22:00', closed: false },
          wednesday: { open: '10:00', close: '22:00', closed: false },
          thursday: { open: '10:00', close: '22:00', closed: false },
          friday: { open: '10:00', close: '23:00', closed: false },
          saturday: { open: '10:00', close: '23:00', closed: false },
          sunday: { open: '11:00', close: '22:00', closed: false },
        },
      });
      await restaurant.save();
    } else {
      // Mock DB path
      restaurant = mockDB.createRestaurant({
        name,
        description,
        phone,
        email,
        website,
        address,
        city,
        thumbnail: thumbnail || '🍽️',
        latitude: latitude || 11.0,
        longitude: longitude || 79.0,
        avgPrice: avgPrice || 200,
        cuisines: cuisines || [],
      });
    }

    const restaurantWithStatus = addOpenStatus(restaurant);

    res.status(201).json({
      success: true,
      data: restaurantWithStatus,
      message: 'Restaurant created successfully',
    });
  } catch (error) {
    console.error('Error in createRestaurant:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update restaurant details
 * @route PUT /api/restaurants/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let restaurant;
    if (Restaurant) {
      restaurant = await Restaurant.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      restaurant = mockDB.updateRestaurant(id, updateData);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: 'Restaurant not found',
        });
      }
    }

    const restaurantWithStatus = addOpenStatus(restaurant);

    res.status(200).json({
      success: true,
      data: restaurantWithStatus,
      message: 'Restaurant updated successfully',
    });
  } catch (error) {
    console.error('Error in updateRestaurant:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
