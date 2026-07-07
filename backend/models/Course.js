import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  instructor: {
    type: String,
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  
  // Instructor Info
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coInstructors: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer'
    }
  }],
  
  // Course Content
  thumbnail: String,
  price: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  duration: String,
  
  // Credits awarded on completion
  credits: { 
    type: Number, 
    default: 10,
    min: [0, 'Credits cannot be negative'],
    max: [100, 'Credits cannot exceed 100']
  },
  
  syllabus: [{
    title: String,
    description: String,
    duration: String,
    lectureCount: Number,
    resources: [{
      type: String,
      title: String,
      url: String
    }]
  }],
  
  // Resources
  resources: {
    videos: [{
      title: String,
      url: String,
      platform: String,
      videoId: String,
      duration: Number
    }],
    pdfs: [{
      title: String,
      url: String,
      size: Number
    }],
    links: [{
      title: String,
      url: String,
      description: String
    }]
  },
  
  // Related Problems
  linkedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  
  // Statistics (Denormalized)
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  
  // Status
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes
courseSchema.index({ ownerId: 1, isDeleted: 1 });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ isActive: 1, isPublished: 1 });
courseSchema.index({ title: 'text', description: 'text' });

// Query middleware
courseSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Course', courseSchema);
