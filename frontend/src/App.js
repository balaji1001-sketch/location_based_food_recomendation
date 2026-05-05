/**
 * Main App Component
 * Root component that sets up routing and providers
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './redux/store';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import PriceComparisonPage from './pages/PriceComparisonPage';
import UserProfilePage from './pages/UserProfilePage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AddRestaurantPage from './pages/AddRestaurantPage';
import EditRestaurantPage from './pages/EditRestaurantPage';
import ManageHoursPage from './pages/ManageHoursPage';
import ManageMenuPage from './pages/ManageMenuPage';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Styles
import './styles/App.css';

/**
 * Main App Component
 * Provides Redux store and routing
 */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navigation />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
            <Route path="/price-comparison" element={<PriceComparisonPage />} />

            {/* Protected Routes */}
            <Route
              path="/recommendations"
              element={<ProtectedRoute component={RecommendationsPage} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute component={UserProfilePage} />}
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute isAdmin={true}>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/add-restaurant"
              element={
                <AdminProtectedRoute isAdmin={true}>
                  <AddRestaurantPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-restaurant/:restaurantId"
              element={
                <AdminProtectedRoute isAdmin={true}>
                  <EditRestaurantPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-hours/:restaurantId"
              element={
                <AdminProtectedRoute isAdmin={true}>
                  <ManageHoursPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-menu/:restaurantId"
              element={
                <AdminProtectedRoute isAdmin={true}>
                  <ManageMenuPage />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </Provider>
  );
}

export default App;
