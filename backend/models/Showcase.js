import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // GitHub Integration
  github: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    publicRepos: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    topLanguages: [{ type: String }],
    lastSynced: { type: Date }
  },
  
  // LinkedIn Integration
  linkedin: {
    connected: { type: Boolean, default: false },
    profileUrl: { type: String, default: '' },
    headline: { type: String, default: '' },
    lastSynced: { type: Date }
  },
  
  // LeetCode Integration
  leetcode: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    ranking: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    lastSynced: { type: Date }
  },

  // CodeForces Integration (Competitive Programming)
  codeforces: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: '' },
    maxRank: { type: String, default: '' },
    contestsCount: { type: Number, default: 0 },
    lastSynced: { type: Date }
  },

  // HackerRank Integration
  hackerrank: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    badges: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    solvedProblems: { type: Number, default: 0 },
    languages: [{ type: String }],
    lastSynced: { type: Date }
  },

  // Stack Overflow Integration
  stackoverflow: {
    connected: { type: Boolean, default: false },
    userId: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    reputation: { type: Number, default: 0 },
    badges: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    displayName: { type: String, default: '' },
    lastSynced: { type: Date }
  },

  // Dev.to Integration (Developer Articles)
  devto: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    articlesCount: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    lastSynced: { type: Date }
  },

  // Personal Portfolio/Website
  portfolio: {
    connected: { type: Boolean, default: false },
    websiteUrl: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },

  // Codepen Integration (Frontend Projects)
  codepen: {
    connected: { type: Boolean, default: false },
    username: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    pens: { type: Number, default: 0 },
    followers: { type: Number, default: 0 }
  },

  // Visibility Settings
  visibility: {
    github: { type: Boolean, default: true },
    linkedin: { type: Boolean, default: true },
    leetcode: { type: Boolean, default: true },
    codeforces: { type: Boolean, default: true },
    hackerrank: { type: Boolean, default: true },
    stackoverflow: { type: Boolean, default: true },
    devto: { type: Boolean, default: true },
    portfolio: { type: Boolean, default: true },
    codepen: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for faster queries
showcaseSchema.index({ userId: 1 });

export default mongoose.model('Showcase', showcaseSchema);
