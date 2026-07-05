import Reel from '../models/Reel.js';
import Post from '../models/Post.js';
import ReelFollow from '../models/ReelFollow.js';
import { successResponse, paginatedResponse } from '../utils/responseHandler.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errorHandler.js';
import { uploadReelVideo } from '../utils/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

export const getUploadSignature = async (req, res, next) => {
  try {
    const config = cloudinary.config();
    let apiSecret = process.env.CLOUDINARY_API_SECRET || config.api_secret || '';
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME || config.cloud_name || '';
    let apiKey = process.env.CLOUDINARY_API_KEY || config.api_key || '';

    if (!apiSecret || !cloudName || !apiKey) {
      if (process.env.CLOUDINARY_URL) {
        const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (match) {
          apiKey = match[1];
          apiSecret = match[2];
          cloudName = match[3];
        }
      }
    }

    if (!apiSecret || !cloudName || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured in backend environment variables (CLOUDINARY_URL or API keys missing)'
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'skillverse/reels' },
      apiSecret
    );

    return res.status(200).json({
      success: true,
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder: 'skillverse/reels'
    });
  } catch (error) {
    next(error);
  }
};


const buildFeedQuery = ({ category, tag, userId, mode }) => {
  const query = { isPublished: true, isDeleted: false };

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  return query;
};

const getSortForMode = (mode) => {
  switch (mode) {
    case 'trending':
      return { likesCount: -1, commentsCount: -1, sharesCount: -1, viewsCount: -1, createdAt: -1 };
    case 'recommended':
      return { recommendationScore: -1, createdAt: -1 };
    case 'latest':
    default:
      return { createdAt: -1 };
  }
};

const mapReel = async (reel, viewerId) => {
  const creatorFollowerCount = await ReelFollow.countDocuments({ creatorId: reel.userId?._id || reel.userId });
  const isFollowingCreator = viewerId
    ? await ReelFollow.exists({ followerId: viewerId, creatorId: reel.userId?._id || reel.userId })
    : false;

  const creator = reel.userId && typeof reel.userId === 'object'
    ? {
        _id: reel.userId._id,
        name: reel.userId.name,
        avatar: reel.userId.avatar,
        bio: reel.userId.bio
      }
    : null;

  return {
    _id: reel._id,
    title: reel.title,
    caption: reel.caption,
    description: reel.description,
    category: reel.category,
    tags: reel.tags || [],
    videoUrl: reel.videoUrl,
    thumbnailUrl: reel.thumbnailUrl,
    duration: reel.duration,
    courseLink: reel.courseLink || null,
    sourceCourseId: reel.sourceCourseId || null,
    sourceCourseTitle: reel.sourceCourseTitle || null,
    createdAt: reel.createdAt,
    stats: {
      views: reel.viewsCount || 0,
      likes: reel.likesCount || 0,
      comments: reel.commentsCount || 0,
      shares: reel.sharesCount || 0,
      saves: reel.savesCount || 0
    },
    creator: creator
      ? {
          ...creator,
          followersCount: creatorFollowerCount,
          isFollowing: Boolean(isFollowingCreator)
        }
      : null,
    isLiked: viewerId ? (reel.likedBy || []).some(id => id.toString() === viewerId.toString()) : false,
    isSaved: viewerId ? (reel.savedBy || []).some(id => id.toString() === viewerId.toString()) : false
  };
};

/**
 * @desc    Upload and create a reel
 * @route   POST /api/v1/reels
 * @access  Private
 */
export const createReel = async (req, res, next) => {
  try {
    const { title, caption, description, category, tags, duration, courseLink, sourceCourseId, sourceCourseTitle, videoUrl: directVideoUrl, thumbnailUrl: directThumbnailUrl, videoSize: directVideoSize } = req.body;

    if (!req.file && !directVideoUrl) {
      throw new ValidationError('Video file or video URL is required');
    }

    if (!title || !category) {
      throw new ValidationError('Title and category are required');
    }

    const parsedDuration = Number(duration);
    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0 || parsedDuration > 300) {
      throw new ValidationError('Duration must be a number between 1 and 300 seconds');
    }

    const tagList = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(tags)
        ? tags.map(t => String(t).trim()).filter(Boolean)
        : [];

    let uploadResult;
    if (req.file) {
      uploadResult = await uploadReelVideo(req.file.path, req.file.filename);
    } else {
      uploadResult = {
        videoUrl: directVideoUrl,
        thumbnailUrl: directThumbnailUrl || null,
        videoSize: Number(directVideoSize) || 0,
        duration: parsedDuration
      };
    }

    const reel = await Reel.create({
      userId: req.userId,
      title,
      caption,
      description,
      category,
      tags: tagList,
      duration: uploadResult.duration || parsedDuration,
      videoUrl: uploadResult.videoUrl,
      thumbnailUrl: uploadResult.thumbnailUrl || undefined,
      videoSize: uploadResult.videoSize || (req.file ? req.file.size : Number(directVideoSize) || 0),
      courseLink,
      sourceCourseId: sourceCourseId || undefined,
      sourceCourseTitle,
      createdBy: req.userId,
      updatedBy: req.userId
    });

    const hydrated = await Reel.findById(reel._id).populate('userId', 'name avatar bio');
    const payload = await mapReel(hydrated, req.userId);

    return successResponse(res, 201, 'Reel uploaded successfully', { reel: payload });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reels feed with pagination
 * @route   GET /api/v1/reels/feed
 * @access  Private
 */
export const getReelsFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 8, mode = 'latest', category, tag } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 20);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const query = buildFeedQuery({
      category,
      tag,
      userId: req.userId,
      mode
    });

    const sort = getSortForMode(mode);

    const [reels, total] = await Promise.all([
      Reel.find(query)
        .populate('userId', 'name avatar bio')
        .sort(sort)
        .skip(skip)
        .limit(safeLimit),
      Reel.countDocuments(query)
    ]);

    const feed = await Promise.all(reels.map((reel) => mapReel(reel, req.userId)));

    return paginatedResponse(res, 200, 'Reels feed fetched successfully', feed, {
      page: safePage,
      limit: safeLimit,
      total
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user's reels
 * @route   GET /api/v1/reels/me
 * @access  Private
 */
export const getMyReels = async (req, res, next) => {
  try {
    const reels = await Reel.find({ userId: req.userId, isPublished: true, isDeleted: false })
      .populate('userId', 'name avatar bio')
      .sort({ createdAt: -1 });

    const items = await Promise.all(reels.map((reel) => mapReel(reel, req.userId)));
    return successResponse(res, 200, 'My reels fetched successfully', { reels: items });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reels for a specific creator
 * @route   GET /api/v1/reels/user/:userId
 * @access  Private
 */
export const getReelsByUser = async (req, res, next) => {
  try {
    const reels = await Reel.find({ userId: req.params.userId, isPublished: true, isDeleted: false })
      .populate('userId', 'name avatar bio')
      .sort({ createdAt: -1 });

    const items = await Promise.all(reels.map((reel) => mapReel(reel, req.userId)));
    return successResponse(res, 200, 'Creator reels fetched successfully', { reels: items });
  } catch (error) {
    next(error);
  }
};

const getReelForInteraction = async (reelId) => {
  const reel = await Reel.findById(reelId);
  if (!reel || reel.isDeleted) {
    throw new NotFoundError('Reel not found');
  }
  return reel;
};

/**
 * @desc    Toggle like on a reel
 * @route   POST /api/v1/reels/:id/like
 * @access  Private
 */
export const toggleLikeReel = async (req, res, next) => {
  try {
    const reel = await getReelForInteraction(req.params.id);
    const likedIndex = reel.likedBy.findIndex((id) => id.toString() === req.userId.toString());

    let liked;
    if (likedIndex >= 0) {
      reel.likedBy.splice(likedIndex, 1);
      liked = false;
    } else {
      reel.likedBy.push(req.userId);
      liked = true;
    }

    reel.likesCount = reel.likedBy.length;
    reel.updatedBy = req.userId;
    await reel.save();

    return successResponse(res, 200, liked ? 'Reel liked' : 'Reel unliked', {
      liked,
      likesCount: reel.likesCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle save on a reel
 * @route   POST /api/v1/reels/:id/save
 * @access  Private
 */
export const toggleSaveReel = async (req, res, next) => {
  try {
    const reel = await getReelForInteraction(req.params.id);
    const savedIndex = reel.savedBy.findIndex((id) => id.toString() === req.userId.toString());

    let saved;
    if (savedIndex >= 0) {
      reel.savedBy.splice(savedIndex, 1);
      saved = false;
    } else {
      reel.savedBy.push(req.userId);
      saved = true;
    }

    reel.savesCount = reel.savedBy.length;
    reel.updatedBy = req.userId;
    await reel.save();

    return successResponse(res, 200, saved ? 'Reel saved' : 'Reel unsaved', {
      saved,
      savesCount: reel.savesCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a reel
 * @route   POST /api/v1/reels/:id/comments
 * @access  Private
 */
export const addReelComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      throw new ValidationError('Comment text is required');
    }

    const reel = await getReelForInteraction(req.params.id);
    const comment = {
      userId: req.userId,
      text: text.trim()
    };

    reel.comments.push(comment);
    reel.commentsCount = reel.comments.length;
    reel.updatedBy = req.userId;
    await reel.save();

    const latestComment = reel.comments[reel.comments.length - 1];

    return successResponse(res, 201, 'Comment added', {
      comment: latestComment,
      commentsCount: reel.commentsCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a reel
 * @route   GET /api/v1/reels/:id/comments
 * @access  Private
 */
export const getReelComments = async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.id).populate('comments.userId', 'name avatar');
    if (!reel || reel.isDeleted) {
      throw new NotFoundError('Reel not found');
    }
    return successResponse(res, 200, 'Comments fetched successfully', {
      comments: reel.comments || []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark reel viewed
 * @route   POST /api/v1/reels/:id/view
 * @access  Private
 */
export const trackReelView = async (req, res, next) => {
  try {
    const reel = await getReelForInteraction(req.params.id);
    reel.viewsCount += 1;
    await reel.save();

    return successResponse(res, 200, 'View tracked', { viewsCount: reel.viewsCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark reel shared
 * @route   POST /api/v1/reels/:id/share
 * @access  Private
 */
export const trackReelShare = async (req, res, next) => {
  try {
    const reel = await getReelForInteraction(req.params.id);
    reel.sharesCount += 1;
    await reel.save();

    return successResponse(res, 200, 'Share tracked', { sharesCount: reel.sharesCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle follow for reel creator
 * @route   POST /api/v1/reels/:id/follow
 * @access  Private
 */
export const toggleFollowCreator = async (req, res, next) => {
  try {
    const reel = await Reel.findById(req.params.id).select('userId isDeleted');
    if (!reel || reel.isDeleted) {
      throw new NotFoundError('Reel not found');
    }

    const creatorId = reel.userId.toString();

    if (creatorId === req.userId.toString()) {
      throw new AuthorizationError('You cannot follow yourself');
    }

    const existing = await ReelFollow.findOne({
      followerId: req.userId,
      creatorId
    });

    let isFollowing;
    if (existing) {
      await ReelFollow.findByIdAndDelete(existing._id);
      isFollowing = false;
    } else {
      await ReelFollow.create({
        followerId: req.userId,
        creatorId
      });
      isFollowing = true;
    }

    const followersCount = await ReelFollow.countDocuments({ creatorId });

    return successResponse(res, 200, isFollowing ? 'Creator followed' : 'Creator unfollowed', {
      creatorId,
      isFollowing,
      followersCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own reel
 * @route   DELETE /api/v1/reels/:id
 * @access  Private
 */
export const deleteReel = async (req, res, next) => {
  try {
    let deleted = false;
    const reel = await Reel.findById(req.params.id);
    if (reel && !reel.isDeleted) {
      if (reel.userId.toString() !== req.userId.toString() && req.user?.role !== 'admin') {
        throw new AuthorizationError('Not authorized to delete this reel');
      }
      reel.isDeleted = true;
      reel.deletedAt = new Date();
      reel.updatedBy = req.userId;
      await reel.save();
      deleted = true;

      if (reel.videoUrl) {
        await Post.updateMany({ 'mediaUrls.url': reel.videoUrl, userId: req.userId }, { isDeleted: true, deletedAt: new Date() });
      }
    }

    const post = await Post.findById(req.params.id);
    if (post && !post.isDeleted) {
      if (post.userId.toString() !== req.userId.toString() && req.user?.role !== 'admin') {
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

    if (!deleted) {
      throw new NotFoundError('Reel or Post not found');
    }

    return successResponse(res, 200, 'Reel deleted successfully');
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get available reel categories
 * @route   GET /api/v1/reels/categories
 * @access  Private
 */
export const getReelCategories = async (req, res, next) => {
  try {
    const categories = await Reel.distinct('category', { isPublished: true, isDeleted: false });
    return successResponse(res, 200, 'Categories fetched', { categories });
  } catch (error) {
    next(error);
  }
};
