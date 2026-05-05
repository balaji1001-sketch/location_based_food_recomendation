/**
 * Add New Restaurant Page
 * Form to add a new restaurant to the system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminForms.css';

function AddRestaurantPage() {
  const navigate = useNavigate();
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
    thumbnail: '🍽️',
    latitude: '11.0',
    longitude: '79.0',
    avgPrice: '',
    cuisines: '',
  });

  // Check admin access
  if (!localStorage.getItem('adminToken')) {
    navigate('/admin/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      setError('Name, phone, address, and city are required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Call API to create new restaurant
      const response = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          avgPrice: parseInt(formData.avgPrice) || 200,
          cuisines: formData.cuisines ? formData.cuisines.split(',').map(c => c.trim()) : [],
          latitude: parseFloat(formData.latitude) || 11.0,
          longitude: parseFloat(formData.longitude) || 79.0,
          operatingHours: {
            monday: { open: '10:00', close: '22:00', closed: false },
            tuesday: { open: '10:00', close: '22:00', closed: false },
            wednesday: { open: '10:00', close: '22:00', closed: false },
            thursday: { open: '10:00', close: '22:00', closed: false },
            friday: { open: '10:00', close: '23:00', closed: false },
            saturday: { open: '10:00', close: '23:00', closed: false },
            sunday: { open: '11:00', close: '22:00', closed: false },
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create restaurant');
      }

      setSuccess('Restaurant created successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save restaurant');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-form-container">
        <div className="form-header">
          <button onClick={() => navigate('/admin/dashboard')} className="btn btn-back">
            ← Back
          </button>
          <h1>➕ Add New Restaurant</h1>
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
                <label>City *</label>
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
              <div className="form-group">
                <label>Cuisines (comma-separated)</label>
                <input
                  type="text"
                  name="cuisines"
                  value={formData.cuisines}
                  onChange={handleInputChange}
                  placeholder="e.g., Biryani, North Indian"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Average Price (₹)</label>
                <input
                  type="number"
                  name="avgPrice"
                  value={formData.avgPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 250"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
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
                  placeholder="restaurant@example.com"
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

          <div className="form-section">
            <h2>Location Information</h2>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, building, area"
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 11.0"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="e.g., 79.0"
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
              {saving ? 'Creating...' : '✅ Create Restaurant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRestaurantPage;
