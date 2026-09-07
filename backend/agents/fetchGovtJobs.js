import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import connectDB from '../config/database.js';
import { ingestOpportunities, archiveExpiredOpportunities } from '../services/opportunities.service.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SEED_FILE = path.join(DATA_DIR, 'govt_jobs_seed.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'govt_opportunities.json');

/**
 * Parses date string (e.g. '2026-10-15' or '15 Oct 2026') into Date with end-of-day timestamp
 */
export const parseDeadline = (dateStr) => {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return undefined;
  parsed.setHours(23, 59, 59, 999);
  return parsed;
};

/**
 * Fetch, normalize and generate Government Recruitment opportunities.
 */
export const runFetchGovtJobs = async () => {
  try {
    logger.info('[GovtDataFetch] Loading verified government recruitment seed & gazettes...');

    if (!fs.existsSync(SEED_FILE)) {
      logger.warn(`[GovtDataFetch] Seed file not found at ${SEED_FILE}`);
      return [];
    }

    const raw = fs.readFileSync(SEED_FILE, 'utf8');
    const seedNotices = JSON.parse(raw);

    logger.info(`[GovtDataFetch] Normalizing ${seedNotices.length} government notifications...`);

    const normalizedGovtJobs = seedNotices.map((notice) => {
      const expiresAt = parseDeadline(notice.lastDate);
      const isExpired = expiresAt && expiresAt < new Date();

      return {
        title: notice.title || 'Government Recruitment Notification',
        organization: notice.department || 'Government of AP & India',
        department: notice.department,
        type: 'govt',
        category: notice.category || (notice.location?.includes('Andhra') ? 'ap_state' : 'central'),
        vacancies: notice.vacancies || 'Various Posts',
        qualification: notice.qualification || 'Degree / Diploma / 12th',
        ageLimit: notice.ageLimit || '18 - 42 Years',
        salaryScale: notice.salaryScale || notice.salary || 'Government Pay Scale',
        location: notice.location || 'Andhra Pradesh & India',
        description: notice.description || '',
        skills: notice.tags || [],
        tags: notice.tags || [],
        applyLink: notice.applyLink || notice.officialApplyLink || 'https://psc.ap.gov.in',
        officialApplyLink: notice.officialApplyLink || notice.applyLink || 'https://psc.ap.gov.in',
        notificationPdfLink: notice.notificationPdfLink || notice.notificationPdf || '',
        importantDates: {
          notificationDate: notice.postedDate || new Date().toISOString().split('T')[0],
          applyStart: notice.postedDate || new Date().toISOString().split('T')[0],
          lastDate: notice.lastDate || '2026-12-31',
          examDate: notice.examDate || 'To be announced'
        },
        postedAt: notice.postedDate ? new Date(notice.postedDate) : new Date(),
        expiresAt,
        status: isExpired ? 'expired' : 'active',
        source: 'verified_gazette'
      };
    });

    // Write to disk for auditing and backup
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalizedGovtJobs, null, 2), 'utf8');
    logger.info(`[GovtDataFetch] Successfully cached ${normalizedGovtJobs.length} government notifications to ${OUTPUT_FILE}`);

    return normalizedGovtJobs;
  } catch (err) {
    logger.error(`[GovtDataFetch] Error fetching/normalizing govt jobs: ${err.message}`);
    return [];
  }
};

/**
 * Execute government job sync pipeline (Fetch + Ingest + Auto-Expire)
 */
export const executeGovtPipeline = async () => {
  logger.info('\n======================================================');
  logger.info('[GovtPipeline] Starting Government Notifications Sync');
  logger.info(`[GovtPipeline] Triggered at: ${new Date().toISOString()}`);
  logger.info('======================================================');

  const jobs = await runFetchGovtJobs();
  if (jobs.length === 0) {
    logger.warn('[GovtPipeline] No government notices fetched. Aborting.');
    return { inserted: 0, updated: 0, failed: 0, archived: 0 };
  }

  // Ingest into MongoDB
  const ingestionResult = await ingestOpportunities(jobs);

  // Auto-expire past-deadline notifications
  const archivedCount = await archiveExpiredOpportunities();

  logger.info('\n======================================================');
  logger.info('[GovtPipeline] Government Notifications Sync COMPLETE');
  logger.info(`  Inserted : ${ingestionResult.inserted}`);
  logger.info(`  Updated  : ${ingestionResult.updated}`);
  logger.info(`  Failed   : ${ingestionResult.failed}`);
  logger.info(`  Archived : ${archivedCount} past-deadline notices`);
  logger.info('======================================================\n');

  return {
    ...ingestionResult,
    archived: archivedCount
  };
};

// CLI entry point
const isCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isCLI) {
  (async () => {
    try {
      await connectDB();
      await executeGovtPipeline();
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error('[GovtPipeline] CLI Error:', err);
      process.exit(1);
    }
  })();
}
