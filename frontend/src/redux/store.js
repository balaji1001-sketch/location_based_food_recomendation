/**
 * Main Redux Store Configuration
 * Combines all reducers and configures middleware
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import restaurantReducer from './reducers/restaurantReducer';
import recommendationReducer from './reducers/recommendationReducer';
import filterReducer from './reducers/filterReducer';
import priceComparisonReducer from './reducers/priceComparisonReducer';

/**
 * Root Reducer
 * Combines all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantReducer,
  recommendations: recommendationReducer,
  filters: filterReducer,
  priceComparison: priceComparisonReducer,
});

/**
 * Configure Store
 * Applies Redux middleware and DevTools integration
 */
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
