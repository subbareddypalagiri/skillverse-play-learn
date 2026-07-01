import mongoose from 'mongoose';

const ambassadorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeName: {
    type: String,
    required: [true, 'College name is required']
  },
  studentIdCardUrl: {
    type: String,
    default: ""
  },
  skills: [String],
  plannedEventsDesc: {
    type: String,
    required: [true, 'Please explain what kinds of events you want to organize']
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

export default mongoose.model('AmbassadorApplication', ambassadorApplicationSchema);
