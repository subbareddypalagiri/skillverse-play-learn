import express from 'express';
import { 
  getLiveRooms, 
  getLiveRoom, 
  createLiveRoom, 
  endLiveRoom, 
  verifyPasscode,
  submitLiveApplication, 
  getMyApplication,
  reviewLiveApplication 
} from '../controllers/liveController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/rooms', getLiveRooms);
router.get('/rooms/:id', getLiveRoom);

// Protected routes
router.use(authenticate);
router.post('/rooms', createLiveRoom);
router.post('/rooms/:id/end', endLiveRoom);
router.post('/rooms/:id/verify-passcode', verifyPasscode);
router.post('/apply', submitLiveApplication);
router.get('/my-application', getMyApplication);

// Admin only route
router.put('/applications/:id/review', reviewLiveApplication);

export default router;
