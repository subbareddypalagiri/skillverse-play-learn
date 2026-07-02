import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPostsFeed,
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
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/apiClient";

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await apiClient.delete(`/posts/${id}`);
      } catch {
        await apiClient.delete(`/reels/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts-feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
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
    setCommentDialogOpen(false);
  };

  if (feedQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* Category Filter */}
      <div className="sticky top-32 bg-black/95 backdrop-blur border-b border-gray-800 py-4 px-4 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  feedQuery.refetch();
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4">
        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xl font-semibold text-white mb-2">No posts yet</p>
            <p className="text-gray-400">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
                {/* Header */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {(post.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{post.user?.name || "Unknown"}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {post.category && post.category !== 'general' && (
                      <span className="inline-block px-2.5 py-0.5 bg-gray-800 rounded-full text-white text-xs">
                        #{post.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption */}
                {post.caption && (
                  <div className="px-4 py-3">
                    <p className="text-white text-sm leading-relaxed">{post.caption}</p>
                  </div>
                )}

                {/* Media */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="bg-black max-h-96 overflow-hidden flex items-center justify-center">
                    {post.mediaType === 'image' ? (
                      <img
                        src={resolveMediaUrl(post.mediaUrls[0].url)}
                        alt="Post"
                        className="w-full h-auto object-cover"
                      />
                    ) : post.mediaType === 'video' ? (
                      <video
                        src={resolveMediaUrl(post.mediaUrls[0].url)}
                        className="w-full h-auto object-cover"
                        controls
                      />
                    ) : null}
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-cyan-400 text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="px-4 py-2 border-t border-gray-800 text-xs text-gray-400 flex gap-4">
                  <span>{post.stats.likes} likes</span>
                  <span>{post.stats.comments} comments</span>
                  <span>{post.stats.saves} saves</span>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-800 flex gap-4">
                  <button
                    onClick={() => actionMutation.mutate({ type: "like", postId: post._id })}
                    disabled={actionMutation.isPending}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      post.isLiked
                        ? "bg-red-500/20 text-red-400"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                    <span className="text-xs">{post.stats.likes}</span>
                  </button>

                  <button
                    onClick={() => openCommentDialog(post._id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.stats.comments}</span>
                  </button>

                  <button
                    onClick={() => actionMutation.mutate({ type: "save", postId: post._id })}
                    disabled={actionMutation.isPending}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      post.isSaved
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""}`} />
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {user && (post.user?._id === user._id || (post as any).userId === user._id) && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this post?")) {
                          deleteMutation.mutate(post._id);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-400/80 hover:bg-red-500/10 hover:text-red-400 ml-auto transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Recent Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-800 bg-black/50 space-y-2">
                    {post.comments.slice(-2).map((comment) => (
                      <div key={comment._id} className="text-xs">
                        <span className="text-gray-400">{comment.user?.name || "User"}:</span>
                        <p className="text-white mt-0.5 line-clamp-2">{comment.text}</p>
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
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
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
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add a comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCommentDialogOpen(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={submitComment}
                disabled={!commentText.trim() || actionMutation.isPending}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {actionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
