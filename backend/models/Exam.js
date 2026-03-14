import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  
  // Exam Type
  examType: {
    type: String,
    enum: ['Competitive', 'Professional', 'Language', 'Certification', 'Mock'],
    default: 'Competitive'
  },
  
  // Structure
  subjects: [String],
  duration: String,
  totalQuestions: Number,
  
  // Course Association (Optional)
  linkedCourse: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    isMandatory: Boolean
  },
  
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
  
  // Status
  isActive: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },
  
  // Statistics (Denormalized)
  enrollmentCount: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  
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
examSchema.index({ category: 1 });
examSchema.index({ examType: 1 });
examSchema.index({ isActive: 1, isPublished: 1 });
examSchema.createIndex({ title: 'text', description: 'text' });

// Query middleware
examSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Exam', examSchema);
