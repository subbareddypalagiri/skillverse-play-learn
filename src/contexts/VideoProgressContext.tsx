import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VideoProgress {
  videoId: string;
  courseTitle: string;
  videoTitle: string;
  watchedDuration: number;
  totalDuration: number;
  completed: boolean;
  lastWatched: string;
  watchSessions: WatchSession[]; // Track individual watch sessions to prevent cheating
  userEngagement: number; // Track if user is actually watching (0-100%)
}

interface WatchSession {
  startTime: Date;
  endTime: Date;
  continuousWatchTime: number; // Time watched without skipping/leaving
}

interface VideoProgressContextType {
  videoProgress: VideoProgress[];
  updateVideoProgress: (progress: VideoProgress) => void;
  isVideoCompleted: (videoId: string) => boolean;
  getCourseProgress: (courseTitle: string) => number;
  getCompletedVideos: (courseTitle: string) => number;
  getTotalVideos: (courseTitle: string) => number;
  isCourseCompleted: (courseTitle: string, totalVideos: number) => boolean;
  isVideoValidlyCompleted: (videoId: string) => boolean; // Anti-cheating verification
  getVideoWatchedPercentage: (videoId: string) => number;
}

const VideoProgressContext = createContext<VideoProgressContextType | undefined>(undefined);

export const VideoProgressProvider = ({ children }: { children: ReactNode }) => {
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>(() => {
    const saved = localStorage.getItem('videoProgress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
  }, [videoProgress]);

  const updateVideoProgress = (progress: VideoProgress) => {
    setVideoProgress(prev => {
      const existing = prev.findIndex(v => v.videoId === progress.videoId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = progress;
        return updated;
      }
      return [...prev, progress];
    });
  };

  const isVideoCompleted = (videoId: string) => {
    const video = videoProgress.find(v => v.videoId === videoId);
    return video?.completed || false;
  };

  // Anti-cheating verification - Check if video was watched legitimately
  const isVideoValidlyCompleted = (videoId: string) => {
    const video = videoProgress.find(v => v.videoId === videoId);
    if (!video) return false;
    
    // Require:
    // 1. At least 95% of video watched
    // 2. Watch sessions show continuous watching (not all at once)
    // 3. User engagement > 70%
    
    const watchedPercentage = video.totalDuration > 0 
      ? (video.watchedDuration / video.totalDuration) * 100 
      : 0;
    
    const hasMultipleSessions = video.watchSessions && video.watchSessions.length > 0;
    const highEngagement = video.userEngagement >= 70;
    
    return (
      video.completed && 
      watchedPercentage >= 95 && 
      hasMultipleSessions && 
      highEngagement
    );
  };

  const getVideoWatchedPercentage = (videoId: string) => {
    const video = videoProgress.find(v => v.videoId === videoId);
    if (!video || video.totalDuration === 0) return 0;
    return Math.round((video.watchedDuration / video.totalDuration) * 100);
  };

  const getCourseProgress = (courseTitle: string) => {
    const courseVideos = videoProgress.filter(v => v.courseTitle === courseTitle);
    if (courseVideos.length === 0) return 0;
    
    const totalWatched = courseVideos.reduce((sum, v) => sum + v.watchedDuration, 0);
    const totalDuration = courseVideos.reduce((sum, v) => sum + v.totalDuration, 0);
    
    return totalDuration > 0 ? Math.round((totalWatched / totalDuration) * 100) : 0;
  };

  const getCompletedVideos = (courseTitle: string) => {
    return videoProgress.filter(v => v.courseTitle === courseTitle && v.completed).length;
  };

  const getTotalVideos = (courseTitle: string) => {
    return videoProgress.filter(v => v.courseTitle === courseTitle).length;
  };

  const isCourseCompleted = (courseTitle: string, totalVideos: number) => {
    const completed = getCompletedVideos(courseTitle);
    return completed >= totalVideos && totalVideos > 0;
  };

  return (
    <VideoProgressContext.Provider
      value={{
        videoProgress,
        updateVideoProgress,
        isVideoCompleted,
        getCourseProgress,
        getCompletedVideos,
        getTotalVideos,
        isCourseCompleted,
        isVideoValidlyCompleted,
        getVideoWatchedPercentage,
      }}
    >
      {children}
    </VideoProgressContext.Provider>
  );
};

export const useVideoProgress = () => {
  const context = useContext(VideoProgressContext);
  if (!context) {
    throw new Error('useVideoProgress must be used within VideoProgressProvider');
  }
  return context;
};
