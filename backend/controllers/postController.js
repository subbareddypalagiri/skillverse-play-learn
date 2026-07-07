import Post from '../models/Post.js';
import Reel from '../models/Reel.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errorHandler.js';

/**
 * @desc    Create a new post
 * @route   POST /api/v1/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { caption, mediaType, mediaUrls, category, tags } = req.body;

    if (!mediaType) {
      throw new ValidationError('Media type is required');
    }

    if (mediaType !== 'text' && (!mediaUrls || mediaUrls.length === 0)) {
      throw new ValidationError('Media URLs are required for image/video posts');
    }

    const tagList = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : Array.isArray(tags)
        ? tags.map(t => String(t).trim().toLowerCase()).filter(Boolean)
        : [];

    const post = await Post.create({
      userId: req.userId,
      caption,
      mediaType,
      mediaUrls: mediaUrls || [],
      category: category || 'general',
      tags: tagList
    });

    const populated = await Post.findById(post._id).populate('userId', 'name avatar bio');

    return successResponse(res, 201, 'Post created successfully', { post: mapPost(populated, req.userId) });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get feed posts with pagination
 * @route   GET /api/v1/posts/feed
 * @access  Private
 */
export const getPostsFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const query = { isPublished: true, isDeleted: false };
    if (category && category !== 'all') {
      query.category = category;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('userId', 'name avatar bio')
        .populate('comments.userId', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Post.countDocuments(query)
    ]);

    const feed = posts.map(post => mapPost(post, req.userId));

    return paginatedResponse(res, 200, 'Feed fetched successfully', feed, {
      page: safePage,
      limit: safeLimit,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's posts
 * @route   GET /api/v1/posts/me
 * @access  Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.userId, isDeleted: false })
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    const items = posts.map(post => mapPost(post, req.userId));
    return successResponse(res, 200, 'My posts fetched successfully', { posts: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's reels (combined from Reel and Post models)
 * @route   GET /api/v1/posts/my-reels
 * @access  Private
 */
export const getMyReels = async (req, res, next) => {
  try {
    // Fetch from Post model (new uploads)
    const postReels = await Post.find({ 
      userId: req.userId, 
      mediaType: 'video', 
      isDeleted: false 
    })
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    // Fetch from Reel model (existing reels)
    const reelModels = await Reel.find({ 
      userId: req.userId, 
      isDeleted: false,
      isPublished: true
    })
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    // Combine and map results
    const combinedReels = [
      ...postReels.map(post => mapPost(post, req.userId)),
      ...reelModels.map(reel => mapReel(reel, req.userId))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return successResponse(res, 200, 'My reels fetched successfully', { 
      reels: combinedReels,
      _debug: { postCount: postReels.length, reelCount: reelModels.length }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get posts by a specific user
 * @route   GET /api/v1/posts/user/:userId
 * @access  Private
 */
export const getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId, isPublished: true, isDeleted: false })
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    const items = posts.map(post => mapPost(post, req.userId));
    return successResponse(res, 200, 'User posts fetched successfully', { posts: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post
 * @route   GET /api/v1/posts/:id
 * @access  Private
 */
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name avatar bio')
      .populate('comments.userId', 'name avatar');

    if (!post || post.isDeleted) {
      throw new NotFoundError('Post not found');
    }

    return successResponse(res, 200, 'Post fetched', { post: mapPost(post, req.userId) });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like on a post
 * @route   POST /api/v1/posts/:id/like
 * @access  Private
 */
export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await getPostForInteraction(req.params.id);
    const likedIndex = post.likedBy.findIndex(id => id && (id._id || id).toString() === req.userId.toString());

    let liked;
    if (likedIndex >= 0) {
      post.likedBy.splice(likedIndex, 1);
      liked = false;
    } else {
      post.likedBy.push(req.userId);
      liked = true;
    }

    post.likesCount = post.likedBy.length;
    await post.save();

    return successResponse(res, 200, liked ? 'Post liked' : 'Post unliked', {
      liked,
      likesCount: post.likesCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle save on a post
 * @route   POST /api/v1/posts/:id/save
 * @access  Private
 */
export const toggleSavePost = async (req, res, next) => {
  try {
    const post = await getPostForInteraction(req.params.id);
    const savedIndex = post.savedBy.findIndex(id => id && (id._id || id).toString() === req.userId.toString());

    let saved;
    if (savedIndex >= 0) {
      post.savedBy.splice(savedIndex, 1);
      saved = false;
    } else {
      post.savedBy.push(req.userId);
      saved = true;
    }

    post.savesCount = post.savedBy.length;
    await post.save();

    return successResponse(res, 200, saved ? 'Post saved' : 'Post unsaved', {
      saved,
      savesCount: post.savesCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to a post
 * @route   POST /api/v1/posts/:id/comments
 * @access  Private
 */
export const addPostComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      throw new ValidationError('Comment text is required');
    }

    const post = await getPostForInteraction(req.params.id);
    const comment = {
      userId: req.userId,
      text: text.trim()
    };

    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    await post.save();

    // Populate the new comment's user
    await post.populate('comments.userId', 'name avatar');
    const latestComment = post.comments[post.comments.length - 1];

    return successResponse(res, 201, 'Comment added', {
      comment: {
        _id: latestComment._id,
        text: latestComment.text,
        createdAt: latestComment.createdAt,
        user: latestComment.userId
      },
      commentsCount: post.commentsCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track share on a post
 * @route   POST /api/v1/posts/:id/share
 * @access  Private
 */
export const trackPostShare = async (req, res, next) => {
  try {
    const post = await getPostForInteraction(req.params.id);
    post.sharesCount += 1;
    await post.save();

    return successResponse(res, 200, 'Share tracked', { sharesCount: post.sharesCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Track view on a post
 * @route   POST /api/v1/posts/:id/view
 * @access  Private
 */
export const trackPostView = async (req, res, next) => {
  try {
    const post = await getPostForInteraction(req.params.id);
    post.viewsCount = (post.viewsCount || 0) + 1;
    await post.save();

    return successResponse(res, 200, 'View tracked', { viewsCount: post.viewsCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own post
 * @route   DELETE /api/v1/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res, next) => {
  try {
    let deleted = false;
    const post = await Post.findById(req.params.id);
    if (post && !post.isDeleted) {
      if ((!post.userId || (post.userId._id || post.userId).toString() !== req.userId.toString()) && req.user?.role !== 'admin') {
        throw new AuthorizationError('Not authorized to delete this post');
      }
      post.isDeleted = true;
      post.deletedAt = new Date();
      await post.save();
      deleted = true;

      if (post.mediaUrls?.[0]?.url) {
        await Reel.updateMany({ videoUrl: post.mediaUrls[0].url, userId: req.userId }, { isDeleted: true, deletedAt: new Date() });
      }
    }

    const reel = await Reel.findById(req.params.id);
    if (reel && !reel.isDeleted) {
      if ((!reel.userId || (reel.userId._id || reel.userId).toString() !== req.userId.toString()) && req.user?.role !== 'admin') {
        throw new AuthorizationError('Not authorized to delete this reel');
      }
      reel.isDeleted = true;
      reel.deletedAt = new Date();
      await reel.save();
      deleted = true;

      if (reel.videoUrl) {
        await Post.updateMany({ 'mediaUrls.url': reel.videoUrl, userId: req.userId }, { isDeleted: true, deletedAt: new Date() });
      }
    }

    if (!deleted) {
      throw new NotFoundError('Post or Reel not found');
    }

    return successResponse(res, 200, 'Deleted successfully');
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get post categories
 * @route   GET /api/v1/posts/categories
 * @access  Private
 */
export const getPostCategories = async (req, res, next) => {
  try {
    const categories = ['general', 'achievement', 'project', 'learning', 'career', 'question', 'tip'];
    return successResponse(res, 200, 'Categories fetched', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload video file for reel
 * @route   POST /api/v1/posts/upload
 * @access  Private
 */
export const uploadReelVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError('Video file is required');
    }

    const mediaUrl = `/uploads/reels/${req.file.filename}`;
    
    return successResponse(res, 200, 'Video uploaded successfully', {
      mediaUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const getPostForInteraction = async (postId) => {
  const post = await Post.findById(postId);
  if (!post || post.isDeleted) {
    throw new NotFoundError('Post not found');
  }
  return post;
};

const mapPost = (post, viewerId) => {
  const user = post.userId && typeof post.userId === 'object'
    ? {
        _id: post.userId._id,
        name: post.userId.name,
        avatar: post.userId.avatar,
        bio: post.userId.bio
      }
    : null;

  return {
    _id: post._id,
    caption: post.caption,
    mediaType: post.mediaType,
    mediaUrls: post.mediaUrls,
    category: post.category,
    tags: post.tags || [],
    createdAt: post.createdAt,
    user,
    stats: {
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      shares: post.sharesCount || 0,
      saves: post.savesCount || 0,
      views: post.viewsCount || 0
    },
    comments: (post.comments || []).slice(-5).map(c => ({
      _id: c._id,
      text: c.text,
      createdAt: c.createdAt,
      user: c.userId && typeof c.userId === 'object'
        ? { _id: c.userId._id, name: c.userId.name, avatar: c.userId.avatar }
        : null
    })),
    isLiked: viewerId ? (post.likedBy || []).some(id => id && (id._id || id).toString() === viewerId.toString()) : false,
    isSaved: viewerId ? (post.savedBy || []).some(id => id && (id._id || id).toString() === viewerId.toString()) : false,
    isPinned: post.isPinned || false
  };
};

const mapReel = (reel, viewerId) => {
  const user = reel.userId && typeof reel.userId === 'object'
    ? {
        _id: reel.userId._id,
        name: reel.userId.name,
        avatar: reel.userId.avatar,
        bio: reel.userId.bio
      }
    : null;

  return {
    _id: reel._id,
    caption: reel.caption || reel.title,
    mediaType: 'video',
    mediaUrls: [{ 
      url: reel.videoUrl,
      thumbnail: reel.thumbnailUrl,
      width: 1080,
      height: 1920
    }],
    category: reel.category || 'general',
    tags: reel.tags || [],
    createdAt: reel.createdAt,
    user,
    stats: {
      likes: reel.likesCount || 0,
      comments: reel.commentsCount || 0,
      shares: reel.sharesCount || 0,
      saves: reel.savesCount || 0,
      views: reel.viewsCount || 0
    },
    comments: (reel.comments || []).slice(-5).map(c => ({
      _id: c._id,
      text: c.text,
      createdAt: c.createdAt,
      user: c.userId && typeof c.userId === 'object'
        ? { _id: c.userId._id, name: c.userId.name, avatar: c.userId.avatar }
        : null
    })),
    isLiked: viewerId ? (reel.likedBy || []).some(id => id.toString() === viewerId.toString()) : false,
    isSaved: viewerId ? (reel.savedBy || []).some(id => id.toString() === viewerId.toString()) : false,
    isPinned: false
  };
};
