import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content
  title: { type: String, required: true, trim: true },
  description: String,
  
  // Video Asset Management
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  duration: { type: Number, required: true }, // in seconds
  videoSize: Number, // in bytes
  
  // Classification
  category: String,
  tags: [String],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  
  // Engagement (Denormalized)
  viewsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  
  // Learning Metadata (for recommendations)
  avgEngagementTime: Number, // seconds watched
  clickthroughRate: Number, // %
  
  // Recommendation
  recommendationScore: Number,
  targetDifficulty: [String],
  targetCategories: [String],
  recommendedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Analytics
  viewerDemographics: {
    ageRanges: mongoose.Schema.Types.Mixed,
    locations: mongoose.Schema.Types.Mixed,
    roles: mongoose.Schema.Types.Mixed
  },
  
  // Status
  isPublished: { type: Boolean, default: true },
  isSponsored: { type: Boolean, default: false },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  
  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes (optimized for video timeline)
reelSchema.index({ userId: 1, createdAt: -1 });
reelSchema.index({ createdAt: -1, viewsCount: -1 });
reelSchema.index({ tags: 1 });
reelSchema.index({ isPublished: 1 });
reelSchema.index({ createdAt: -1 });
reelSchema.createIndex({ title: 'text', description: 'text', tags: 'text' });

// Query middleware
reelSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Reel', reelSchema);
