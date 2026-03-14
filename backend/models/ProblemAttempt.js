import mongoose from 'mongoose';

const problemAttemptSchema = new mongoose.Schema({
  // Relationships
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment'
  },
  
  // Attempt Details
  attemptNumber: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['submitted', 'accepted', 'rejected', 'attempted', 'skipped'],
    default: 'attempted'
  },
  verdict: {
    type: String,
    enum: [
      'Accepted',
      'Wrong Answer',
      'Time Limit Exceeded',
      'Memory Limit Exceeded',
      'Runtime Error',
      'Compilation Error',
      'Not Submitted'
    ],
    default: 'Not Submitted'
  },
  
  // Code & Solution
  submittedCode: String,
  submittedLanguage: String,
  codeLength: Number,
  
  // Performance Metrics
  runtime: Number,
  runtimePercentile: Number,
  memory: Number,
  memoryPercentile: Number,
  executionTime: { type: Number, default: 0 },
  
  // Results
  testCasesPass: Number,
  testCasesTotal: Number,
  passPercentage: { type: Number, default: 0 },
  
  // Best Attempt Flag (for leaderboards)
  isBest: { type: Boolean, default: false },
  
  // Learning Data
  hintUsed: { type: Boolean, default: false },
  timeSpent: Number,
  isReview: { type: Boolean, default: false },
  reviewNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now, immutable: true, index: true },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes for performance (Critical)
problemAttemptSchema.index({ userId: 1, submittedAt: -1 });
problemAttemptSchema.index({ problemId: 1, verdict: 1 });
problemAttemptSchema.index({ userId: 1, problemId: 1, isBest: 1 });
problemAttemptSchema.index({ submittedAt: -1 });
problemAttemptSchema.index({ userId: 1, status: 1 });
problemAttemptSchema.index({ difficulty: 1, submittedAt: -1 });

// Query middleware
problemAttemptSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('ProblemAttempt', problemAttemptSchema);
