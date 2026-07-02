import { apiClient } from './apiClient';

export type PlatformId =
  | 'github' | 'linkedin' | 'leetcode' | 'codeforces' | 'hackerrank'
  | 'stackoverflow' | 'devto' | 'portfolio' | 'codepen';

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
    lastSynced?: Date;
  };
  visibility: Record<PlatformId, boolean>;
}

export interface ShowcaseStats {
  connected: number;
  total: number;
  score: number;
  platforms: PlatformId[];
}

interface ShowcaseResponse {
  success: boolean;
  data: ShowcaseData;
  message?: string;
}

export const getShowcase = async (userId?: any): Promise<ShowcaseData> => {
  const url = typeof userId === 'string' && userId.trim().length > 0 && userId !== '[object Object]' ? `/showcase/${userId.trim()}` : '/showcase';
  const response = await apiClient.get<ShowcaseResponse>(url);
  return response.data.data;
};

export const getShowcaseStats = async (): Promise<ShowcaseStats> => {
  const response = await apiClient.get<{ success: boolean; data: ShowcaseStats }>('/showcase/stats');
  return response.data.data;
};

export const connectGithub = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/github', { username });
  return response.data.data;
};

export const connectLinkedIn = async (profileUrl: string, headline?: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/linkedin', { profileUrl, headline });
  return response.data.data;
};

export const connectLeetCode = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/leetcode', { username });
  return response.data.data;
};

export const connectCodeforces = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/codeforces', { username });
  return response.data.data;
};

export const connectHackerrank = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/hackerrank', { username });
  return response.data.data;
};

export const connectStackoverflow = async (userId: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/stackoverflow', { userId });
  return response.data.data;
};

export const connectDevto = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/devto', { username });
  return response.data.data;
};

export const connectPortfolio = async (websiteUrl: string, title?: string, description?: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/portfolio', { websiteUrl, title, description });
  return response.data.data;
};

export const connectCodepen = async (username: string) => {
  const response = await apiClient.post<ShowcaseResponse>('/showcase/connect/codepen', { username });
  return response.data.data;
};

export const disconnectPlatform = async (platform: PlatformId) => {
  const response = await apiClient.delete<ShowcaseResponse>(`/showcase/disconnect/${platform}`);
  return response.data.data;
};

export const refreshPlatform = async (platform: PlatformId) => {
  const response = await apiClient.post<ShowcaseResponse>(`/showcase/refresh/${platform}`);
  return response.data.data;
};

export const updateVisibility = async (visibility: Partial<Record<PlatformId, boolean>>) => {
  const response = await apiClient.patch<ShowcaseResponse>('/showcase/visibility', visibility);
  return response.data.data;
};

/** Parse username or full profile URL on the client before sending */
export const parseConnectInput = (platform: PlatformId, input: string): string => {
  const trimmed = input.trim();
  const patterns: Partial<Record<PlatformId, RegExp>> = {
    github: /github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)/i,
    leetcode: /leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i,
    codeforces: /codeforces\.com\/profile\/([a-zA-Z0-9_.-]+)/i,
    hackerrank: /hackerrank\.com\/([a-zA-Z0-9_-]+)/i,
    stackoverflow: /stackoverflow\.com\/users\/(\d+)/i,
    devto: /dev\.to\/([a-zA-Z0-9_-]+)/i,
    codepen: /codepen\.io\/([a-zA-Z0-9_-]+)/i,
  };
  const match = patterns[platform]?.exec(trimmed);
  if (match) return match[1];
  return trimmed.replace(/^@/, '').replace(/\/$/, '');
};
