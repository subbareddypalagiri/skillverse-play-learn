import User from '../models/User.js';
import { generateTokens } from '../utils/auth.js';
import { 
  successResponse, 
  errorResponse 
} from '../utils/responseHandler.js';
import { 
  AuthenticationError, 
  ConflictError, 
  ValidationError,
  NotFoundError
} from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).setOptions({ includeDeleted: true });
    if (existingUser) {
      if (existingUser.isDeleted) {
        throw new ConflictError('Account with this email was previously deleted. Please contact support.');
      }
      throw new ConflictError('User with this email already exists');
    }

    // Create user — role is always 'student' for public registration
    const user = await User.create({
      name,
      email,
      password,
      role: 'student'
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    logger.info(`New user registered: ${user.email} (${user._id})`);

    return successResponse(res, 201, 'User registered successfully', {
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Please provide both email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Update last activity
    user.stats.lastActivityAt = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    logger.info(`User logged in: ${user.email}`);

    return successResponse(res, 200, 'Login successful', {
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return successResponse(res, 200, 'User profile fetched', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/auth/me
 * @access  Private
 */
export const updateMe = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name', 'avatar', 'bio', 'hobbies', 'skills', 'socialLinks'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates, updatedBy: req.userId },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return successResponse(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new ValidationError('Refresh token is required');
    }

    const { verifyRefreshToken, generateTokens } = await import('../utils/auth.js');
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const tokens = generateTokens(user._id);

    return successResponse(res, 200, 'Tokens refreshed', { tokens });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    // In a production app with Redis, we would blacklist the token here
    logger.info(`User logged out: ${req.userId}`);
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
