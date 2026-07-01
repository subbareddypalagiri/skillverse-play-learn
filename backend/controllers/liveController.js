import LiveRoom from '../models/LiveRoom.js';
import LiveApplication from '../models/LiveApplication.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errorHandler.js';

/**
 * @desc    Get all active live rooms
 * @route   GET /api/v1/live/rooms
 * @access  Public
 */
export const getLiveRooms = async (req, res, next) => {
  try {
    const rooms = await LiveRoom.find({ status: 'live' })
      .populate('hostId', 'name avatar role')
      .sort('-startedAt');

    return successResponse(res, 200, 'Active live rooms fetched', { rooms });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get details of a single live room
 * @route   GET /api/v1/live/rooms/:id
 * @access  Public
 */
export const getLiveRoom = async (req, res, next) => {
  try {
    const room = await LiveRoom.findById(req.params.id)
      .populate('hostId', 'name avatar role bio');

    if (!room) {
      throw new NotFoundError('Live room not found');
    }

    return successResponse(res, 200, 'Live room details fetched', { room });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/Go Live (Requires approved expert role)
 * @route   POST /api/v1/live/rooms
 * @access  Private (Approved Experts)
 */
export const createLiveRoom = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    // Check if user is authorized to host live rooms
    if (user.role !== 'admin' && user.role !== 'instructor' && !user.canHostLive) {
      throw new AuthorizationError('Not authorized to host live rooms. Please submit a Live Expert application.');
    }

    const { title, topic, category, streamUrl } = req.body;

    const newRoom = await LiveRoom.create({
      title,
      topic,
      category,
      hostId: req.userId,
      status: 'live',
      startedAt: new Date(),
      viewerCount: Math.floor(Math.random() * 20) + 5, // Simulated initial views
      streamUrl: streamUrl || undefined
    });

    return successResponse(res, 201, 'Live stream started successfully', { room: newRoom });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    End a live session
 * @route   POST /api/v1/live/rooms/:id/end
 * @access  Private (Owner/Admin)
 */
export const endLiveRoom = async (req, res, next) => {
  try {
    const room = await LiveRoom.findById(req.params.id);

    if (!room) {
      throw new NotFoundError('Live room not found');
    }

    if (room.hostId.toString() !== req.userId && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to end this stream');
    }

    room.status = 'ended';
    room.endedAt = new Date();
    await room.save();

    return successResponse(res, 200, 'Live stream ended successfully', { room });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit application to host live rooms
 * @route   POST /api/v1/live/apply
 * @access  Private
 */
export const submitLiveApplication = async (req, res, next) => {
  try {
    const existing = await LiveApplication.findOne({ userId: req.userId, status: 'pending' });
    if (existing) {
      throw new ValidationError('You already have a pending application under review.');
    }

    const { skills, portfolioUrl, linkedinUrl, certificateIds, pitch } = req.body;

    const application = await LiveApplication.create({
      userId: req.userId,
      skills,
      portfolioUrl,
      linkedinUrl,
      certificateIds,
      pitch
    });

    return successResponse(res, 201, 'Application submitted successfully', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's live applications status
 * @route   GET /api/v1/live/my-application
 * @access  Private
 */
export const getMyApplication = async (req, res, next) => {
  try {
    const application = await LiveApplication.findOne({ userId: req.userId }).sort('-createdAt');
    return successResponse(res, 200, 'Application status fetched', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve/Reject application (Admin only)
 * @route   PUT /api/v1/live/applications/:id/review
 * @access  Private (Admin Only)
 */
export const reviewLiveApplication = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new AuthorizationError('Admins only');
    }

    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      throw new ValidationError('Status must be approved or rejected');
    }

    const app = await LiveApplication.findById(req.params.id);
    if (!app) {
      throw new NotFoundError('Application not found');
    }

    app.status = status;
    app.reviewedBy = req.userId;
    app.reviewedAt = new Date();
    if (status === 'rejected') {
      app.rejectionReason = rejectionReason;
    }
    await app.save();

    // If approved, update target user schema flag
    if (status === 'approved') {
      await User.findByIdAndUpdate(app.userId, {
        $set: { canHostLive: true }
      });
    }

    return successResponse(res, 200, `Application successfully ${status}`, { application: app });
  } catch (error) {
    next(error);
  }
};
