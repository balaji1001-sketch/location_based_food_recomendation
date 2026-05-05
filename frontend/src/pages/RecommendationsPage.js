/**
 * Recommendations Page Component
 * Displays personalized recommendations for authenticated users
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations } from '../redux/actions/recommendationActions';
import RestaurantCard from '../components/RestaurantCard';
import '../styles/RecommendationsPage.css';

/**
 * RecommendationsPage Component
 * Shows ML-based recommendations personalized for the user
 */
function RecommendationsPage() {
  const dispatch = useDispatch();
  const { recommendations, loading, error } = useSelector(
    (state) => state.recommendations
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch recommendations on component mount
    dispatch(fetchRecommendations());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <h1>Personalized for {user?.name}</h1>
        <p>Recommendations based on your preferences and history</p>
      </div>

      {error && (
        <div className="error-message">
          Error loading recommendations: {error}
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="recommendations-container">
          {/* Content-Based Recommendations */}
          <section className="recommendation-section">
            <h2>📌 Based on Your Preferences</h2>
            <div className="restaurants-grid">
              {recommendations
                .filter((r) => r.type === 'content-based')
                .map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
            </div>
          </section>

          {/* Collaborative Filtering Recommendations */}
          <section className="recommendation-section">
            <h2>👥 Users Like You Enjoyed</h2>
            <div className="restaurants-grid">
              {recommendations
                .filter((r) => r.type === 'collaborative')
                .map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
            </div>
          </section>

          {/* Trending Recommendations */}
          <section className="recommendation-section">
            <h2>🔥 Currently Trending</h2>
            <div className="restaurants-grid">
              {recommendations
                .filter((r) => r.type === 'trending')
                .map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                  />
                ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No recommendations yet</h3>
          <p>Rate more restaurants to get better personalized recommendations</p>
        </div>
      )}
    </div>
  );
}

export default RecommendationsPage;
