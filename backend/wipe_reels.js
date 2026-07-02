import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Reel from './models/Reel.js';
import ReelFollow from './models/ReelFollow.js';

dotenv.config();

const wipeReels = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    console.log('Deleting all existing fake/seeded reels...');
    const result = await Reel.deleteMany({});
    await ReelFollow.deleteMany({});

    console.log(`✅ Successfully wiped ${result.deletedCount} reels from database!`);
    console.log('Now your Reels feed is 100% clean and ready for your real video uploads!');
  } catch (err) {
    console.error('Error wiping reels:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

wipeReels();
