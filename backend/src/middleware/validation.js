/**
 * Validation Middleware
 * Request validation utilities
 */

const { validationResult } = require('express-validator');

/**
 * Validation error handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
};
