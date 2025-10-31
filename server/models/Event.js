import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['cultural', 'technical', 'non-technical', 'fun-tours', 'industrial-tours', 'hackathons']
  },
  type: {
    type: String,
    required: [true, 'Please provide event type'],
    enum: ['Competition', 'Workshop', 'Learning', 'Adventure', 'Social']
  },
  mode: {
    type: String,
    required: [true, 'Please specify mode'],
    enum: ['online', 'offline'],
    default: 'offline'
  },
  date: {
    type: String,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  duration: {
    type: String,
    required: [true, 'Please provide duration']
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    enum: ['In Campus', 'Out of Campus']
  },
  venue: {
    type: String,
    required: [true, 'Please provide venue']
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Please provide max attendees'],
    min: [1, 'Must have at least 1 attendee']
  },
  attendees: {
    type: Number,
    default: 0
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  requirements: {
    type: String
  },
  prizes: {
    type: String
  },
  organizer: {
    type: String,
    required: [true, 'Please provide organizer name']
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact email']
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
