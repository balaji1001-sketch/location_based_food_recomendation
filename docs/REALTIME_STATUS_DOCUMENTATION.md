# Real-Time Restaurant Open/Closed Status

## Overview
Added real-time open/closed status for restaurants that displays whether a restaurant is currently open or closed based on its operating hours and the current time.

## Features

### 1. **Operating Hours Management**
- Each restaurant has detailed operating hours for all 7 days of the week
- Operating hours include:
  - Opening time (e.g., "10:00")
  - Closing time (e.g., "22:00")
  - Closed flag for holidays or specific days

### 2. **Real-Time Status Display**
The system shows:
- **Status Text**: "Open" or "Closed"
- **Status Indicator**: Visual indicator (✓ for open, ✕ for closed)
- **Next Status**: Context about when the restaurant opens/closes
  - If Open: "Closes at 22:00"
  - If Closed: "Opens at 10:00"

### 3. **Frontend Components**

#### Restaurant Card Component
- Status badge displays below location
- Color-coded: Green for open, Red for closed
- Shows next status information

Example:
```
✓ Open • Closes at 22:00
```

#### Restaurant Details Page
- Header meta includes status indicator
- Full Operating Hours Section shows:
  - Current status with next action
  - Complete weekly schedule
  - Hover effects for better UX

## Backend Implementation

### Files Modified/Created

#### New Files:
1. **`backend/src/utils/timeUtils.js`**
   - `isRestaurantOpen(operatingHours)` - Main function to check if open
   - `getCurrentDayName()` - Gets current day
   - `getCurrentTime()` - Gets current time in HH:MM format
   - `isTimeWithinRange()` - Compares times
   - `getHoursForDay()` - Gets hours for specific day

#### Modified Files:
1. **`backend/src/models/Restaurant.js`**
   - Added `operatingHours` field to schema with default values
   - Structure for each day: `{ open, close, closed }`

2. **`backend/src/controllers/restaurantController.js`**
   - Added `addOpenStatus()` function to augment restaurant data
   - Modified all endpoints to include status:
     - `getRestaurants()`
     - `getRestaurantDetails()`
     - `searchRestaurants()`
     - `getTrendingRestaurants()`

3. **`backend/src/config/mockDB.js`**
   - Added `generateDefaultOperatingHours()` function
   - All mock restaurants now include operating hours

### API Response Format
All restaurant endpoints now return additional fields:
```json
{
  "_id": "1",
  "name": "Restaurant Name",
  ...existing fields...,
  "operatingHours": {
    "monday": { "open": "10:00", "close": "22:00", "closed": false },
    "tuesday": { "open": "10:00", "close": "22:00", "closed": false },
    ...
  },
  "isOpen": true,
  "statusText": "Open",
  "nextStatus": "Closes at 22:00"
}
```

## Frontend Implementation

### Files Modified
1. **`frontend/src/components/RestaurantCard.js`**
   - Added status badge display between location and rating
   - Shows real-time open/closed status
   - Displays next status information

2. **`frontend/src/pages/RestaurantDetailsPage.js`**
   - Added status indicator in header meta
   - New "Operating Hours" section showing:
     - Current status banner
     - Weekly schedule grid
     - Day-by-day display with opening/closing times

3. **`frontend/src/styles/RestaurantCard.css`**
   - Added `.status-badge` styles with color coding
   - Green background for open, red for closed
   - Responsive design

4. **`frontend/src/styles/RestaurantDetailsPage.css`**
   - Added operating hours section styling
   - `.operating-hours-section` with border accent
   - `.status-display` for open/closed banner
   - `.hours-grid` for weekly schedule
   - Status indicator styling in header meta

## Default Operating Hours
By default, all restaurants follow this schedule:
- **Monday - Thursday**: 10:00 - 22:00
- **Friday - Saturday**: 10:00 - 23:00
- **Sunday**: 11:00 - 22:00

These can be customized per restaurant in the database.

## Usage

### For Backend:
1. Time checks happen automatically on API response
2. No manual configuration needed - uses server time
3. To customize hours for a restaurant:
   ```javascript
   restaurant.operatingHours = {
     monday: { open: "09:00", close: "23:00", closed: false },
     // ... other days
   }
   ```

### For Frontend:
1. Restaurant cards automatically display status
2. Status updates on page load/refresh
3. Details page shows complete operating hours

## Future Enhancements
- [ ] Admin panel to edit operating hours
- [ ] Special hours for holidays
- [ ] Real-time socket updates without page refresh
- [ ] Multiple shifts support
- [ ] Lunch/Dinner timings
- [ ] Break hours support
- [ ] Integration with delivery service hours
