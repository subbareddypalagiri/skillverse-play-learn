import mongoose from 'mongoose';

const alumniExpertApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Expert Profile
  domain: {
    type: String,
    required: true,
    enum: ['ai', 'web', 'mobile', 'cloud', 'data', 'design']
  },
  currentRole: {
    type: String,
    required: true,
    maxlength: 100
  },
  currentCompany: {
    type: String,
    required: true,
    maxlength: 100
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 2, // Minimum experience for alumni expert
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
  
  // Speaking Experience
  previousSpeakingExperience: {
    hasSpoken: {
      type: Boolean,
      required: true
    },
    events: [{
      eventName: String,
      eventType: String, // e.g., "Conference", "Meetup", "Webinar"
      topic: String,
      date: Date,
      attendees: Number,
      description: String
    }]
  },
  
  // Proposed Talk Topics
  proposedTopics: [{
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: 30,
      max: 180
    },
    tags: [String]
  }],
  
  // Social Proof
  socialLinks: {
    linkedIn: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(v);
        },
        message: 'Please enter a valid LinkedIn URL'
      }
    },
    github: String,
    twitter: String,
    portfolio: String,
    blog: String
  },
  
  // Portfolio/Work Samples
  portfolioItems: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['project', 'article', 'video', 'repository', 'presentation', 'other'],
      required: true
    }
  }],
  
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
  
  // Motivation and commitment
  motivation: {
    type: String,
    required: true,
    maxlength: 500
  },
  availabilityCommitment: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'as-needed'],
    required: true
  },
  
  // Preferred format
  preferredFormats: [{
    type: String,
    enum: ['live-presentation', 'workshop', 'panel-discussion', 'qa-session', 'demo']
  }],
  
  // References
  references: [{
    name: String,
    role: String,
    company: String,
    email: String,
    relationship: String
  }]
}, {
  timestamps: true
});

// Indexes
alumniExpertApplicationSchema.index({ user: 1, status: 1 });
alumniExpertApplicationSchema.index({ domain: 1, status: 1 });
alumniExpertApplicationSchema.index({ status: 1, createdAt: -1 });

// Method to approve application
alumniExpertApplicationSchema.methods.approve = async function(reviewerId, reviewNotes) {
  // Update application status
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.reviewNotes = reviewNotes;
  
  await this.save();
  
  // The approved expert can now create AlumniTalks
  return this;
};

export default mongoose.model('AlumniExpertApplication', alumniExpertApplicationSchema);