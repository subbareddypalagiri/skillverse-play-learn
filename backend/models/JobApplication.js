import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Application Details
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'rejected', 'selected', 'withdrawn'],
    default: 'applied'
  },
  
  // Response
  coverLetter: String,
  resume: String,
  
  // Tracking
  appliedAt: { type: Date, default: Date.now },
  responseAt: Date,
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Composite Unique Index
jobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true, sparse: true });
jobApplicationSchema.index({ userId: 1, status: 1 });
jobApplicationSchema.index({ appliedAt: -1 });

// Query middleware
jobApplicationSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('JobApplication', jobApplicationSchema);
