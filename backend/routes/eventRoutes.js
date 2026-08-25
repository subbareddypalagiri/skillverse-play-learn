import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations,
  getEventRegistrants,
  getEventMemories,
  addEventMemory,
  uploadMemoryFile
} from '../controllers/eventController.js';
import { memoryUpload } from '../middleware/upload.js';
import {
  submitAmbassadorApplication,
  getMyAmbassadorApplication,
  reviewAmbassadorApplication
} from '../controllers/ambassadorController.js';
import { getEventMessages, sendEventMessage } from '../controllers/eventChatController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/my-registrations', authenticate, getMyRegistrations);

// Ambassador application routes
router.post('/ambassador/apply', authenticate, submitAmbassadorApplication);
router.get('/ambassador/my-application', authenticate, getMyAmbassadorApplication);
router.put('/ambassador/applications/:id/review', authenticate, reviewAmbassadorApplication);

router.get('/:id', optionalAuthenticate, getEvent);

router.get('/:id/registrants', authenticate, getEventRegistrants);

// Chat Routes
router.get('/:id/messages', authenticate, getEventMessages);
router.post('/:id/messages', authenticate, sendEventMessage);

// Memories Routes
router.get('/:id/memories', optionalAuthenticate, getEventMemories);
router.post('/:id/memories', authenticate, addEventMemory);
router.post('/upload-temp', authenticate, memoryUpload.single('file'), uploadMemoryFile);

router.post('/:id/register', authenticate, registerForEvent);
router.post('/', authenticate, authorize('admin', 'campus_ambassador'), createEvent);
router.patch('/:id', authenticate, authorize('admin', 'campus_ambassador'), updateEvent);
router.delete('/:id', authenticate, authorize('admin', 'campus_ambassador'), deleteEvent);

export default router;
