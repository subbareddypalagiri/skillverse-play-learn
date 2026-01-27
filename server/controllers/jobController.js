import Job from '../models/Job.js';
import axios from 'axios';

// Fetch jobs from JSearch API and cache in database
export const fetchAndCacheJobs = async (req, res) => {
  try {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';

    if (!RAPIDAPI_KEY) {
      return res.status(400).json({
        success: false,
        message: 'RapidAPI key not configured. Please set RAPIDAPI_KEY in .env',
        data: []
      });
    }

    const { query = 'internship', location = '', pageNum = 1 } = req.query;

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
    const jobs = response.data.data || [];

    // Transform and save jobs to database
    const savedJobs = [];
    
    for (const job of jobs) {
      try {
        // Check if job already exists
        const existingJob = await Job.findOne({ jobId: job.job_id });

        const jobData = {
          jobId: job.job_id,
          title: job.job_title || 'Job Position',
          company: job.employer_name || 'Company',
          location: job.job_city && job.job_country 
            ? `${job.job_city}, ${job.job_country}` 
            : job.job_country || 'Remote',
          city: job.job_city || '',
          country: job.job_country || '',
          type: job.job_employment_type || 'Internship',
          duration: job.job_employment_type === 'INTERN' ? '3-6 months' : 'Not specified',
          stipend: job.job_salary || (job.job_min_salary ? `${job.job_min_salary} - ${job.job_max_salary}` : 'Not disclosed'),
          minSalary: job.job_min_salary || null,
          maxSalary: job.job_max_salary || null,
          currency: job.job_salary_currency || 'USD',
          description: job.job_description || '',
          skills: job.job_required_skills || [],
          benefits: job.job_highlights?.Benefits || [],
          qualifications: job.job_highlights?.Qualifications || [],
          applyLink: job.job_apply_link || job.job_google_link || '#',
          postedDate: job.job_posted_at_datetime_utc 
            ? new Date(job.job_posted_at_datetime_utc * 1000) 
            : new Date(),
          experience: job.job_experience_in_place_of_education || 'Not specified',
          remote: job.job_is_remote || false,
          apiSource: 'jsearch',
          lastUpdated: new Date(),
          isActive: true
        };

        let savedJob;
        if (existingJob) {
          // Update existing job
          savedJob = await Job.findByIdAndUpdate(existingJob._id, jobData, { new: true });
        } else {
          // Create new job
          savedJob = await Job.create(jobData);
        }
        
        savedJobs.push(savedJob);
      } catch (jobError) {
        console.error(`Error saving job ${job.job_id}:`, jobError.message);
        // Continue with next job
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully cached ${savedJobs.length} jobs from JSearch API`,
      count: savedJobs.length,
      data: savedJobs
    });
  } catch (error) {
    console.error('Error fetching from JSearch:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching jobs from JSearch API',
      data: []
    });
  }
};

// Get all jobs from database (with caching)
export const getAllJobs = async (req, res) => {
  try {
    const {
      type = 'all',
      location = 'all',
      search = '',
      page = 1,
      limit = 12,
      sort = '-postedDate'
    } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (type !== 'all') {
      filter.type = type;
    }

    if (location !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Fetch jobs
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      data: []
    });
  }
};

// Get single job details
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job details'
    });
  }
};

// Search jobs with advanced filters
export const searchJobs = async (req, res) => {
  try {
    const {
      title = '',
      company = '',
      location = '',
      type = '',
      minSalary = 0,
      maxSalary = 999999,
      skills = [],
      remote = false
    } = req.body;

    const filter = { isActive: true };

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (skills && skills.length > 0) {
      filter.skills = { $in: skills };
    }

    if (remote) {
      filter.remote = true;
    }

    if (minSalary || maxSalary) {
      filter.$and = [];
      if (minSalary) {
        filter.$and.push({ minSalary: { $gte: minSalary } });
      }
      if (maxSalary) {
        filter.$and.push({ maxSalary: { $lte: maxSalary } });
      }
    }

    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: `Found ${jobs.length} matching jobs`,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      data: []
    });
  }
};

// Get job statistics
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          totalJobs: [{ $count: 'count' }],
          byType: [
            { $group: { _id: '$type', count: { $sum: 1 } } }
          ],
          byLocation: [
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          remoteCount: [
            { $match: { remote: true } },
            { $count: 'count' }
          ],
          avgSalary: [
            { $match: { minSalary: { $exists: true } } },
            { $group: { _id: null, avgSalary: { $avg: '$minSalary' } } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      data: {}
    });
  }
};

// Clear old jobs (keep only recent 30 days)
export const clearOldJobs = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await Job.deleteMany({
      lastUpdated: { $lt: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old jobs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing old jobs'
    });
  }
};

// Add manual job (for admin/internal use)
export const addManualJob = async (req, res) => {
  try {
    const { title, company, location, type, stipend, skills, applyLink, description } = req.body;

    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, and location are required'
      });
    }

    const jobData = {
      jobId: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      company,
      location,
      type: type || 'Internship',
      stipend: stipend || 'Not disclosed',
      skills: skills || [],
      applyLink: applyLink || '#',
      description: description || '',
      apiSource: 'manual',
      lastUpdated: new Date(),
      isActive: true
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job added successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding job',
      error: error.message
    });
  }
};
