import mongoose from 'mongoose';

const eventMemorySchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: String,
  type: {
    type: String,
    enum: ['video', 'photo'],
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

const EventMemory = mongoose.model('EventMemory', eventMemorySchema);
export default EventMemory;
