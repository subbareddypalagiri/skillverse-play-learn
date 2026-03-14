import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

async function checkCourses() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    
    console.log('Connected. Running query...');
    const query = { isActive: true, isPublished: true, isDeleted: false };
    
    const count = await Course.countDocuments(query);
    const allCount = await Course.countDocuments({});
    
    console.log('--- DB RESULTS ---');
    console.log(`Total Courses in DB: ${allCount}`);
    console.log(`Courses Matching Query (Active & Published & Not Deleted): ${count}`);
    
    const courses = await Course.find(query).limit(1);
    console.log('Sample course returned:', courses.length > 0 ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkCourses();
