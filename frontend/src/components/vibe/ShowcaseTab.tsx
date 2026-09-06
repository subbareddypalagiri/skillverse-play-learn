import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getShowcase,
  getShowcaseStats,
  connectGithub,
  connectLinkedIn,
  connectLeetCode,
  connectCodeforces,
  connectHackerrank,
  connectStackoverflow,
  connectDevto,
  connectPortfolio,
  connectCodepen,
  disconnectPlatform,
  refreshPlatform,
  parseConnectInput,
  type PlatformId,
  type ShowcaseData,
} from "@/lib/showcaseApi";
import {
  Github, Linkedin, Code2, Loader2, LinkIcon, Unlink, RefreshCw,
  ExternalLink, Trophy, Globe, BookOpen, Palette, Sparkles, CheckCircle2,
  Zap, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { LucideIcon } from "lucide-react";

type Category = "all" | "coding" | "competitive" | "professional" | "creative";

interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
  category: Category;
  gradient: string;
  glow: string;
  description: string;
  placeholder: string;
  hint: string;
  inputType: "username" | "url" | "userId";
}

const PLATFORMS: PlatformConfig[] = [
  { id: "github", name: "GitHub", icon: Github, category: "coding", gradient: "from-zinc-700 to-zinc-900", glow: "shadow-zinc-500/20", description: "Repos, stars & contributions", placeholder: "username or github.com/you", hint: "Paste profile URL or enter @username", inputType: "username" },
  { id: "leetcode", name: "LeetCode", icon: Code2, category: "competitive", gradient: "from-amber-700 to-orange-900", glow: "shadow-amber-500/20", description: "Problems solved & ranking", placeholder: "username or leetcode.com/u/you", hint: "Your LeetCode handle", inputType: "username" },
  { id: "codeforces", name: "CodeForces", icon: Trophy, category: "competitive", gradient: "from-blue-700 to-indigo-900", glow: "shadow-blue-500/20", description: "CP rating & contests", placeholder: "handle or codeforces.com/profile/you", hint: "Competitive programming handle", inputType: "username" },
  { id: "hackerrank", name: "HackerRank", icon: Code2, category: "competitive", gradient: "from-emerald-700 to-green-900", glow: "shadow-emerald-500/20", description: "Badges & challenge points", placeholder: "username or hackerrank.com/you", hint: "HackerRank profile name", inputType: "username" },
  { id: "stackoverflow", name: "Stack Overflow", icon: BookOpen, category: "professional", gradient: "from-orange-700 to-amber-900", glow: "shadow-orange-500/20", description: "Reputation & community answers", placeholder: "User ID or profile URL", hint: "Find ID in stackoverflow.com/users/12345", inputType: "userId" },
  { id: "devto", name: "Dev.to", icon: BookOpen, category: "professional", gradient: "from-slate-600 to-slate-800", glow: "shadow-slate-500/20", description: "Technical articles & followers", placeholder: "username or dev.to/you", hint: "Your Dev.to username", inputType: "username" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, category: "professional", gradient: "from-blue-800 to-blue-950", glow: "shadow-blue-500/20", description: "Professional headline & network", placeholder: "linkedin.com/in/yourname", hint: "Full LinkedIn profile URL", inputType: "url" },
  { id: "codepen", name: "CodePen", icon: Palette, category: "creative", gradient: "from-cyan-700 to-teal-900", glow: "shadow-cyan-500/20", description: "Frontend pens & demos", placeholder: "username or codepen.io/you", hint: "CodePen username", inputType: "username" },
  { id: "portfolio", name: "Portfolio", icon: Globe, category: "creative", gradient: "from-purple-700 to-fuchsia-900", glow: "shadow-purple-500/20", description: "Personal website & projects", placeholder: "https://yoursite.com", hint: "Your live portfolio URL", inputType: "url" },
];

const CATEGORIES: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "coding", label: "Coding", icon: Github },
  { id: "competitive", label: "Competitive", icon: Trophy },
  { id: "professional", label: "Professional", icon: Linkedin },
  { id: "creative", label: "Creative", icon: Palette },
];

const CONNECT_FNS: Record<PlatformId, (input: string, extra?: { headline?: string; title?: string }) => Promise<ShowcaseData>> = {
  github: (v) => connectGithub(parseConnectInput("github", v)),
  leetcode: (v) => connectLeetCode(parseConnectInput("leetcode", v)),
  codeforces: (v) => connectCodeforces(parseConnectInput("codeforces", v)),
  hackerrank: (v) => connectHackerrank(parseConnectInput("hackerrank", v)),
  stackoverflow: (v) => connectStackoverflow(parseConnectInput("stackoverflow", v)),
  devto: (v) => connectDevto(parseConnectInput("devto", v)),
  codepen: (v) => connectCodepen(parseConnectInput("codepen", v)),
  linkedin: (v, e) => connectLinkedIn(v.startsWith("http") ? v : `https://linkedin.com/in/${v}`, e?.headline),
  portfolio: (v, e) => connectPortfolio(v.startsWith("http") ? v : `https://${v}`, e?.title),
};

function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function ConnectedStats({ platform, data }: { platform: PlatformConfig; data: Record<string, unknown> }) {
  switch (platform.id) {
    case "github":
      return (
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-zinc-800 bg-zinc-950/40 rounded-lg px-2">
          <StatPill label="Repos" value={data.publicRepos as number} color="text-amber-400" />
          <StatPill label="Stars" value={data.totalStars as number} color="text-amber-400" />
          <StatPill label="Followers" value={data.followers as number} color="text-white/80" />
          <StatPill label="Following" value={data.following as number} color="text-white/80" />
        </div>
      );
    case "leetcode":
      return (
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-zinc-800 bg-zinc-950/40 rounded-lg px-2">
          <StatPill label="Solved" value={data.totalSolved as number} color="text-amber-400" />
          <StatPill label="Easy" value={data.easySolved as number} color="text-emerald-400" />
          <StatPill label="Medium" value={data.mediumSolved as number} color="text-amber-400" />
          <StatPill label="Hard" value={data.hardSolved as number} color="text-red-400" />
        </div>
      );
    case "codeforces":
      return (
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-800 bg-zinc-950/40 rounded-lg px-2">
          <StatPill label="Rating" value={data.rating as number} color="text-blue-400" />
          <StatPill label="Max" value={data.maxRating as number} color="text-blue-300" />
        </div>
      );
    case "hackerrank":
      return (
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-800 bg-zinc-950/40 rounded-lg px-2">
          <StatPill label="Badges" value={data.badges as number} color="text-emerald-400" />
          <StatPill label="Points" value={data.points as number} color="text-emerald-300" />
        </div>
      );
    case "stackoverflow":
      return (
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-800 bg-zinc-950/40 rounded-lg px-2">
          <StatPill label="Rep" value={data.reputation as number} color="text-orange-400" />
          <StatPill label="Badges" value={data.badges as number} color="text-orange-300" />
        </div>
      );
    default:
      return null;
  }
}

export default function ShowcaseTab() {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<Category>("all");
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [headline, setHeadline] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");

  const showcaseQuery = useQuery({
    queryKey: ["showcase"],
    queryFn: () => getShowcase(),
    staleTime: 1000 * 60 * 5,
  });
  const statsQuery = useQuery({
    queryKey: ["showcase-stats"],
    queryFn: () => getShowcaseStats(),
    staleTime: 1000 * 60 * 5,
  });

  const connectMutation = useMutation({
    mutationFn: async ({ platform, value, extra }: { platform: PlatformId; value: string; extra?: { headline?: string; title?: string } }) => {
      return CONNECT_FNS[platform](value, extra);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["showcase"], data);
      }
      queryClient.invalidateQueries({ queryKey: ["showcase"] });
      queryClient.invalidateQueries({ queryKey: ["showcase-stats"] });
      setConnecting(null);
      setInputs({});
      setHeadline("");
      setPortfolioTitle("");
      toast.success("Profile connected successfully!");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Connection failed — check username or URL");
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectPlatform,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["showcase"], data);
      }
      queryClient.invalidateQueries({ queryKey: ["showcase"] });
      queryClient.invalidateQueries({ queryKey: ["showcase-stats"] });
      toast.success("Disconnected");
    },
  });

  const refreshMutation = useMutation({
    mutationFn: refreshPlatform,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["showcase"], data);
      }
      queryClient.invalidateQueries({ queryKey: ["showcase"] });
      queryClient.invalidateQueries({ queryKey: ["showcase-stats"] });
      toast.success("Stats refreshed");
    },
    onError: () => toast.error("Refresh failed"),
  });

  const filteredPlatforms = useMemo(
    () => (category === "all" ? PLATFORMS : PLATFORMS.filter((p) => p.category === category)),
    [category]
  );

  const showcase = showcaseQuery.data;
  const stats = statsQuery.data;
  const connectedCount = stats?.connected ?? PLATFORMS.filter((p) => showcase?.[p.id]?.connected).length;

  if (showcaseQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      {/* Hero stats */}
      <div className="mb-8 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400/80">Achievement Hub</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Your Showcase</h2>
            <p className="text-zinc-400 text-sm max-w-md">
              Link GitHub, LeetCode, CodeForces & more — paste a profile URL or username and we handle the rest
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke="url(#grad)" strokeWidth="3"
                    strokeDasharray={`${(connectedCount / PLATFORMS.length) * 97.4} 97.4`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {connectedCount}/{PLATFORMS.length}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Connected</p>
            </div>
            {stats?.score !== undefined && (
              <div className="text-center px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-center">
                  <Zap className="w-5 h-5" />{stats.score}
                </p>
                <p className="text-xs text-zinc-400">Impact Score</p>
              </div>
            )}
          </div>
        </div>

        {/* Connected quick links */}
        {connectedCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-zinc-800">
            {PLATFORMS.filter((p) => showcase?.[p.id]?.connected).map((p) => {
              const d = showcase?.[p.id] as { profileUrl?: string; websiteUrl?: string; username?: string };
              const url = d?.profileUrl || d?.websiteUrl;
              return (
                <a
                  key={p.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/80 text-xs text-zinc-300 hover:text-amber-300 hover:border-amber-500/30 transition-all"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {p.name}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = cat.id === "all"
            ? PLATFORMS.length
            : PLATFORMS.filter((p) => p.category === cat.id).length;
          const connected = cat.id === "all"
            ? connectedCount
            : PLATFORMS.filter((p) => p.category === cat.id && showcase?.[p.id]?.connected).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${
                category === cat.id
                  ? "bg-violet-600/20 border-violet-500/50 text-violet-300 font-semibold shadow-sm"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {connected}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlatforms.map((platform) => {
          const data = showcase?.[platform.id] as Record<string, unknown> | undefined;
          const isConnected = !!data?.connected;
          const Icon = platform.icon;
          const profileUrl = (data?.profileUrl || data?.websiteUrl) as string | undefined;
          const displayName = (data?.username || data?.displayName || data?.headline || data?.title) as string | undefined;

          return (
            <div
              key={platform.id}
              className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                isConnected
                  ? "bg-zinc-900/90 border-violet-500/30 shadow-lg shadow-violet-500/5"
                  : "bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <div className={`bg-gradient-to-r ${platform.gradient} p-4 flex items-center gap-3`}>
                <div className="p-2 rounded-xl bg-black/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{platform.name}</h3>
                    {isConnected && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5">
                        Live
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/60 truncate">{platform.description}</p>
                </div>
              </div>

              <div className="p-5">
                {isConnected && data ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {platform.id === "github" && data.avatarUrl && (
                        <img src={data.avatarUrl as string} alt="" className="w-10 h-10 rounded-full ring-2 ring-amber-500/30" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{displayName || "Connected"}</p>
                        {data.bio && <p className="text-xs text-zinc-400 line-clamp-1">{data.bio as string}</p>}
                        {platform.id === "codeforces" && data.rank && (
                          <p className="text-xs text-blue-400">{data.rank as string}</p>
                        )}
                      </div>
                    </div>

                    <ConnectedStats platform={platform} data={data} />

                    {platform.id === "github" && Array.isArray(data.topLanguages) && (data.topLanguages as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {(data.topLanguages as string[]).map((lang) => (
                          <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">{lang}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      {profileUrl && (
                        <Button size="sm" variant="outline" className="flex-1 border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 text-white text-xs" onClick={() => window.open(profileUrl, "_blank")}>
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> Visit
                        </Button>
                      )}
                      {platform.id !== "portfolio" && platform.id !== "linkedin" && (
                        <Button size="sm" variant="outline" className="border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 text-white text-xs" onClick={() => refreshMutation.mutate(platform.id)} disabled={refreshMutation.isPending}>
                          <RefreshCw className={`w-3.5 h-3.5 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs" onClick={() => disconnectMutation.mutate(platform.id)} disabled={disconnectMutation.isPending}>
                        <Unlink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-zinc-400 text-xs mb-4">{platform.hint}</p>
                    <Dialog open={connecting === platform.id} onOpenChange={(open) => setConnecting(open ? platform.id : null)}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold">
                          <LinkIcon className="w-4 h-4 mr-2" /> Connect {platform.name}
                          <ChevronRight className="w-4 h-4 ml-1 opacity-60" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-amber-400" />
                            Connect {platform.name}
                          </DialogTitle>
                          <DialogDescription className="text-xs text-zinc-400">
                            Enter your {platform.name} handle or profile link to connect.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                          <div>
                            <Input
                              placeholder={platform.placeholder}
                              value={inputs[platform.id] || ""}
                              onChange={(e) => setInputs({ ...inputs, [platform.id]: e.target.value })}
                              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                            <p className="text-[11px] text-zinc-500 mt-1.5">{platform.hint}</p>
                          </div>
                          {platform.id === "linkedin" && (
                            <Input
                              placeholder="Headline (optional)"
                              value={headline}
                              onChange={(e) => setHeadline(e.target.value)}
                              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                          )}
                          {platform.id === "portfolio" && (
                            <Input
                              placeholder="Site title (optional)"
                              value={portfolioTitle}
                              onChange={(e) => setPortfolioTitle(e.target.value)}
                              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                          )}
                          <Button
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold"
                            disabled={!inputs[platform.id]?.trim() || connectMutation.isPending}
                            onClick={() => connectMutation.mutate({
                              platform: platform.id,
                              value: inputs[platform.id],
                              extra: platform.id === "linkedin" ? { headline } : platform.id === "portfolio" ? { title: portfolioTitle } : undefined,
                            })}
                          >
                            {connectMutation.isPending ? (
                              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Connecting...</>
                            ) : (
                              <><LinkIcon className="w-4 h-4 mr-2" /> Connect Now</>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showcaseQuery.isError && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          Could not load showcase — make sure you are logged in and the backend is running
        </div>
      )}
    </div>
  );
}
