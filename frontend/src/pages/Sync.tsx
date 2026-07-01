import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, GraduationCap, Users, Video, MessageCircle, Handshake, Sparkles, Star, ArrowRight, BadgeCheck, FileCheck } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

const domains = [
  { id: "ai", name: "AI & Machine Learning" },
  { id: "web", name: "Web Development" },
  { id: "mobile", name: "Mobile Development" },
  { id: "cloud", name: "Cloud & DevOps" },
  { id: "data", name: "Data Science" },
  { id: "design", name: "UI/UX Design" },
];

const alumniTalks = [
  { id: "t1", domain: "ai", name: "Priya Nair", role: "Senior ML Engineer @ OpenAI", time: "Fri, 5:00 PM", topic: "Practical LLM Finetuning in Production", avatar: "https://i.pravatar.cc/150?img=47", attendees: 128 },
  { id: "t2", domain: "web", name: "Aman Verma", role: "Staff Frontend @ Stripe", time: "Sat, 11:00 AM", topic: "Design Systems that Scale", avatar: "https://i.pravatar.cc/150?img=12", attendees: 203 },
  { id: "t3", domain: "cloud", name: "Zara Sheikh", role: "SRE Lead @ Google", time: "Sun, 9:30 AM", topic: "Resilience Engineering 101", avatar: "https://i.pravatar.cc/150?img=5", attendees: 95 },
];

const mentors = [
  { id: "m1", domain: "ai", name: "Rohan Das", role: "ML Mentor", rating: 4.9, sessions: 320, avatar: "https://i.pravatar.cc/150?img=33" },
  { id: "m2", domain: "web", name: "Sara Lee", role: "Frontend Mentor", rating: 4.8, sessions: 270, avatar: "https://i.pravatar.cc/150?img=21" },
  { id: "m3", domain: "data", name: "Kabir Singh", role: "Data Mentor", rating: 4.7, sessions: 190, avatar: "https://i.pravatar.cc/150?img=14" },
  { id: "m4", domain: "cloud", name: "Ananya Rao", role: "DevOps Mentor", rating: 5.0, sessions: 410, avatar: "https://i.pravatar.cc/150?img=55" },
];

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const Sync = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [domain, setDomain] = useState<string>("ai");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [appStatus, setAppStatus] = useState<any>(null);

  // Form states
  const [skillsStr, setSkillsStr] = useState('');
  const [mentorDomain, setMentorDomain] = useState('Web Development');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredTalks = useMemo(() => alumniTalks.filter(t => t.domain === domain), [domain]);
  const filteredMentors = useMemo(() => mentors.filter(m => m.domain === domain), [domain]);

  // Fetch application status
  useEffect(() => {
    if (user) {
      apiClient.get('/sync/apply/mentor/my-application')
        .then(res => {
          if (res.data?.data) {
            setAppStatus(res.data.data);
          }
        })
        .catch(err => console.log('Error checking mentor app:', err));
    }
  }, [user]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillsStr.trim() || !experience.trim() || !bio.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify skills, experience, and bio description.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/sync/apply/mentor', {
        domain: mentorDomain,
        role: "Mentor",
        company: "Independent",
        yearsOfExperience: parseInt(experience) || 1,
        expertise: skillsStr.split(',').map(s => s.trim()),
        bio,
        motivation
      });
      toast({
        title: "Application Submitted",
        description: "Your Mentor application is pending admin review."
      });
      setAppStatus(res.data.data);
      setShowApplyModal(false);
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message || "Failed to submit application.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 animate-reveal-up">
        <div>
          <div className="badge-gradient inline-flex mb-4">
            <Sparkles className="w-3 h-3" />
            SYNC
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Talk to the Right People
          </h1>
          <p className="text-muted-foreground max-w-md">
            Join alumni expert talks and book 1:1 sessions with mentors in your domain.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          {/* Apply to Mentor Indicator Button */}
          {user?.role === 'instructor' || user?.role === 'admin' ? (
            <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 py-2.5 px-4 rounded-xl flex items-center gap-1.5 h-10">
              <BadgeCheck className="w-4 h-4" strokeWidth={2.5} />
              Host Mentor Access Unlocked
            </Badge>
          ) : appStatus?.status === 'pending' || appStatus?.status === 'under_review' ? (
            <Badge className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500 py-2.5 px-4 rounded-xl flex items-center gap-1.5 h-10">
              <FileCheck className="w-4 h-4" />
              Mentor Request Pending
            </Badge>
          ) : (
            <Button
              onClick={() => setShowApplyModal(true)}
              variant="outline"
              className="h-10 rounded-xl border-primary/20 hover:border-primary/45 transition-all text-xs font-semibold px-4"
            >
              <Handshake className="w-4 h-4 text-primary mr-1.5" />
              Apply as Mentor
            </Button>
          )}

          <div className="w-full md:w-72">
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="premium-input h-10">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }}>
                <SelectGroup>
                  <SelectLabel className="text-muted-foreground text-xs">Domains</SelectLabel>
                  {domains.map(d => (
                    <SelectItem key={d.id} value={d.id}
                      className="text-foreground focus:bg-primary/10 focus:text-primary">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="talks" className="w-full animate-reveal-up delay-100">
        <TabsList className="inline-flex rounded-xl p-1 gap-1 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(230,20%,14%)' }}>
          <TabsTrigger value="talks"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
            <GraduationCap className="w-4 h-4" />
            Alumni Expert Talks
          </TabsTrigger>
          <TabsTrigger value="mentors"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
            <Handshake className="w-4 h-4" />
            Mentor Connect
          </TabsTrigger>
        </TabsList>

        {/* Talks Tab */}
        <TabsContent value="talks">
          {filteredTalks.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No talks scheduled for this domain yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTalks.map((t, i) => (
                <div key={t.id}
                  className="group relative rounded-2xl border border-border/50 overflow-hidden card-lift animate-reveal-up"
                  style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.1}s` }}>
                  {/* Top accent */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />

                  <div className="relative z-10 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={t.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">{t.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{t.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{t.role}</div>
                      </div>
                    </div>

                    <h3 className="font-bold text-foreground mb-3 leading-snug" style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.9rem' }}>
                      {t.topic}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5 pb-4 border-b border-border/30">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary/60" />{t.time}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-primary/60" />{t.attendees} registered</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        <Video className="w-3.5 h-3.5" /> Join Live
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-muted-foreground border border-border/50 hover:text-foreground hover:border-primary/30 hover:bg-white/3 transition-all">
                        <MessageCircle className="w-3.5 h-3.5" /> Ask Q
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Mentors Tab */}
        <TabsContent value="mentors">
          {filteredMentors.length === 0 ? (
            <div className="text-center py-16">
              <Handshake className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No mentors available for this domain yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMentors.map((m, i) => (
                <div key={m.id}
                  className="group relative rounded-2xl border border-border/50 overflow-hidden card-lift animate-reveal-up"
                  style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />

                  <div className="relative z-10 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <Avatar className="h-13 w-13 ring-2 ring-primary/20">
                          <AvatarImage src={m.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">{m.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-foreground">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.role}</div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />{m.rating}
                          </span>
                          <span className="text-muted-foreground/60">·</span>
                          <span className="text-muted-foreground">{m.sessions} sessions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {['Mock Interview', 'Resume Review', 'Roadmap'].map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-primary/8 border border-primary/15 text-primary/80">{tag}</span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.3)]"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        <Clock className="w-3.5 h-3.5" /> Book 1:1
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium text-muted-foreground border border-border/50 hover:text-foreground hover:border-primary/30 hover:bg-white/3 transition-all">
                        <MessageCircle className="w-3.5 h-3.5" /> Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Mentor Application Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-[475px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Handshake className="w-5 h-5 text-primary" />
              Apply as Domain Mentor
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mentors provide 1:1 session bookings and guide students in career roadmaps.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="domain" className="text-xs font-semibold">Specialization Domain *</Label>
                <select id="domain" value={mentorDomain} onChange={e => setMentorDomain(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="Web Development">Web Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp" className="text-xs font-semibold">Years of Experience *</Label>
                <Input id="exp" placeholder="e.g. 3" type="number" min="0" value={experience} onChange={e => setExperience(e.target.value)} required className="rounded-xl text-xs" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="skills" className="text-xs font-semibold">Specific Skills (comma separated) *</Label>
              <Input id="skills" placeholder="e.g. React, Docker, ML Pipelines" value={skillsStr} onChange={e => setSkillsStr(e.target.value)} required className="rounded-xl text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-semibold">Mentor Bio Profile *</Label>
              <Textarea id="bio" placeholder="Provide a brief introductory bio details..." value={bio} onChange={e => setBio(e.target.value)} required className="rounded-xl min-h-[70px] text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="motive" className="text-xs font-semibold">Briefly explain your motivation</Label>
              <Textarea id="motive" placeholder="Why do you want to mentor students..." value={motivation} onChange={e => setMotivation(e.target.value)} className="rounded-xl min-h-[70px] text-xs" />
            </div>

            <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold mt-4 text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              {submitting ? "Submitting application..." : "Submit Mentor Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Sync;
