import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'teaching_assistant', 'moderator', 'admin', 'recruiter', 'company_admin', 'campus_ambassador'],
    default: 'student'
  },
  collegeName: {
    type: String,
    trim: true,
    default: null
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  
  // Profile Info
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: null
  },
  hobbies: [String],
  skills: [String],
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    leetcode: String,
    codeforces: String,
    codechef: String,
    hackerrank: String,
    kaggle: String,
    behance: String,
    dribbble: String,
    soundcloud: String,
    youtube: String,
    instagram: String,
    twitter: String
  },
  
  // Permissions (RBAC)
  permissions: [String],
  managedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  managedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Gamification
  stats: {
    totalProblemsAttempted: { type: Number, default: 0 },
    totalProblemsAccepted: { type: Number, default: 0 },
    totalCoursesEnrolled: { type: Number, default: 0 },
    totalCoursesCompleted: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    estimatedLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    lastActivityAt: Date
  },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isDeleted: 1, createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Query middleware: exclude soft deleted by default
userSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

// Methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
