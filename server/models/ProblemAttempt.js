import mongoose from 'mongoose';

const problemAttemptSchema = new mongoose.Schema({
  // User & Problem
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment'
  },
  
  // Attempt Details
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
  executionTime: {
    type: Number,
    default: 0
  },
  
  // Results
  testCasesPass: Number,
  testCasesTotal: Number,
  passPercentage: {
    type: Number,
    default: 0
  },
  
  // Metadata
  attemptNumber: {
    type: Number,
    default: 1
  },
  isBest: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Learning Data
  hintUsed: {
    type: Boolean,
    default: false
  },
  timeSpent: Number,
  isReview: {
    type: Boolean,
    default: false
  },
  reviewNotes: String,
  
  // Statistics
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
problemAttemptSchema.index({ userId: 1, problemId: 1 });
problemAttemptSchema.index({ courseId: 1, userId: 1 });
problemAttemptSchema.index({ submittedAt: -1 });
problemAttemptSchema.index({ status: 1, verdict: 1 });

const ProblemAttempt = mongoose.model('ProblemAttempt', problemAttemptSchema);

export default ProblemAttempt;
