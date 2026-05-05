/**
 * Navigation Component
 * Header navigation bar with links and user menu
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, clearMessage } from '../redux/actions/authActions';
import '../styles/Navigation.css';

/**
 * Navigation Bar Component
 * Displays navigation menu and user authentication state
 */
function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, successMessage } = useSelector((state) => state.auth);

  /**
   * Show notification when user logs in
   */
  useEffect(() => {
    if (successMessage && isAuthenticated) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, isAuthenticated, dispatch]);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <>
      {/* Success Notification */}
      {showNotification && (
        <div className="top-notification success">
          ✓ {successMessage || 'Account login successfully!'}
        </div>
      )}

      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo" onClick={() => navigate('/')}>
            🍽️ Food Recommendation
          </div>

          {/* Nav Menu */}
          <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => navigate('/restaurants')}
              >
                Restaurants
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => navigate('/price-comparison')}
              >
                Price Comparison
              </button>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    onClick={() => navigate('/recommendations')}
                  >
                    My Recommendations
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link"
                    onClick={() => navigate('/profile')}
                  >
                    {user?.name || 'Profile'}
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link signup-btn"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Hamburger Menu */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
