import mongoose from 'mongoose';

const reelFollowSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

reelFollowSchema.index({ followerId: 1, creatorId: 1 }, { unique: true });
reelFollowSchema.index({ creatorId: 1, createdAt: -1 });

export default mongoose.model('ReelFollow', reelFollowSchema);
