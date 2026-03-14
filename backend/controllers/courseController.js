import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import { 
  successResponse, 
  paginatedResponse,
  errorResponse 
} from '../utils/responseHandler.js';
import { 
  NotFoundError, 
  AuthorizationError, 
  ValidationError,
  ConflictError
} from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Get all courses with filtering and pagination
 * @route   GET /api/v1/courses
 * @access  Public
 */
export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true, isPublished: true, isDeleted: false };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('ownerId', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Course.countDocuments(query)
    ]);

    return paginatedResponse(res, 200, 'Courses fetched successfully', courses, {
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single course details
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('ownerId', 'name avatar bio socialLinks')
      .populate('linkedProblems', 'title difficulty category');

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return successResponse(res, 200, 'Course details fetched', { course });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/v1/courses
 * @access  Private (Instructor/Admin)
 */
export const createCourse = async (req, res, next) => {
  try {
    const courseData = {
      ...req.body,
      ownerId: req.userId,
      createdBy: req.userId
    };

    const course = await Course.create(courseData);
    
    logger.info(`New course created: ${course.title} by ${req.userId}`);

    return successResponse(res, 201, 'Course created successfully', { course });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course details
 * @route   PATCH /api/v1/courses/:id
 * @access  Private (Owner/Admin)
 */
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Authorization check
    if (course.ownerId.toString() !== req.userId && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to update this course');
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedBy: req.userId },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Course updated successfully', { course: updatedCourse });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete a course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private (Owner/Admin)
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.ownerId.toString() !== req.userId && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to delete this course');
    }

    course.isDeleted = true;
    course.deletedAt = new Date();
    course.deletedBy = req.userId;
    await course.save();

    logger.info(`Course soft-deleted: ${course.title} (${req.params.id})`);

    return successResponse(res, 200, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll in a course
 * @route   POST /api/v1/courses/:id/enroll
 * @access  Private
 */
export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course || !course.isActive || !course.isPublished) {
      throw new NotFoundError('Course not found or is unavailable');
    }

    // Check existing enrollment
    const existing = await Enrollment.findOne({
      userId: req.userId,
      courseId: req.params.id
    });

    if (existing) {
      throw new ConflictError('You are already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: req.userId,
      courseId: req.params.id,
      createdBy: req.userId
    });

    // Update denormalized stats on Course
    course.enrollmentCount += 1;
    await course.save();

    // Update denormalized stats on User
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.totalCoursesEnrolled': 1 }
    });

    logger.info(`User ${req.userId} enrolled in course ${course.title}`);

    return successResponse(res, 201, 'Enrolled successfully', { enrollment });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's enrolled courses
 * @route   GET /api/v1/courses/my-enrollments
 * @access  Private
 */
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.userId })
      .populate({
        path: 'courseId',
        select: 'title description thumbnail ownerId level category',
        populate: { path: 'ownerId', select: 'name' }
      })
      .sort('-enrolledAt');

    return successResponse(res, 200, 'Enrollments fetched successfully', { enrollments });
  } catch (error) {
    next(error);
  }
};
