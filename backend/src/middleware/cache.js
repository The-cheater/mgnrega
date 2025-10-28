// Simple in-memory caching middleware
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      const age = Date.now() - timestamp;

      if (age < duration) {
        console.log(`Cache HIT: ${key} (age: ${Math.round(age / 1000)}s)`);
        return res.json(data);
      } else {
        cache.delete(key);
      }
    }

    console.log(`Cache MISS: ${key}`);

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache the response
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      return originalJson(data);
    };

    next();
  };
};

// Clear cache endpoint helper
export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

export default cacheMiddleware;
