import Problem from '../models/Problem.js';
import ProblemAttempt from '../models/ProblemAttempt.js';
import UserDifficultyLevel from '../models/UserDifficultyLevel.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import axios from 'axios';

// =====================================================
// EXTERNAL API INTEGRATIONS
// =====================================================

// LeetCode API Integration
const leetCodeAPI = {
  base: 'https://leetcode.com/api',
  
  async getProblems(filter = {}) {
    try {
      // Note: LeetCode has rate limiting, use with caution
      // In production, use a backend proxy or cache
      const response = await axios.get(`${this.base}/problems/all/`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      return response.data.stat_status_pairs || [];
    } catch (error) {
      console.error('LeetCode API Error:', error.message);
      return [];
    }
  },
  
  async getProblemDetail(slug) {
    try {
      const response = await axios.post(`${this.base}/graphql/`, {
        query: `
          query {
            question(titleSlug: "${slug}") {
              title
              titleSlug
              difficulty
              content
              exampleTestcases
              constraints
              topicTags { name }
              stats
            }
          }
        `
      }, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      return response.data.data.question;
    } catch (error) {
      console.error('LeetCode Detail Error:', error.message);
      return null;
    }
  }
};

// GeeksforGeeks API Integration (using public endpoints)
const gfgAPI = {
  base: 'https://www.geeksforgeeks.org/api',
  
  async getProblems(category, difficulty) {
    try {
      // GFG doesn't have official API, using alternative approach
      // In production, use web scraping or official partner API
      return {
        problems: [],
        message: 'Use GFG direct links or partner API'
      };
    } catch (error) {
      console.error('GFG API Error:', error.message);
      return { problems: [] };
    }
  }
};

// HackerRank API Integration
const hackerRankAPI = {
  base: 'https://www.hackerrank.com/api',
  
  async getProblems(filter = {}) {
    try {
      // HackerRank API with authentication required
      // Would need API credentials in production
      return [];
    } catch (error) {
      console.error('HackerRank API Error:', error.message);
      return [];
    }
  }
};

// =====================================================
// PROBLEM MANAGEMENT ENDPOINTS
// =====================================================

// @desc    Get all problems with filtering
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res, next) => {
  try {
    const { difficulty, category, topic, source, tags, limit = 10, page = 1 } = req.query;
    
    let filter = { isActive: true };
    
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (source) filter.source = source;
    if (tags) filter.tags = { $in: tags.split(',') };
    
    const skip = (page - 1) * limit;
    
    const problems = await Problem.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort('-createdAt');
    
    const total = await Problem.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: problems.length,
      total,
      pages: Math.ceil(total / limit),
      data: { problems }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Public
export const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('relatedCourse', 'title category level');
    
    if (!problem) {
      return res.status(404).json({
        status: 'error',
        message: 'Problem not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { problem }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get problems recommended after topic completion
// @route   GET /api/problems/recommended/:courseId/:topicIndex
// @access  Private
export const getRecommendedProblems = async (req, res, next) => {
  try {
    const { courseId, topicIndex } = req.params;
    const userId = req.user.id;
    const { limit = 5 } = req.query;
    
    // Get user's difficulty level
    let userDifficulty = await UserDifficultyLevel.findOne({ userId });
    
    if (!userDifficulty) {
      userDifficulty = await UserDifficultyLevel.create({
        userId,
        currentLevel: 'Beginner',
        recommendedDifficultyRange: { min: 'Easy', max: 'Medium' }
      });
    }
    
    // Get course & topic info
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }
    
    const topic = course.syllabus[topicIndex];
    if (!topic) {
      return res.status(404).json({
        status: 'error',
        message: 'Topic not found'
      });
    }
    
    // Find problems matching topic and user difficulty
    const recommendedRange = userDifficulty.recommendedDifficultyRange;
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const minIndex = difficulties.indexOf(recommendedRange.min);
    const maxIndex = difficulties.indexOf(recommendedRange.max);
    const validDifficulties = difficulties.slice(minIndex, maxIndex + 1);
    
    const problems = await Problem.find({
      isActive: true,
      $or: [
        { 'relatedTopic.topicName': topic.title },
        { category: course.category },
        { tags: { $in: [topic.title, course.category] } }
      ],
      difficulty: { $in: validDifficulties }
    })
      .limit(parseInt(limit))
      .sort({ difficulty: 1, successRate: -1 });
    
    res.status(200).json({
      status: 'success',
      userLevel: userDifficulty.currentLevel,
      difficulty: recommendedRange,
      topic: topic.title,
      results: problems.length,
      data: { problems }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record problem attempt/submission
// @route   POST /api/problems/:problemId/attempt
// @access  Private
export const recordProblemAttempt = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    const {
      courseId,
      enrollmentId,
      status,
      verdict,
      submittedCode,
      submittedLanguage,
      runtime,
      memory,
      testCasesPass,
      testCasesTotal,
      timeSpent,
      hintUsed
    } = req.body;
    
    // Find or create problem attempt record
    const lastAttempt = await ProblemAttempt.findOne({
      userId,
      problemId,
      courseId
    }).sort({ attemptNumber: -1 });
    
    const attemptNumber = (lastAttempt?.attemptNumber || 0) + 1;
    
    const attempt = await ProblemAttempt.create({
      userId,
      problemId,
      courseId,
      enrollmentId,
      status: status || 'submitted',
      verdict,
      submittedCode,
      submittedLanguage,
      runtime,
      memory,
      testCasesPass,
      testCasesTotal,
      passPercentage: testCasesTotal ? (testCasesPass / testCasesTotal) * 100 : 0,
      attemptNumber,
      isBest: verdict === 'Accepted',
      codeLength: submittedCode ? submittedCode.length : 0,
      timeSpent,
      hintUsed: hintUsed || false
    });
    
    // Update problem statistics
    const problem = await Problem.findById(problemId);
    if (problem) {
      problem.attempts = (problem.attempts || 0) + 1;
      if (verdict === 'Accepted') {
        problem.successfulSubmissions = (problem.successfulSubmissions || 0) + 1;
      }
      problem.successRate = problem.successfulSubmissions / problem.attempts;
      await problem.save();
    }
    
    // Update user difficulty level
    await updateUserDifficultyLevel(userId, problemId, verdict === 'Accepted');
    
    // Update enrollment if from course
    if (enrollmentId) {
      const enrollment = await Enrollment.findById(enrollmentId);
      if (enrollment && verdict === 'Accepted') {
        enrollment.completedLessons.push({
          lessonId: `problem-${problemId}`,
          completedAt: new Date()
        });
        await enrollment.save();
      }
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Problem attempt recorded',
      data: { attempt }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's problem history
// @route   GET /api/problems/history/:userId
// @access  Private
export const getUserProblemHistory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { courseId, limit = 20, page = 1 } = req.query;
    
    let filter = { userId };
    if (courseId) filter.courseId = courseId;
    
    const skip = (page - 1) * limit;
    
    const attempts = await ProblemAttempt.find(filter)
      .populate('problemId', 'title difficulty source')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ submittedAt: -1 });
    
    const total = await ProblemAttempt.countDocuments(filter);
    
    // Calculate statistics
    const stats = {
      totalAttempts: total,
      accepted: await ProblemAttempt.countDocuments({ ...filter, verdict: 'Accepted' }),
      wrongAnswer: await ProblemAttempt.countDocuments({ ...filter, verdict: 'Wrong Answer' }),
      runtimeError: await ProblemAttempt.countDocuments({ ...filter, verdict: 'Runtime Error' })
    };
    stats.successRate = (stats.accepted / total) * 100 || 0;
    
    res.status(200).json({
      status: 'success',
      stats,
      results: attempts.length,
      total,
      pages: Math.ceil(total / limit),
      data: { attempts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's difficulty level & recommendations
// @route   GET /api/difficulty/:userId
// @access  Private
export const getUserDifficultyLevel = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    let difficulty = await UserDifficultyLevel.findOne({ userId });
    
    if (!difficulty) {
      difficulty = await UserDifficultyLevel.create({
        userId,
        currentLevel: 'Beginner',
        recommendedDifficultyRange: { min: 'Easy', max: 'Medium' }
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { difficulty }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user difficulty level (internal function)
async function updateUserDifficultyLevel(userId, problemId, isSolved) {
  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return;
    
    let userDifficulty = await UserDifficultyLevel.findOne({ userId });
    
    if (!userDifficulty) {
      userDifficulty = new UserDifficultyLevel({ userId });
    }
    
    // Update overall stats
    userDifficulty.totalProblemsAttempted += 1;
    if (isSolved) {
      userDifficulty.totalProblemsSolved += 1;
    }
    
    // Update difficulty-specific stats
    const diffKey = problem.difficulty.toLowerCase() + 'Problems';
    if (userDifficulty[diffKey]) {
      userDifficulty[diffKey].attempted += 1;
      if (isSolved) userDifficulty[diffKey].solved += 1;
      userDifficulty[diffKey].successRate = 
        (userDifficulty[diffKey].solved / userDifficulty[diffKey].attempted) * 100;
    }
    
    // Update overall success rate
    userDifficulty.overallSuccessRate = 
      (userDifficulty.totalProblemsSolved / userDifficulty.totalProblemsAttempted) * 100;
    
    // Update category-specific stats
    const categoryKey = problem.category;
    if (!userDifficulty.byCategory.has(categoryKey)) {
      userDifficulty.byCategory.set(categoryKey, {
        level: 'Beginner',
        easyCompleted: 0,
        mediumCompleted: 0,
        hardCompleted: 0,
        successRate: 0,
        lastUpdated: new Date()
      });
    }
    
    const catStats = userDifficulty.byCategory.get(categoryKey);
    if (isSolved) {
      if (problem.difficulty === 'Easy') catStats.easyCompleted += 1;
      else if (problem.difficulty === 'Medium') catStats.mediumCompleted += 1;
      else if (problem.difficulty === 'Hard') catStats.hardCompleted += 1;
    }
    
    // Auto-adjust difficulty level
    if (userDifficulty.overallSuccessRate > 75) {
      userDifficulty.recommendedDifficultyRange.max = 'Hard';
      userDifficulty.currentLevel = 'Advanced';
    } else if (userDifficulty.overallSuccessRate > 60) {
      userDifficulty.recommendedDifficultyRange.max = 'Medium';
      userDifficulty.currentLevel = 'Intermediate';
    } else {
      userDifficulty.recommendedDifficultyRange.max = 'Easy';
      userDifficulty.currentLevel = 'Beginner';
    }
    
    userDifficulty.updatedAt = new Date();
    await userDifficulty.save();
  } catch (error) {
    console.error('Error updating difficulty level:', error);
  }
}

// @desc    Sync problems from external sources
// @route   POST /api/problems/sync/:source
// @access  Private (Admin only)
export const syncProblemsFromSource = async (req, res, next) => {
  try {
    const { source } = req.params;
    const { category, difficulty } = req.body;
    
    let problems = [];
    let synced = 0;
    
    switch (source) {
      case 'leetcode':
        // Would sync from LeetCode API
        problems = await syncLeetCodeProblems(category, difficulty);
        break;
      case 'geeksforgeeks':
        problems = await syncGFGProblems(category, difficulty);
        break;
      case 'hackerrank':
        problems = await syncHackerRankProblems(category, difficulty);
        break;
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Unknown source'
        });
    }
    
    res.status(200).json({
      status: 'success',
      source,
      synced: problems.length,
      message: `Synced ${problems.length} problems from ${source}`
    });
  } catch (error) {
    next(error);
  }
}

// Helper sync functions
async function syncLeetCodeProblems(category, difficulty) {
  try {
    const existingProblems = await Problem.countDocuments({ source: 'LeetCode' });
    // Implementation for LeetCode sync
    return [];
  } catch (error) {
    console.error('LeetCode Sync Error:', error);
    return [];
  }
}

async function syncGFGProblems(category, difficulty) {
  try {
    // Implementation for GFG sync
    return [];
  } catch (error) {
    console.error('GFG Sync Error:', error);
    return [];
  }
}

async function syncHackerRankProblems(category, difficulty) {
  try {
    // Implementation for HackerRank sync
    return [];
  } catch (error) {
    console.error('HackerRank Sync Error:', error);
    return [];
  }
}

// @desc    Get problems by topic for course
// @route   GET /api/courses/:courseId/problems/:topicIndex
// @access  Public
export const getCourseTopicProblems = async (req, res, next) => {
  try {
    const { courseId, topicIndex } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course || !course.syllabus[topicIndex]) {
      return res.status(404).json({
        status: 'error',
        message: 'Course or topic not found'
      });
    }
    
    const topic = course.syllabus[topicIndex];
    
    const problems = await Problem.find({
      isActive: true,
      $or: [
        { 'relatedTopic.topicName': topic.title },
        { category: course.category },
        { tags: topic.title }
      ]
    })
      .sort({ difficulty: 1, successRate: -1 });
    
    res.status(200).json({
      status: 'success',
      course: course.title,
      topic: topic.title,
      results: problems.length,
      data: { problems }
    });
  } catch (error) {
    next(error);
  }
};
