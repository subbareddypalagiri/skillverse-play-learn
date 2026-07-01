import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const usersData = [
  {
    name: "Emma Admin",
    email: "subbareddy123sub@gmail.com",
    password: "Subbareddy@123",
    role: "admin",
    bio: "SkillVerse Platform Administrator",
    skills: ["Management", "System Design", "Community Building"]
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
