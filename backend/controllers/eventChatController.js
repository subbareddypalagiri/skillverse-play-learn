import EventMessage from '../models/EventMessage.js';
import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import { successResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errorHandler.js';

// Helper to verify if user is allowed to access this event's chat
const verifyChatAccess = async (eventId, userId, userRole) => {
  const event = await Event.findById(eventId);
  if (!event || event.isDeleted) {
    throw new NotFoundError('Event not found');
  }

  // Admin has full access
  if (userRole === 'admin') return true;
  
  // Organizer has full access
  if (event.organizerId.toString() === userId.toString()) return true;

  // Otherwise, user MUST be registered
  const reg = await EventRegistration.findOne({
    eventId: eventId,
    userId: userId,
    status: 'registered'
  });

  if (!reg) {
    throw new ForbiddenError('Only registered users can access this chat. No fake access!');
  }
  
  return true;
};

export const getEventMessages = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    await verifyChatAccess(eventId, req.userId, req.user.role);

    // Fetch messages (limit to last 100 for performance/safety)
    const messages = await EventMessage.find({ eventId, isDeleted: false })
      .populate('senderId', 'name avatar role')
      .sort('createdAt')
      .limit(200);

    return successResponse(res, 200, 'Messages fetched', { messages });
  } catch (error) {
    next(error);
  }
};

export const sendEventMessage = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      throw new ValidationError('Message cannot be empty');
    }

    await verifyChatAccess(eventId, req.userId, req.user.role);

    const message = await EventMessage.create({
      eventId,
      senderId: req.userId,
      text: text.trim()
    });

    const populatedMessage = await EventMessage.findById(message._id)
      .populate('senderId', 'name avatar role');

    return successResponse(res, 201, 'Message sent', { message: populatedMessage });
  } catch (error) {
    next(error);
  }
};
