import { apiClient } from './apiClient';

export interface ShowcaseData {
  _id: string;
  userId: string;
  github: {
    connected: boolean;
    username: string;
    profileUrl: string;
    avatarUrl: string;
    bio: string;
    publicRepos: number;
    totalStars: number;
    followers: number;
    following: number;
    topLanguages: string[];
    lastSynced?: Date;
  };
  linkedin: {
    connected: boolean;
    profileUrl: string;
    headline: string;
    lastSynced?: Date;
  };
  leetcode: {
    connected: boolean;
    username: string;
    profileUrl: string;
    ranking: number;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    acceptanceRate: number;
    lastSynced?: Date;
  };
  codeforces: {
    connected: boolean;
    username: string;
    profileUrl: string;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
    contestsCount: number;
    lastSynced?: Date;
  };
  hackerrank: {
    connected: boolean;
    username: string;
    profileUrl: string;
    badges: number;
    points: number;
    solvedProblems: number;
    languages: string[];
    lastSynced?: Date;
  };
  stackoverflow: {
    connected: boolean;
    userId: string;
    profileUrl: string;
    reputation: number;
    badges: number;
    answers: number;
    displayName: string;
    lastSynced?: Date;
  };
  devto: {
    connected: boolean;
    username: string;
    profileUrl: string;
    articlesCount: number;
    followers: number;
    following: number;
    bio: string;
    lastSynced?: Date;
  };
  portfolio: {
    connected: boolean;
    websiteUrl: string;
    title: string;
    description: string;
  };
  codepen: {
    connected: boolean;
    username: string;
    profileUrl: string;
    pens: number;
    followers: number;
  };
  visibility: {
    github: boolean;
    linkedin: boolean;
    leetcode: boolean;
    codeforces: boolean;
    hackerrank: boolean;
    stackoverflow: boolean;
    devto: boolean;
    portfolio: boolean;
    codepen: boolean;
  };
}

export interface ShowcaseResponse {
  success: boolean;
  data: ShowcaseData;
  message?: string;
}

// Get user's showcase profile
export const getShowcase = async (userId?: string): Promise<ShowcaseData> => {
  const url = userId ? `/showcase/${userId}` : '/showcase';
  const response = await apiClient.get<ShowcaseResponse>(url);
  return response.data.data;
};

// Connect GitHub account
export const connectGithub = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/github', { username });
  return response.data.data;
};

// Connect LinkedIn account
export const connectLinkedIn = async (profileUrl: string, headline?: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/linkedin', {
    profileUrl,
    headline
  });
  return response.data.data;
};

// Connect LeetCode account
export const connectLeetCode = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/leetcode', { username });
  return response.data.data;
};

// Connect CodeForces account
export const connectCodeforces = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/codeforces', { username });
  return response.data.data;
};

// Connect HackerRank account
export const connectHackerrank = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/hackerrank', { username });
  return response.data.data;
};

// Connect Stack Overflow account
export const connectStackoverflow = async (userId: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/stackoverflow', { userId });
  return response.data.data;
};

// Connect Dev.to account
export const connectDevto = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/devto', { username });
  return response.data.data;
};

// Connect Portfolio website
export const connectPortfolio = async (websiteUrl: string, title?: string, description?: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/portfolio', {
    websiteUrl,
    title,
    description
  });
  return response.data.data;
};

// Connect Codepen account
export const connectCodepen = async (username: string): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/codepen', { username });
  return response.data.data;
};

// Disconnect a platform
export const disconnectPlatform = async (platform: 'github' | 'linkedin' | 'leetcode'): Promise<ShowcaseData> => {
  const response = await apiClient.delete<ShowcaseResponse>(`/showcase/disconnect/${platform}`);
  return response.data.data;
};

// Refresh platform data
export const refreshPlatform = async (platform: 'github' | 'linkedin' | 'leetcode'): Promise<ShowcaseData> => {
  const response = await apiClient.post<ShowcaseResponse>(`/showcase/refresh/${platform}`);
  return response.data.data;
};

// Update visibility settings
export const updateVisibility = async (visibility: {
  github?: boolean;
  linkedin?: boolean;
  leetcode?: boolean;
}): Promise<ShowcaseData> => {
  const response = await apiClient.patch<ShowcaseResponse>('/showcase/visibility', visibility);
  return response.data.data;
};
