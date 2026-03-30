import Showcase from '../models/Showcase.js';
import axios from 'axios';

// Get user's showcase profile
export const getShowcase = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    let showcase = await Showcase.findOne({ userId });
    
    if (!showcase) {
      // Create default showcase if it doesn't exist
      showcase = await Showcase.create({ userId });
    }
    
    res.status(200).json({
      success: true,
      data: showcase
    });
  } catch (error) {
    console.error('Error fetching showcase:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch showcase profile',
      error: error.message
    });
  }
};

// Connect and sync GitHub account
export const connectGithub = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username is required'
      });
    }
    
    // Fetch GitHub profile data using public API (no auth required)
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
    const profileData = profileResponse.data;
    
    // Fetch repositories to calculate total stars
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = reposResponse.data;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    // Get top languages
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))].slice(0, 5);
    
    // Update or create showcase
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      {
        userId,
        github: {
          connected: true,
          username: profileData.login,
          profileUrl: profileData.html_url,
          avatarUrl: profileData.avatar_url,
          bio: profileData.bio || '',
          publicRepos: profileData.public_repos,
          totalStars,
          followers: profileData.followers,
          following: profileData.following,
          topLanguages: languages,
          lastSynced: new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'GitHub account connected successfully',
      data: showcase
    });
  } catch (error) {
    console.error('Error connecting GitHub:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to connect GitHub account',
      error: error.message
    });
  }
};

// Connect LinkedIn account
export const connectLinkedIn = async (req, res) => {
  try {
    const { profileUrl, headline } = req.body;
    const userId = req.user._id;
    
    if (!profileUrl) {
      return res.status(400).json({
        success: false,
        message: 'LinkedIn profile URL is required'
      });
    }
    
    // Update showcase with LinkedIn info
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      {
        userId,
        linkedin: {
          connected: true,
          profileUrl,
          headline: headline || '',
          lastSynced: new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'LinkedIn account connected successfully',
      data: showcase
    });
  } catch (error) {
    console.error('Error connecting LinkedIn:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect LinkedIn account',
      error: error.message
    });
  }
};

// Connect and sync LeetCode account
export const connectLeetCode = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'LeetCode username is required'
      });
    }
    
    // Fetch LeetCode data using public GraphQL API
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
    
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });
    
    const userData = response.data.data.matchedUser;
    
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'LeetCode user not found'
      });
    }
    
    const submitStats = userData.submitStats.acSubmissionNum;
    const totalSolved = submitStats.find(s => s.difficulty === 'All')?.count || 0;
    const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0;
    
    // Update showcase
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      {
        userId,
        leetcode: {
          connected: true,
          username: userData.username,
          profileUrl: `https://leetcode.com/${userData.username}`,
          ranking: userData.profile?.ranking || 0,
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          acceptanceRate: totalSolved > 0 ? ((totalSolved / 3000) * 100).toFixed(2) : 0,
          lastSynced: new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'LeetCode account connected successfully',
      data: showcase
    });
  } catch (error) {
    console.error('Error connecting LeetCode:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect LeetCode account. Make sure the username is correct.',
      error: error.message
    });
  }
};

// Disconnect a platform
export const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user._id;
    
    if (!['github', 'linkedin', 'leetcode'].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform'
      });
    }
    
    const updateData = {};
    updateData[`${platform}.connected`] = false;
    
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: `${platform} disconnected successfully`,
      data: showcase
    });
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect platform',
      error: error.message
    });
  }
};

// Refresh/sync platform data
export const refreshPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user._id;
    
    const showcase = await Showcase.findOne({ userId });
    
    if (!showcase) {
      return res.status(404).json({
        success: false,
        message: 'Showcase not found'
      });
    }
    
    // Re-sync based on platform
    if (platform === 'github' && showcase.github.connected) {
      const username = showcase.github.username;
      return connectGithub({ body: { username }, user: req.user }, res);
    } else if (platform === 'leetcode' && showcase.leetcode.connected) {
      const username = showcase.leetcode.username;
      return connectLeetCode({ body: { username }, user: req.user }, res);
    }
    
    res.status(400).json({
      success: false,
      message: 'Platform not connected or invalid'
    });
  } catch (error) {
    console.error('Error refreshing platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh platform data',
      error: error.message
    });
  }
};

// Update visibility settings
export const updateVisibility = async (req, res) => {
  try {
    const { github, linkedin, leetcode } = req.body;
    const userId = req.user._id;
    
    const showcase = await Showcase.findOneAndUpdate(
      { userId },
      {
        visibility: {
          github: github !== undefined ? github : true,
          linkedin: linkedin !== undefined ? linkedin : true,
          leetcode: leetcode !== undefined ? leetcode : true
        }
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Visibility settings updated',
      data: showcase
    });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visibility settings',
      error: error.message
    });
  }
};
