/**
 * Protected Route Component
 * Ensures only authenticated users can access certain routes
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminProtectedRoute({ children, isAdmin = false }) {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');

  // Admin protected route
  if (isAdmin) {
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  }

  // User protected route
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
