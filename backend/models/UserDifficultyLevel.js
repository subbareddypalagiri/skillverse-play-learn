import mongoose from 'mongoose';

const userDifficultyLevelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: { unique: true }
  },
  
  // Overall Difficulty Level
  currentLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  
  // Per Category Difficulty Tracking
  byCategory: {
    type: Map,
    of: {
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
      },
      easyCompleted: { type: Number, default: 0 },
      mediumCompleted: { type: Number, default: 0 },
      hardCompleted: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    },
    default: new Map()
  },
  
  // Overall Statistics
  totalProblemsAttempted: { type: Number, default: 0 },
  totalProblemsSolved: { type: Number, default: 0 },
  overallSuccessRate: { type: Number, default: 0 },
  
  // Per Difficulty Breakdown
  easyProblems: {
    attempted: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  mediumProblems: {
    attempted: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  hardProblems: {
    attempted: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  
  // Learning Progress
  skillProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  recommendedDifficultyRange: {
    min: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    max: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    }
  },
  
  // Audit fields
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Composite Index
userDifficultyLevelSchema.index({ userId: 1, currentLevel: 1 });

export default mongoose.model('UserDifficultyLevel', userDifficultyLevelSchema);
