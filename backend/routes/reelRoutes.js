import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { reelUpload } from '../middleware/upload.js';
import {
  createReel,
  getUploadSignature,
  getReelsFeed,
  getMyReels,
  getReelsByUser,
  toggleLikeReel,
  toggleSaveReel,
  addReelComment,
  getReelComments,
  trackReelView,
  trackReelShare,
  toggleFollowCreator,
  deleteReel,
  getReelCategories
} from '../controllers/reelController.js';

const router = express.Router();

router.use(authenticate);

router.get('/feed', getReelsFeed);
router.get('/categories', getReelCategories);
router.get('/upload-signature', getUploadSignature);
router.get('/me', getMyReels);
router.get('/user/:userId', getReelsByUser);
router.get('/:id/comments', getReelComments);

router.post('/', reelUpload.single('video'), createReel);

router.post('/:id/like', toggleLikeReel);
router.post('/:id/save', toggleSaveReel);
router.post('/:id/comments', addReelComment);
router.post('/:id/view', trackReelView);
router.post('/:id/share', trackReelShare);
router.post('/:id/follow', toggleFollowCreator);

router.delete('/:id', deleteReel);

export default router;
