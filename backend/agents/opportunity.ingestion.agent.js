#!/usr/bin/env node
// ============================================================
// OPPORTUNITY INGESTION AGENT — Standalone CLI / importable
// ============================================================
// Usage (CLI):
//   node agents/opportunity.ingestion.agent.js <path-to-json>
//
// Usage (programmatic):
//   import { runIngestion } from './agents/opportunity.ingestion.agent.js';
//   await runIngestion(recordsArray);
//
// The agent:
//   1. Reads a JSON file (or accepts an array directly)
//   2. Validates & normalizes every record
//   3. Detects duplicates via compound key
//   4. Bulk-upserts into the `opportunities` collection
//   5. Logs a summary to stdout and the app logger
// ============================================================

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import { ingestOpportunities } from '../services/opportunities.service.js';
import logger from '../config/logger.js';

/**
 * Run the ingestion pipeline programmatically.
 *
 * @param {Array<Object>} records - Array of opportunity objects
 * @returns {Object} Ingestion result summary
 */
export const runIngestion = async (records) => {
  const startTime = Date.now();

  logger.info(`[IngestionAgent] Starting ingestion of ${records.length} records…`);

  const result = await ingestOpportunities(records);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  logger.info(`[IngestionAgent] Done in ${elapsed}s — inserted: ${result.inserted}, updated: ${result.updated}, failed: ${result.failed}`);

  if (result.errors.length > 0) {
    logger.warn(`[IngestionAgent] ${result.errors.length} validation errors:`);
    result.errors.forEach(e => logger.warn(`  → ${e}`));
  }

  return result;
};

// ============================================================
// CLI ENTRY POINT
// ============================================================
// Run directly: node agents/opportunity.ingestion.agent.js data.json
// ============================================================

const isCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

if (isCLI) {
  (async () => {
    const filePath = process.argv[2];

    if (!filePath) {
      console.error('Usage: node agents/opportunity.ingestion.agent.js <path-to-json>');
      process.exit(1);
    }

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found: ${absolutePath}`);
      process.exit(1);
    }

    try {
      // Connect to DB (uses existing MONGODB_URI from .env)
      await connectDB();

      const raw = fs.readFileSync(absolutePath, 'utf-8');
      const records = JSON.parse(raw);

      if (!Array.isArray(records)) {
        console.error('JSON file must contain an array of opportunity objects');
        process.exit(1);
      }

      const result = await runIngestion(records);

      console.log('\n═══════════════════════════════════════');
      console.log('  INGESTION SUMMARY');
      console.log('═══════════════════════════════════════');
      console.log(`  Inserted : ${result.inserted}`);
      console.log(`  Updated  : ${result.updated}`);
      console.log(`  Failed   : ${result.failed}`);
      console.log('═══════════════════════════════════════\n');

      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error('Ingestion failed:', err.message);
      await mongoose.connection.close();
      process.exit(1);
    }
  })();
}
