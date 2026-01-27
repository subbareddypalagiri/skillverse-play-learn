import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  city: String,
  country: String,
  type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
    default: 'Internship'
  },
  duration: String,
  stipend: String,
  minSalary: Number,
  maxSalary: Number,
  currency: String,
  description: String,
  skills: [String],
  benefits: [String],
  qualifications: [String],
  applyLink: String,
  postedDate: Date,
  experience: String,
  remote: {
    type: Boolean,
    default: false
  },
  // API source information
  apiSource: {
    type: String,
    enum: ['jsearch', 'manual'],
    default: 'jsearch'
  },
  // Cache management
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Track which semester/season this job is from
  semester: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
jobSchema.index({ type: 1, isActive: 1 });
jobSchema.index({ location: 1, isActive: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ lastUpdated: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
