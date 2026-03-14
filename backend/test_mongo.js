import mongoose from 'mongoose';
import 'dotenv/config';

const mongoUri = process.env.MONGODB_URI;

console.log('Testing connection to:', mongoUri.replace(/:([^:@]+)@/, ':****@'));

async function test() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connection successful!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection failed:');
    console.error(err);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('Suggestion: DNS resolution for SRV records is failing. Try checking your internet connection or DNS settings.');
    }
  }
}

test();
