import Course from '../models/Course.js';
import AITool from '../models/AITool.js';
import Problem from '../models/Problem.js';
import LiveApplication from '../models/LiveApplication.js';
import AmbassadorApplication from '../models/AmbassadorApplication.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';
import { successResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';

import MentorApplication from '../models/MentorApplication.js';

// ============================================================
// SYSTEM TELEMETRY / OVERVIEW
// ============================================================

export const getSystemStats = async (req, res, next) => {
  try {
    const [courses, users, problems, jobs, events, liveApps, ambApps, mentorApps] = await Promise.all([
      Course.countDocuments({ isDeleted: false }),
      User.countDocuments({ isDeleted: false }),
      Problem.countDocuments({ isDeleted: false }),
      Job.countDocuments({ isDeleted: false }),
      Event.countDocuments({ isDeleted: false }),
      LiveApplication.countDocuments({ status: 'pending' }),
      AmbassadorApplication.countDocuments({ status: 'pending' }),
      MentorApplication.countDocuments({ status: 'pending' })
    ]);

    return successResponse(res, 200, 'System statistics fetched', {
      courses,
      users,
      problems,
      jobs,
      events,
      pendingLiveApplications: liveApps,
      pendingAmbassadorApplications: ambApps,
      pendingMentorApplications: mentorApps
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// VERIFICATION APPLICATIONS
// ============================================================

export const listPendingApplications = async (req, res, next) => {
  try {
    const liveApplications = await LiveApplication.find({ status: 'pending' }).populate('userId', 'name email avatar');
    const ambassadorApplications = await AmbassadorApplication.find({ status: 'pending' }).populate('userId', 'name email avatar');
    const mentorApplications = await MentorApplication.find({ status: 'pending' }).populate('user', 'name email avatar');

    return successResponse(res, 200, 'Applications listed', {
      liveApplications,
      ambassadorApplications,
      mentorApplications
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// COURSES & LABS CRUD MANAGEMENT
// ============================================================

export const createCourseAdmin = async (req, res, next) => {
  try {
    const { title, instructor, category, level, duration, description, resources } = req.body;
    
    const newCourse = await Course.create({
      title,
      instructor,
      category,
      level,
      duration,
      description,
      resources,
      ownerId: req.userId,
      isPublished: true,
      isActive: true
    });

    return successResponse(res, 201, 'Course created successfully', { course: newCourse });
  } catch (error) {
    next(error);
  }
};

export const updateCourseAdmin = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!course) throw new NotFoundError('Course not found');
    return successResponse(res, 200, 'Course updated successfully', { course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseAdmin = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true, isActive: false } }, { new: true });
    if (!course) throw new NotFoundError('Course not found');
    return successResponse(res, 200, 'Course deleted successfully', { course });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// AI TOOLS CRUD MANAGEMENT
// ============================================================

export const createAIToolAdmin = async (req, res, next) => {
  try {
    const tool = await AITool.create(req.body);
    return successResponse(res, 201, 'AI Tool created successfully', { tool });
  } catch (error) {
    next(error);
  }
};

export const updateAIToolAdmin = async (req, res, next) => {
  try {
    const tool = await AITool.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!tool) throw new NotFoundError('AI Tool not found');
    return successResponse(res, 200, 'AI Tool updated successfully', { tool });
  } catch (error) {
    next(error);
  }
};

export const deleteAIToolAdmin = async (req, res, next) => {
  try {
    const tool = await AITool.findByIdAndDelete(req.params.id);
    if (!tool) throw new NotFoundError('AI Tool not found');
    return successResponse(res, 200, 'AI Tool deleted successfully', { tool });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DSA PROBLEMS CRUD MANAGEMENT
// ============================================================

export const createProblemAdmin = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    return successResponse(res, 201, 'DSA Problem created successfully', { problem });
  } catch (error) {
    next(error);
  }
};

export const updateProblemAdmin = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!problem) throw new NotFoundError('DSA Problem not found');
    return successResponse(res, 200, 'DSA Problem updated successfully', { problem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblemAdmin = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } }, { new: true });
    if (!problem) throw new NotFoundError('DSA Problem not found');
    return successResponse(res, 200, 'DSA Problem deleted successfully', { problem });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// JOBS BOARD CRUD MANAGEMENT
// ============================================================

export const createJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.userId });
    return successResponse(res, 201, 'Job vacancy created successfully', { job });
  } catch (error) {
    next(error);
  }
};

export const deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } }, { new: true });
    if (!job) throw new NotFoundError('Job post not found');
    return successResponse(res, 200, 'Job post deleted successfully', { job });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CLUBS & EVENTS CREATION
// ============================================================

import Club from '../models/Club.js';

export const createClubAdmin = async (req, res, next) => {
  try {
    const { name, description, category, type } = req.body;
    const user = await User.findById(req.userId);

    const club = await Club.create({
      name,
      description,
      category,
      type,
      adminId: user._id.toString(),
      adminName: user.name,
      creatorId: user._id,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      members: [{
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar || '',
        role: 'admin',
        isOnline: true
      }]
    });

    return successResponse(res, 201, 'Dynamic community club launched', { club });
  } catch (error) {
    next(error);
  }
};

export const createEventAdmin = async (req, res, next) => {
  try {
    const { title, description, category, date, time, location, mode } = req.body;
    
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      mode: mode || 'online',
      ownerId: req.userId,
      isPublished: true,
      isActive: true
    });

    return successResponse(res, 201, 'Dynamic global event published', { event });
  } catch (error) {
    next(error);
  }
};

export const listEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find({ isDeleted: { $ne: true } }).populate('ownerId', 'name email');
    return successResponse(res, 200, 'Events listed successfully', { events });
  } catch (error) {
    next(error);
  }
};

export const deleteEventAdmin = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } }, { new: true });
    if (!event) throw new NotFoundError('Event not found');
    return successResponse(res, 200, 'Event removed successfully', { event });
  } catch (error) {
    next(error);
  }
};
