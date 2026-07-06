import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    logger.info('Connecting to MongoDB...');

    const conn = await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 100, // High concurrency for 100+ classroom students
      minPoolSize: 10,
    });

    logger.info(`MongoDB connected successfully with pool size 100`);

    // Self-healing event listeners for runtime resilience
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected! Auto-reconnecting...');
    });

    // Enable query logging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, methodName, ...args) => {
        logger.debug(`${collectionName}.${methodName}`, JSON.stringify(args, null, 2));
      });
    }

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
