import mongoose from 'mongoose';

const liveRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Live stream title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  topic: {
    type: String,
    required: [true, 'Live stream topic is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled'
  },
  viewerCount: {
    type: Number,
    default: 0
  },
  startedAt: Date,
  endedAt: Date,
  isPrivate: {
    type: Boolean,
    default: false
  },
  passcode: {
    type: String,
    trim: true,
    select: false // Automatically hide passcode from general queries for security
  }
}, {
  timestamps: true
});

export default mongoose.model('LiveRoom', liveRoomSchema);
