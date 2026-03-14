import express from 'express';
import { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  registerForEvent, 
  getMyRegistrations 
} from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);

// Private routes (named paths — must be before /:id to avoid being shadowed)
router.get('/my-registrations', authenticate, getMyRegistrations);

// Public param route
router.get('/:id', getEvent);

// Private routes
router.use(authenticate);
router.post('/:id/register', registerForEvent);

// Admin-only routes
router.post('/', authorize('admin'), createEvent);
router.patch('/:id', authorize('admin'), updateEvent);

export default router;
