# Location & Thumbnails Database Enhancement

## Overview
This document describes the enhancements made to store and serve location and thumbnail information for each restaurant in the database.

## Changes Made

### 1. **Restaurant Model Enhancement** ([Backend Restaurant Model](../backend/src/models/Restaurant.js))
Added `thumbnail` field to the Mongoose schema:
```javascript
thumbnail: String, // Emoji or image URL for quick visual reference
```

### 2. **CSV Data Structure**
The CSV file now includes location and thumbnail information for all restaurants:
- **File**: `data/tamil_nadu_restaurants_complete.csv`
- **Columns**: id, name, cuisine, rating, location, address, phone, priceRange, vegetarian, latitude, longitude, avgPrice, timing, deliveryAvailable, thumbnail

### 3. **Mock Database Enhancement** ([Backend Config](../backend/src/config/mockDB.js))
Updated the CSV parser to properly handle quoted fields and populate location/thumbnail data:

#### Key Features:
- **Improved CSV Parser**: Handles quoted fields containing commas
- **GeoJSON Coordinates**: Converts latitude/longitude to GeoJSON format
  ```javascript
  coordinates: {
    type: 'Point',
    coordinates: [longitude, latitude] // GeoJSON format
  }
  ```
- **Thumbnail Support**: Stores emoji or image URLs for visual identification
- **Location Fields**: Includes both structured and legacy location fields

### 4. **API Response Structure**
All restaurant endpoints now return complete location and thumbnail data:

#### Example Response:
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "_id": "1",
      "name": "Aryabhatta Restaurant",
      "cuisines": ["South Indian"],
      "rating": 4.5,
      "city": "Cantonment",
      "address": "123 Royal Rd, Trichy",
      "phone": "+91-431-2700123",
      "coordinates": {
        "type": "Point",
        "coordinates": [78.6978, 10.8269]
      },
      "latitude": 10.8269,
      "longitude": 78.6978,
      "location": "Cantonment",
      "thumbnail": "🍽️",
      "image": "🍽️",
      "banner": "🍽️",
      ...
    }
  ]
}
```

## Database Fields

### Location Fields
| Field | Type | Description |
|-------|------|-------------|
| `address` | String | Complete street address with city |
| `city` | String | City/locality name (e.g., "Trichy", "Cantonment") |
| `location` | String | Legacy location field for compatibility |
| `coordinates` | GeoJSON Point | [longitude, latitude] in GeoJSON format |
| `latitude` | Number | Latitude coordinate |
| `longitude` | Number | Longitude coordinate |

### Thumbnail Fields
| Field | Type | Description |
|-------|------|-------------|
| `thumbnail` | String | Emoji or image URL for quick visual reference |
| `image` | String | Main image/emoji for the restaurant |
| `banner` | String | Banner image/emoji for the restaurant |

## API Endpoints

### Get All Restaurants
```
GET /api/restaurants
Response: Array of restaurants with location and thumbnail data
```

### Get Restaurant Details
```
GET /api/restaurants/:id
Response: Single restaurant with complete data including location and thumbnails
```

### Search Restaurants
```
GET /api/restaurants/search?q=query
Response: Filtered restaurants with location and thumbnail data
```

## Using Location Data in Frontend

### Example: Display on Map
```javascript
const restaurants = response.data;
restaurants.forEach(restaurant => {
  const { coordinates, name, thumbnail } = restaurant;
  const [lng, lat] = coordinates.coordinates;
  
  // Add marker to map at [lat, lng]
  addMapMarker(lat, lng, name, thumbnail);
});
```

### Example: Display Thumbnail
```javascript
<img src={restaurant.thumbnail} alt={restaurant.name} />
// Or if using emoji
<span>{restaurant.thumbnail}</span>
```

### Example: Filter by Distance
```javascript
function filterByDistance(restaurants, userLat, userLng, radiusKm) {
  return restaurants.filter(r => {
    const [lng, lat] = r.coordinates.coordinates;
    const distance = calculateDistance(userLat, userLng, lat, lng);
    return distance <= radiusKm;
  });
}
```

## CSV Data Format

### Header Row
```
id,name,cuisine,rating,location,address,phone,priceRange,vegetarian,latitude,longitude,avgPrice,timing,deliveryAvailable,thumbnail
```

### Sample Data Row
```
1,Aryabhatta Restaurant,South Indian,4.5,Cantonment,"123 Royal Rd, Trichy",+91-431-2700123,₹₹,Yes,10.8269,78.6978,250,"9AM-10PM",Yes,🍽️
```

## Migration to Real MongoDB

When migrating to MongoDB, use the following steps:

1. **Create Index for Location Queries**:
   ```javascript
   db.restaurants.createIndex({ coordinates: "2dsphere" });
   ```

2. **Import Data**:
   ```bash
   mongoimport --db trichy_food --collection restaurants --file restaurants.json
   ```

3. **Verify Location Fields**:
   ```javascript
   db.restaurants.findOne({ _id: 1 });
   // Should return coordinates in GeoJSON format
   ```

## Environment Variables

To use real MongoDB instead of mock data:
```
MONGODB_URI=mongodb://localhost:27017/trichy_food
USE_MOCK_DB=false
```

## Testing

### Test CSV Parsing
```bash
cd backend
node -e "const mockDB = require('./src/config/mockDB.js'); console.log(mockDB.findRestaurants({}).length + ' restaurants loaded');"
```

### Test API
```bash
curl http://localhost:5000/api/restaurants
```

## Benefits

✅ **Geospatial Queries**: GeoJSON format enables location-based searches  
✅ **Quick Visual Reference**: Thumbnails for better UX  
✅ **Complete Address Info**: Full location information for navigation  
✅ **MongoDB Compatible**: GeoJSON format works with MongoDB 2dsphere index  
✅ **Legacy Support**: Additional fields for backward compatibility  

## Troubleshooting

### Issue: CSV not loading
- Check file path in [mockDB.js](../backend/src/config/mockDB.js)
- Ensure CSV file exists at `data/tamil_nadu_restaurants_complete.csv`
- Verify CSV format with proper encoding (UTF-8)

### Issue: Coordinates not showing
- Verify coordinates are in GeoJSON format: `{ type: "Point", coordinates: [lng, lat] }`
- Check that longitude comes before latitude

### Issue: Thumbnails not displaying
- Ensure thumbnail field contains valid emoji or image URL
- Test in browser console: `console.log(restaurant.thumbnail)`
