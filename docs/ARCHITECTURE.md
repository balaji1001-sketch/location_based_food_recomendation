# Project Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React.js)                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redux State Management                              │   │
│  │  Components: Navigation, Cards, Filters, Charts      │   │
│  │  Pages: Home, Restaurants, Details, Recommendations  │   │
│  │  Services: API, Location, Search                     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           Backend API (Node.js + Express)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication (JWT)                                │   │
│  │  Routes:                                             │   │
│  │  - /api/auth (Register, Login)                       │   │
│  │  - /api/restaurants (Search, Filter)                 │   │
│  │  - /api/reviews (Submit, Get)                        │   │
│  │  - /api/recommendations (Get personalized)           │   │
│  │  - /api/price-comparison (Price analysis)            │   │
│  │  Middleware: Auth, Validation, Error Handling        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────┬──────────────────────┬──────────────────┬──────┘
              │                      │                  │
   ┌──────────▼────────┐   ┌────────▼────────┐  ┌──────▼──────────┐
   │                   │   │                 │  │                 │
   ↓                   ↓   ↓                 ↓  ↓                 ↓
┌──────────┐     ┌──────────┐     ┌──────────┐  ┌────────────┐   │
│ MongoDB  │     │  Redis   │     │  ML      │  │ Scraper    │   │
│          │     │  Cache   │     │ Service  │  │ Service    │   │
└──────────┘     └──────────┘     └──────────┘  └────────────┘   │
```

---

## Component Architecture

### Frontend (React.js)

```
src/
├── components/
│   ├── Navigation.js         - Header navigation
│   ├── RestaurantCard.js     - Restaurant card display
│   ├── SearchFilter.js       - Filter controls
│   ├── RatingChart.js        - Rating visualization
│   └── PriceComparisonChart.js - Price chart
├── pages/
│   ├── HomePage.js           - Landing page
│   ├── RestaurantsPage.js    - Search & list page
│   ├── RestaurantDetailsPage.js - Detail view
│   ├── RecommendationsPage.js - Personalized recommendations
│   ├── PriceComparisonPage.js - Price comparison tool
│   ├── LoginPage.js          - Authentication
│   ├── SignupPage.js         - Registration
│   └── UserProfilePage.js    - User profile
├── redux/
│   ├── store.js              - Redux store setup
│   ├── actions/              - Action creators
│   │   ├── authActions.js
│   │   ├── restaurantActions.js
│   │   ├── recommendationActions.js
│   │   └── ...
│   └── reducers/             - State reducers
│       ├── authReducer.js
│       ├── restaurantReducer.js
│       └── ...
├── services/
│   ├── apiService.js         - API calls
│   ├── locationService.js    - Geolocation
│   └── searchService.js      - Search logic
└── styles/
    ├── App.css
    ├── Navigation.css
    └── ... (component styles)
```

### Backend (Node.js + Express)

```
src/
├── server.js                 - Main entry point
├── config/
│   ├── database.js          - MongoDB connection
│   └── redis.js             - Redis setup
├── models/
│   ├── User.js              - User schema
│   ├── Restaurant.js        - Restaurant schema
│   ├── Review.js            - Review schema
│   ├── UserRating.js        - Rating schema
│   └── PriceTracking.js     - Price history
├── controllers/
│   ├── authController.js    - Auth logic
│   ├── restaurantController.js - Restaurant queries
│   ├── reviewController.js  - Review management
│   ├── recommendationController.js - Recommendations
│   └── priceController.js   - Price operations
├── routes/
│   ├── authRoutes.js
│   ├── restaurantRoutes.js
│   ├── reviewRoutes.js
│   ├── recommendationRoutes.js
│   └── priceRoutes.js
├── middleware/
│   ├── auth.js              - JWT verification
│   ├── errorHandler.js      - Error handling
│   └── validation.js        - Input validation
└── utils/
    ├── helpers.js
    └── constants.js
```

### ML Service (Python + Flask)

```
ml_service/
├── app.py                   - Flask app
├── sentiment_analyzer.py    - VADER + TextBlob
├── recommendation_engine.py - ML algorithms
│   ├── Content-based
│   ├── Collaborative filtering
│   └── Hybrid approach
└── requirements.txt
```

### Web Scraper (Python)

```
scraper/
├── main.py                  - Scheduler & CLI
├── scraper.py              - BeautifulSoup scraper
│   ├── scrape_restaurants()
│   ├── scrape_reviews()
│   └── scrape_prices()
└── requirements.txt
```

---

## Data Flow

### User Registration & Login
```
User Input (Frontend)
    ↓
    → POST /api/auth/register (Backend)
    → Validation
    → Hash Password (bcrypt)
    → Save to MongoDB
    → Generate JWT Token
    → Return Token to Frontend
    → Store in localStorage
```

### Restaurant Search
```
User Search Query (Frontend)
    ↓
    → Get User Location (Geolocation API)
    → POST /api/restaurants (with filters)
    ↓
Backend:
    → Build Query (MongoDB)
    → Apply Geospatial Index
    → Filter by Cuisine, Price, Rating
    → Sort Results
    → Return Results
    ↓
Frontend:
    → Display Restaurant Cards
    → Show on Map
    → Enable Sort/Filter
```

### Recommendation Generation
```
User Viewing Restaurant (Frontend)
    ↓
    → Rate Restaurant (Optional)
    → POST /api/recommendations/rate
    ↓
Backend:
    → Save Rating to MongoDB
    → Call ML Service
    ↓
ML Service:
    → Get User Preferences
    → Get User Rating History
    → Apply Algorithms:
       - Content-Based Filtering
       - Collaborative Filtering
       - Hybrid Approach
    → Return Top N Restaurants
    ↓
Backend:
    → Fetch Restaurant Details
    → Return to Frontend
    ↓
Frontend:
    → Display Recommendations
```

### Review Submission with Sentiment Analysis
```
User Submits Review (Frontend)
    ↓
    → POST /api/restaurants/:id/reviews
    ↓
Backend:
    → Validate Input
    → Save Review to MongoDB
    → Call ML Service for Sentiment
    ↓
ML Service:
    → Analyze Sentiment (VADER)
    → Return Sentiment Score
    ↓
Backend:
    → Update Review with Sentiment
    → Update Restaurant Rating
    → Update Rating Distribution
    → Return to Frontend
    ↓
Frontend:
    → Show Review Posted
    → Update Ratings Chart
    → Refresh Reviews List
```

### Price Comparison
```
User Searches for Food Item (Frontend)
    ↓
    → GET /api/price-comparison?foodItem=X
    ↓
Backend:
    → Query PriceTracking Collection
    → Group by Restaurant
    → Calculate Statistics
    → Return Comparison Data
    ↓
Frontend:
    → Display Comparison Chart
    → Show Price Breakdown Table
    → Highlight Best Value
```

---

## Database Relationships

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │ One User
       │
       ├──→ Many Ratings (UserRatings)
       │
       ├──→ Many Reviews
       │
       └──→ Many Favorites (Restaurants)

┌──────────────┐
│ Restaurants  │
└──────┬───────┘
       │ One Restaurant
       │
       ├──→ Many Reviews
       │
       ├──→ Many Ratings (UserRatings)
       │
       └──→ Many Price Records (PriceTracking)

┌──────────────┐
│   Reviews    │
└──────┬───────┘
       │
       ├──→ User
       │
       └──→ Restaurant
```

---

## API Integration Points

### Frontend ↔ Backend
- **Base URL**: `http://localhost:5000`
- **Protocol**: HTTP/REST
- **Authentication**: JWT Token in Authorization header
- **Content-Type**: application/json

### Backend ↔ ML Service
- **Base URL**: `http://localhost:5001`
- **Endpoints**:
  - POST `/sentiment-analysis` - Analyze review sentiment
  - POST `/batch-sentiment-analysis` - Bulk sentiment
  - POST `/recommendations` - Get recommendations

### Backend ↔ Databases
- **MongoDB**: Direct driver connection
- **Redis**: Connection pooling for cache

### Scraper ↔ Backend
- **Method**: HTTP POST to backend API
- **Endpoint**: `/api/restaurants`
- **Data**: Restaurant, review, and price data

---

## Scalability Considerations

### Caching Strategy
- Use Redis for:
  - User sessions
  - Frequently accessed restaurants
  - Recommendation results
  - Price trends

### Database Optimization
- **Indexes**:
  - Geospatial index on coordinates
  - Text index on restaurant names
  - Compound indexes on common queries

- **Sharding**:
  - Shard by city/location
  - Shard by user ID for recommendations

### Asynchronous Processing
- Use job queues (Bull/RabbitMQ) for:
  - Sentiment analysis
  - Recommendation generation
  - Data scraping

### Load Balancing
- Use Nginx/HAProxy for:
  - Distributing traffic across backend instances
  - Load balancing ML service requests

---

## Security Architecture

```
Frontend
    ↓
    → Validate Input
    → Store JWT securely (httpOnly cookie)
    → HTTPS only
    ↓
Backend
    ↓
    → Verify JWT
    → Input validation & sanitization
    → Rate limiting (express-rate-limit)
    → CORS policy
    → SQL injection prevention (parameterized queries)
    → XSS protection (helmet)
    ↓
Database
    ↓
    → Authentication credentials
    → Network isolation
    → Encryption at rest (optional)
```
