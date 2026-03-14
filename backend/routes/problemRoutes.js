import express from 'express';
import { 
  getProblems, 
  getProblem, 
  getRecommendedProblems, 
  recordAttempt, 
  getMyProblemHistory 
} from '../controllers/problemController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProblems);

// Private routes (named paths — must be before /:id to avoid being shadowed)
router.get('/history/me', authenticate, getMyProblemHistory);
router.get('/recommended/:courseId/:topicIndex', authenticate, getRecommendedProblems);

// Public param route
router.get('/:id', getProblem);

// Private routes
router.use(authenticate);
router.post('/:id/attempt', recordAttempt);

export default router;
