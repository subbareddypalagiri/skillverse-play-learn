import Company from '../models/Company.js';
import User from '../models/User.js';
import { successResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Register a company profile
 * @route   POST /api/v1/companies
 * @access  Private (Company Admin)
 */
export const registerCompany = async (req, res, next) => {
  try {
    const { name, description, industry, website, location } = req.body;

    // Check if user already owns a company
    const existing = await Company.findOne({ adminId: req.userId });
    if (existing) {
      throw new ValidationError('You already have a registered company profile');
    }

    const company = await Company.create({
      name,
      description,
      industry,
      website,
      location,
      adminId: req.userId
    });

    // Update user role to company_admin and link company
    await User.findByIdAndUpdate(req.userId, {
      role: 'company_admin',
      company: company._id
    });

    logger.info(`New company registered: ${name} by ${req.userId}`);

    return successResponse(res, 201, 'Company registered successfully', { company });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all companies with filtering
 * @route   GET /api/v1/companies
 * @access  Public
 */
export const getCompanies = async (req, res, next) => {
  try {
    const { industry, city, verified } = req.query;
    const query = { isDeleted: false };

    if (industry) query.industry = industry;
    if (city) query['location.city'] = city;
    if (verified === 'true') query.isVerified = true;

    const companies = await Company.find(query).sort('-createdAt');

    return successResponse(res, 200, 'Companies fetched', { companies });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get company detail
 * @route   GET /api/v1/companies/:id
 * @access  Public
 */
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) throw new NotFoundError('Company not found');

    return successResponse(res, 200, 'Company detail fetched', { company });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company profile
 * @route   PATCH /api/v1/companies/:id
 * @access  Private (Owner/Admin)
 */
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) throw new NotFoundError('Company not found');

    // Check ownership
    if (company.adminId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to update this company');
    }

    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Company updated successfully', { company: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get company jobs
 * @route   GET /api/v1/companies/:id/jobs
 * @access  Public
 */
export const getCompanyJobs = async (req, res, next) => {
  try {
    const Job = (await import('../models/Job.js')).default;
    const jobs = await Job.find({ companyId: req.params.id, isActive: true });

    return successResponse(res, 200, 'Company jobs fetched', { jobs });
  } catch (error) {
    next(error);
  }
};
