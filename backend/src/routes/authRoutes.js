/**
 * Authentication Routes
 * User registration, login, and profile endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  register
);

/**
 * @route POST /api/auth/login
 * @desc User login
 * @access Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, updateProfile);

module.exports = router;
