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
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB connected successfully`);

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
