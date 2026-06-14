import AITool from '../models/AITool.js';
import logger from '../config/logger.js';

const HF_API = 'https://huggingface.co/api';

const PIPELINE_CATEGORY_MAP = {
  'text-generation': 'Language Models',
  'text2text-generation': 'Language Models',
  'image-text-to-text': 'Language Models',
  'text-to-image': 'Image Generation',
  'image-to-image': 'Image Generation',
  'text-to-video': 'Video & Animation',
  'image-to-video': 'Video & Animation',
  'automatic-speech-recognition': 'Speech & Voice',
  'text-to-speech': 'Speech & Voice',
  'audio-to-audio': 'Speech & Voice',
  'audio-classification': 'Speech & Voice',
  'image-classification': 'Vision & AI',
  'object-detection': 'Vision & AI',
  'image-segmentation': 'Vision & AI',
  'depth-estimation': 'Vision & AI',
  'translation': 'Translation',
  'summarization': 'Writing & NLP',
  'question-answering': 'Research & QA',
  'feature-extraction': 'Data & Embeddings',
  'sentence-similarity': 'Data & Embeddings',
  'reinforcement-learning': 'Agents & Automation',
  'robotics': 'Agents & Automation',
  'tabular-classification': 'Data & Embeddings',
  'text-classification': 'Writing & NLP',
  'token-classification': 'Writing & NLP',
  'zero-shot-classification': 'Language Models',
  'unconditional-image-generation': 'Image Generation',
  'visual-question-answering': 'Vision & AI',
};

const HF_FILTERS = [
  'text-generation',
  'text-to-image',
  'text-to-speech',
  'automatic-speech-recognition',
  'image-to-text',
  'translation',
  'text-to-video',
  'object-detection',
  'question-answering',
  'summarization',
  'reinforcement-learning',
  'image-text-to-text',
];

const formatDownloads = (n) => {
  if (!n) return 'New';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M downloads`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K downloads`;
  return `${n} downloads`;
};

const mapPipelineToCategory = (pipeline) =>
  PIPELINE_CATEGORY_MAP[pipeline] || 'Open Source';

const buildModelDescription = (model) => {
  const author = model.author || model.id?.split('/')?.[0] || 'Community';
  const pipeline = model.pipeline_tag || 'AI model';
  return `Latest ${pipeline.replace(/-/g, ' ')} model by ${author} — open-source on Hugging Face`;
};

const normalizeHFModel = (model) => {
  const pipeline = model.pipeline_tag || 'other';
  const shortName = model.id?.includes('/')
    ? model.id.split('/').slice(1).join('/')
    : model.id;

  return {
    name: shortName || model.id,
    description: buildModelDescription(model),
    category: mapPipelineToCategory(pipeline),
    link: `https://huggingface.co/${model.id}`,
    features: [
      'Latest',
      pipeline.replace(/-/g, ' '),
      formatDownloads(model.downloads),
      model.library_name || 'Open source',
    ].filter(Boolean),
    isFree: true,
    source: 'huggingface',
    externalId: model.id,
    pipeline,
    author: model.author || model.id?.split('/')?.[0],
    downloads: model.downloads || 0,
    isLatest: true,
    lastSynced: new Date(),
    isActive: true,
  };
};

async function fetchHFModels(filter, limit = 15) {
  const url = `${HF_API}/models?sort=lastModified&direction=-1&limit=${limit}&filter=${filter}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SkillVerse-AITools/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HF API ${filter}: ${res.status}`);
  return res.json();
}

async function fetchTrendingSpaces(limit = 20) {
  const url = `${HF_API}/spaces?sort=likes&direction=-1&limit=${limit}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SkillVerse-AITools/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return [];
  const spaces = await res.json();
  return spaces.slice(0, limit).map((space) => ({
    name: space.id?.split('/')?.pop() || space.id,
    description: space.description || `Interactive AI Space — ${space.id}`,
    category: 'AI Demos & Spaces',
    link: `https://huggingface.co/spaces/${space.id}`,
    features: ['Live demo', 'Free', `${space.likes || 0} likes`, 'Hugging Face'],
    isFree: true,
    source: 'huggingface-space',
    externalId: `space:${space.id}`,
    pipeline: 'space',
    author: space.author || space.id?.split('/')?.[0],
    downloads: space.likes || 0,
    isLatest: true,
    lastSynced: new Date(),
    isActive: true,
  }));
}

export async function syncLatestAIModels() {
  logger.info('[AIToolsSync] Starting latest AI models sync...');
  let inserted = 0;
  let updated = 0;
  const seen = new Set();

  try {
    for (const filter of HF_FILTERS) {
      try {
        const models = await fetchHFModels(filter, 12);
        for (const model of models) {
          if (!model?.id || seen.has(model.id)) continue;
          seen.add(model.id);

          const doc = normalizeHFModel(model);
          const result = await AITool.updateOne(
            { externalId: model.id, source: 'huggingface' },
            { $set: doc },
            { upsert: true }
          );
          if (result.upsertedCount > 0) inserted++;
          else if (result.modifiedCount > 0) updated++;
        }
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        logger.warn(`[AIToolsSync] Filter ${filter} failed: ${err.message}`);
      }
    }

    const spaces = await fetchTrendingSpaces(25);
    for (const space of spaces) {
      if (!space.externalId || seen.has(space.externalId)) continue;
      seen.add(space.externalId);
      const result = await AITool.updateOne(
        { externalId: space.externalId, source: 'huggingface-space' },
        { $set: space },
        { upsert: true }
      );
      if (result.upsertedCount > 0) inserted++;
      else if (result.modifiedCount > 0) updated++;
    }

    await AITool.updateMany(
      { source: { $in: ['huggingface', 'huggingface-space'] }, isLatest: true },
      { $set: { lastSynced: new Date() } }
    );

    logger.info(`[AIToolsSync] Done — inserted: ${inserted}, updated: ${updated}, total seen: ${seen.size}`);
    return { inserted, updated, total: seen.size };
  } catch (error) {
    logger.error('[AIToolsSync] Sync failed:', error);
    throw error;
  }
}

export async function needsSync() {
  const latest = await AITool.findOne({ source: { $ne: 'curated' } }).sort({ lastSynced: -1 });
  if (!latest) return true;
  const hoursSince = (Date.now() - latest.lastSynced.getTime()) / (1000 * 60 * 60);
  return hoursSince > 12;
}

export const ALL_CATEGORIES = [
  'Conversational',
  'Coding',
  'Design',
  'Writing',
  'Research',
  'Productivity',
  'Video & Audio',
  'Education',
  'Language Models',
  'Image Generation',
  'Speech & Voice',
  'Vision & AI',
  'Translation',
  'Writing & NLP',
  'Research & QA',
  'Data & Embeddings',
  'Agents & Automation',
  'Video & Animation',
  'AI Demos & Spaces',
  'Open Source',
];
