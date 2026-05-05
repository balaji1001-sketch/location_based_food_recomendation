/**
 * Database Configuration
 * MongoDB connection setup and pooling with fallback to mock DB
 */

const mongoose = require('mongoose');
const mockDB = require('./mockDB');

/**
 * Connect to MongoDB with automatic fallback to mock DB
 * @returns {Promise} Mongoose connection promise or mock DB
 */
const connectDB = async () => {
  const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
  
  if (USE_MOCK_DB) {
    console.log(`
╔════════════════════════════════════════════╗
║  🚀 MOCK DATABASE MODE (Development)       ║
║  ⚠️  Using in-memory mock data              ║
║  📝 Real MongoDB not connected              ║
║  ℹ️  To use real DB, set MONGODB_URI        ║
╚════════════════════════════════════════════╝
    `);
    return mockDB;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.log(`Falling back to mock database for development...`);
    
    console.log(`
╔════════════════════════════════════════════╗
║  🚀 MOCK DATABASE MODE (Fallback)          ║
║  ⚠️  Using in-memory mock data              ║
║  📝 MongoDB not available                   ║
║  ℹ️  Install MongoDB to use real database    ║
║  🐳 Or use Docker: docker run -d \\         ║
║     -p 27017:27017 mongo                    ║
╚════════════════════════════════════════════╝
    `);
    
    return mockDB;
  }
};

module.exports = connectDB;
