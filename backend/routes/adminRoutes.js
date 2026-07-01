import express from 'express';
import {
  getSystemStats,
  listPendingApplications,
  createCourseAdmin,
  updateCourseAdmin,
  deleteCourseAdmin,
  createAIToolAdmin,
  updateAIToolAdmin,
  deleteAIToolAdmin,
  createProblemAdmin,
  updateProblemAdmin,
  deleteProblemAdmin,
  createJobAdmin,
  deleteJobAdmin
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Mount protection globally for all Admin Console CRUD actions
router.use(authenticate, authorize('admin'));

// System metrics
router.get('/stats', getSystemStats);
router.get('/applications', listPendingApplications);

// Course Management
router.post('/courses', createCourseAdmin);
router.put('/courses/:id', updateCourseAdmin);
router.delete('/courses/:id', deleteCourseAdmin);

// AI Tools Configurator
router.post('/ai-tools', createAIToolAdmin);
router.put('/ai-tools/:id', updateAIToolAdmin);
router.delete('/ai-tools/:id', deleteAIToolAdmin);

// DSA Coding Problems
router.post('/problems', createProblemAdmin);
router.put('/problems/:id', updateProblemAdmin);
router.delete('/problems/:id', deleteProblemAdmin);

// Careers
router.post('/jobs', createJobAdmin);
router.delete('/jobs/:id', deleteJobAdmin);

// Mentor Application Action relay
import { reviewMentorApplication } from '../controllers/syncApplicationController.js';
router.put('/mentor-applications/:id/review', reviewMentorApplication);

// Clubs and Events creators
import { createClubAdmin, createEventAdmin, listEventsAdmin, deleteEventAdmin } from '../controllers/adminController.js';
router.post('/clubs', createClubAdmin);
router.post('/events', createEventAdmin);
router.get('/events', listEventsAdmin);
router.delete('/events/:id', deleteEventAdmin);

export default router;
