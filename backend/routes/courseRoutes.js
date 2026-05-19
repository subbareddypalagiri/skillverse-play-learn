import express from 'express';
import { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  enrollInCourse, 
  getMyEnrollments,
  completeCourse,
  updateProgress,
  getMyCredits
} from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Private routes (named paths — must be before /:id to avoid being shadowed)
router.get('/my-enrollments', authenticate, getMyEnrollments);
router.get('/my-credits', authenticate, getMyCredits);

// Public param route
router.get('/:id', getCourse);

// Private routes
router.use(authenticate);
router.post('/:id/enroll', enrollInCourse);
router.post('/:id/complete', completeCourse);
router.patch('/:id/progress', updateProgress);

// Author-only routes
router.post('/', authorize('instructor', 'admin'), createCourse);
router.patch('/:id', authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authorize('instructor', 'admin'), deleteCourse);

export default router;
