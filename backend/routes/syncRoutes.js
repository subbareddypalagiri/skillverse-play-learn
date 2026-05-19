import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAlumniTalks,
  getAlumniTalk,
  registerForTalk,
  askQuestion,
  getMentors,
  getMentor,
  bookSession,
  rateSession,
  getDomains
} from '../controllers/syncController.js';

import {
  applyAsMentor,
  getMyMentorApplication,
  applyAsAlumniExpert,
  getMyAlumniExpertApplication,
  createAlumniTalk,
  getMyAlumniTalks,
  updateAlumniTalk,
  getAllMentorApplications,
  reviewMentorApplication,
  getAllAlumniExpertApplications,
  reviewAlumniExpertApplication,
  registerAsAlumni,
  getMyAlumniProfile,
  updateMyAlumniProfile,
  getAllAlumni,
  getAlumniById,
  getAlumniMentors,
  getAlumniSpeakers
} from '../controllers/syncApplicationController.js';

const router = express.Router();

// Domain routes
router.get('/domains', getDomains);

// Alumni Talk routes (Public viewing)
router.get('/alumni-talks', getAlumniTalks);
router.get('/alumni-talks/:id', getAlumniTalk);
router.post('/alumni-talks/:id/register', authenticate, registerForTalk);
router.post('/alumni-talks/:id/questions', authenticate, askQuestion);

// Mentor routes (Public viewing)
router.get('/mentors', getMentors);
router.get('/mentors/:id', getMentor);
router.post('/mentors/:id/book', authenticate, bookSession);
router.put('/mentors/:mentorId/sessions/:sessionId/rate', authenticate, rateSession);

// ====== APPLICATION ROUTES ======

// Mentor Application Routes
router.post('/apply/mentor', authenticate, applyAsMentor);
router.get('/apply/mentor/my-application', authenticate, getMyMentorApplication);

// Alumni Expert Application Routes
router.post('/apply/alumni-expert', authenticate, applyAsAlumniExpert);
router.get('/apply/alumni-expert/my-application', authenticate, getMyAlumniExpertApplication);

// ====== ALUMNI REGISTRATION ROUTES ======

// Alumni Registration Routes
router.post('/apply/alumni', authenticate, registerAsAlumni);
router.get('/apply/alumni/my-profile', authenticate, getMyAlumniProfile);
router.put('/apply/alumni/my-profile', authenticate, updateMyAlumniProfile);

// Alumni Directory (Public)
router.get('/alumni', getAllAlumni);
router.get('/alumni/:id', getAlumniById);
router.get('/alumni/mentors', getAlumniMentors);
router.get('/alumni/speakers', getAlumniSpeakers);

// ====== EXPERT CONTENT CREATION ======

// Alumni Expert Talk Creation (for approved experts)
router.post('/expert/create-talk', authenticate, createAlumniTalk);
router.get('/expert/my-talks', authenticate, getMyAlumniTalks);
router.put('/expert/talks/:id', authenticate, updateAlumniTalk);

// ====== ADMIN ROUTES ======

// Admin - Mentor Applications Management
router.get('/admin/mentor-applications', authenticate, getAllMentorApplications);
router.put('/admin/mentor-applications/:id/review', authenticate, reviewMentorApplication);

// Admin - Alumni Expert Applications Management
router.get('/admin/alumni-expert-applications', authenticate, getAllAlumniExpertApplications);
router.put('/admin/alumni-expert-applications/:id/review', authenticate, reviewAlumniExpertApplication);

export default router;

