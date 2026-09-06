import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPostsFeed,
  createPost,
  likePost,
  savePost,
  commentOnPost,
  sharePost,
  Post
} from "@/lib/feedApi";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Send,
  Sparkles,
  Tag
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

export default function FeedTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Create Post Form State
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/posts/${id}`);
      } catch {
        await apiClient.delete(`/reels/${id}`);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const mediaUrls = newMediaUrl.trim() ? [{ url: newMediaUrl.trim() }] : [];
      const mediaType = mediaUrls.length > 0 ? 'image' : 'text';
      return createPost({
        caption: newCaption.trim(),
        mediaType,
        mediaUrls,
        category: newCategory,
        tags: [newCategory]
      });
    },
    onSuccess: () => {
      toast.success("Post published to Feed!");
      setNewCaption("");
      setNewMediaUrl("");
      setShowMediaInput(false);
      setNewCategory("general");
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to publish post");
    }
  });

  const categories = ['all', 'general', 'achievement', 'project', 'learning', 'career', 'question', 'tip'];

  const feedQuery = useInfiniteQuery({
    queryKey: ["posts-feed", selectedCategory],
    queryFn: ({ pageParam }) => fetchPostsFeed(pageParam, 10, selectedCategory),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < Math.ceil(lastPage.pagination.total / 10)) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    }
  });

  const posts = feedQuery.data?.pages.flatMap((page) => page.data) || [];

  const actionMutation = useMutation({
    mutationFn: async ({ type, postId, text }: { type: "like" | "save" | "comment"; postId: string; text?: string }) => {
      if (type === "like") return likePost(postId);
      if (type === "save") return savePost(postId);
      return commentOnPost(postId, text || "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
    }
  });

  const handleShare = async (post: Post) => {
    const postUrl = `${window.location.origin}/vibe?post=${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.caption || "Shared Post",
          text: post.caption || "Check this out!",
          url: postUrl
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied to clipboard!");
    }
    await sharePost(post._id);
    queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
  };

  const openCommentDialog = (postId: string) => {
    setActiveCommentPostId(postId);
    setCommentDialogOpen(true);
  };

  const submitComment = async () => {
    if (!activeCommentPostId || !commentText.trim()) return;
    await actionMutation.mutateAsync({ type: "comment", postId: activeCommentPostId, text: commentText });
    setCommentText("");
    toast.success("Comment added!");
    queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
  };

  if (feedQuery.isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      {/* 1. Create Post Card */}
      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 shadow-xl mb-6 backdrop-blur-sm">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-md">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Share an update, project win, or learning milestone..."
              rows={2}
              className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 resize-none transition-colors"
            />

            {showMediaInput && (
              <div className="flex items-center gap-2">
                <Input
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="bg-zinc-950/60 border-zinc-800 text-xs text-white"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-zinc-800/80 rounded-lg px-2.5 py-1 border border-zinc-700/60 text-xs text-zinc-300">
                  <Tag className="w-3 h-3 text-violet-400" />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-transparent text-xs text-zinc-300 focus:outline-none"
                  >
                    {categories.filter(c => c !== 'all').map(c => (
                      <option key={c} value={c} className="bg-zinc-900">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMediaInput(!showMediaInput)}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    showMediaInput || newMediaUrl
                      ? "bg-violet-600/20 border-violet-500/50 text-violet-300"
                      : "bg-zinc-800/80 border-zinc-700/60 text-zinc-400 hover:text-white"
                  }`}
                  title="Attach image URL"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                onClick={() => createPostMutation.mutate()}
                disabled={!newCaption.trim() || createPostMutation.isPending}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-md shadow-violet-500/20 transition-all"
              >
                {createPostMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Send className="w-3.5 h-3.5 mr-1" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              feedQuery.refetch();
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-violet-600/20 border-violet-500/50 text-violet-200 shadow-sm shadow-violet-500/20"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length === 0 ? (
          <div className="py-16 text-center bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
            <p className="text-base font-semibold text-white mb-1">No posts yet</p>
            <p className="text-zinc-500 text-xs">Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-xl backdrop-blur-sm">
                {/* Header */}
                <div className="p-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {(post.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{post.user?.name || "Unknown"}</p>
                      <p className="text-zinc-400 text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {post.category && post.category !== 'general' && (
                      <span className="inline-block px-2.5 py-0.5 bg-zinc-800 border border-zinc-700/60 rounded-full text-zinc-300 text-xs">
                        #{post.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption */}
                {post.caption && (
                  <div className="px-4 py-3">
                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{post.caption}</p>
                  </div>
                )}

                {/* Media */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="bg-black max-h-96 overflow-hidden flex items-center justify-center border-y border-zinc-800/60">
                    {post.mediaType === 'image' ? (
                      <img
                        src={resolveMediaUrl(post.mediaUrls[0].url)}
                        alt="Post"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    ) : post.mediaType === 'video' ? (
                      <video
                        src={resolveMediaUrl(post.mediaUrls[0].url)}
                        className="w-full h-auto max-h-96 object-contain"
                        controls
                      />
                    ) : null}
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="px-4 py-2 border-t border-zinc-800/60">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-violet-400 text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats & Actions */}
                <div className="px-4 py-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actionMutation.mutate({ type: "like", postId: post._id })}
                      disabled={actionMutation.isPending}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        post.isLiked
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span>{post.stats.likes}</span>
                    </button>

                    <button
                      onClick={() => openCommentDialog(post._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.stats.comments}</span>
                    </button>

                    <button
                      onClick={() => actionMutation.mutate({ type: "save", postId: post._id })}
                      disabled={actionMutation.isPending}
                      className={`p-2 rounded-xl transition-colors ${
                        post.isSaved
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {user && (post.user?._id === user._id || (post as any).userId === user._id) && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this post?")) {
                          deleteMutation.mutate(post._id);
                        }
                      }}
                      className="p-2 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Recent Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                  <div className="px-4 py-3 border-t border-zinc-800/60 bg-zinc-950/40 space-y-2">
                    {post.comments.slice(-2).map((comment) => (
                      <div key={comment._id} className="text-xs">
                        <span className="font-semibold text-zinc-300 mr-2">{comment.user?.name || "User"}:</span>
                        <span className="text-zinc-400">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {feedQuery.hasNextPage && (
          <div className="py-6 text-center">
            <Button
              onClick={() => feedQuery.fetchNextPage()}
              disabled={feedQuery.isFetchingNextPage}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold px-6"
            >
              {feedQuery.isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-violet-400" /> Comments
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500 text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCommentDialogOpen(false)}
                className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={submitComment}
                disabled={!commentText.trim() || actionMutation.isPending}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs"
              >
                {actionMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
