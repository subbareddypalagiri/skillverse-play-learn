import Event from '../models/Event.js';
import User from '../models/User.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, location, mode, type } = req.query;
    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = location;
    }

    // Filter by mode
    if (mode) {
      query.mode = mode;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const events = await Event.find(query)
      .populate('registeredUsers', 'name email avatar')
      .sort('date');

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name email avatar');

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if event is full
    if (event.attendees >= event.maxAttendees) {
      return res.status(400).json({
        status: 'error',
        message: 'Event is full'
      });
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Already registered for this event'
      });
    }

    // Register user
    event.registeredUsers.push(req.user.id);
    event.attendees += 1;
    await event.save();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { registeredEvents: req.params.id }
    });

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check if registered
    if (!event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Not registered for this event'
      });
    }

    // Unregister user
    event.registeredUsers = event.registeredUsers.filter(
      userId => userId.toString() !== req.user.id
    );
    event.attendees -= 1;
    await event.save();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { registeredEvents: req.params.id }
    });

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered events
// @route   GET /api/events/registered
// @access  Private
export const getRegisteredEvents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('registeredEvents');

    res.status(200).json({
      status: 'success',
      results: user.registeredEvents.length,
      data: { events: user.registeredEvents }
    });
  } catch (error) {
    next(error);
  }
};
