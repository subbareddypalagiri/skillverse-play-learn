import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true
  },
  description: String,
  industry: String,
  website: String,
  logo: String,
  location: {
    city: String,
    state: String,
    country: String,
    address: String
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  
  // Social
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String
  },
  
  // Stats
  totalJobsPosted: { type: Number, default: 0 },
  totalHires: { type: Number, default: 0 },
  
  // Admin contact (User who created the company)
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Custom Fields
  benefits: [String],
  techStack: [String],
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 'text', description: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ isVerified: 1 });

// Query middleware
companySchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Company', companySchema);
