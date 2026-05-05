# Backend Service README

## Overview

Node.js + Express.js backend API for the Food Recommendation System. Provides REST endpoints for authentication, restaurant management, reviews, recommendations, and price comparison.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB 4.4+
- Redis 6.0+

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/food-recommendation
# JWT_SECRET=your_secret_key
# PORT=5000

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── server.js              # Express server entry point
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── redis.js           # Redis cache setup
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Restaurant.js      # Restaurant schema
│   │   ├── Review.js          # Review schema
│   │   ├── UserRating.js      # Rating schema
│   │   └── PriceTracking.js   # Price history
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   ├── reviewController.js
│   │   ├── recommendationController.js
│   │   └── priceController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── priceRoutes.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Input validation
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── package.json
├── .env.example
└── .gitignore
```

---

## 🛠️ Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/food-recommendation

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_very_secret_key_change_this
JWT_EXPIRE=7d

# External Services
ML_SERVICE_URL=http://localhost:5001

# Logging
LOG_LEVEL=debug
```

---

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protected)
PUT    /api/auth/profile (protected)
```

### Restaurants

```
GET    /api/restaurants (with filters)
GET    /api/restaurants/:id
GET    /api/restaurants/search
GET    /api/restaurants/trending
```

### Reviews

```
POST   /api/reviews/:restaurantId (protected)
GET    /api/reviews/:restaurantId
POST   /api/reviews/:id/helpful
```

### Recommendations

```
GET    /api/recommendations (protected)
POST   /api/recommendations/rate (protected)
```

### Price Comparison

```
GET    /api/price-comparison
GET    /api/price-trends
POST   /api/price-tracking
```

**See [docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) for detailed endpoint documentation.**

---

## 🔐 Authentication

### JWT Token Flow

1. User registers or logs in
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token (localStorage/sessionStorage)
5. Token sent with each request in `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```

### Protected Routes

Routes with `(protected)` require valid JWT token in Authorization header.

### Token Expiration

Default: 7 days (configured in `.env` as `JWT_EXPIRE`)

---

## 💾 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  preferences: {
    cuisines: [String],
    budgetRange: String,
    dietaryRestrictions: [String]
  },
  totalRatings: Number,
  totalReviews: Number,
  favoriteRestaurants: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurant Schema
```javascript
{
  name: String,
  description: String,
  address: String,
  city: String,
  coordinates: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  cuisines: [String],
  avgPrice: Number,
  rating: Number,
  reviewCount: Number,
  menu: [{name, price, category}],
  createdAt: Date,
  updatedAt: Date
}
```

**See [docs/DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md) for complete schema documentation.**

---

## 🔍 Geospatial Queries

### Find Restaurants Near User

```javascript
const restaurants = await Restaurant.find({
  coordinates: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
      },
      $maxDistance: 5000  // 5 km
    }
  }
});
```

### Requires Index

```javascript
db.restaurants.createIndex({ coordinates: '2dsphere' })
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 🐛 Debugging

### View Logs

```bash
# All logs
tail -f logs/combined.log

# Errors only
tail -f logs/error.log
```

### Debug Mode

```bash
# Start with inspector
node --inspect src/server.js

# Visit chrome://inspect in Chrome
```

### MongoDB Queries

```bash
# Open MongoDB shell
mongo

# Connect to database
use food-recommendation

# Query restaurants
db.restaurants.find().limit(5)

# Analyze query
db.restaurants.find({}).explain("executionStats")
```

---

## 📊 Performance Tips

1. **Database Indexes**
   - Geospatial index on coordinates
   - Compound indexes for common filters
   - Text indexes for search

2. **Caching**
   - Use Redis for frequently accessed data
   - Cache recommendation results
   - Cache user session data

3. **Query Optimization**
   - Use pagination
   - Lean queries when projections work
   - Use aggregation pipeline for complex queries

4. **Connection Pooling**
   - MongoDB: maxPoolSize: 10 (default)
   - Redis: Connection pooling enabled

---

## 🚨 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔗 Integration with ML Service

### Sentiment Analysis

When a review is submitted:
1. Review saved to MongoDB
2. Backend calls ML Service
3. Sentiment analyzed
4. Review updated with sentiment score

```javascript
const mlResponse = await axios.post(
  `${process.env.ML_SERVICE_URL}/sentiment-analysis`,
  { text: review.text }
);
```

### Recommendations

When user requests recommendations:
1. Backend fetches user data
2. Calls ML Service with user info
3. ML returns personalized recommendations
4. Backend fetches restaurant details
5. Returns to frontend

---

## 🔗 Integration with Scraper

Scraper sends data via API:

```javascript
// Scraper calls
POST /api/restaurants
  {
    name: "Restaurant Name",
    cuisines: ["North Indian"],
    avgPrice: 350,
    address: "...",
    coordinates: [77.2090, 28.6139],
    menu: [...]
  }
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Stateless API design
- Separate database layer
- Redis for session management
- Load balancer (Nginx/HAProxy)

### Database Scaling
- MongoDB sharding
- Replica sets for high availability
- Read replicas for reporting

### Caching Strategy
- Cache hot data in Redis
- Implement cache invalidation
- Use TTL for automatic expiration

---

## 🚀 Deployment

### Production Setup

```bash
# Install production dependencies
npm ci --production

# Build (if applicable)
npm run build

# Start with process manager
pm2 start src/server.js

# Or with Docker
docker build -t food-api .
docker run -p 5000:5000 food-api
```

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/food
REDIS_URL=redis://redis-host:6379
JWT_SECRET=<very-strong-random-key>
ML_SERVICE_URL=http://ml-service:5001
```

---

## 🔐 Security Checklist

- [ ] JWT secret is strong
- [ ] CORS configured correctly
- [ ] HTTPS enabled in production
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] Error messages don't expose sensitive info
- [ ] Database credentials in environment variables
- [ ] Helmet security headers enabled
- [ ] Password hashing implemented
- [ ] Database backups automated

---

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Redis Documentation](https://redis.io/docs/)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## 📞 Support

For issues:
1. Check [docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md)
2. Review error logs
3. Check [docs/SETUP_GUIDE.md](../docs/SETUP_GUIDE.md) troubleshooting
4. Contact development team

---

**Last Updated:** 2024
**Version:** 1.0.0
