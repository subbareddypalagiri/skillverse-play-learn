import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import {
  ReelItem,
  FeedMode,
  commentOnReel,
  fetchReelsFeed,
  likeReel,
  saveReel,
  shareReel,
  trackReelView
} from "@/lib/reelsApi";
import {
  ShowcaseData,
  getShowcase,
  connectGithub,
  connectLinkedIn,
  connectLeetCode,
  disconnectPlatform,
  refreshPlatform
} from "@/lib/showcaseApi";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Loader2,
  ChevronDown,
  Plus,
  Film,
  Rss,
  Award,
  Github,
  Linkedin,
  Code2,
  ExternalLink,
  RefreshCw,
  Star,
  GitFork,
  Users,
  CheckCircle2,
  Link as LinkIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");

const FEED_MODES: Array<{ key: FeedMode; label: string }> = [
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "recommended", label: "Recommended" }
];

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

// Reel Card Component (Dashboard Style)
const ReelCard = ({
  reel,
  isMuted,
  onLike,
  onComment,
  onShare,
  onSave,
  onViewed,
  onToggleMute
}: {
  reel: ReelItem;
  isMuted: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onViewed: () => void;
  onToggleMute: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasTrackedView = useRef(false);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);

    if (!hasTrackedView.current && (videoRef.current.currentTime >= 3 || currentProgress >= 50)) {
      onViewed();
      hasTrackedView.current = true;
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      {/* Header Info */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
          <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
            {reel.category || "Web Development"}
          </Badge>
          <span>•</span>
          <span>{reel.category || "Latest"}</span>
        </div>
        <h3 className="text-white font-semibold text-lg">{reel.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-zinc-500 text-sm">{reel.creator?.name || "freeCodeCamp.org"}</span>
        </div>
        <p className="text-cyan-400 text-sm mt-1">{reel.caption}</p>
        <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{reel.description}</p>
      </div>

      {/* Video Section */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={resolveMediaUrl(reel.videoUrl)}
          className="w-full h-full object-contain"
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlayPause}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={togglePlayPause}
        >
          <div className={`w-16 h-16 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center border border-zinc-700 transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white" />
            ) : (
              <Play className="w-7 h-7 text-white ml-1" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
          <div 
            className="h-full bg-cyan-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-3 border-t border-zinc-800">
        <div className="flex items-center gap-4 text-zinc-400 text-sm">
          <span>{reel.duration || 60}s</span>
          <span>•</span>
          <span>{reel.creator?.name || "freeCodeCamp.org"}</span>
          <span>•</span>
          <span className="text-cyan-400">{Math.round(progress)}% watched</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onLike} className="flex items-center gap-1 hover:text-red-400 transition-colors">
            <Heart className={`w-5 h-5 ${reel.isLiked ? "text-red-500 fill-red-500" : "text-zinc-400"}`} />
            <span className="text-xs text-zinc-400">{reel.stats?.likes || 0}</span>
          </button>
          <button onClick={onComment} className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
            <MessageCircle className="w-5 h-5 text-zinc-400" />
            <span className="text-xs text-zinc-400">{reel.stats?.comments || 0}</span>
          </button>
          <button onClick={onSave} className="hover:text-yellow-400 transition-colors">
            <Bookmark className={`w-5 h-5 ${reel.isSaved ? "text-yellow-500 fill-yellow-500" : "text-zinc-400"}`} />
          </button>
          <button onClick={onShare} className="hover:text-cyan-400 transition-colors">
            <Share2 className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 text-zinc-500 text-xs border-t border-zinc-800">
        <ChevronDown className="w-4 h-4" />
        <span>Swipe for next reel</span>
      </div>
    </Card>
  );
};

// Showcase Section Component
const ShowcaseSection = () => {
  const queryClient = useQueryClient();
  const [connectDialog, setConnectDialog] = useState<{ open: boolean; platform: 'github' | 'linkedin' | 'leetcode' | null }>({
    open: false,
    platform: null
  });
  const [formData, setFormData] = useState({ username: '', profileUrl: '', headline: '' });

  // Fetch showcase data
  const showcaseQuery = useQuery({
    queryKey: ['showcase'],
    queryFn: () => getShowcase(),
  });

  // Connect platform mutation
  const connectMutation = useMutation({
    mutationFn: async ({ platform, data }: { platform: string; data: any }) => {
      if (platform === 'github') return connectGithub(data.username);
      if (platform === 'linkedin') return connectLinkedIn(data.profileUrl, data.headline);
      if (platform === 'leetcode') return connectLeetCode(data.username);
      throw new Error('Invalid platform');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showcase'] });
      setConnectDialog({ open: false, platform: null });
      setFormData({ username: '', profileUrl: '', headline: '' });
      toast.success('Platform connected successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to connect platform');
    }
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: disconnectPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showcase'] });
      toast.success('Platform disconnected');
    }
  });

  // Refresh mutation
  const refreshMutation = useMutation({
    mutationFn: refreshPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showcase'] });
      toast.success('Data refreshed successfully');
    },
    onError: () => {
      toast.error('Failed to refresh data');
    }
  });

  const handleConnect = () => {
    if (!connectDialog.platform) return;
    connectMutation.mutate({ platform: connectDialog.platform, data: formData });
  };

  const showcase = showcaseQuery.data;

  if (showcaseQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Achievement Showcase</h2>
        <p className="text-zinc-400">Connect your profiles to display your coding journey</p>
      </div>

      {/* GitHub Card */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">GitHub</h3>
                <p className="text-zinc-500 text-sm">Repositories & Contributions</p>
              </div>
            </div>
            {showcase?.github.connected ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshMutation.mutate('github')}
                  disabled={refreshMutation.isPending}
                  className="text-zinc-400 hover:text-white"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectMutation.mutate('github')}
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setConnectDialog({ open: true, platform: 'github' });
                  setFormData({ username: '', profileUrl: '', headline: '' });
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {showcase?.github.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {showcase.github.avatarUrl && (
                  <img
                    src={showcase.github.avatarUrl}
                    alt={showcase.github.username}
                    className="w-16 h-16 rounded-full border-2 border-zinc-700"
                  />
                )}
                <div className="flex-1">
                  <a
                    href={showcase.github.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
                  >
                    @{showcase.github.username}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {showcase.github.bio && (
                    <p className="text-zinc-400 text-sm mt-1">{showcase.github.bio}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 text-2xl font-bold">
                    <GitFork className="w-5 h-5" />
                    {showcase.github.publicRepos}
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Repositories</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 text-2xl font-bold">
                    <Star className="w-5 h-5" />
                    {showcase.github.totalStars}
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Total Stars</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-400 text-2xl font-bold">
                    <Users className="w-5 h-5" />
                    {showcase.github.followers}
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Followers</p>
                </div>
                <div className="text-center">
                  <div className="text-zinc-400 text-2xl font-bold">{showcase.github.following}</div>
                  <p className="text-zinc-500 text-xs mt-1">Following</p>
                </div>
              </div>

              {showcase.github.topLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                  {showcase.github.topLanguages.map((lang) => (
                    <Badge key={lang} variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <Github className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Connect your GitHub to showcase your repositories and contributions</p>
            </div>
          )}
        </div>
      </Card>

      {/* LinkedIn Card */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">LinkedIn</h3>
                <p className="text-zinc-500 text-sm">Professional Profile</p>
              </div>
            </div>
            {showcase?.linkedin.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnectMutation.mutate('linkedin')}
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setConnectDialog({ open: true, platform: 'linkedin' });
                  setFormData({ username: '', profileUrl: '', headline: '' });
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {showcase?.linkedin.connected ? (
            <div className="space-y-4">
              <a
                href={showcase.linkedin.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <LinkIcon className="w-4 h-4" />
                View LinkedIn Profile
                <ExternalLink className="w-4 h-4" />
              </a>
              {showcase.linkedin.headline && (
                <p className="text-zinc-400 pt-3 border-t border-zinc-800">{showcase.linkedin.headline}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <Linkedin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Connect your LinkedIn to showcase your professional profile</p>
            </div>
          )}
        </div>
      </Card>

      {/* LeetCode Card */}
      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">LeetCode</h3>
                <p className="text-zinc-500 text-sm">Coding Problems Solved</p>
              </div>
            </div>
            {showcase?.leetcode.connected ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshMutation.mutate('leetcode')}
                  disabled={refreshMutation.isPending}
                  className="text-zinc-400 hover:text-white"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectMutation.mutate('leetcode')}
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setConnectDialog({ open: true, platform: 'leetcode' });
                  setFormData({ username: '', profileUrl: '', headline: '' });
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {showcase?.leetcode.connected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <a
                  href={showcase.leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2"
                >
                  @{showcase.leetcode.username}
                  <ExternalLink className="w-4 h-4" />
                </a>
                {showcase.leetcode.ranking > 0 && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Rank #{showcase.leetcode.ranking.toLocaleString()}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 text-2xl font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    {showcase.leetcode.totalSolved}
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">Total Solved</p>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-2xl font-bold">{showcase.leetcode.easySolved}</div>
                  <p className="text-zinc-500 text-xs mt-1">Easy</p>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 text-2xl font-bold">{showcase.leetcode.mediumSolved}</div>
                  <p className="text-zinc-500 text-xs mt-1">Medium</p>
                </div>
                <div className="text-center">
                  <div className="text-red-400 text-2xl font-bold">{showcase.leetcode.hardSolved}</div>
                  <p className="text-zinc-500 text-xs mt-1">Hard</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Connect your LeetCode to showcase your problem-solving skills</p>
            </div>
          )}
        </div>
      </Card>

      {/* Connect Dialog */}
      <Dialog open={connectDialog.open} onOpenChange={(open) => setConnectDialog({ open, platform: null })}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>
              Connect {connectDialog.platform === 'github' && 'GitHub'}
              {connectDialog.platform === 'linkedin' && 'LinkedIn'}
              {connectDialog.platform === 'leetcode' && 'LeetCode'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {(connectDialog.platform === 'github' || connectDialog.platform === 'leetcode') && (
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Username</label>
                <Input
                  placeholder={`Enter your ${connectDialog.platform} username`}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            )}
            {connectDialog.platform === 'linkedin' && (
              <>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Profile URL</label>
                  <Input
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.profileUrl}
                    onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Headline (Optional)</label>
                  <Input
                    placeholder="Software Engineer | Full Stack Developer"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setConnectDialog({ open: false, platform: null })}
                className="border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={connectMutation.isPending || 
                  (connectDialog.platform !== 'linkedin' && !formData.username) ||
                  (connectDialog.platform === 'linkedin' && !formData.profileUrl)
                }
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                {connectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Vibe = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<FeedMode>("latest");
  const [activeTab, setActiveTab] = useState<"reels" | "feed" | "showcase">("reels");
  const [isMuted, setIsMuted] = useState(true);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeCommentReelId, setActiveCommentReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch reels
  const feedQuery = useInfiniteQuery({
    queryKey: ["reels-feed", mode],
    queryFn: ({ pageParam }) => fetchReelsFeed({
      page: pageParam,
      limit: 10,
      mode
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

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
        feedQuery.fetchNextPage();
      }
    }, { threshold: 0.1 });
    
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [feedQuery]);

  // Actions mutation
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

  return (
    <PageLayout fullWidth className="max-w-5xl px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            Vibe
          </Badge>
          <Badge className="bg-purple-600 text-white border-0">
            UGC Reels
          </Badge>
        </div>
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Creator-driven learning reels</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Upload, engage, and grow reach. Vertical feed with latest, trending, and recommended modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4" />
              Create Reel
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              Sound {isMuted ? "Off" : "On"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger value="reels" className="gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              <Film className="w-4 h-4" />
              Reels
            </TabsTrigger>
            <TabsTrigger value="feed" className="gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              <Rss className="w-4 h-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="showcase" className="gap-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              <Award className="w-4 h-4" />
              Showcase
            </TabsTrigger>
          </TabsList>

          {/* Mode Filters */}
          <div className="flex items-center gap-2">
            {FEED_MODES.map((item) => (
              <Button
                key={item.key}
                variant={mode === item.key ? "default" : "outline"}
                size="sm"
                onClick={() => setMode(item.key)}
                className={mode === item.key 
                  ? "bg-cyan-500 hover:bg-cyan-600 text-black" 
                  : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Reels Tab */}
        <TabsContent value="reels" className="mt-4">
          {feedQuery.isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : reels.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900 border-zinc-800">
              <Film className="w-12 h-12 text-zinc-500 mb-4" />
              <p className="font-medium text-lg text-white">No reels yet</p>
              <p className="text-sm text-zinc-400 mt-1">Be the first creator to upload!</p>
              <Button className="mt-4 gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Create Reel
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {reels.map((reel) => (
                <ReelCard
                  key={reel._id}
                  reel={reel}
                  isMuted={isMuted}
                  onLike={() => actionMutation.mutate({ type: "like", reelId: reel._id })}
                  onComment={() => openCommentDialog(reel._id)}
                  onShare={() => handleShare(reel)}
                  onSave={() => actionMutation.mutate({ type: "save", reelId: reel._id })}
                  onViewed={() => trackReelView(reel._id).catch(() => {})}
                  onToggleMute={() => setIsMuted(!isMuted)}
                />
              ))}

              {/* Load More */}
              <div ref={loadMoreRef} className="py-6 flex justify-center">
                {feedQuery.isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Feed Tab - Instagram-style Posts */}
        <TabsContent value="feed" className="mt-4">
          {feedQuery.isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            </div>
          ) : reels.length === 0 ? (
            <Card className="p-8 text-center bg-zinc-900 border-zinc-800">
              <Rss className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <p className="font-medium text-white">No posts yet</p>
              <p className="text-sm text-zinc-400 mt-1">Start following creators to see their posts</p>
            </Card>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              {reels.map((reel) => (
                <Card key={reel._id} className="overflow-hidden bg-zinc-900 border-zinc-800">
                  {/* Post Header - User Profile */}
                  <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {reel.creator?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{reel.creator?.name || "Anonymous"}</p>
                      <p className="text-zinc-500 text-xs">
                        {reel.creator?.followers || 0} followers • {new Date(reel.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      Follow
                    </Button>
                  </div>

                  {/* Post Media */}
                  <div className="relative bg-black aspect-square">
                    <video 
                      src={resolveMediaUrl(reel.videoUrl)} 
                      className="w-full h-full object-contain" 
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  {/* Post Actions */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => actionMutation.mutate({ type: "like", reelId: reel._id })}
                          className="flex items-center gap-2 hover:text-red-400 transition-colors"
                        >
                          <Heart className={`w-6 h-6 ${reel.isLiked ? "text-red-500 fill-red-500" : "text-zinc-400"}`} />
                          <span className="text-sm text-white font-medium">{reel.stats?.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => openCommentDialog(reel._id)}
                          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                          <MessageCircle className="w-6 h-6 text-zinc-400" />
                          <span className="text-sm text-white font-medium">{reel.stats?.comments || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleShare(reel)}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          <Share2 className="w-6 h-6 text-zinc-400" />
                        </button>
                      </div>
                      <button 
                        onClick={() => actionMutation.mutate({ type: "save", reelId: reel._id })}
                        className="hover:text-yellow-400 transition-colors"
                      >
                        <Bookmark className={`w-6 h-6 ${reel.isSaved ? "text-yellow-500 fill-yellow-500" : "text-zinc-400"}`} />
                      </button>
                    </div>

                    {/* Post Caption */}
                    <div>
                      <p className="text-white">
                        <span className="font-semibold mr-2">{reel.creator?.name || "Anonymous"}</span>
                        <span className="text-zinc-300">{reel.caption || reel.title}</span>
                      </p>
                      {reel.description && (
                        <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{reel.description}</p>
                      )}
                    </div>

                    {/* View Comments Link */}
                    {reel.stats?.comments > 0 && (
                      <button 
                        onClick={() => openCommentDialog(reel._id)}
                        className="text-zinc-500 text-sm hover:text-zinc-400 transition-colors"
                      >
                        View all {reel.stats.comments} comments
                      </button>
                    )}
                  </div>
                </Card>
              ))}

              {/* Load More */}
              <div ref={loadMoreRef} className="py-6 flex justify-center">
                {feedQuery.isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Showcase Tab */}
        <TabsContent value="showcase" className="mt-4">
          <ShowcaseSection />
        </TabsContent>
      </Tabs>

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
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
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
    </PageLayout>
  );
};

export default Vibe;
