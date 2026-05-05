/**
 * Recommendation Actions
 * Handles personalized recommendations and suggestions
 */

export const FETCH_RECOMMENDATIONS_REQUEST = 'FETCH_RECOMMENDATIONS_REQUEST';
export const FETCH_RECOMMENDATIONS_SUCCESS = 'FETCH_RECOMMENDATIONS_SUCCESS';
export const FETCH_RECOMMENDATIONS_FAILURE = 'FETCH_RECOMMENDATIONS_FAILURE';
export const RATE_RECOMMENDATION = 'RATE_RECOMMENDATION';

/**
 * Action Creator: Fetch Personalized Recommendations
 * @returns {function} Thunk function
 */
export const fetchRecommendations = () => async (dispatch) => {
  dispatch({ type: FETCH_RECOMMENDATIONS_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const data = await response.json();
    
    if (response.ok) {
      dispatch({ type: FETCH_RECOMMENDATIONS_SUCCESS, payload: data });
    } else {
      dispatch({ type: FETCH_RECOMMENDATIONS_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: FETCH_RECOMMENDATIONS_FAILURE, payload: error.message });
  }
};

/**
 * Action Creator: Rate a Recommendation
 * @param {string} restaurantId - Restaurant ID
 * @param {number} rating - Rating value (1-5)
 * @returns {function} Thunk function
 */
export const rateRecommendation = (restaurantId, rating) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recommendations/rate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, rating }),
      }
    );
    
    if (response.ok) {
      dispatch({ type: RATE_RECOMMENDATION, payload: { restaurantId, rating } });
    }
  } catch (error) {
    console.error('Error rating recommendation:', error);
  }
};
