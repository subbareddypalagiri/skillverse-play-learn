import express from 'express';
import { 
  getJobs, 
  getJob, 
  getJobStats, 
  syncJobs 
} from '../controllers/jobController.js';
import { 
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controllers/jobApplicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJob);

// Admin-only routes
router.use(authenticate);
router.post('/sync', authorize('admin'), syncJobs);

// Job application routes (authenticated)
router.post('/:id/apply', applyForJob);
router.get('/applications/me', getMyApplications);
router.get('/:id/applications', authorize('admin', 'recruiter', 'company_admin'), getJobApplications);
router.patch('/applications/:applicationId/status', authorize('admin', 'recruiter', 'company_admin'), updateApplicationStatus);

export default router;
