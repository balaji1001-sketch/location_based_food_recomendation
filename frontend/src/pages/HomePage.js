/**
 * Home Page Component
 * Landing page with hero section and featured restaurants
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../services/apiService';
import RestaurantCard from '../components/RestaurantCard';
import '../styles/HomePage.css';

/**
 * HomePage Component
 * Displays welcome message and featured restaurants
 */
function HomePage() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetch featured restaurants on component mount
     */
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await getRestaurants({
          isPopular: true,
          limit: 6,
        });
        setFeaturedRestaurants(response.data.data || []);
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
        setFeaturedRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Restaurant</h1>
          <p>Discover restaurants near you with personalized recommendations</p>

          {/* Search Button */}
          <div className="hero-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={() => navigate('/restaurants')}
            >
              Start Searching
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/price-comparison')}
            >
              Compare Prices
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hero-image">
          <div className="image-placeholder">🍽️ 🍕 🍜 🍱 🥘</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location-Based</h3>
            <p>Find restaurants based on your current location</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Smart Recommendations</h3>
            <p>Get personalized restaurant suggestions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Price Comparison</h3>
            <p>Compare prices across multiple restaurants</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>View charts and trends for ratings and prices</p>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="featured-section">
        <h2>Featured Restaurants</h2>
        {loading ? (
          <div className="loading">Loading featured restaurants...</div>
        ) : (
          <div className="restaurants-grid">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to explore?</h2>
        <button
          className="btn btn-primary btn-large"
          onClick={() => navigate('/restaurants')}
        >
          Browse All Restaurants
        </button>
      </section>
    </div>
  );
}

export default HomePage;
