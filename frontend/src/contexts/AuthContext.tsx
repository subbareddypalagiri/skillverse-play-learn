import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiClient, setTokenGetter } from '@/lib/apiClient';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

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
  const { isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  // Register token getter for axios request interceptor
  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync session with backend
  const syncUserSession = useCallback(async () => {
    if (!isSignedIn) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const clerkToken = await getToken();
      if (clerkToken) {
        setToken(clerkToken);
        localStorage.setItem('token', clerkToken);

        // Set authorization header temporarily for the sync request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${clerkToken}`;

        const response = await apiClient.post('/auth/sync');
        if (response.data.success && response.data.data.user) {
          const mongoUser = response.data.data.user;
          setUser(mongoUser);
          localStorage.setItem('user', JSON.stringify(mongoUser));
        }
      }
    } catch (err) {
      console.error('Error syncing Clerk user with backend:', err);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    syncUserSession();
  }, [isSignedIn, clerkUser, syncUserSession]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
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
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  // Stub login to avoid compile errors on existing files that import it
  const login = useCallback((newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }, []);

  const checkAuth = useCallback(async () => {
    await syncUserSession();
  }, [syncUserSession]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const clerkToken = await getToken({ skipCache: true });
      if (clerkToken) {
        setToken(clerkToken);
        localStorage.setItem('token', clerkToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${clerkToken}`;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [getToken]);

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
