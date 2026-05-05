/**
 * User Profile Page Component
 * Shows user information, preferences, and history
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/UserProfilePage.css';

/**
 * UserProfilePage Component
 * Displays user profile, preferences, and rating history
 */
function UserProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(user?.preferences || {});

  const CUISINES = [
    'North Indian',
    'South Indian',
    'Chinese',
    'Italian',
    'Continental',
    'Fast Food',
    'Bakery',
  ];

  /**
   * Handle preference update
   * @param {string} cuisine - Cuisine to toggle
   */
  const handleCuisineToggle = (cuisine) => {
    const cuisines = preferences.cuisines?.includes(cuisine)
      ? preferences.cuisines.filter((c) => c !== cuisine)
      : [...(preferences.cuisines || []), cuisine];

    setPreferences({
      ...preferences,
      cuisines,
    });
  };

  /**
   * Handle save preferences
   */
  const handleSavePreferences = async () => {
    try {
      // API call to update preferences would go here
      // await updateUserPreferences(preferences);
      alert('Preferences updated!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update preferences');
    }
  };

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <span className="member-since">
              Member since{' '}
              {user?.createdAt &&
                new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </section>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Preferences Section */}
          <section className="profile-section">
            <div className="section-header">
              <h2>Food Preferences</h2>
              {!isEditing && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-preferences">
                <label>Preferred Cuisines</label>
                <div className="cuisines-grid">
                  {CUISINES.map((cuisine) => (
                    <label key={cuisine} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={
                          preferences.cuisines?.includes(cuisine) || false
                        }
                        onChange={() => handleCuisineToggle(cuisine)}
                      />
                      <span>{cuisine}</span>
                    </label>
                  ))}
                </div>

                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    className="form-select"
                    value={preferences.budgetRange || 'medium'}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        budgetRange: e.target.value,
                      })
                    }
                  >
                    <option value="low">Low (₹0-₹300)</option>
                    <option value="medium">Medium (₹300-₹700)</option>
                    <option value="high">High (₹700+)</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleSavePreferences}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="preferences-display">
                <div className="preference-item">
                  <label>Preferred Cuisines</label>
                  <div className="cuisine-tags">
                    {preferences.cuisines?.map((cuisine) => (
                      <span key={cuisine} className="cuisine-tag">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="preference-item">
                  <label>Budget Range</label>
                  <span>
                    {preferences.budgetRange === 'low'
                      ? 'Low (₹0-₹300)'
                      : preferences.budgetRange === 'medium'
                      ? 'Medium (₹300-₹700)'
                      : 'High (₹700+)'}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Stats Section */}
          <section className="profile-section">
            <h2>Your Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{user?.totalRatings || 0}</div>
                <div className="stat-label">Restaurants Rated</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{user?.totalReviews || 0}</div>
                <div className="stat-label">Reviews Written</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">
                  {user?.favoriteCount || 0}
                </div>
                <div className="stat-label">Favorite Restaurants</div>
              </div>
            </div>
          </section>

          {/* Recent Ratings Section */}
          <section className="profile-section">
            <h2>Recent Ratings</h2>
            {user?.recentRatings && user.recentRatings.length > 0 ? (
              <div className="ratings-list">
                {user.recentRatings.map((rating) => (
                  <div key={rating._id} className="rating-item">
                    <span className="rating-restaurant">
                      {rating.restaurantName}
                    </span>
                    <span className="rating-value">
                      {'⭐'.repeat(rating.rating)}
                    </span>
                    <span className="rating-date">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No ratings yet</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
