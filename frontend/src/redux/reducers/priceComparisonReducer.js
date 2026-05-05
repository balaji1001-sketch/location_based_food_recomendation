/**
 * Price Comparison Reducer
 * Manages price comparison and price trend data
 */

const initialState = {
  comparisons: {},
  priceHistory: {},
  loading: false,
  error: null,
};

const PRICE_TYPES = {
  FETCH_PRICE_COMPARISON: 'FETCH_PRICE_COMPARISON',
  FETCH_PRICE_HISTORY: 'FETCH_PRICE_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

/**
 * Price Comparison Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Dispatch action
 * @returns {Object} Updated state
 */
const priceComparisonReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRICE_TYPES.FETCH_PRICE_COMPARISON:
      return {
        ...state,
        comparisons: {
          ...state.comparisons,
          [action.payload.foodItem]: action.payload.data,
        },
      };

    case PRICE_TYPES.FETCH_PRICE_HISTORY:
      return {
        ...state,
        priceHistory: {
          ...state.priceHistory,
          [action.payload.foodItem]: action.payload.data,
        },
      };

    case PRICE_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };

    case PRICE_TYPES.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default priceComparisonReducer;
export { PRICE_TYPES };
