import mongoose from 'mongoose';

const tourDetailsSchema = new mongoose.Schema({
  destinations: [{ name: String, description: String, arrivalTime: String }],
  food: { meals: String, snacks: String, dietaryOptions: String },
  planner: { name: String, organization: String, contact: String },
  bus: {
    busNumber: String,
    pickupPoint: String,
    departureTime: String,
    returnTime: String,
    driverName: String,
    driverContact: String,
    capacity: Number
  },
  itinerary: String,
  thingsToCarry: [String]
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,

  eventType: {
    type: String,
    enum: ['webinar', 'workshop', 'hackathon', 'meetup', 'conference', 'live_class', 'tour', 'seminar', 'networking', 'cultural', 'competition'],
    required: true
  },

  category: {
    type: String,
    enum: ['cultural', 'technical', 'non-technical', 'fun-tours', 'industrial-tours', 'hackathons'],
    default: 'technical'
  },

  campusLocation: {
    type: String,
    enum: ['In Campus', 'Out of Campus'],
    default: 'In Campus'
  },

  mode: { type: String, enum: ['online', 'offline'], default: 'offline' },
  type: { type: String, default: 'Event' },

  venue: String,
  duration: String,
  displayDate: String,
  displayTime: String,

  location: String,
  isOnline: { type: Boolean, default: false },
  eventLink: String,

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  linkedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },

  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeName: String,

  tourDetails: tourDetailsSchema,

  visibility: {
    type: String,
    enum: ['public', 'private', 'course_members_only'],
    default: 'public'
  },
  allowedRoles: [String],

  capacity: { type: Number, default: null },
  registeredCount: { type: Number, default: 0 },

  hasRecording: { type: Boolean, default: false },
  recordingUrl: String,

  isActive: { type: Boolean, default: true },
  isCancelled: { type: Boolean, default: false },

  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, { timestamps: true });

eventSchema.index({ startDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ campusLocation: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ collegeName: 1 });
eventSchema.index({ visibility: 1 });
eventSchema.index({ title: 'text', description: 'text' });

eventSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Event', eventSchema);
