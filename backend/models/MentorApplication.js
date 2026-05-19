import mongoose from 'mongoose';

const mentorApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Application Details
  domain: {
    type: String,
    required: true,
    enum: ['ai', 'web', 'mobile', 'cloud', 'data', 'design']
  },
  role: {
    type: String,
    required: true,
    maxlength: 100
  },
  company: {
    type: String,
    required: true,
    maxlength: 100
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  expertise: [{
    type: String,
    required: true,
    maxlength: 50
  }],
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Services they want to offer
  intendedServices: [{
    type: {
      type: String,
      enum: ['Mock Interview', 'Resume Review', 'Career Guidance', 'Project Review', 'Roadmap Planning', 'Skill Assessment'],
      required: true
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: 15,
      max: 180
    },
    price: {
      type: Number, // in currency units
      default: 0,
      min: 0
    }
  }],
  
  // Availability preference
  preferredTimeSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    timeRanges: [{
      start: String, // e.g., "09:00"
      end: String    // e.g., "17:00"
    }]
  }],
  
  // Additional Info
  languages: [{
    type: String,
    default: ['English']
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },
  socialLinks: {
    linkedIn: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(v);
        },
        message: 'Please enter a valid LinkedIn URL'
      }
    },
    github: String,
    portfolio: String,
    twitter: String
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  
  // Admin Review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  rejectionReason: String,
  
  // Application motivation
  motivation: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Sample work or portfolio links
  portfolioItems: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['project', 'article', 'video', 'repository', 'other']
    }
  }],
  
  // References (optional)
  references: [{
    name: String,
    role: String,
    company: String,
    email: String,
    relationship: String // e.g., "Former colleague", "Manager"
  }]
}, {
  timestamps: true
});

// Indexes
mentorApplicationSchema.index({ user: 1, status: 1 });
mentorApplicationSchema.index({ domain: 1, status: 1 });
mentorApplicationSchema.index({ status: 1, createdAt: -1 });

// Method to approve application
mentorApplicationSchema.methods.approve = async function(reviewerId, reviewNotes) {
  const Mentor = mongoose.model('Mentor');
  
  // Create mentor profile
  const mentorData = {
    user: this.user,
    domain: this.domain,
    role: this.role,
    company: this.company,
    expertise: this.expertise,
    bio: this.bio,
    yearsOfExperience: this.yearsOfExperience,
    services: this.intendedServices,
    availability: this.preferredTimeSlots.map(slot => ({
      day: slot.day,
      slots: slot.timeRanges.map(range => ({
        startTime: range.start,
        endTime: range.end,
        isBooked: false
      }))
    })),
    languages: this.languages,
    timezone: this.timezone,
    socialLinks: this.socialLinks,
    isActive: true
  };
  
  await Mentor.create(mentorData);
  
  // Update application status
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.reviewNotes = reviewNotes;
  
  return this.save();
};

export default mongoose.model('MentorApplication', mentorApplicationSchema);