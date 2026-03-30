import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShowcase,
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
  ShowcaseData
} from "@/lib/showcaseApi";
import {
  Github,
  Linkedin,
  Code2,
  Loader2,
  LinkIcon,
  Unlink,
  RefreshCw,
  ExternalLink,
  Trophy,
  Globe,
  BookOpen,
  Palette
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Platform configuration
const PLATFORMS = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    color: "from-gray-800 to-black",
    accent: "text-white",
    description: "Code repositories & contributions"
  },
  {
    id: "codeforces",
    name: "CodeForces",
    icon: Trophy,
    color: "from-blue-700 to-blue-900",
    accent: "text-blue-400",
    description: "Competitive programming"
  },
  {
    id: "leetcode",
    name: "LeetCode",
    icon: Code2,
    color: "from-yellow-700 to-amber-900",
    accent: "text-yellow-400",
    description: "Problem solving"
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    icon: Code2,
    color: "from-green-700 to-green-900",
    accent: "text-green-400",
    description: "Coding challenges"
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    icon: BookOpen,
    color: "from-orange-700 to-orange-900",
    accent: "text-orange-400",
    description: "Q&A reputation"
  },
  {
    id: "devto",
    name: "Dev.to",
    icon: BookOpen,
    color: "from-slate-700 to-slate-900",
    accent: "text-slate-400",
    description: "Technical articles"
  },
  {
    id: "codepen",
    name: "CodePen",
    icon: Palette,
    color: "from-cyan-700 to-cyan-900",
    accent: "text-cyan-400",
    description: "Frontend projects"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "from-blue-700 to-blue-900",
    accent: "text-blue-300",
    description: "Professional profile"
  },
  {
    id: "portfolio",
    name: "Portfolio",
    icon: Globe,
    color: "from-purple-700 to-purple-900",
    accent: "text-purple-400",
    description: "Personal website"
  }
];

export default function ShowcaseTab() {
  const queryClient = useQueryClient();
  const [showcaseData, setShowcaseData] = useState<ShowcaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Input states for all platforms
  const [inputs, setInputs] = useState({
    github: "",
    linkedin: "",
    leetcode: "",
    codeforces: "",
    hackerrank: "",
    stackoverflow: "",
    devto: "",
    portfolio: "",
    codepen: ""
  });

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        setLoading(true);
        const data = await getShowcase();
        setShowcaseData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load showcase");
      } finally {
        setLoading(false);
      }
    };

    fetchShowcase();
  }, []);

  const connectMutation = useMutation({
    mutationFn: async ({ platform, data }: { platform: string; data: any }) => {
      switch (platform) {
        case "github":
          return connectGithub(data.username);
        case "linkedin":
          return connectLinkedIn(data.profileUrl, data.headline);
        case "leetcode":
          return connectLeetCode(data.username);
        case "codeforces":
          return connectCodeforces(data.username);
        case "hackerrank":
          return connectHackerrank(data.username);
        case "stackoverflow":
          return connectStackoverflow(data.userId);
        case "devto":
          return connectDevto(data.username);
        case "portfolio":
          return connectPortfolio(data.websiteUrl, data.title, data.description);
        case "codepen":
          return connectCodepen(data.username);
        default:
          throw new Error("Unknown platform");
      }
    },
    onSuccess: (data) => {
      setShowcaseData(data);
      setInputs({ github: "", linkedin: "", leetcode: "", codeforces: "", hackerrank: "", stackoverflow: "", devto: "", portfolio: "", codepen: "" });
      queryClient.invalidateQueries({ queryKey: ["showcase"] });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async (platform: string) => {
      return disconnectPlatform(platform as any);
    },
    onSuccess: (data) => {
      setShowcaseData(data);
    }
  });

  const refreshMutation = useMutation({
    mutationFn: async (platform: string) => {
      return refreshPlatform(platform as any);
    },
    onSuccess: (data) => {
      setShowcaseData(data);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );
  }

  const PlatformCard = ({ platform }: { platform: typeof PLATFORMS[0] }) => {
    const data = showcaseData?.[platform.id as keyof ShowcaseData] as any;
    const PlatformIcon = platform.icon;
    const isConnected = data?.connected;

    return (
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
        <div className={`bg-gradient-to-r ${platform.color} p-4 flex items-center gap-3`}>
          <PlatformIcon className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
            <p className="text-xs text-gray-300">{platform.description}</p>
          </div>
        </div>

        <div className="p-6">
          {isConnected ? (
            <div className="space-y-4">
              {/* GitHub Card */}
              {platform.id === "github" && data && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    {data.avatarUrl && (
                      <img src={data.avatarUrl} alt={data.username} className="w-12 h-12 rounded-full" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-semibold">{data.username}</p>
                      {data.bio && <p className="text-sm text-gray-400 line-clamp-1">{data.bio}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Repos</p><p className="text-xl font-bold text-yellow-400">{data.publicRepos}</p></div>
                    <div><p className="text-xs text-gray-400">Stars</p><p className="text-xl font-bold text-yellow-400">{data.totalStars}</p></div>
                    <div><p className="text-xs text-gray-400">Followers</p><p className="text-xl font-bold text-yellow-400">{data.followers}</p></div>
                    <div><p className="text-xs text-gray-400">Following</p><p className="text-xl font-bold text-yellow-400">{data.following}</p></div>
                  </div>
                  {data.topLanguages?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {data.topLanguages.map((lang: string) => (
                          <span key={lang} className="px-2.5 py-0.5 bg-gray-800 text-gray-300 text-xs rounded-full">{lang}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* CodeForces Card */}
              {platform.id === "codeforces" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.username}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Rating</p><p className="text-xl font-bold text-blue-400">{data.rating}</p></div>
                    <div><p className="text-xs text-gray-400">Max Rating</p><p className="text-xl font-bold text-blue-400">{data.maxRating}</p></div>
                    <div><p className="text-xs text-gray-400">Rank</p><p className="text-sm font-bold text-blue-400">{data.rank || "Unrated"}</p></div>
                    <div><p className="text-xs text-gray-400">Contests</p><p className="text-sm font-bold text-blue-400">{data.contestsCount}</p></div>
                  </div>
                </>
              )}

              {/* LeetCode Card */}
              {platform.id === "leetcode" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.username}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Solved</p><p className="text-xl font-bold text-yellow-400">{data.totalSolved}</p></div>
                    <div><p className="text-xs text-gray-400">Acceptance</p><p className="text-xl font-bold text-yellow-400">{data.acceptanceRate?.toFixed(1)}%</p></div>
                    <div><p className="text-xs text-gray-400">Easy</p><p className="text-sm font-bold text-green-400">{data.easySolved}</p></div>
                    <div><p className="text-xs text-gray-400">Medium</p><p className="text-sm font-bold text-yellow-400">{data.mediumSolved}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-400">Hard</p><p className="text-sm font-bold text-red-400">{data.hardSolved}</p></div>
                  </div>
                </>
              )}

              {/* HackerRank Card */}
              {platform.id === "hackerrank" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.username}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Points</p><p className="text-xl font-bold text-green-400">{data.points}</p></div>
                    <div><p className="text-xs text-gray-400">Badges</p><p className="text-xl font-bold text-green-400">{data.badges}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-400">Problems Solved</p><p className="text-sm font-bold text-green-400">{data.solvedProblems}</p></div>
                  </div>
                  {data.languages?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {data.languages.map((lang: string) => (
                          <span key={lang} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">{lang}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Stack Overflow Card */}
              {platform.id === "stackoverflow" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.displayName}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Reputation</p><p className="text-xl font-bold text-orange-400">{data.reputation}</p></div>
                    <div><p className="text-xs text-gray-400">Badges</p><p className="text-xl font-bold text-orange-400">{data.badges}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-400">Answers</p><p className="text-sm font-bold text-orange-400">{data.answers}</p></div>
                  </div>
                </>
              )}

              {/* Dev.to Card */}
              {platform.id === "devto" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.username}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Articles</p><p className="text-xl font-bold text-slate-400">{data.articlesCount}</p></div>
                    <div><p className="text-xs text-gray-400">Followers</p><p className="text-xl font-bold text-slate-400">{data.followers}</p></div>
                  </div>
                  {data.bio && <p className="text-sm text-gray-400 line-clamp-2 pt-2">{data.bio}</p>}
                </>
              )}

              {/* CodePen Card */}
              {platform.id === "codepen" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.username}</p></div>
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800">
                    <div><p className="text-xs text-gray-400">Pens</p><p className="text-xl font-bold text-cyan-400">{data.pens}</p></div>
                    <div><p className="text-xs text-gray-400">Followers</p><p className="text-xl font-bold text-cyan-400">{data.followers}</p></div>
                  </div>
                </>
              )}

              {/* LinkedIn Card */}
              {platform.id === "linkedin" && data && (
                <>
                  <div><p className="text-white font-semibold">{data.headline || "Professional"}</p></div>
                </>
              )}

              {/* Portfolio Card */}
              {platform.id === "portfolio" && data && (
                <>
                  {data.title && <p className="text-white font-semibold">{data.title}</p>}
                  {data.description && <p className="text-sm text-gray-400">{data.description}</p>}
                </>
              )}

              <div className="flex gap-2 pt-2">
                {data.profileUrl && (
                  <Button onClick={() => window.open(data.profileUrl, "_blank")} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm">
                    <ExternalLink className="w-4 h-4 mr-1" /> Visit
                  </Button>
                )}
                {data.websiteUrl && platform.id === "portfolio" && (
                  <Button onClick={() => window.open(data.websiteUrl, "_blank")} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm">
                    <ExternalLink className="w-4 h-4 mr-1" /> Visit
                  </Button>
                )}
                {["github", "codeforces", "leetcode", "hackerrank", "stackoverflow", "devto", "codepen", "linkedin"].includes(platform.id) && (
                  <Button onClick={() => refreshMutation.mutate(platform.id)} disabled={refreshMutation.isPending} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm">
                    <RefreshCw className={`w-4 h-4 mr-1 ${refreshMutation.isPending ? "animate-spin" : ""}`} /> Refresh
                  </Button>
                )}
                <Button onClick={() => disconnectMutation.mutate(platform.id)} disabled={disconnectMutation.isPending} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm">
                  <Unlink className="w-4 h-4 mr-1" /> Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm mb-4">Connect your {platform.name} profile</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    <LinkIcon className="w-4 h-4 mr-2" /> Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Connect {platform.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {platform.id === "linkedin" ? (
                      <Input placeholder="LinkedIn profile URL" value={inputs.linkedin} onChange={(e) => setInputs({...inputs, linkedin: e.target.value})} className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
                    ) : platform.id === "portfolio" ? (
                      <>
                        <Input placeholder="Website URL" value={inputs.portfolio} onChange={(e) => setInputs({...inputs, portfolio: e.target.value})} className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
                        <Input placeholder="Portfolio Title (optional)" className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
                      </>
                    ) : platform.id === "stackoverflow" ? (
                      <Input placeholder="Stack Overflow User ID" value={inputs.stackoverflow} onChange={(e) => setInputs({...inputs, stackoverflow: e.target.value})} className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
                    ) : (
                      <Input placeholder={`${platform.name} username`} value={inputs[platform.id as keyof typeof inputs]} onChange={(e) => setInputs({...inputs, [platform.id]: e.target.value})} className="bg-gray-800 border-gray-700 text-white placeholder-gray-500" />
                    )}
                    <Button
                      onClick={() => {
                        const inputValue = inputs[platform.id as keyof typeof inputs];
                        connectMutation.mutate({
                          platform: platform.id,
                          data: platform.id === "linkedin" ? { profileUrl: inputValue } : platform.id === "stackoverflow" ? { userId: inputValue } : platform.id === "portfolio" ? { websiteUrl: inputValue } : { username: inputValue }
                        });
                      }}
                      disabled={!inputs[platform.id as keyof typeof inputs]?.trim() || connectMutation.isPending}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      {connectMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Connecting...</> : "Connect"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pb-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-white mb-2">Your Showcase</h2>
        <p className="text-gray-400 mb-8">Connect your professional profiles and showcase your achievements</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </div>
  );
}
