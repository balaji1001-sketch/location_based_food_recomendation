<<<<<<< HEAD
# location_based_food_recomendation
Location-based food recommendation and price comparison system with personalized recommendations, sentiment analysis, and geospatial search
=======
# Location-Based Food Recommendation & Price Comparison System

A full-stack web application that provides personalized restaurant recommendations and price comparisons based on location, cuisine preferences, and user behavior.

---

## 🎯 Features

### 🔍 Core Features
- **Location-Based Search**: Find restaurants within a specified radius using geospatial queries
- **Advanced Filtering**: Filter by cuisine type, price range, rating, and more
- **Personalized Recommendations**: Content-based and collaborative filtering algorithms
- **Price Comparison**: Compare prices across restaurants for specific dishes
- **Sentiment Analysis**: Analyze user reviews using NLP techniques
- **User Authentication**: Secure login/signup with JWT tokens
- **User Preferences**: Save cuisine preferences and dietary restrictions
- **Review System**: Submit and view restaurant reviews with ratings

### 🚀 Technical Highlights
- **Microservices Architecture**: Frontend, Backend, ML Service, and Scraper as separate services
- **Geospatial Indexing**: MongoDB 2dsphere index for accurate location queries
- **Machine Learning**: 
  - Content-based recommendations (cosine similarity)
  - Collaborative filtering (user-user similarity)
  - Sentiment analysis (VADER + TextBlob ensemble)
- **Data Scraping**: Automated web scraping with scheduling
- **Caching**: Redis for performance optimization
- **Real-time Updates**: WebSocket support for live data updates

---

## 🏗️ Architecture

```
Frontend (React.js)
    ↓
Backend (Node.js + Express)
    ↓
┌───────────────────────────┐
│  MongoDB  │  Redis  │  ML  │
└───────────────────────────┘
```

**See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed diagrams and information.**

---

## 📦 Project Structure

```
project/
├── frontend/                 # React.js web application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # State management
│   │   ├── services/       # API and utility services
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── .env.example
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── server.js       # Express app
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration
│   ├── package.json
│   └── .env.example
│
├── ml_service/              # Python ML microservice
│   ├── sentiment_analyzer.py
│   ├── recommendation_engine.py
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
│
├── scraper/                 # Web scraping service
│   ├── scraper.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
└── docs/                    # Documentation
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md
    ├── DATABASE_SCHEMA.md
    ├── ML_DOCUMENTATION.md
    └── SETUP_GUIDE.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2.0 - UI library
- **Redux** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Leaflet** - Maps integration
- **CSS** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 4.18.2 - Web framework
- **MongoDB** 7.0.0 - Database
- **Mongoose** 7.0.0 - ODM
- **Redis** - Caching
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Machine Learning
- **Python** 3.8+
- **Flask** 2.3.0 - Web framework
- **scikit-learn** - ML algorithms
- **NLTK** - NLP
- **TextBlob** - Text processing
- **pandas** - Data manipulation

### Web Scraping
- **BeautifulSoup4** - HTML parsing
- **Scrapy** 2.9.0 - Web scraping
- **Selenium** - Dynamic content
- **APScheduler** - Task scheduling

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- Python 3.8+
- MongoDB 4.4+
- Redis 6.0+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install & Start Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

3. **Install & Start Frontend** (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

4. **Start ML Service** (in new terminal)
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m nltk.downloader vader_lexicon punkt
cp .env.example .env
python app.py
```

5. **Start Scraper** (in new terminal, optional)
```bash
cd scraper
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python main.py once Mumbai
```

**Services will start on:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML Service: http://localhost:5001

**See [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed instructions.**

---

## 📚 Documentation

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - MongoDB collections and queries
- **[ML Documentation](docs/ML_DOCUMENTATION.md)** - Recommendation algorithms and sentiment analysis
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Installation and configuration
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data flow

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication.

### Login Flow
1. User submits email and password
2. Backend validates credentials
3. Backend returns JWT token
4. Frontend stores token in localStorage
5. Token sent with each API request in Authorization header

### Protected Endpoints
Endpoints requiring authentication:
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/reviews/:restaurantId` - Submit review
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/rate` - Rate recommendation

---

## 🎯 Key API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get user profile
PUT    /api/auth/profile     - Update profile
```

### Restaurants
```
GET    /api/restaurants      - Search restaurants
GET    /api/restaurants/:id  - Get restaurant details
GET    /api/restaurants/search - Text search
GET    /api/restaurants/trending - Trending restaurants
```

### Reviews
```
POST   /api/reviews/:restaurantId - Submit review
GET    /api/reviews/:restaurantId - Get reviews
POST   /api/reviews/:id/helpful   - Mark helpful
```

### Recommendations
```
GET    /api/recommendations        - Get recommendations
POST   /api/recommendations/rate   - Rate recommendation
```

### Price Comparison
```
GET    /api/price-comparison  - Compare prices
GET    /api/price-trends      - Price trends
POST   /api/price-tracking    - Record price
```

**See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete endpoint details.**

---

## 🤖 Machine Learning Models

### Recommendation Algorithms
1. **Content-Based Filtering**
   - Feature vectors (price, rating, cuisine, budget)
   - Cosine similarity calculation
   - Personalized based on preferences

2. **Collaborative Filtering**
   - User-user similarity matrix
   - Recommend based on similar users
   - Discovers unexpected recommendations

3. **Hybrid Approach**
   - Combines both algorithms
   - 60% content-based + 40% collaborative (default weights)
   - Best overall performance

### Sentiment Analysis
- **VADER**: Rule-based sentiment analyzer
- **TextBlob**: Statistical polarity scores
- **Ensemble**: Combined score for robustness
- Classifies reviews as positive, negative, or neutral

**See [docs/ML_DOCUMENTATION.md](docs/ML_DOCUMENTATION.md) for detailed explanations.**

---

## 📊 Database Models

### Collections
- **Users** - User accounts and preferences
- **Restaurants** - Restaurant information with geospatial data
- **Reviews** - User reviews with sentiment analysis
- **UserRatings** - User-restaurant ratings for collaborative filtering
- **PriceTracking** - Historical price data

### Key Indexes
- Geospatial index (2dsphere) on restaurant coordinates
- Compound indexes for common queries
- TTL indexes for automatic expiration

**See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for schema details.**

---

## 🔄 Data Flow Examples

### Search Restaurants
```
User enters location & cuisines
    ↓
Frontend sends GET /api/restaurants with filters
    ↓
Backend queries MongoDB with geospatial index
    ↓
Results returned and displayed on map
```

### Get Recommendations
```
User views restaurant details
    ↓
User (optionally) rates restaurant
    ↓
Frontend sends POST /api/recommendations/rate
    ↓
Backend calls ML Service
    ↓
ML Service analyzes user data
    ↓
Personalized restaurants recommended
```

### Submit Review
```
User writes review and submits
    ↓
Frontend sends POST /api/reviews/:restaurantId
    ↓
Backend saves review
    ↓
Backend calls ML Service for sentiment
    ↓
Review updated with sentiment score
    ↓
Restaurant rating recalculated
```

---

## 🔧 Configuration

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPS_API_KEY=your_google_maps_key
REACT_APP_ENVIRONMENT=development
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-recommendation
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

### ML Service (.env)
```env
PORT=5001
ENVIRONMENT=development
FLASK_ENV=development
```

### Scraper (.env)
```env
MONGODB_URI=mongodb://localhost:27017/food-recommendation
BACKEND_API_URL=http://localhost:5000
SCRAPE_INTERVAL=3600
```

---

## 📈 Performance Optimization

### Caching Strategy
- User sessions cached in Redis
- Frequently accessed restaurants cached
- Recommendation results cached

### Database Optimization
- Geospatial indexes for location queries
- Compound indexes for multi-field queries
- Query optimization in controllers

### Frontend Optimization
- Code splitting with React Router
- Lazy loading of components
- Image optimization
- CSS minification

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Redis Connection Error
- Ensure Redis is running
- Check REDIS_URL in .env
- Verify port is not blocked

### ML Service Not Responding
- Ensure Flask app is running
- Check ML_SERVICE_URL in backend .env
- Verify network connectivity

### Port Already in Use
- Change port in .env
- Or kill process using that port

**See [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for more troubleshooting.**

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

---

## 📝 Code Comments

All code files include comprehensive comments explaining:
- Function purpose and parameters
- Complex logic and algorithms
- Configuration options
- Important security measures

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team & Contact

For questions or support, please contact the development team.

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular food delivery platforms
- Community feedback and contributions

---

**Last Updated:** 2024

**Version:** 1.0.0

---

## 🔗 Useful Links

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Setup Instructions](docs/SETUP_GUIDE.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [ML Models](docs/ML_DOCUMENTATION.md)
4. Create a Pull Request

## Support

For issues and questions, please open an issue in the repository.
>>>>>>> 37e1147 (Initial commit: Full-stack food recommendation system)
