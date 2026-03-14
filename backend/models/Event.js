import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  
  // Event Type
  eventType: {
    type: String,
    enum: ['webinar', 'workshop', 'hackathon', 'meetup', 'conference', 'live_class'],
    required: true
  },
  
  // Location & Online Info
  location: String,
  isOnline: { type: Boolean, default: false },
  eventLink: String,
  
  // Time
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Course Association (Optional)
  linkedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  
  // Organizer
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Access Control
  visibility: {
    type: String,
    enum: ['public', 'private', 'course_members_only'],
    default: 'public'
  },
  allowedRoles: [String],
  
  // Capacity
  capacity: { type: Number, default: null },
  registeredCount: { type: Number, default: 0 },
  
  // Recording
  hasRecording: { type: Boolean, default: false },
  recordingUrl: String,
  
  // Status
  isActive: { type: Boolean, default: true },
  isCancelled: { type: Boolean, default: false },
  
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
eventSchema.index({ startDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ visibility: 1 });
eventSchema.index({ title: 'text', description: 'text' });

// Query middleware
eventSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Event', eventSchema);
