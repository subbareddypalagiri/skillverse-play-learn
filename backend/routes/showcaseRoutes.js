import express from 'express';
const router = express.Router();
import {
  getShowcase,
  connectGithub,
  connectLinkedIn,
  connectLeetCode,
  disconnectPlatform,
  refreshPlatform,
  updateVisibility
} from '../controllers/showcaseController.js';
import { authenticate } from '../middleware/auth.js';

// All routes require authentication
router.use(authenticate);

// Get showcase profile
router.get('/', getShowcase);
router.get('/:userId', getShowcase);

// Connect platforms
router.post('/connect/github', connectGithub);
router.post('/connect/linkedin', connectLinkedIn);
router.post('/connect/leetcode', connectLeetCode);

// Disconnect platform
router.delete('/disconnect/:platform', disconnectPlatform);

// Refresh/sync platform data
router.post('/refresh/:platform', refreshPlatform);

// Update visibility settings
router.patch('/visibility', updateVisibility);

export default router;
