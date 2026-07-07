import express from 'express';
import {
  getAITools,
  getAIToolCategories,
  getAIToolsMeta,
  syncAITools,
  analyzeCareerGap,
} from '../controllers/aiToolsController.js';

const router = express.Router();

router.get('/', getAITools);
router.get('/categories', getAIToolCategories);
router.get('/meta', getAIToolsMeta);
router.post('/sync', syncAITools);
router.post('/analyze-career-gap', analyzeCareerGap);

export default router;
