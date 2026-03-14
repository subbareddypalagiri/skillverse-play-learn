import {
  getOpportunities,
  getOpportunityById,
  ingestOpportunities
} from '../services/opportunities.service.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

// ============================================================
// OPPORTUNITY CONTROLLER — HTTP → Service bridge
// ============================================================
// Follows the same async/await + next(error) pattern used by
// the existing Risee controllers (jobController, courseController, etc.)
// ============================================================

/**
 * @desc    List opportunities with filtering, search & pagination
 * @route   GET /api/opportunities
 * @query   type, location, search, page, limit
 * @access  Public
 */
export const listOpportunities = async (req, res, next) => {
  try {
    const { type, location, search, page, limit } = req.query;

    logger.info(`[OpportunitiesAPI] GET /opportunities`, {
      query: { type, location, search, page, limit },
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    const result = await getOpportunities({ type, location, search, page, limit });

    logger.info(`[OpportunitiesAPI] Response: ${result.totalResults} total results, page ${result.currentPage}, returning ${result.data.length} items`);

    return paginatedResponse(res, 200, 'Opportunities fetched successfully', result.data, {
      page:  result.currentPage,
      limit: parseInt(limit, 10) || 20,
      total: result.totalResults
    });
  } catch (error) {
    logger.error(`[OpportunitiesAPI] GET /opportunities FAILED`, {
      error: error.message,
      stack: error.stack,
      query: req.query
    });
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
    logger.info(`[OpportunitiesAPI] GET /opportunities/${id}`);

    const opportunity = await getOpportunityById(id);

    if (!opportunity) {
      logger.warn(`[OpportunitiesAPI] Opportunity not found: ${id}`);
      throw new NotFoundError('Opportunity not found');
    }

    logger.info(`[OpportunitiesAPI] Found opportunity: "${opportunity.title}" by ${opportunity.organization}`);
    return successResponse(res, 200, 'Opportunity details fetched', { opportunity });
  } catch (error) {
    logger.error(`[OpportunitiesAPI] GET /opportunities/${req.params.id} FAILED`, {
      error: error.message
    });
    next(error);
  }
};

/**
 * @desc    Bulk-ingest opportunity records (JSON array in body)
 * @route   POST /api/opportunities/ingest
 * @access  Private (admin-only via middleware)
 *
 * Expected body:
 *   { "records": [ { title, organization, type, location, ... }, ... ] }
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

    logger.info(`[OpportunitiesAPI] Ingestion complete`, {
      inserted: result.inserted,
      updated: result.updated,
      failed: result.failed,
      errors: result.errors?.length || 0
    });

    return successResponse(res, 200, 'Ingestion complete', result);
  } catch (error) {
    next(error);
  }
};
