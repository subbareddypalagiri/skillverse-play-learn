import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === 'admin',
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
});

// Authentication rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5, // 5 attempts
  keyGenerator: (req) => req.body.email || req.ip,
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

// Problem submission rate limiter
export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  keyGenerator: (req) => `${req.user._id}:submission`,
  message: 'Too many submissions, please wait before submitting again',
  standardHeaders: false,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Submission rate limit exceeded for user: ${req.user._id}`);
    res.status(429).json({
      success: false,
      message: 'Too many submissions, please wait before submitting again'
    });
  }
});

// API key validation limiter
export const apikeyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  keyGenerator: (req) => req.get('x-api-key') || req.ip,
  message: 'API rate limit exceeded',
  standardHeaders: false,
  legacyHeaders: false
});
