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

// Comprehensive B.Tech career database mapping
const careerDatabase: Record<string, any> = {
  cse: {
    subs: {
      aiml: {
        name: "Artificial Intelligence & ML",
        roles: [
          {
            title: "MLOps Engineer",
            desc: "Automates deployment, monitoring, and scaling of machine learning models in production.",
            salary: { fresher: "₹8L - ₹15L", mid: "₹18L - ₹32L", expert: "₹40L - ₹80L+" },
            promotions: ["Associate MLOps Engineer", "Senior MLOps Specialist", "Principal ML Platform Architect", "VP of Artificial Intelligence"]
          },
          {
            title: "Computer Vision Engineer",
            desc: "Develops algorithms to help machines process, analyze, and extract features from visual data.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹26L", expert: "₹35L - ₹70L" },
            promotions: ["CV Researcher", "Lead Vision Scientist", "Director of Applied Perception"]
          }
        ]
      },
      datasci: {
        name: "Data Science & Analytics",
        roles: [
          {
            title: "Data Platform Architect",
            desc: "Builds high-performance pipelines and storage clusters to handle Petabytes of live analytics datasets.",
            salary: { fresher: "₹9L - ₹16L", mid: "₹20L - ₹38L", expert: "₹45L - ₹90L+" },
            promotions: ["Data Engineer", "Senior Analytics Lead", "Director of Data Systems"]
          }
        ]
      },
      cyber: {
        name: "Cybersecurity",
        roles: [
          {
            title: "Security Penetration Tester",
            desc: "Identifies and patches vulnerabilities in enterprise servers through authorized, controlled hacks.",
            salary: { fresher: "₹6L - ₹12L", mid: "₹14L - ₹25L", expert: "₹30L - ₹65L" },
            promotions: ["Security Consultant", "Senior Ethical Hacker", "Chief Information Security Officer (CISO)"]
          }
        ]
      }
    }
  },
  ece: {
    subs: {
      vlsi: {
        name: "VLSI Design & Semiconductors",
        roles: [
          {
            title: "ASIC Design Engineer",
            desc: "Architects high-performance custom integrated circuits and microchip processing logic blocks.",
            salary: { fresher: "₹9L - ₹18L", mid: "₹22L - ₹38L", expert: "₹45L - ₹85L+" },
            promotions: ["Silicon Design Associate", "Lead SoC Architect", "Head of Silicon R&D"]
          }
        ]
      },
      embedded: {
        name: "Embedded Systems & IoT",
        roles: [
          {
            title: "Firmware Engineer",
            desc: "Writes low-level code directly onto microcontrollers and hardware controllers.",
            salary: { fresher: "₹5L - ₹10L", mid: "₹12L - ₹22L", expert: "₹28L - ₹55L" },
            promotions: ["Hardware Integration Specialist", "Lead System Developer", "Engineering Director"]
          }
        ]
      }
    }
  },
  mech: {
    subs: {
      robotics: {
        name: "Robotics & Automation",
        roles: [
          {
            title: "Automation Systems Engineer",
            desc: "Designs kinematics logic interfaces and feedback sensor grids for industrial robotic arms.",
            salary: { fresher: "₹6L - ₹11L", mid: "₹13L - ₹24L", expert: "₹28L - ₹60L" },
            promotions: ["Junior Automation Dev", "Senior Automation Lead", "Robotics Director"]
          }
        ]
      },
      automotive: {
        name: "Automotive Diagnostics",
        roles: [
          {
            title: "EV Drivetrain Programmer",
            desc: "Writes battery thermal balance and kinetic regenerative braking control models.",
            salary: { fresher: "₹7L - ₹13L", mid: "₹15L - ₹28L", expert: "₹32L - ₹70L" },
            promotions: ["EV Subsystems Specialist", "Lead Propulsion Architect", "VP Powertrain Development"]
          }
        ]
      }
    }
  },
  civil: {
    subs: {
      smartcity: {
        name: "Smart City Infrastructure",
        roles: [
          {
            title: "Urban Modeling Specialist",
            desc: "Simulates traffic flow, utility grids, and environmental impacts using GIS pipelines.",
            salary: { fresher: "₹5L - ₹9L", mid: "₹10L - ₹18L", expert: "₹24L - ₹50L" },
            promotions: ["Urban Modeler", "Infrastructure Planner", "Smart City Architect"]
          }
        ]
      },
      structural: {
        name: "Parametric Structural Analysis",
        roles: [
          {
            title: "Parametric CAD Modeler",
            desc: "Calculates structural integrity and load dynamics using custom automated evaluation code.",
            salary: { fresher: "₹5L - ₹10L", mid: "₹11L - ₹20L", expert: "₹25L - ₹55L" },
            promotions: ["Structural Associate", "Lead Analysis Engineer", "Chief Structural Consultant"]
          }
        ]
      }
    }
  },
  metal: {
    subs: {
      nanomaterials: {
        name: "Nanotechnology & Materials",
        roles: [
          {
            title: "Corrosion Diagnostics Analyst",
            desc: "Simulates molecular material breakdown cycles to extend product lifecycle durations.",
            salary: { fresher: "₹6L - ₹11L", mid: "₹12L - ₹24L", expert: "₹28L - ₹60L" },
            promotions: ["Materials Specialist", "Lead Metallurgy Analyst", "Director of Material Integrity"]
          }
        ]
      }
    }
  }
};

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
  const [selectedSub, setSelectedSub] = useState("aiml");
  const [selectedRole, setSelectedRole] = useState<any>(null);

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

      {/* Dynamic Know Your Role Career Guidance Matrix */}
      <div className="rounded-2xl border border-border/50 p-6 mb-6 animate-reveal-up delay-75"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Know Your Role // Career Guidance Matrix
            </h2>
            <p className="text-xs text-muted-foreground">Select a B.Tech branch to analyze salary growth, career ladders, and promotions</p>
          </div>
        </div>

        {/* B.Tech Core Branch Selectors */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { id: 'cse', name: 'Computer Science', color: 'from-blue-500/10 to-indigo-500/10' },
            { id: 'ece', name: 'Electronics & Comm.', color: 'from-amber-500/10 to-orange-500/10' },
            { id: 'mech', name: 'Mechanical Systems', color: 'from-emerald-500/10 to-teal-500/10' },
            { id: 'civil', name: 'Civil & Structuring', color: 'from-cyan-500/10 to-blue-500/10' },
            { id: 'metal', name: 'Metallurgy & Materials', color: 'from-rose-500/10 to-pink-500/10' },
          ].map(branch => (
            <button
              key={branch.id}
              onClick={() => {
                setSelectedBranch(branch.id);
                // Auto-select first sub-branch
                const subs = Object.keys(careerDatabase[branch.id]?.subs || {});
                if (subs.length > 0) setSelectedSub(subs[0]);
                setSelectedRole(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                selectedBranch === branch.id
                  ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                  : 'bg-muted/10 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {/* Selected Branch Sub-Branches */}
        {selectedBranch && careerDatabase[selectedBranch] && (
          <div className="mb-5 animate-reveal-up">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Sub-Specializations</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(careerDatabase[selectedBranch].subs).map(([subId, subData]: [string, any]) => (
                <button
                  key={subId}
                  onClick={() => {
                    setSelectedSub(subId);
                    setSelectedRole(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    selectedSub === subId
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-muted/5 text-muted-foreground border-border/30 hover:border-muted hover:text-foreground'
                  }`}
                >
                  {subData.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Roles Grid and Details */}
        {selectedSub && selectedBranch && careerDatabase[selectedBranch]?.subs[selectedSub] && (
          <div className="grid md:grid-cols-5 gap-6 mt-4 pt-4 border-t border-border/30 animate-reveal-up">
            
            {/* Roles List (Left 2 cols) */}
            <div className="md:col-span-2 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Target Roles</div>
              {careerDatabase[selectedBranch].subs[selectedSub].roles.map((role: any) => (
                <button
                  key={role.title}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex flex-col gap-1 ${
                    selectedRole?.title === role.title
                      ? 'border-primary/60 bg-primary/5 shadow-inner'
                      : 'border-border/30 bg-muted/5 hover:border-border/80'
                  }`}
                >
                  <span className="text-xs font-bold text-foreground">{role.title}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{role.desc}</span>
                  <span className="text-[10px] text-violet-400 font-semibold mt-1">Fresher Start: {role.salary.fresher}</span>
                </button>
              ))}
            </div>

            {/* Role Insights & Salary Details (Right 3 cols) */}
            <div className="md:col-span-3">
              {selectedRole ? (
                <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-4 animate-reveal-up">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedRole.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{selectedRole.desc}</p>
                  </div>

                  {/* Career Levels Breakdown */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2.5">Salary Spectrum</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                        <div className="text-[10px] text-emerald-400 font-bold">Fresher Start</div>
                        <div className="text-xs font-bold mt-0.5 text-foreground">{selectedRole.salary.fresher}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-violet-500/5 border border-violet-500/15">
                        <div className="text-[10px] text-violet-400 font-bold">Mid-Range</div>
                        <div className="text-xs font-bold mt-0.5 text-foreground">{selectedRole.salary.mid}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-pink-500/5 border border-pink-500/15">
                        <div className="text-[10px] text-pink-400 font-bold">Lead/Expert</div>
                        <div className="text-xs font-bold mt-0.5 text-foreground">{selectedRole.salary.expert}</div>
                      </div>
                    </div>
                  </div>

                  {/* Promotion Path Ladder */}
                  <div className="pt-2 border-t border-border/30">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Promotional Path & Career Ladder</div>
                    <div className="space-y-2 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
                      {selectedRole.promotions.map((step: string, idx: number) => (
                        <div key={idx} className="relative text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute -left-[11px]" />
                          <span className="font-semibold text-foreground text-[11px]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 border border-dashed border-border/50 rounded-xl bg-muted/5">
                  <p className="text-xs text-muted-foreground">Select a target career role to inspect detailed growth pathways.</p>
                </div>
              )}
            </div>

          </div>
        )}
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
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => {
                  // Always show first, last, current, and neighbors
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
    </PageLayout>
  );
};

export default CareerHub;
