import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { updateUserProfile, getUserProfile } from '@/utils/api';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'artwork' | 'music' | 'video' | 'travel' | 'achievement' | 'project';
  category: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  hobbies: string[];
  skills: string[];
  
  // External Platform Links
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
  
  // Achievement Stats
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
  
  // Portfolio
  posts: string[];
  achievements: string[];
  projects: string[];
  
  // Social
  followers: number;
  following: number;
  totalLikes: number;
}

interface SocialContextType {
  posts: Post[];
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  importFromPlatform: (platform: string, username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('socialPosts');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile from server on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUserProfile({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          bio: profile.bio || '',
          hobbies: profile.hobbies || [],
          skills: profile.skills || [],
          linkedIn: profile.linkedIn,
          github: profile.github,
          leetcode: profile.leetcode,
          codeforces: profile.codeforces,
          codechef: profile.codechef,
          hackerrank: profile.hackerrank,
          kaggle: profile.kaggle,
          behance: profile.behance,
          dribbble: profile.dribbble,
          soundcloud: profile.soundcloud,
          youtube: profile.youtube,
          instagram: profile.instagram,
          githubStats: profile.githubStats,
          leetcodeStats: profile.leetcodeStats,
          posts: [],
          achievements: [],
          projects: [],
          followers: profile.followers || 0,
          following: profile.following || 0,
          totalLikes: profile.totalLikes || 0,
        });
        setError(null);
      } catch (err) {
        console.log('Not authenticated, using local storage');
        // If API call fails, use local storage data
        const saved = localStorage.getItem('userProfile');
        if (saved) {
          setUserProfile(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('socialPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const addPost = (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const addComment = (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setPosts(prev => prev.map(post =>
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update on backend
      const updatedProfile = await updateUserProfile(profile);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      
      // Also update localStorage
      if (updatedProfile) {
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      console.error('Profile update error:', err);
      
      // Fallback: Update local state anyway for better UX
      setUserProfile(prev => prev ? { ...prev, ...profile } : null);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        bio: profile.bio || '',
        hobbies: profile.hobbies || [],
        skills: profile.skills || [],
        linkedIn: profile.linkedIn,
        github: profile.github,
        leetcode: profile.leetcode,
        codeforces: profile.codeforces,
        codechef: profile.codechef,
        hackerrank: profile.hackerrank,
        kaggle: profile.kaggle,
        behance: profile.behance,
        dribbble: profile.dribbble,
        soundcloud: profile.soundcloud,
        youtube: profile.youtube,
        instagram: profile.instagram,
        githubStats: profile.githubStats,
        leetcodeStats: profile.leetcodeStats,
        posts: [],
        achievements: [],
        projects: [],
        followers: profile.followers || 0,
        following: profile.following || 0,
        totalLikes: profile.totalLikes || 0,
      });
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(errorMsg);
      console.error('Refresh profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const importFromPlatform = async (platform: string, username: string) => {
    // In production, this would call actual APIs
    // For now, simulate API call
    console.log(`Importing from ${platform} for user ${username}`);
    
    // Simulated data import
    if (platform === 'github') {
      const updated = {
        github: `https://github.com/${username}`,
        githubStats: {
          repos: 45,
          stars: 234,
          followers: 123,
          contributions: 1547,
        }
      };
      await updateProfile(updated);
    } else if (platform === 'leetcode') {
      const updated = {
        leetcode: `https://leetcode.com/${username}`,
        leetcodeStats: {
          solved: 456,
          ranking: 12345,
          badges: ['50 Days Badge', 'Annual Badge 2024'],
        }
      };
      await updateProfile(updated);
    }
  };

  return (
    <SocialContext.Provider
      value={{
        posts,
        userProfile,
        loading,
        error,
        addPost,
        likePost,
        addComment,
        updateProfile,
        importFromPlatform,
        refreshProfile,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within SocialProvider');
  }
  return context;
};
