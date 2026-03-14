import Job from '../models/Job.js';
import axios from 'axios';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, InternalServerError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Fetch and Cache Jobs from JSearch API
 * @route   POST /api/v1/jobs/sync
 * @access  Private (Admin)
 */
export const syncJobs = async (req, res, next) => {
  try {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';

    if (!RAPIDAPI_KEY) {
      throw new ValidationError('RapidAPI key not configured');
    }

    const { query = 'internship', location = '', pageNum = 1 } = req.query;

    logger.info(`[JobsAPI] POST /jobs/sync started`, {
      query, location, pageNum,
      userId: req.userId
    });

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: location ? `${query} in ${location}` : query,
        page: pageNum,
        num_pages: 1,
        date_posted: 'month'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const apiJobs = response.data.data || [];
    const savedJobs = [];

    logger.info(`[JobsAPI] JSearch API returned ${apiJobs.length} jobs for query="${query}"`);

    for (const job of apiJobs) {
      try {
        const jobData = {
          jobId: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : 'Remote',
          city: job.job_city,
          country: job.job_country,
          remote: job.job_is_remote || false,
          type: job.job_employment_type || 'Full-time',
          description: job.job_description,
          requirements: job.job_highlights?.Qualifications || [],
          benefits: job.job_highlights?.Benefits || [],
          applyLink: job.job_apply_link,
          minSalary: job.job_min_salary,
          maxSalary: job.job_max_salary,
          currency: job.job_salary_currency || 'USD',
          postedDate: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
          apiSource: 'jsearch',
          skills: job.job_required_skills || [],
          isActive: true,
          createdBy: req.userId
        };

        const updatedJob = await Job.findOneAndUpdate(
          { jobId: job.job_id },
          { $set: jobData },
          { upsert: true, new: true }
        );
        savedJobs.push(updatedJob);
      } catch (err) {
        logger.error(`Failed to sync job ${job.job_id}: ${err.message}`);
      }
    }

    return successResponse(res, 200, `Synced ${savedJobs.length} jobs`, { count: savedJobs.length });
  } catch (error) {
    logger.error(`[JobsAPI] POST /jobs/sync FAILED`, {
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * @desc    Get all jobs with filtering
 * @route   GET /api/v1/jobs
 * @access  Public
 */
export const getJobs = async (req, res, next) => {
  try {
    const { type, location, remote, search, page = 1, limit = 10 } = req.query;
    
    logger.info(`[JobsAPI] GET /jobs`, {
      query: { type, location, remote, search, page, limit },
      ip: req.ip
    });

    const query = { isActive: true, isDeleted: false };

    if (type) query.type = type;
    if (remote === 'true') query['location.isRemote'] = true;
    if (location) query['location.formattedAddress'] = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort('-postedAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query)
    ]);

    logger.info(`[JobsAPI] GET /jobs response: ${total} total, returning ${jobs.length} items (page ${page})`);

    return paginatedResponse(res, 200, 'Jobs fetched successfully', jobs, {
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    logger.error(`[JobsAPI] GET /jobs FAILED`, {
      error: error.message,
      stack: error.stack,
      query: req.query
    });
    next(error);
  }
};

/**
 * @desc    Get job record by ID
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`[JobsAPI] GET /jobs/${id}`);

    const job = await Job.findById(id);
    if (!job || job.isDeleted) {
      logger.warn(`[JobsAPI] Job not found: ${id}`);
      throw new NotFoundError('Job not found');
    }

    logger.info(`[JobsAPI] Found job: "${job.title}" at ${job.company}`);
    return successResponse(res, 200, 'Job details fetched', { job });
  } catch (error) {
    logger.error(`[JobsAPI] GET /jobs/${req.params.id} FAILED`, { error: error.message });
    next(error);
  }
};

/**
 * @desc    Get job stats
 * @route   GET /api/v1/jobs/stats
 * @access  Public
 */
export const getJobStats = async (req, res, next) => {
  try {
    logger.info(`[JobsAPI] GET /jobs/stats`);

    const stats = await Job.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      {
        $facet: {
          types: [{ $group: { _id: '$type', count: { $sum: 1 } } }],
          remote: [{ $match: { 'location.isRemote': true } }, { $count: 'count' }],
          total: [{ $count: 'count' }]
        }
      }
    ]);

    return successResponse(res, 200, 'Job statistics fetched', { stats: stats[0] });
  } catch (error) {
    logger.error(`[JobsAPI] GET /jobs/stats FAILED`, { error: error.message });
    next(error);
  }
};
