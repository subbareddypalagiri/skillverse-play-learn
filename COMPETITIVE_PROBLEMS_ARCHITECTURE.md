# Competitive Problems System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CourseDashboard.tsx               │ CompetitiveProblemsDashboard │
│  ├─ Topic completed?               │ ├─ User skill level display  │
│  ├─ Show problems                  │ ├─ Statistics by difficulty  │
│  └─ Problem grid                   │ ├─ Recent attempts tab       │
│       └─ ProblemRecommendations    │ └─ Difficulty progression    │
│           ├─ Problem cards         │                               │
│           ├─ Difficulty badges     │                               │
│           ├─ Modal dialog          │                               │
│           └─ "Solve" button        │                               │
│                                                                    │
└────────────────────────┬───────────────────────────────────────┘
                         │
              HTTP/REST API Calls
                         │
         ┌───────────────┴────────────────┐
         │                                │
         ↓                                ↓
   ┌──────────────────┐          ┌──────────────────┐
   │  PUBLIC ROUTES   │          │ AUTH ROUTES      │
   ├──────────────────┤          ├──────────────────┤
   │ GET /problems    │          │ GET /recommended │
   │ GET /problems/:id│          │ POST /attempt    │
   │ GET /course/:c/:t│          │ GET /history     │
   │                  │          │ GET /difficulty  │
   └────────┬─────────┘          └────────┬─────────┘
            │                             │
            └─────────────┬───────────────┘
                          │
                    ┌─────▼──────────────────────┐
                    │  problemController.js      │
                    │  (550+ lines)              │
                    │                            │
                    │  Functions:                │
                    │  • getProblems()           │
                    │  • getProblem()            │
                    │  • getRecommendedProblems()│
                    │  • recordProblemAttempt()  │
                    │  • getUserProblemHistory() │
                    │  • getUserDifficultyLevel()│
                    │  • syncProblemsFromSource()│
                    │  • getCourseTopicProblems()│
                    │                            │
                    │  Helpers:                  │
                    │  • updateUserDifficultyLevel()
                    │  • syncFromLeetCode()      │
                    │  • syncFromGFG()           │
                    │  • syncFromHackerRank()    │
                    └──────────┬─────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ↓              ↓              ↓
         ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
         │  Problem.js  │ │ProblemAttempt│ │UserDifficulty
         │              │ │    .js       │ │     .js      │
         │ (MongoDB)    │ │              │ │              │
         │              │ │ (MongoDB)    │ │ (MongoDB)    │
         └──────────────┘ └──────────────┘ └──────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               │
              ┌────────────────▼─────────────────┐
              │    MongoDB Collections           │
              ├────────────────────────────────┤
              │                                  │
              │  problems                        │
              │  ├─ _id                          │
              │  ├─ title                        │
              │  ├─ difficulty (Easy/Med/Hard)  │
              │  ├─ source (LeetCode/GFG/etc)   │
              │  ├─ externalUrl                  │
              │  ├─ category, topic, tags        │
              │  ├─ acceptanceRate               │
              │  ├─ attempts, successRate        │
              │  └─ indexes on: source+id, diff, │
              │                 category, topic   │
              │                                  │
              │  problem_attempts               │
              │  ├─ userId                       │
              │  ├─ problemId                    │
              │  ├─ courseId                     │
              │  ├─ verdict                      │
              │  ├─ runtime, memory              │
              │  ├─ testCasesPass/Total          │
              │  ├─ attemptNumber, isBest        │
              │  └─ indexes on: userId+problemId,│
              │                 courseId+userId   │
              │                                  │
              │  user_difficulty_levels         │
              │  ├─ userId                       │
              │  ├─ currentLevel (Beg/Int/Adv)  │
              │  ├─ totalAttempted/Solved        │
              │  ├─ overallSuccessRate           │
              │  ├─ easyProblems/Medium/Hard     │
              │  ├─ byCategory {}                │
              │  ├─ byCourse {}                  │
              │  └─ recommendedDifficultyRange   │
              │                                  │
              └──────────────────────────────────┘
```

## Request/Response Flow

### Get Recommended Problems
```
GET /api/problems/recommended/:courseId/:topicIndex
  ↓ (with auth token)
  
problemController.getRecommendedProblems()
  │
  ├─ 1. Fetch course from database
  ├─ 2. Get course[topicIndex].title
  ├─ 3. Fetch user's difficulty level
  ├─ 4. Filter problems by:
  │     ├─ relatedCourse === courseId
  │     ├─ relatedTopics includes topic
  │     └─ difficulty in recommendedRange
  ├─ 5. Sort by success rate descending
  └─ 6. Return paginated results

Response: {
  success: true,
  data: {
    problems: [
      {
        _id: "...",
        title: "Two Sum",
        difficulty: "Easy",
        source: "LeetCode",
        externalUrl: "...",
        acceptanceRate: 47.5,
        successRate: 45.2,
        attempts: 1500000
      }
    ],
    total: 25,
    page: 1
  }
}
```

### Record Problem Attempt
```
POST /api/problems/:problemId/attempt
Body: {
  verdict: "Accepted",
  runtime: 250,
  memory: 32.5,
  testCasesPass: 15,
  testCasesTotal: 15
}

problemController.recordProblemAttempt()
  │
  ├─ 1. Create ProblemAttempt document
  ├─ 2. Update Problem stats:
  │     ├─ attempts++
  │     └─ successRate = (accepted/attempts)*100
  ├─ 3. Call updateUserDifficultyLevel()
  │     │
  │     ├─ Calculate user's success rate
  │     ├─ Determine new level:
  │     │   ├─ If > 75%: Advanced
  │     │   ├─ If 60-75%: Intermediate
  │     │   └─ If < 60%: Beginner
  │     └─ Update recommendedDifficultyRange
  │
  └─ 4. Return updated user level

Response: {
  success: true,
  data: {
    attempt: { _id, verdict, runtime, ... },
    updatedDifficultyLevel: {
      currentLevel: "Intermediate",
      totalAttempted: 45,
      totalSolved: 32,
      overallSuccessRate: 71,
      recommendedDifficultyRange: {min: "Easy", max: "Hard"}
    }
  }
}
```

### Get User Difficulty
```
GET /api/problems/difficulty/:userId

problemController.getUserDifficultyLevel()
  │
  ├─ 1. Find UserDifficultyLevel doc
  ├─ 2. Calculate fresh metrics:
  │     ├─ Count all ProblemAttempts
  │     ├─ Filter by verdict="Accepted"
  │     ├─ Calculate success rates
  │     └─ Group by difficulty
  └─ 3. Return with recommendations

Response: {
  success: true,
  data: {
    difficulty: {
      _id: "...",
      userId: "...",
      currentLevel: "Advanced",
      totalProblemsAttempted: 125,
      totalProblemsSolved: 98,
      overallSuccessRate: 78.4,
      easyProblems: { attempted: 40, solved: 38, successRate: 95 },
      mediumProblems: { attempted: 50, solved: 38, successRate: 76 },
      hardProblems: { attempted: 35, solved: 22, successRate: 62.8 },
      byCategory: {
        "Hash Map": { attempted: 30, solved: 25, successRate: 83.3 },
        "Tree": { attempted: 25, solved: 18, successRate: 72 }
      },
      byCourse: {
        "course123": {
          attempted: 45,
          solved: 35,
          successRate: 77.7,
          easyProblems: { ... }
        }
      },
      recommendedDifficultyRange: { min: "Medium", max: "Hard" }
    }
  }
}
```

## Data Model Details

### Problem Document
```javascript
{
  // Identity
  _id: ObjectId,
  externalId: "1",              // LeetCode ID
  source: "LeetCode",           // Required: LeetCode, GFG, HackerRank, etc
  externalUrl: "https://...",   // Link to solve on platform

  // Content
  title: "Two Sum",
  description: "Given an array of integers nums...",
  difficulty: "Easy",           // Easy, Medium, Hard
  category: "Hash Map",
  topic: "Data Structures",
  tags: ["array", "hash-map", "two-pointers"],

  // Details
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "0,1",
      explanation: "..."
    }
  ],
  constraints: "1 <= nums.length <= 10^4",
  hints: ["Use a hash map to store values...", "..."],
  editorialUrl: "https://...",

  // Recommendations by language
  recommendations: {
    java: { template: "...", tips: "..." },
    python: { template: "...", tips: "..." }
  },

  // Statistics (aggregated from all users)
  acceptanceRate: 47.5,         // % of users who solved
  successRate: 47.5,            // % of submissions accepted
  attempts: 1500000,            // Total submissions
  avgTime: 12.5,                // Average time in minutes

  // Relations
  relatedCourse: ObjectId,
  relatedTopics: ["arrays", "hash-table"],
  relatedProblems: [ObjectId, ...],

  // Metadata
  createdAt: ISODate,
  updatedAt: ISODate
}

// Indexes
db.problems.createIndex({ source: 1, externalId: 1 }, {unique: true})
db.problems.createIndex({ difficulty: 1, category: 1 })
db.problems.createIndex({ relatedCourse: 1, relatedTopics: 1 })
db.problems.createIndex({ tags: 1 })
db.problems.createIndex({ acceptanceRate: -1 })
```

### ProblemAttempt Document
```javascript
{
  // Identity
  _id: ObjectId,
  userId: ObjectId,
  problemId: ObjectId,
  courseId: ObjectId,

  // Submission info
  verdict: "Accepted",          // Accepted, Wrong Answer, TLE, RE, etc
  language: "python3",
  submittedAt: ISODate,

  // Performance metrics
  runtime: 245,                 // milliseconds
  runtimePercentile: 95,        // % of submissions faster
  memory: 34.2,                 // MB
  memoryPercentile: 78,         // % of submissions using less memory

  // Test results
  testCasesPass: 15,
  testCasesTotal: 15,
  passPercentage: 100,
  failureReason: "None",        // For failed tests

  // Attempt tracking
  attemptNumber: 1,
  isBestAttempt: true,
  previousAttempts: [ObjectId, ...],

  // User actions
  timeSpent: 3600,              // seconds
  hintUsed: false,
  hintCount: 0,

  // Difficulty metadata
  problemDifficultyAtTime: "Easy",
  problemCategoryAtTime: "Hash Map",

  // Metadata
  createdAt: ISODate,
  updatedAt: ISODate
}

// Indexes
db.problem_attempts.createIndex({ userId: 1, problemId: 1 })
db.problem_attempts.createIndex({ userId: 1, verdict: 1 })
db.problem_attempts.createIndex({ courseId: 1, userId: 1 })
db.problem_attempts.createIndex({ submittedAt: -1 })
db.problem_attempts.createIndex({ verdict: 1, problemDifficultyAtTime: 1 })
```

### UserDifficultyLevel Document
```javascript
{
  // Identity
  _id: ObjectId,
  userId: ObjectId,

  // Current assessment
  currentLevel: "Advanced",     // Beginner, Intermediate, Advanced, Expert
  lastAssessmentAt: ISODate,
  assessmentVersion: 2,         // Track algo version changes

  // Overall statistics
  totalProblemsAttempted: 125,
  totalProblemsSolved: 98,
  overallSuccessRate: 78.4,

  // By difficulty level
  easyProblems: {
    attempted: 40,
    solved: 38,
    successRate: 95,
    lastAttemptAt: ISODate
  },
  mediumProblems: {
    attempted: 50,
    solved: 38,
    successRate: 76,
    lastAttemptAt: ISODate
  },
  hardProblems: {
    attempted: 35,
    solved: 22,
    successRate: 62.8,
    lastAttemptAt: ISODate
  },

  // By category (flexible, dynamically added)
  byCategory: {
    "Hash Map": { attempted: 30, solved: 25, successRate: 83.3 },
    "Tree": { attempted: 25, solved: 18, successRate: 72 },
    "Array": { attempted: 20, solved: 19, successRate: 95 },
    "Dynamic Programming": { attempted: 30, solved: 20, successRate: 66.7 }
  },

  // By course (flexible, per-course progression)
  byCourse: {
    "dsa-course-123": {
      attempted: 45,
      solved: 35,
      successRate: 77.7,
      easyProblems: { attempted: 15, solved: 14, successRate: 93.3 },
      mediumProblems: { attempted: 20, solved: 16, successRate: 80 },
      hardProblems: { attempted: 10, solved: 5, successRate: 50 },
      currentLevel: "Intermediate",
      lastAttemptAt: ISODate
    },
    "web-dev-course-456": {
      attempted: 30,
      solved: 25,
      successRate: 83.3,
      // ... similar breakdown
    }
  },

  // Recommendation
  recommendedDifficultyRange: {
    min: "Medium",              // Easy, Medium, Hard
    max: "Hard",
    reason: "75%+ success rate on current level"
  },

  // Progression tracking
  levelProgressionHistory: [
    { level: "Beginner", reachedAt: ISODate, successRate: 55 },
    { level: "Intermediate", reachedAt: ISODate, successRate: 68 },
    { level: "Advanced", reachedAt: ISODate, successRate: 78 }
  ],

  // Streaks
  currentStreak: 7,             // Days with at least 1 attempt
  longestStreak: 21,
  lastAttemptAt: ISODate,

  // Metadata
  createdAt: ISODate,
  updatedAt: ISODate
}

// Indexes
db.user_difficulty_levels.createIndex({ userId: 1 }, {unique: true})
db.user_difficulty_levels.createIndex({ currentLevel: 1, overallSuccessRate: -1 })
db.user_difficulty_levels.createIndex({ lastAssessmentAt: -1 })
```

## Component Integration Points

### ProblemRecommendations Component
```typescript
interface Props {
  courseId: string;           // Course ID
  topicIndex: number;         // Index in syllabus
  topicName: string;          // Display name
  onProblemAttempt?: (problemId, result) => void;  // Callback
}

Renders: 
  - Problem grid (responsive)
  - Difficulty badges with colors
  - Source platform icons
  - Success rate percentage
  - Total attempts count
  - Modal with problem details
  - "Solve" button links
  - "Record Attempt" button
  - Loading skeleton
  - Empty state message
  - Error message with retry
```

### CompetitiveProblemsDashboard Component
```typescript
Displays:
  - User's current skill level (with gradient bg)
  - Total problems solved (with badge)
  - Overall success rate
  - Recommended difficulty range
  
  - Stats by difficulty:
    * Easy: X/Y solved, Z% success
    * Medium: X/Y solved, Z% success
    * Hard: X/Y solved, Z% success
    (with progress bars)
  
  - Recent 10 attempts:
    * Problem title
    * Verdict (color-coded)
    * Test cases passed/total
    * Submission timestamp
  
  - 3 Tabs:
    * Overview (stats)
    * Difficulty Progress (explanation)
    * Recent Attempts (history)
```

## API Security

### Public Endpoints
- No authentication required
- Rate limited: 100 req/min per IP
- Caching: 5 min

### Authenticated Endpoints
- Requires valid JWT in Authorization header
- Rate limited: 200 req/min per user
- Can only access own data
- Can update own attempts

### Admin Endpoints
- Requires JWT + admin role
- Rate limited: 50 req/min
- Can sync from external sources
- Can modify problem metadata

## Error Handling

All controllers implement:
```javascript
try {
  // Main logic
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({
    success: false,
    message: 'Error message',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

Common HTTP codes:
- 200: Success
- 400: Bad request (invalid input)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not found
- 500: Server error

---

## Performance Considerations

### Indexing Strategy
```
Hot queries:
  GET /problems/recommended/:courseId/:topicIndex
    → Indexes: relatedCourse + relatedTopics, difficulty

  POST /problems/:id/attempt
    → Indexes: problemId (primary key)

  GET /problems/history/:userId
    → Indexes: userId, submittedAt (for sorting)

  GET /problems/difficulty/:userId
    → Indexes: userId (unique)
```

### Caching Strategy
```
Frontend caching:
  - Problem recommendations: 5 min TTL
  - User difficulty level: 10 min TTL
  - Problem details: 30 min TTL

Backend caching:
  - User difficulty: Redis with 10 min TTL
  - Problem stats: Redis with 1 hour TTL
  - Course metadata: Redis with 24 hour TTL
```

### Pagination
All list endpoints support:
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 50)

Example: `/api/problems?page=2&limit=20`

---

**Architecture Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready
