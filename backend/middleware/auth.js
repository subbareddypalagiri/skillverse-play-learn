import logger from '../config/logger.js';
import { extractTokenFromHeader, verifyToken, checkPermission } from '../utils/auth.js';
import { AuthenticationError, AuthorizationError } from '../utils/errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.get('authorization'));
    const decoded = verifyToken(token);
    
    // Fetch user from database
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(decoded.userId).lean();
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    
    logger.debug(`User authenticated: ${user.email}`);
    next();
  } catch (error) {
    next(error);
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
      
      const resourceOwnerId = req.body[resourceField] || req.params.userId;
      
      if (resourceOwnerId.toString() !== req.user._id.toString()) {
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
        throw new AuthenticationError('Resource not found');
      }
      
      // Check if user is owner or admin
      if (resource.userId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AuthorizationError('Not authorized to access this resource');
      }
      
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
