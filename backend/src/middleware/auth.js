/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 * Supports both MongoDB and Mock Database
 */

const jwt = require('jsonwebtoken');
const mockDB = require('../config/mockDB');

// Only load Mongoose User model if MongoDB is being used
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
let User;

if (!USE_MOCK_DB) {
  try {
    User = require('../models/User');
  } catch (e) {
    User = null;
  }
}

/**
 * Verify JWT and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');

    // Get user from token
    let user;
    if (User) {
      user = await User.findById(decoded.id);
    } else {
      user = mockDB.findUser({ _id: decoded.id });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const authenticateOptional = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development_secret');
      
      let user;
      if (User) {
        user = await User.findById(decoded.id);
      } else {
        user = mockDB.findUser({ _id: decoded.id });
      }
      
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};

module.exports = {
  authenticate,
  authenticateOptional,
};
