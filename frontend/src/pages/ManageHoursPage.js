/**
 * Manage Operating Hours Page
 * Edit restaurant operating hours for each day
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantDetails } from '../services/apiService';
import '../styles/AdminForms.css';

function ManageHoursPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hours, setHours] = useState({});

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
      return;
    }
    
    loadRestaurant();
  }, [restaurantId, navigate]);

  const loadRestaurant = async () => {
    try {
      const response = await getRestaurantDetails(restaurantId || 'all');
      const data = response.data.data;
      setRestaurant(data);
      setHours(data.operatingHours || getDefaultHours());
    } catch (err) {
      setError('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultHours = () => {
    const defaultHours = {};
    days.forEach(day => {
      defaultHours[day] = { open: '10:00', close: '22:00', closed: false };
    });
    return defaultHours;
  };

  const handleTimeChange = (day, field, value) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleClosedChange = (day, value) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Call API to update restaurant operating hours
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operatingHours: hours }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update hours');
      }

      setSuccess('Operating hours updated successfully!');
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

  const setQuickTemplate = (template) => {
    const templates = {
      standard: {
        monday: { open: '10:00', close: '22:00', closed: false },
        tuesday: { open: '10:00', close: '22:00', closed: false },
        wednesday: { open: '10:00', close: '22:00', closed: false },
        thursday: { open: '10:00', close: '22:00', closed: false },
        friday: { open: '10:00', close: '23:00', closed: false },
        saturday: { open: '10:00', close: '23:00', closed: false },
        sunday: { open: '11:00', close: '22:00', closed: false },
      },
      earlyClose: {
        monday: { open: '09:00', close: '16:00', closed: false },
        tuesday: { open: '09:00', close: '16:00', closed: false },
        wednesday: { open: '09:00', close: '16:00', closed: false },
        thursday: { open: '09:00', close: '16:00', closed: false },
        friday: { open: '09:00', close: '16:00', closed: false },
        saturday: { open: '09:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: false },
      },
      twentyFour: {
        monday: { open: '00:00', close: '23:59', closed: false },
        tuesday: { open: '00:00', close: '23:59', closed: false },
        wednesday: { open: '00:00', close: '23:59', closed: false },
        thursday: { open: '00:00', close: '23:59', closed: false },
        friday: { open: '00:00', close: '23:59', closed: false },
        saturday: { open: '00:00', close: '23:59', closed: false },
        sunday: { open: '00:00', close: '23:59', closed: false },
      },
    };
    setHours(templates[template]);
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
          <h1>🕐 Operating Hours</h1>
          <p>{restaurant?.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Quick Templates */}
        <div className="quick-templates">
          <p>Quick Templates:</p>
          <button onClick={() => setQuickTemplate('standard')} className="template-btn">
            Standard Hours
          </button>
          <button onClick={() => setQuickTemplate('earlyClose')} className="template-btn">
            Early Close (4:00 PM)
          </button>
          <button onClick={() => setQuickTemplate('twentyFour')} className="template-btn">
            24 Hours
          </button>
        </div>

        <div className="form-card">
          <div className="hours-grid">
            {days.map((day, idx) => (
              <div key={day} className="day-card">
                <div className="day-header">
                  <h3>{dayLabels[idx]}</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={hours[day]?.closed || false}
                      onChange={(e) => handleClosedChange(day, e.target.checked)}
                    />
                    <span>Closed</span>
                  </label>
                </div>

                {!hours[day]?.closed ? (
                  <div className="time-inputs">
                    <div className="time-group">
                      <label>Opens at</label>
                      <input
                        type="time"
                        value={hours[day]?.open || '10:00'}
                        onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                        className="time-input"
                      />
                    </div>
                    <div className="time-group">
                      <label>Closes at</label>
                      <input
                        type="time"
                        value={hours[day]?.close || '22:00'}
                        onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="closed-badge">
                    Closed all day
                  </div>
                )}
              </div>
            ))}
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
              {saving ? 'Saving...' : '💾 Save Hours'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageHoursPage;
