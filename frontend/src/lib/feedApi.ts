import apiClient from '@/lib/apiClient';

export interface User {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface MediaUrl {
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface PostComment {
  _id: string;
  text: string;
  createdAt: string;
  user: User | null;
}

export interface Post {
  _id: string;
  caption?: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrls: MediaUrl[];
  category: 'general' | 'achievement' | 'project' | 'learning' | 'career' | 'question' | 'tip';
  tags: string[];
  createdAt: string;
  user: User | null;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  comments: PostComment[];
  isLiked: boolean;
  isSaved: boolean;
  isPinned: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface FeedResponse {
  data: Post[];
  pagination: Pagination;
}

/**
 * Get feed posts with pagination
 */
export const fetchPostsFeed = async (page = 1, limit = 10, category?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (category && category !== 'all') {
    params.append('category', category);
  }

  const response = await apiClient.get(`/posts/feed?${params.toString()}`);
  return response.data as FeedResponse;
};

/**
 * Get current user's posts
 */
export const fetchMyPosts = async () => {
  const response = await apiClient.get('/posts/me');
  return response.data;
};

/**
 * Get posts by specific user
 */
export const fetchPostsByUser = async (userId: string) => {
  const response = await apiClient.get(`/posts/user/${userId}`);
  return response.data;
};

/**
 * Get single post
 */
export const fetchPost = async (postId: string) => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

/**
 * Create a new post
 */
export const createPost = async (data: {
  caption?: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrls?: MediaUrl[];
  category?: string;
  tags?: string[];
}) => {
  const response = await apiClient.post('/posts', data);
  return response.data;
};

/**
 * Toggle like on a post
 */
export const likePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
};

/**
 * Toggle save on a post
 */
export const savePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/save`);
  return response.data;
};

/**
 * Add comment to a post
 */
export const commentOnPost = async (postId: string, text: string) => {
  const response = await apiClient.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

/**
 * Track post share
 */
export const sharePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/share`);
  return response.data;
};

/**
 * Track post view
 */
export const viewPost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/view`);
  return response.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string) => {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
};

/**
 * Get available post categories
 */
export const fetchPostCategories = async () => {
  const response = await apiClient.get('/posts/categories');
  return response.data;
};

/**
 * Upload reel video file
 */
export const uploadReelVideo = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await apiClient.post('/posts/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(progress);
      }
    }
  });
  return response.data;
};
