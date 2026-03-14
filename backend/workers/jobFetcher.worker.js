import 'dotenv/config';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import connectDB from '../config/database.js';

// Core modules
import { runFetchJobs } from '../agents/fetchAllJobs.js';
import { runIngestion } from '../agents/opportunity.ingestion.agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const OPPORTUNITIES_FILE = path.join(DATA_DIR, 'opportunities.json');

/**
 * Execute the fully automated Job Ingestion Pipeline
 */
export const executePipeline = async () => {
  logger.info('\n======================================');
  logger.info('[Scheduler] Starting automated job fetch pipeline');
  logger.info(`[Scheduler] Execution triggered at: ${new Date().toISOString()}`);
  logger.info('======================================');

  try {
    // 1. Fetch data from APIs and save to opportunities.json
    logger.info('[Scheduler] Step 1: Fetching external data...');
    const recordsFetched = await runFetchJobs();

    if (recordsFetched === 0) {
      logger.warn('[Scheduler] Pipeline stopped: No new jobs fetched');
      return;
    }

    // 2. Read the generated JSON file
    logger.info('[Scheduler] Step 2: Preparing ingestion agent...');
    if (!fs.existsSync(OPPORTUNITIES_FILE)) {
      throw new Error(`[Scheduler] Target file not found at ${OPPORTUNITIES_FILE}. Pipeline aborted.`);
    }

    const rawData = fs.readFileSync(OPPORTUNITIES_FILE, 'utf-8');
    const records = JSON.parse(rawData);

    // 3. Connect to Database (Required strictly inside the pipeline execution)
    await connectDB();
    
    // 4. Trigger the standard Opportunity Ingestion Agent
    logger.info(`[Scheduler] Step 3: Triggering ingestion for ${records.length} records...`);
    const ingestionResult = await runIngestion(records);

    logger.info('\n======================================');
    logger.info('[Scheduler] Pipeline execution COMPLETE');
    logger.info(`Inserted: ${ingestionResult.inserted}`);
    logger.info(`Updated : ${ingestionResult.updated}`);
    logger.info(`Failed  : ${ingestionResult.failed}`);
    logger.info('======================================\n');

  } catch (error) {
    logger.error(`[Scheduler] Pipeline CRASHED: ${error.message}`);
    logger.error(error.stack);
  }
};

/**
 * Initialize node-cron Scheduler
 * The `node-cron` expression handles standard Unix cron format.
 */
const startScheduler = () => {
  logger.info('[Scheduler] Automated Pipeline service started');
  logger.info('[Scheduler] Jobs will be fetched every day at 02:00 AM server time');

  // '0 2 * * *' = At 02:00 AM every day
  cron.schedule('0 2 * * *', async () => {
    logger.info('[Scheduler] Scheduled trigger activated...');
    await executePipeline();
  });
};

// Start the scheduler if this worker is executed directly
const isCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isCLI) {
  startScheduler();
}

export default startScheduler;
