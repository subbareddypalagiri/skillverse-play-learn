// Utility script: delete ALL users from MongoDB (for dev/testing only)
// Usage: node wipe_users.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

await mongoose.connect(process.env.MONGODB_URI);
const result = await mongoose.connection.collection('users').deleteMany({});

console.log(`✅ Deleted ${result.deletedCount} user(s) from the database.`);

await mongoose.disconnect();
