import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reel from '../models/Reel.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Topic to video index and clip details mapping
const TOPIC_MAPPINGS = [
  {
    topicKey: "html-basics",
    videoIndex: 0,
    clipStartSeconds: 0,
    clipEndSeconds: 60,
    title: "HTML Basics in 60 Seconds",
    caption: "Learn the building blocks of the web!",
    description: "Master HTML tags, elements, and document structure. The foundation of every website starts here.",
    tags: ["html", "basics", "frontend", "beginner"],
    difficulty: "Easy"
  },
  {
    topicKey: "css-fundamentals",
    videoIndex: 0,
    clipStartSeconds: 600,
    clipEndSeconds: 660,
    title: "CSS Styling Fundamentals",
    caption: "Make your websites beautiful!",
    description: "Learn CSS selectors, properties, and values. Transform plain HTML into stunning designs.",
    tags: ["css", "styling", "frontend", "design"],
    difficulty: "Easy"
  },
  {
    topicKey: "react-basics",
    videoIndex: 1,
    clipStartSeconds: 0,
    clipEndSeconds: 60,
    title: "React Components 101",
    caption: "Build reusable UI components!",
    description: "Learn React component basics, props, and state. The modern way to build UIs.",
    tags: ["react", "components", "frontend", "jsx"],
    difficulty: "Medium"
  },
  {
    topicKey: "nodejs-express",
    videoIndex: 2,
    clipStartSeconds: 0,
    clipEndSeconds: 60,
    title: "Node.js & Express Intro",
    caption: "Build your own backend!",
    description: "Learn Node.js basics and Express.js routing. Create APIs and server-side apps.",
    tags: ["nodejs", "express", "backend", "api"],
    difficulty: "Medium"
  },
  {
    topicKey: "mongodb-setup",
    videoIndex: 3,
    clipStartSeconds: 0,
    clipEndSeconds: 60,
    title: "MongoDB Databases",
    caption: "Store your data securely!",
    description: "Learn how to query, create documents, and connect database collections in MongoDB.",
    tags: ["mongodb", "database", "backend", "nosql"],
    difficulty: "Medium"
  },
  {
    topicKey: "javascript-loops",
    videoIndex: 4,
    clipStartSeconds: 0,
    clipEndSeconds: 60,
    title: "JavaScript Programming",
    caption: "Master JavaScript loops & arrays!",
    description: "Understand variables, controls, and modern JS logic step by step.",
    tags: ["javascript", "basics", "programming", "frontend"],
    difficulty: "Easy"
  }
];

async function seedWebDevReels() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillverse';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get or create a user
    let user = await User.findOne({});
    if (!user) {
      user = await User.create({
        name: 'SkillVerse Academy',
        email: 'academy@skillverse.com',
        password: 'password123',
        role: 'student'
      });
      console.log('✅ Created sample user:', user.name);
    }

    // Find the Web Development course
    let webDevCourse = await Course.findOne({ 
      $or: [
        { title: { $regex: /web.*development/i } },
        { category: 'Web Development' }
      ]
    });

    if (!webDevCourse) {
      console.error('❌ Web Development course not found! Run seedAll.js first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Validate course has videos
    if (!webDevCourse.resources?.videos || webDevCourse.resources.videos.length === 0) {
      console.error('❌ Web Development course has no video resources! Videos must be added to course first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    const courseId = webDevCourse._id;
    const courseTitle = webDevCourse.title;
    const courseLink = `/courses/${webDevCourse._id}`;
    const courseVideos = webDevCourse.resources.videos;

    console.log(`📚 Linking reels to course: ${courseTitle}`);
    console.log(`📹 Found ${courseVideos.length} videos in course`);

    // Check existing reels
    const existingCount = await Reel.countDocuments({ category: 'Web Development' });
    if (existingCount > 0) {
      console.log(`📦 Found ${existingCount} existing Web Dev reels.`);
      
      if (process.argv.includes('--force')) {
        await Reel.deleteMany({ category: 'Web Development' });
        console.log('🗑️ Cleared existing Web Dev reels.');
      } else {
        console.log('   Run with --force to clear and reseed.');
        await mongoose.disconnect();
        return;
      }
    }

    // Create reels from course videos
    const reelsToCreate = TOPIC_MAPPINGS.map((topic) => {
      const video = courseVideos[topic.videoIndex];
      
      if (!video) {
        throw new Error(`Video at index ${topic.videoIndex} not found in course for topic ${topic.topicKey}`);
      }

      const clipDuration = Math.min(60, topic.clipEndSeconds - topic.clipStartSeconds);

      return {
        title: topic.title,
        caption: topic.caption,
        description: topic.description,
        category: "Web Development",
        tags: topic.tags,
        topicKey: topic.topicKey,
        difficulty: topic.difficulty,
        duration: clipDuration,
        videoUrl: video.url,
        clipStartSeconds: topic.clipStartSeconds,
        clipEndSeconds: topic.clipEndSeconds,
        userId: user._id,
        createdBy: user._id,
        sourceCourseId: courseId,
        sourceCourseTitle: courseTitle,
        sourceVideoId: video.videoId,
        courseLink: courseLink,
        viewsCount: Math.floor(Math.random() * 5000) + 1000,
        likesCount: Math.floor(Math.random() * 300) + 50,
        commentsCount: Math.floor(Math.random() * 30) + 5,
        sharesCount: Math.floor(Math.random() * 50) + 10,
        savesCount: Math.floor(Math.random() * 100) + 20,
        isPublished: true,
        hookText: `Learn ${topic.tags[0].toUpperCase()} now!`
      };
    });

    const createdReels = await Reel.insertMany(reelsToCreate);
    console.log(`\n✅ Created ${createdReels.length} Web Development reels:\n`);

    createdReels.forEach((reel, i) => {
      console.log(`   ${i + 1}. ${reel.title}`);
      console.log(`      📌 Topic: ${reel.topicKey} | ⏱️ ${reel.duration}s | 🎯 ${reel.difficulty}`);
      console.log(`      🎬 From: ${reel.sourceVideoId} (${reel.clipStartSeconds}s-${reel.clipEndSeconds}s)`);
    });

    console.log(`\n🔗 All ${createdReels.length} reels linked to: ${courseTitle}`);
    console.log(`✅ All video sources verified from course resources\n`);
    
    await mongoose.disconnect();
    console.log('✅ Done! Seed complete.');
  } catch (error) {
    console.error('❌ Error seeding reels:', error.message);
    process.exit(1);
  }
}

seedWebDevReels();
