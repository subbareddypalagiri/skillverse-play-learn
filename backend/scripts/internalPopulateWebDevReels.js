import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Reel from '../models/Reel.js';

const REQUIRED_TOPIC_COUNT = 10;

// Real chapter/timestamp references extracted from the existing Web Development source videos.
const CHAPTER_TOPICS_BY_VIDEO_ID = {
  nu_pCVPKzTk: [
    { concept: 'Learn HTML', start: 162 },
    { concept: 'Learn CSS', start: 5187 },
    { concept: 'Learn JavaScript', start: 11749 },
    { concept: 'Create Frontend Movie App', start: 17521 },
    { concept: 'Create Backend Reviews API', start: 20644 }
  ],
  CgkZ7MvWUAA: [
    { concept: 'Conditional Rendering', start: 3169 },
    { concept: 'Render Lists', start: 3784 },
    { concept: 'useState Hook', start: 6124 }
  ],
  Oe421EPjeBE: [
    { concept: 'What Is Node', start: 101 },
    { concept: 'Node Globals', start: 1227 }
  ]
};

const slugify = (value) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const deriveTagsFromTitle = (title) => {
  const normalized = String(title || '').toLowerCase();
  const tokens = normalized
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .filter((word) => word.length > 2)
    .slice(0, 4);

  return Array.from(new Set(['web-development', ...tokens]));
};

const buildTopicCandidatesFromCourse = (course) => {
  const syllabusTopics = (course.syllabus || [])
    .map((item) => (item?.title || '').trim())
    .filter(Boolean);

  const videoTopics = (course.resources?.videos || [])
    .map((item) => (item?.title || '').trim())
    .filter(Boolean);

  const merged = [...syllabusTopics, ...videoTopics];
  const unique = [];
  const seen = new Set();

  merged.forEach((topicTitle) => {
    const key = slugify(topicTitle);
    if (!key || seen.has(key)) return;
    seen.add(key);
    unique.push({
      concept: topicTitle,
      topicKey: key,
      tags: deriveTagsFromTitle(topicTitle)
    });
  });

  return unique.slice(0, REQUIRED_TOPIC_COUNT);
};

const buildChapterTopicsFromVideos = (videos) => {
  const topics = [];

  videos.forEach((video) => {
    const videoId = video?.videoId;
    if (!videoId) return;

    const chapterTopics = CHAPTER_TOPICS_BY_VIDEO_ID[videoId] || [];
    chapterTopics.forEach((chapter) => {
      topics.push({
        concept: chapter.concept,
        topicKey: slugify(chapter.concept),
        tags: deriveTagsFromTitle(chapter.concept),
        videoId,
        start: chapter.start,
        end: chapter.start + 60
      });
    });
  });

  const deduped = [];
  const seen = new Set();
  topics.forEach((item) => {
    if (seen.has(item.topicKey)) return;
    seen.add(item.topicKey);
    deduped.push(item);
  });

  return deduped.slice(0, REQUIRED_TOPIC_COUNT);
};

const pickCurrentUser = async () => {
  const args = process.argv.slice(2);
  const byEmail = args.find((arg) => arg.startsWith('--email='))?.split('=')[1];
  const byUserId = args.find((arg) => arg.startsWith('--userId='))?.split('=')[1];

  if (byUserId) {
    return User.findById(byUserId);
  }

  if (byEmail) {
    return User.findOne({ email: byEmail.toLowerCase() });
  }

  return User.findOne({ isDeleted: false }).sort({ 'stats.lastActivityAt': -1, updatedAt: -1, createdAt: -1 });
};

const buildClipWindow = (video, index) => {
  const rawDuration = Number(video?.duration);
  const duration = Number.isFinite(rawDuration) && rawDuration > 60 ? rawDuration : null;

  if (duration) {
    const maxStart = Math.max(duration - 60, 0);
    const start = Math.min((index * 97) % (maxStart + 1), maxStart);
    return { start, end: start + 60 };
  }

  const start = (index * 127) % 1200;
  return { start, end: start + 60 };
};

const buildTrimmedUrl = (source, start, end) => {
  if (source?.videoId) {
    return `https://www.youtube.com/watch?v=${source.videoId}&start=${start}&end=${end}`;
  }

  if (!source?.url) return '';

  try {
    const url = new URL(source.url);
    url.searchParams.set('start', String(start));
    url.searchParams.set('end', String(end));
    return url.toString();
  } catch {
    return source.url;
  }
};

const run = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(mongoUri);

  const user = await pickCurrentUser();
  if (!user) {
    throw new Error('No target user found. Pass --email=<email> or --userId=<id>.');
  }

  const course = await Course.findOne({
    category: 'Web Development',
    isActive: true,
    isPublished: true,
    isDeleted: false,
  }).sort({ createdAt: -1 }).lean();

  if (!course) {
    throw new Error('Web Development course not found');
  }

  const videos = course.resources?.videos || [];
  if (!videos.length) {
    throw new Error('Web Development course has no videos to extract clips from');
  }

  const topics = buildTopicCandidatesFromCourse(course);

  const chapterTopics = buildChapterTopicsFromVideos(videos);

  if (topics.length < REQUIRED_TOPIC_COUNT && chapterTopics.length >= REQUIRED_TOPIC_COUNT) {
    topics.splice(0, topics.length, ...chapterTopics);
  }

  if (topics.length < REQUIRED_TOPIC_COUNT) {
    throw new Error(`Insufficient real chapter/topic data in course. Found ${topics.length}, required ${REQUIRED_TOPIC_COUNT}. Add syllabus entries or chapter mappings for available course videos.`);
  }

  const topicKeys = topics.map((topic) => topic.topicKey);

  const existing = await Reel.find({
    userId: user._id,
    sourceCourseId: course._id,
    topicKey: { $in: topicKeys },
    isDeleted: false,
  }).select('topicKey').lean();

  const existingKeys = new Set(existing.map((item) => item.topicKey));

  const docs = topics
    .map((topic, index) => ({ topic, index, topicKey: topic.topicKey }))
    .filter(({ topicKey }) => !existingKeys.has(topicKey))
    .map(({ topic, index, topicKey }) => {
      const source = topic.videoId
        ? videos.find((video) => video.videoId === topic.videoId) || videos[index % videos.length]
        : videos[index % videos.length];
      const clipWindow = topic.start !== undefined && topic.end !== undefined
        ? { start: topic.start, end: topic.end }
        : buildClipWindow(source, index);
      const { start, end } = clipWindow;
      const title = topic.concept;
      const hookText = `Understand ${title} in 60 seconds.`;
      const caption = `${hookText} One concept, one quick win from ${course.title}.`;

      return {
        userId: user._id,
        title,
        caption,
        description: caption,
        hookText,
        subtitleText: `[CC] ${title}: concise concept explanation and practical use-case.`,
        videoUrl: buildTrimmedUrl(source, start, end),
        duration: 60,
        clipStartSeconds: start,
        clipEndSeconds: end,
        category: 'Web Development',
        tags: topic.tags,
        courseLink: '/courses',
        sourceCourseId: course._id,
        sourceCourseTitle: course.title,
        sourceVideoId: source.videoId || null,
        topicKey,
        isPublished: true,
        createdBy: user._id,
        updatedBy: user._id,
      };
    });

  if (docs.length) {
    await Reel.insertMany(docs, { ordered: false });
  }

  console.log(`Target user: ${user.email} (${user._id})`);
  console.log(`Course: ${course.title} (${course._id})`);
  console.log(`Resolved real topics: ${topics.length}`);
  console.log(`Inserted reels: ${docs.length}`);
  console.log(`Skipped existing: ${topics.length - docs.length}`);

  await mongoose.disconnect();
};

run()
  .then(() => {
    console.log('Internal one-time reel population completed.');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Internal reel population failed:', error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // no-op
    }
    process.exit(1);
  });
