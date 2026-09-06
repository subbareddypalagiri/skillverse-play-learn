import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReelItem,
  commentOnReel,
  fetchReelComments,
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
  ChevronDown,
  Trash2,
  Send,
  Copy,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";


const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

// Instagram-style Centered Reel Component
const CenteredReel = ({
  reel,
  isActive,
  isMuted,
  onToggleMute,
  onLike,
  onComment,
  onShare,
  onSave,
  onViewed,
  canDelete,
  onDelete
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
  canDelete?: boolean;
  onDelete?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      
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

  const isYouTube = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/.test(reel.videoUrl || "");
  const ytMatch = (reel.videoUrl || "").match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
  const ytId = ytMatch ? ytMatch[1] : null;

  const driveMatch = (reel.videoUrl || "").match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || (reel.videoUrl || "").match(/id=([a-zA-Z0-9_-]+)/);
  const driveId = driveMatch ? driveMatch[1] : null;

  return (
    <div className="relative w-full h-[calc(100vh-170px)] bg-zinc-950 snap-start snap-always flex-shrink-0 flex items-center justify-center">
      <div className="relative h-full w-full flex items-center justify-center px-4">
        <div 
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"
          style={{ 
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '9/16',
            maxHeight: 'calc(100vh - 185px)'
          }}
        >
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=${isActive ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : driveId ? (
            <iframe
              src={`https://drive.google.com/file/d/${driveId}/preview`}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay"
            />
          ) : (
            <video
              ref={videoRef}
              src={resolveMediaUrl(reel.videoUrl)}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlayPause}
            />
          )}

          {!isPlaying && isActive && !ytId && !driveId && (
            <div 
              className="absolute inset-0 flex items-center justify-center z-10"
              onClick={togglePlayPause}
            >
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          )}

          {!ytId && !driveId && (
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
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {(reel.creator?.name || "U").charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm truncate">{reel.creator?.name || "Creator"}</span>
            </div>

            <h2 className="text-white font-bold text-sm sm:text-base mb-1 line-clamp-1">{reel.title}</h2>

            {reel.caption && (
              <p className="text-white/80 text-xs sm:text-sm line-clamp-2">{reel.caption}</p>
            )}

            {reel.category && (
              <div className="mt-2">
                <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs">
                  #{reel.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="absolute right-3 sm:right-[calc(50%-240px)] bottom-8 z-20 flex flex-col items-center gap-4">
          <button onClick={onLike} className="flex flex-col items-center gap-1 group">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
              reel.isLiked ? "bg-red-500 shadow-lg shadow-red-500/30" : "bg-zinc-900/80 border border-zinc-700/60 group-hover:bg-zinc-800"
            }`}>
              <Heart className={`w-5 h-5 ${reel.isLiked ? "text-white fill-white" : "text-white"}`} />
            </div>
            <span className="text-white/90 text-xs font-medium">{reel.stats?.likes || 0}</span>
          </button>

          <button onClick={onComment} className="flex flex-col items-center gap-1 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-900/80 border border-zinc-700/60 group-hover:bg-zinc-800 flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 text-xs font-medium">{reel.stats?.comments || 0}</span>
          </button>

          <button onClick={onSave} className="flex flex-col items-center gap-1 group">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
              reel.isSaved ? "bg-amber-500 shadow-lg shadow-amber-500/30" : "bg-zinc-900/80 border border-zinc-700/60 group-hover:bg-zinc-800"
            }`}>
              <Bookmark className={`w-5 h-5 ${reel.isSaved ? "text-white fill-white" : "text-white"}`} />
            </div>
          </button>

          <button onClick={onShare} className="flex flex-col items-center gap-1 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-900/80 border border-zinc-700/60 group-hover:bg-zinc-800 flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </button>

          {canDelete && (
            <button onClick={onDelete} className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-500/20 group-hover:bg-red-500 flex items-center justify-center transition-all border border-red-500/30">
                <Trash2 className="w-5 h-5 text-red-400 group-hover:text-white" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ReelsTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const commentsQuery = useQuery({
    queryKey: ["reel-comments", activeCommentReelId],
    queryFn: () => fetchReelComments(activeCommentReelId!),
    enabled: Boolean(activeCommentReelId && commentDialogOpen),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/reels/${id}`);
      } catch {
        await apiClient.delete(`/posts/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels-feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
    }
  });


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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const reelHeight = container.clientHeight || window.innerHeight;
      const newIndex = Math.round(scrollTop / reelHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }

      if (newIndex >= reels.length - 2 && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
        feedQuery.fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, reels.length, feedQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const reelHeight = container.clientHeight || window.innerHeight;

      if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        container.scrollTo({
          top: (currentIndex - 1) * reelHeight,
          behavior: "smooth"
        });
      } else if (e.key === "ArrowDown" && currentIndex < reels.length - 1) {
        e.preventDefault();
        container.scrollTo({
          top: (currentIndex + 1) * reelHeight,
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
    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title,
          text: reel.caption || reel.title,
          url: reelUrl
        });
      } else {
        await navigator.clipboard.writeText(reelUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(reelUrl);
        toast.success("Link copied to clipboard!");
      } catch {}
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
    queryClient.invalidateQueries({ queryKey: ["reel-comments", activeCommentReelId] });
    toast.success("Comment posted!");
  };

  if (feedQuery.isLoading) {
    return (
      <div className="h-[calc(100vh-130px)] w-full bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-400" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[calc(100vh-130px)] w-full bg-zinc-950 flex flex-col items-center justify-center text-white">
        <p className="text-xl font-semibold mb-2">No reels yet</p>
        <p className="text-zinc-500 text-sm">Be the first to create a reel!</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="h-[calc(100vh-170px)] w-full overflow-y-scroll snap-y snap-mandatory bg-zinc-950 scrollbar-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel, index) => (
          <CenteredReel
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
            canDelete={Boolean(user && (reel.creator?._id === user._id || (reel as any).userId === user._id || (reel as any).user?._id === user._id))}
            onDelete={() => {
              if (window.confirm("Are you sure you want to delete this reel?")) {
                deleteMutation.mutate(reel._id);
              }
            }}
          />
        ))}

        {feedQuery.isFetchingNextPage && (
          <div className="h-[calc(100vh-170px)] w-full bg-zinc-950 flex items-center justify-center snap-start">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        )}
      </div>

      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
        <button
          onClick={() => {
            const h = containerRef.current?.clientHeight || window.innerHeight;
            if (currentIndex > 0) {
              containerRef.current?.scrollTo({
                top: (currentIndex - 1) * h,
                behavior: "smooth"
              });
            }
          }}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center disabled:opacity-25 transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <div className="text-zinc-400 text-[11px] text-center bg-zinc-900/80 border border-zinc-800 rounded-full px-2 py-1 font-mono">
          {currentIndex + 1}/{reels.length}
        </div>
        <button
          onClick={() => {
            const h = containerRef.current?.clientHeight || window.innerHeight;
            if (currentIndex < reels.length - 1) {
              containerRef.current?.scrollTo({
                top: (currentIndex + 1) * h,
                behavior: "smooth"
              });
            }
          }}
          disabled={currentIndex === reels.length - 1}
          className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center disabled:opacity-25 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <MessageCircle className="w-5 h-5 text-cyan-400" /> Comments ({commentsQuery.data?.length || 0})
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto max-h-[50vh] space-y-3 pr-1 py-2 border-y border-zinc-800">
            {commentsQuery.isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            ) : commentsQuery.data && commentsQuery.data.length > 0 ? (
              commentsQuery.data.map((c: any, idx: number) => (
                <div key={c._id || idx} className="flex gap-3 text-sm bg-zinc-800/40 p-3 rounded-xl border border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-black flex-shrink-0">
                    {(c.userId?.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-white">{c.userId?.name || 'User'}</span>
                      <span className="text-[10px] text-zinc-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <p className="text-zinc-300 text-xs break-words">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          <div className="pt-2 flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              className="bg-zinc-800 border-zinc-700 text-white text-xs"
            />
            <Button
              onClick={submitComment}
              disabled={!commentText.trim() || actionMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 flex-shrink-0"
            >
              {actionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
