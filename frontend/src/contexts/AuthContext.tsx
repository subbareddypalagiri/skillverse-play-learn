import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User, refreshToken?: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Ignore logout API errors — we clear local state regardless
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('enrolledCourses');
      localStorage.removeItem('enrolledExams');
      localStorage.removeItem('registeredEventIds');
      localStorage.removeItem('careerHubCheckedSkills');
      localStorage.removeItem('videoProgress');
      localStorage.removeItem('clubs');
      localStorage.removeItem('socialPosts');
      localStorage.removeItem('userProfile');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    } catch {
      // Token invalid/expired — try refresh
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        await logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout, refreshAccessToken]);

  // Restore auth state on mount and validate with server
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch {
        // Corrupted localStorage data — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Validate token with server after initial restore
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken: string, userData: User, refreshToken?: string) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkAuth, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
