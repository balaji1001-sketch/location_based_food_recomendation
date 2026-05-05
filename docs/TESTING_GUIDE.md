# Testing & Debugging Guide

## Testing Strategy

### Frontend Testing

#### 1. Unit Tests (Jest + React Testing Library)
```bash
cd frontend
npm test
```

**Example Test:**
```javascript
import { render, screen } from '@testing-library/react';
import RestaurantCard from './RestaurantCard';

describe('RestaurantCard', () => {
  it('displays restaurant name', () => {
    const restaurant = {
      _id: '123',
      name: 'Taj Express',
      rating: 4.5,
      avgPrice: 350,
      cuisines: ['North Indian']
    };
    
    render(<RestaurantCard restaurant={restaurant} />);
    expect(screen.getByText('Taj Express')).toBeInTheDocument();
  });
});
```

#### 2. Integration Tests
```bash
npm test -- --testPathPattern=integration
```

**Test Scenarios:**
- Login flow
- Restaurant search with filters
- Recommendation generation
- Price comparison

#### 3. E2E Tests (Cypress)
```bash
npm run cypress:open
```

### Backend Testing

#### 1. Unit Tests (Jest)
```bash
cd backend
npm test
```

#### 2. API Tests (Postman/Insomnia)

**Import collection from:** `backend/postman/collection.json`

**Test Scenarios:**
- User registration with validation
- JWT token authentication
- Location-based queries
- Error handling

#### 3. Integration Tests
```bash
npm test -- --testEnvironment=mongodb
```

### ML Service Testing

#### 1. Sentiment Analysis Tests
```bash
cd ml_service
python -m pytest tests/test_sentiment.py
```

**Test Cases:**
```python
def test_positive_sentiment():
    text = "Great food and amazing service!"
    result = analyzer.analyze_sentiment(text)
    assert result['sentiment'] == 'positive'
    assert result['score'] > 0.5

def test_negative_sentiment():
    text = "Terrible food, horrible service"
    result = analyzer.analyze_sentiment(text)
    assert result['sentiment'] == 'negative'
    assert result['score'] < -0.5
```

#### 2. Recommendation Tests
```bash
python -m pytest tests/test_recommendations.py
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module" Error

**Symptom:**
```
Error: Cannot find module 'express'
```

**Solutions:**
```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
npm install
```

---

### Issue 2: MongoDB Connection Timeout

**Symptom:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Troubleshooting:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Or with Docker
docker run -d -p 27017:27017 mongo

# Test connection
mongo mongodb://localhost:27017
```

---

### Issue 3: JWT Token Invalid

**Symptom:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Solutions:**
1. Check token expiration in `.env`:
   ```
   JWT_EXPIRE=7d  # Increase if needed
   ```

2. Verify token format in request header:
   ```
   Authorization: Bearer <token>
   ```

3. Check JWT_SECRET is consistent across requests

---

### Issue 4: CORS Error

**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix in backend:**
```javascript
// In server.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true
}));
```

---

### Issue 5: Redux State Not Updating

**Symptom:**
```
Component not re-rendering after API call
```

**Debug Steps:**
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. Check action dispatched
4. Check reducer received action
5. Check state updated correctly

**Example Fix:**
```javascript
// Action
export const fetchRestaurants = (filters) => async (dispatch) => {
  dispatch({ type: 'FETCH_START' });
  try {
    const response = await api.get('/restaurants', { params: filters });
    dispatch({
      type: 'FETCH_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error });
  }
};
```

---

## Debugging Techniques

### 1. Frontend Debugging

**Using React Developer Tools:**
```javascript
// Add breakpoint in component
function RestaurantCard({ restaurant }) {
  console.log('Restaurant:', restaurant);
  debugger;  // Execution pauses here
  return (
    <div>...</div>
  );
}
```

**Redux DevTools:**
- See all actions dispatched
- Time-travel through actions
- Check state at each step

**Network Tab:**
- Monitor API requests
- Check request/response headers
- Verify payload format

### 2. Backend Debugging

**Using Node Inspector:**
```bash
node --inspect server.js
# Visit chrome://inspect in Chrome
```

**Console Logging:**
```javascript
console.log('User:', user);
console.error('Error:', error);
console.warn('Warning:', message);
```

**Request/Response Logging Middleware:**
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
```

### 3. Database Debugging

**MongoDB Compass:**
- Visual interface for MongoDB
- Query builder
- Data browser
- Performance analysis

**Queries in MongoDB Shell:**
```javascript
// Connect
mongo mongodb://localhost:27017/food-recommendation

// Check collections
show collections

// Query restaurants
db.restaurants.find().limit(5)

// Aggregation pipeline
db.restaurants.aggregate([
  { $match: { rating: { $gte: 4.0 } } },
  { $sort: { rating: -1 } },
  { $limit: 10 }
])
```

---

## Performance Testing

### 1. Load Testing (Apache JMeter)

**Test Configuration:**
```
Threads: 100 users
Ramp-up: 10 seconds
Loop count: 10
```

**Test Plan:**
- GET /api/restaurants (location filter)
- GET /api/recommendations
- POST /api/reviews/:id

### 2. Database Query Performance

```javascript
// Add indexes
db.restaurants.createIndex({ coordinates: "2dsphere" })
db.restaurants.createIndex({ rating: -1 })

// Analyze query
db.restaurants.find({}).explain("executionStats")
```

### 3. Frontend Performance

**Using Chrome DevTools:**
1. Open DevTools → Performance tab
2. Record user interactions
3. Analyze:
   - First contentful paint
   - Time to interactive
   - JavaScript execution time
   - Rendering time

---

## Error Handling Best Practices

### Frontend
```javascript
try {
  const restaurants = await api.get('/restaurants');
  dispatch({ type: 'SUCCESS', payload: restaurants });
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.response?.status === 400) {
    // Show validation error
    setError(error.response.data.message);
  } else {
    // Show generic error
    setError('An error occurred. Please try again.');
  }
}
```

### Backend
```javascript
// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  
  res.status(500).json({ success: false, message: 'Internal server error' });
});
```

---

## Testing Checklist

### Frontend Testing
- [ ] All pages render without errors
- [ ] Navigation works correctly
- [ ] Forms validate input
- [ ] API calls return expected data
- [ ] Redux state updates correctly
- [ ] Protected routes require authentication
- [ ] Error messages display properly
- [ ] Mobile responsiveness works

### Backend Testing
- [ ] All endpoints return correct status codes
- [ ] Authentication validates JWT
- [ ] Input validation catches invalid data
- [ ] Database queries use indexes
- [ ] Error messages are informative
- [ ] Rate limiting works
- [ ] CORS allows frontend requests
- [ ] Pagination works correctly

### ML Service Testing
- [ ] Sentiment analysis classifies reviews
- [ ] Recommendation algorithm returns results
- [ ] Batch processing works
- [ ] Error handling for invalid input
- [ ] Response format is consistent

### Integration Testing
- [ ] User can register and login
- [ ] Authenticated user can search restaurants
- [ ] Reviews show sentiment scores
- [ ] Recommendations are personalized
- [ ] Price comparison shows correct data
- [ ] All services communicate properly

---

## Monitoring & Logging

### Production Logging
```javascript
// Using Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { userId: user._id });
logger.error('Database error', { error: error.message });
```

### Application Metrics
- API response times
- Database query times
- ML service inference times
- Cache hit rates
- Error rates

### Health Checks
```bash
# Check all services
curl http://localhost:5000/health
curl http://localhost:3000/health
curl http://localhost:5001/health
```

---

## Deployment Testing

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates valid
- [ ] Backup strategy in place
- [ ] Monitoring tools configured
- [ ] Performance baseline established

### Post-Deployment Testing
- [ ] All endpoints accessible
- [ ] Database connectivity verified
- [ ] Cache working properly
- [ ] ML service responding
- [ ] Logging capturing events
- [ ] Error alerts configured
