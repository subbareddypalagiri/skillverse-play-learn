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
import { useState } from "react";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");

const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
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

  const reels = reelsQuery.data?.reels || [];

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
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-400" />
              Creator Analytics
            </h2>
            <p className="text-white/40 text-sm mt-1">Track how your reels perform</p>
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
              { label: "Total Views", value: totalStats.views, icon: Eye, color: "text-blue-400", bg: "from-blue-500/10 to-blue-600/5" },
              { label: "Total Likes", value: totalStats.likes, icon: Heart, color: "text-red-400", bg: "from-red-500/10 to-red-600/5" },
              { label: "Comments", value: totalStats.comments, icon: MessageCircle, color: "text-cyan-400", bg: "from-cyan-500/10 to-cyan-600/5" },
              { label: "Shares", value: totalStats.shares, icon: Share2, color: "text-green-400", bg: "from-green-500/10 to-green-600/5" },
              { label: "Engagement", value: `${engagementRate}%`, icon: Target, color: "text-amber-400", bg: "from-amber-500/10 to-amber-600/5" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${stat.bg} p-4 backdrop-blur`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No reels yet</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
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
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Per-Reel Performance
            </h3>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likes" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {pieData.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
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
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-5">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Zap className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Top Performer</h3>
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
              {topReel.mediaUrls[0]?.url && (
                <img
                  src={resolveMediaUrl(topReel.mediaUrls[0].url)}
                  alt="Top reel"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm line-clamp-2">{topReel.caption || "Untitled Reel"}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-blue-400">
                  <Eye className="w-3.5 h-3.5" />{topReel.stats?.views || 0}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-3.5 h-3.5" />{topReel.stats?.likes || 0}
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
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
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-amber-400" />
            All Reels ({reels.length})
          </h3>
          <div className="grid gap-4">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-amber-500/30 transition-all group"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 relative border border-white/10">
                    {reel.mediaUrls[0]?.url && (
                      <>
                        <img
                          src={resolveMediaUrl(reel.mediaUrls[0].url)}
                          alt={reel.caption || "Reel"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold line-clamp-2 mb-1">{reel.caption || "Untitled Reel"}</h4>
                    <p className="text-xs text-white/40 mb-3">
                      {new Date(reel.createdAt).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { val: reel.stats?.views || 0, label: "Views", color: "text-blue-400" },
                        { val: reel.stats?.likes || 0, label: "Likes", color: "text-red-400" },
                        { val: reel.stats?.comments || 0, label: "Comments", color: "text-cyan-400" },
                        { val: reel.stats?.shares || 0, label: "Shares", color: "text-green-400" },
                      ].map((s) => (
                        <div key={s.label} className="bg-white/5 rounded-lg px-2 py-1.5">
                          <div className={`font-bold ${s.color}`}>{s.val}</div>
                          <div className="text-white/30">{s.label}</div>
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
        <AlertDialogContent className="bg-[#0a0a14] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reel?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This action cannot be undone. Your reel will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="bg-white/5 text-white border-white/10 hover:bg-white/10">
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
