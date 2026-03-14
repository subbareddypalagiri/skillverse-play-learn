// Utility script: delete a user by email (for dev/testing only)
// Usage: node delete_user.js subbareddypalagiri510@gmail.com

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const email = process.argv[2];
if (!email) {
  console.error('Usage: node delete_user.js <email>');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const result = await mongoose.connection.collection('users').deleteOne({ email: email.toLowerCase() });

if (result.deletedCount === 1) {
  console.log(`✅ Deleted user: ${email}`);
} else {
  console.log(`⚠️  No user found with email: ${email}`);
}

await mongoose.disconnect();
