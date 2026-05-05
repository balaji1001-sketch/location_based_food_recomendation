/**
 * Login Page Component — Food App with Split Layout
 * Two-column design: Login type selector on left, form on right
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearMessage } from '../redux/actions/authActions';
import '../styles/AuthPages.css';

/* Floating food items for background ambiance */
const FOOD_ITEMS = ['🍛', '🍕', '🌮', '🍜', '🥗', '🍱', '🧆', '🥘', '🍣', '🫕'];

function FloatingFoods() {
  return (
    <div className="food-floats" aria-hidden="true">
      {FOOD_ITEMS.map((emoji, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 10) + 3}%`,
            animationDuration: `${14 + i * 2}s`,
            animationDelay: `${i * 1.3}s`,
            fontSize: `${1.5 + (i % 3) * 0.5}rem`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/**
 * LoginPage Component with Split Layout
 */
function LoginPage() {
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  /* Redirect after successful login */
  useEffect(() => {
    if (isAuthenticated && successMessage) {
      const timer = setTimeout(() => navigate('/'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, successMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (loginType === 'admin') {
      if (email === 'admin@foodrecommendation.com' && password === 'admin123') {
        localStorage.setItem('adminToken', `admin_token_${Date.now()}`);
        localStorage.setItem('adminEmail', email);
        navigate('/admin/dashboard');
        return;
      }

      alert('Invalid admin credentials. Use admin@foodrecommendation.com / admin123');
      return;
    }

    dispatch(loginUser(email, password));
  };

  const handleDismissMessage = () => dispatch(clearMessage());

  return (
    <div className="auth-page">
      <FloatingFoods />

      <div className="login-split-container">
        {/* Left Side - Login Type Selector */}
        <div className="login-type-panel">
          <div className="login-type-header">
            <h2>Choose Login Type</h2>
          </div>

          <div className="login-type-buttons">
            <button
              className={`login-type-btn ${loginType === 'user' ? 'active' : ''}`}
              onClick={() => setLoginType('user')}
              disabled={loading}
            >
              <span className="btn-icon">👤</span>
              <span className="btn-label">User Login</span>
            </button>

            <button
              className={`login-type-btn ${loginType === 'admin' ? 'active' : ''}`}
              onClick={() => setLoginType('admin')}
              disabled={loading}
            >
              <span className="btn-icon">👑</span>
              <span className="btn-label">Admin Login</span>
            </button>
          </div>

          <div className="login-type-info">
            {loginType === 'user' ? (
              <div className="info-content">
                <h3>🍽️ Customer Access</h3>
                <p>Sign in as a regular user to explore restaurants, compare prices, and discover personalized recommendations.</p>
              </div>
            ) : (
              <div className="info-content">
                <h3>👑 Admin Access</h3>
                <p>Manage restaurants, update menu items, view analytics, and monitor business performance.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <div className="logo-icon-small">🍽️</div>
            <h1>{loginType === 'user' ? 'Welcome back!' : 'Admin Portal'}</h1>
            <p className="form-subtitle">
              {loginType === 'user' 
                ? 'Sign in to discover your next favourite meal' 
                : 'Sign in to manage your business'}
            </p>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="success-message" onClick={handleDismissMessage} role="alert">
              ✓ {successMessage}
            </div>
          )}
          {error && (
            <div className="error-message" onClick={handleDismissMessage} role="alert">
              ✕ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Username/Email */}
            <div className="form-group">
              <label htmlFor="email">
                {loginType === 'user' ? 'Email' : 'Username / Email'}
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  {loginType === 'user' ? '✉️' : '👤'}
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder={loginType === 'user' ? 'you@example.com' : 'admin@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Demo hint - only for user login */}
            {loginType === 'user' && (
              <div className="demo-hint">
                🧪 Demo — <strong>john@example.com</strong> / <strong>password123</strong>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Signing in…' : `🚀 ${loginType === 'user' ? 'Sign In' : 'Admin Sign In'}`}
            </button>
          </form>

          {/* Signup link - only for user login */}
          {loginType === 'user' && (
            <p className="auth-link">
              New here?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="link-button"
                disabled={loading}
              >
                Create an account →
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
