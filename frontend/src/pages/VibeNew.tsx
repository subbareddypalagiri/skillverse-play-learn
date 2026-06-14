import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ReelItem,
  commentOnReel,
  fetchReelsFeed,
  likeReel,
  saveReel,
  shareReel,
  trackReelView
} from "@/lib/reelsApi";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Loader2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

// Instagram-style Centered Reel Component
const FullScreenReel = ({
  reel,
  isActive,
  isMuted,
  onToggleMute,
  onLike,
  onComment,
  onShare,
  onSave,
  onViewed
}: {
  reel: ReelItem;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onViewed: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      
      // Track view after 3 seconds
      if (!hasTrackedView.current) {
        const timer = setTimeout(() => {
          onViewed();
          hasTrackedView.current = true;
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      hasTrackedView.current = false;
    }
  }, [isActive, onViewed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 snap-start snap-always flex-shrink-0 flex items-center justify-center">
      {/* Centered Reel Container - Instagram-style */}
      <div className="relative h-full max-h-[100vh] w-full max-w-[420px] flex items-center justify-center">
        {/* Video Container with 9:16 aspect ratio */}
        <div className="relative w-full h-full max-h-[calc(100vh-40px)] flex items-center justify-center">
          <div 
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
            style={{ 
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '9/16',
              maxHeight: 'calc(100vh - 40px)'
            }}
          >
            {/* Video */}
            <video
              ref={videoRef}
              src={resolveMediaUrl(reel.videoUrl)}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlayPause}
            />

            {/* Play/Pause Overlay (center of video) */}
            {!isPlaying && isActive && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-10"
                onClick={togglePlayPause}
              >
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}

            {/* Mute/Unmute Button (top right of video) */}
            <button
              onClick={onToggleMute}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Bottom Overlay - Creator Info & Caption (inside video) */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              {/* Creator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {(reel.creator?.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-semibold text-sm">{reel.creator?.name || "Creator"}</span>
              </div>

              {/* Title */}
              <h2 className="text-white font-bold text-base mb-1 line-clamp-1">{reel.title}</h2>

              {/* Caption */}
              {reel.caption && (
                <p className="text-white/80 text-sm line-clamp-2">{reel.caption}</p>
              )}

              {/* Category Tag */}
              {reel.category && (
                <div className="mt-2">
                  <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                    #{reel.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Actions - Outside video container (Instagram-style) */}
        <div className="absolute right-[-60px] bottom-1/4 z-20 flex flex-col items-center gap-5">
          {/* Like */}
          <button onClick={onLike} className="flex flex-col items-center gap-1 group">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              reel.isLiked ? "bg-red-500" : "bg-zinc-800/80 group-hover:bg-zinc-700"
            }`}>
              <Heart className={`w-5 h-5 ${reel.isLiked ? "text-white fill-white" : "text-white"}`} />
            </div>
            <span className="text-white/90 text-xs font-medium">{reel.stats?.likes || 0}</span>
          </button>

          {/* Comment */}
          <button onClick={onComment} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 text-xs font-medium">{reel.stats?.comments || 0}</span>
          </button>

          {/* Bookmark */}
          <button onClick={onSave} className="flex flex-col items-center gap-1 group">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              reel.isSaved ? "bg-yellow-500" : "bg-zinc-800/80 group-hover:bg-zinc-700"
            }`}>
              <Bookmark className={`w-5 h-5 ${reel.isSaved ? "text-white fill-white" : "text-white"}`} />
            </div>
          </button>

          {/* Share */}
          <button onClick={onShare} className="flex flex-col items-center gap-1 group">
            <div className="w-11 h-11 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/40" />
      </div>
    </div>
  );
};

const Vibe = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const feedQuery = useInfiniteQuery({
    queryKey: ["reels-feed", "latest"],
    queryFn: ({ pageParam }) => fetchReelsFeed({
      page: pageParam,
      limit: 10,
      mode: "latest"
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    }
  });

  const reels = feedQuery.data?.pages.flatMap((page) => page.data) || [];

  // Handle scroll snap detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const reelHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / reelHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }

      // Load more when near end
      if (newIndex >= reels.length - 2 && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
        feedQuery.fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, reels.length, feedQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        container.scrollTo({
          top: (currentIndex - 1) * window.innerHeight,
          behavior: "smooth"
        });
      } else if (e.key === "ArrowDown" && currentIndex < reels.length - 1) {
        e.preventDefault();
        container.scrollTo({
          top: (currentIndex + 1) * window.innerHeight,
          behavior: "smooth"
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels.length]);

  const actionMutation = useMutation({
    mutationFn: async ({ type, reelId, text }: { type: "like" | "save" | "comment"; reelId: string; text?: string }) => {
      if (type === "like") return likeReel(reelId);
      if (type === "save") return saveReel(reelId);
      return commentOnReel(reelId, text || "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
    }
  });

  const handleShare = async (reel: ReelItem) => {
    const reelUrl = `${window.location.origin}/vibe?reel=${reel._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: reel.caption || reel.title,
          url: reelUrl
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(reelUrl);
    }
    await shareReel(reel._id);
    queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
  };

  const openCommentDialog = (reelId: string) => {
    setActiveCommentReelId(reelId);
    setCommentDialogOpen(true);
  };

  const submitComment = async () => {
    if (!activeCommentReelId || !commentText.trim()) return;
    await actionMutation.mutateAsync({ type: "comment", reelId: activeCommentReelId, text: commentText });
    setCommentText("");
    setCommentDialogOpen(false);
  };

  if (feedQuery.isLoading) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white/70" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold mb-2">No reels yet</p>
        <p className="text-white/50">Be the first to create a reel!</p>
      </div>
    );
  }

  return (
    <>
      {/* Instagram-style Centered Reels Container */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-zinc-950"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel, index) => (
          <FullScreenReel
            key={reel._id}
            reel={reel}
            isActive={index === currentIndex}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onLike={() => actionMutation.mutate({ type: "like", reelId: reel._id })}
            onComment={() => openCommentDialog(reel._id)}
            onShare={() => handleShare(reel)}
            onSave={() => actionMutation.mutate({ type: "save", reelId: reel._id })}
            onViewed={() => trackReelView(reel._id).catch(() => {})}
          />
        ))}

        {/* Loading indicator */}
        {feedQuery.isFetchingNextPage && (
          <div className="h-screen w-full bg-zinc-950 flex items-center justify-center snap-start">
            <Loader2 className="w-8 h-8 animate-spin text-white/70" />
          </div>
        )}
      </div>

      {/* Navigation Controls - Left side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              containerRef.current?.scrollTo({
                top: (currentIndex - 1) * window.innerHeight,
                behavior: "smooth"
              });
            }
          }}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-zinc-800/80 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <div className="text-white/80 text-xs text-center bg-zinc-800/80 rounded-full px-2 py-1.5 font-medium">
          {currentIndex + 1}/{reels.length}
        </div>
        <button
          onClick={() => {
            if (currentIndex < reels.length - 1) {
              containerRef.current?.scrollTo({
                top: (currentIndex + 1) * window.innerHeight,
                behavior: "smooth"
              });
            }
          }}
          disabled={currentIndex === reels.length - 1}
          className="w-10 h-10 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-zinc-800/80 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Add a comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCommentDialogOpen(false)} className="border-zinc-700">
                Cancel
              </Button>
              <Button
                onClick={submitComment}
                disabled={!commentText.trim() || actionMutation.isPending}
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                {actionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Vibe;
