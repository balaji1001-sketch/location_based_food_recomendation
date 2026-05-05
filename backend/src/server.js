/**
 * Main Server File
 * Express app setup and server initialization
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const priceRoutes = require('./routes/priceRoutes');

// Initialize Express app
const app = express();

// ==================== Middleware ====================

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later',
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== Routes ====================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/price-comparison', priceRoutes);
app.use('/api/price-trends', priceRoutes);

// ==================== Error Handling ====================

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// ==================== Database Connection ====================

/**
 * Connect to databases and start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB (or use mock DB if not available)
    const dbConnection = await connectDB();

    // Try to connect to Redis (optional, won't fail if not available)
    try {
      await connectRedis();
    } catch (redisError) {
      console.warn('⚠️  Redis not available, caching disabled');
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      const dbMode = dbConnection._id ? '🗄️  MongoDB' : '💾 Mock Database';
      console.log(`
╔════════════════════════════════════════════╗
║   Food Recommendation Backend Server       ║
║   ✅ Server running on port ${PORT}        ║
║   ${dbMode} connected                      ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
