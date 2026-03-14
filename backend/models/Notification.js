import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Notification Type (FIX from audit: added targetRole)
  type: {
    type: String,
    enum: [
      'course_enrolled',
      'problem_solved',
      'certificate_issued',
      'event_registered',
      'new_job_match',
      'course_updated',
      'badge_unlocked',
      'message_received',
      'exam_scheduled'
    ],
    required: true
  },
  
  targetRole: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    index: true
  },
  
  // Related Data
  relatedEntityId: mongoose.Schema.Types.ObjectId,
  relatedEntityType: String,
  
  // Message
  message: {
    type: String,
    required: true
  },
  
  // Status
  isRead: { type: Boolean, default: false, index: true },
  readAt: Date,
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true, index: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Critical Indexes for Performance
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ createdAt: -1 });

// Query middleware
notificationSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Notification', notificationSchema);
