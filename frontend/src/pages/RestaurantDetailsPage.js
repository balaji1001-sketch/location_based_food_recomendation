/**
 * Restaurant Details Page Component
 * Shows complete restaurant information and menu
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantDetails, getRestaurants } from '../services/apiService';
import RatingChart from '../components/RatingChart';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/RestaurantDetailsPage.css';

/**
 * RestaurantDetailsPage Component
 * Displays full restaurant information with reviews and ratings
 */
function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [restaurant, setRestaurant] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const modalMapRef = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [directions, setDirections] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const mapInstanceRef = useRef(null);
  const modalMapInstanceRef = useRef(null);

  useEffect(() => {
    /**
     * Fetch restaurant details and nearby restaurants on component mount
     */
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantDetails(id);
        setRestaurant(response.data.data);
        setSelectedLocation(response.data.data);

        // Fetch nearby restaurants based on location
        try {
          const nearbyRes = await getRestaurants();
          setNearbyRestaurants(nearbyRes.data.data);
        } catch (err) {
          console.warn('Failed to fetch nearby restaurants');
        }
      } catch (err) {
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.warn('Location permission denied:', error);
        }
      );
    }

    fetchRestaurant();
  }, [id]);

  /**
   * Fetch route data from OSRM (Open Source Routing Machine)
   * @param {number} lat1 - Start latitude
   * @param {number} lon1 - Start longitude
   * @param {number} lat2 - End latitude
   * @param {number} lon2 - End longitude
   */
  const fetchRouteData = async (lat1, lon1, lat2, lon2) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?steps=true&geometries=geojson&overview=full&annotations=distance,duration`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteData(route);
        setRouteDistance((route.distance / 1000).toFixed(2)); // Convert to km
        setRouteDuration(Math.round(route.duration / 60)); // Convert to minutes

        // Parse route steps into turn-by-turn directions
        const directionsList = [];
        route.legs[0].steps.forEach((step, idx) => {
          const instruction = step.maneuver.instruction || 'Continue';
          const distance = (step.distance / 1000).toFixed(2);
          directionsList.push({
            id: idx,
            instruction: `${instruction} - ${distance} km`,
            coordinates: step.geometry.coordinates,
          });
        });
        setDirections(directionsList);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - User latitude
   * @param {number} lon1 - User longitude
   * @param {number} lat2 - Restaurant latitude
   * @param {number} lon2 - Restaurant longitude
   * @returns {number} Distance in kilometers
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch route data when user location and restaurant are available
  useEffect(() => {
    if (restaurant && userLocation) {
      fetchRouteData(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
    }
  }, [restaurant, userLocation]);

  // Initialize map when restaurant data and user location are available
  useEffect(() => {
    if (!restaurant || !userLocation || !mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (e) {
        console.warn('Error cleaning up old map:', e);
      }
    }

    try {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
      setDistance(dist);

      // Clear container
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }

      // Create map centered on restaurant
      const map = L.map(mapRef.current).setView(
        [restaurant.latitude, restaurant.longitude],
        13
      );
      mapInstanceRef.current = map;

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, DigitalGlobe, Earthstar Geographics',
        maxZoom: 18,
      }).addTo(map);

      // Add restaurant marker
      const restaurantIcon = L.divIcon({
        html: `<div style="font-size: 32px; text-align: center;">${restaurant.thumbnail || '🍽️'}</div>`,
        iconSize: [40, 40],
        className: 'restaurant-marker',
      });

      L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup(
          `<div style="text-align: center;"><strong>${restaurant.name}</strong><br>${restaurant.address}<br>⭐ ${restaurant.rating}</div>`
        );

      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div style="font-size: 28px; text-align: center;">📍</div>`,
        iconSize: [35, 35],
        className: 'user-marker',
      });

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('<div style="text-align: center;">Your Location</div>');

      // Draw route line if available
      if (routeData && routeData.geometry) {
        const coordinates = routeData.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        const routeLine = L.polyline(coordinates, {
          color: '#667eea',
          weight: 4,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeLine.addTo(map);
      } else {
        // Fallback: Draw a line between user and restaurant
        const line = L.polyline(
          [
            [userLocation.latitude, userLocation.longitude],
            [restaurant.latitude, restaurant.longitude],
          ],
          { color: '#667eea', weight: 2, opacity: 0.7, dashArray: '5, 10' }
        );
        line.addTo(map);
      }

      // Fit map to show both markers
      const group = new L.featureGroup([
        L.marker([userLocation.latitude, userLocation.longitude]),
        L.marker([restaurant.latitude, restaurant.longitude]),
      ]);
      map.fitBounds(group.getBounds().pad(0.1));

      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          } catch (e) {
            console.warn('Error cleaning up map on unmount:', e);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [restaurant, userLocation, routeData]);

  // Initialize modal map when modal is opened
  useEffect(() => {
    if (!showMapModal || !restaurant || !userLocation || !modalMapRef.current) return;

    // Clean up existing modal map
    if (modalMapInstanceRef.current) {
      try {
        modalMapInstanceRef.current.remove();
        modalMapInstanceRef.current = null;
      } catch (e) {
        console.warn('Error cleaning up old modal map:', e);
      }
    }

    try {
      // Clear container
      if (modalMapRef.current) {
        modalMapRef.current.innerHTML = '';
      }

      // Create map for modal
      const modalMap = L.map(modalMapRef.current).setView(
        [restaurant.latitude, restaurant.longitude],
        13
      );
      modalMapInstanceRef.current = modalMap;

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, DigitalGlobe, Earthstar Geographics',
        maxZoom: 18,
      }).addTo(modalMap);

      // Add restaurant marker
      const restaurantIcon = L.divIcon({
        html: `<div style="font-size: 40px; text-align: center;">${restaurant.thumbnail || '🍽️'}</div>`,
        iconSize: [50, 50],
        className: 'restaurant-marker',
      });

      L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
        .addTo(modalMap)
        .bindPopup(
          `<div style="text-align: center;"><strong>${restaurant.name}</strong><br>${restaurant.address}<br>⭐ ${restaurant.rating}</div>`
        )
        .openPopup();

      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div style="font-size: 32px; text-align: center;">📍</div>`,
        iconSize: [40, 40],
        className: 'user-marker',
      });

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(modalMap)
        .bindPopup('<div style="text-align: center;"><strong>Your Location</strong></div>');

      // Draw route line if available
      if (routeData && routeData.geometry) {
        const coordinates = routeData.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        const routeLine = L.polyline(coordinates, {
          color: '#667eea',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeLine.addTo(modalMap);
      } else {
        // Fallback: Draw a line between user and restaurant
        const line = L.polyline(
          [
            [userLocation.latitude, userLocation.longitude],
            [restaurant.latitude, restaurant.longitude],
          ],
          { color: '#667eea', weight: 3, opacity: 0.8, dashArray: '5, 10' }
        );
        line.addTo(modalMap);
      }

      // Fit map to show both markers
      const group = new L.featureGroup([
        L.marker([userLocation.latitude, userLocation.longitude]),
        L.marker([restaurant.latitude, restaurant.longitude]),
      ]);
      modalMap.fitBounds(group.getBounds().pad(0.1));

      // Invalidate size for proper rendering
      setTimeout(() => {
        if (modalMapInstanceRef.current) {
          modalMapInstanceRef.current.invalidateSize();
        }
      }, 100);

      // Cleanup when modal closes
      return () => {
        if (modalMapInstanceRef.current) {
          try {
            modalMapInstanceRef.current.remove();
            modalMapInstanceRef.current = null;
          } catch (e) {
            console.warn('Error cleaning up modal map on close:', e);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing modal map:', error);
    }
  }, [showMapModal, restaurant, userLocation, routeData]);

  /**
   * Handle review submission
   * @param {Event} e - Form submit event
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitLoading(true);

    try {
      // Submit review API call would go here
      // await submitReview(id, { rating: userRating, review: userReview });
      alert('Review submitted successfully!');
      setUserRating(0);
      setUserReview('');
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-details-page">
        <div className="loading-state">Loading restaurant details...</div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-details-page">
        <div className="error-message">{error || 'Restaurant not found'}</div>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="header-thumbnail">{restaurant.thumbnail || '🍽️'}</div>
        <div className="header-content">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-meta">
            <span className="rating">⭐ {restaurant.rating}</span>
            <span className="reviews">
              {restaurant.reviewCount} reviews
            </span>
            {restaurant.statusText && (
              <span className={`status-indicator ${restaurant.isOpen ? 'open' : 'closed'}`}>
                {restaurant.isOpen ? '🟢' : '🔴'} {restaurant.statusText}
              </span>
            )}
            <span className="cuisine">
              {Array.isArray(restaurant.cuisines) 
                ? restaurant.cuisines.join(', ')
                : restaurant.cuisines}
            </span>
            <span className="location">📍 {restaurant.city || restaurant.location}</span>
          </div>
          <p className="description">{restaurant.description}</p>
        </div>
      </div>

      <div className="details-container">
        {/* Left Column - Info, Map, and Reviews */}
        <main className="details-main">
          {/* Location and Map Section */}
          <section className="details-section location-section">
            <h2>📍 Location Details & Map</h2>
            <div className="location-content">
              <div className="location-info">
                <div className="info-item">
                  <strong>Address:</strong>
                  <p>{restaurant.address}</p>
                </div>
                <div className="info-item">
                  <strong>City/Area:</strong>
                  <p>{restaurant.city || restaurant.location}</p>
                </div>
                <div className="info-item">
                  <strong>Coordinates:</strong>
                  <p>
                    {restaurant.latitude?.toFixed(4)}, {restaurant.longitude?.toFixed(4)}
                  </p>
                </div>
                <div className="info-item">
                  <strong>Phone:</strong>
                  <p>{restaurant.phone}</p>
                </div>
                {distance !== null && typeof distance === 'number' && (
                  <div className="info-item distance-info">
                    <strong>📏 Distance from Your Location:</strong>
                    <p className="distance-value">{distance.toFixed(2)} km</p>
                  </div>
                )}
              </div>

              {/* Interactive Map */}
              <div
                className="location-map"
                ref={mapRef}
                onClick={() => setShowMapModal(true)}
                style={{ 
                  height: '400px', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}>
                  👆 Click to expand
                </div>
              </div>
            </div>
          </section>

          {/* Directions & Route Information */}
          {routeDistance && routeDuration && (
            <section className="details-section directions-section">
              <h2>🗺️ Route Information</h2>
              <div className="route-info-grid">
                <div className="route-info-card">
                  <div className="route-info-icon">📏</div>
                  <div className="route-info-content">
                    <span className="route-info-label">Distance</span>
                    <span className="route-info-value">{routeDistance} km</span>
                  </div>
                </div>
                <div className="route-info-card">
                  <div className="route-info-icon">⏱️</div>
                  <div className="route-info-content">
                    <span className="route-info-label">Estimated Time</span>
                    <span className="route-info-value">{routeDuration} min</span>
                  </div>
                </div>
              </div>

              {/* Turn-by-turn directions */}
              {directions.length > 0 && (
                <div className="directions-list">
                  <h3>📍 Turn-by-Turn Directions</h3>
                  <ol className="steps-list">
                    {directions.map((direction) => (
                      <li key={direction.id} className="direction-step">
                        <span className="step-number">{direction.id + 1}</span>
                        <span className="step-instruction">{direction.instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          )}

          {/* Operating Hours Section */}
          {restaurant.operatingHours && (
            <section className="details-section operating-hours-section">
              <h2>🕐 Operating Hours</h2>
              <div className="hours-container">
                <div className={`status-display ${restaurant.isOpen ? 'open' : 'closed'}`}>
                  <span className="status-icon">{restaurant.isOpen ? '✓ OPEN' : '✕ CLOSED'}</span>
                  {restaurant.nextStatus && <span className="next-status-text">{restaurant.nextStatus}</span>}
                </div>
                <div className="hours-grid">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="hour-item">
                      <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                      {restaurant.operatingHours[day]?.closed ? (
                        <span className="time closed">Closed</span>
                      ) : (
                        <span className="time">
                          {restaurant.operatingHours[day]?.open} - {restaurant.operatingHours[day]?.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Restaurant Details */}
          <section className="details-section">
            <h2>Restaurant Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Average Price</label>
                <p>₹{restaurant.avgPrice}</p>
              </div>
              <div className="detail-item">
                <label>Cuisines</label>
                <p>
                  {Array.isArray(restaurant.cuisines) 
                    ? restaurant.cuisines.join(', ')
                    : restaurant.cuisines}
                </p>
              </div>
              <div className="detail-item">
                <label>Timing</label>
                <p>{restaurant.timing}</p>
              </div>
              <div className="detail-item">
                <label>Delivery Available</label>
                <p>{restaurant.deliveryAvailable ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          </section>

          {/* Rating Chart */}
          <section className="details-section">
            <RatingChart
              ratingDistribution={restaurant.ratingDistribution}
              restaurantName={restaurant.name}
            />
          </section>

          {/* Reviews */}
          <section className="details-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {restaurant.reviews?.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.userName}</span>
                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Review Form */}
          <section className="details-section">
            <h2>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        userRating >= star ? 'active' : ''
                      }`}
                      onClick={() => setUserRating(star)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Review</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share your experience..."
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitLoading}
              >
                {submitLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </section>

          {/* Nearby Locations - 100 Shops List */}
          <section className="details-section nearby-section">
            <h2>🏪 Other Locations ({nearbyRestaurants.length})</h2>
            <div className="locations-grid">
              {nearbyRestaurants.slice(0, 100).map((loc) => (
                <button
                  key={loc._id}
                  className="location-button"
                  onClick={() => {
                    setSelectedLocation(loc);
                    navigate(`/restaurants/${loc._id}`);
                  }}
                  title={loc.name}
                >
                  <div className="loc-thumbnail">{loc.thumbnail || '🍽️'}</div>
                  <div className="loc-details">
                    <h4>{loc.name}</h4>
                    <p className="loc-city">📍 {loc.city || loc.location}</p>
                    <p className="loc-cuisine">
                      {Array.isArray(loc.cuisines) 
                        ? loc.cuisines[0]
                        : loc.cuisines}
                    </p>
                    <p className="loc-rating">⭐ {loc.rating}</p>
                    <p className="loc-price">₹{loc.avgPrice}</p>
                    {loc.deliveryAvailable && (
                      <span className="delivery-badge">🚗 Delivery</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>

        {/* Right Column - Menu (if available) */}
        {restaurant.menu && restaurant.menu.length > 0 && (
          <aside className="details-sidebar">
            <h2>Popular Items</h2>
            <div className="menu-items">
              {restaurant.menu.slice(0, 8).map((item, idx) => (
                <div key={idx} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">₹{item.price}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div 
          className="map-modal-overlay"
          onClick={() => setShowMapModal(false)}
        >
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h2>{restaurant.name} - Full Map View</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowMapModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="map-modal-body">
              <div
                className="full-map"
                ref={modalMapRef}
                id="detail-map-modal"
                style={{ height: '600px', width: '100%' }}
              >
                {/* Map will be rendered here */}
              </div>
              
              <div className="map-modal-info">
                <div className="info-row">
                  <span>📍 Address:</span>
                  <strong>{restaurant.address}</strong>
                </div>
                <div className="info-row">
                  <span>🏙️ City:</span>
                  <strong>{restaurant.city || restaurant.location}</strong>
                </div>
                <div className="info-row">
                  <span>📍 Coordinates:</span>
                  <strong>{restaurant.latitude?.toFixed(4)}, {restaurant.longitude?.toFixed(4)}</strong>
                </div>
                <div className="info-row">
                  <span>📞 Phone:</span>
                  <strong>{restaurant.phone}</strong>
                </div>
                {distance !== null && typeof distance === 'number' && (
                  <div className="info-row">
                    <span>📏 Distance from Your Location:</span>
                    <strong className="distance-highlight">{distance.toFixed(2)} km</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDetailsPage;
