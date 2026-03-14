import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the data directory exists
const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const OUTPUT_FILE = path.join(DATA_DIR, 'opportunities.json');

/**
 * Fetch and normalize jobs from Remotive API
 */
const fetchRemotiveJobs = async () => {
  try {
    logger.info('[DataFetch] Fetching from Remotive API...');
    const response = await axios.get('https://remotive.com/api/remote-jobs');
    const jobs = response.data.jobs || [];
    
    logger.info(`[DataFetch] Fetched ${jobs.length} jobs from Remotive`);
    
    return jobs.map(job => ({
      title: job.title || 'Untitled',
      organization: job.company_name || 'Unknown',
      type: 'job',
      location: job.candidate_required_location || 'Remote',
      skills: Array.isArray(job.tags) ? job.tags : [],
      applyLink: job.url || '',
      source: 'remotive'
    }));
  } catch (error) {
    logger.error(`[DataFetch] Remotive API Error: ${error.message}`);
    return []; // Return empty array to allow pipeline to continue
  }
};

/**
 * Fetch and normalize jobs from Arbeitnow API
 */
const fetchArbeitnowJobs = async () => {
  try {
    logger.info('[DataFetch] Fetching from Arbeitnow API...');
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api');
    const jobs = response.data.data || [];
    
    logger.info(`[DataFetch] Fetched ${jobs.length} jobs from Arbeitnow`);
    
    return jobs.map(job => ({
      title: job.title || 'Untitled',
      organization: job.company_name || 'Unknown',
      type: 'job',
      location: job.location || 'Not Specified',
      skills: Array.isArray(job.tags) ? job.tags : [],
      applyLink: job.url || '',
      source: 'arbeitnow'
    }));
  } catch (error) {
    logger.error(`[DataFetch] Arbeitnow API Error: ${error.message}`);
    return []; // Return empty array to allow pipeline to continue
  }
};

/**
 * Main execution function
 * Fetches from all sources, merges, and writes to disk
 */
export const runFetchJobs = async () => {
  try {
    const [remotiveJobs, arbeitJobs] = await Promise.all([
      fetchRemotiveJobs(),
      fetchArbeitnowJobs(),
    ]);

    const allJobs = [...remotiveJobs, ...arbeitJobs];

    if (allJobs.length === 0) {
      logger.warn('[DataFetch] No jobs fetched from any API. Skipping file write.');
      return 0;
    }

    // Save dataset to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allJobs, null, 2));
    logger.info(`[DataFetch] Successfully saved ${allJobs.length} normalized jobs to ${OUTPUT_FILE}`);
    
    return allJobs.length;
  } catch (error) {
    logger.error(`[DataFetch] Unexpected error during fetch process: ${error.message}`);
    throw error;
  }
};

// Run standalone if executed directly
const isCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isCLI) {
  runFetchJobs()
    .then(count => {
      console.log(`Fetch complete. Total jobs saved: ${count}`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Fetch failed:', err);
      process.exit(1);
    });
}
