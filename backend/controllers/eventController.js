import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, ConflictError, AuthorizationError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

/**
 * @desc    Get all events with filtering and pagination
 * @route   GET /api/v1/events
 * @access  Public
 */
export const getEvents = async (req, res, next) => {
  try {
    const { category, mode, type, status, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true, isDeleted: false };
    
    if (category) query.category = category;
    if (mode) query.mode = mode;
    if (type) query.type = type;
    
    // Status filter (upcoming/past)
    const now = new Date();
    if (status === 'upcoming') query.startDate = { $gte: now };
    else if (status === 'past') query.startDate = { $lt: now };

    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort('startDate')
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(query)
    ]);

    return paginatedResponse(res, 200, 'Events fetched successfully', events, {
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event detail
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event || event.isDeleted) {
      throw new NotFoundError('Event not found');
    }

    return successResponse(res, 200, 'Event detail fetched', { event });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/v1/events
 * @access  Private (Admin/Moderator)
 */
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.userId
    });

    logger.info(`New event created: ${event.title}`);
    return successResponse(res, 201, 'Event created successfully', { event });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event
 * @route   PATCH /api/v1/events/:id
 * @access  Private (Admin/Moderator)
 */
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedBy: req.userId },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Event updated successfully', { event: updatedEvent });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register for an event
 * @route   POST /api/v1/events/:id/register
 * @access  Private
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isActive) throw new NotFoundError('Event not found or inactive');

    // Check capacity
    const currentRegCount = await EventRegistration.countDocuments({ 
      eventId: req.params.id, 
      status: 'registered' 
    });

    if (event.capacity && currentRegCount >= event.capacity) {
      throw new ValidationError('Event is at maximum capacity');
    }

    // Check existing registration
    const existing = await EventRegistration.findOne({
      userId: req.userId,
      eventId: req.params.id
    });

    if (existing) {
      if (existing.status === 'registered') {
        throw new ConflictError('You are already registered for this event');
      }
      // Re-register if previously cancelled
      existing.status = 'registered';
      existing.registeredAt = new Date();
      await existing.save();
    } else {
      await EventRegistration.create({
        userId: req.userId,
        eventId: req.params.id,
        status: 'registered'
      });
    }

    // Update event attendee count
    event.registeredCount = currentRegCount + 1;
    await event.save();

    return successResponse(res, 200, 'Registered for event successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my registered events
 * @route   GET /api/v1/events/my-registrations
 * @access  Private
 */
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ 
      userId: req.userId, 
      status: 'registered' 
    })
    .populate('eventId')
    .sort('-registeredAt');

    return successResponse(res, 200, 'My registrations fetched', { registrations });
  } catch (error) {
    next(error);
  }
};
