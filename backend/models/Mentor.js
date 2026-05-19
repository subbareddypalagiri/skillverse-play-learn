import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['ai', 'web', 'mobile', 'cloud', 'data', 'design'],
    index: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  expertise: [{
    type: String,
    required: true
  }],
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  services: [{
    type: {
      type: String,
      enum: ['Mock Interview', 'Resume Review', 'Career Guidance', 'Project Review', 'Roadmap Planning', 'Skill Assessment'],
      required: true
    },
    duration: {
      type: Number, // minutes
      required: true
    },
    price: {
      type: Number, // in currency units (e.g., dollars)
      default: 0
    }
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [{
      startTime: String, // e.g., "09:00"
      endTime: String,   // e.g., "10:00"
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  sessions: [{
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    service: String,
    scheduledAt: Date,
    duration: Number,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    meetingLink: String,
    notes: String,
    completedAt: Date
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    linkedIn: String,
    github: String,
    twitter: String,
    portfolio: String
  },
  languages: [{
    type: String,
    default: ['English']
  }],
  timezone: {
    type: String,
    default: 'UTC'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
mentorSchema.index({ domain: 1, 'rating.average': -1 });
mentorSchema.index({ totalSessions: -1 });
mentorSchema.index({ expertise: 1 });

// Method to calculate and update rating
mentorSchema.methods.updateRating = function() {
  const completedSessions = this.sessions.filter(s => s.status === 'completed' && s.rating);
  if (completedSessions.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const sum = completedSessions.reduce((acc, s) => acc + s.rating, 0);
  this.rating.average = (sum / completedSessions.length).toFixed(1);
  this.rating.count = completedSessions.length;
};

// Virtual to check if mentor is available now
mentorSchema.virtual('isAvailableNow').get(function() {
  // Simplified check - you can expand this
  return this.isActive && this.availability.length > 0;
});

mentorSchema.set('toJSON', { virtuals: true });
mentorSchema.set('toObject', { virtuals: true });

export default mongoose.model('Mentor', mentorSchema);
