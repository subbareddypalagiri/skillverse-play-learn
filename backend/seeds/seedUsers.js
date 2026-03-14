import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const usersData = [
  {
    name: "John Developer",
    email: "john@skillverse.com",
    password: "Password123!",
    role: "student",
    bio: "Full Stack Developer passionate about Web Development and Open Source",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "CSS", "HTML"],
    hobbies: ["Coding", "Gaming", "Reading"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndeveloper",
      github: "https://github.com/johndeveloper",
      leetcode: "https://leetcode.com/johndeveloper",
      codeforces: "https://codeforces.com/profile/johndeveloper"
    }
  },
  {
    name: "Emma Admin",
    email: "admin@skillverse.com",
    password: "Password123!",
    role: "admin",
    bio: "SkillVerse Platform Administrator",
    skills: ["Management", "System Design", "Community Building"]
  },
  {
    name: "Mike Instructor",
    email: "mike@skillverse.com",
    password: "Password123!",
    role: "instructor",
    bio: "Experienced instructor teaching Full Stack Development",
    skills: ["JavaScript", "React", "Node.js", "Teaching", "Mentoring"],
    hobbies: ["Teaching", "Mentoring", "Blogging"]
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Password hashing is handled by User model pre-save hook
    const createdUsers = await User.create(usersData);
    console.log(`✅ Seeded ${createdUsers.length} users successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
