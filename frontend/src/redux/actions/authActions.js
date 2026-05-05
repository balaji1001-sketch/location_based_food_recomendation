/**
 * Authentication Actions
 * Handles user login, signup, and authentication state
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const SET_USER = 'SET_USER';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

/**
 * Action Creator: User Login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {function} Thunk function
 */
export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    // API call to authenticate user
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      dispatch({ type: LOGIN_SUCCESS, payload: data.user, message: data.message });
    } else {
      dispatch({ type: LOGIN_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

/**
 * Action Creator: User Signup
 * @param {Object} userData - User registration data
 * @returns {function} Thunk function
 */
export const signupUser = (userData) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      dispatch({ type: SIGNUP_SUCCESS, payload: data.user, message: data.message });
    } else {
      dispatch({ type: SIGNUP_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: SIGNUP_FAILURE, payload: error.message });
  }
};

/**
 * Action Creator: User Logout
 * @returns {Object} Action object
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  return { type: LOGOUT };
};

/**
 * Action Creator: Clear message
 * @returns {Object} Action object
 */
export const clearMessage = () => {
  return { type: CLEAR_MESSAGE };
};
