import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { reelUpload } from '../middleware/upload.js';
import {
  createPost,
  getPostsFeed,
  getMyPosts,
  getMyReels,
  getPostsByUser,
  getPost,
  toggleLikePost,
  toggleSavePost,
  addPostComment,
  trackPostShare,
  trackPostView,
  deletePost,
  getPostCategories,
  uploadReelVideo
} from '../controllers/postController.js';

const router = express.Router();

router.use(authenticate);

// Feed and categories
router.get('/feed', getPostsFeed);
router.get('/categories', getPostCategories);

// Upload endpoint
router.post('/upload', reelUpload.single('video'), uploadReelVideo);

// User posts
router.get('/me', getMyPosts);
router.get('/my-reels', getMyReels);
router.get('/user/:userId', getPostsByUser);

// Single post
router.get('/:id', getPost);

// Create post
router.post('/', createPost);

// Engagement
router.post('/:id/like', toggleLikePost);
router.post('/:id/save', toggleSavePost);
router.post('/:id/comments', addPostComment);
router.post('/:id/share', trackPostShare);
router.post('/:id/view', trackPostView);

// Delete
router.delete('/:id', deletePost);

export default router;
