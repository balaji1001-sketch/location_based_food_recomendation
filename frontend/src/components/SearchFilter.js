/**
 * Search Filter Component
 * Handles location, cuisine, budget, and rating filters
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FILTER_TYPES,
} from '../redux/reducers/filterReducer';
import '../styles/SearchFilter.css';

/**
 * SearchFilter Component
 * Provides filter controls for restaurant search
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback when filters change
 * @returns {React.Component} Filter panel element
 */
function SearchFilter({ onSearch }) {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [selectedFoods, setSelectedFoods] = useState(filters.cuisine || []);
  const [budgetRange, setBudgetRange] = useState(filters.budget || { min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState(filters.sortBy || 'rating');

  // Tamil Nadu Foods
  const TAMIL_NADU_FOODS = [
    { name: 'Idli', emoji: '🍚', id: 'idli' },
    { name: 'Dosa', emoji: '🥞', id: 'dosa' },
    { name: 'Poori', emoji: '🍞', id: 'poori' },
    { name: 'Vada', emoji: '🍩', id: 'vada' },
    { name: 'Sambar', emoji: '🍲', id: 'sambar' },
    { name: 'Rasam', emoji: '🥣', id: 'rasam' },
    { name: 'Biryani', emoji: '🍛', id: 'biryani' },
    { name: 'Chettinad Chicken', emoji: '🍗', id: 'chettinad' },
    { name: 'Uttapam', emoji: '🥞', id: 'uttapam' },
    { name: 'Appam', emoji: '🥣', id: 'appam' },
    { name: 'Puttu', emoji: '🍢', id: 'puttu' },
    { name: 'Pongal', emoji: '🍚', id: 'pongal' },
    { name: 'Payasam', emoji: '🍮', id: 'payasam' },
    { name: 'Halwa', emoji: '🍯', id: 'halwa' },
    { name: 'Kesari', emoji: '🟡', id: 'kesari' },
    { name: 'Upma', emoji: '🥣', id: 'upma' },
    { name: 'Medhu Vada', emoji: '🍩', id: 'medhu_vada' },
    { name: 'Filter Coffee', emoji: '☕', id: 'coffee' },
    { name: 'Parotta', emoji: '🥐', id: 'parotta' },
    { name: 'Kottu Parotta', emoji: '🍲', id: 'kottu' },
  ];

  // Budget options
  const BUDGET_OPTIONS = [
    { label: 'Low (< ₹200)', min: 0, max: 200 },
    { label: 'Medium (₹200 - 500)', min: 200, max: 500 },
    { label: 'High (> ₹500)', min: 500, max: 10000 },
  ];

  /**
   * Handle food selection
   * @param {string} foodId - Food ID
   */
  const handleFoodChange = (foodId) => {
    const updated = selectedFoods.includes(foodId)
      ? selectedFoods.filter((c) => c !== foodId)
      : [...selectedFoods, foodId];

    setSelectedFoods(updated);
    dispatch({ type: FILTER_TYPES.SET_CUISINE, payload: updated });
    onSearch?.();
  };

  /**
   * Handle budget selection
   * @param {Object} budget - Budget range
   */
  const handleBudgetChange = (budget) => {
    setBudgetRange(budget);
    dispatch({ type: FILTER_TYPES.SET_BUDGET, payload: budget });
    onSearch?.();
  };

  /**
   * Handle sort option change
   * @param {string} option - Sort criteria
   */
  const handleSortChange = (option) => {
    setSortBy(option);
    dispatch({ type: FILTER_TYPES.SET_SORT_BY, payload: option });
    onSearch?.();
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSelectedFoods([]);
    setBudgetRange({ min: 0, max: 10000 });
    setSortBy('rating');
    dispatch({ type: FILTER_TYPES.RESET_FILTERS });
    onSearch?.();
  };

  return (
    <div className="search-filter">
      <h3>Filter Restaurants</h3>

      {/* Location Filter */}
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by city or area..."
          defaultValue=""
          onChange={(e) => {
            dispatch({
              type: FILTER_TYPES.SET_LOCATION,
              payload: { city: e.target.value },
            });
          }}
        />
      </div>

      {/* Food Type Filter */}
      <div className="filter-group">
        <label className="filter-label">Tamil Nadu Foods</label>
        <div className="food-options">
          {TAMIL_NADU_FOODS.map((food) => (
            <label key={food.id} className="food-checkbox-label">
              <input
                type="checkbox"
                checked={selectedFoods.includes(food.id)}
                onChange={() => handleFoodChange(food.id)}
              />
              <span className="food-emoji">{food.emoji}</span>
              <span className="food-name">{food.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Filter */}
      <div className="filter-group">
        <label className="filter-label">Budget</label>
        <div className="budget-options">
          {BUDGET_OPTIONS.map((budget) => (
            <label key={budget.label} className="radio-label">
              <input
                type="radio"
                name="budget"
                checked={
                  budgetRange.min === budget.min &&
                  budgetRange.max === budget.max
                }
                onChange={() => handleBudgetChange(budget)}
              />
              <span>{budget.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="rating">⭐ Highest Rating</option>
          <option value="price">💰 Lowest Price</option>
          <option value="distance">📍 Nearest Distance</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        className="btn btn-secondary"
        onClick={handleClearFilters}
      >
        🔄 Clear Filters
      </button>
    </div>
  );
}

export default SearchFilter;
