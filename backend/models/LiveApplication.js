import mongoose from 'mongoose';

const liveApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: {
    type: [String],
    required: [true, 'Please specify your skills']
  },
  portfolioUrl: String,
  linkedinUrl: String,
  certificateIds: [String], // Linked certificate verification keys
  pitch: {
    type: String,
    required: [true, 'Please tell us what topics you plan to teach live']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rejectionReason: String
}, {
  timestamps: true
});

export default mongoose.model('LiveApplication', liveApplicationSchema);
