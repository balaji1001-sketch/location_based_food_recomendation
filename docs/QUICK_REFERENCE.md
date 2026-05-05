# Quick Reference Guide

## Command Cheatsheet

### Starting Services

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm start

# Terminal 3: ML Service
cd ml_service && source venv/bin/activate && python app.py

# Terminal 4: Scraper
cd scraper && source venv/bin/activate && python main.py schedule
```

### Package Management

```bash
# Frontend/Backend (npm)
npm install <package>           # Install package
npm uninstall <package>         # Remove package
npm update                      # Update all packages
npm run build                   # Build for production

# ML Service/Scraper (pip)
pip install <package>          # Install package
pip uninstall <package>        # Remove package
pip install -r requirements.txt # Install all dependencies
pip freeze > requirements.txt   # Update requirements
```

### Database

```bash
# MongoDB
mongod                          # Start MongoDB
mongo                           # Connect to shell
use food-recommendation         # Select database
show collections               # List collections
db.restaurants.count()         # Count documents
db.restaurants.find().limit(5) # View documents
db.restaurants.drop()          # Delete collection

# Redis
redis-server                   # Start Redis
redis-cli                      # Connect to CLI
keys *                        # List all keys
get <key>                     # Get value
del <key>                     # Delete key
FLUSHALL                      # Clear all data
```

---

## File Locations

### Important Configuration Files
- **Backend Config**: `backend/.env`
- **Frontend Config**: `frontend/.env`
- **ML Config**: `ml_service/.env`
- **Scraper Config**: `scraper/.env`

### Important Code Files

**Frontend:**
- `frontend/src/redux/store.js` - Redux store setup
- `frontend/src/App.js` - Main app component
- `frontend/src/services/apiService.js` - API client

**Backend:**
- `backend/src/server.js` - Express server
- `backend/src/models/` - Database schemas
- `backend/src/controllers/` - Business logic
- `backend/src/routes/` - API routes

**ML Service:**
- `ml_service/sentiment_analyzer.py` - Sentiment analysis
- `ml_service/recommendation_engine.py` - Recommendations

### Documentation Files
- [API Endpoints](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [ML Algorithms](ML_DOCUMENTATION.md)
- [Setup Instructions](SETUP_GUIDE.md)
- [System Architecture](ARCHITECTURE.md)
- [Testing Guide](TESTING_GUIDE.md)

---

## Common Endpoints

### Authentication (Backend)
```
POST   /api/auth/register       - Create account
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get profile (protected)
PUT    /api/auth/profile        - Update profile (protected)
```

### Restaurants (Backend)
```
GET    /api/restaurants         - Search with filters
GET    /api/restaurants/:id     - Get details
GET    /api/restaurants/search  - Text search
GET    /api/restaurants/trending - Trending list
```

### Reviews (Backend)
```
POST   /api/reviews/:restaurantId   - Submit review (protected)
GET    /api/reviews/:restaurantId   - Get reviews
POST   /api/reviews/:id/helpful     - Mark helpful
```

### Recommendations (Backend)
```
GET    /api/recommendations         - Get recommendations (protected)
POST   /api/recommendations/rate    - Rate restaurant (protected)
```

### Price (Backend)
```
GET    /api/price-comparison   - Compare prices
GET    /api/price-trends       - Price trends
```

### ML Service
```
POST   /sentiment-analysis            - Single review sentiment
POST   /batch-sentiment-analysis      - Multiple reviews
POST   /recommendations               - Get recommendations
GET    /health                        - Service health
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-recommendation
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
REDIS_URL=redis://localhost:6379
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPS_API_KEY=your_google_maps_key
REACT_APP_ENVIRONMENT=development
```

### ML Service (.env)
```
PORT=5001
ENVIRONMENT=development
FLASK_ENV=development
```

### Scraper (.env)
```
MONGODB_URI=mongodb://localhost:27017/food-recommendation
BACKEND_API_URL=http://localhost:5000
LOG_LEVEL=debug
SCRAPE_INTERVAL=3600
```

---

## Code Snippets

### Frontend: API Call with Redux
```javascript
// 1. Action
export const fetchRestaurants = (filters) => async (dispatch) => {
  dispatch({ type: 'FETCH_START' });
  try {
    const response = await api.get('/restaurants', { params: filters });
    dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', payload: error.message });
  }
};

// 2. Component
import { useDispatch, useSelector } from 'react-redux';

function RestaurantsPage() {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector(state => state.restaurants);
  
  const handleSearch = (filters) => {
    dispatch(fetchRestaurants(filters));
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {restaurants.map(r => <RestaurantCard key={r._id} {...r} />)}
    </div>
  );
}
```

### Backend: Protected Route
```javascript
// 1. Middleware
const auth = require('./middleware/auth');

// 2. Route
router.get('/recommendations', auth.authenticate, recommendationController.getRecommendations);

// 3. Controller
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const recommendations = await getRecommendations(userId);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Backend: Database Query
```javascript
// Find with filters and sort
const restaurants = await Restaurant.find({
  city: 'Delhi',
  cuisines: { $in: ['North Indian'] },
  avgPrice: { $lte: 500 }
})
.sort({ rating: -1 })
.limit(10)
.lean();

// Geospatial query
const nearby = await Restaurant.find({
  coordinates: {
    $near: {
      $geometry: { type: 'Point', coordinates: [77.2090, 28.6139] },
      $maxDistance: 5000
    }
  }
});
```

### ML Service: Sentiment Analysis
```python
from sentiment_analyzer import SentimentAnalyzer

analyzer = SentimentAnalyzer()

# Single review
result = analyzer.analyze_sentiment("Great food!")
# Returns: {'sentiment': 'positive', 'score': 0.85}

# Batch processing
results = analyzer.analyze_sentiment_batch([
  "Great food!",
  "Terrible experience",
  "Average service"
])
```

---

## Testing Commands

```bash
# Frontend tests
npm test                       # Run all tests
npm test -- --coverage        # With coverage report
npm run cypress:open          # E2E tests

# Backend tests
npm test                       # Run all tests
npm test -- --watch          # Watch mode
npm run test:integration     # Integration tests

# ML Service tests
pytest                        # Run all tests
pytest -v                     # Verbose output
pytest --coverage            # Coverage report
```

---

## Debugging Shortcuts

```bash
# Check if service is running
curl http://localhost:5000/health    # Backend
curl http://localhost:3000/health    # Frontend
curl http://localhost:5001/health    # ML Service

# View logs
tail -f backend/logs/error.log       # Backend errors
tail -f backend/logs/combined.log    # All logs

# Force kill process on port
# Linux/Mac:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Development Workflow

### 1. Create New Feature
```bash
git checkout -b feature/feature-name
```

### 2. Make Changes
- Edit code files
- Add comments
- Write tests

### 3. Test Changes
```bash
npm test
npm start  # Run locally
```

### 4. Commit Changes
```bash
git add .
git commit -m "Add feature description"
git push origin feature/feature-name
```

### 5. Create Pull Request
- Go to GitHub/GitLab
- Create PR against main branch
- Wait for review
- Merge after approval

---

## Git Commands

```bash
# Basic
git status                     # Check status
git add .                      # Stage changes
git commit -m "message"        # Commit changes
git push origin main           # Push to remote

# Branching
git branch                     # List branches
git checkout -b new-branch     # Create & switch branch
git checkout main              # Switch branch
git merge feature-branch       # Merge branch

# History
git log                        # View commits
git log --oneline             # One-line format
git diff                      # Show changes
git reflog                    # Recovery history
```

---

## Performance Tips

1. **Frontend**
   - Use React DevTools Profiler
   - Lazy load images
   - Code splitting with React.lazy()
   - Memoize expensive computations

2. **Backend**
   - Add database indexes
   - Use pagination
   - Cache frequently accessed data
   - Use connection pooling

3. **ML Service**
   - Cache similarity matrices
   - Batch process requests
   - Use approximate nearest neighbors
   - Monitor inference time

4. **Database**
   - Monitor slow queries
   - Optimize indexes
   - Archive old data
   - Use sharding for large datasets

---

## Security Checklist

- [ ] JWT secrets are strong
- [ ] Passwords are hashed (bcryptjs)
- [ ] CORS is configured properly
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] HTTPS in production
- [ ] Environment variables not in code
- [ ] Database credentials secured
- [ ] Error messages don't expose sensitive info
- [ ] XSS protection enabled (Helmet)

---

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Express.js Guide](https://expressjs.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [JWT Documentation](https://jwt.io/)

---

## Support

For issues or questions:
1. Check relevant documentation file
2. Search existing issues
3. Contact development team
4. Create detailed bug report with:
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
