import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../config/logger.js';

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

/**
 * Smart hybrid video uploader:
 * 1. If Cloudinary is configured -> uploads video to CDN, gets video & thumbnail URLs, deletes temp disk file.
 * 2. If Cloudinary is NOT configured -> falls back cleanly to local disk storage (/uploads/reels/filename).
 */
export const uploadReelVideo = async (filePath, filename) => {
  if (isCloudinaryConfigured()) {
    try {
      logger.info(`Uploading video ${filename} to Cloudinary CDN...`);
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'skillverse/reels',
        eager: [
          { format: 'jpg', width: 480, crop: 'pad' } // Generate auto thumbnail
        ],
        eager_async: false
      });

      // Remove temp local disk file after successful CDN upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const thumbnailUrl = result.eager?.[0]?.secure_url || result.secure_url.replace(/\.[^/.]+$/, '.jpg');

      return {
        videoUrl: result.secure_url,
        thumbnailUrl: thumbnailUrl,
        videoSize: result.bytes,
        duration: Math.round(result.duration || 0),
        storageType: 'cloudinary'
      };
    } catch (err) {
      logger.error('Cloudinary video upload failed, falling back to disk storage:', err);
    }
  }

  // Disk fallback storage
  return {
    videoUrl: `/uploads/reels/${filename}`,
    thumbnailUrl: null,
    storageType: 'disk'
  };
};

export default cloudinary;
