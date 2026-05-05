/**
 * Admin Dashboard
 * Main hub for restaurant management
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../services/apiService';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    setAdminEmail(email);
    loadRestaurants();
  }, [navigate]);

  const loadRestaurants = async () => {
    try {
      const response = await getRestaurants();
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const handleEditRestaurant = (restaurantId) => {
    navigate(`/admin/edit-restaurant/${restaurantId}`);
  };

  const handleAddRestaurant = () => {
    navigate('/admin/add-restaurant');
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p>Manage Restaurants, Hours & Menu</p>
        </div>
        <div className="header-right">
          <span className="admin-email">👤 {adminEmail}</span>
          <button onClick={handleLogout} className="btn btn-danger btn-small">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <button className="nav-btn active">
          📋 Manage Restaurants
        </button>
        <button className="nav-btn" onClick={() => navigate('/admin/manage-hours')}>
          🕐 Operating Hours
        </button>
        <button className="nav-btn" onClick={() => navigate('/admin/manage-menu')}>
          🍽️ Menu Items
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h2>Restaurants</h2>
          <button onClick={handleAddRestaurant} className="btn btn-success">
            + Add New Restaurant
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search restaurants by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="result-count">{filteredRestaurants.length} results</span>
        </div>

        {/* Restaurant List */}
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : (
          <div className="restaurants-list">
            {filteredRestaurants.length > 0 ? (
              <table className="restaurants-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Cuisine</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant._id} className="restaurant-row">
                      <td>{restaurant._id}</td>
                      <td className="name-cell">
                        <span className="emoji">{restaurant.thumbnail}</span>
                        {restaurant.name}
                      </td>
                      <td>{restaurant.city}</td>
                      <td>{restaurant.cuisines?.join(', ')}</td>
                      <td>
                        <span className="rating-badge">⭐ {restaurant.rating}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>
                          {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEditRestaurant(restaurant._id)}
                          className="btn btn-small btn-primary"
                        >
                          ✏️ Edit
                        </button>
                        <button className="btn btn-small btn-info">
                          🕐 Hours
                        </button>
                        <button className="btn btn-small btn-warning">
                          🍽️ Menu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">
                <p>No restaurants found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
