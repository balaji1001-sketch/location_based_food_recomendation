/**
 * Protected Route Component
 * Wrapper for routes that require authentication
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.Component} props.component - Component to render
 * @returns {React.Component} Either the requested component or redirect to login
 */
function ProtectedRoute({ component: Component }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
