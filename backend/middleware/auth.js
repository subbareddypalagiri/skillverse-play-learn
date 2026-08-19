import logger from '../config/logger.js';
import { extractTokenFromHeader, verifyToken, checkPermission } from '../utils/auth.js';
import { AuthenticationError, AuthorizationError, NotFoundError } from '../utils/errorHandler.js';
import { getOrCreateClerkUser } from '../utils/clerk.js';
import { verifyToken as verifyClerkToken } from '@clerk/backend';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    let userId;
    let user;

    // 1. Try custom token verification first (for testing/seeds/fallback)
    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        userId = decoded.userId;
        const User = (await import('../models/User.js')).default;
        user = await User.findById(userId).lean();
        if (!user) {
          throw new AuthenticationError('User not found');
        }
      }
    } catch (customError) {
      // 2. If custom verification fails, attempt Clerk token verification
      try {
        const decoded = await verifyClerkToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        const clerkUserId = decoded.sub;
        
        // Sync/get MongoDB user
        user = await getOrCreateClerkUser(clerkUserId);
        userId = user._id;
      } catch (clerkError) {
        logger.error(`Auth failed. Custom: ${customError.message}. Clerk: ${clerkError.message}`);
        throw new AuthenticationError('Invalid or expired token');
      }
    }

    req.user = user;
    req.userId = userId;
    
    logger.debug(`User authenticated: ${user.email}`);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('authorization');
    if (!authHeader) return next();

    const token = extractTokenFromHeader(authHeader);
    let userId;
    let user;

    try {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId) {
        userId = decoded.userId;
        const User = (await import('../models/User.js')).default;
        user = await User.findById(userId).lean();
      }
    } catch {
      try {
        const decoded = await verifyClerkToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        const clerkUserId = decoded.sub;
        user = await getOrCreateClerkUser(clerkUserId);
        userId = user._id;
      } catch {
        // Ignore both errors for optional authentication
      }
    }

    if (user) {
      req.user = user;
      req.userId = userId;
    }
    next();
  } catch {
    next();
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError(
          `Only ${allowedRoles.join(', ')} can access this resource`
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }
      
      // Allow admins to bypass ownership check
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resourceOwnerId = req.body[resourceField] || req.params[resourceField] || req.params.userId || req.params.id;
      
      if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
        throw new AuthorizationError('Not authorized to access this resource');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const checkResourceAccess = (Model, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }
      
      const resourceId = req.params[idParam];
      const resource = await Model.findById(resourceId).lean();
      
      if (!resource) {
        throw new NotFoundError('Resource not found');
      }
      
      const ownerId = resource.userId || resource.ownerId || resource.user || resource.authorId || resource.creatorId || resource.ambassadorId;
      // Check if user is owner or admin
      if ((!ownerId || ownerId.toString() !== req.user._id.toString()) && req.user.role !== 'admin') {
        throw new AuthorizationError('Not authorized to access this resource');
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
