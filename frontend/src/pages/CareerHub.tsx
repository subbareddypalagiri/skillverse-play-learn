import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Search, ChevronLeft, ChevronRight, ExternalLink, Loader2, AlertCircle, RefreshCw, Sparkles, Clock, Building2, Tag, CheckCircle2, Award, Terminal, Calendar, TrendingUp, Zap, Target } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const typeColors: Record<string, string> = {
  job: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  internship: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  place: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

import { careerDatabase, branchCatalog, branchCustomData, getRoleCustomData } from "@/data/careerDatabase";

const CareerHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Selected guidance matrix states
  const [selectedBranch, setSelectedBranch] = useState("cse");
  const [selectedSub, setSelectedSub] = useState("all");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [guidanceLevel, setGuidanceLevel] = useState<'branches' | 'roles' | 'details'>('branches');
  const [branchCategory, setBranchCategory] = useState<'all' | 'ug' | 'pg' | 'emerging'>('all');
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>({});

  // Tab State: 'jobs' shows career board, 'guidance' shows Know Your Role Matrix
  const [activeTab, setActiveTab] = useState<'jobs' | 'guidance'>('jobs');

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
            Career Hub
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Career Hub
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredOpportunities.length} opportunities available`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab Switcher — Sleek Pill Design */}
          <div className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-2xl p-1 border border-border/50 backdrop-blur-sm">
            {/* Sliding highlight */}
            <div
              style={{
                position: 'absolute',
                top: '4px',
                bottom: '4px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #a855f7 100%)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
                left: activeTab === 'jobs' ? '4px' : '50%',
                right: activeTab === 'jobs' ? '50%' : '4px',
                transition: 'left 0.32s cubic-bezier(0.34,1.56,0.64,1), right 0.32s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
            <button
              onClick={() => setActiveTab('jobs')}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 ${
                activeTab === 'jobs' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('guidance')}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 ${
                activeTab === 'guidance' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Target className="w-4 h-4" />
              Know Your Role
            </button>
          </div>
          <button onClick={() => fetchOpportunities(searchQuery, locationFilter, typeFilter)} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Dynamic Know Your Role Career Guidance Matrix (Only visible under activeTab === 'guidance') */}
      {/* Dynamic Know Your Role Career Guidance Matrix (Only visible under activeTab === 'guidance') */}
      {activeTab === 'guidance' && (
        <div className="rounded-3xl border border-border/50 p-6 sm:p-8 mb-8 animate-reveal-up"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-600/10">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Know Your Role
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {guidanceLevel === 'branches' && "Select a B.Tech engineering department to explore specialized domain pathways and targeted job cards."}
                  {guidanceLevel === 'roles' && `Exploring specialized job cards inside ${branchCatalog.find(b => b.id === selectedBranch)?.name || 'Department'}`}
                  {guidanceLevel === 'details' && `Detailed compensation & promotional growth ladder for ${selectedRole?.title || 'Target Role'}`}
                </p>
              </div>
            </div>

            {guidanceLevel !== 'branches' && (
              <button
                onClick={() => setGuidanceLevel(guidanceLevel === 'details' ? 'roles' : 'branches')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/10 hover:bg-muted/20 border border-border/50 text-xs font-semibold text-foreground transition self-start sm:self-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                {guidanceLevel === 'details' ? 'Back to Roles Grid' : 'Back to All Branches'}
              </button>
            )}
          </div>

          {/* LEVEL 1: BRANCHES GRID (Cards just like Image 2) */}
          {guidanceLevel === 'branches' && (
            <div className="mt-6 space-y-6 animate-reveal-up">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {[
                  { id: 'all', label: 'All Departments (15)' },
                  { id: 'ug', label: 'Undergraduate (B.Tech / UG)' },
                  { id: 'pg', label: 'Postgraduate (M.Tech / MBA / PG)' },
                  { id: 'emerging', label: 'Emerging Tech (AI & Bio)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBranchCategory(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      branchCategory === cat.id
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                        : 'bg-muted/10 text-muted-foreground hover:text-foreground border border-border/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {branchCatalog
                  .filter((branch) => branchCategory === 'all' || branch.category === branchCategory)
                  .map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranch(branch.id);
                        setSelectedSub('all');
                        setSelectedRole(null);
                        setGuidanceLevel('roles');
                      }}
                      className="group rounded-2xl border border-border/50 bg-surface/80 hover:bg-surface p-6 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {branch.badge}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-muted/20 text-muted-foreground">
                            {branch.level}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                          {branch.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                          {branch.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/40">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            {branch.duration}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                            {branch.stats}
                          </span>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-violet-600 group-hover:bg-violet-500 text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2">
                          Explore Branch Roles <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: ROLES GRID (Cards just like Image 2) */}
          {guidanceLevel === 'roles' && (
            <div className="mt-6 space-y-6 animate-reveal-up">
              {/* Sub-Specialization Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSub('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedSub === 'all'
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                      : 'bg-muted/10 text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  All Specializations
                </button>
                {selectedBranch && careerDatabase[selectedBranch] &&
                  Object.entries(careerDatabase[selectedBranch].subs).map(([subId, subData]: [string, any]) => (
                    <button
                      key={subId}
                      onClick={() => setSelectedSub(subId)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selectedSub === subId
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                          : 'bg-muted/10 text-muted-foreground hover:text-foreground border border-border/40'
                      }`}
                    >
                      {subData.name}
                    </button>
                  ))
                }
              </div>

              {/* Grid of Roles */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const branchData = careerDatabase[selectedBranch];
                  if (!branchData) return null;
                  let rolesList: any[] = [];
                  Object.entries(branchData.subs).forEach(([subId, subInfo]: [string, any]) => {
                    if (selectedSub === 'all' || selectedSub === subId) {
                      subInfo.roles.forEach((r: any) => {
                        rolesList.push({ ...r, subName: subInfo.name });
                      });
                    }
                  });

                  return rolesList.map((role: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedRole(role);
                        setGuidanceLevel('details');
                      }}
                      className="group rounded-2xl border border-border/50 bg-surface/80 hover:bg-surface p-6 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            {role.subName}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Fresher: {role.salary.fresher}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                          {role.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                          {role.desc}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/40">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            {role.promotions.length} Career Steps
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Tag className="w-3.5 h-3.5 text-pink-400" />
                            Peak: {role.salary.expert}
                          </span>
                        </div>
                        <button className="w-full py-2.5 rounded-xl bg-violet-600 group-hover:bg-violet-500 text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2">
                          View Salary & Promotions <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* LEVEL 3: DETAILED SALARY & PROMOTION VIEW */}
          {guidanceLevel === 'details' && selectedRole && (
            <div className="mt-6 space-y-8 animate-reveal-up">
              <div className="rounded-3xl border border-border/60 bg-surface/90 p-6 sm:p-8 shadow-2xl">
                <div className="max-w-3xl mb-8">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 inline-block">
                    {selectedRole.subName || 'Specialized Engineering'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
                    {selectedRole.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
                    {selectedRole.desc}
                  </p>
                </div>

                {/* Salary Spectrum Cards Grid */}
                <div className="mb-10">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Comprehensive Salary Spectrum & Compensation Matrix
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fresher Level (0-2 Yrs)</span>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                          {selectedRole.salary.fresher}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-4 pt-4 border-t border-emerald-500/20">
                        Starting compensation package including entry equity & performance incentives.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/30 relative overflow-hidden flex flex-col justify-between shadow-[0_0_25px_rgba(124,58,237,0.15)]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
                      <div>
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Mid-Range Specialist (3-6 Yrs)</span>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                          {selectedRole.salary.mid}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-4 pt-4 border-t border-violet-500/20">
                        Core team lead and senior developer benchmark with annual stock options.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-pink-500/10 border border-pink-500/30 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
                      <div>
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Lead / Expert Architect (7+ Yrs)</span>
                        <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                          {selectedRole.salary.expert}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-4 pt-4 border-t border-pink-500/20">
                        Principal architect, director, or executive lead compensation package.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Promotion Path Ladder */}
                <div className="pt-8 border-t border-border/40">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-400" /> Promotional Path & Career Progression Ladder
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedRole.promotions.map((step: string, idx: number) => (
                      <div key={idx} className="p-5 rounded-2xl bg-muted/10 border border-border/50 relative flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-violet-600/30">
                            0{idx + 1}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Step {idx + 1}</span>
                        </div>
                        <div className="text-sm font-bold text-foreground mt-2">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Lookup for Role & Branch Specific Data */}
                {(() => {
                  const custom = getRoleCustomData(selectedRole, selectedBranch);
                  return (
                    <>
                      {/* SECTION 4: Core Industry Tech Stack & Essential Tooling */}
                      <div className="pt-8 border-t border-border/40">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" /> Essential Industry Tech Stack & Toolchain
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          Mastering these high-demand core technologies and frameworks directly correlates with top-tier compensation brackets:
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {custom.tools.map((tool, idx) => (
                            <div key={idx} className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold shadow-sm ${tool.color}`}>
                              <span>{tool.name}</span>
                              <span className="text-[10px] opacity-60">({tool.type})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SECTION 5: Elite Industry Certifications (Employer ROI Booster) */}
                      <div className="pt-8 border-t border-border/40">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-400" /> Must-Have Elite Certifications (3x Interview Call Rate)
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {custom.certs.map((cert, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                    {cert.badge}
                                  </span>
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                </div>
                                <h4 className="text-xs font-bold text-foreground mt-1">{cert.title}</h4>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-2">{cert.org}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SECTION 6: Interactive Role Readiness & Interview Checklist */}
                      <div className="pt-8 border-t border-border/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interactive Job Readiness Checklist
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Check off your completed milestones to calculate your live interview readiness score:
                            </p>
                          </div>
                          {(() => {
                            const keys = custom.checklist.map((_, idx) => `check_${selectedBranch}_${selectedRole.title}_${idx}`);
                            const completedCount = keys.filter(k => checkedSkills[k]).length;
                            const percentage = Math.round((completedCount / keys.length) * 100);
                            return (
                              <div className="flex items-center gap-3 bg-muted/20 px-4 py-2.5 rounded-2xl border border-border/50">
                                <div className="text-right">
                                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Readiness Score</div>
                                  <div className="text-base font-extrabold text-foreground">{percentage}% Job Ready</div>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-lg"
                                  style={{ background: percentage === 100 ? 'linear-gradient(135deg,#10b981,#059669)' : percentage >= 60 ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                                  {percentage}%
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          {custom.checklist.map((item, idx) => {
                            const itemId = `check_${selectedBranch}_${selectedRole.title}_${idx}`;
                            const isChecked = !!checkedSkills[itemId];
                            return (
                              <div key={itemId}
                                onClick={() => setCheckedSkills(prev => ({ ...prev, [itemId]: !prev[itemId] }))}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                                  isChecked
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 shadow-sm'
                                    : 'bg-muted/10 border-border/40 hover:border-primary/40 text-muted-foreground hover:text-foreground'
                                }`}>
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                  isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border/60 bg-background/50'
                                }`}>
                                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                                <span className={`text-xs font-medium leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                                  {item.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 7: 90-Day Execution Roadmap to Interview Mastery */}
                      <div className="pt-8 border-t border-border/40">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-violet-400" /> 90-Day Actionable Roadmap to Interview Mastery
                        </h3>
                        <div className="grid md:grid-cols-3 gap-5">
                          {custom.roadmap.map((road, idx) => {
                            const phases = [
                              { month: 'Month 1 (Days 1-30)', badge: 'Foundation Phase', color: 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-400' },
                              { month: 'Month 2 (Days 31-60)', badge: 'Portfolio Phase', color: 'from-violet-500/10 to-transparent border-violet-500/20 text-violet-400' },
                              { month: 'Month 3 (Days 61-90)', badge: 'Interview Phase', color: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400' }
                            ];
                            const phase = phases[idx] || phases[0];
                            return (
                              <div key={idx} className={`p-5 rounded-2xl bg-gradient-to-br border flex flex-col justify-between ${phase.color}`}>
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider">{phase.month}</span>
                                    <Target className="w-3.5 h-3.5 opacity-80" />
                                  </div>
                                  <h4 className="text-sm font-bold text-foreground mt-1 mb-2">{road.title}</h4>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{road.desc}</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/20 text-[10px] font-extrabold uppercase tracking-wider opacity-90">
                                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {phase.badge}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters (Only visible under activeTab === 'jobs') */}
      {activeTab === 'jobs' && (
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
      )}

      {/* Opportunities Feed (Only visible under activeTab === 'jobs') */}
      {activeTab === 'jobs' && (
        <>
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-2xl animate-pulse-glow" style={{ background: 'rgba(124,58,237,0.1)', filter: 'blur(10px)' }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">Loading Opportunities</p>
                <p className="text-sm text-muted-foreground">Fetching latest from Risee Engine...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-10 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Failed to load</h3>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedOpportunities.map((opp: any, i: number) => (
                  <div key={opp._id || i} className="premium-card bg-white/95 dark:bg-slate-900/95 border border-border/70 rounded-2xl shadow-md hover:shadow-xl hover:border-violet-500/40 transition-all duration-300 flex flex-col h-full animate-reveal-up"
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeColors[opp.type] || 'bg-muted/10 text-muted-foreground'}`}>
                          {opp.type}
                        </span>
                        {opp.createdAt && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(opp.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-foreground text-lg mb-1 leading-snug line-clamp-2">
                        {opp.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground/80">{opp.organization}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="capitalize">{opp.location}</span>
                      </div>

                      <p className="text-muted-foreground text-xs leading-relaxed mb-5 line-clamp-3">
                        {opp.description}
                      </p>

                      {/* Skills */}
                      {opp.skills && opp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                          {opp.skills.slice(0, 4).map((skill: string) => (
                            <span key={skill} className="px-2 py-0.5 rounded bg-muted/10 border border-border/30 text-[10px] text-muted-foreground">
                              {skill}
                            </span>
                          ))}
                          {opp.skills.length > 4 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{opp.skills.length - 4}
                            </span>
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
                    <h3 className="font-bold text-foreground mb-1.5">No opportunities found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => {
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    }).reduce((acc: (number | string)[], page, idx, arr) => {
                      if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(page);
                      return acc;
                    }, []).map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground">…</span>
                      ) : (
                        <button key={page} onClick={() => handlePageChange(page as number)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'text-white shadow-[0_0_12px_rgba(124,58,237,0.25)]'
                              : 'text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/40'
                          }`}
                          style={currentPage === page ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' } : {}}>
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default CareerHub;
