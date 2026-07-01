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
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:8083,http://localhost:8084,http://localhost:8085,http://localhost:8086')
  .split(',')
  .map(o => o.trim());

// Allow all Vercel preview deployment URLs automatically
const vercelPreviewPattern = /^https:\/\/skillverse-play-learn-wzcb.*\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (vercelPreviewPattern.test(origin)) {
      // Allow all Vercel preview deployments for this project
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

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Skillverse Play Learn Backend API is running on Vercel',
    docs: '/api/v1',
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

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
import syncRoutes from './routes/syncRoutes.js';
import aiToolsRoutes from './routes/aiToolsRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import startScheduler from './workers/jobFetcher.worker.js';
import startAIToolsScheduler from './workers/aiToolsSync.worker.js';

const isServerless = !!process.env.VERCEL;
const uploadsDirectory = path.resolve(isServerless ? '/tmp' : process.cwd(), 'uploads');

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
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/ai-tools', aiToolsRoutes);
app.use('/api/v1/live', liveRoutes);
app.use('/api/v1/admin', adminRoutes);
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

    // Start Daily Scheduler Workers
    startScheduler();
    startAIToolsScheduler();

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
// START APPLICATION
// ============================================================

// Connect DB on module load (for Vercel serverless + normal server)
const startDB = async () => {
  try {
    await connectDB();
    // Only start scheduler workers in non-serverless environments
    if (process.env.VERCEL !== '1') {
      startScheduler();
      startAIToolsScheduler();
    }
  } catch (error) {
    logger.error('Failed to connect to DB:', error);
  }
};

// Start DB connection immediately
startDB();

// Normal server mode (Railway, local, Render etc.)
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    logger.info(`Health Check: http://localhost:${PORT}/health`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      mongoose.connection.close(false);
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    server.close(() => {
      mongoose.connection.close(false);
      process.exit(0);
    });
  });
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

export default app;
