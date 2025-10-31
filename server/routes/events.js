import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
  unregisterEvent,
  getRegisteredEvents
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

router.get('/registered', protect, getRegisteredEvents);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

router.route('/:id/register')
  .post(protect, registerEvent)
  .delete(protect, unregisterEvent);

export default router;
