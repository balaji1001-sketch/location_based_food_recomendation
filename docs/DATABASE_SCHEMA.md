# Database Schema Documentation

## Collections Overview

### 1. Users Collection
Stores user account and preference information

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  preferences: {
    cuisines: [String],
    dietaryRestrictions: [String],
    budgetRange: String ('low' | 'medium' | 'high'),
    radius: Number (default: 5 km)
  },
  totalRatings: Number,
  totalReviews: Number,
  favoriteRestaurants: [ObjectId],
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2. Restaurants Collection
Stores restaurant information with geospatial indexing

```javascript
{
  _id: ObjectId,
  name: String (indexed),
  description: String,
  image: String,
  email: String,
  phone: String,
  website: String,
  address: String,
  city: String (indexed),
  coordinates: {
    type: 'Point',
    coordinates: [longitude, latitude] // GeoJSON format
  },
  cuisines: [String] (indexed),
  timing: String,
  deliveryAvailable: Boolean,
  diningOptions: [String],
  avgPrice: Number,
  priceRange: String,
  rating: Number (indexed, 0-5),
  reviewCount: Number,
  ratingDistribution: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  isVerified: Boolean,
  isPopular: Boolean,
  isNew: Boolean,
  menu: [
    {
      name: String,
      price: Number,
      category: String,
      description: String
    }
  ],
  reviews: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- coordinates (2dsphere) - for location-based queries
- city + rating - for city-wise sorting
- cuisines + avgPrice - for cuisine and price filtering

---

### 3. Reviews Collection
Stores user reviews and ratings

```javascript
{
  _id: ObjectId,
  text: String,
  rating: Number (1-5),
  restaurant: ObjectId (ref: Restaurant),
  user: ObjectId (ref: User),
  userName: String,
  userEmail: String,
  helpfulCount: Number,
  sentiment: String ('positive' | 'neutral' | 'negative'),
  sentimentScore: Number,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

---

### 4. UserRatings Collection
Stores user ratings for collaborative filtering

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  restaurant: ObjectId (ref: Restaurant),
  rating: Number (1-5),
  reviewId: ObjectId,
  visitDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Index:** user + restaurant

---

### 5. PriceTracking Collection
Tracks price history for food items

```javascript
{
  _id: ObjectId,
  foodItem: String (indexed, lowercase),
  restaurant: ObjectId (ref: Restaurant),
  restaurantName: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: String,
  description: String,
  isAvailable: Boolean,
  recordedAt: Date (indexed),
  expiryDate: Date
}
```

**Indexes:**
- foodItem + restaurant + recordedAt
- foodItem + recordedAt

---

## Geospatial Queries

### Find restaurants within radius
```javascript
db.restaurants.find({
  coordinates: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // [longitude, latitude]
      },
      $maxDistance: 5000 // 5 km in meters
    }
  }
})
```

### Aggregate by cuisine and price
```javascript
db.restaurants.aggregate([
  {
    $match: {
      cuisines: { $in: ['North Indian'] },
      avgPrice: { $gte: 200, $lte: 500 },
      city: 'Delhi'
    }
  },
  {
    $sort: { rating: -1 }
  }
])
```

---

## Sample Queries

### 1. Get top-rated restaurants
```javascript
db.restaurants.find({})
  .sort({ rating: -1 })
  .limit(10)
```

### 2. Get trending restaurants
```javascript
db.restaurants.find({
  isPopular: true,
  rating: { $gte: 4.0 }
})
.sort({ createdAt: -1 })
```

### 3. Get restaurants by user preferences
```javascript
db.restaurants.find({
  cuisines: { $in: ['North Indian', 'Chinese'] },
  avgPrice: { $lte: 500 },
  city: 'Delhi'
})
```

### 4. Get review sentiment analysis
```javascript
db.reviews.aggregate([
  {
    $match: { restaurant: ObjectId('...') }
  },
  {
    $group: {
      _id: '$sentiment',
      count: { $sum: 1 }
    }
  }
])
```

### 5. Price trend analysis
```javascript
db.pricetracking.aggregate([
  {
    $match: {
      foodItem: 'butter chicken',
      recordedAt: { $gte: new Date(ISODate('2024-02-25')) }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$recordedAt' } },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' }
    }
  },
  {
    $sort: { '_id': 1 }
  }
])
```
