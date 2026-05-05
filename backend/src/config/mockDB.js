/**
 * Mock Database Module
 * Provides in-memory mock data for development without MongoDB
 * Loads Trichy restaurants from CSV file
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate default operating hours for a restaurant
 * Most restaurants open 10 AM - 10 PM, some open 11 AM on Sundays
 */
function generateDefaultOperatingHours() {
  return {
    monday: { open: '10:00', close: '22:00', closed: false },
    tuesday: { open: '10:00', close: '22:00', closed: false },
    wednesday: { open: '10:00', close: '22:00', closed: false },
    thursday: { open: '10:00', close: '22:00', closed: false },
    friday: { open: '10:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '11:00', close: '22:00', closed: false },
  };
}

/**
 * Generate operating hours for small shops that close at 4:00 PM
 */
function generateSmallShopHours() {
  return {
    monday: { open: '09:00', close: '16:00', closed: false },
    tuesday: { open: '09:00', close: '16:00', closed: false },
    wednesday: { open: '09:00', close: '16:00', closed: false },
    thursday: { open: '09:00', close: '16:00', closed: false },
    friday: { open: '09:00', close: '16:00', closed: false },
    saturday: { open: '09:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '16:00', closed: false },
  };
}

/**
 * Generate 24-hour operating hours for big restaurants
 */
function generate24HourHours() {
  return {
    monday: { open: '00:00', close: '23:59', closed: false },
    tuesday: { open: '00:00', close: '23:59', closed: false },
    wednesday: { open: '00:00', close: '23:59', closed: false },
    thursday: { open: '00:00', close: '23:59', closed: false },
    friday: { open: '00:00', close: '23:59', closed: false },
    saturday: { open: '00:00', close: '23:59', closed: false },
    sunday: { open: '00:00', close: '23:59', closed: false },
  };
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Generate menu items for Tamil Nadu restaurants
 * Prices vary based on restaurant's avgPrice (premium/budget restaurants have different prices)
 */
function generateMenuItems(cuisine, avgPrice, restaurantName = '') {
  // Base prices for reference (baseline average price point = 200)
  const baselinePrice = 200;
  // Calculate price multiplier: restaurants with higher avgPrice charge more
  const priceMultiplier = Math.max(0.6, Math.min(1.8, avgPrice / baselinePrice));
  
  // Add unique variance based on restaurant name hash for additional differentiation
  // This ensures restaurants with same avgPrice still have slightly different prices
  let nameHash = 0;
  for (let i = 0; i < restaurantName.length; i++) {
    nameHash = ((nameHash << 5) - nameHash) + restaurantName.charCodeAt(i);
    nameHash = nameHash & nameHash; // Convert to 32bit integer
  }
  // Convert hash to variance between 0.95 and 1.05 (±5%)
  const nameVariance = 0.95 + Math.abs(nameHash % 100) / 1000;
  
  const menuTemplates = {
    'South Indian': [
      { name: 'Idli', basePrice: 40 },
      { name: 'Dosa', basePrice: 60 },
      { name: 'Poori & Sambar', basePrice: 50 },
      { name: 'Vada', basePrice: 35 },
      { name: 'Uttapam', basePrice: 70 },
      { name: 'Medhu Vada', basePrice: 45 },
    ],
    'Biryani': [
      { name: 'Veg Biryani', basePrice: 150 },
      { name: 'Chicken Biryani', basePrice: 200 },
      { name: 'Mutton Biryani', basePrice: 250 },
      { name: 'Prawns Biryani', basePrice: 280 },
    ],
    'Chettinad Cuisine': [
      { name: 'Chettinad Chicken', basePrice: 280 },
      { name: 'Chettinad Mutton', basePrice: 320 },
      { name: 'Chettinad Fish', basePrice: 300 },
      { name: 'Egg Curry', basePrice: 120 },
    ],
    'Multi-Cuisine': [
      { name: 'Idli', basePrice: 40 },
      { name: 'Dosa', basePrice: 60 },
      { name: 'Chicken Biryani', basePrice: 200 },
      { name: 'Mutton Curry', basePrice: 220 },
      { name: 'Dal Makhani', basePrice: 150 },
      { name: 'Butter Chicken', basePrice: 200 },
    ],
    'default': [
      { name: 'Idli (2pcs)', basePrice: 40 },
      { name: 'Dosa', basePrice: 60 },
      { name: 'Sambar Rice', basePrice: 80 },
      { name: 'Rasam Rice', basePrice: 80 },
      { name: 'Filter Coffee', basePrice: 20 },
    ],
  };

  const template = menuTemplates[cuisine] || menuTemplates['default'];
  return template.map((item, idx) => ({
    _id: `menu_${idx}`,
    name: item.name,
    // Apply price multiplier based on restaurant's avgPrice + unique name variance
    price: Math.round(item.basePrice * priceMultiplier * nameVariance),
    category: 'Main Course',
    description: `Authentic ${cuisine} ${item.name}`,
  }));
}

// Load Trichy restaurants from CSV
function loadRestaurantsFromCSV() {
  try {
    const csvPath = path.join(__dirname, '../../../data/tamil_nadu_restaurants_complete.csv');
    if (!fs.existsSync(csvPath)) {
      console.warn('⚠️  Tamil Nadu restaurants CSV not found at:', csvPath);
      return getSampleRestaurants();
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(1).filter(line => line.trim());
    
    const restaurants = lines.map((line, idx) => {
      const fields = parseCSVLine(line);
      const [id, name, cuisine, rating, location, address, phone, priceRange, vegetarian, latitude, longitude, avgPrice, timing, deliveryAvailable, thumbnail] = fields;
      
      const lat = parseFloat(latitude) || 11.0;
      const lng = parseFloat(longitude) || 79.0;
      const avgPriceNum = parseInt(avgPrice) || 200;
      
      // Determine operating hours based on location and restaurant type
      let operatingHours = generateDefaultOperatingHours();
      
      // Mandayur restaurants close at 4:00 PM
      if (location === 'Mandayur') {
        operatingHours = generateSmallShopHours();
      }
      // Big restaurants in Cantonment area work 24 hours
      else if (location === 'Cantonment' && (name.toLowerCase().includes('palace') || name.toLowerCase().includes('hotel') || name.toLowerCase().includes('saravana'))) {
        operatingHours = generate24HourHours();
      }
      
      return {
        _id: id || String(idx + 1),
        name: name || 'Restaurant',
        cuisines: [cuisine] || ['Multi-Cuisine'],
        rating: parseFloat(rating) || 4.0,
        city: location || 'Tamil Nadu',
        address: address || 'Tamil Nadu',
        phone: phone || '+91-0000-000000',
        priceRange: priceRange === '₹' ? 'low' : priceRange === '₹₹' ? 'medium' : 'high',
        vegetarian: vegetarian === 'Yes',
        // GeoJSON format for location: [longitude, latitude]
        coordinates: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        // Legacy fields for compatibility
        latitude: lat,
        longitude: lng,
        location: location || 'Tamil Nadu',
        avgPrice: avgPriceNum,
        timing: timing || '8AM-10PM',
        operatingHours: operatingHours,
        deliveryAvailable: deliveryAvailable === 'Yes',
        thumbnail: thumbnail || '🍽️',
        image: thumbnail, // Use thumbnail as image for now
        banner: thumbnail,
        reviewCount: 0,
        isVerified: true,
        isPopular: false,
        isNew: false,
        reviews: [],
        menu: generateMenuItems(cuisine, avgPriceNum, name), // Generate menu items with restaurant name for variance
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        createdAt: new Date(),
      };
    });

    console.log(`✅ Loaded ${restaurants.length} Tamil Nadu restaurants with location & thumbnail data`);
    return restaurants;
  } catch (error) {
    console.error('❌ Error loading CSV:', error.message);
    return getSampleRestaurants();
  }
}

function getSampleRestaurants() {
  return [
    {
      _id: '1',
      name: 'Pizza Palace',
      cuisines: ['Italian'],
      rating: 4.5,
      city: 'Downtown',
      location: 'Downtown',
      address: '123 Main St',
      phone: '555-0100',
      priceRange: 'medium',
      vegetarian: false,
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522] // Los Angeles
      },
      latitude: 34.0522,
      longitude: -118.2437,
      avgPrice: 400,
      timing: '24 Hours',
      operatingHours: generate24HourHours(),
      deliveryAvailable: true,
      thumbnail: '🍕',
      image: '🍕',
      banner: '🍕',
      reviewCount: 0,
      isVerified: true,
      isPopular: true,
      isNew: false,
      reviews: [],
      menu: generateMenuItems('Multi-Cuisine', 400, 'Pizza Palace'),
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'Burger House',
      cuisines: ['American'],
      rating: 4.2,
      city: 'Midtown',
      location: 'Midtown',
      address: '456 Oak Ave',
      phone: '555-0200',
      priceRange: 'medium',
      vegetarian: false,
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0622]
      },
      latitude: 34.0622,
      longitude: -118.2437,
      avgPrice: 350,
      timing: '11AM-10PM',
      operatingHours: generateDefaultOperatingHours(),
      deliveryAvailable: true,
      thumbnail: '🍔',
      image: '🍔',
      banner: '🍔',
      reviewCount: 0,
      isVerified: true,
      isPopular: false,
      isNew: false,
      reviews: [],
      menu: generateMenuItems('Multi-Cuisine', 350, 'Burger House'),
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      createdAt: new Date(),
    },
    {
      _id: '3',
      name: 'Sushi Garden',
      cuisines: ['Japanese'],
      rating: 4.8,
      city: 'Downtown',
      location: 'Downtown',
      address: '789 Pine Rd',
      phone: '555-0300',
      priceRange: 'high',
      vegetarian: false,
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0422]
      },
      latitude: 34.0422,
      longitude: -118.2437,
      avgPrice: 600,
      timing: '24 Hours',
      operatingHours: generate24HourHours(),
      deliveryAvailable: false,
      thumbnail: '🍣',
      image: '🍣',
      banner: '🍣',
      reviewCount: 0,
      isVerified: true,
      isPopular: true,
      isNew: true,
      reviews: [],
      menu: generateMenuItems('Multi-Cuisine', 600, 'Sushi Garden'),
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      createdAt: new Date(),
    },
  ];
}

const mockData = {
  users: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      preferences: {
        cuisines: [],
        dietaryRestrictions: [],
        budgetRange: 'medium',
      },
      createdAt: new Date(),
    },
    {
      _id: '2',
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      preferences: {
        cuisines: [],
        dietaryRestrictions: [],
        budgetRange: 'medium',
      },
      createdAt: new Date(),
    },
  ],
  restaurants: loadRestaurantsFromCSV(),
  prices: [
    {
      _id: '1',
      restaurantId: '1',
      itemName: 'Dosa (Plain)',
      price: 40,
      date: new Date(),
      source: 'menu',
    },
    {
      _id: '2',
      restaurantId: '1',
      itemName: 'Idli Sambar (2 pieces)',
      price: 30,
      date: new Date(),
      source: 'menu',
    },
    {
      _id: '3',
      restaurantId: '2',
      itemName: 'Masala Dosa',
      price: 50,
      date: new Date(),
      source: 'menu',
    },
    {
      _id: '4',
      restaurantId: '4',
      itemName: 'Biryani (Non-Veg)',
      price: 180,
      date: new Date(),
      source: 'menu',
    },
    {
      _id: '5',
      restaurantId: '4',
      itemName: 'Biryani (Veg)',
      price: 150,
      date: new Date(),
      source: 'menu',
    },
    {
      _id: '6',
      restaurantId: '5',
      itemName: 'Idli (4 pieces)',
      price: 35,
      date: new Date(),
      source: 'menu',
    },
  ],
  reviews: [
    {
      _id: '1',
      restaurantId: '1',
      userId: '1',
      rating: 5,
      comment: 'Amazing pizza!',
      createdAt: new Date(),
    },
  ],
};

class MockDB {
  constructor() {
    this.data = JSON.parse(JSON.stringify(mockData));
  }

  // User operations
  findUser(query) {
    return this.data.users.find(u =>
      Object.entries(query).every(([key, val]) => u[key] === val)
    );
  }

  createUser(userData) {
    const user = { _id: String(this.data.users.length + 1), ...userData };
    this.data.users.push(user);
    return user;
  }

  // Restaurant operations
  getAllRestaurants() {
    return this.data.restaurants;
  }

  findRestaurant(query) {
    return this.data.restaurants.find(r => {
      // Special handling for _id lookups - try multiple ID formats
      if (query._id) {
        const idMatch = String(r._id) === String(query._id) || 
                       String(r.id) === String(query._id) ||
                       parseInt(r._id) === parseInt(query._id) ||
                       parseInt(r.id) === parseInt(query._id);
        if (!idMatch) return false;
      }
      
      // Check other query parameters
      return Object.entries(query).every(([key, val]) => {
        if (key === '_id') return true; // Already checked above
        if (key === 'name') return r.name.toLowerCase().includes(val.toLowerCase());
        return r[key] === val;
      });
    });
  }

  findRestaurants(query = {}) {
    return this.data.restaurants.filter(r => {
      // Special handling for _id lookups - try multiple ID formats
      if (query._id) {
        const idMatch = String(r._id) === String(query._id) || 
                       String(r.id) === String(query._id) ||
                       parseInt(r._id) === parseInt(query._id) ||
                       parseInt(r.id) === parseInt(query._id);
        if (!idMatch) return false;
      }
      
      // Check other query parameters
      return Object.entries(query).every(([key, val]) => {
        if (key === '_id') return true; // Already checked above
        if (key === 'name') return r.name.toLowerCase().includes(val.toLowerCase());
        return r[key] === val;
      });
    });
  }

  createRestaurant(data) {
    const restaurant = {
      _id: String(this.data.restaurants.length + 1),
      ...data,
      createdAt: new Date(),
    };
    this.data.restaurants.push(restaurant);
    return restaurant;
  }

  updateRestaurant(id, updateData) {
    const index = this.data.restaurants.findIndex(r => String(r._id) === String(id) || String(r.id) === String(id));
    if (index === -1) {
      return null;
    }
    
    const updated = {
      ...this.data.restaurants[index],
      ...updateData,
      updatedAt: new Date(),
    };
    
    this.data.restaurants[index] = updated;
    return updated;
  }

  // Price operations
  findPrices(query = {}) {
    return this.data.prices.filter(p =>
      Object.entries(query).every(([key, val]) => p[key] === val)
    );
  }

  createPrice(data) {
    const price = {
      _id: String(this.data.prices.length + 1),
      date: new Date(),
      ...data,
    };
    this.data.prices.push(price);
    return price;
  }

  // Review operations
  findReviews(query = {}) {
    return this.data.reviews.filter(r =>
      Object.entries(query).every(([key, val]) => r[key] === val)
    );
  }

  createReview(data) {
    const review = {
      _id: String(this.data.reviews.length + 1),
      createdAt: new Date(),
      ...data,
    };
    this.data.reviews.push(review);
    return review;
  }

  // Get stats
  getStats() {
    return {
      totalUsers: this.data.users.length,
      totalRestaurants: this.data.restaurants.length,
      totalPrices: this.data.prices.length,
      totalReviews: this.data.reviews.length,
    };
  }
}

module.exports = new MockDB();
