import mongoose from 'mongoose';

const examEnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  
  // Enrollment Status
  status: {
    type: String,
    enum: ['enrolled', 'abandoned', 'completed'],
    default: 'enrolled'
  },
  
  // Tracking
  enrolledAt: { type: Date, default: Date.now },
  firstAttemptAt: Date,
  lastAttemptAt: Date,
  completedAt: Date,
  
  // Best Score Tracking
  bestScore: { type: Number, default: 0 },
  bestScoreAttemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamAttempt' },
  
  // Statistics
  attemptCount: { type: Number, default: 0 },
  passedCount: { type: Number, default: 0 },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Composite Unique Index
examEnrollmentSchema.index({ userId: 1, examId: 1 }, { unique: true, sparse: true });
examEnrollmentSchema.index({ userId: 1, status: 1 });
examEnrollmentSchema.index({ enrolledAt: -1 });

// Query middleware
examEnrollmentSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('ExamEnrollment', examEnrollmentSchema);
