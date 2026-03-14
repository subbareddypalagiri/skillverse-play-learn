import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  // Basic Info
  jobId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  company: String, // String for manual entry or fallback
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  
  // Location
  location: {
    type: String,
    required: true
  },
  city: String,
  country: String,
  remote: { type: Boolean, default: false },
  
  // Job Details
  type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
    default: 'Internship'
  },
  duration: String,
  
  // Compensation
  stipend: String,
  minSalary: Number,
  maxSalary: Number,
  currency: String,
  
  // Job Description
  description: String,
  requirements: [String],
  skills: [String],
  benefits: [String],
  qualifications: [String],
  experience: String,
  
  // Application Info
  applyLink: String,
  postedDate: Date,
  applicationDeadline: Date,
  
  // Data Source
  apiSource: {
    type: String,
    enum: ['jsearch', 'manual'],
    default: 'jsearch'
  },
  externalJobId: String,
  
  // Status
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Statistics (Denormalized)
  applicantCount: { type: Number, default: 0 },
  
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
jobSchema.index({ postedDate: -1 });
jobSchema.index({ type: 1, location: 1 });
jobSchema.index({ skill: 1 });
jobSchema.index({ isActive: 1, isFeatured: -1 });
jobSchema.index({ title: 'text', 'company.name': 'text', description: 'text' });

// Query middleware
jobSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Job', jobSchema);
