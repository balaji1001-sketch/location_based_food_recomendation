/**
 * Restaurant Card Component
 * Displays individual restaurant information in card format
 */

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/RestaurantCard.css';

/**
 * RestaurantCard Component
 * Shows restaurant summary with key information
 * @param {Object} props - Component props
 * @param {Object} props.restaurant - Restaurant data
 * @param {Function} props.onMapClick - Callback when mini map is clicked
 * @returns {React.Component} Restaurant card element
 */
function RestaurantCard({ restaurant, onMapClick }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize mini map
  useEffect(() => {
    if (!mapRef.current || !restaurant.latitude || !restaurant.longitude) return;

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      } catch (e) {
        console.warn('Error cleaning up old map:', e);
      }
    }

    // Clear the container
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    try {
      // Create new map instance
      const map = L.map(mapRef.current).setView(
        [restaurant.latitude, restaurant.longitude],
        14
      );
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Add marker with emoji
      const markerIcon = L.divIcon({
        html: `<div style="font-size: 24px; text-align: center;">${restaurant.thumbnail || '🍽️'}</div>`,
        className: 'mini-map-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([restaurant.latitude, restaurant.longitude], {
        icon: markerIcon,
      }).addTo(map);
    } catch (error) {
      console.error('Error initializing mini map:', error);
    }

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
  }, [restaurant.latitude, restaurant.longitude, restaurant.thumbnail]);

  return (
    <div className="restaurant-card">
      {/* Restaurant Image/Thumbnail */}
      <div className="card-image">
        {restaurant.thumbnail ? (
          <div className="thumbnail-display">{restaurant.thumbnail}</div>
        ) : (
          <img
            src={restaurant.image || '/placeholder-restaurant.jpg'}
            alt={restaurant.name}
            onError={(e) => {
              e.target.src = '/placeholder-restaurant.jpg';
            }}
          />
        )}
        {restaurant.isNew && <span className="badge new">NEW</span>}
        {restaurant.isPopular && <span className="badge popular">POPULAR</span>}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="restaurant-name">{restaurant.name}</h3>

        {/* Location Badge */}
        {(restaurant.city || restaurant.location) && (
          <div className="location-badge">
            📍 {restaurant.city || restaurant.location}
          </div>
        )}

        {/* Open/Closed Status Badge */}
        {restaurant.isOpen !== undefined && (
          <div className={`status-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>
            <span className="status-indicator">
              {restaurant.isOpen ? '✓ ' : '✕ '}
            </span>
            <span className="status-text">{restaurant.statusText}</span>
            {restaurant.nextStatus && (
              <span className="next-status"> • {restaurant.nextStatus}</span>
            )}
          </div>
        )}

        {/* Rating and Price */}
        <div className="rating-section">
          <div className="rating">
            <span className="star">⭐</span>
            <span className="rating-value">{restaurant.rating}</span>
            <span className="review-count">({restaurant.reviewCount})</span>
          </div>
          <div className="avg-price">
            <span className="price-label">Avg:</span>
            <span className="price-value">₹{restaurant.avgPrice}</span>
          </div>
        </div>

        {/* Menu Items with Prices */}
        {restaurant.menu && restaurant.menu.length > 0 ? (
          <div className="menu-preview">
            <div className="menu-title">🍲 Popular Foods</div>
            <div className="menu-items-list">
              {restaurant.menu.slice(0, 4).map((item, idx) => (
                <div key={idx} className="menu-item-chip">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">₹{item.price}</span>
                </div>
              ))}
              {restaurant.menu.length > 4 && (
                <div className="menu-more">
                  +{restaurant.menu.length - 4} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="menu-preview">
            <span className="cuisine-tag">
              {Array.isArray(restaurant.cuisines)
                ? restaurant.cuisines.join(', ')
                : restaurant.cuisines}
            </span>
          </div>
        )}

        {/* Mini Map */}
        {restaurant.latitude && restaurant.longitude && (
          <div 
            className="mini-map-container"
            onClick={() => onMapClick?.(restaurant)}
            role="button"
            tabIndex={0}
            title="Click to view full map"
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onMapClick?.(restaurant);
              }
            }}
          >
            <div ref={mapRef} className="mini-map"></div>
            <div className="mini-map-overlay">👆 Click to expand</div>
          </div>
        )}

        {/* Delivery Badge */}
        {restaurant.deliveryAvailable && (
          <span className="delivery-badge">🚗 Delivery Available</span>
        )}

        {/* View Details Button */}
        <button
          className="btn btn-primary view-btn"
          onClick={() => navigate(`/restaurants/${restaurant._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
