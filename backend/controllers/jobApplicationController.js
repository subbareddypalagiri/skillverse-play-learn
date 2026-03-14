import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import { successResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Apply for a job
 * @route   POST /api/v1/jobs/:id/apply
 * @access  Private (Student)
 */
export const applyForJob = async (req, res, next) => {
  try {
    const { coverLetter, resume } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      throw new NotFoundError('Job not found or inactive');
    }

    // Check if user already applied
    const existing = await JobApplication.findOne({ 
      userId: req.userId, 
      jobId: jobId 
    }).setOptions({ includeDeleted: true });

    if (existing) {
      if (existing.isDeleted) {
        // Restore if previously deleted
        existing.isDeleted = false;
        existing.status = 'applied';
        existing.appliedAt = new Date();
        existing.coverLetter = coverLetter || existing.coverLetter;
        existing.resume = resume || existing.resume;
        await existing.save();
        return successResponse(res, 200, 'Re-applied for job successfully');
      }
      throw new ConflictError('You have already applied for this job');
    }

    const application = await JobApplication.create({
      userId: req.userId,
      jobId,
      coverLetter,
      resume
    });

    // Update job applicant count
    job.applicantCount += 1;
    await job.save();

    logger.info(`User ${req.userId} applied for job ${jobId}`);

    return successResponse(res, 201, 'Application submitted successfully', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my applications
 * @route   GET /api/v1/jobs/my-applications
 * @access  Private
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ userId: req.userId })
      .populate({
        path: 'jobId',
        select: 'title company location type stipend minSalary maxSalary applyLink'
      })
      .sort('-appliedAt');

    return successResponse(res, 200, 'My applications fetched', { applications });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applications for a job (Recruiter/Admin)
 * @route   GET /api/v1/jobs/:id/applications
 * @access  Private (Company Admin/Admin)
 */
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) throw new NotFoundError('Job not found');

    // Check if user is the company admin or admin
    if (job.createdBy?.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to view applicants for this job');
    }

    const applications = await JobApplication.find({ jobId: req.params.id })
      .populate({
        path: 'userId',
        select: 'name email avatar skills stats'
      })
      .sort('-appliedAt');

    return successResponse(res, 200, 'Job applications fetched', { applications });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status (Recruiter/Admin)
 * @route   PATCH /api/v1/jobs/applications/:id
 * @access  Private (Company Admin/Admin)
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw new ValidationError('Status is required');

    const application = await JobApplication.findById(req.params.id).populate('jobId');
    if (!application) throw new NotFoundError('Application not found');

    // Check if recruiter owns the job
    const job = application.jobId;
    if (job.createdBy?.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to update application status');
    }

    application.status = status;
    application.responseAt = new Date();
    await application.save();

    // Trigger notification (TODO)
    logger.info(`Application ${application._id} status updated to ${status}`);

    return successResponse(res, 200, 'Status updated successfully', { application });
  } catch (error) {
    next(error);
  }
};
