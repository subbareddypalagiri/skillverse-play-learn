import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// General API rate limiter (Configured for massive classroom / college WiFi testing)
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // 10,000 requests per 15 mins
  keyGenerator: (req) => req.user?._id?.toString() || req.headers['x-forwarded-for'] || req.ip,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === 'admin',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for key: ${req.user?._id || req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
});

// Authentication rate limiter (Configured to allow 100+ students signing up from same WiFi)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 500, // 500 attempts per 15 mins
  keyGenerator: (req) => req.body.email || req.headers['x-forwarded-for'] || req.ip,
  message: 'Too many login attempts, please try again later',
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for: ${req.body.email || req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later'
    });
  }
});

// Problem submission rate limiter (Allows rapid code testing during lab/class)
export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 submissions per minute
  keyGenerator: (req) => `${req.user?._id || req.ip}:submission`,
  message: 'Too many submissions, please wait before submitting again',
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Submission rate limit exceeded for user: ${req.user?._id || req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many submissions, please wait before submitting again'
    });
  }
});

// API key validation limiter
export const apikeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10000,
  keyGenerator: (req) => req.get('x-api-key') || req.ip,
  message: 'API rate limit exceeded',
  standardHeaders: false,
  legacyHeaders: false
});
