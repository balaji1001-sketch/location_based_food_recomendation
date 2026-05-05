/**
 * Restaurant Actions
 * Handles restaurant fetching, filtering, and sorting
 */

export const FETCH_RESTAURANTS_REQUEST = 'FETCH_RESTAURANTS_REQUEST';
export const FETCH_RESTAURANTS_SUCCESS = 'FETCH_RESTAURANTS_SUCCESS';
export const FETCH_RESTAURANTS_FAILURE = 'FETCH_RESTAURANTS_FAILURE';
export const SET_SELECTED_RESTAURANT = 'SET_SELECTED_RESTAURANT';

/**
 * Action Creator: Fetch Restaurants
 * Fetches restaurants based on location and filters
 * @param {Object} params - Query parameters
 * @returns {function} Thunk function
 */
export const fetchRestaurants = (params) => async (dispatch) => {
  dispatch({ type: FETCH_RESTAURANTS_REQUEST });
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/restaurants?${queryString}`
    );
    
    const data = await response.json();
    
    if (response.ok) {
      dispatch({
        type: FETCH_RESTAURANTS_SUCCESS,
        payload: {
          restaurants: data.data || [],
          totalCount: data.count || 0,
        }
      });
    } else {
      dispatch({ type: FETCH_RESTAURANTS_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: FETCH_RESTAURANTS_FAILURE, payload: error.message });
  }
};

/**
 * Action Creator: Set Selected Restaurant
 * @param {Object} restaurant - Restaurant details
 * @returns {Object} Action object
 */
export const setSelectedRestaurant = (restaurant) => ({
  type: SET_SELECTED_RESTAURANT,
  payload: restaurant,
});
