import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Maximize2, CheckCircle, Trophy, AlertCircle, Eye, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useVideoProgress } from "@/contexts/VideoProgressContext";
import { Progress } from "@/components/ui/progress";
import ReactPlayer from 'react-player';

interface VideoPlayerWithTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoId: string;
  platform: string;
  originalUrl: string;
  courseTitle: string;
  videoDuration?: number; // Optional: override estimated duration
}

interface WatchSession {
  startTime: Date;
  endTime: Date;
  continuousWatchTime: number;
}

const VideoPlayerWithTracking = ({ 
  isOpen, 
  onClose, 
  videoTitle, 
  videoId, 
  platform, 
  originalUrl,
  courseTitle,
  videoDuration = 1800 // Default 30 minutes
}: VideoPlayerWithTrackingProps) => {
  const { updateVideoProgress, isVideoCompleted, getVideoWatchedPercentage } = useVideoProgress();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoDuration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0); // Track active watching
  const [skipAttempts, setSkipAttempts] = useState(0); // Detect skip attempts
  const [isPlayerFocused, setIsPlayerFocused] = useState(true); // Check if video is in focus
  const [warningMessage, setWarningMessage] = useState(""); // Show warnings
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const engagementIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchSessionsRef = useRef<WatchSession[]>([]);
  const lastTimeRef = useRef(0);
  const sessionStartRef = useRef<Date>(new Date());

  useEffect(() => {
    setIsCompleted(isVideoCompleted(videoId));
  }, [videoId, isVideoCompleted]);

  // Detect if user leaves the page or minimizes it
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlayerFocused(false);
        setWarningMessage("⚠️ Video paused - Return to the page to continue watching");
      } else {
        setIsPlayerFocused(true);
        setWarningMessage("");
      }
    };

    const handleWindowFocus = () => {
      setIsPlayerFocused(true);
    };

    const handleWindowBlur = () => {
      setIsPlayerFocused(false);
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (engagementIntervalRef.current) clearInterval(engagementIntervalRef.current);
      return;
    }

    // Only track progress if player is focused
    if (platform === "YouTube") {
      setDuration(videoDuration);
      
      const startTime = Date.now();
      const sessionStart = new Date();
      lastTimeRef.current = 0;
      
      // Track video progress every 2 seconds (strict monitoring)
      progressIntervalRef.current = setInterval(() => {
        if (!isPlayerFocused) return; // Don't count time when not focused
        
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(Math.min(elapsed, videoDuration));

        // Detect suspicious jumping (skipping)
        const timeDiff = elapsed - lastTimeRef.current;
        if (timeDiff > 5) {
          setSkipAttempts(prev => prev + 1);
          setWarningMessage(`⚠️ Skipping detected! (Attempt ${skipAttempts + 1})`);
          setTimeout(() => setWarningMessage(""), 3000);
        }
        lastTimeRef.current = elapsed;

        // Update user engagement based on continuous watching
        const watchedPercent = (elapsed / videoDuration) * 100;
        setUserEngagement(Math.min(watchedPercent, 100));

        // Calculate continuous watch time
        const continuousWatch = Math.max(0, elapsed - (skipAttempts * 2)); // Penalize skips

        // Auto-mark complete when 95%+ watched with high engagement
        if (watchedPercent >= 95 && !isCompleted) {
          // Save watch session
          const session: WatchSession = {
            startTime: sessionStart,
            endTime: new Date(),
            continuousWatchTime: continuousWatch,
          };
          watchSessionsRef.current.push(session);

          // Update progress with anti-cheating data
          updateVideoProgress({
            videoId,
            courseTitle,
            videoTitle,
            watchedDuration: elapsed,
            totalDuration: videoDuration,
            completed: true,
            lastWatched: new Date().toISOString(),
            watchSessions: watchSessionsRef.current,
            userEngagement: Math.round(userEngagement),
          });

          setIsCompleted(true);
          setShowCompletionBadge(true);
          setTimeout(() => setShowCompletionBadge(false), 5000);
        } else if (watchedPercent < 95) {
          // Update progress even if not complete
          updateVideoProgress({
            videoId,
            courseTitle,
            videoTitle,
            watchedDuration: elapsed,
            totalDuration: videoDuration,
            completed: false,
            lastWatched: new Date().toISOString(),
            watchSessions: watchSessionsRef.current,
            userEngagement: Math.round(userEngagement),
          });
        }
      }, 2000); // Check every 2 seconds (strict)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (engagementIntervalRef.current) {
        clearInterval(engagementIntervalRef.current);
      }
    };
  }, [isOpen, platform, videoId, courseTitle, videoTitle, isCompleted, videoDuration, isPlayerFocused, skipAttempts, userEngagement, updateVideoProgress]);

  const getEmbedUrl = () => {
    if (videoId || platform === "YouTube") {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } else if (platform === "NPTEL") {
      return originalUrl;
    }
    return "";
  };

  const embedUrl = getEmbedUrl();
  const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
  const watchedPercent = getVideoWatchedPercentage(videoId);

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (engagementIntervalRef.current) {
      clearInterval(engagementIntervalRef.current);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1200px] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-primary" />
              {videoTitle}
              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(originalUrl, '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open on {platform}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
          {/* Completion Badge Overlay */}
          {showCompletionBadge && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce">
              <div className="flex items-center gap-4">
                <Trophy className="w-12 h-12" />
                <div>
                  <h3 className="text-2xl font-bold">Video Completed! 🎉</h3>
                  <p className="text-sm opacity-90">Certificate will be generated when course is complete!</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message Overlay */}
          {warningMessage && !isPlayerFocused && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-2xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8" />
                <p className="font-semibold text-lg">{warningMessage}</p>
              </div>
            </div>
          )}

          {platform === "YouTube" && embedUrl ? (
            <div className="absolute top-0 left-0 w-full h-full">
              <ReactPlayer
                url={originalUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 }
                  }
                }}
              />
            </div>
          ) : platform === "NPTEL" ? (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-blue-900 to-purple-900">
              <div className="text-center p-8">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-2xl font-bold mb-2">NPTEL SWAYAM Course</h3>
                  <p className="text-blue-200 mb-4">Official Government Platform - IIT Quality</p>
                </div>
                <p className="mb-6 text-gray-300">
                  NPTEL courses are best experienced on their official platform.<br/>
                  Click below to access the full course content.
                </p>
                <Button
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-6 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open NPTEL Course
                </Button>
                <p className="mt-4 text-xs text-gray-400">
                  Free access • IIT Quality • Certificate Available
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <p className="mb-4">Video cannot be embedded</p>
                <Button
                  onClick={() => window.open(originalUrl, '_blank')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on {platform}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/30 space-y-3">
          {/* Anti-Cheating Status */}
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className={`p-2 rounded flex items-center gap-1 ${isPlayerFocused ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
              <Eye className="w-4 h-4" />
              {isPlayerFocused ? 'Watching' : 'Not Active'}
            </div>
            <div className="p-2 rounded bg-blue-500/20 text-blue-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Math.round(userEngagement)}% Engaged
            </div>
            <div className={`p-2 rounded ${skipAttempts === 0 ? 'bg-green-500/20 text-green-700' : 'bg-orange-500/20 text-orange-700'}`}>
              {skipAttempts === 0 ? '✓ No Skips' : `⚠️ ${skipAttempts} Skip(s)`}
            </div>
          </div>

          {/* Progress Bar */}
          {platform === "YouTube" && duration > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Watch Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress}% {isCompleted && "✅ Completed - Certificate Ready!"}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                ℹ️ You must watch 95%+ of the video to complete it. Your engagement will be verified for certificate generation.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {platform}
              </span>
              <span className="text-sm text-muted-foreground">
                ✅ Legally embedded - All content belongs to original creators
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerWithTracking;
