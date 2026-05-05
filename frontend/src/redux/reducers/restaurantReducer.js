/**
 * Restaurant Reducer
 * Manages restaurant list state, filtering, and sorting
 */

import {
  FETCH_RESTAURANTS_REQUEST,
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_RESTAURANTS_FAILURE,
  SET_SELECTED_RESTAURANT,
} from '../actions/restaurantActions';

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
  totalCount: 0,
};

/**
 * Restaurant Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Dispatch action
 * @returns {Object} Updated state
 */
const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESTAURANTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        restaurants: action.payload.restaurants,
        totalCount: action.payload.totalCount,
        loading: false,
        error: null,
      };

    case FETCH_RESTAURANTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_SELECTED_RESTAURANT:
      return {
        ...state,
        selectedRestaurant: action.payload,
      };

    default:
      return state;
  }
};

export default restaurantReducer;
