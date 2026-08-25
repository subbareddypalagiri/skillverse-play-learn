/**
 * API Utility Functions
 * Centralized API calls for the application
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Clear the authentication token
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Make API requests with proper headers and error handling
 */
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ============= USER API CALLS =============

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  hobbies?: string[];
  skills?: string[];
  linkedIn?: string;
  github?: string;
  leetcode?: string;
  codeforces?: string;
  codechef?: string;
  hackerrank?: string;
  kaggle?: string;
  behance?: string;
  dribbble?: string;
  soundcloud?: string;
  youtube?: string;
  instagram?: string;
  githubStats?: {
    repos: number;
    stars: number;
    followers: number;
    contributions: number;
  };
  leetcodeStats?: {
    solved: number;
    ranking: number;
    badges: string[];
  };
  followers?: number;
  following?: number;
  totalLikes?: number;
}

import apiClient from '@/lib/apiClient';

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/auth/me');
  return response.data?.data?.user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await apiClient.patch('/auth/me', profileData);
  return response.data?.data?.user;
};

/**
 * User login
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: UserProfile; token: string }> => {
  const response = await apiCall<{ user: UserProfile; token: string }>(
    '/auth/login',
    'POST',
    { email, password }
  );
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response.data!;
};

/**
 * User registration
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: UserProfile; token: string }> => {
  const response = await apiCall<{ user: UserProfile; token: string }>(
    '/auth/register',
    'POST',
    { name, email, password }
  );
  if (response.data?.token) {
    setAuthToken(response.data.token);
  }
  return response.data!;
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return !!getAuthToken();
};
