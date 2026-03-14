import mongoose from 'mongoose';

const examAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  
  // Attempt Details
  attemptNumber: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'submitted', 'completed'],
    default: 'started'
  },
  
  // Answers & Score
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    marks: Number
  }],
  
  totalMarks: { type: Number, default: 0 },
  obtainedMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  
  // Timing
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  timeSpent: Number, // in seconds
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes
examAttemptSchema.index({ userId: 1, examId: 1 });
examAttemptSchema.index({ startedAt: -1 });
examAttemptSchema.index({ submittedAt: -1 });

// Query middleware
examAttemptSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('ExamAttempt', examAttemptSchema);
