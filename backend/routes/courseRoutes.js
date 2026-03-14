import express from 'express';
import { 
  getCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  enrollInCourse, 
  getMyEnrollments 
} from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Private routes (named paths — must be before /:id to avoid being shadowed)
router.get('/my-enrollments', authenticate, getMyEnrollments);

// Public param route
router.get('/:id', getCourse);

// Private routes
router.use(authenticate);
router.post('/:id/enroll', enrollInCourse);

// Author-only routes
router.post('/', authorize('instructor', 'admin'), createCourse);
router.patch('/:id', authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authorize('instructor', 'admin'), deleteCourse);

export default router;
