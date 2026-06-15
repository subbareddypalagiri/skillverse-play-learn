import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import connectDB from '../config/database.js';
import { executeAIToolsSync } from '../controllers/aiToolsController.js';
import { needsSync } from '../services/aiToolsSyncService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runAIToolsSyncJob = async () => {
  logger.info('[AIToolsScheduler] Starting AI tools sync job...');
  try {
    await connectDB();
    const result = await executeAIToolsSync();
    logger.info(`[AIToolsScheduler] Sync complete — inserted: ${result.inserted}, updated: ${result.updated}`);
    return result;
  } catch (error) {
    logger.error(`[AIToolsScheduler] Sync failed: ${error.message}`);
    throw error;
  }
};

const startAIToolsScheduler = () => {
  logger.info('[AIToolsScheduler] Service started — syncs daily at 03:00 AM');

  cron.schedule('0 3 * * *', async () => {
    logger.info('[AIToolsScheduler] Scheduled trigger activated');
    await runAIToolsSyncJob();
  });

  setTimeout(async () => {
    try {
      await connectDB();
      if (await needsSync()) {
        logger.info('[AIToolsScheduler] Stale data detected — triggering startup sync in background');
        // Run sync asynchronously in background without blocking startup thread
        executeAIToolsSync().catch(err => {
          logger.error(`[AIToolsScheduler] Background startup sync failed: ${err.message}`);
        });
      }
    } catch (err) {
      logger.warn(`[AIToolsScheduler] Startup sync skipped: ${err.message}`);
    }
  }, 5000);
};

const isCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isCLI) {
  runAIToolsSyncJob().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default startAIToolsScheduler;
