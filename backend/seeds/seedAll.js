import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

// Models
import User from '../models/User.js';
import Course from '../models/Course.js';
import Problem from '../models/Problem.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // 0. Clear Everything
    await User.deleteMany({});
    await Course.deleteMany({});
    await Problem.deleteMany({});
    await Job.deleteMany({});
    await Event.deleteMany({});
    logger.info('🗑️  Cleared existing database state');

    // 1. Seed Users
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@skillverse.com",
        password: "Password123!",
        role: "admin",
        bio: "SkillVerse Platform Administrator"
      },
      {
        name: "Mike Instructor",
        email: "mike@skillverse.com",
        password: "Password123!",
        role: "instructor",
        bio: "Expert Full Stack Instructor"
      },
      {
        name: "John Student",
        email: "john@skillverse.com",
        password: "Password123!",
        role: "student",
        bio: "Learning AI and Web Dev"
      }
    ]);
    const adminId = users[0]._id;
    const instructorId = users[1]._id;
    logger.info(`✅ Seeded ${users.length} users`);

    // 2. Seed Courses
    const courses = await Course.create([
      {
        title: "Full Stack Web Development",
        description: "Complete MERN Stack - HTML, CSS, JavaScript, React, Node.js, MongoDB",
        category: "Web Development",
        level: "Beginner",
        ownerId: instructorId,
        isPublished: true,
        duration: "12 Weeks",
        price: 0
      },
      {
        title: "AI & Machine Learning Foundations",
        description: "Introduction to Neural Networks and Data Science",
        category: "AI & ML",
        level: "Intermediate",
        ownerId: instructorId,
        isPublished: true,
        duration: "10 Weeks"
      }
    ]);
    logger.info(`✅ Seeded ${courses.length} courses`);

    // 3. Seed Problems
    const problems = await Problem.create([
      {
        title: "Two Sum",
        description: "Find indices of two numbers that add up to target",
        difficulty: "Easy",
        category: "Arrays",
        source: "LeetCode",
        externalId: "1",
        externalUrl: "https://leetcode.com/problems/two-sum/",
        relatedCourse: courses[0]._id,
        createdBy: adminId
      },
      {
        title: "Matrix Chain Multiplication",
        description: "Dynamic programming problem on matrix multiplication",
        difficulty: "Hard",
        category: "Dynamic Programming",
        source: "GeeksforGeeks",
        externalId: "mcm",
        externalUrl: "https://www.geeksforgeeks.org/matrix-chain-multiplication/",
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${problems.length} problems`);

    // 4. Seed Jobs
    const jobs = await Job.create([
      {
        jobId: "j1",
        title: "Frontend Intern",
        company: "SkillVerse Tech",
        location: "Remote",
        type: "Internship",
        description: "Work on our React frontend",
        applyLink: "https://skillverse.com/careers",
        isActive: true,
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${jobs.length} jobs`);

    // 5. Seed Events
    const events = await Event.create([
      {
        title: "SkillVerse Tech Hackathon 2024",
        description: "Compete and win prizes!",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "hackathon",
        organizerId: adminId,
        visibility: "public",
        capacity: 500,
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${events.length} events`);

    logger.info('🚀 Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
};

seedAll();
