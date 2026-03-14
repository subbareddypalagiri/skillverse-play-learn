import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logFn = res.statusCode >= 400 ? logger.warn : logger.info;
    
    logFn(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id || 'anonymous',
      userAgent: req.get('user-agent')
    });
  });
  
  next();
};

export const corsHeaders = (req, res, next) => {
  const origin = req.headers.origin || process.env.CORS_ORIGINS || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.setHeader('Access-Control-Allow-Credentials', process.env.CORS_CREDENTIALS || 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
};

export const securityHeaders = (req, res, next) => {
  // Already handled by Helmet, but can add custom headers here
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
};
