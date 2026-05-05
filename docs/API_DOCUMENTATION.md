# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": {
    "cuisines": ["North Indian", "Chinese"],
    "budgetRange": "medium",
    "dietaryRestrictions": []
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Login User
```
POST /auth/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Get User Profile
```
GET /auth/me
Authorization: Required
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {...},
    "totalRatings": 5,
    "totalReviews": 3
  }
}
```

---

## Restaurant Endpoints

### Get Restaurants (with filters)
```
GET /restaurants
```

**Query Parameters:**
- `latitude` (number): User's latitude
- `longitude` (number): User's longitude
- `radius` (number): Search radius in km (default: 10)
- `cuisines` (array): Filter by cuisines
- `minPrice` (number): Minimum average price
- `maxPrice` (number): Maximum average price
- `minRating` (number): Minimum rating
- `sortBy` (string): 'rating' | 'distance' | 'price'
- `limit` (number): Results per page (default: 20)
- `page` (number): Page number (default: 1)

**Example:**
```
GET /restaurants?latitude=28.6139&longitude=77.2090&radius=5&cuisines=North Indian&minPrice=200&maxPrice=500&sortBy=rating&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "totalCount": 45,
  "page": 1,
  "limit": 10,
  "restaurants": [
    {
      "_id": "restaurant_id",
      "name": "Taj Express",
      "cuisines": ["North Indian", "Continental"],
      "avgPrice": 350,
      "rating": 4.5,
      "reviewCount": 120,
      "address": "Main Street, Delhi",
      "coordinates": [...],
      "distance": 2.5
    }
  ]
}
```

---

### Get Restaurant Details
```
GET /restaurants/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "restaurant_id",
    "name": "Taj Express",
    "cuisines": ["North Indian"],
    "avgPrice": 350,
    "rating": 4.5,
    "address": "Main Street, Delhi",
    "phone": "9876543210",
    "timing": "11:00 AM - 11:00 PM",
    "menu": [...],
    "reviews": [...],
    "ratingDistribution": {
      "1": 5,
      "2": 10,
      "3": 20,
      "4": 50,
      "5": 40
    }
  }
}
```

---

### Search Restaurants
```
GET /restaurants/search?q=pizza&city=Delhi
```

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

---

## Review Endpoints

### Submit Review
```
POST /reviews/:restaurantId
Authorization: Required
```

**Request:**
```json
{
  "rating": 4,
  "text": "Great food and amazing service!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "_id": "review_id",
    "restaurant": "restaurant_id",
    "rating": 4,
    "text": "Great food and amazing service!",
    "sentiment": "positive",
    "sentimentScore": 0.85
  }
}
```

---

### Get Reviews
```
GET /reviews/:restaurantId?limit=10&page=1&sortBy=recent
```

**Query Parameters:**
- `limit` (number): Results per page
- `page` (number): Page number
- `sortBy` (string): 'recent' | 'helpful'

**Response (200):**
```json
{
  "success": true,
  "totalCount": 150,
  "data": [...]
}
```

---

## Recommendation Endpoints

### Get Personalized Recommendations
```
GET /recommendations
Authorization: Required
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "restaurant_id",
      "name": "Restaurant Name",
      "type": "content-based",
      ...
    }
  ]
}
```

---

### Rate Recommendation
```
POST /recommendations/rate
Authorization: Required
```

**Request:**
```json
{
  "restaurantId": "restaurant_id",
  "rating": 4
}
```

---

## Price Comparison Endpoints

### Get Price Comparison
```
GET /price-comparison?foodItem=Butter Chicken&days=1
```

**Query Parameters:**
- `foodItem` (string, required): Food item to compare
- `days` (number): Number of days to include

**Response (200):**
```json
{
  "success": true,
  "foodItem": "Butter Chicken",
  "minPrice": 280,
  "maxPrice": 450,
  "avgPrice": 350,
  "bestValue": {
    "restaurant": "Taj Express",
    "price": 300,
    "rating": 4.5
  },
  "comparison": [
    {
      "restaurantId": "id",
      "restaurant": "Taj Express",
      "price": 300,
      "rating": 4.5,
      "distance": 2.5
    }
  ]
}
```

---

### Get Price Trends
```
GET /price-trends?foodItem=Butter Chicken&days=30
```

**Response (200):**
```json
{
  "success": true,
  "foodItem": "Butter Chicken",
  "days": 30,
  "trends": [
    {
      "_id": {"date": "2024-03-25"},
      "avgPrice": 350,
      "minPrice": 280,
      "maxPrice": 450,
      "count": 15
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
