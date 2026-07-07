import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import User from '../models/User.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errorHandler.js';
import logger from '../config/logger.js';

const formatEvent = (event, organizer = null) => {
  const e = event.toObject ? event.toObject() : event;
  const start = e.startDate ? new Date(e.startDate) : null;

  return {
    ...e,
    id: e._id,
    date: e.displayDate || (start ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
    time: e.displayTime || (start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''),
    venue: e.venue || e.location || 'TBA',
    location: e.campusLocation || 'In Campus',
    attendees: e.registeredCount || 0,
    maxAttendees: e.capacity || 0,
    organizer: organizer ? { name: organizer.name, collegeName: organizer.collegeName } : null,
    isTour: ['fun-tours', 'industrial-tours'].includes(e.category),
  };
};

export const getEvents = async (req, res, next) => {
  try {
    const { category, location, mode, type, status, college, page = 1, limit = 50 } = req.query;

    const query = { isActive: true, isDeleted: false, isCancelled: false };

    if (category) query.category = category;
    if (location) query.campusLocation = location;
    if (mode) query.mode = mode;
    if (type) query.type = type;
    if (college) query.collegeName = new RegExp(college, 'i');

    const now = new Date();
    if (status === 'upcoming') query.startDate = { $gte: now };
    else if (status === 'past') query.startDate = { $lt: now };

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query).sort('startDate').skip(skip).limit(parseInt(limit)).populate('organizerId', 'name collegeName avatar'),
      Event.countDocuments(query)
    ]);

    const formatted = events.map(e => formatEvent(e, e.organizerId));

    return paginatedResponse(res, 200, 'Events fetched successfully', formatted, {
      page: parseInt(page),
      limit: parseInt(limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name collegeName avatar email');

    if (!event || event.isDeleted) {
      throw new NotFoundError('Event not found');
    }

    let isRegistered = false;
    if (req.userId) {
      const reg = await EventRegistration.findOne({
        userId: req.userId,
        eventId: event._id,
        status: 'registered'
      });
      isRegistered = !!reg;
    }

    return successResponse(res, 200, 'Event detail fetched', {
      event: { ...formatEvent(event, event.organizerId), isRegistered }
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const organizer = await User.findById(req.userId);

    const event = await Event.create({
      ...req.body,
      organizerId: req.userId,
      createdBy: req.userId,
      collegeName: req.body.collegeName || organizer?.collegeName || null,
    });

    logger.info(`New event created by ${organizer?.email}: ${event.title}`);
    return successResponse(res, 201, 'Event created successfully', { event: formatEvent(event, organizer) });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError('Event not found');

    if (req.user.role !== 'admin' && event.organizerId.toString() !== req.userId.toString()) {
      throw new ValidationError('You can only edit your own events');
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedBy: req.userId },
      { new: true, runValidators: true }
    ).populate('organizerId', 'name collegeName');

    return successResponse(res, 200, 'Event updated successfully', { event: formatEvent(updatedEvent, updatedEvent.organizerId) });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isActive) throw new NotFoundError('Event not found or inactive');

    const currentRegCount = await EventRegistration.countDocuments({
      eventId: req.params.id,
      status: 'registered'
    });

    if (event.capacity && currentRegCount >= event.capacity) {
      throw new ValidationError('Event is at maximum capacity');
    }

    const existing = await EventRegistration.findOne({
      userId: req.userId,
      eventId: req.params.id
    });

    if (existing) {
      if (existing.status === 'registered') {
        throw new ConflictError('You are already registered for this event');
      }
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

    event.registeredCount = currentRegCount + 1;
    await event.save();

    return successResponse(res, 200, 'Registered for event successfully', {
      event: formatEvent(event)
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({
      userId: req.userId,
      status: 'registered'
    })
      .populate('eventId')
      .sort('-registeredAt');

    const events = registrations
      .filter(r => r.eventId)
      .map(r => formatEvent(r.eventId));

    return successResponse(res, 200, 'My registrations fetched', { registrations: events });
  } catch (error) {
    next(error);
  }
};
