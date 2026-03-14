import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateMe,
  refreshToken,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes — with brute-force rate limiting
router.post('/register', authLimiter, validateUserRegistration, register);
router.post('/login', authLimiter, validateUserLogin, login);
router.post('/refresh', refreshToken);

// Private routes
router.use(authenticate);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.post('/logout', logout);

export default router;
