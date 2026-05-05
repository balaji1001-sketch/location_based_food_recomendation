/**
 * Admin Login Page — Food App
 * Developer portal with warm spice theme + animations
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthPages.css';

const ADMIN_EMAIL    = 'admin@foodrecommendation.com';
const ADMIN_PASSWORD = 'admin123';

/* Subtle floating icons, fewer for the admin portal */
const ADMIN_FLOATS = ['📊', '🍽️', '⚙️', '📋', '🔐', '🧑‍💻'];

function FloatingFoods() {
  return (
    <div className="food-floats" aria-hidden="true">
      {ADMIN_FLOATS.map((emoji, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 16) + 4}%`,
            animationDuration: `${16 + i * 2.5}s`,
            animationDelay: `${i * 1.8}s`,
            fontSize: '1.5rem',
            opacity: 0.05,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminToken', 'admin_token_' + Date.now());
        localStorage.setItem('adminEmail', email);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password. Check the demo credentials below.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <FloatingFoods />

      <div className="auth-container">
        <div className="auth-card">

          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🍽️</div>
              FoodieFind
            </div>

            <div className="admin-badge">
              🧑‍💻 Developer Portal
            </div>

            <h1>Admin Access</h1>
            <p className="auth-subtitle">
              Manage restaurants, menus &amp; analytics
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="error-message"
              role="alert"
              onClick={() => setError('')}
            >
              ✕ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="auth-form" noValidate>

            <div className="form-group">
              <label>Admin Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@foodrecommendation.com"
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Authenticating…' : '🔐 Admin Login'}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <div className="demo-credentials">
              <strong>Demo Credentials</strong><br />
              📧 admin@foodrecommendation.com<br />
              🔑 admin123
            </div>

            <a href="/restaurants" className="link" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              ← Back to Restaurants
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;