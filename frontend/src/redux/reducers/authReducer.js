/**
 * Authentication Reducer
 * Manages authentication state including login, signup, and user data
 */

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SET_USER,
  CLEAR_MESSAGE,
} from '../actions/authActions';

const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

/**
 * Auth Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Dispatch action
 * @returns {Object} Updated state
 */
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
        successMessage: action.message || 'Login successful!',
      };

    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        successMessage: null,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        successMessage: null,
      };

    case SET_USER:
      return { ...state, user: action.payload };

    case CLEAR_MESSAGE:
      return { ...state, successMessage: null, error: null };

    default:
      return state;
  }
};

export default authReducer;
