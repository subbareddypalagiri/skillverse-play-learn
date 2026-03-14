import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: String,
  category: String,
  
  // Founder/Creator
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Club Image
  imageUrl: String,
  
  // Membership Stats (Denormalized)
  memberCount: { type: Number, default: 1 },
  
  // Access Control
  isPublic: { type: Boolean, default: true },
  
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

// Indexes
clubSchema.index({ creatorId: 1 });
clubSchema.index({ isPublic: 1 });
clubSchema.index({ createdAt: -1 });
clubSchema.createIndex({ name: 'text', description: 'text' });

// Query middleware
clubSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Club', clubSchema);
