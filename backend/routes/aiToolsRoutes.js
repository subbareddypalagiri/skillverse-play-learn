import express from 'express';
import {
  getAITools,
  getAIToolCategories,
  getAIToolsMeta,
  syncAITools,
} from '../controllers/aiToolsController.js';

const router = express.Router();

router.get('/', getAITools);
router.get('/categories', getAIToolCategories);
router.get('/meta', getAIToolsMeta);
router.post('/sync', syncAITools);

export default router;
