import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  hobbies: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  linkedIn: {
    type: String,
    default: null
  },
  github: {
    type: String,
    default: null
  },
  leetcode: {
    type: String,
    default: null
  },
  codeforces: {
    type: String,
    default: null
  },
  codechef: {
    type: String,
    default: null
  },
  hackerrank: {
    type: String,
    default: null
  },
  kaggle: {
    type: String,
    default: null
  },
  behance: {
    type: String,
    default: null
  },
  dribbble: {
    type: String,
    default: null
  },
  soundcloud: {
    type: String,
    default: null
  },
  youtube: {
    type: String,
    default: null
  },
  instagram: {
    type: String,
    default: null
  },
  githubStats: {
    repos: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 }
  },
  leetcodeStats: {
    solved: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    badges: [{ type: String }]
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
