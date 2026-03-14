import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  // Metadata
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Difficulty & Classification
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  topic: String,
  tags: [String],
  
  // External Source
  source: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeForces', 'AtCoder', 'CodeChef'],
    required: true
  },
  externalId: String,
  externalUrl: {
    type: String,
    required: true
  },
  
  // FIX: Composite unique constraint (source + externalId)
  // Create via: db.Problem.createIndex({ source: 1, externalId: 1 }, { unique: true })
  
  // Problem Content
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  
  // Related Course
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  
  // Recommendations
  recommendedFor: {
    courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    topics: [String],
    levels: [String]
  },
  
  // Statistics (Denormalized - Updated on each attempt)
  acceptedCount: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  avgRuntime: { type: Number, default: 0 },
  avgMemory: { type: Number, default: 0 },
  
  // System Fields
  isActive: { type: Boolean, default: true },
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
problemSchema.index({ difficulty: 1, category: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ isActive: 1 });
problemSchema.index({ createdAt: -1 });
problemSchema.index({ title: 'text', description: 'text' });

// Query middleware
problemSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Problem', problemSchema);
