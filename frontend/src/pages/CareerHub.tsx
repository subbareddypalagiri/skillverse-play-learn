import { useState, useEffect, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Briefcase, MapPin, Search, ChevronLeft, ChevronRight, ExternalLink, Loader2, 
  AlertCircle, RefreshCw, Sparkles, Clock, Building2, Tag, CheckCircle2, Award, 
  Terminal, Calendar, TrendingUp, Zap, Target, Landmark, Bell, Phone, Mail, FileText, Send, Check, ShieldCheck, X, GraduationCap
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { careerDatabase, branchCatalog, branchCustomData, getRoleCustomData } from "@/data/careerDatabase";
import { govtJobNotifications, govtJobCategories, GovtJobNotification } from "@/data/govtJobsData";

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
  const [checkedSkills, setCheckedSkills] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('careerHubCheckedSkills');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('careerHubCheckedSkills', JSON.stringify(checkedSkills));
    } catch {}
  }, [checkedSkills]);

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyzeGap = async () => {
    if (!selectedRole) return;
    setAnalyzing(true);
    try {
      const custom = getRoleCustomData(selectedRole, selectedBranch);
      const checkedList = custom.checklist.filter((_, idx) => checkedSkills[`check_${selectedBranch}_${selectedRole.title}_${idx}`]).map(item => item.label);
      
      const res = await apiClient.post('/ai-tools/analyze-career-gap', {
        targetRole: selectedRole.title,
        checkedSkills: checkedList,
        roleData: {
          tools: custom.tools,
          certs: custom.certs,
          checklist: custom.checklist,
          roadmap: custom.roadmap
        }
      });
      if (res.data?.success) {
        setAiAnalysis(res.data.data);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

const typeColors: Record<string, string> = {
  job: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  internship: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  place: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  govt: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

  const { user } = useAuth();
  const { toast } = useToast();

  // Tab State: 'jobs' shows career board, 'govt' shows Govt notifications, 'guidance' shows Know Your Role Matrix
  const [activeTab, setActiveTab] = useState<'jobs' | 'govt' | 'guidance'>('jobs');

  // Govt Notifications state
  const [govtCategory, setGovtCategory] = useState<string>('all');
  const [govtEducation, setGovtEducation] = useState<string>('all');
  const [govtSearch, setGovtSearch] = useState<string>('');
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('userWhatsapp') || '';
  });
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(['ap_state', 'central', 'banking']);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const filteredGovtJobs = useMemo(() => {
    return govtJobNotifications.filter(job => {
      const matchCat = govtCategory === 'all' || job.category === govtCategory;
      const qual = (job.qualification + " " + job.tags.join(" ")).toLowerCase();
      const matchEdu = govtEducation === 'all' ||
        (govtEducation === 'btech' && (qual.includes('b.tech') || qual.includes('b.e') || qual.includes('engineering'))) ||
        (govtEducation === 'degree' && (qual.includes('degree') || qual.includes('bachelor') || qual.includes('graduation') || qual.includes('b.sc') || qual.includes('b.com'))) ||
        (govtEducation === 'diploma' && (qual.includes('diploma') || qual.includes('polytechnic') || qual.includes('iti'))) ||
        (govtEducation === 'inter' && (qual.includes('12th') || qual.includes('intermediate') || qual.includes('10+2') || qual.includes('matriculation')));
      const q = govtSearch.trim().toLowerCase();
      const matchQuery = !q ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.qualification.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchEdu && matchQuery;
    });
  }, [govtCategory, govtEducation, govtSearch]);

  const handleSubscribeAlerts = () => {
    if (!whatsappNumber || whatsappNumber.length < 10) {
      toast({
        title: "Valid WhatsApp Number Required",
        description: "Please enter a valid 10-digit WhatsApp mobile number.",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem('userWhatsapp', whatsappNumber);
    localStorage.setItem('govtAlertPrefs', JSON.stringify(subscribedCategories));
    setAlertSuccess(true);
    toast({
      title: "🎉 Alert Preferences Saved!",
      description: `Daily alerts will be sent to WhatsApp (${whatsappNumber}) and ${user?.email || 'your registered Gmail'}.`
    });
    setTimeout(() => {
      setAlertsModalOpen(false);
      setAlertSuccess(false);
    }, 1800);
  };

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
            {activeTab === 'govt'
              ? `${filteredGovtJobs.length} active government notifications (AP & All-India)`
              : activeTab === 'jobs'
                ? loading ? 'Loading...' : `${filteredOpportunities.length} opportunities available`
                : 'Explore department-wise technical pathways & growth matrix'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tab Switcher — 3 Sleek Tabs (100% Solid) */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-2xl p-1 border border-border shadow-md">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Private & Tech
            </button>
            <button
              onClick={() => setActiveTab('govt')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'govt'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              Govt Notifications
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab('guidance')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'guidance'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Target className="w-4 h-4" />
              Know Your Role
            </button>
          </div>

          <button
            onClick={() => setAlertsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            title="Subscribe for WhatsApp & Gmail Job Alerts"
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Job Alerts</span>
          </button>

          {activeTab === 'jobs' && (
            <button onClick={() => fetchOpportunities(searchQuery, locationFilter, typeFilter)} disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Know Your Role Career Guidance Matrix (Only visible under activeTab === 'guidance') */}
      {activeTab === 'guidance' && (
        <div className="rounded-3xl border border-border p-6 sm:p-8 mb-8 animate-reveal-up bg-white dark:bg-slate-900 shadow-xl">
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
                      className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 p-6 transition-all duration-300 hover:border-violet-500/50 shadow-md hover:shadow-xl flex flex-col justify-between cursor-pointer"
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
                      className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 p-6 transition-all duration-300 hover:border-violet-500/50 shadow-md hover:shadow-xl flex flex-col justify-between cursor-pointer"
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

                        {/* AI Career Gap Analyzer Banner */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-600/15 via-indigo-600/15 to-purple-600/15 border border-violet-500/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/30">
                              <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">AI Career Gap & Tool Analyzer</h4>
                              <p className="text-xs text-muted-foreground">Get instant AI recommendations & tools from our database to master your missing skills.</p>
                            </div>
                          </div>
                          <button
                            onClick={handleAnalyzeGap}
                            disabled={analyzing}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                          >
                            {analyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Gap...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" /> Analyze My Career Gap
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI Analysis Result Card */}
                        {aiAnalysis && (
                          <div className="mt-6 p-6 md:p-8 rounded-3xl bg-slate-950 border-2 border-violet-500/60 shadow-2xl space-y-8 animate-reveal-up text-white">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                              <div className="flex items-center gap-3">
                                <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-violet-600 text-white shadow-md">
                                  AI Readiness Report
                                </span>
                                <h4 className="text-xl font-black text-white">{aiAnalysis.targetRole}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Match Score</span>
                                <div className="text-3xl font-black text-emerald-400">{aiAnalysis.readinessScore}%</div>
                              </div>
                            </div>

                            {/* Skills Breakdown */}
                            <div className="grid md:grid-cols-2 gap-5">
                              <div className="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-lg">
                                <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matched Strengths ({aiAnalysis.skills.matchedEssential.length + aiAnalysis.skills.matchedAdvanced.length})
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {[...aiAnalysis.skills.matchedEssential, ...aiAnalysis.skills.matchedAdvanced].map((s: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-xs shadow-md border border-emerald-400">
                                      {s}
                                    </span>
                                  ))}
                                  {[...aiAnalysis.skills.matchedEssential, ...aiAnalysis.skills.matchedAdvanced].length === 0 && (
                                    <span className="text-xs text-slate-400 font-medium">No strengths checked yet. Check items above!</span>
                                  )}
                                </div>
                              </div>

                              <div className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-lg">
                                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-amber-400" /> Priority Skill Gaps ({aiAnalysis.skills.missingEssential.length + aiAnalysis.skills.missingAdvanced.length})
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {[...aiAnalysis.skills.missingEssential, ...aiAnalysis.skills.missingAdvanced].map((s: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md border border-amber-300">
                                      {s}
                                    </span>
                                  ))}
                                  {[...aiAnalysis.skills.missingEssential, ...aiAnalysis.skills.missingAdvanced].length === 0 && (
                                    <span className="text-xs text-emerald-400 font-extrabold">You have mastered all core skills! 🎉</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Recommended AI Tools */}
                            {aiAnalysis.recommendedTools?.length > 0 && (
                              <div className="pt-2">
                                <h5 className="text-xs font-black text-violet-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> Recommended AI Tools to Master These Gaps
                                </h5>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {aiAnalysis.recommendedTools.map((tool: any, idx: number) => (
                                    <a key={idx} href={tool.link || '#'} target="_blank" rel="noreferrer"
                                      className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-violet-500 transition flex flex-col justify-between group shadow-lg">
                                      <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <span className="text-sm font-extrabold text-white group-hover:text-violet-300 transition">{tool.name}</span>
                                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-300" />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium line-clamp-2">{tool.description}</p>
                                      </div>
                                      <span className="mt-3 text-[10px] font-black text-violet-400 uppercase tracking-wider">{tool.category}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Core Role Requirements & Tech Stack */}
                            <div className="pt-6 border-t border-slate-800">
                              <h5 className="text-xs font-black text-violet-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4 text-violet-400" /> What You Need to Become a {aiAnalysis.targetRole} (Core Requirements)
                              </h5>
                              <div className="grid md:grid-cols-2 gap-5">
                                <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 shadow-lg">
                                  <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-3">Essential Competencies & Tools</span>
                                  <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.skills?.matchedEssential.concat(aiAnalysis.skills?.missingEssential).map((s: string, idx: number) => (
                                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-extrabold text-xs shadow-md border border-violet-400">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 shadow-lg">
                                  <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block mb-3">Advanced Specializations & Certs</span>
                                  <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.skills?.matchedAdvanced.concat(aiAnalysis.skills?.missingAdvanced).map((s: string, idx: number) => (
                                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md border border-indigo-400">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Customized Execution Roadmap */}
                            {aiAnalysis.roadmap?.length > 0 && (
                              <div className="pt-6 border-t border-slate-800">
                                <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-emerald-400" /> Your Customized AI Execution Roadmap
                                </h5>
                                <div className="grid md:grid-cols-2 gap-5">
                                  {aiAnalysis.roadmap.map((road: any, idx: number) => (
                                    <div key={idx} className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 flex flex-col justify-between shadow-lg">
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-sm font-black text-white">{road.week}</span>
                                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-500 text-white shadow-sm">
                                            Step {idx + 1}
                                          </span>
                                        </div>
                                        <p className="text-xs text-violet-300 font-extrabold mb-3">{road.focus}</p>
                                        <ul className="space-y-2">
                                          {road.actionItems?.map((item: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-300 font-medium flex items-start gap-2">
                                              <span className="text-emerald-400 font-black mt-0.5">•</span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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

      {/* Govt Notifications Feed (Visible under activeTab === 'govt') */}
      {activeTab === 'govt' && (
        <div className="space-y-6 mb-12 animate-reveal-up">
          {/* AP & All-India Govt Tracker Banner - 100% Solid Opaque */}
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/40 bg-slate-900 text-white shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                  Official Govt Recruitment Tracker (AP & Central)
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Verified Government Job Notifications
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Real-time recruitment notices from APPSC, AP Police, AP Mega DSC, Sachivalayam, UPSC, SSC, Railways & Public Sector Undertakings. Directly linked to official gazettes and application portals.
                </p>

                {/* Live Vacancies Quick Stats */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-emerald-400 flex items-center gap-1.5 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" /> 2,50,000+ Total Posts ({govtJobNotifications.length} Active Notifications)
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300">
                    🚩 55,000+ AP State
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
                    🚆 89,000+ Railways
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-300">
                    🇮🇳 75,000+ Central
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-rose-300">
                    🏦 27,000+ Banking & PSUs
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Official Portals Only
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Daily Auto-Refresh & TTL Expiry
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Bell className="w-3.5 h-3.5 text-amber-400" /> WhatsApp & Gmail Alert Ready
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                <button
                  onClick={() => setAlertsModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  <Bell className="w-4 h-4 animate-bounce" />
                  <span>Get WhatsApp & Gmail Alerts</span>
                </button>
                <a
                  href="https://psc.ap.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition"
                >
                  <span>Visit APPSC Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Search and Category Filter Bar - Pure Solid White */}
          <div className="rounded-3xl border border-slate-200 p-5 space-y-4 bg-white text-slate-900 shadow-md">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search APPSC, Group 1, Group 2, Police, SSC, B.Tech, Degree..."
                  value={govtSearch}
                  onChange={(e) => setGovtSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium transition"
                />
                {govtSearch && (
                  <button
                    onClick={() => setGovtSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs font-bold text-slate-600 flex-shrink-0 self-center">
                Showing <span className="text-emerald-700 font-extrabold text-sm">{filteredGovtJobs.length}</span> active notices
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" /> Sector:
              </span>
              {govtJobCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setGovtCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 ${
                    govtCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Qualification Filter Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-violet-600" /> Qualification:
              </span>
              {[
                { id: 'all', label: 'All Qualifications' },
                { id: 'btech', label: '💻 B.Tech / Engineering' },
                { id: 'degree', label: '🎓 Any Degree (B.Sc / B.Com / BA)' },
                { id: 'diploma', label: '📐 Diploma / Polytechnic' },
                { id: 'inter', label: '🏫 12th / Intermediate' }
              ].map(edu => (
                <button
                  key={edu.id}
                  onClick={() => setGovtEducation(edu.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 ${
                    govtEducation === edu.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {edu.label}
                </button>
              ))}
            </div>
          </div>

          {/* Govt Notifications Cards Grid - PURE SOLID WHITE CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGovtJobs.map((job) => {
              const isAp = job.category === 'ap_state';
              return (
                <div
                  key={job.id}
                  className="rounded-3xl border border-slate-200/90 bg-white text-slate-900 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-emerald-500 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${isAp ? 'bg-emerald-500' : 'bg-blue-600'}`} />

                  <div>
                    {/* Top Row: Department + State/Central Tag + Last Date */}
                    <div className="flex items-start justify-between gap-2 mb-3 pt-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          isAp
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {job.department}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap shadow-sm">
                        ⏳ {job.lastDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors mb-3">
                      {job.title}
                    </h3>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 my-2 border-y border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Posts</span>
                        <span className="font-black text-emerald-600 text-sm sm:text-base">{job.vacancies}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Salary Scale</span>
                        <span className="font-bold text-slate-900 text-xs truncate block" title={job.salaryScale || job.salary}>
                          {job.salaryScale || job.salary}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 col-span-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Qualification Required</span>
                        <span className="font-semibold text-slate-800 text-xs leading-relaxed">{job.qualification}</span>
                      </div>
                    </div>

                    {/* Age Limit & Tags */}
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600 mt-2 mb-4">
                      <span>🎂 Age: <b className="text-slate-900 font-bold">{job.ageLimit}</b></span>
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={job.officialApplyLink || job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {(job.notificationPdfLink || job.notificationPdf) && (
                      <a
                        href={job.notificationPdfLink || job.notificationPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition shadow-sm"
                        title="Official Gazette / PDF"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Notice</span>
                      </a>
                    )}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`📢 *Govt Job Alert:* ${job.title}\n👥 Posts: ${job.vacancies}\n🎓 Qualification: ${job.qualification}\n⏳ Last Date: ${job.lastDate}\n👉 Apply: ${job.officialApplyLink || job.applyLink}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold transition shadow-sm"
                      title="Share to WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredGovtJobs.length === 0 && (
              <div className="col-span-full text-center py-16 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <Landmark className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-1.5 text-base">No government notifications match your filter</h3>
                <p className="text-xs text-slate-500 mb-4">Try clearing the search query or switching to 'All Notifications'</p>
                <button
                  onClick={() => { setGovtCategory('all'); setGovtEducation('all'); setGovtSearch(''); }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Reset Govt Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters (Only visible under activeTab === 'jobs') - 100% Solid Opaque */}
      {activeTab === 'jobs' && (
        <div className="rounded-2xl border border-border p-5 mb-6 animate-reveal-up delay-100 bg-white dark:bg-slate-900 shadow-md">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input placeholder="Search title, company, skills..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-sm font-medium transition" />
            </div>
            <Select value={locationFilter} onValueChange={(v) => { setLocationFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="premium-input h-auto bg-slate-50 dark:bg-slate-800 border-border">
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
              <SelectTrigger className="premium-input h-auto bg-slate-50 dark:bg-slate-800 border-border">
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
                  <div key={opp._id || i} className="premium-card bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:border-violet-500/50 transition-all duration-300 flex flex-col h-full animate-reveal-up"
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

      {/* WhatsApp & Email Job Alert Subscription Dialog */}
      <Dialog open={alertsModalOpen} onOpenChange={setAlertsModalOpen}>
        <DialogContent className="max-w-md bg-slate-950 border border-border/60 text-foreground p-6 rounded-3xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-foreground">
              AP & Central Govt Job Alerts
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Receive fresh recruitment notifications, hall tickets, and syllabus releases directly on your WhatsApp number and registered Gmail.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            {/* Registered Gmail (Auto-detected from Login) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-violet-400" /> Registered Email Address
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/10 text-xs font-medium text-foreground flex items-center justify-between">
                <span>{user?.email || 'Logged in student email'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">Auto-Linked</span>
              </div>
            </div>

            {/* WhatsApp Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                  className="premium-input pl-12 w-full text-sm font-semibold tracking-wider"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                We will send job alerts, syllabus PDFs & deadline reminders on WhatsApp.
              </p>
            </div>

            {/* Alert Categories Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-muted-foreground block">
                Select Notifications to Receive:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ap_state', label: '🚩 AP State Govt (APPSC, DSC, Police)' },
                  { id: 'central', label: '🇮🇳 Central Govt (SSC, UPSC)' },
                  { id: 'banking', label: '🏦 Banking (SBI, IBPS)' },
                  { id: 'railways', label: '🚆 Railways (RRB NTPC, ALP)' },
                  { id: 'defense', label: '🛡️ Defense & PSUs (ISRO, DRDO)' },
                  { id: 'gate', label: '⚡ GATE / PSU Trainees' },
                ].map((item) => {
                  const isSelected = subscribedCategories.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSubscribedCategories(prev =>
                          isSelected ? prev.filter(c => c !== item.id) : [...prev, item.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-muted/10 border-border/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] leading-tight">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                onClick={handleSubscribeAlerts}
                disabled={alertSuccess}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {alertSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Subscribed Successfully!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Activate Daily Alerts</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default CareerHub;
