import AmbassadorApplication from '../models/AmbassadorApplication.js';
import User from '../models/User.js';
import { successResponse } from '../utils/responseHandler.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errorHandler.js';

/**
 * @desc    Submit application to become a Campus Ambassador
 * @route   POST /api/v1/events/ambassador/apply
 * @access  Private
 */
export const submitAmbassadorApplication = async (req, res, next) => {
  try {
    const existing = await AmbassadorApplication.findOne({ userId: req.userId, status: 'pending' });
    if (existing) {
      throw new ValidationError('You already have a pending application under review.');
    }

    const { collegeName, skills, plannedEventsDesc, studentIdCardUrl } = req.body;

    const application = await AmbassadorApplication.create({
      userId: req.userId,
      collegeName,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      plannedEventsDesc,
      studentIdCardUrl
    });

    return successResponse(res, 201, 'Campus Ambassador application submitted successfully', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's ambassador application details
 * @route   GET /api/v1/events/ambassador/my-application
 * @access  Private
 */
export const getMyAmbassadorApplication = async (req, res, next) => {
  try {
    const application = await AmbassadorApplication.findOne({ userId: req.userId }).sort('-createdAt');
    return successResponse(res, 200, 'Ambassador application status retrieved', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve/Reject Ambassador application (Admin only)
 * @route   PUT /api/v1/events/ambassador/applications/:id/review
 * @access  Private (Admin Only)
 */
export const reviewAmbassadorApplication = async (req, res, next) => {
  try {
    // Basic auth check
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      throw new AuthorizationError('Only admins can review ambassador applications');
    }

    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      throw new ValidationError('Status must be approved or rejected');
    }

    const app = await AmbassadorApplication.findById(req.params.id);
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

    // If approved, update target user's role to 'campus_ambassador'
    if (status === 'approved') {
      await User.findByIdAndUpdate(app.userId, {
        $set: { 
          role: 'campus_ambassador',
          collegeName: app.collegeName 
        }
      });
    }

    return successResponse(res, 200, `Ambassador application successfully ${status}`, { application: app });
  } catch (error) {
    next(error);
  }
};
