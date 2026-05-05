/**
 * Redis Cache Configuration
 * In-memory caching for improved performance (optional)
 */

const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

/**
 * Connect to Redis (optional - won't block if unavailable)
 */
const connectRedis = async () => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn('⚠️  Redis connection timeout (optional service)');
      resolve(null);
    }, 5000);

    client.connect()
      .then(() => {
        clearTimeout(timeout);
        console.log('✅ Redis connected');
        resolve(client);

        client.on('error', (err) => {
          console.error('❌ Redis client error:', err);
        });

        client.on('reconnecting', () => {
          console.log('🔄 Redis reconnecting...');
        });
      })
      .catch((error) => {
        clearTimeout(timeout);
        console.warn('⚠️  Redis not available (optional):', error.message);
        resolve(null);
      });
  });
};

module.exports = {
  connectRedis,
  redisClient: client,
};
