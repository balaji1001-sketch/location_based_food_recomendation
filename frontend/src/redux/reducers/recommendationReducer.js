/**
 * Recommendation Reducer
 * Manages recommendation state and personalized suggestions
 */

import {
  FETCH_RECOMMENDATIONS_REQUEST,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAILURE,
  RATE_RECOMMENDATION,
} from '../actions/recommendationActions';

const initialState = {
  recommendations: [],
  loading: false,
  error: null,
  ratings: {},
};

/**
 * Recommendation Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Dispatch action
 * @returns {Object} Updated state
 */
const recommendationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECOMMENDATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        recommendations: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_RECOMMENDATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RATE_RECOMMENDATION:
      return {
        ...state,
        ratings: {
          ...state.ratings,
          [action.payload.restaurantId]: action.payload.rating,
        },
      };

    default:
      return state;
  }
};

export default recommendationReducer;
