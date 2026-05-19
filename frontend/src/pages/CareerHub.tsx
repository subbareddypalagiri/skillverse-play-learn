import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Search, ChevronLeft, ChevronRight, ExternalLink, Loader2, AlertCircle, RefreshCw, Sparkles, Clock, Building2, Tag } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const typeColors: Record<string, string> = {
  job: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  internship: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  place: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const CareerHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  const fetchOpportunities = async (search = "", location = "all", type = "all") => {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams({ page: '1', limit: '100',
        ...(type !== 'all' && { type }),
        ...(location !== 'all' && { location }),
        ...(search && { search })
      });
      const response = await apiClient.get(`/opportunities?${params}`);
      const result = response.data;
      if (result.success && result.data) setAllOpportunities(result.data);
      else { setError("Failed to load opportunities"); setAllOpportunities([]); }
    } catch (err: any) {
      setError(err.message || 'Failed to load opportunities from server.');
      setAllOpportunities([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOpportunities(); }, []);

  const filteredOpportunities = allOpportunities.filter((opp: any) => {
    const matchSearch = !searchQuery || opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.skills && opp.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchLocation = locationFilter === "all" || opp.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchType = typeFilter === "all" || opp.type === typeFilter;
    return matchSearch && matchLocation && matchType;
  });

  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8 animate-reveal-up">
        <div>
          <div className="badge-gradient inline-flex mb-4">
            <Sparkles className="w-3 h-3" />
            Opportunities
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Career Hub
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredOpportunities.length} opportunities available`}
          </p>
        </div>
        <button onClick={() => fetchOpportunities(searchQuery, locationFilter, typeFilter)} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border/50 p-5 mb-6 animate-reveal-up delay-100"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input placeholder="Search title, company, skills..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="premium-input pl-10" />
          </div>
          <Select value={locationFilter} onValueChange={(v) => { setLocationFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="premium-input h-auto">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }}>
              {['all','remote','bangalore','hyderabad','mumbai','pune','chennai','delhi','gurugram','noida','kolkata','ahmedabad'].map(v => (
                <SelectItem key={v} value={v} className="capitalize text-foreground focus:bg-primary/10 focus:text-primary">
                  {v === 'all' ? 'All Locations' : v.charAt(0).toUpperCase() + v.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="premium-input h-auto">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }}>
              {['all','job','internship','place'].map(v => (
                <SelectItem key={v} value={v} className="capitalize text-foreground focus:bg-primary/10 focus:text-primary">
                  {v === 'all' ? 'All Types' : v.charAt(0).toUpperCase() + v.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" style={{ background: 'rgba(124,58,237,0.1)', filter: 'blur(10px)' }} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Loading Opportunities</p>
            <p className="text-sm text-muted-foreground">Fetching latest from Risee Engine...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-10 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Failed to load</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button onClick={() => fetchOpportunities()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paginatedOpportunities.map((opp: any, i: number) => (
              <div key={opp._id || opp.id || i}
                className="group rounded-2xl border border-border/50 hover:border-primary/30 overflow-hidden card-lift flex flex-col animate-reveal-up"
                style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.05}s` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Type badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${typeColors[opp.type] || typeColors.job}`}>
                      {opp.type}
                    </span>
                    {opp.deadline && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />{opp.deadline}
                      </div>
                    )}
                  </div>

                  {/* Title + company */}
                  <h3 className="font-bold text-foreground mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-2"
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{opp.organization}</span>
                  </div>
                  {opp.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-primary/50" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                  )}

                  {/* Skills */}
                  {opp.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {opp.skills.slice(0, 4).map((skill: string, j: number) => (
                        <span key={j} className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/4 border border-border/40 text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                      {opp.skills.length > 4 && (
                        <span className="text-[10px] text-muted-foreground/60">+{opp.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Stipend */}
                  {(opp.stipend || opp.salary) && (
                    <p className="text-sm font-semibold text-foreground mb-4">{opp.stipend || opp.salary}</p>
                  )}

                  {/* Apply CTA */}
                  <div className="mt-auto pt-4 border-t border-border/30">
                    {opp.applyLink ? (
                      <a href={opp.applyLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.25)] group/btn"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        Apply Now
                        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <div className="text-center text-xs text-muted-foreground py-2">Contact organization directly</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {paginatedOpportunities.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-primary/60" />
                </div>
                <h3 className="font-bold text-foreground mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>No opportunities found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button key={page} onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'text-white shadow-[0_0_12px_rgba(124,58,237,0.25)]'
                          : 'text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/40'
                      }`}
                      style={currentPage === page ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' } : {}}>
                      {page}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default CareerHub;
