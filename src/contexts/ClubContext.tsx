import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ClubMember {
  userId: string;
  userName: string;
  role: 'admin' | 'moderator' | 'member';
  joinedDate: string;
}

export interface ClubPost {
  id: string;
  clubId: string;
  userId: string;
  userName: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: Array<{ userId: string; userName: string; text: string; timestamp: string }>;
  timestamp: string;
}

export interface Club {
  id: string;
  name: string;
  category: 'hobby' | 'club';
  type: string; // 'art', 'music', 'sports', 'tech', etc.
  description: string;
  coverImage: string;
  adminId: string;
  adminName: string;
  members: ClubMember[];
  posts: ClubPost[];
  createdDate: string;
  isActive: boolean;
}

interface ClubContextType {
  clubs: Club[];
  createClub: (club: Omit<Club, 'id' | 'members' | 'posts' | 'createdDate'>) => void;
  joinClub: (clubId: string, userId: string, userName: string) => void;
  leaveClub: (clubId: string, userId: string) => void;
  addPost: (clubId: string, post: Omit<ClubPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  likePost: (clubId: string, postId: string) => void;
  addComment: (clubId: string, postId: string, comment: { userId: string; userName: string; text: string }) => void;
  promoteToAdmin: (clubId: string, userId: string) => void;
  getUserClubs: (userId: string) => Club[];
  isUserMember: (clubId: string, userId: string) => boolean;
  isUserAdmin: (clubId: string, userId: string) => boolean;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

// Default example clubs for demonstration
const defaultClubs: Club[] = [
  {
    id: 'club1',
    name: 'Digital Art Masters',
    category: 'hobby',
    type: 'art',
    description: 'Join fellow artists to share digital artwork, learn new techniques, and participate in weekly art challenges. Perfect for beginners and pros!',
    coverImage: '',
    adminId: 'admin1',
    adminName: 'Sarah Johnson',
    members: [
      { userId: 'admin1', userName: 'Sarah Johnson', role: 'admin', joinedDate: new Date('2024-01-01').toISOString() },
      { userId: 'user2', userName: 'Mike Chen', role: 'member', joinedDate: new Date('2024-01-05').toISOString() },
      { userId: 'user3', userName: 'Emily Davis', role: 'member', joinedDate: new Date('2024-01-10').toISOString() },
      { userId: 'user4', userName: 'Alex Kumar', role: 'member', joinedDate: new Date('2024-01-15').toISOString() },
    ],
    posts: [
      {
        id: 'post1',
        clubId: 'club1',
        userId: 'admin1',
        userName: 'Sarah Johnson',
        content: 'Welcome to Digital Art Masters! Share your artwork and let\'s grow together! 🎨',
        likes: 12,
        comments: [
          { userId: 'user2', userName: 'Mike Chen', text: 'Excited to be here!', timestamp: new Date('2024-01-05').toISOString() }
        ],
        timestamp: new Date('2024-01-01').toISOString(),
      }
    ],
    createdDate: new Date('2024-01-01').toISOString(),
    isActive: true,
  },
  {
    id: 'club2',
    name: 'Code Warriors',
    category: 'club',
    type: 'tech',
    description: 'Competitive programming club for coding enthusiasts. Practice algorithms, participate in hackathons, and prepare for coding interviews together!',
    coverImage: '',
    adminId: 'admin2',
    adminName: 'David Lee',
    members: [
      { userId: 'admin2', userName: 'David Lee', role: 'admin', joinedDate: new Date('2024-01-02').toISOString() },
      { userId: 'user5', userName: 'Priya Sharma', role: 'member', joinedDate: new Date('2024-01-06').toISOString() },
      { userId: 'user6', userName: 'James Wilson', role: 'member', joinedDate: new Date('2024-01-08').toISOString() },
      { userId: 'user7', userName: 'Lisa Wang', role: 'member', joinedDate: new Date('2024-01-12').toISOString() },
      { userId: 'user8', userName: 'Ryan Patel', role: 'member', joinedDate: new Date('2024-01-14').toISOString() },
    ],
    posts: [
      {
        id: 'post2',
        clubId: 'club2',
        userId: 'admin2',
        userName: 'David Lee',
        content: 'Weekly coding challenge: Solve the longest palindrome substring problem! Share your solutions below 💻',
        likes: 8,
        comments: [],
        timestamp: new Date('2024-01-03').toISOString(),
      }
    ],
    createdDate: new Date('2024-01-02').toISOString(),
    isActive: true,
  },
  {
    id: 'club3',
    name: 'Campus Musicians',
    category: 'hobby',
    type: 'music',
    description: 'For all music lovers! Share covers, originals, collaborate on projects, and organize jam sessions. All instruments and skill levels welcome! 🎵',
    coverImage: '',
    adminId: 'admin3',
    adminName: 'Jessica Brown',
    members: [
      { userId: 'admin3', userName: 'Jessica Brown', role: 'admin', joinedDate: new Date('2024-01-03').toISOString() },
      { userId: 'user9', userName: 'Tom Anderson', role: 'member', joinedDate: new Date('2024-01-07').toISOString() },
      { userId: 'user10', userName: 'Sophie Martin', role: 'member', joinedDate: new Date('2024-01-09').toISOString() },
    ],
    posts: [
      {
        id: 'post3',
        clubId: 'club3',
        userId: 'user9',
        userName: 'Tom Anderson',
        content: 'Just finished my guitar cover of Wonderwall! Who wants to jam this weekend? 🎸',
        likes: 15,
        comments: [
          { userId: 'admin3', userName: 'Jessica Brown', text: 'Great cover! I\'m in for the jam!', timestamp: new Date('2024-01-08').toISOString() }
        ],
        timestamp: new Date('2024-01-07').toISOString(),
      }
    ],
    createdDate: new Date('2024-01-03').toISOString(),
    isActive: true,
  },
  {
    id: 'club4',
    name: 'Fitness Freaks',
    category: 'club',
    type: 'sports',
    description: 'Stay fit together! Group workouts, running clubs, sports activities, and fitness challenges. Let\'s achieve our health goals as a team! 💪',
    coverImage: '',
    adminId: 'admin4',
    adminName: 'Mark Thompson',
    members: [
      { userId: 'admin4', userName: 'Mark Thompson', role: 'admin', joinedDate: new Date('2024-01-04').toISOString() },
      { userId: 'user11', userName: 'Anna Garcia', role: 'member', joinedDate: new Date('2024-01-08').toISOString() },
      { userId: 'user12', userName: 'Chris Evans', role: 'member', joinedDate: new Date('2024-01-10').toISOString() },
      { userId: 'user13', userName: 'Nina Patel', role: 'member', joinedDate: new Date('2024-01-11').toISOString() },
    ],
    posts: [],
    createdDate: new Date('2024-01-04').toISOString(),
    isActive: true,
  },
  {
    id: 'club5',
    name: 'Photography Club',
    category: 'hobby',
    type: 'photography',
    description: 'Capture moments, tell stories! Share your photos, learn techniques, participate in photo walks, and compete in monthly challenges 📸',
    coverImage: '',
    adminId: 'admin5',
    adminName: 'Rachel Green',
    members: [
      { userId: 'admin5', userName: 'Rachel Green', role: 'admin', joinedDate: new Date('2024-01-05').toISOString() },
      { userId: 'user14', userName: 'Kevin Zhang', role: 'member', joinedDate: new Date('2024-01-09').toISOString() },
    ],
    posts: [
      {
        id: 'post4',
        clubId: 'club5',
        userId: 'admin5',
        userName: 'Rachel Green',
        content: 'Monthly theme: Urban Architecture! Share your best shots by month end. Winner gets featured! 📷',
        likes: 6,
        comments: [],
        timestamp: new Date('2024-01-05').toISOString(),
      }
    ],
    createdDate: new Date('2024-01-05').toISOString(),
    isActive: true,
  },
  {
    id: 'club6',
    name: 'Book Worms',
    category: 'hobby',
    type: 'reading',
    description: 'Monthly book club for avid readers! Discuss literature, share recommendations, and participate in reading challenges. Currently reading: "1984" 📚',
    coverImage: '',
    adminId: 'admin6',
    adminName: 'Oliver Smith',
    members: [
      { userId: 'admin6', userName: 'Oliver Smith', role: 'admin', joinedDate: new Date('2024-01-06').toISOString() },
      { userId: 'user15', userName: 'Emma Watson', role: 'member', joinedDate: new Date('2024-01-11').toISOString() },
      { userId: 'user16', userName: 'Noah Kim', role: 'member', joinedDate: new Date('2024-01-13').toISOString() },
    ],
    posts: [],
    createdDate: new Date('2024-01-06').toISOString(),
    isActive: true,
  },
  {
    id: 'club7',
    name: 'Gamers United',
    category: 'hobby',
    type: 'gaming',
    description: 'For all gaming enthusiasts! Discuss games, organize tournaments, team up for multiplayer, and share gaming tips. All platforms welcome! 🎮',
    coverImage: '',
    adminId: 'admin7',
    adminName: 'Tyler Rodriguez',
    members: [
      { userId: 'admin7', userName: 'Tyler Rodriguez', role: 'admin', joinedDate: new Date('2024-01-07').toISOString() },
      { userId: 'user17', userName: 'Maya Lopez', role: 'member', joinedDate: new Date('2024-01-12').toISOString() },
      { userId: 'user18', userName: 'Jake Miller', role: 'member', joinedDate: new Date('2024-01-14').toISOString() },
      { userId: 'user19', userName: 'Zoe Taylor', role: 'member', joinedDate: new Date('2024-01-15').toISOString() },
      { userId: 'user20', userName: 'Ethan Clark', role: 'member', joinedDate: new Date('2024-01-16').toISOString() },
    ],
    posts: [
      {
        id: 'post5',
        clubId: 'club7',
        userId: 'admin7',
        userName: 'Tyler Rodriguez',
        content: 'Organizing a Valorant tournament this weekend! Sign up your teams below! 🎮',
        likes: 10,
        comments: [
          { userId: 'user17', userName: 'Maya Lopez', text: 'Count me in!', timestamp: new Date('2024-01-13').toISOString() },
          { userId: 'user18', userName: 'Jake Miller', text: 'My team is ready!', timestamp: new Date('2024-01-14').toISOString() }
        ],
        timestamp: new Date('2024-01-12').toISOString(),
      }
    ],
    createdDate: new Date('2024-01-07').toISOString(),
    isActive: true,
  },
];

export const ClubProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem('clubs');
    if (saved) {
      return JSON.parse(saved);
    }
    // Return default clubs if nothing in localStorage
    return defaultClubs;
  });

  useEffect(() => {
    localStorage.setItem('clubs', JSON.stringify(clubs));
  }, [clubs]);

  const createClub = (clubData: Omit<Club, 'id' | 'members' | 'posts' | 'createdDate'>) => {
    const newClub: Club = {
      ...clubData,
      id: Date.now().toString(),
      members: [{
        userId: clubData.adminId,
        userName: clubData.adminName,
        role: 'admin',
        joinedDate: new Date().toISOString(),
      }],
      posts: [],
      createdDate: new Date().toISOString(),
    };
    setClubs(prev => [...prev, newClub]);
  };

  const joinClub = (clubId: string, userId: string, userName: string) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        const alreadyMember = club.members.some(m => m.userId === userId);
        if (alreadyMember) return club;
        
        return {
          ...club,
          members: [...club.members, {
            userId,
            userName,
            role: 'member' as const,
            joinedDate: new Date().toISOString(),
          }],
        };
      }
      return club;
    }));
  };

  const leaveClub = (clubId: string, userId: string) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          members: club.members.filter(m => m.userId !== userId),
        };
      }
      return club;
    }));
  };

  const addPost = (clubId: string, post: Omit<ClubPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        const newPost: ClubPost = {
          ...post,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: [],
        };
        return {
          ...club,
          posts: [newPost, ...club.posts],
        };
      }
      return club;
    }));
  };

  const likePost = (clubId: string, postId: string) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          posts: club.posts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          ),
        };
      }
      return club;
    }));
  };

  const addComment = (clubId: string, postId: string, comment: { userId: string; userName: string; text: string }) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          posts: club.posts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  comments: [...post.comments, { ...comment, timestamp: new Date().toISOString() }],
                }
              : post
          ),
        };
      }
      return club;
    }));
  };

  const promoteToAdmin = (clubId: string, userId: string) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          members: club.members.map(member =>
            member.userId === userId ? { ...member, role: 'admin' as const } : member
          ),
        };
      }
      return club;
    }));
  };

  const getUserClubs = (userId: string) => {
    return clubs.filter(club => club.members.some(m => m.userId === userId));
  };

  const isUserMember = (clubId: string, userId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.members.some(m => m.userId === userId) : false;
  };

  const isUserAdmin = (clubId: string, userId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.members.some(m => m.userId === userId && m.role === 'admin') : false;
  };

  return (
    <ClubContext.Provider
      value={{
        clubs,
        createClub,
        joinClub,
        leaveClub,
        addPost,
        likePost,
        addComment,
        promoteToAdmin,
        getUserClubs,
        isUserMember,
        isUserAdmin,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClubs = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClubs must be used within ClubProvider');
  }
  return context;
};
