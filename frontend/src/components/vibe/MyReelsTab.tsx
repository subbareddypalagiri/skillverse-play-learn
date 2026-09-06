import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { deletePost } from "@/lib/feedApi";
import {
  Eye, Heart, MessageCircle, Share2, Loader2, Trash2,
  TrendingUp, Play, BarChart3, Zap, Plus, Sparkles, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useMemo } from "react";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

const getReelVideoUrl = (reel: any) => {
  return reel?.mediaUrls?.[0]?.url || reel?.videoUrl || "";
};

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const fetchMyReels = async () => {
  const response = await apiClient.get('/posts/my-reels');
  return response.data;
};

const chartConfig = {
  views: { label: "Views", color: "#60a5fa" },
  likes: { label: "Likes", color: "#f87171" },
  comments: { label: "Comments", color: "#22d3ee" },
  shares: { label: "Shares", color: "#4ade80" },
};

const PIE_COLORS = ["#60a5fa", "#f87171", "#22d3ee", "#4ade80"];

interface MyReelsTabProps {
  onUploadClick?: () => void;
}

function ReelThumbnail({ reel, className = "w-24 h-24" }: { reel: any; className?: string }) {
  const mediaUrl = getReelVideoUrl(reel);
  const resolvedUrl = resolveMediaUrl(mediaUrl);
  const ytId = getYouTubeId(mediaUrl);

  return (
    <div className={`${className} rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 relative border border-zinc-800`}>
      {ytId ? (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : resolvedUrl ? (
        <video
          src={resolvedUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
          <Play className="w-6 h-6 text-zinc-600" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
        <Play className="w-5 h-5 text-white fill-white" />
      </div>
    </div>
  );
}

export default function MyReelsTab({ onUploadClick }: MyReelsTabProps) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const reelsQuery = useQuery({
    queryKey: ["my-reels"],
    queryFn: () => fetchMyReels(),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reels"] });
      setDeleteId(null);
    },
  });

  // Deduplicate reels by normalized URL or ID
  const reels = useMemo(() => {
    const rawReels: any[] = reelsQuery.data?.data?.reels || reelsQuery.data?.reels || [];
    const seen = new Set<string>();
    const unique: any[] = [];
    for (const reel of rawReels) {
      const vUrl = getReelVideoUrl(reel).trim();
      const normKey = vUrl ? vUrl.replace(/[?#].*$/, '').toLowerCase() : null;
      const key = normKey || reel._id;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(reel);
      }
    }
    return unique;
  }, [reelsQuery.data]);

  const totalStats = reels.reduce(
    (acc, reel) => ({
      views: acc.views + (reel.stats?.views || 0),
      likes: acc.likes + (reel.stats?.likes || 0),
      comments: acc.comments + (reel.stats?.comments || 0),
      shares: acc.shares + (reel.stats?.shares || 0),
    }),
    { views: 0, likes: 0, comments: 0, shares: 0 }
  );

  const engagementRate = totalStats.views > 0
    ? (((totalStats.likes + totalStats.comments + totalStats.shares) / totalStats.views) * 100).toFixed(1)
    : "0";

  const topReel = reels.length > 0
    ? reels.reduce((max, reel) =>
        (reel.stats?.views || 0) > (max.stats?.views || 0) ? reel : max
      )
    : null;

  const barChartData = reels.slice(0, 6).map((reel, i) => ({
    name: `#${i + 1}`,
    views: reel.stats?.views || 0,
    likes: reel.stats?.likes || 0,
    comments: reel.stats?.comments || 0,
  }));

  const pieData = [
    { name: "Views", value: totalStats.views },
    { name: "Likes", value: totalStats.likes },
    { name: "Comments", value: totalStats.comments },
    { name: "Shares", value: totalStats.shares },
  ].filter(d => d.value > 0);

  if (reelsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* Hero stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              Creator Analytics
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Track how your reels perform</p>
          </div>
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] transition-transform"
            >
              <Plus className="w-4 h-4" />
              New Reel
            </button>
          )}
        </div>

        {reels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total Views", value: totalStats.views, icon: Eye, color: "text-blue-400" },
              { label: "Total Likes", value: totalStats.likes, icon: Heart, color: "text-red-400" },
              { label: "Comments", value: totalStats.comments, icon: MessageCircle, color: "text-cyan-400" },
              { label: "Shares", value: totalStats.shares, icon: Share2, color: "text-green-400" },
              { label: "Engagement", value: `${engagementRate}%`, icon: Target, color: "text-amber-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md p-4 shadow-xl"
              >
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">No reels yet</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
              Post your first video and watch your analytics grow here
            </p>
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-orange-500"
              >
                <Sparkles className="w-4 h-4" />
                Create Your First Reel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Charts */}
      {reels.length > 1 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Per-Reel Performance
            </h3>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likes" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {pieData.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md p-5 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Engagement Breakdown
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {pieData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {d.name}: {d.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top performer */}
      {topReel && (
        <div className="mb-8 rounded-2xl border border-amber-500/30 bg-zinc-900/70 backdrop-blur-md p-5 shadow-2xl text-white">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Zap className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Top Performer</h3>
          </div>
          <div className="flex gap-4">
            <ReelThumbnail reel={topReel} className="w-20 h-20" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium line-clamp-2">{topReel.caption || "Untitled Reel"}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-blue-400 font-bold">
                  <Eye className="w-3.5 h-3.5" />{topReel.stats?.views || 0}
                </span>
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Heart className="w-3.5 h-3.5" />{topReel.stats?.likes || 0}
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <MessageCircle className="w-3.5 h-3.5" />{topReel.stats?.comments || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reels list */}
      {reels.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Play className="w-5 h-5 text-amber-400" />
            All Reels ({reels.length})
          </h3>
          <div className="grid gap-4">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md overflow-hidden hover:border-violet-500/40 shadow-xl transition-all group text-white"
              >
                <div className="flex gap-4 p-4">
                  <ReelThumbnail reel={reel} className="w-24 h-24" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold line-clamp-2 mb-1 text-white">{reel.caption || "Untitled Reel"}</h4>
                    <p className="text-xs text-zinc-400 mb-3 font-medium">
                      {new Date(reel.createdAt).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { val: reel.stats?.views || 0, label: "Views", color: "text-blue-400" },
                        { val: reel.stats?.likes || 0, label: "Likes", color: "text-red-400" },
                        { val: reel.stats?.comments || 0, label: "Comments", color: "text-cyan-400" },
                        { val: reel.stats?.shares || 0, label: "Shares", color: "text-green-400" },
                      ].map((s) => (
                        <div key={s.label} className="bg-zinc-950/70 border border-zinc-800/60 rounded-lg px-2 py-1.5">
                          <div className={`font-bold ${s.color}`}>{s.val}</div>
                          <div className="text-zinc-400 font-medium">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => setDeleteId(reel._id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reel?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. Your reel will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
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
