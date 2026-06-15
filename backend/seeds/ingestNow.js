// Quick one-shot script to ingest data/opportunities.json into Atlas
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import { ingestOpportunities } from '../services/opportunities.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE = path.resolve(__dirname, '../data/opportunities.json');

(async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas');

    const raw = fs.readFileSync(FILE, 'utf-8');
    const records = JSON.parse(raw);
    console.log(`📦 Loaded ${records.length} records from opportunities.json`);

    const result = await ingestOpportunities(records);

    console.log('\n═══════════════════════════════════════');
    console.log('  INGESTION COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log(`  Inserted : ${result.inserted}`);
    console.log(`  Updated  : ${result.updated}`);
    console.log(`  Failed   : ${result.failed}`);
    console.log('═══════════════════════════════════════');

    const total = await mongoose.connection.collection('opportunities').countDocuments();
    console.log(`\n🎯 Total opportunities in Atlas now: ${total}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
