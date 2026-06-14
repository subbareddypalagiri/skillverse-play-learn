import AITool from '../models/AITool.js';
import { successResponse } from '../utils/responseHandler.js';
import { syncLatestAIModels, needsSync, ALL_CATEGORIES } from '../services/aiToolsSyncService.js';
import logger from '../config/logger.js';

let syncInProgress = false;

const formatTool = (tool) => ({
  id: tool._id,
  name: tool.name,
  description: tool.description,
  category: tool.category,
  link: tool.link,
  features: tool.features || [],
  isFree: tool.isFree,
  source: tool.source,
  isLatest: tool.isLatest,
  pipeline: tool.pipeline,
  author: tool.author,
  downloads: tool.downloads,
  lastSynced: tool.lastSynced,
});

export const getAITools = async (req, res, next) => {
  try {
    const { category, search, source, latest, limit = 500 } = req.query;

    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (source) query.source = source;
    if (latest === 'true') query.isLatest = true;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { author: regex },
      ];
    }

    const tools = await AITool.find(query)
      .sort({ isLatest: -1, downloads: -1, updatedAt: -1 })
      .limit(parseInt(limit));

    if (await needsSync()) {
      triggerBackgroundSync();
    }

    return successResponse(res, 200, 'AI tools fetched', {
      tools: tools.map(formatTool),
      total: tools.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getAIToolCategories = async (req, res, next) => {
  try {
    const counts = await AITool.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    const categories = [
      { name: 'All', count: total },
      ...ALL_CATEGORIES.filter((c) => categoryMap[c]).map((name) => ({
        name,
        count: categoryMap[name],
      })),
      ...counts
        .filter((c) => !ALL_CATEGORIES.includes(c._id))
        .map((c) => ({ name: c._id, count: c.count })),
    ];

    return successResponse(res, 200, 'Categories fetched', { categories });
  } catch (error) {
    next(error);
  }
};

export const getAIToolsMeta = async (req, res, next) => {
  try {
    const [total, curated, scraped, latest, lastSyncedDoc] = await Promise.all([
      AITool.countDocuments({ isActive: true }),
      AITool.countDocuments({ isActive: true, source: 'curated' }),
      AITool.countDocuments({ isActive: true, source: { $ne: 'curated' } }),
      AITool.countDocuments({ isActive: true, isLatest: true }),
      AITool.findOne({ source: { $ne: 'curated' } }).sort({ lastSynced: -1 }),
    ]);

    return successResponse(res, 200, 'AI tools meta', {
      total,
      curated,
      scraped,
      latest,
      lastSynced: lastSyncedDoc?.lastSynced || null,
      syncInProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const syncAITools = async (req, res, next) => {
  try {
    if (syncInProgress) {
      return successResponse(res, 200, 'Sync already in progress', { syncInProgress: true });
    }

    const result = await runSync();
    return successResponse(res, 200, 'AI tools synced successfully', result);
  } catch (error) {
    next(error);
  }
};

async function runSync() {
  syncInProgress = true;
  try {
    return await syncLatestAIModels();
  } finally {
    syncInProgress = false;
  }
}

function triggerBackgroundSync() {
  if (syncInProgress) return;
  logger.info('[AITools] Background sync triggered (stale data)');
  runSync().catch((err) => logger.error('[AITools] Background sync failed:', err.message));
}

export { runSync as executeAIToolsSync };
