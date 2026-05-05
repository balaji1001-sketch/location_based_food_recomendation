/**
 * Restaurant Map Component
 * Displays restaurants on an interactive map using Leaflet/OpenStreetMap
 */

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/RestaurantMap.css';

/**
 * RestaurantMap Component
 * Uses Leaflet + OpenStreetMap for restaurant location visualization
 */
function RestaurantMap({ restaurants = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [mapType, setMapType] = useState('openstreetmap');

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Set default center to Tamil Nadu
    const defaultCenter = [11.0, 78.5];
    
    // Create map instance
    const map = L.map(mapRef.current).setView(defaultCenter, 7);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add/update markers when restaurants change
  useEffect(() => {
    if (!mapInstanceRef.current || !restaurants.length) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each restaurant
    restaurants.forEach((restaurant) => {
      const lat = restaurant.latitude || 11.0;
      const lng = restaurant.longitude || 78.5;

      // Create custom marker icon using thumbnail
      const markerIcon = L.divIcon({
        html: `
          <div class="custom-marker">
            <div class="marker-thumbnail">${restaurant.thumbnail || '🍽️'}</div>
            <div class="marker-tip"></div>
          </div>
        `,
        className: 'custom-marker-container',
        iconSize: [50, 60],
        iconAnchor: [25, 60],
        popupAnchor: [0, -60],
      });

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'leaflet-popup-content-wrapper-custom';
      popupContent.innerHTML = `
        <div class="popup-content">
          <h4>${restaurant.name}</h4>
          <p class="thumbnail-icon">${restaurant.thumbnail || '🍽️'}</p>
          <p class="location"><strong>📍 Location:</strong> ${restaurant.city || restaurant.location}</p>
          <p class="address"><strong>🏠 Address:</strong> ${restaurant.address}</p>
          <p class="rating"><strong>⭐ Rating:</strong> ${restaurant.rating} (${restaurant.reviewCount} reviews)</p>
          <p class="price"><strong>💰 Avg Price:</strong> ₹${restaurant.avgPrice}</p>
          <p class="timing"><strong>⏰ Timing:</strong> ${restaurant.timing}</p>
          <p class="delivery"><strong>🚗 Delivery:</strong> ${restaurant.deliveryAvailable ? 'Yes' : 'No'}</p>
          <p class="coords"><strong>📍 Coordinates:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
          <button class="view-btn" onclick="window.scrollTo(0, 0);">📋 View Menu</button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      // Click handler
      marker.on('click', () => {
        setSelectedRestaurant(restaurant);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (restaurants.length > 0 && markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [restaurants]);

  const handleCenterMap = (lat, lng) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15);
    }
  };

  return (
    <div className="restaurant-map-container">
      <div className="map-header">
        <h2>🗺️ Restaurant Locations - OpenStreetMap</h2>
        <p>{restaurants.length} restaurants across Tamil Nadu</p>
      </div>

      <div className="map-controls">
        <button 
          onClick={() => mapInstanceRef.current?.zoomIn()} 
          className="zoom-btn" 
          title="Zoom In"
        >
          🔍 +
        </button>
        <button 
          onClick={() => mapInstanceRef.current?.zoomOut()} 
          className="zoom-btn" 
          title="Zoom Out"
        >
          🔍 −
        </button>
        <div className="zoom-info">📍 Click markers for details</div>
      </div>

      {/* Leaflet Map Container */}
      <div ref={mapRef} className="leaflet-map-container"></div>

      {/* Info Panel */}
      {selectedRestaurant && (
        <div className="info-panel">
          <div className="info-header">
            <h3>{selectedRestaurant.name}</h3>
            <button
              className="close-btn"
              onClick={() => setSelectedRestaurant(null)}
            >
              ✕
            </button>
          </div>

          <div className="info-content">
            <div className="thumbnail-section">
              <div className="large-thumbnail">{selectedRestaurant.thumbnail || '🍽️'}</div>
            </div>

            <div className="info-row">
              <label>📍 Location:</label>
              <span>{selectedRestaurant.city || selectedRestaurant.location}</span>
            </div>

            <div className="info-row">
              <label>🏠 Address:</label>
              <span>{selectedRestaurant.address}</span>
            </div>

            <div className="info-row">
              <label>🍽️ Cuisines:</label>
              <span>
                {Array.isArray(selectedRestaurant.cuisines) 
                  ? selectedRestaurant.cuisines.slice(0, 3).join(', ')
                  : selectedRestaurant.cuisine || 'N/A'}
                {Array.isArray(selectedRestaurant.cuisines) && selectedRestaurant.cuisines.length > 3 && '...'}
              </span>
            </div>

            <div className="info-row">
              <label>⭐ Rating:</label>
              <span>{selectedRestaurant.rating} / 5 ({selectedRestaurant.reviewCount} reviews)</span>
            </div>

            <div className="info-row">
              <label>💰 Average Price:</label>
              <span>₹{selectedRestaurant.avgPrice}</span>
            </div>

            <div className="info-row">
              <label>📞 Phone:</label>
              <span>{selectedRestaurant.phone}</span>
            </div>

            <div className="info-row">
              <label>⏰ Timing:</label>
              <span>{selectedRestaurant.timing}</span>
            </div>

            <div className="info-row">
              <label>🚗 Delivery:</label>
              <span className={selectedRestaurant.deliveryAvailable ? 'available' : 'unavailable'}>
                {selectedRestaurant.deliveryAvailable ? '✓ Available' : '✗ Not Available'}
              </span>
            </div>

            <div className="info-row">
              <label>📍 Coordinates:</label>
              <span>
                {selectedRestaurant.latitude?.toFixed(4)}, {selectedRestaurant.longitude?.toFixed(4)}
              </span>
            </div>

            <button 
              className="center-map-btn"
              onClick={() => handleCenterMap(selectedRestaurant.latitude, selectedRestaurant.longitude)}
            >
              📍 Center on Map
            </button>
          </div>
        </div>
      )}

      {/* List View */}
      <div className="list-view">
        <h3>Featured Restaurants</h3>
        <div className="restaurant-list">
          {restaurants.slice(0, 5).map((restaurant) => (
            <div
              key={restaurant._id}
              className="list-item"
              onClick={() => {
                setSelectedRestaurant(restaurant);
                handleCenterMap(restaurant.latitude, restaurant.longitude);
              }}
            >
              <div className="list-thumbnail">{restaurant.thumbnail || '🍽️'}</div>
              <div className="list-info">
                <h4>{restaurant.name}</h4>
                <p>
                  {Array.isArray(restaurant.cuisines) 
                    ? restaurant.cuisines.slice(0, 2).join(', ')
                    : restaurant.cuisine} • ⭐ {restaurant.rating}
                </p>
                <p>₹{restaurant.avgPrice} • {restaurant.city || restaurant.location}</p>
              </div>
              {restaurant.deliveryAvailable && (
                <span className="delivery-badge">🚗 Delivery</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantMap;
