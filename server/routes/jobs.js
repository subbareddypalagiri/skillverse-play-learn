import express from 'express';
import {
  fetchAndCacheJobs,
  getAllJobs,
  getJobById,
  searchJobs,
  getJobStats,
  clearOldJobs,
  addManualJob
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.get('/all', getAllJobs);
router.get('/stats', getJobStats);
router.get('/:id', getJobById);
router.post('/search', searchJobs);

// Admin routes (refresh from API)
router.post('/refresh', fetchAndCacheJobs);
router.post('/clear-old', clearOldJobs);
router.post('/add-manual', addManualJob);

export default router;
