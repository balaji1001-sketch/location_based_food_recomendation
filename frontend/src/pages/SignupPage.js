/**
 * Sign Up Page Component — Food App
 * Modern multi-field registration with cuisine preferences
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/actions/authActions';
import '../styles/AuthPages.css';

/* Floating food items */
const FOOD_ITEMS = ['🥙', '🍔', '🍩', '🌯', '🥪', '🍤', '🧁', '🥗', '🍲', '🫔'];

function FloatingFoods() {
  return (
    <div className="food-floats" aria-hidden="true">
      {FOOD_ITEMS.map((emoji, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 10) + 2}%`,
            animationDuration: `${13 + i * 1.8}s`,
            animationDelay: `${i * 1.1}s`,
            fontSize: `${1.4 + (i % 3) * 0.4}rem`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

const CUISINES = [
  { label: 'North Indian', icon: '🍛' },
  { label: 'South Indian', icon: '🫕' },
  { label: 'Chinese',      icon: '🥡' },
  { label: 'Italian',      icon: '🍝' },
  { label: 'Continental',  icon: '🥗' },
  { label: 'Street Food',  icon: '🌮' },
];

/**
 * SignupPage Component
 */
function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      cuisines: [],
      dietaryRestrictions: [],
      budgetRange: 'medium',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuisineChange = (cuisine) => {
    const next = formData.preferences.cuisines.includes(cuisine)
      ? formData.preferences.cuisines.filter((c) => c !== cuisine)
      : [...formData.preferences.cuisines, cuisine];

    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, cuisines: next },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    dispatch(signupUser({
      name:        formData.name,
      email:       formData.email,
      password:    formData.password,
      preferences: formData.preferences,
    }));

    setTimeout(() => navigate('/'), 1000);
  };

  /* Simple step indicator based on filled fields */
  const filledCount = [formData.name, formData.email, formData.password, formData.confirmPassword]
    .filter(Boolean).length;
  const stepIndex = Math.min(Math.floor(filledCount / 1.1), 3);

  return (
    <div className="auth-page">
      <FloatingFoods />

      <div className="auth-container" style={{ maxWidth: 460 }}>

        {/* Logo */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🍽️</div>
            FoodieFind
          </div>

          {/* Progress dots */}
          <div className="steps-indicator" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`step-dot ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}`}
              />
            ))}
          </div>

          <h1>Join the table 🎉</h1>
          <p className="auth-subtitle">Create an account to get personalised food picks</p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message" role="alert">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* ── Personal Info ── */}
          <div className="section-label">Your info</div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Priya Sharma"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* ── Security ── */}
          <div className="section-label">Security</div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* ── Cuisine Preferences ── */}
          <div className="section-label">Your taste</div>

          <div className="form-group">
            <label>Favourite Cuisines</label>
            <div className="checkbox-group">
              {CUISINES.map(({ label, icon }) => (
                <label key={label} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.preferences.cuisines.includes(label)}
                    onChange={() => handleCuisineChange(label)}
                    disabled={loading}
                  />
                  <span>{icon} {label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating your account…' : '🍽️ Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="auth-link">
          Already a foodie?{' '}
          <button onClick={() => navigate('/login')} className="link-button">
            Sign in →
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;