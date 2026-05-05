/**
 * Manage Menu Items Page
 * Add, edit, and manage restaurant menu items
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurantDetails } from '../services/apiService';
import '../styles/AdminForms.css';

function ManageMenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack'];

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
      setMenu(data.menu || []);
    } catch (err) {
      setError('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      setError('Name and price are required');
      return;
    }

    if (editingId !== null) {
      // Edit existing item
      setMenu(menu.map(item => 
        item.id === editingId ? { ...newItem, id: editingId } : item
      ));
      setEditingId(null);
    } else {
      // Add new item
      setMenu([...menu, {
        ...newItem,
        price: parseFloat(newItem.price),
        id: Date.now(),
      }]);
    }

    setNewItem({
      name: '',
      price: '',
      category: 'Main Course',
      description: '',
    });
    setError('');
  };

  const handleEditItem = (item) => {
    setNewItem(item);
    setEditingId(item.id);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenu(menu.filter(item => item.id !== itemId));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewItem({
      name: '',
      price: '',
      category: 'Main Course',
      description: '',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Call API to update restaurant menu
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menu }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update menu');
      }

      setSuccess('Menu updated successfully!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save menu');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
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
          <h1>🍲 Menu Management</h1>
          <p>{restaurant?.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-card">
          {/* Add/Edit Item Form */}
          <div className="menu-form">
            <h2>{editingId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g., Butter Chicken"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  placeholder="e.g., 250"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group"></div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Item description"
                  className="form-input"
                  rows="2"
                />
              </div>
            </div>

            <div className="form-actions">
              {editingId && (
                <button 
                  onClick={handleCancelEdit} 
                  className="btn btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
              <button 
                onClick={handleAddItem} 
                className="btn btn-success"
              >
                {editingId ? '✏️ Update Item' : '➕ Add Item'}
              </button>
            </div>
          </div>

          {/* Menu List */}
          <div className="menu-list">
            <h2>Current Menu ({menu.length} items)</h2>
            
            {menu.length > 0 ? (
              <table className="menu-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item.id} className="menu-item-row">
                      <td className="item-name">{item.name}</td>
                      <td>
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td className="price">₹{item.price}</td>
                      <td className="description">{item.description || '-'}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="btn btn-small btn-primary"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn btn-small btn-danger"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-results">
                <p>No menu items yet. Add your first item above!</p>
              </div>
            )}
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
              {saving ? 'Saving...' : '💾 Save Menu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageMenuPage;
