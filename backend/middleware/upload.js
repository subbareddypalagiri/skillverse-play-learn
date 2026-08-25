import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { ValidationError } from '../utils/errorHandler.js';

const isServerless = !!process.env.VERCEL;
const baseDir = isServerless ? '/tmp' : process.cwd();
const uploadsDir = path.resolve(baseDir, 'uploads');
const reelsDir = path.resolve(uploadsDir, 'reels');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(reelsDir)) {
  fs.mkdirSync(reelsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reelsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    const safeName = `reel-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('video/')) {
    return cb(new ValidationError('Only video files are allowed'), false);
  }
  return cb(null, true);
};

export const reelUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max file size
  }
});

const memoryFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
    return cb(new ValidationError('Only image and video files are allowed'), false);
  }
  return cb(null, true);
};

export const memoryUpload = multer({
  storage,
  fileFilter: memoryFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});
