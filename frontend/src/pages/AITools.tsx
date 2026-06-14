import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, Search, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { aiTools as fallbackTools, getCategoryIcon } from "@/lib/aiToolsData";
import { fetchAITools, fetchAIToolsMeta, fetchAIToolCategories } from "@/lib/aiToolsApi";
import type { AIToolItem } from "@/lib/aiToolsApi";

const formatLastSynced = (date: string | null) => {
  if (!date) return null;
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Synced just now";
  if (hours < 24) return `Synced ${hours}h ago`;
  return `Synced ${d.toLocaleDateString()}`;
};

const AITools = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tools = [], isLoading, isError } = useQuery({
    queryKey: ["ai-tools", selectedCategory, searchQuery],
    queryFn: () =>
      fetchAITools({
        category: selectedCategory,
        search: searchQuery.trim() || undefined,
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: meta } = useQuery({
    queryKey: ["ai-tools-meta"],
    queryFn: fetchAIToolsMeta,
    staleTime: 2 * 60 * 1000,
  });

  const { data: apiCategories } = useQuery({
    queryKey: ["ai-tools-categories"],
    queryFn: fetchAIToolCategories,
    staleTime: 5 * 60 * 1000,
  });

  const displayTools: AIToolItem[] = useMemo(() => {
    if (!isError && tools.length > 0) return tools;
    let result = selectedCategory === "All"
      ? fallbackTools
      : fallbackTools.filter((t) => t.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tools, isError, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    if (apiCategories?.length) {
      return apiCategories.map((c) => ({
        name: c.name,
        count: c.count,
        icon: getCategoryIcon(c.name),
      }));
    }
    const counts: Record<string, number> = {};
    displayTools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return [
      { name: "All", count: displayTools.length, icon: getCategoryIcon("All") },
      ...Object.entries(counts).map(([name, count]) => ({
        name,
        count,
        icon: getCategoryIcon(name),
      })),
    ];
  }, [apiCategories, displayTools]);

  const freeCount = displayTools.filter((t) => t.isFree).length;
  const latestCount = displayTools.filter((t) => t.isLatest).length;
  const totalCount = meta?.total ?? displayTools.length;

  return (
    <PageLayout>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-primary">Resources</p>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          AI Tools
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {totalCount}+ free AI tools — curated picks plus latest open-source models auto-fetched from Hugging Face
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            {freeCount} Free Tools
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {categories.length - 1} Categories
          </Badge>
          {latestCount > 0 && (
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/20">
              {latestCount} Latest Models
            </Badge>
          )}
          {meta?.lastSynced && (
            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
              <RefreshCw className="w-3 h-3 mr-1" />
              {formatLastSynced(meta.lastSynced)}
            </Badge>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
        <input
          type="text"
          placeholder="Search AI tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="premium-input pl-11 w-full"
        />
      </div>

      {/* Category pills */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {category.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-muted"}`}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading latest AI tools...
        </div>
      )}

      {isError && (
        <p className="text-xs text-amber-500/80 mb-5">
          Showing offline fallback — start backend and run seed:ai-tools for full list
        </p>
      )}

      <p className="text-xs text-muted-foreground mb-5">
        {displayTools.length} tool{displayTools.length !== 1 ? "s" : ""} found
      </p>

      {/* Tools grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayTools.map((tool, index) => {
          const Icon = getCategoryIcon(tool.category);
          const sourceLabel =
            tool.source === "huggingface" ? "HF Model" :
            tool.source === "huggingface-space" ? "HF Demo" :
            tool.source === "curated" ? "Curated" : null;

          return (
            <div
              key={tool.id || `${tool.name}-${index}`}
              className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{
                animationDelay: `${(index % 12) * 50}ms`,
                opacity: 0,
                animation: `fadeInUp 0.5s ease-out ${(index % 12) * 50}ms forwards`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-5 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="text-xs bg-muted/50">
                      {tool.category}
                    </Badge>
                    {tool.isLatest && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        Latest
                      </span>
                    )}
                    {tool.isFree && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Free
                      </span>
                    )}
                    {sourceLabel && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {sourceLabel}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                  {tool.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.features.slice(0, 4).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => window.open(tool.link, "_blank")}
                  variant="outline"
                  size="sm"
                  className="w-full border-border/50 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
                >
                  <span>Visit</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {displayTools.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center p-4 bg-muted/50 rounded-2xl mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tools found</h3>
          <p className="text-muted-foreground text-sm">
            Try a different category or search term
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageLayout>
  );
};

export default AITools;
