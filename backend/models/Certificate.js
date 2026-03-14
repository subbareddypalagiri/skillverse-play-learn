import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // Certificate Details
  certificateNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  certificateUrl: String,
  
  // Credentials
  skillsVerified: [String],
  
  // Issuing
  issueBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  
  // Status
  isActive: { type: Boolean, default: true },
  isRevoked: { type: Boolean, default: false },
  revocationReason: String,
  revokedAt: Date,
  revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
certificateSchema.index({ userId: 1, issueDate: -1 });
certificateSchema.index({ isActive: 1, isRevoked: 1 });

// Query middleware
certificateSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Certificate', certificateSchema);
