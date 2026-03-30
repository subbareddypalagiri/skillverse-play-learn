import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { deletePost } from "@/lib/feedApi";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Trash2,
  TrendingUp,
  Play,
  BarChart3,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5002/api/v1").replace(/\/api\/v1\/?$/, "");

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

// Fetch both Post and Reel reels
const fetchMyReels = async () => {
  const response = await apiClient.get('/posts/my-reels');
  return response.data;
};

export default function MyReelsTab() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const reelsQuery = useQuery({
    queryKey: ["my-reels"],
    queryFn: () => fetchMyReels()
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
      setDeleteId(null);
    }
  });

  const reels = reelsQuery.data?.reels || [];

  // Calculate total stats
  const totalStats = reels.reduce(
    (acc, reel) => ({
      views: acc.views + (reel.stats?.views || 0),
      likes: acc.likes + (reel.stats?.likes || 0),
      comments: acc.comments + (reel.stats?.comments || 0),
      shares: acc.shares + (reel.stats?.shares || 0)
    }),
    { views: 0, likes: 0, comments: 0, shares: 0 }
  );

  const topReel = reels.length > 0
    ? reels.reduce((max, reel) => (reel.stats?.views || 0) > (max.stats?.views || 0) ? reel : max)
    : null;

  if (reelsQuery.isLoading) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Header Stats */}
      <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-slate-800 p-6 z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-yellow-400" />
          Your Reels Analytics
        </h2>

        {reels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Eye className="w-4 h-4 text-blue-400" />
                Total Views
              </div>
              <div className="text-3xl font-bold text-blue-400">{totalStats.views.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                Total Likes
              </div>
              <div className="text-3xl font-bold text-red-400">{totalStats.likes.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                Total Comments
              </div>
              <div className="text-3xl font-bold text-cyan-400">{totalStats.comments.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Share2 className="w-4 h-4 text-green-400" />
                Total Shares
              </div>
              <div className="text-3xl font-bold text-green-400">{totalStats.shares.toLocaleString()}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Top Performer */}
      {topReel && (
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-yellow-400 mb-4">
            <Zap className="w-5 h-5" />
            <h3 className="font-semibold">Top Performer</h3>
          </div>
          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-700/50 rounded-lg p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                {topReel.mediaUrls[0]?.url && (
                  <img
                    src={resolveMediaUrl(topReel.mediaUrls[0].url)}
                    alt="Top reel"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-slate-300 text-sm line-clamp-2">{topReel.caption || "Untitled Reel"}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Eye className="w-3 h-3" />
                    {topReel.stats?.views || 0}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <Heart className="w-3 h-3" />
                    {topReel.stats?.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reels List */}
      <div className="px-6 py-8">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Play className="w-5 h-5 text-yellow-400" />
          All Your Reels ({reels.length})
        </h3>

        {reels.length === 0 ? (
          <div className="text-center py-16">
            <Play className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No reels yet. Create your first reel to get started! 🎬</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-yellow-700/50 transition-all group"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {reel.mediaUrls[0]?.url && (
                      <>
                        <img
                          src={resolveMediaUrl(reel.mediaUrls[0].url)}
                          alt={reel.caption || "Reel"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-white line-clamp-2 mb-2">
                      {reel.caption || "Untitled Reel"}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Posted {new Date(reel.createdAt).toLocaleDateString()}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      <div className="bg-slate-800/50 rounded px-2 py-1.5">
                        <div className="text-blue-400 font-semibold">{reel.stats?.views || 0}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                          <Eye className="w-3 h-3" />
                          Views
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded px-2 py-1.5">
                        <div className="text-red-400 font-semibold">{reel.stats?.likes || 0}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                          <Heart className="w-3 h-3" />
                          Likes
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded px-2 py-1.5">
                        <div className="text-cyan-400 font-semibold">{reel.stats?.comments || 0}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                          <MessageCircle className="w-3 h-3" />
                          Comments
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded px-2 py-1.5">
                        <div className="text-green-400 font-semibold">{reel.stats?.shares || 0}</div>
                        <div className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                          <Share2 className="w-3 h-3" />
                          Shares
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                    <Button
                      onClick={() => setDeleteId(reel._id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Reel?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. Your reel will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
