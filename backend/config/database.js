import mongoose from 'mongoose';
import logger from './logger.js';

// Global cache for Serverless environments (Vercel / AWS Lambda)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL;

    if (!mongoUri) {
      logger.error('MONGODB_URI is not defined in environment variables');
      if (process.env.VERCEL === '1') return null;
      throw new Error('MONGODB_URI is not defined');
    }

    // Return cached connection if already open
    if (cached.conn && mongoose.connection.readyState === 1) {
      return cached.conn;
    }

    if (!cached.promise) {
      logger.info('Connecting to MongoDB...');
      const opts = {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        // Serverless optimized connection pool
        maxPoolSize: process.env.VERCEL === '1' ? 10 : 100,
        minPoolSize: process.env.VERCEL === '1' ? 1 : 10,
      };

      cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
        logger.info(`MongoDB connected successfully (` + (process.env.VERCEL === '1' ? 'Serverless Cached Pool' : 'Standard Pool') + `)`);
        return mongooseInstance;
      });
    }

    cached.conn = await cached.promise;

    // Self-healing event listeners for runtime resilience
    if (!mongoose.connection._hasListeners) {
      mongoose.connection._hasListeners = true;
      mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB runtime connection error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected!');
        cached.conn = null;
        cached.promise = null;
      });
    }

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    logger.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    return null;
  }
};

export default connectDB;
