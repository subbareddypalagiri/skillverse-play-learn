import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },

  // Educational Background
  graduationYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    trim: true
  },
  major: {
    type: String,
    trim: true
  },
  gpa: {
    type: String,
    trim: true
  },

  // Professional Information
  currentRole: {
    type: String,
    required: true,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    enum: [
      'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
      'Consulting', 'Media & Entertainment', 'Government', 'Non-profit',
      'Startup', 'Other'
    ]
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  previousCompanies: [{
    type: String,
    trim: true
  }],

  // Expertise & Skills
  domain: {
    type: String,
    enum: [
      'AI & Machine Learning', 'Web Development', 'Mobile Development',
      'Cloud & DevOps', 'Data Science', 'UI/UX Design', 'Cybersecurity',
      'Game Development', 'Blockchain', 'Digital Marketing',
      'Product Management', 'Business Analytics', 'Other'
    ]
  },
  skills: [{
    type: String,
    trim: true
  }],
  achievements: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    year: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['award', 'recognition', 'patent', 'publication', 'promotion', 'project', 'other'],
      required: true
    }
  }],

  // Social & Professional Links
  socialLinks: {
    linkedIn: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },

  // Alumni Engagement Preferences
  engagementPreferences: {
    willingToMentor: {
      type: Boolean,
      default: false
    },
    willingToSpeak: {
      type: Boolean,
      default: false
    },
    willingToHire: {
      type: Boolean,
      default: false
    },
    availableForNetworking: {
      type: Boolean,
      default: false
    }
  },
  interests: [{
    type: String,
    trim: true
  }],

  // Content & Story
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  careerJourney: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  adviceForStudents: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Profile Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Metrics
  profileViews: {
    type: Number,
    default: 0
  },
  connectionsCount: {
    type: Number,
    default: 0
  },

  // Admin fields
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  
  // Timestamps
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
AlumniSchema.index({ graduationYear: 1 });
AlumniSchema.index({ domain: 1 });
AlumniSchema.index({ currentCompany: 1 });
AlumniSchema.index({ location: 1 });
AlumniSchema.index({ skills: 1 });
AlumniSchema.index({ 'engagementPreferences.willingToMentor': 1 });
AlumniSchema.index({ 'engagementPreferences.willingToSpeak': 1 });
AlumniSchema.index({ 'engagementPreferences.willingToHire': 1 });

// Text search index
AlumniSchema.index({
  fullName: 'text',
  bio: 'text',
  currentRole: 'text',
  currentCompany: 'text',
  skills: 'text',
  careerJourney: 'text'
});

// Virtual for years since graduation
AlumniSchema.virtual('yearsSinceGraduation').get(function() {
  return new Date().getFullYear() - this.graduationYear;
});

// Virtual for full profile completion percentage
AlumniSchema.virtual('profileCompleteness').get(function() {
  let score = 0;
  const totalFields = 15;
  
  // Required fields
  if (this.fullName) score++;
  if (this.email) score++;
  if (this.graduationYear) score++;
  if (this.currentRole) score++;
  
  // Optional but important fields
  if (this.phone) score++;
  if (this.location) score++;
  if (this.currentCompany) score++;
  if (this.domain) score++;
  if (this.skills && this.skills.length > 0) score++;
  if (this.bio) score++;
  if (this.careerJourney) score++;
  if (this.socialLinks.linkedIn) score++;
  if (this.achievements && this.achievements.length > 0) score++;
  if (this.interests && this.interests.length > 0) score++;
  if (this.adviceForStudents) score++;
  
  return Math.round((score / totalFields) * 100);
});

// Method to increment profile views
AlumniSchema.methods.incrementViews = function() {
  this.profileViews += 1;
  this.lastActiveAt = new Date();
  return this.save();
};

// Method to get alumni by graduation year range
AlumniSchema.statics.getByGraduationRange = function(startYear, endYear) {
  return this.find({
    graduationYear: {
      $gte: startYear,
      $lte: endYear
    },
    isActive: true,
    isPublic: true
  }).sort({ graduationYear: -1 });
};

// Method to get available mentors
AlumniSchema.statics.getAvailableMentors = function(domain = null) {
  const query = {
    'engagementPreferences.willingToMentor': true,
    isActive: true,
    isPublic: true
  };
  
  if (domain) {
    query.domain = domain;
  }
  
  return this.find(query)
    .populate('user', 'name email avatar')
    .sort({ profileViews: -1 });
};

// Method to get available speakers
AlumniSchema.statics.getAvailableSpeakers = function(domain = null) {
  const query = {
    'engagementPreferences.willingToSpeak': true,
    isActive: true,
    isPublic: true
  };
  
  if (domain) {
    query.domain = domain;
  }
  
  return this.find(query)
    .populate('user', 'name email avatar')
    .sort({ profileViews: -1 });
};

// Method to search alumni
AlumniSchema.statics.searchAlumni = function(searchTerm, filters = {}) {
  const query = {
    isActive: true,
    isPublic: true,
    ...filters
  };
  
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  return this.find(query)
    .populate('user', 'name email avatar')
    .sort(searchTerm ? { score: { $meta: 'textScore' } } : { profileViews: -1 });
};

// Pre-save middleware to update lastActiveAt
AlumniSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActiveAt')) {
    this.lastActiveAt = new Date();
  }
  next();
});

export default mongoose.model('Alumni', AlumniSchema);