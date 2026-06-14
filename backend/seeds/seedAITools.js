import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import AITool from '../models/AITool.js';
import { curatedAITools } from './curatedAITools.js';
import { syncLatestAIModels } from '../services/aiToolsSyncService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAITools = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for AI Tools Seed');

    let seeded = 0;
    for (const tool of curatedAITools) {
      const externalId = `curated:${tool.name.toLowerCase().replace(/\s+/g, '-')}`;
      await AITool.findOneAndUpdate(
        { externalId, source: 'curated' },
        {
          $set: {
            ...tool,
            source: 'curated',
            externalId,
            isLatest: false,
            isActive: true,
            lastSynced: new Date(),
          },
        },
        { upsert: true }
      );
      seeded++;
    }

    logger.info(`Seeded ${seeded} curated AI tools`);

    logger.info('Fetching latest models from Hugging Face...');
    const syncResult = await syncLatestAIModels();
    logger.info(`HF sync — inserted: ${syncResult.inserted}, updated: ${syncResult.updated}`);

    const total = await AITool.countDocuments({ isActive: true });
    logger.info(`Total AI tools in database: ${total}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('AI Tools seed failed:', error);
    process.exit(1);
  }
};

seedAITools();
