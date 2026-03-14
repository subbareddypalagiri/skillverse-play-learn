import mongoose from 'mongoose';

const clubMembershipSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Role in Club
  role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member'
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'removed'],
    default: 'active'
  },
  
  // Join Date
  joinedAt: { type: Date, default: Date.now },
  
  // Soft Delete
  isDeleted: { type: Boolean, default: false, index: true },
  
  // Audit
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Composite Unique Index (FIX from audit)
clubMembershipSchema.index({ clubId: 1, userId: 1 }, { unique: true, sparse: true });
clubMembershipSchema.index({ userId: 1, joinedAt: -1 });
clubMembershipSchema.index({ clubId: 1, role: 1 });

// Query middleware
clubMembershipSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('ClubMembership', clubMembershipSchema);
