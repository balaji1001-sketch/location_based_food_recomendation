/**
 * Restaurants Page Component
 * Main page for searching and filtering restaurants
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/actions/restaurantActions';
import { getUserLocation } from '../services/locationService';
import { filterRestaurants, sortRestaurants } from '../services/searchService';
import SearchFilter from '../components/SearchFilter';
import RestaurantCard from '../components/RestaurantCard';
import MapModal from '../components/MapModal';
import '../styles/RestaurantsPage.css';

/**
 * RestaurantsPage Component
 * Displays restaurants with search and filtering capabilities
 */
function RestaurantsPage() {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector(
    (state) => state.restaurants
  );
  const filters = useSelector((state) => state.filters);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMapRestaurant, setSelectedMapRestaurant] = useState(null);

  /**
   * Get user's location and fetch nearby restaurants
   */
  useEffect(() => {
    /**
     * Fetch user location and restaurants
     */
    const initializePage = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);

        // Fetch restaurants near user
        dispatch(
          fetchRestaurants({
            latitude: location.latitude,
            longitude: location.longitude,
            radius: filters.location.radius,
          })
        );
      } catch (error) {
        console.error('Error getting location:', error);
        // Use default location if geolocation fails
        dispatch(fetchRestaurants({ limit: 20 }));
      }
    };

    initializePage();
  }, [dispatch, filters.location.radius]);

  /**
   * Apply filters and sort to restaurants
   */
  useEffect(() => {
    let filtered = filterRestaurants(restaurants, filters);
    filtered = sortRestaurants(filtered, filters.sortBy);
    setFilteredRestaurants(filtered);
  }, [restaurants, filters]);

  /**
   * Handle search filter changes
   */
  const handleSearch = () => {
    if (userLocation) {
      dispatch(
        fetchRestaurants({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          ...filters,
        })
      );
    }
  };

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1>Find Restaurants</h1>
        <p>Search and filter restaurants based on your preferences</p>
      </div>

      {/* Restaurants List View */}
      <div className="restaurants-container">
          {/* Sidebar Filter */}
          <aside className="sidebar">
            <SearchFilter onSearch={handleSearch} />
          </aside>

          {/* Main Content */}
          <main className="main-content">
            {/* Results Header */}
            <div className="results-header">
              <h2>
                {filteredRestaurants.length} Restaurants Found
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                Error loading restaurants: {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading restaurants...</p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              /* Restaurants Grid */
              <div className="restaurants-grid">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onMapClick={setSelectedMapRestaurant}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No restaurants found</h3>
                <p>Try adjusting your filters or searching in a different location</p>
              </div>
            )}
          </main>
      </div>

      {/* Map Modal */}
      {selectedMapRestaurant && (
        <MapModal
          restaurant={selectedMapRestaurant}
          onClose={() => setSelectedMapRestaurant(null)}
        />
      )}
    </div>
  );
}

export default RestaurantsPage;
