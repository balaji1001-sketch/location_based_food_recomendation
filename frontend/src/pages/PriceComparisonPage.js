/**
 * Price Comparison Page Component
 * Compare prices of same food items across restaurants
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPriceComparison } from '../services/apiService';
import '../styles/PriceComparisonPage.css';

/**
 * PriceComparisonPage Component
 * Allows users to compare prices and view trends
 */
function PriceComparisonPage() {
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState('');
  const [city, setCity] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'city', 'nearby'
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  /**
   * Handle price comparison search
   * @param {Event} e - Form submit event
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!foodItem.trim()) {
      setError('Please enter a food item');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = { foodItem };

      // Add filters based on search type
      if (searchType === 'city' && city.trim()) {
        params.city = city;
      } else if (searchType === 'nearby' && latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
        params.radius = radius;
      }

      const response = await getPriceComparison(params);
      setComparisonData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching price data');
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to restaurant details page
   * @param {string} restaurantId - Restaurant ID
   */
  const handleViewRestaurant = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  return (
    <div className="price-comparison-page">
      <div className="page-header">
        <h1>💰 Price Comparison Tool</h1>
        <p>Compare prices of your favorite food items across restaurants</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          {/* Food Item Input */}
          <div className="form-row">
            <div className="form-group">
              <label>🍲 Food Item</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Butter Chicken, Dosa, Biryani"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Search Type Selector */}
          <div className="form-row">
            <div className="search-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="all"
                  checked={searchType === 'all'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span className="radio-label">🌍 All Restaurants</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="city"
                  checked={searchType === 'city'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span className="radio-label">📍 By City</span>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="nearby"
                  checked={searchType === 'nearby'}
                  onChange={(e) => setSearchType(e.target.value)}
                  disabled={loading}
                />
                <span className="radio-label">🎯 Nearby</span>
              </label>
            </div>
          </div>

          {/* City Filter */}
          {searchType === 'city' && (
            <div className="form-row">
              <div className="form-group">
                <label>🏙️ City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Trichy, Chennai, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Nearby Filter */}
          {searchType === 'nearby' && (
            <div className="form-row">
              <div className="form-group">
                <label>📍 Radius (km)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Radius in km"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  min="1"
                  max="50"
                  disabled={loading}
                />
              </div>
              <div className="form-group info-text">
                <small>
                  Your location: {latitude && longitude ? `${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}` : 'Detecting...'}
                </small>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="form-row">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? '🔄 Searching...' : '🔍 Compare Prices'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span>❌</span> {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {comparisonData && (
        <div className="comparison-results">
          {/* Header with Statistics */}
          <section className="results-header">
            <h2>📊 Price Comparison Results for "{comparisonData.foodItem}"</h2>
            <div className="filter-badges">
              <span className="badge">📍 {comparisonData.filters.city}</span>
              <span className="badge">🎯 {comparisonData.filters.nearby}</span>
              <span className="badge">🏪 {comparisonData.statistics.restaurantCount} Restaurants</span>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💚</div>
                <div className="stat-content">
                  <span className="stat-label">Lowest Price</span>
                  <span className="stat-value">₹{comparisonData.statistics.minPrice}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💛</div>
                <div className="stat-content">
                  <span className="stat-label">Average Price</span>
                  <span className="stat-value">₹{comparisonData.statistics.avgPrice}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-content">
                  <span className="stat-label">Highest Price</span>
                  <span className="stat-value">₹{comparisonData.statistics.maxPrice}</span>
                </div>
              </div>

              <div className="stat-card best-value">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <span className="stat-label">Best Value</span>
                  <span className="stat-value">{comparisonData.bestValue.restaurant}</span>
                  <span className="stat-sub">₹{comparisonData.bestValue.price} ({comparisonData.bestValue.rating}★)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Price Comparison Table */}
          <section className="table-section">
            <h2>🏪 Price Breakdown by Restaurant</h2>
            <div className="table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="col-restaurant">🏪 Restaurant</th>
                    <th className="col-item">🍲 Food Item</th>
                    <th className="col-price">💰 Price</th>
                    <th className="col-rating">⭐ Rating</th>
                    <th className="col-cuisine">🥘 Cuisine</th>
                    <th className="col-delivery">🚗 Delivery</th>
                    <th className="col-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.comparison.map((item, idx) => (
                    <tr key={item.restaurantId} className={idx === 0 ? 'best-price' : ''}>
                      <td className="col-restaurant">
                        <div className="restaurant-cell">
                          <span className="restaurant-emoji">{item.thumbnail}</span>
                          <span className="restaurant-name">{item.restaurant}</span>
                        </div>
                      </td>
                      <td className="col-item">{item.menuItem}</td>
                      <td className="col-price">
                        <span className="price-badge">₹{item.price}</span>
                      </td>
                      <td className="col-rating">
                        <span className="rating-badge">{item.rating}★</span>
                      </td>
                      <td className="col-cuisine">{item.cuisine}</td>
                      <td className="col-delivery">
                        <span className={`delivery-badge ${item.delivery ? 'available' : 'unavailable'}`}>
                          {item.delivery ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td className="col-action">
                        <button 
                          className="btn btn-small"
                          onClick={() => handleViewRestaurant(item.restaurantId)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Savings Info */}
          <section className="savings-section">
            <h3>💡 Smart Recommendations</h3>
            <div className="recommendations-grid">
              <div className="recommendation-card">
                <div className="card-icon">💰</div>
                <h4>Save Money</h4>
                <p>
                  Buy from <strong>{comparisonData.comparison[0].restaurant}</strong> and save{' '}
                  <strong>₹{comparisonData.statistics.maxPrice - comparisonData.statistics.minPrice}</strong> compared to most expensive
                </p>
              </div>

              <div className="recommendation-card">
                <div className="card-icon">⭐</div>
                <h4>Best Value</h4>
                <p>
                  <strong>{comparisonData.bestValue.restaurant}</strong> offers excellent quality
                  ({comparisonData.bestValue.rating}★) at ₹{comparisonData.bestValue.price}
                </p>
              </div>

              <div className="recommendation-card">
                <div className="card-icon">📊</div>
                <h4>Price Insights</h4>
                <p>
                  Average price across {comparisonData.statistics.restaurantCount} restaurants is ₹
                  {comparisonData.statistics.avgPrice}. Price range: ₹{comparisonData.statistics.minPrice} -
                  ₹{comparisonData.statistics.maxPrice}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Empty State */}
      {!loading && !comparisonData && !error && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Start Comparing Prices</h3>
          <p>Enter a food item and select your search preferences above</p>
        </div>
      )}
    </div>
  );
}

export default PriceComparisonPage;
