/**
 * Authentication Controller
 * Handles user registration and login
 * Supports both MongoDB and Mock Database
 */

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
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
 * Register new user
 * @route POST /api/auth/register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    let user;
    if (User) {
      user = await User.findOne({ email });
    } else {
      user = mockDB.findUser({ email });
    }

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    if (User) {
      user = await User.create({
        name,
        email,
        password,
        preferences: preferences || {
          cuisines: [],
          dietaryRestrictions: [],
          budgetRange: 'medium',
        },
      });
    } else {
      user = mockDB.createUser({
        name,
        email,
        password,
        preferences: preferences || {
          cuisines: [],
          dietaryRestrictions: [],
          budgetRange: 'medium',
        },
      });
    }

    // Generate JWT token (mock JWT for development)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    let user;
    if (User) {
      user = await User.findOne({ email }).select('+password');
    } else {
      user = mockDB.findUser({ email });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // For mock DB, simple password check
    if (!User && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // For MongoDB, use password comparison method
    if (User) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'development_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        preferences: preferences || req.user.preferences,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
