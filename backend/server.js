import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import logger from './config/logger.js';
import connectDB from './config/database.js';

import { generalLimiter } from './middleware/rateLimiter.js';
import { requestLogger, corsHeaders, securityHeaders, notFound } from './middleware/general.js';
import { globalErrorHandler } from './utils/errorHandler.js';

// Server Setup

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================
// MIDDLEWARE SETUP
// ============================================================

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
// CORS — whitelist origins from env, fallback to localhost in dev
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Compression
app.use(compression());

// Logging
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Security headers
app.use(securityHeaders);

// ============================================================
// HEALTH CHECK & READY ENDPOINTS
// ============================================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

app.get('/ready', async (req, res) => {
  try {
    const dbConnection = mongoose.connection.readyState;
    const cacheConnection = true; // Redis is optional
    
    if (dbConnection === 1 && cacheConnection) {
      res.status(200).json({
        success: true,
        message: 'Server is ready',
        database: 'connected',
        cache: 'ready'
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Server is not ready',
        database: dbConnection === 1 ? 'connected' : 'disconnected',
        cache: cacheConnection ? 'ready' : 'unavailable'
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// ============================================================
// ROUTE IMPORTS
// ============================================================

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import opportunityRoutes from './routes/opportunities.routes.js';
import reelRoutes from './routes/reelRoutes.js';
import showcaseRoutes from './routes/showcaseRoutes.js';
import postRoutes from './routes/postRoutes.js';
import startScheduler from './workers/jobFetcher.worker.js';

const uploadsDirectory = path.resolve(process.cwd(), 'uploads');

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/reels', reelRoutes);
app.use('/api/v1/showcase', showcaseRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/uploads', express.static(uploadsDirectory));

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Skillverse API v1',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

app.use(notFound);
app.use(globalErrorHandler);

// ============================================================
// DATABASE INITIALIZATION
// ============================================================

const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Daily Scheduler Worker
    startScheduler();

    // Start Server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// ============================================================
// UNHANDLED REJECTION HANDLER
// ============================================================

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// ============================================================
// START APPLICATION
// ============================================================

initializeApp();

export default app;
