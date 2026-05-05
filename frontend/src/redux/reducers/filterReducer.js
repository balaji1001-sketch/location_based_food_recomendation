/**
 * Filter Reducer
 * Manages search and filter state (location, cuisine, budget, etc.)
 */

const FILTER_TYPES = {
  SET_LOCATION: 'SET_LOCATION',
  SET_CUISINE: 'SET_CUISINE',
  SET_BUDGET: 'SET_BUDGET',
  SET_RATING: 'SET_RATING',
  SET_SORT_BY: 'SET_SORT_BY',
  RESET_FILTERS: 'RESET_FILTERS',
};

const initialState = {
  location: {
    latitude: null,
    longitude: null,
    city: '',
    radius: 5, // km
  },
  cuisine: [],
  budget: { min: 0, max: 10000 },
  rating: { min: 0, max: 5 },
  sortBy: 'rating', // options: 'rating', 'price', 'distance'
  dietary: [],
};

/**
 * Filter Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Dispatch action
 * @returns {Object} Updated state
 */
const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_TYPES.SET_LOCATION:
      return {
        ...state,
        location: { ...state.location, ...action.payload },
      };

    case FILTER_TYPES.SET_CUISINE:
      return {
        ...state,
        cuisine: action.payload,
      };

    case FILTER_TYPES.SET_BUDGET:
      return {
        ...state,
        budget: action.payload,
      };

    case FILTER_TYPES.SET_RATING:
      return {
        ...state,
        rating: action.payload,
      };

    case FILTER_TYPES.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload,
      };

    case FILTER_TYPES.RESET_FILTERS:
      return initialState;

    default:
      return state;
  }
};

export default filterReducer;
export { FILTER_TYPES };
