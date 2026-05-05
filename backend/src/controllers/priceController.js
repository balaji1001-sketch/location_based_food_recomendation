/**
 * Price Comparison Controller
 * Handles price comparisons and trends
 */

const mockDB = require('../config/mockDB');

// Only load Mongoose models if MongoDB is being used
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
let PriceTracking, Restaurant;

if (!USE_MOCK_DB) {
  try {
    PriceTracking = require('../models/PriceTracking');
    Restaurant = require('../models/Restaurant');
  } catch (e) {
    PriceTracking = null;
    Restaurant = null;
  }
}

/**
 * Get price comparison for a food item
 * @route GET /api/price-comparison
 * @query {string} foodItem - Name of food item to compare
 * @query {string} city - City to search in (optional)
 * @query {number} latitude - Latitude for nearby search (optional)
 * @query {number} longitude - Longitude for nearby search (optional)
 * @query {number} radius - Radius in km for nearby search (optional, default: 5)
 * @query {number} days - Number of days to include (default: 1 for latest)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPriceComparison = async (req, res) => {
  try {
    const { foodItem, city, latitude, longitude, radius = 5, days = 1 } = req.query;

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        message: 'Food item is required',
      });
    }

    // Use mock database function
    const restaurants = await mockDB.getAllRestaurants();

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No restaurants found',
      });
    }

    // Filter restaurants by city if provided
    let filtered = restaurants;
    if (city) {
      filtered = filtered.filter((r) =>
        (r.city || r.location || '').toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter restaurants by nearby location if coordinates provided
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusKm = parseFloat(radius);

      filtered = filtered.filter((r) => {
        if (!r.latitude || !r.longitude) return false;

        // Simple distance calculation (rough)
        const dlat = (r.latitude - lat) * 111; // 1 degree latitude ≈ 111 km
        const dlng = (r.longitude - lng) * 111 * Math.cos((lat * Math.PI) / 180);
        const distance = Math.sqrt(dlat * dlat + dlng * dlng);
        return distance <= radiusKm;
      });
    }

    if (filtered.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No restaurants found with criteria. Searched for: ${foodItem}${city ? ` in ${city}` : ''}`,
      });
    }

    // Find the food item in each restaurant's menu
    const priceData = filtered
      .map((restaurant) => {
        const menuItem = restaurant.menu?.find(
          (item) => item.name.toLowerCase().includes(foodItem.toLowerCase())
        );

        if (!menuItem) return null;

        return {
          restaurantId: restaurant._id,
          restaurant: restaurant.name,
          price: menuItem.price,
          rating: restaurant.rating,
          distance: restaurant.distance || 0,
          address: restaurant.address,
          city: restaurant.city,
          delivery: restaurant.deliveryAvailable,
          thumbnail: restaurant.thumbnail,
          menuItem: menuItem.name,
          cuisine: Array.isArray(restaurant.cuisines)
            ? restaurant.cuisines.join(', ')
            : restaurant.cuisines,
        };
      })
      .filter((item) => item !== null) // Remove restaurants without the food item
      .sort((a, b) => a.price - b.price); // Sort by price

    if (priceData.length === 0) {
      return res.status(404).json({
        success: false,
        message: `"${foodItem}" not found in any restaurants${city ? ` in ${city}` : ''}`,
      });
    }

    // Calculate statistics
    const prices = priceData.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b) / prices.length;

    // Best value (highest rated at lowest price)
    const bestValue = priceData.reduce((best, current) => {
      const currentScore = current.rating / (current.price || 1);
      const bestScore = best.rating / (best.price || 1);
      return currentScore > bestScore ? current : best;
    });

    res.status(200).json({
      success: true,
      foodItem,
      filters: {
        city: city || 'All',
        nearby: latitude && longitude ? `${radius}km radius` : 'No',
      },
      statistics: {
        minPrice,
        maxPrice,
        avgPrice: parseFloat(avgPrice.toFixed(2)),
        restaurantCount: priceData.length,
      },
      bestValue: {
        restaurant: bestValue.restaurant,
        price: bestValue.price,
        rating: bestValue.rating,
      },
      comparison: priceData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get price trends for a food item
 * @route GET /api/price-trends
 * @query {string} foodItem - Name of food item
 * @query {number} days - Number of days to fetch (default: 30)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPriceTrends = async (req, res) => {
  try {
    const { foodItem, days = 30 } = req.query;

    if (!foodItem) {
      return res.status(400).json({
        success: false,
        message: 'Food item is required',
      });
    }

    if (USE_MOCK_DB) {
      // Use mock database for trends
      const restaurants = await mockDB.getAllRestaurants();
      
      // Generate mock trend data
      const trends = [];
      const daysNum = parseInt(days);
      
      for (let i = daysNum; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const prices = restaurants
          .flatMap((r) => r.menu || [])
          .filter((item) => item.name.toLowerCase().includes(foodItem.toLowerCase()))
          .map((item) => item.price);
        
        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b) / prices.length;
          trends.push({
            _id: { date: dateStr },
            avgPrice: parseFloat(avgPrice.toFixed(2)),
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            count: prices.length,
          });
        }
      }

      return res.status(200).json({
        success: true,
        foodItem,
        days: daysNum,
        trends,
      });
    }

    // Original Mongoose code for MongoDB
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await PriceTracking.aggregate([
      {
        $match: {
          foodItem: foodItem.toLowerCase(),
          recordedAt: { $gte: startDate, $lte: endDate },
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' },
            },
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      foodItem,
      days: parseInt(days),
      trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Record price data
 * @route POST /api/price-tracking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.recordPrice = async (req, res) => {
  try {
    const {
      foodItem,
      restaurant,
      restaurantName,
      price,
      originalPrice,
      discount,
      category,
      description,
    } = req.body;

    if (USE_MOCK_DB) {
      // For mock DB, just return success with mock data
      const priceRecord = {
        _id: new Date().getTime(),
        foodItem: foodItem.toLowerCase(),
        restaurant,
        restaurantName,
        price,
        originalPrice,
        discount,
        category,
        description,
        recordedAt: new Date(),
      };

      return res.status(201).json({
        success: true,
        message: 'Price recorded successfully (mock)',
        data: priceRecord,
      });
    }

    // Original Mongoose code for MongoDB
    const priceRecord = await PriceTracking.create({
      foodItem: foodItem.toLowerCase(),
      restaurant,
      restaurantName,
      price,
      originalPrice,
      discount,
      category,
      description,
      recordedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Price recorded successfully',
      data: priceRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
