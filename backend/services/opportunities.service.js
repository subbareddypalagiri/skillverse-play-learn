import Opportunity from '../models/Opportunity.js';
import logger from '../config/logger.js';

// ============================================================
// OPPORTUNITY SERVICE — Business logic layer
// ============================================================
// Clean separation: controllers call service methods, services
// call the database. No Express req/res objects leak into here.
// ============================================================

/**
 * Build a MongoDB filter object from the given query parameters.
 * Supports: type, location, search (regex across title/org/skills).
 *
 * @param {Object} params - Parsed query parameters
 * @returns {Object} Mongoose-compatible filter
 */
const buildFilter = (params = {}) => {
  const filter = {};

  // ── Type filter (exact match) ──────────────────────────────
  if (params.type) {
    filter.type = params.type.toLowerCase();
  }

  // ── Location filter (case-insensitive partial match) ───────
  if (params.location) {
    filter.location = { $regex: params.location, $options: 'i' };
  }

  // ── Search across multiple text fields ─────────────────────
  if (params.search) {
    const searchRegex = { $regex: params.search, $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { organization: searchRegex },
      { skills: { $in: [new RegExp(params.search, 'i')] } }
    ];
  }

  return filter;
};

/**
 * Fetch paginated & filtered opportunities.
 *
 * @param {Object}  queryParams             - { type, location, search, page, limit }
 * @param {number}  [queryParams.page=1]    - Current page (1-indexed)
 * @param {number}  [queryParams.limit=20]  - Results per page (max 100)
 * @returns {Object} { data, totalResults, currentPage, totalPages }
 */
export const getOpportunities = async (queryParams = {}) => {
  const page  = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const filter = buildFilter(queryParams);

  // Run count + data queries in parallel for speed
  const [data, totalResults] = await Promise.all([
    Opportunity.find(filter)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),                       // .lean() returns plain JS objects → faster
    Opportunity.countDocuments(filter)
  ]);

  return {
    data,
    totalResults,
    currentPage: page,
    totalPages: Math.ceil(totalResults / limit)
  };
};

/**
 * Fetch a single opportunity by its MongoDB _id.
 *
 * @param {string} id - Opportunity _id
 * @returns {Object|null} The opportunity document or null
 */
export const getOpportunityById = async (id) => {
  return Opportunity.findById(id).lean();
};

/**
 * Bulk-ingest an array of opportunity records.
 *
 * Responsibilities:
 *   1. Validate required fields on every record.
 *   2. Normalize data (lowercase type, trim strings).
 *   3. Detect duplicates via the compound key: title+org+type+source.
 *   4. Upsert (insert-or-update) in a single bulk operation.
 *
 * Performance: bulkWrite batches → 1,000 records in ~2-3 seconds.
 *
 * @param {Array<Object>} records - Raw opportunity data
 * @returns {Object} { inserted, updated, failed, errors }
 */
export const ingestOpportunities = async (records = []) => {
  if (!Array.isArray(records) || records.length === 0) {
    return { inserted: 0, updated: 0, failed: 0, errors: ['No records provided'] };
  }

  const REQUIRED_FIELDS = ['title', 'organization', 'type', 'location'];
  const VALID_TYPES = ['job', 'internship', 'place'];

  const operations = [];
  const errors = [];

  for (let i = 0; i < records.length; i++) {
    const raw = records[i];

    // ── Field validation ───────────────────────────────────────
    const missing = REQUIRED_FIELDS.filter(f => !raw[f]);
    if (missing.length > 0) {
      errors.push(`Record ${i}: missing required fields — ${missing.join(', ')}`);
      continue;
    }

    const normalizedType = raw.type.toLowerCase();
    if (!VALID_TYPES.includes(normalizedType)) {
      errors.push(`Record ${i}: invalid type "${raw.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
      continue;
    }

    // ── Normalize & build upsert ───────────────────────────────
    const doc = {
      title:        raw.title.trim(),
      organization: raw.organization.trim(),
      type:         normalizedType,
      location:     raw.location.trim(),
      description:  raw.description?.trim()   || '',
      skills:       Array.isArray(raw.skills) ? raw.skills.map(s => s.trim()) : [],
      applyLink:    raw.applyLink?.trim()      || '',
      source:       (raw.source || 'manual').trim(),
      postedAt:     raw.postedAt  ? new Date(raw.postedAt)  : new Date(),
      expiresAt:    raw.expiresAt ? new Date(raw.expiresAt) : undefined
    };

    // Remove undefined expiresAt so Mongoose doesn't store null
    if (!doc.expiresAt) delete doc.expiresAt;

    operations.push({
      updateOne: {
        filter: {
          title:        doc.title,
          organization: doc.organization,
          type:         doc.type,
          source:       doc.source
        },
        update: { $set: doc },
        upsert: true
      }
    });
  }

  // ── Execute bulk operation ───────────────────────────────────
  let inserted = 0;
  let updated  = 0;

  if (operations.length > 0) {
    try {
      const result = await Opportunity.bulkWrite(operations, { ordered: false });
      inserted = result.upsertedCount || 0;
      updated  = result.modifiedCount || 0;

      logger.info(`Opportunity ingestion complete: ${inserted} inserted, ${updated} updated, ${errors.length} failed`);
    } catch (bulkError) {
      logger.error('Bulk ingestion error:', bulkError.message);
      errors.push(`Bulk write error: ${bulkError.message}`);
    }
  }

  return {
    inserted,
    updated,
    failed: errors.length,
    errors
  };
};
