import { body, validationResult, param, query } from 'express-validator';
import { ValidationError } from '../utils/errorHandler.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => `${err.path ?? err.param}: ${err.msg}`);
    throw new ValidationError(`Validation failed: ${messages.join(', ')}`);
  }
  next();
};

// User Validators
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  validate
];

export const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Course Validators
export const validateCourseCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'Web Development', 'Cloud & DevOps', 'AI & ML', 'Data Science',
      'Blockchain', 'IoT', 'AR/VR', 'Programming', 'Cybersecurity', 'Quantum Tech'
    ])
    .withMessage('Invalid category'),
  body('level')
    .notEmpty().withMessage('Level is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level'),
  validate
];

// Problem Validators
export const validateProblemCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('difficulty')
    .notEmpty().withMessage('Difficulty is required')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeForces', 'AtCoder', 'CodeChef'])
    .withMessage('Invalid source'),
  body('externalUrl')
    .trim()
    .isURL()
    .withMessage('Valid URL is required'),
  validate
];

// Pagination Validators
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  validate
];

// ID Validators
export const validateObjectId = (param = 'id') => [
  param(param)
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid ID format'),
  validate
];
