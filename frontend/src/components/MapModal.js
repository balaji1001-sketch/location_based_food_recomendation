/**
 * Map Modal Component
 * Displays a full-screen map with restaurant location
 */

import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapModal.css';

/**
 * MapModal Component
 * Shows full-screen Leaflet map for a restaurant
 * @param {Object} props - Component props
 * @param {Object} props.restaurant - Restaurant data
 * @param {Function} props.onClose - Callback to close modal
 * @returns {React.Component} Modal overlay element
 */
function MapModal({ restaurant, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !restaurant.latitude || !restaurant.longitude) return;

    try {
      // Create map with fullscreen view
      const map = L.map(mapRef.current).setView(
        [restaurant.latitude, restaurant.longitude],
        16
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker with emoji
      const markerIcon = L.divIcon({
        html: `<div class="modal-marker-emoji">${restaurant.thumbnail || '🍽️'}</div>`,
        className: 'modal-marker-container',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      });

      L.marker([restaurant.latitude, restaurant.longitude], {
        icon: markerIcon,
      }).bindPopup(
        `<div class="marker-popup">
          <h4>${restaurant.name}</h4>
          <p>📍 ${restaurant.city || restaurant.location}</p>
          <p>🏠 ${restaurant.address}</p>
        </div>`,
        { maxWidth: 200 }
      ).openPopup().addTo(map);

      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map modal:', error);
    }
  }, [restaurant]);

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="map-modal-header">
          <div className="modal-title">
            <h2>
              {restaurant.thumbnail} {restaurant.name}
            </h2>
            <p className="modal-subtitle">
              📍 {restaurant.city || restaurant.location}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="map-modal-map"></div>

        {/* Footer with Info */}
        <div className="map-modal-footer">
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <span className="modal-info-label">📍 Address:</span>
              <span className="modal-info-value">{restaurant.address}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">⭐ Rating:</span>
              <span className="modal-info-value">
                {restaurant.rating} / 5 ({restaurant.reviewCount} reviews)
              </span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">💰 Avg Price:</span>
              <span className="modal-info-value">₹{restaurant.avgPrice}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">📞 Phone:</span>
              <span className="modal-info-value">{restaurant.phone || 'N/A'}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">⏰ Timing:</span>
              <span className="modal-info-value">{restaurant.timing}</span>
            </div>
            <div className="modal-info-item">
              <span className="modal-info-label">🚗 Delivery:</span>
              <span className="modal-info-value">
                {restaurant.deliveryAvailable ? '✓ Available' : '✗ Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapModal;
