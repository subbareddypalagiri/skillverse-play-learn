import apiClient from '@/lib/apiClient';

export type FeedMode = 'latest' | 'trending' | 'recommended';

export interface ReelCreator {
  _id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  followersCount: number;
  isFollowing: boolean;
}

export interface ReelItem {
  _id: string;
  title: string;
  caption?: string;
  description?: string;
  category?: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  courseLink?: string | null;
  sourceCourseId?: string | null;
  sourceCourseTitle?: string | null;
  createdAt: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  creator: ReelCreator | null;
  isLiked: boolean;
  isSaved: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface FeedResponse {
  data: ReelItem[];
  pagination: Pagination;
}

export const fetchReelsFeed = async (params: {
  page?: number;
  limit?: number;
  mode?: FeedMode;
  category?: string;
  tag?: string;
}): Promise<FeedResponse> => {
  const response = await apiClient.get('/reels/feed', { params });
  return {
    data: response.data.data,
    pagination: response.data.pagination
  };
};

export const fetchMyReels = async (): Promise<ReelItem[]> => {
  const response = await apiClient.get('/reels/me');
  return response.data.data.reels || [];
};

export const fetchReelsByUser = async (userId: string): Promise<ReelItem[]> => {
  const response = await apiClient.get(`/reels/user/${userId}`);
  return response.data.data.reels || [];
};

export const fetchReelCategories = async (): Promise<string[]> => {
  const response = await apiClient.get('/reels/categories');
  return response.data.data.categories || [];
};

export const getCloudinarySignature = async () => {
  const response = await apiClient.get('/reels/upload-signature');
  return response.data;
};

export const uploadReelDirect = async (payload: {
  videoUrl: string;
  title: string;
  caption?: string;
  description?: string;
  category: string;
  tags?: string;
  duration: number;
  thumbnailUrl?: string;
  videoSize?: number;
  courseLink?: string;
  sourceCourseTitle?: string;
}) => {
  const response = await apiClient.post('/reels', payload);
  return response.data.data.reel as ReelItem;
};

export const uploadReel = async (payload: {
  video: File;
  title: string;
  caption?: string;
  description?: string;
  category: string;
  tags?: string;
  duration: number;
  courseLink?: string;
  sourceCourseTitle?: string;
}) => {
  const formData = new FormData();
  formData.append('video', payload.video);
  formData.append('title', payload.title);
  formData.append('category', payload.category);
  formData.append('duration', String(payload.duration));

  if (payload.caption) formData.append('caption', payload.caption);
  if (payload.description) formData.append('description', payload.description);
  if (payload.tags) formData.append('tags', payload.tags);
  if (payload.courseLink) formData.append('courseLink', payload.courseLink);
  if (payload.sourceCourseTitle) formData.append('sourceCourseTitle', payload.sourceCourseTitle);

  const response = await apiClient.post('/reels', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.data.reel as ReelItem;
};

export const likeReel = async (reelId: string) => {
  const response = await apiClient.post(`/reels/${reelId}/like`);
  return response.data.data as { liked: boolean; likesCount: number };
};

export const saveReel = async (reelId: string) => {
  const response = await apiClient.post(`/reels/${reelId}/save`);
  return response.data.data as { saved: boolean; savesCount: number };
};

export const shareReel = async (reelId: string) => {
  const response = await apiClient.post(`/reels/${reelId}/share`);
  return response.data.data as { sharesCount: number };
};

export const followReelCreator = async (reelId: string) => {
  const response = await apiClient.post(`/reels/${reelId}/follow`);
  return response.data.data as {
    creatorId: string;
    isFollowing: boolean;
    followersCount: number;
  };
};

export const fetchReelComments = async (reelId: string) => {
  const response = await apiClient.get(`/reels/${reelId}/comments`);
  return response.data.data.comments || [];
};

export const commentOnReel = async (reelId: string, text: string) => {
  const response = await apiClient.post(`/reels/${reelId}/comments`, { text });
  return response.data.data;
};

export const trackReelView = async (reelId: string) => {
  await apiClient.post(`/reels/${reelId}/view`);
};
