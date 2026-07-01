import mongoose from 'mongoose';
import LiveRoom from '../models/LiveRoom.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedLiveRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding live rooms');

    // Clean up existing live rooms
    await LiveRoom.deleteMany({});
    console.log('🗑️  Cleared existing live rooms');

    // Find our seed instructor or admin
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      instructor = await User.findOne({ role: 'admin' });
    }

    if (!instructor) {
      console.log('❌ No admin/instructor user found to host streams. Seeding cancelled.');
      process.exit(1);
    }

    // Set canHostLive = true for the seed instructor
    await User.findByIdAndUpdate(instructor._id, { $set: { canHostLive: true } });
    console.log(`🔑 Granted live permissions to host: ${instructor.name}`);

    // Create 3 active live streams with different topics
    const liveStreams = [
      {
        title: "Docker Pipelines & Kubernetes Deployment",
        topic: "Debugging container environments & setting up CI/CD workflows live",
        category: "Cloud & DevOps",
        hostId: instructor._id,
        status: 'live',
        startedAt: new Date(),
        viewerCount: 142,
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
      },
      {
        title: "React Component Optimization & Performance",
        topic: "Fixing re-rendering bottlenecks & mastering useMemo/useCallback hook trees",
        category: "Web Development",
        hostId: instructor._id,
        status: 'live',
        startedAt: new Date(),
        viewerCount: 96,
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
      },
      {
        title: "Introduction to Neural Networks from Scratch",
        topic: "Building logic gates & basic feedforward models with matrix math in JavaScript",
        category: "AI & ML",
        hostId: instructor._id,
        status: 'live',
        startedAt: new Date(),
        viewerCount: 204,
        streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
      }
    ];

    await LiveRoom.insertMany(liveStreams);
    console.log('✅ Successfully seeded 3 active live rooms!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding live rooms:', err);
    process.exit(1);
  }
};

seedLiveRooms();
