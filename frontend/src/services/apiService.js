/**
 * API Service
 * Centralized API calls for restaurant data
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all restaurants with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Restaurants data
 */
export const getRestaurants = (filters) =>
  apiClient.get('/api/restaurants', { params: filters });

/**
 * Get restaurant details
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise} Restaurant data
 */
export const getRestaurantDetails = (restaurantId) =>
  apiClient.get(`/api/restaurants/${restaurantId}`);

/**
 * Get personalized recommendations
 * @returns {Promise} Recommendations array
 */
export const getRecommendations = () =>
  apiClient.get('/api/recommendations');

/**
 * Rate a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} reviewData - Review and rating data
 * @returns {Promise} Review response
 */
export const submitReview = (restaurantId, reviewData) =>
  apiClient.post(`/api/restaurants/${restaurantId}/reviews`, reviewData);

/**
 * Get price comparison for a food item
 * @param {Object|string} params - Food item name or filter parameters object
 * @returns {Promise} Price comparison data
 */
export const getPriceComparison = (params) => {
  if (typeof params === 'string') {
    // Legacy: if string is passed, treat as food item
    return apiClient.get('/api/price-comparison', { params: { foodItem: params } });
  }
  // New: pass object with filters
  return apiClient.get('/api/price-comparison', { params });
};

/**
 * Get price trends for a food item
 * @param {string} foodItem - Food item name
 * @param {number} days - Number of days to fetch (default: 30)
 * @returns {Promise} Price trend data
 */
export const getPriceTrends = (foodItem, days = 30) =>
  apiClient.get('/api/price-trends', { params: { foodItem, days } });

export default apiClient;
