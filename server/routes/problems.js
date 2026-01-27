import express from 'express';
import {
  getProblems,
  getProblem,
  getRecommendedProblems,
  recordProblemAttempt,
  getUserProblemHistory,
  getUserDifficultyLevel,
  syncProblemsFromSource,
  getCourseTopicProblems
} from '../controllers/problemController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all problems with filtering
router.get('/', getProblems);

// Get single problem
router.get('/:id', getProblem);

// Get problems for a course topic
router.get('/course/:courseId/topic/:topicIndex', getCourseTopicProblems);

// =====================================================
// PRIVATE ROUTES (Authenticated Users)
// =====================================================

// Get recommended problems after topic completion
router.get('/recommended/:courseId/:topicIndex', protect, getRecommendedProblems);

// Record problem attempt/submission
router.post('/:problemId/attempt', protect, recordProblemAttempt);

// Get user's problem history
router.get('/history/:userId', protect, getUserProblemHistory);

// Get user's difficulty level
router.get('/difficulty/:userId', protect, getUserDifficultyLevel);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Sync problems from external sources (Admin only)
router.post('/sync/:source', protect, authorize('admin'), syncProblemsFromSource);

export default router;
