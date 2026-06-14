import Showcase from '../models/Showcase.js';
import {
  parsePlatformInput,
  PLATFORM_FETCHERS,
  ALL_PLATFORMS,
  fetchGithubProfile,
  fetchLeetCodeProfile,
} from '../services/showcaseConnectService.js';

const upsertShowcase = async (userId, platformData) => {
  const setFields = {};
  for (const [key, value] of Object.entries(platformData)) {
    setFields[key] = value;
  }
  return Showcase.findOneAndUpdate(
    { userId },
    { $set: { userId, ...setFields } },
    { upsert: true, new: true }
  );
};

export const getShowcase = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    let showcase = await Showcase.findOne({ userId });
    if (!showcase) showcase = await Showcase.create({ userId });
    res.status(200).json({ success: true, data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch showcase profile', error: error.message });
  }
};

const connectWithFetcher = (platform) => async (req, res) => {
  try {
    const userId = req.user._id;
    const parsed = parsePlatformInput(platform, req.body.username || req.body.profileUrl || req.body.userId || req.body.websiteUrl, req.body);
    if (!parsed) {
      return res.status(400).json({ success: false, message: 'Invalid input — enter username or profile URL' });
    }

    const fetcher = PLATFORM_FETCHERS[platform];
    const platformData = await fetcher(parsed);
    const showcase = await upsertShowcase(userId, { [platform]: platformData });

    res.status(200).json({
      success: true,
      message: `${platform} connected successfully`,
      data: showcase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || `Failed to connect ${platform}`,
      error: error.message,
    });
  }
};

export const connectGithub = async (req, res) => {
  try {
    const { username } = req.body;
    const parsed = parsePlatformInput('github', username);
    if (!parsed?.username) return res.status(400).json({ success: false, message: 'GitHub username is required' });
    const github = await fetchGithubProfile(parsed.username);
    const showcase = await upsertShowcase(req.user._id, { github });
    res.status(200).json({ success: true, message: 'GitHub connected', data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to connect GitHub' });
  }
};

export const connectLinkedIn = async (req, res) => {
  try {
    const parsed = parsePlatformInput('linkedin', req.body.profileUrl, { headline: req.body.headline });
    if (!parsed?.profileUrl) return res.status(400).json({ success: false, message: 'LinkedIn profile URL is required' });
    const linkedin = {
      connected: true,
      profileUrl: parsed.profileUrl,
      headline: parsed.headline || req.body.headline || '',
      lastSynced: new Date(),
    };
    const showcase = await upsertShowcase(req.user._id, { linkedin });
    res.status(200).json({ success: true, message: 'LinkedIn connected', data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to connect LinkedIn' });
  }
};

export const connectLeetCode = async (req, res) => {
  try {
    const parsed = parsePlatformInput('leetcode', req.body.username);
    if (!parsed?.username) return res.status(400).json({ success: false, message: 'LeetCode username is required' });
    const leetcode = await fetchLeetCodeProfile(parsed.username);
    const showcase = await upsertShowcase(req.user._id, { leetcode });
    res.status(200).json({ success: true, message: 'LeetCode connected', data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to connect LeetCode' });
  }
};

export const connectCodeforces = connectWithFetcher('codeforces');
export const connectHackerrank = connectWithFetcher('hackerrank');
export const connectStackoverflow = connectWithFetcher('stackoverflow');
export const connectDevto = connectWithFetcher('devto');
export const connectCodepen = connectWithFetcher('codepen');

export const connectPortfolio = async (req, res) => {
  try {
    const parsed = parsePlatformInput('portfolio', req.body.websiteUrl, {
      title: req.body.title,
      description: req.body.description,
    });
    if (!parsed?.websiteUrl) return res.status(400).json({ success: false, message: 'Website URL is required' });
    const portfolio = {
      connected: true,
      websiteUrl: parsed.websiteUrl,
      title: parsed.title || '',
      description: parsed.description || '',
    };
    const showcase = await upsertShowcase(req.user._id, { portfolio });
    res.status(200).json({ success: true, message: 'Portfolio connected', data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to connect portfolio' });
  }
};

export const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    if (!ALL_PLATFORMS.includes(platform)) {
      return res.status(400).json({ success: false, message: 'Invalid platform' });
    }
    const showcase = await Showcase.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { [`${platform}.connected`]: false } },
      { new: true }
    );
    res.status(200).json({ success: true, message: `${platform} disconnected`, data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to disconnect platform' });
  }
};

export const refreshPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const showcase = await Showcase.findOne({ userId: req.user._id });
    if (!showcase?.[platform]?.connected) {
      return res.status(400).json({ success: false, message: 'Platform not connected' });
    }

    if (platform === 'linkedin' || platform === 'portfolio') {
      return res.status(200).json({ success: true, message: 'Profile link refreshed', data: showcase });
    }

    const data = showcase[platform];
    let parsed;
    if (platform === 'stackoverflow') parsed = { userId: data.userId };
    else if (platform === 'linkedin') parsed = { profileUrl: data.profileUrl };
    else parsed = { username: data.username };

    const fetcher = PLATFORM_FETCHERS[platform];
    if (!fetcher) {
      return res.status(200).json({ success: true, message: 'Profile saved', data: showcase });
    }

    const refreshed = await fetcher(parsed);
    const updated = await upsertShowcase(req.user._id, { [platform]: refreshed });
    res.status(200).json({ success: true, message: `${platform} refreshed`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to refresh' });
  }
};

export const updateVisibility = async (req, res) => {
  try {
    const userId = req.user._id;
    const current = await Showcase.findOne({ userId });
    const visibility = { ...(current?.visibility?.toObject?.() || current?.visibility || {}), ...req.body };
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      { $set: { visibility } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, message: 'Visibility updated', data: showcase });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update visibility' });
  }
};

export const getShowcaseStats = async (req, res) => {
  try {
    const showcase = await Showcase.findOne({ userId: req.user._id });
    if (!showcase) {
      return res.status(200).json({ success: true, data: { connected: 0, total: ALL_PLATFORMS.length, score: 0 } });
    }
    const connected = ALL_PLATFORMS.filter((p) => showcase[p]?.connected).length;
    let score = 0;
    if (showcase.github?.connected) score += Math.min(30, showcase.github.totalStars + showcase.github.publicRepos);
    if (showcase.leetcode?.connected) score += Math.min(25, showcase.leetcode.totalSolved);
    if (showcase.codeforces?.connected) score += Math.min(20, Math.floor((showcase.codeforces.rating || 0) / 100));
    if (showcase.hackerrank?.connected) score += Math.min(10, showcase.hackerrank.badges * 2);
    if (showcase.stackoverflow?.connected) score += Math.min(15, Math.floor((showcase.stackoverflow.reputation || 0) / 100));

    res.status(200).json({
      success: true,
      data: { connected, total: ALL_PLATFORMS.length, score, platforms: ALL_PLATFORMS.filter((p) => showcase[p]?.connected) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
};
