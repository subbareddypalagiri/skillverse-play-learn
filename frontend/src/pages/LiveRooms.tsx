import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { useNavigate } from 'react-router-dom';
import { Users, Radio, Sparkles, Award, ShieldAlert, BadgeCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LiveSession {
  _id: string;
  title: string;
  topic: string;
  category: string;
  hostId: {
    _id: string;
    name: string;
    avatar: string;
    role: string;
  };
  viewerCount: number;
}

const LiveRooms: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<any>(null);

  // Form states
  const [skills, setSkills] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [certIds, setCertIds] = useState('');
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch active streams and application status
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        // Fetch active live rooms
        const roomsRes = await apiClient.get('/live/rooms');
        if (roomsRes.data?.data?.rooms) {
          setLiveSessions(roomsRes.data.data.rooms);
        }

        // Fetch application status
        const appRes = await apiClient.get('/live/my-application');
        if (appRes.data?.data?.application) {
          setApplicationStatus(appRes.data.data.application);
        }
      } catch (err) {
        console.error('Error fetching live rooms data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim() || !pitch.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Skills and Live Pitch).",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/live/apply', {
        skills: skills.split(',').map(s => s.trim()),
        portfolioUrl,
        linkedinUrl,
        certificateIds: certIds.split(',').map(c => c.trim()).filter(Boolean),
        pitch
      });

      toast({
        title: "Application Submitted",
        description: "Your Live Expert application has been sent for admin review."
      });
      setApplicationStatus(res.data.data.application);
      setShowApplyModal(false);
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-10 animate-reveal-up">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="badge-gradient inline-flex mb-4">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              Live Stream Hub
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              Live Rooms
            </h1>
            <p className="text-muted-foreground">
              Learn from verified industry experts and solve complex problems in real-time
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Show application status or Go Live button based on permissions */}
            {user?.role === 'admin' || user?.role === 'instructor' || user?.canHostLive ? (
              <Button
                onClick={() => navigate('/live-rooms/create')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}
              >
                <Radio className="w-4 h-4 animate-pulse" />
                Go Live Now
              </Button>
            ) : applicationStatus?.status === 'pending' ? (
              <Badge className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500 py-2.5 px-4 rounded-xl flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Host Application Pending Review
              </Badge>
            ) : applicationStatus?.status === 'approved' ? (
              <Button
                onClick={() => navigate('/live-rooms/create')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}
              >
                <Radio className="w-4 h-4 animate-pulse" />
                Go Live
              </Button>
            ) : (
              <Button
                onClick={() => setShowApplyModal(true)}
                variant="outline"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-foreground"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Apply as Live Expert
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active Live Streams Section */}
      <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        🔴 Active Broadcasts
      </h2>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 p-5 animate-pulse bg-card h-64" />
          ))}
        </div>
      ) : liveSessions.length === 0 ? (
        <Card className="p-12 text-center border-border/30 bg-muted/20 rounded-2xl">
          <Radio className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No Active Live Rooms</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            There are currently no active live classrooms. Check back later or apply to host your own live stream.
          </p>
          {applicationStatus?.status !== 'pending' && !user?.canHostLive && (
            <Button variant="outline" className="rounded-xl border-primary/20" onClick={() => setShowApplyModal(true)}>
              Apply to Host
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveSessions.map((session) => (
            <Card
              key={session._id}
              className="group relative rounded-2xl border border-border/50 overflow-hidden hover:border-red-500/30 card-lift bg-card shadow-sm transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/15 text-red-500 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      LIVE
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-lg bg-border/30 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {session.viewerCount} watching
                    </span>
                  </div>

                  {/* Host Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center font-bold text-primary">
                      {session.hostId?.avatar ? (
                        <img src={session.hostId.avatar} alt={session.hostId?.name || 'Host'} className="w-full h-full object-cover" />
                      ) : (
                        (session.hostId?.name || 'H').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-foreground flex items-center gap-1">
                        {session.hostId?.name || 'Anonymous Host'}
                        {(session.hostId?.role === 'instructor' || session.hostId?.role === 'admin') && (
                          <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary/10" />
                        )}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">{session.category}</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground mb-1 group-hover:text-red-500 transition-colors duration-200 line-clamp-1 leading-snug"
                    style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem' }}>
                    {session.title}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-4">{session.topic}</p>
                </div>

                <Button
                  onClick={() => navigate(`/live-rooms/${session._id}`)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-[0_0_15px_rgba(239,68,68,0.15)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                  style={{ background: 'linear-gradient(135deg,#ef4444,#6366f1)' }}
                >
                  Join Classroom
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Host Application Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="sm:max-w-[475px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Apply as Live Expert Host
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill in your details below. Our admin team will review your application and unlock live streaming permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="skills" className="text-xs font-semibold">Specialization & Skills (comma separated) *</Label>
              <Input
                id="skills"
                placeholder="e.g. React, Node.js, System Design"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="text-xs font-semibold">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  placeholder="https://..."
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-semibold">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="certs" className="text-xs font-semibold">SkillVerse Certificate IDs (optional)</Label>
              <Input
                id="certs"
                placeholder="e.g. cert_12345, cert_67890"
                value={certIds}
                onChange={e => setCertIds(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pitch" className="text-xs font-semibold">Describe what you want to teach *</Label>
              <Textarea
                id="pitch"
                placeholder="Provide details about your planned coding sessions or subjects you plan to explain live..."
                value={pitch}
                onChange={e => setPitch(e.target.value)}
                className="rounded-xl min-h-[90px] text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl font-semibold mt-4 text-xs"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
            >
              {submitting ? "Submitting application..." : "Submit Host Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default LiveRooms;
