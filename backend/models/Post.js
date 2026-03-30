import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content
  caption: { type: String, trim: true, maxlength: 2200 },
  
  // Media (supports multiple images or single video)
  mediaType: {
    type: String,
    enum: ['image', 'video', 'text'],
    required: true
  },
  mediaUrls: [{
    url: { type: String, required: true },
    thumbnail: String,
    width: Number,
    height: Number
  }],
  
  // Classification
  category: {
    type: String,
    enum: ['general', 'achievement', 'project', 'learning', 'career', 'question', 'tip'],
    default: 'general'
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  
  // Engagement counts (denormalized for performance)
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },

  // Engagement actors
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Comments embedded for fast reads
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Status
  isPublished: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ likesCount: -1, commentsCount: -1 });
postSchema.index({ caption: 'text', tags: 'text' });

// Query middleware - exclude soft deleted
postSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Post', postSchema);
