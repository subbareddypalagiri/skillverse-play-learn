import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  // Problem Metadata
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Problem Details
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  topic: String,
  tags: [String],
  
  // External Source
  source: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeForces', 'AtCoder', 'CodeChef'],
    required: true
  },
  externalId: String,
  externalUrl: {
    type: String,
    required: true
  },
  
  // Problem Metadata
  acceptance: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  successfulSubmissions: {
    type: Number,
    default: 0
  },
  
  // Related Course & Topic
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  relatedTopic: {
    topicName: String,
    topicIndex: Number
  },
  
  // Problem Content
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  hints: [String],
  
  // Recommendations
  recommendedFor: {
    courseIds: [mongoose.Schema.Types.ObjectId],
    topics: [String],
    levels: [String]
  },
  
  // Statistics
  attempts: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  avgTime: {
    type: Number,
    default: 0
  },
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
problemSchema.index({ source: 1, externalId: 1 }, { unique: true });
problemSchema.index({ difficulty: 1, category: 1 });
problemSchema.index({ relatedCourse: 1, relatedTopic: 1 });
problemSchema.index({ tags: 1 });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
