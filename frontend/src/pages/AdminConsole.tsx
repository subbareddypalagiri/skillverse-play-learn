import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import apiClient from '@/lib/apiClient';
import {
  ShieldAlert, BookOpen, Radio, Users, Award, Sparkles, Plus, Trash2, CheckCircle2, XCircle, LayoutGrid, Terminal, Briefcase, Bot, Server, Handshake, Calendar
} from 'lucide-react';
const AdminConsole: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'courses' | 'ai-tools' | 'dsa' | 'careers' | 'clubs-events'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states - dynamic Club
  const [clubName, setClubName] = useState('');
  const [clubDesc, setClubDesc] = useState('');
  const [clubCategory, setClubCategory] = useState('club');
  const [clubType, setClubType] = useState('tech');

  // Form states - dynamic Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState('technical');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventMode, setEventMode] = useState('online');

  // Lists state
  const [liveApps, setLiveApps] = useState<any[]>([]);
  const [ambApps, setAmbApps] = useState<any[]>([]);
  const [mentorApps, setMentorApps] = useState<any[]>([]);

  // Form states - Course
  const [courseTitle, setCourseTitle] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseCategory, setCourseCategory] = useState('Web Development');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseVideoId, setCourseVideoId] = useState('');
  const [courseVideoTitle, setCourseVideoTitle] = useState('');
  const [courseCredits, setCourseCredits] = useState('10');
  
  // Custom attachment files / pdfs
  const [coursePdfTitle, setCoursePdfTitle] = useState('');
  const [coursePdfUrl, setCoursePdfUrl] = useState('');
  
  // Dynamic Practice Labs Setup
  const [courseLabTitle, setCourseLabTitle] = useState('');
  const [courseLabCode, setCourseLabCode] = useState('');

  // Form states - AI Tool
  const [aiName, setAiName] = useState('');
  const [aiDesc, setAiDesc] = useState('');
  const [aiCategory, setAiCategory] = useState('Development');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiIcon, setAiIcon] = useState('Wrench');

  // Form states - DSA Problem
  const [dsaTitle, setDsaTitle] = useState('');
  const [dsaDifficulty, setDsaDifficulty] = useState('Easy');
  const [dsaCategory, setDsaCategory] = useState('Arrays');
  const [dsaDesc, setDsaDesc] = useState('');
  const [dsaCode, setDsaCode] = useState('');

  // Form states - Careers
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobLink, setJobLink] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Active events list state for moderation
  const [activeEvents, setActiveEvents] = useState<any[]>([]);

  // Restrict access if not admin
  if (user?.role !== 'admin') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-foreground mb-1">Access Denied</h2>
          <p className="text-muted-foreground text-sm">Only systems administrators are authorized to access the console.</p>
        </div>
      </PageLayout>
    );
  }

  const loadData = async () => {
    try {
      setLoading(true);
      const statsRes = await apiClient.get('/admin/stats');
      setStats(statsRes.data.data);

      const appsRes = await apiClient.get('/admin/applications');
      setLiveApps(appsRes.data.data.liveApplications || []);
      setAmbApps(appsRes.data.data.ambassadorApplications || []);
      setMentorApps(appsRes.data.data.mentorApplications || []);

      const eventsRes = await apiClient.get('/admin/events');
      setActiveEvents(eventsRes.data.data.events || []);
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/admin/events/${eventId}`);
      toast({
        title: "Event Deleted",
        description: "Event has been successfully removed from the board."
      });
      loadData();
    } catch (err) {
      toast({
        title: "Deletion failed",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplicationReview = async (type: 'live' | 'ambassador' | 'mentor', appId: string, status: 'approved' | 'rejected') => {
    try {
      let endpoint = '';
      let bodyData = {};

      if (type === 'live') {
        endpoint = `/live/applications/${appId}/review`;
        bodyData = { status };
      } else if (type === 'ambassador') {
        endpoint = `/events/ambassador/applications/${appId}/review`;
        bodyData = { status };
      } else {
        endpoint = `/admin/mentor-applications/${appId}/review`;
        bodyData = { action: status === 'approved' ? 'approve' : 'reject' };
      }

      await apiClient.put(endpoint, bodyData);
      toast({
        title: `Application ${status}`,
        description: "The requester's system profile role has been automatically updated."
      });
      loadData();
    } catch (err) {
      toast({
        title: "Review action failed",
        variant: "destructive"
      });
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const payload: any = {
        title: courseTitle,
        instructor: courseInstructor,
        category: courseCategory,
        level: courseLevel,
        duration: courseDuration,
        description: courseDesc,
        credits: parseInt(courseCredits) || 10,
        resources: {
          videos: courseVideoId ? [{ title: courseVideoTitle || "Lecture 1", url: `https://www.youtube.com/watch?v=${courseVideoId}`, platform: "YouTube", videoId: courseVideoId }] : [],
          pdfs: coursePdfUrl ? [{ title: coursePdfTitle || "Study Guide & Notes", url: coursePdfUrl }] : [],
          links: []
        }
      };

      // If Lab starter configs are defined, create a dynamic syllabus node module
      if (courseLabTitle || courseLabCode) {
        payload.syllabus = [{
          title: courseLabTitle || "Sandbox Practice Lab",
          description: "Hands-on browser compiling challenge lab assignment.",
          duration: "1 hour",
          lectureCount: 1,
          resources: [{
            type: "code",
            title: courseLabTitle || "Starter Template",
            url: courseLabCode || "// Write your code here"
          }]
        }];
      }

      await apiClient.post('/admin/courses', payload);
      toast({ title: "Course Created", description: "Course registered live on the explorer cards with labs & PDFs." });
      loadData();
      
      // Reset form
      setCourseTitle('');
      setCourseInstructor('');
      setCourseDuration('');
      setCourseDesc('');
      setCourseVideoId('');
      setCourseVideoTitle('');
      setCourseCredits('10');
      setCoursePdfTitle('');
      setCoursePdfUrl('');
      setCourseLabTitle('');
      setCourseLabCode('');
    } catch (err) {
      toast({ title: "Creation failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAITool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiClient.post('/admin/ai-tools', {
        name: aiName,
        description: aiDesc,
        category: aiCategory,
        prompt: aiPrompt,
        iconName: aiIcon
      });
      toast({ title: "AI Tool Registered", description: "Assistant is now queryable from the sidebar tools." });
      loadData();
      setAiName('');
      setAiDesc('');
      setAiPrompt('');
    } catch (err) {
      toast({ title: "Registration failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiClient.post('/admin/problems', {
        title: dsaTitle,
        difficulty: dsaDifficulty,
        category: dsaCategory,
        description: dsaDesc,
        starterCode: dsaCode
      });
      toast({ title: "DSA Problem Added", description: "Compiler test is now live for practitioners." });
      loadData();
      setDsaTitle('');
      setDsaDesc('');
      setDsaCode('');
    } catch (err) {
      toast({ title: "Problem addition failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiClient.post('/admin/jobs', {
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        type: jobType,
        applyLink: jobLink
      });
      toast({ title: "Opportunity Published", description: "Listing has been successfully added to the Career Hub." });
      loadData();
      setJobTitle('');
      setJobCompany('');
      setJobLocation('');
      setJobLink('');
    } catch (err) {
      toast({ title: "Publish failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiClient.post('/admin/clubs', {
        name: clubName,
        description: clubDesc,
        category: clubCategory,
        type: clubType
      });
      toast({ title: "Club Launched", description: "Dynamic community space created for all members." });
      setClubName('');
      setClubDesc('');
    } catch (err) {
      toast({ title: "Failed to create Club", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await apiClient.post('/admin/events', {
        title: eventTitle,
        description: eventDesc,
        category: eventCategory,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        mode: eventMode
      });
      toast({ title: "Event Published", description: "Dynamic event published and live on the board." });
      setEventTitle('');
      setEventDesc('');
      setEventLocation('');
      setEventDate('');
      setEventTime('');
    } catch (err) {
      toast({ title: "Failed to publish Event", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-3" style={{ fontFamily: 'Sora, sans-serif' }}>
          <Server className="w-8 h-8 text-primary" />
          Haappy Control Center
        </h1>
        <p className="text-muted-foreground text-sm">
          Unified systems dashboard to manage verify operations, course curriculum layouts, AI configs, and career paths.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <Card className="w-full lg:w-64 p-3 border-border/50 bg-card rounded-2xl flex-shrink-0 flex flex-col gap-1">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('overview')}
          >
            <LayoutGrid className="w-4 h-4" />
            Overview & Telemetry
          </Button>
          <Button
            variant={activeTab === 'applications' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold relative"
            onClick={() => setActiveTab('applications')}
          >
            <Users className="w-4 h-4" />
            Verification Center
            {(liveApps.length + ambApps.length + mentorApps.length) > 0 && (
              <Badge className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                {liveApps.length + ambApps.length + mentorApps.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'courses' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen className="w-4 h-4" />
            Courses & Lab Editor
          </Button>
          <Button
            variant={activeTab === 'ai-tools' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('ai-tools')}
          >
            <Bot className="w-4 h-4" />
            AI Tools Configurator
          </Button>
          <Button
            variant={activeTab === 'dsa' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('dsa')}
          >
            <Terminal className="w-4 h-4" />
            DSA Problems Arena
          </Button>
          <Button
            variant={activeTab === 'careers' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('careers')}
          >
            <Briefcase className="w-4 h-4" />
            Career & Job Board
          </Button>
          <Button
            variant={activeTab === 'clubs-events' ? 'default' : 'ghost'}
            className="w-full justify-start rounded-xl gap-2.5 text-xs font-semibold"
            onClick={() => setActiveTab('clubs-events')}
          >
            <Calendar className="w-4 h-4 text-violet-400" />
            Clubs & Global Events
          </Button>
        </Card>

        {/* Dynamic Panels Workspace */}
        <div className="flex-1 w-full">
          
          {/* Overview & Telemetry Panel */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 border-border/50 bg-card rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Courses Count</span>
                  <div className="text-3xl font-extrabold text-foreground mt-2">{stats?.courses || 0}</div>
                </Card>
                <Card className="p-5 border-border/50 bg-card rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Registrants</span>
                  <div className="text-3xl font-extrabold text-foreground mt-2">{stats?.users || 0}</div>
                </Card>
                <Card className="p-5 border-border/50 bg-card rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">DSA Problems</span>
                  <div className="text-3xl font-extrabold text-foreground mt-2">{stats?.problems || 0}</div>
                </Card>
                <Card className="p-5 border-border/50 bg-card rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Job Roles</span>
                  <div className="text-3xl font-extrabold text-foreground mt-2">{stats?.jobs || 0}</div>
                </Card>
              </div>

              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-4">Core Systems Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-border/30">
                    <span className="text-muted-foreground">Database Engine</span>
                    <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-border/30">
                    <span className="text-muted-foreground">Streaming Relay</span>
                    <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">AI Inference Pipeline</span>
                    <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">Online</Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Verification Center Panel */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-reveal-up">
              
              {/* Ambassador Applications */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Ambassador Applicants
                </h3>
                {ambApps.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No pending ambassador applications.</p>
                ) : (
                  <div className="space-y-4">
                    {ambApps.map((app) => (
                      <div key={app._id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-foreground">{app.userId?.name || 'Applicant'} ({app.userId?.email})</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">College: {app.collegeName}</div>
                          <p className="text-xs text-foreground/80 mt-2 italic bg-background/50 p-2 rounded-lg border border-border/30">"{app.plannedEventsDesc}"</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                          <Button onClick={() => handleApplicationReview('ambassador', app._id, 'approved')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button onClick={() => handleApplicationReview('ambassador', app._id, 'rejected')} size="sm" variant="destructive" className="rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Live Expert Applications */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500" />
                  Live Expert Applicants
                </h3>
                {liveApps.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No pending live room applications.</p>
                ) : (
                  <div className="space-y-4">
                    {liveApps.map((app) => (
                      <div key={app._id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-foreground">{app.userId?.name || 'Applicant'} ({app.userId?.email})</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Skills: {app.skills.join(', ')}</div>
                          <p className="text-xs text-foreground/80 mt-2 italic bg-background/50 p-2 rounded-lg border border-border/30">"{app.pitch}"</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                          <Button onClick={() => handleApplicationReview('live', app._id, 'approved')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button onClick={() => handleApplicationReview('live', app._id, 'rejected')} size="sm" variant="destructive" className="rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Mentor Applications */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-primary" />
                  Mentor Applicants
                </h3>
                {mentorApps.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No pending domain mentor applications.</p>
                ) : (
                  <div className="space-y-4">
                    {mentorApps.map((app) => (
                      <div key={app._id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-foreground">{app.user?.name || 'Applicant'} ({app.user?.email})</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Domain: {app.domain} | Experience: {app.yearsOfExperience} years</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Skills: {app.expertise?.join(', ')}</div>
                          <p className="text-xs text-foreground/80 mt-2 italic bg-background/50 p-2 rounded-lg border border-border/30">Motivation: "{app.motivation || app.bio}"</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end md:self-center">
                          <Button onClick={() => handleApplicationReview('mentor', app._id, 'approved')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button onClick={() => handleApplicationReview('mentor', app._id, 'rejected')} size="sm" variant="destructive" className="rounded-lg flex items-center gap-1.5 text-[10px] h-8">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>
          )}

          {/* Courses Manager Panel */}
          {activeTab === 'courses' && (
            <Card className="p-6 border-border/50 bg-card rounded-2xl animate-reveal-up">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Register New Course Content
              </h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Course Title *</Label>
                    <Input placeholder="e.g. Master Docker from Basics" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Instructor Name *</Label>
                    <Input placeholder="e.g. Maximillian S." value={courseInstructor} onChange={e => setCourseInstructor(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 space-y-1.5">
                    <Label className="text-xs font-semibold">Category Domain *</Label>
                    <select value={courseCategory} onChange={e => setCourseCategory(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="Web Development">Web Development</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Programming">Programming</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Credits awarded *</Label>
                    <Input type="number" min="0" max="100" value={courseCredits} onChange={e => setCourseCredits(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Level *</Label>
                    <select value={courseLevel} onChange={e => setCourseLevel(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Duration *</Label>
                    <Input placeholder="e.g. 12 weeks" value={courseDuration} onChange={e => setCourseDuration(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Course Description *</Label>
                  <Textarea placeholder="Explain the roadmap & learning goals..." value={courseDesc} onChange={e => setCourseDesc(e.target.value)} required className="rounded-xl min-h-[80px] text-xs" />
                </div>

                <div className="p-4 border border-border/50 rounded-xl bg-muted/10 space-y-3">
                  <div className="text-xs font-bold text-foreground">Lecture Video (Optional)</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px]">YouTube Video ID</Label>
                      <Input placeholder="e.g. h95cQkp4T1k" value={courseVideoId} onChange={e => setCourseVideoId(e.target.value)} className="rounded-xl text-xs h-8.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Video Lecture Title</Label>
                      <Input placeholder="e.g. Introduction & Setup" value={courseVideoTitle} onChange={e => setCourseVideoTitle(e.target.value)} className="rounded-xl text-xs h-8.5" />
                    </div>
                  </div>
                </div>

                {/* dynamic PDFs section */}
                <div className="p-4 border border-border/50 rounded-xl bg-muted/10 space-y-3">
                  <div className="text-xs font-bold text-foreground">Study Material PDF / Guide (Optional)</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px]">Material Title</Label>
                      <Input placeholder="e.g. Complete Docker Cheatsheet" value={coursePdfTitle} onChange={e => setCoursePdfTitle(e.target.value)} className="rounded-xl text-xs h-8.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">PDF Resource URL</Label>
                      <Input placeholder="https://example.com/material.pdf" value={coursePdfUrl} onChange={e => setCoursePdfUrl(e.target.value)} className="rounded-xl text-xs h-8.5" />
                    </div>
                  </div>
                </div>

                {/* dynamic Labs section */}
                <div className="p-4 border border-border/50 rounded-xl bg-muted/10 space-y-3">
                  <div className="text-xs font-bold text-foreground">Hands-on Practice Lab (Optional)</div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-[10px]">Lab / Assignment Title</Label>
                      <Input placeholder="e.g. Dockerfile Creation Lab" value={courseLabTitle} onChange={e => setCourseLabTitle(e.target.value)} className="rounded-xl text-xs h-8.5" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Starter Code / Starter Instructions</Label>
                      <Textarea placeholder="FROM node:alpine\nWORKDIR /app..." value={courseLabCode} onChange={e => setCourseLabCode(e.target.value)} className="rounded-xl min-h-[80px] text-xs font-mono" />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {submitting ? "Publishing Course & Lab resources..." : "Publish Course Live"}
                </Button>
              </form>
            </Card>
          )}

          {/* AI Tools Configurator Panel */}
          {activeTab === 'ai-tools' && (
            <Card className="p-6 border-border/50 bg-card rounded-2xl animate-reveal-up">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Configure New AI Chat Assistant
              </h3>
              <form onSubmit={handleCreateAITool} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Assistant Name *</Label>
                    <Input placeholder="e.g. UX Advisor Bot" value={aiName} onChange={e => setAiName(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Icon Reference *</Label>
                    <Input placeholder="e.g. Palette, Code, Terminal" value={aiIcon} onChange={e => setAiIcon(e.target.value)} className="rounded-xl text-xs" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Specialization Category *</Label>
                  <select value={aiCategory} onChange={e => setAiCategory(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Writing">Writing</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description *</Label>
                  <Input placeholder="What does this bot assist with?" value={aiDesc} onChange={e => setAiDesc(e.target.value)} required className="rounded-xl text-xs" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">System Prompt Instructions *</Label>
                  <Textarea placeholder="Explain to the AI how it must behave, reply, and format code inputs..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} required className="rounded-xl min-h-[120px] text-xs" />
                </div>

                <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {submitting ? "Registering AI Config..." : "Deploy AI Assistant"}
                </Button>
              </form>
            </Card>
          )}

          {/* DSA Practice Manager Panel */}
          {activeTab === 'dsa' && (
            <Card className="p-6 border-border/50 bg-card rounded-2xl animate-reveal-up">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Deploy DSA Practice Challenge
              </h3>
              <form onSubmit={handleCreateProblem} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold">Challenge Title *</Label>
                    <Input placeholder="e.g. Reverse a LinkedList" value={dsaTitle} onChange={e => setDsaTitle(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Difficulty *</Label>
                    <select value={dsaDifficulty} onChange={e => setDsaDifficulty(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Topic Category *</Label>
                  <Input placeholder="e.g. Linked Lists, Graphs, Dynamic Programming" value={dsaCategory} onChange={e => setDsaCategory(e.target.value)} required className="rounded-xl text-xs" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Problem Writeup & Explanation *</Label>
                  <Textarea placeholder="Formulate the challenge description, inputs, and constraints..." value={dsaDesc} onChange={e => setDsaDesc(e.target.value)} required className="rounded-xl min-h-[90px] text-xs" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Starter Template Code (JavaScript) *</Label>
                  <Textarea placeholder="function solve(head) {\n  // Code here\n}" value={dsaCode} onChange={e => setDsaCode(e.target.value)} required className="rounded-xl min-h-[100px] text-xs font-mono" />
                </div>

                <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {submitting ? "Deploying problem..." : "Deploy Challenge"}
                </Button>
              </form>
            </Card>
          )}

          {/* Careers & Job Board Panel */}
          {activeTab === 'careers' && (
            <Card className="p-6 border-border/50 bg-card rounded-2xl animate-reveal-up">
              <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Publish Job Role Vacancy
              </h3>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Job/Internship Title *</Label>
                    <Input placeholder="e.g. Junior Front-End Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Hiring Company *</Label>
                    <Input placeholder="e.g. Stripe, Google" value={jobCompany} onChange={e => setJobCompany(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Office Location *</Label>
                    <Input placeholder="e.g. Bangalore, Remote" value={jobLocation} onChange={e => setJobLocation(e.target.value)} required className="rounded-xl text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Engagement Type *</Label>
                    <select value={jobType} onChange={e => setJobType(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Application/Apply Portal Link *</Label>
                  <Input placeholder="https://careers.stripe.com/..." value={jobLink} onChange={e => setJobLink(e.target.value)} required className="rounded-xl text-xs" />
                </div>

                <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  {submitting ? "Publishing Job..." : "Publish Job Role"}
                </Button>
              </form>
            </Card>
          )}

          {/* Clubs & Events Panel */}
          {activeTab === 'clubs-events' && (
            <div className="space-y-6 animate-reveal-up">
              
              {/* Club creator */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  Launch Dynamic Community Club
                </h3>
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Club Name *</Label>
                    <Input placeholder="e.g. AI Pioneers Club" value={clubName} onChange={e => setClubName(e.target.value)} required className="rounded-xl text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Category *</Label>
                      <select value={clubCategory} onChange={e => setClubCategory(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="club">Official Club</option>
                        <option value="hobby">Hobby Space</option>
                        <option value="academic">Academic Cell</option>
                        <option value="professional">Professional Network</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Focus Area *</Label>
                      <select value={clubType} onChange={e => setClubType(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="tech">Technology</option>
                        <option value="music">Music</option>
                        <option value="gaming">Gaming</option>
                        <option value="debate">Debate & Lit</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Description *</Label>
                    <Textarea placeholder="What is the objective of this student community..." value={clubDesc} onChange={e => setClubDesc(e.target.value)} required className="rounded-xl min-h-[70px] text-xs" />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                    {submitting ? "Launching Club..." : "Launch Club"}
                  </Button>
                </form>
              </Card>

              {/* Event creator */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  Publish Global Campus Event / Hackathon
                </h3>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Event Title *</Label>
                      <Input placeholder="e.g. SkillVerse HackFest 2026" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required className="rounded-xl text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Category *</Label>
                      <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="technical">Technical Fest</option>
                        <option value="cultural">Cultural Carnival</option>
                        <option value="hackathons">Hackathon Challenge</option>
                        <option value="industrial-tours">Industrial Visit</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Scheduled Date *</Label>
                      <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="rounded-xl text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Start Time *</Label>
                      <Input placeholder="e.g. 10:00 AM" value={eventTime} onChange={e => setEventTime(e.target.value)} required className="rounded-xl text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Format Mode *</Label>
                      <select value={eventMode} onChange={e => setEventMode(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="online">Online Webcast</option>
                        <option value="offline">In-Person Campus</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Venue / Digital Meeting Link *</Label>
                    <Input placeholder="e.g. Seminar Hall C, or Zoom url" value={eventLocation} onChange={e => setEventLocation(e.target.value)} required className="rounded-xl text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Event Description *</Label>
                    <Textarea placeholder="Explain event rules, schedule, and registration rules..." value={eventDesc} onChange={e => setEventDesc(e.target.value)} required className="rounded-xl min-h-[85px] text-xs" />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl font-semibold text-xs" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                    {submitting ? "Publishing Event..." : "Publish Event"}
                  </Button>
                </form>
              </Card>

              {/* Event Moderation List */}
              <Card className="p-6 border-border/50 bg-card rounded-2xl">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Moderate Campus Events
                </h3>
                {activeEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No active college events listed.</p>
                ) : (
                  <div className="space-y-3">
                    {activeEvents.map((evt) => (
                      <div key={evt._id} className="p-3 rounded-xl border border-border/30 bg-muted/10 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-foreground">{evt.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Category: {evt.category} | Format: {evt.mode}</div>
                          <div className="text-[10px] text-muted-foreground">Organizer ID: {evt.ownerId?.email || 'System'}</div>
                        </div>
                        <Button onClick={() => handleDeleteEvent(evt._id)} variant="destructive" size="sm" className="rounded-lg h-8 text-[10px] flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
};

export default AdminConsole;
