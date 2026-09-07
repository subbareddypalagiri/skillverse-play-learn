import Opportunity from '../models/Opportunity.js';
import AlertSubscription from '../models/AlertSubscription.js';
import logger from '../config/logger.js';

// ============================================================
// OPPORTUNITY SERVICE — Unified Business Logic Layer
// ============================================================
// Supports: IT jobs, internships, coding placements, and
// State & Central government recruitment notifications.
// Features compound indexing, dynamic search, and auto-expiry.
// ============================================================

/**
 * Build a MongoDB filter object from the given query parameters.
 *
 * @param {Object} params - Parsed query parameters
 * @returns {Object} Mongoose-compatible filter
 */
const buildFilter = (params = {}) => {
  const filter = {};

  // ── Type filter (job, internship, place, govt) ─────────────
  if (params.type && params.type !== 'all') {
    filter.type = params.type.toLowerCase();
  }

  // ── Category filter (Govt sectors: ap_state, central, etc.) ──
  if (params.category && params.category !== 'all') {
    filter.category = params.category.toLowerCase();
  }

  // ── Status filter (Default active for govt jobs) ─────────────
  if (params.status && params.status !== 'all') {
    filter.status = params.status;
  } else if (params.type === 'govt') {
    // Hide expired notices by default
    filter.status = { $ne: 'expired' };
  }

  // ── Education / Qualification filter ────────────────────────
  if (params.education && params.education !== 'all') {
    const edu = params.education.toLowerCase();
    let eduCondition = null;

    if (edu === 'btech') {
      eduCondition = [
        { qualification: { $regex: /b\.?tech|b\.?e|engineering/i } },
        { tags: { $in: [/b\.?tech/i, /engineering/i] } }
      ];
    } else if (edu === 'degree') {
      eduCondition = [
        { qualification: { $regex: /degree|bachelor|graduation|b\.?sc|b\.?com|b\.?a/i } },
        { tags: { $in: [/degree/i, /graduate/i] } }
      ];
    } else if (edu === 'diploma') {
      eduCondition = [
        { qualification: { $regex: /diploma|polytechnic|iti/i } },
        { tags: { $in: [/diploma/i, /polytechnic/i] } }
      ];
    } else if (edu === 'inter') {
      eduCondition = [
        { qualification: { $regex: /12th|intermediate|10\+2|matriculation/i } },
        { tags: { $in: [/12th/i, /intermediate/i] } }
      ];
    }

    if (eduCondition) {
      filter.$or = eduCondition;
    }
  }

  // ── Location filter ─────────────────────────────────────────
  if (params.location && params.location !== 'all') {
    filter.location = { $regex: params.location, $options: 'i' };
  }

  // ── Department filter (APPSC, SSC, RRB, etc.) ─────────────────
  if (params.department && params.department !== 'all') {
    filter.department = { $regex: params.department, $options: 'i' };
  }

  // ── Search across multiple text & tag fields ────────────────
  if (params.search && params.search.trim()) {
    const searchRegex = { $regex: params.search.trim(), $options: 'i' };
    const searchConditions = [
      { title: searchRegex },
      { organization: searchRegex },
      { department: searchRegex },
      { qualification: searchRegex },
      { skills: { $in: [new RegExp(params.search.trim(), 'i')] } },
      { tags: { $in: [new RegExp(params.search.trim(), 'i')] } }
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
      delete filter.$or;
    } else {
      filter.$or = searchConditions;
    }
  }

  return filter;
};

/**
 * Fetch paginated & filtered opportunities.
 *
 * @param {Object}  queryParams - { type, category, education, location, search, page, limit }
 * @returns {Object} { data, totalResults, currentPage, totalPages }
 */
export const getOpportunities = async (queryParams = {}) => {
  const page  = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(queryParams.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const filter = buildFilter(queryParams);

  const [data, totalResults] = await Promise.all([
    Opportunity.find(filter)
      .sort({ postedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
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
 */
export const getOpportunityById = async (id) => {
  return Opportunity.findById(id).lean();
};

/**
 * Bulk-ingest opportunity records.
 * Supports standard jobs and rich government notifications.
 */
export const ingestOpportunities = async (records = []) => {
  if (!Array.isArray(records) || records.length === 0) {
    return { inserted: 0, updated: 0, failed: 0, errors: ['No records provided'] };
  }

  const REQUIRED_FIELDS = ['title'];
  const VALID_TYPES = ['job', 'internship', 'place', 'govt'];

  const operations = [];
  const errors = [];

  for (let i = 0; i < records.length; i++) {
    const raw = records[i];

    // Field validation
    const missing = REQUIRED_FIELDS.filter(f => !raw[f]);
    if (missing.length > 0) {
      errors.push(`Record ${i}: missing required fields — ${missing.join(', ')}`);
      continue;
    }

    const normalizedType = (raw.type || 'govt').toLowerCase();
    if (!VALID_TYPES.includes(normalizedType)) {
      errors.push(`Record ${i}: invalid type "${raw.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
      continue;
    }

    // Determine expiresAt from explicit field or importantDates.lastDate
    let expiresAt = undefined;
    if (raw.expiresAt) {
      const parsed = new Date(raw.expiresAt);
      if (!isNaN(parsed.getTime())) expiresAt = parsed;
    } else if (raw.importantDates?.lastDate) {
      const parsed = new Date(raw.importantDates.lastDate);
      if (!isNaN(parsed.getTime())) expiresAt = parsed;
    }

    const doc = {
      title:               raw.title.trim(),
      organization:        (raw.organization || raw.department || 'Government of AP & India').trim(),
      type:                normalizedType,
      location:            (raw.location || (raw.category === 'ap_state' ? 'Andhra Pradesh' : 'India')).trim(),
      description:         raw.description?.trim() || '',
      skills:              Array.isArray(raw.skills) ? raw.skills.map(s => s.trim()) : [],
      applyLink:           (raw.applyLink || raw.officialApplyLink || '').trim(),
      officialApplyLink:   (raw.officialApplyLink || raw.applyLink || '').trim(),
      notificationPdfLink: (raw.notificationPdfLink || raw.notificationPdf || '').trim(),
      category:            raw.category?.trim() || undefined,
      department:          (raw.department || raw.organization || '').trim() || undefined,
      vacancies:           raw.vacancies?.trim() || undefined,
      qualification:       raw.qualification?.trim() || undefined,
      ageLimit:            raw.ageLimit?.trim() || undefined,
      salaryScale:         (raw.salaryScale || raw.salary || '').trim() || undefined,
      importantDates:      raw.importantDates || undefined,
      tags:                Array.isArray(raw.tags) ? raw.tags.map(t => t.trim()) : [],
      status:              expiresAt && expiresAt < new Date() ? 'expired' : (raw.status || 'active'),
      source:              (raw.source || 'verified_gazette').trim(),
      postedAt:            raw.postedAt ? new Date(raw.postedAt) : new Date(),
      expiresAt
    };

    // Clean up undefined fields
    Object.keys(doc).forEach(key => {
      if (doc[key] === undefined) delete doc[key];
    });

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

/**
 * Automatically archive expired opportunities where the deadline has passed.
 */
export const archiveExpiredOpportunities = async () => {
  const now = new Date();
  const res = await Opportunity.updateMany(
    {
      status: 'active',
      expiresAt: { $exists: true, $ne: null, $lt: now }
    },
    { $set: { status: 'expired' } }
  );

  if (res.modifiedCount > 0) {
    logger.info(`[OpportunitiesService] Archived ${res.modifiedCount} expired recruitment opportunities`);
  }
  return res.modifiedCount;
};

/**
 * Save or update user WhatsApp and Email alert subscription.
 */
export const subscribeAlerts = async ({ whatsapp, email, categories, userId }) => {
  if (!whatsapp) {
    throw new Error('Valid WhatsApp phone number is required');
  }

  const cleanWhatsapp = whatsapp.trim().replace(/[^0-9+]/g, '');
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;

  const subscription = await AlertSubscription.findOneAndUpdate(
    { whatsapp: cleanWhatsapp },
    {
      $set: {
        whatsapp: cleanWhatsapp,
        ...(cleanEmail && { email: cleanEmail }),
        ...(categories && Array.isArray(categories) && { categories }),
        ...(userId && { userId }),
        active: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  logger.info(`[OpportunitiesService] User alert preferences saved for WhatsApp: ${cleanWhatsapp}`);
  return subscription;
};
