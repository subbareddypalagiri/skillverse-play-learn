import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Maximize2, CheckCircle, Trophy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useVideoProgress } from "@/contexts/VideoProgressContext";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerWithTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoId: string;
  platform: string;
  originalUrl: string;
  courseTitle: string;
}

const VideoPlayerWithTracking = ({ 
  isOpen, 
  onClose, 
  videoTitle, 
  videoId, 
  platform, 
  originalUrl,
  courseTitle 
}: VideoPlayerWithTrackingProps) => {
  const { updateVideoProgress, isVideoCompleted } = useVideoProgress();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsCompleted(isVideoCompleted(videoId));
  }, [videoId, isVideoCompleted]);

  useEffect(() => {
    if (!isOpen) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    // For YouTube videos, simulate progress tracking
    if (platform === "YouTube") {
      // Start tracking after 2 seconds (video loads)
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        
        // Estimate duration (typical course video is 30-60 mins)
        // For real implementation, you'd get this from YouTube API
        const estimatedDuration = 1800; // 30 minutes default
        setDuration(estimatedDuration);
        
        // Update progress
        updateVideoProgress({
          videoId,
          courseTitle,
          videoTitle,
          watchedDuration: elapsed,
          totalDuration: estimatedDuration,
          completed: elapsed >= estimatedDuration * 0.9, // 90% completion
          lastWatched: new Date().toISOString(),
        });

        // Check if completed (90% watched)
        if (elapsed >= estimatedDuration * 0.9 && !isCompleted) {
          setIsCompleted(true);
          setShowCompletionBadge(true);
          
          // Hide badge after 5 seconds
          setTimeout(() => setShowCompletionBadge(false), 5000);
        }
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isOpen, platform, videoId, courseTitle, videoTitle, isCompleted, updateVideoProgress]);

  const getEmbedUrl = () => {
    if (platform === "YouTube") {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;
    } else if (platform === "NPTEL") {
      return originalUrl;
    }
    return "";
  };

  const embedUrl = getEmbedUrl();
  const progress = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
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
                  <p className="text-sm opacity-90">Great job! Keep learning!</p>
                </div>
              </div>
            </div>
          )}

          {platform === "YouTube" && embedUrl ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoTitle}
              style={{ border: 'none' }}
            />
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

        <div className="p-4 bg-muted/30">
          {/* Progress Bar */}
          {platform === "YouTube" && duration > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Watch Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress}% {isCompleted && "✅ Completed"}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
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
