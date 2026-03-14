import express from 'express';
import {
  listOpportunities,
  showOpportunity,
  bulkIngest
} from '../controllers/opportunities.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

// ============================================================
// OPPORTUNITY ROUTES — Mounted at /api/opportunities
// ============================================================
// These routes are entirely independent of existing Risee routes.
// Public endpoints require no authentication.
// Ingestion endpoint is admin-only.
// ============================================================

const router = express.Router();

// ── Public Endpoints ─────────────────────────────────────────
// GET /api/opportunities              → list with filters & pagination
// GET /api/opportunities/:id          → single opportunity detail
router.get('/',    listOpportunities);
router.get('/:id', showOpportunity);

// ── Admin-Only Endpoints ─────────────────────────────────────
// POST /api/opportunities/ingest      → bulk data import
router.post('/ingest', authenticate, authorize('admin'), bulkIngest);

export default router;
