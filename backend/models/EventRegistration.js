import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  
  // Registration Status
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled', 'no_show'],
    default: 'registered'
  },
  
  // Tracking
  registeredAt: { type: Date, default: Date.now },
  attendedAt: Date,
  
  // Feedback
  feedbackGiven: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Composite Unique Index
eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true, sparse: true });
eventRegistrationSchema.index({ eventId: 1, status: 1 });
eventRegistrationSchema.index({ registeredAt: -1 });

// Query middleware
eventRegistrationSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('EventRegistration', eventRegistrationSchema);
