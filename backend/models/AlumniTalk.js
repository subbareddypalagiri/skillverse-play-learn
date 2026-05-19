import mongoose from 'mongoose';

const alumniTalkSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: ['ai', 'web', 'mobile', 'cloud', 'data', 'design'],
    index: true
  },
  speaker: {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=1'
    },
    bio: {
      type: String,
      maxlength: 500
    },
    linkedIn: String,
    twitter: String
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  scheduledAt: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    default: 60, // minutes
    required: true
  },
  meetingLink: {
    type: String
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxAttendees: {
    type: Number,
    default: 500
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  recordingUrl: String,
  questions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    question: {
      type: String,
      required: true
    },
    answer: String,
    askedAt: {
      type: Date,
      default: Date.now
    },
    answeredAt: Date
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for attendee count
alumniTalkSchema.virtual('attendeeCount').get(function() {
  return this.registrations?.length || 0;
});

// Ensure virtuals are included in JSON output
alumniTalkSchema.set('toJSON', { virtuals: true });
alumniTalkSchema.set('toObject', { virtuals: true });

// Index for searching
alumniTalkSchema.index({ topic: 'text', description: 'text', 'speaker.name': 'text' });

export default mongoose.model('AlumniTalk', alumniTalkSchema);
