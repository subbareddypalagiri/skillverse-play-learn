import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trophy, Star, Zap, Award, BookOpen, Video, Heart, MessageCircle, Share2, CheckCircle, Code, Clock, Calendar, Flame, Crown, Sparkles, Rocket, Medal, Edit, Save, Github, Linkedin, ExternalLink, TrendingUp } from "lucide-react";
import { useSocial } from "@/contexts/SocialContext";
import { useVideoProgress } from "@/contexts/VideoProgressContext";
import { useCourseContext } from "@/contexts/CourseContext";
import { useState } from "react";
import PlatformIntegrations from "@/components/PlatformIntegrations";

const StatMini = ({ value, label }: { value: any; label: string }) => (
  <div className="text-center">
    <div className="text-2xl font-extrabold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</div>
    <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
  </div>
);

const StudentProfile = () => {
  const { posts, userProfile, updateProfile } = useSocial();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({ name: userProfile?.name || '', bio: userProfile?.bio || '', hobbies: userProfile?.hobbies?.join(', ') || '', skills: userProfile?.skills?.join(', ') || '' });
  const [isSaving, setIsSaving] = useState(false);
  const { videoProgress } = useVideoProgress();
  const { enrolledCourses } = useCourseContext();

  const totalPosts = posts.length;
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments.length, 0);
  const completedVideos = videoProgress.filter(v => v.completed).length;
  const totalWatchTime = videoProgress.reduce((s, v) => s + v.watchedDuration, 0);
  const watchTimeHours = Math.floor(totalWatchTime / 3600);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        name: editData.name, bio: editData.bio,
        hobbies: editData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        skills: editData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setShowEditDialog(false);
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleOpenEdit = () => {
    setEditData({ name: userProfile?.name || '', bio: userProfile?.bio || '', hobbies: userProfile?.hobbies?.join(', ') || '', skills: userProfile?.skills?.join(', ') || '' });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-5">
      {/* Profile Hero */}
      <div className="relative rounded-2xl border border-border/50 overflow-hidden animate-reveal-up"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        {/* BG orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[200px] opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.5) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-0 w-[200px] h-[150px] opacity-15"
            style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        </div>
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

        {/* Top banner strip */}
        <div className="h-24 w-full" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 100%)' }} />

        <div className="relative z-10 p-6 md:p-8 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl border-4 border-background flex items-center justify-center text-white text-3xl font-extrabold shadow-[0_8px_30px_rgba(124,58,237,0.4)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1,#06b6d4)', fontFamily: 'Sora, sans-serif' }}>
                {userProfile?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {userProfile?.name || 'Amazing Student'}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{userProfile?.bio || 'Learning, Growing, Achieving'}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="badge-gradient">
                      <Sparkles className="w-3 h-3" />Level 5 Learner
                    </span>
                    <span className="flex items-center gap-1 text-xs text-orange-400">
                      <Flame className="w-3.5 h-3.5" /> 7-Day Streak
                    </span>
                  </div>
                </div>
                <button onClick={handleOpenEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-white/3 transition-all duration-200">
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/40">
            <StatMini value={totalPosts} label="Posts" />
            <StatMini value={userProfile?.followers || 0} label="Followers" />
            <StatMini value={userProfile?.following || 0} label="Following" />
            <StatMini value={totalLikes} label="Likes" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-5 animate-reveal-up delay-100">
        <TabsList className="grid w-full grid-cols-5 rounded-xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(230,20%,14%)' }}>
          {[
            { value: 'overview', label: 'Overview', icon: Zap },
            { value: 'posts', label: 'Posts', icon: Share2 },
            { value: 'learning', label: 'Learning', icon: BookOpen },
            { value: 'achievements', label: 'Awards', icon: Trophy },
            { value: 'platforms', label: 'Platforms', icon: Code },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}
              className="flex items-center gap-1.5 rounded-lg text-xs data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
              style={{}}>
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Video, value: completedVideos, label: 'Videos Completed', color: 'text-violet-400 bg-violet-500/15' },
              { icon: Clock, value: `${watchTimeHours}h`, label: 'Learning Time', color: 'text-cyan-400 bg-cyan-500/15' },
              { icon: Heart, value: totalLikes + totalComments, label: 'Interactions', color: 'text-pink-400 bg-pink-500/15' },
              { icon: BookOpen, value: enrolledCourses.length, label: 'Courses', color: 'text-amber-400 bg-amber-500/15' },
            ].map(({ icon: Icon, value, label, color }, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-5 card-lift"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-4.5 h-4.5" style={{width:'18px',height:'18px'}} />
                </div>
                <div className="text-2xl font-extrabold text-foreground mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          {userProfile?.skills && userProfile.skills.length > 0 && (
            <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Zap className="w-4 h-4 text-primary" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-xl bg-primary/8 border border-primary/15 text-primary/90">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Recent Activity</h3>
            <div className="space-y-2">
              {posts.slice(0, 5).map(post => (
                <div key={post.id} className="flex items-start justify-between p-3 rounded-xl hover:bg-white/3 transition-colors group cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{post.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400/70" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-cyan-400/70" />{post.comments.length}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-primary/8 text-primary ml-3 flex-shrink-0">{post.type}</span>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Posts */}
        <TabsContent value="posts">
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map(post => (
              <div key={post.id} className="rounded-2xl border border-border/50 p-5 card-lift group cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/15 text-primary">{post.type}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400/70" />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-cyan-400/70" />{post.comments.length}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2" style={{ fontFamily: 'Sora, sans-serif' }}>{post.title}</h4>
                {post.content && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{post.content}</p>}
              </div>
            ))}
            {posts.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No posts yet</div>}
          </div>
        </TabsContent>

        {/* Learning */}
        <TabsContent value="learning">
          <div className="grid md:grid-cols-2 gap-4">
            {enrolledCourses.map((course, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-5 card-lift"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{typeof course === 'string' ? '' : course.category}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {typeof course === 'string' ? course : course.title}
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-gradient">{typeof course === 'object' ? course.progress : 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${typeof course === 'object' ? course.progress : 0}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
                  </div>
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No courses enrolled yet</div>}
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Trophy, title: "First Post", earned: totalPosts >= 1 },
              { icon: Star, title: "100 Likes", earned: totalLikes >= 100 },
              { icon: Video, title: "Video Master", earned: completedVideos >= 10 },
              { icon: Flame, title: "7-Day Streak", earned: false },
              { icon: Crown, title: "Top Creator", earned: totalPosts >= 5 },
              { icon: Rocket, title: "Rising Star", earned: true },
            ].map(({ icon: Icon, title, earned }, i) => (
              <div key={i}
                className={`rounded-2xl border p-5 text-center card-lift transition-all duration-300 ${earned ? 'border-primary/25 bg-primary/5' : 'border-border/30 opacity-55'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${earned ? 'bg-primary/20' : 'bg-border/30'}`}>
                  <Icon className={`w-6 h-6 ${earned ? 'text-primary' : 'text-muted-foreground/40'}`} />
                </div>
                <h4 className="font-semibold text-foreground text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h4>
                {earned && <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3 h-3" />Unlocked</span>}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Platforms */}
        <TabsContent value="platforms">
          <PlatformIntegrations />
          {userProfile?.githubStats && (
            <div className="mt-4 rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                <Github className="w-4 h-4" /> GitHub Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { v: userProfile.githubStats.repos, l: 'Repos' },
                  { v: userProfile.githubStats.stars, l: 'Stars' },
                  { v: userProfile.githubStats.followers, l: 'Followers' },
                  { v: userProfile.githubStats.contributions, l: 'Contributions' },
                ].map(({ v, l }, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/3 border border-border/30">
                    <div className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{v}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="rounded-2xl max-w-md" style={{ background: 'hsl(230,25%,8%)', border: '1px solid hsl(230,20%,14%)' }}>
          <DialogHeader>
            <DialogTitle className="text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {[
              { id: 'name', label: 'Name', type: 'input', placeholder: 'Your full name' },
              { id: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell your story...' },
              { id: 'skills', label: 'Skills (comma-separated)', type: 'input', placeholder: 'React, Python, Design...' },
              { id: 'hobbies', label: 'Hobbies (comma-separated)', type: 'input', placeholder: 'Reading, Coding...' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</Label>
                {type === 'textarea' ? (
                  <Textarea
                    value={(editData as any)[id]}
                    onChange={e => setEditData({ ...editData, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="premium-input resize-none h-20" />
                ) : (
                  <Input
                    value={(editData as any)[id]}
                    onChange={e => setEditData({ ...editData, [id]: e.target.value })}
                    placeholder={placeholder}
                    className="premium-input" />
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowEditDialog(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" />Save</>}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
