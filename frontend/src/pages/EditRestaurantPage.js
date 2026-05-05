/**
 * Edit Restaurant Page
 * Allows editing restaurant name, description, contact info
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantDetails } from '../services/apiService';
import '../styles/AdminForms.css';

function EditRestaurantPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    thumbnail: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    // Check admin access
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }
    
    loadRestaurant();
  }, [restaurantId, navigate]);

  const loadRestaurant = async () => {
    try {
      const response = await getRestaurantDetails(restaurantId);
      const data = response.data.data;
      setRestaurant(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        address: data.address || '',
        city: data.city || '',
        thumbnail: data.thumbnail || '🍽️',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
      });
    } catch (err) {
      setError('Failed to load restaurant details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Call API to update restaurant
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update restaurant');
      }
      
      setSuccess('Restaurant details updated successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRestaurant = () => {
    if (window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      setError('');
      setSuccess('');
      setSaving(true);
      
      // Simulate delete operation
      setTimeout(() => {
        setSuccess('Restaurant deleted successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      }, 1000);
    }
  };

  if (loading) {
    return <div className="admin-page loading">Loading...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-form-container">
        <div className="form-header">
          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-back">
            ← Back
          </button>
          <h1>✏️ Edit Restaurant</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-card">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Restaurant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thumbnail Emoji</label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="e.g., 🍽️"
                  className="form-input"
                  maxLength="2"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Trichy"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Restaurant description"
                  className="form-input"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude (Lat)</label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 10.8234"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Longitude (Long)</label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 78.6750"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91-xxx-xxxxxx"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3>Quick Actions</h3>
          <div className="links-grid">
            <button 
              className="quick-link"
              onClick={() => navigate(`/admin/manage-hours/${restaurantId}`)}
            >
              ⏰ Edit Operating Hours
            </button>
            <button 
              className="quick-link"
              onClick={() => navigate(`/admin/manage-menu/${restaurantId}`)}
            >
              🍲 Manage Menu Items
            </button>
            <button 
              className="quick-link delete"
              onClick={handleDeleteRestaurant}
            >
              🗑️ Delete Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRestaurantPage;
