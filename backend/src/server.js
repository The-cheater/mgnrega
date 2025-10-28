import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose
import mgnregaRoutes from './routes/mgnrega.js';
import apiLimiter from './middleware/rateLimiter.js';
import cacheMiddleware from './middleware/cache.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Apply caching to MGNREGA routes (5 minute cache)
app.use('/api/mgnrega', cacheMiddleware(5 * 60 * 1000));

app.use('/api/mgnrega', mgnregaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Get URI from .env

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
// --- THIS IS THE FIX ---
// We remove the options object. The Mongoose driver will
// automatically handle the secure connection for an 'srv' address.
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
    // Start listening only after a successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

