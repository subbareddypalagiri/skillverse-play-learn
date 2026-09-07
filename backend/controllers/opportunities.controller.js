import {
  getOpportunities,
  getOpportunityById,
  ingestOpportunities,
  subscribeAlerts,
  sendTestAlertService
} from '../services/opportunities.service.js';
import { executeGovtPipeline } from '../agents/fetchGovtJobs.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

// ============================================================
// OPPORTUNITY CONTROLLER — HTTP → Service Bridge
// ============================================================

/**
 * @desc    List opportunities with filtering, search & pagination
 * @route   GET /api/opportunities
 * @query   type, category, education, department, status, location, search, page, limit
 * @access  Public
 */
export const listOpportunities = async (req, res, next) => {
  try {
    const { type, category, education, department, status, location, search, page, limit } = req.query;

    logger.info(`[OpportunitiesAPI] GET /opportunities`, {
      query: { type, category, education, department, status, location, search, page, limit },
      ip: req.ip
    });

    const result = await getOpportunities({
      type,
      category,
      education,
      department,
      status,
      location,
      search,
      page,
      limit
    });

    return paginatedResponse(res, 200, 'Opportunities fetched successfully', result.data, {
      page:  result.currentPage,
      limit: parseInt(limit, 10) || 20,
      total: result.totalResults
    });
  } catch (error) {
    logger.error(`[OpportunitiesAPI] GET /opportunities FAILED: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get a single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Public
 */
export const showOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      throw new NotFoundError('Opportunity not found');
    }

    return successResponse(res, 200, 'Opportunity details fetched', { opportunity });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk-ingest opportunity records (JSON array in body)
 * @route   POST /api/opportunities/ingest
 * @access  Private (admin-only via middleware)
 */
export const bulkIngest = async (req, res, next) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      throw new ValidationError('Request body must contain a "records" array');
    }

    if (records.length > 5000) {
      throw new ValidationError('Maximum 5,000 records per ingestion request');
    }

    logger.info(`[OpportunitiesAPI] Ingestion started: ${records.length} records`);
    const result = await ingestOpportunities(records);

    return successResponse(res, 200, 'Ingestion complete', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Subscribe to WhatsApp and Email recruitment alerts
 * @route   POST /api/opportunities/alerts/subscribe
 * @access  Public
 */
export const subscribeAlertsHandler = async (req, res, next) => {
  try {
    const { whatsapp, email, categories, userId } = req.body;

    if (!whatsapp || whatsapp.trim().length < 10) {
      throw new ValidationError('Please provide a valid 10-digit WhatsApp number');
    }

    const subscription = await subscribeAlerts({
      whatsapp,
      email,
      categories,
      userId: userId || req.user?.id
    });

    return successResponse(res, 201, 'Subscribed to recruitment alerts successfully', {
      subscription: {
        whatsapp: subscription.whatsapp,
        email: subscription.email,
        categories: subscription.categories,
        active: subscription.active
      }
    });
  } catch (error) {
    logger.error(`[OpportunitiesAPI] Alert subscription failed: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Trigger automated Government Job Sync & Auto-Expiry
 * @route   POST /api/opportunities/sync-govt
 * @access  Public / Admin
 */
export const syncGovtOpportunities = async (req, res, next) => {
  try {
    logger.info('[OpportunitiesAPI] Manual trigger: syncGovtOpportunities');
    const result = await executeGovtPipeline();

    return successResponse(res, 200, 'Government notifications synchronized successfully', result);
  } catch (error) {
    logger.error(`[OpportunitiesAPI] Govt sync failed: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Generate & test recruitment alert dispatch
 * @route   POST /api/opportunities/alerts/test
 * @access  Public
 */
export const testAlertHandler = async (req, res, next) => {
  try {
    const whatsapp = req.body?.whatsapp || req.query?.whatsapp;
    const email = req.body?.email || req.query?.email;

    if (!whatsapp) {
      throw new ValidationError('WhatsApp phone number is required to trigger test alert');
    }

    const result = await sendTestAlertService({ whatsapp, email });
    return successResponse(res, 200, 'Test alert generated successfully', result);
  } catch (error) {
    logger.error(`[OpportunitiesAPI] Test alert failed: ${error.message}`);
    next(error);
  }
};

