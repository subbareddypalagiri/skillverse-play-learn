import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'link'],
    default: 'text'
  },
  mediaUrl: {
    type: String
  },
  reactions: [{
    emoji: String,
    count: {
      type: Number,
      default: 0
    },
    users: [String]
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'document', 'link']
  },
  type: {
    type: String,
    enum: ['text', 'announcement', 'poll', 'event'],
    default: 'text'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [String],
  comments: [{
    userId: String,
    userName: String,
    userAvatar: String,
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [String]
  }],
  tags: [String]
}, {
  timestamps: true
});

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  maxAttendees: {
    type: Number,
    default: 50
  },
  attendees: [{
    userId: String,
    userName: String,
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    userId: String,
    userName: String
  }
}, {
  timestamps: true
});

const clubSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: String,
  category: {
    type: String,
    enum: ['hobby', 'club', 'academic', 'professional', 'social'],
    default: 'club'
  },
  type: {
    type: String,
    enum: ['art', 'music', 'sports', 'tech', 'photography', 'reading', 'gaming', 'dance', 'drama', 'debate', 'science', 'other'],
    default: 'other'
  },
  
  // Admin & Members
  adminId: {
    type: String,
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  members: [{
    id: String,
    name: String,
    avatar: String,
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    isOnline: {
      type: Boolean,
      default: false
    }
  }],
  
  // Legacy fields (keeping for compatibility)
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: String,
  memberCount: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: true },
  
  // Enhanced Features
  coverImage: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  requireApproval: {
    type: Boolean,
    default: false
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  
  // Content
  posts: [PostSchema],
  messages: [MessageSchema],
  events: [EventSchema],
  
  // Settings
  features: {
    chatEnabled: {
      type: Boolean,
      default: true
    },
    eventsEnabled: {
      type: Boolean,
      default: true
    },
    resourcesEnabled: {
      type: Boolean,
      default: true
    }
  },
  
  // Statistics
  stats: {
    totalPosts: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    totalEvents: {
      type: Number,
      default: 0
    }
  },
  
  tags: [String],
  
  // Soft Delete (legacy)
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  
  // Audit (legacy)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Indexes
clubSchema.index({ creatorId: 1 });
clubSchema.index({ isPublic: 1 });
clubSchema.index({ createdAt: -1 });
clubSchema.index({ type: 1, category: 1 });
clubSchema.index({ 'members.id': 1 });
clubSchema.index({ tags: 1 });
clubSchema.index({ isActive: 1, isPrivate: 1 });
clubSchema.createIndex({ name: 'text', description: 'text' });

// Virtual for member count
clubSchema.virtual('actualMemberCount').get(function() {
  return this.members.length;
});

// Virtual for online member count
clubSchema.virtual('onlineMemberCount').get(function() {
  return this.members.filter(member => member.isOnline).length;
});

// Methods
clubSchema.methods.addMember = function(userId, userName, userAvatar = '') {
  if (this.members.some(member => member.id === userId)) {
    throw new Error('User is already a member');
  }
  
  if (this.members.length >= this.maxMembers) {
    throw new Error('Club has reached maximum member capacity');
  }
  
  this.members.push({
    id: userId,
    name: userName,
    avatar: userAvatar,
    role: 'member',
    joinedAt: new Date(),
    lastActive: new Date(),
    isOnline: true
  });
  
  // Update legacy memberCount
  this.memberCount = this.members.length;
  
  return this.save();
};

clubSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => member.id !== userId);
  this.memberCount = this.members.length;
  return this.save();
};

clubSchema.methods.addPost = function(postData) {
  this.posts.push(postData);
  this.stats.totalPosts++;
  return this.save();
};

clubSchema.methods.addMessage = function(messageData) {
  this.messages.push(messageData);
  this.stats.totalMessages++;
  return this.save();
};

clubSchema.methods.addEvent = function(eventData) {
  this.events.push(eventData);
  this.stats.totalEvents++;
  return this.save();
};

// Static methods
clubSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ memberCount: -1 });
};

clubSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ memberCount: -1, 'stats.totalPosts': -1 })
    .limit(limit);
};

// Query middleware
clubSchema.pre(['find', 'findOne'], function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model('Club', clubSchema);
