import mongoose from 'mongoose';

const socialFeedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Optional Club Association
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },
  
  // Content
  content: {
    type: String,
    required: true
  },
  mediaUrls: [String],
  
  // Linked Entity (FIX from audit)
  linkedEntity: {
    entityType: {
      type: String,
      enum: ['course', 'problem', 'event', 'reel', 'none'],
      default: 'none'
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  
  // Engagement (Denormalized)
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Visibility
  isPublic: { type: Boolean, default: true },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, immutable: true, index: true },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes
socialFeedPostSchema.index({ userId: 1, createdAt: -1 });
socialFeedPostSchema.index({ clubId: 1, createdAt: -1 });
socialFeedPostSchema.index({ createdAt: -1 });
socialFeedPostSchema.index({ isPublic: 1 });

// Query middleware
socialFeedPostSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('SocialFeedPost', socialFeedPostSchema);
