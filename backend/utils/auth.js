import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { AuthenticationError, AuthorizationError } from './errorHandler.js';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader === 'Bearer undefined' || authHeader === 'Bearer null') {
    throw new AuthenticationError('Invalid authorization header');
  }
  return authHeader.substring(7);
};

export const checkPermission = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  
  if (!requiredRoles.includes(userRole)) {
    throw new AuthorizationError('Insufficient permissions');
  }
};

export const checkResourceOwnership = (resourceOwnerId, userId) => {
  if (resourceOwnerId.toString() !== userId.toString()) {
    throw new AuthorizationError('Not authorized to access this resource');
  }
};
