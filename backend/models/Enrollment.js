import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Progress Tracking (Denormalized)
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedLessonsCount: { type: Number, default: 0 },
  totalLessons: { type: Number, default: 0 },
  
  completedLessons: [{
    lessonId: String,
    completedAt: Date
  }],
  
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped', 'archived'],
    default: 'active'
  },
  
  // Certificate
  certificate: {
    issued: { type: Boolean, default: false },
    certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
    certificateUrl: String,
    issuedAt: Date
  },
  
  // Activity
  lastActivityAt: Date,
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrolledAt: { type: Date, default: Date.now, immutable: true },
  completedAt: Date,
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Composite Unique Index
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true, sparse: true });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

// Query middleware
enrollmentSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Enrollment', enrollmentSchema);
