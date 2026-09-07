import express from 'express';
import {
  listOpportunities,
  showOpportunity,
  bulkIngest,
  subscribeAlertsHandler,
  syncGovtOpportunities
} from '../controllers/opportunities.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

// ============================================================
// OPPORTUNITY ROUTES — Mounted at /api/opportunities
// ============================================================
// Public endpoints require no authentication.
// Ingestion & Sync endpoints support admin / programmatic triggers.
// ============================================================

const router = express.Router();

// ── Public Endpoints ─────────────────────────────────────────
// GET  /api/opportunities                   → list with filters & pagination
// GET  /api/opportunities/:id               → single opportunity detail
// POST /api/opportunities/alerts/subscribe  → subscribe WhatsApp/Gmail for recruitment alerts
// POST /api/opportunities/sync-govt         → trigger automated govt jobs sync & auto-expiry
router.get('/',    listOpportunities);
router.post('/alerts/subscribe', subscribeAlertsHandler);
router.post('/sync-govt', syncGovtOpportunities);
router.get('/:id', showOpportunity);

// ── Admin-Only Endpoints ─────────────────────────────────────
// POST /api/opportunities/ingest            → bulk data import
router.post('/ingest', authenticate, authorize('admin'), bulkIngest);

export default router;
