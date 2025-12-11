import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  importFromPlatform: (platform: string, username: string) => Promise<void>;
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

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...profile } : null);
  };

  const importFromPlatform = async (platform: string, username: string) => {
    // In production, this would call actual APIs
    // For now, simulate API call
    console.log(`Importing from ${platform} for user ${username}`);
    
    // Simulated data import
    if (platform === 'github') {
      updateProfile({
        github: `https://github.com/${username}`,
        githubStats: {
          repos: 45,
          stars: 234,
          followers: 123,
          contributions: 1547,
        }
      });
    } else if (platform === 'leetcode') {
      updateProfile({
        leetcode: `https://leetcode.com/${username}`,
        leetcodeStats: {
          solved: 456,
          ranking: 12345,
          badges: ['50 Days Badge', 'Annual Badge 2024'],
        }
      });
    }
  };

  return (
    <SocialContext.Provider
      value={{
        posts,
        userProfile,
        addPost,
        likePost,
        addComment,
        updateProfile,
        importFromPlatform,
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
