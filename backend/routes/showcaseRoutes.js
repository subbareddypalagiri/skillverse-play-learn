import express from 'express';
import {
  getShowcase,
  connectGithub,
  connectLinkedIn,
  connectLeetCode,
  connectCodeforces,
  connectHackerrank,
  connectStackoverflow,
  connectDevto,
  connectPortfolio,
  connectCodepen,
  disconnectPlatform,
  refreshPlatform,
  updateVisibility,
  getShowcaseStats,
} from '../controllers/showcaseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', getShowcaseStats);
router.get('/', getShowcase);
router.get('/:userId', getShowcase);

router.post('/connect/github', connectGithub);
router.post('/connect/linkedin', connectLinkedIn);
router.post('/connect/leetcode', connectLeetCode);
router.post('/connect/codeforces', connectCodeforces);
router.post('/connect/hackerrank', connectHackerrank);
router.post('/connect/stackoverflow', connectStackoverflow);
router.post('/connect/devto', connectDevto);
router.post('/connect/portfolio', connectPortfolio);
router.post('/connect/codepen', connectCodepen);

router.delete('/disconnect/:platform', disconnectPlatform);
router.post('/refresh/:platform', refreshPlatform);
router.patch('/visibility', updateVisibility);

export default router;
