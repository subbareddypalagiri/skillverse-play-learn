import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Palette, Music, Dumbbell, Code, Camera, BookOpen, Gamepad2, Coffee, Heart, MessageCircle, Crown, UserPlus, Send, Sparkles, ArrowRight } from "lucide-react";
import { useClubs } from "@/contexts/ClubContext";

const ClubsSection = () => {
  const { clubs, createClub, joinClub, addPost, likePost, addComment, isUserMember, isUserAdmin } = useClubs();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '' });
  const [newComment, setNewComment] = useState('');
  const currentUser = { id: 'user123', name: 'John Student' };

  const [newClub, setNewClub] = useState({
    name: '', category: 'hobby' as 'hobby' | 'club', type: 'art',
    description: '', coverImage: '', isActive: true,
  });

  const clubTypes = [
    { type: 'art', icon: Palette, label: 'Art & Design' },
    { type: 'music', icon: Music, label: 'Music' },
    { type: 'sports', icon: Dumbbell, label: 'Sports' },
    { type: 'tech', icon: Code, label: 'Technology' },
    { type: 'photography', icon: Camera, label: 'Photography' },
    { type: 'reading', icon: BookOpen, label: 'Reading' },
    { type: 'gaming', icon: Gamepad2, label: 'Gaming' },
    { type: 'other', icon: Coffee, label: 'Other' },
  ];

  const handleCreateClub = () => {
    createClub({ ...newClub, adminId: currentUser.id, adminName: currentUser.name });
    setShowCreateDialog(false);
    setNewClub({ name: '', category: 'hobby', type: 'art', description: '', coverImage: '', isActive: true });
  };

  const handleJoinClub = (clubId: string) => joinClub(clubId, currentUser.id, currentUser.name);
  const handleAddPost = (clubId: string) => {
    if (!newPost.content.trim()) return;
    addPost(clubId, { clubId, userId: currentUser.id, userName: currentUser.name, content: newPost.content, mediaUrl: newPost.mediaUrl });
    setNewPost({ content: '', mediaUrl: '' });
  };
  const handleAddComment = (clubId: string, postId: string) => {
    if (!newComment.trim()) return;
    addComment(clubId, postId, { userId: currentUser.id, userName: currentUser.name, content: newComment });
    setNewComment('');
  };

  const selectedClubData = clubs.find(c => c.id === selectedClub);

  const ClubCard = ({ club, showMemberBadge = false }: { club: any; showMemberBadge?: boolean }) => {
    const typeConfig = clubTypes.find(t => t.type === club.type);
    const Icon = typeConfig?.icon || Coffee;
    const isMember = isUserMember(club.id, currentUser.id);
    const isAdmin = isUserAdmin(club.id, currentUser.id);
    return (
      <div className="group relative rounded-2xl border border-border/50 hover:border-primary/30 overflow-hidden card-lift transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />
        {/* Club header */}
        <div className="h-20 flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.1))' }}>
          <div className="absolute inset-0 bg-grid opacity-50" />
          <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="relative z-10 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1"
              style={{ fontFamily: 'Sora, sans-serif' }}>{club.name}</h3>
            {isAdmin && (
              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-lg flex-shrink-0">
                <Crown className="w-3 h-3" />Admin
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{club.description}</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-primary/8 border border-primary/15 text-primary">{club.category}</span>
            <span className="text-[10px] text-muted-foreground">{typeConfig?.label}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{club.members.length}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{club.posts.length}</span>
          </div>
          {isMember ? (
            <button onClick={() => setSelectedClub(club.id)}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.25)]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              Open Club
            </button>
          ) : (
            <button onClick={() => handleJoinClub(club.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-muted-foreground border border-border/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
              <UserPlus className="w-3.5 h-3.5" /> Join Club
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="badge-gradient inline-flex mb-3">
            <Users className="w-3 h-3" />
            Communities
          </div>
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Clubs & Communities</h2>
          <p className="text-muted-foreground text-sm mt-1">Join clubs and connect with like-minded students</p>
        </div>
        <button onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
          <Plus className="w-3.5 h-3.5" /> Create Club
        </button>
      </div>

      <Tabs defaultValue="all" className="space-y-5">
        <TabsList className="inline-flex rounded-xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(230,20%,14%)' }}>
          {[{ value: 'all', label: 'All Clubs' }, { value: 'my-clubs', label: 'My Clubs' }].map(({ value, label }) => (
            <TabsTrigger key={value} value={value}
              className="px-5 py-2 rounded-lg text-sm text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map(club => <ClubCard key={club.id} club={club} />)}
          </div>
        </TabsContent>

        <TabsContent value="my-clubs">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.filter(c => isUserMember(c.id, currentUser.id)).map(club => (
              <ClubCard key={club.id} club={club} showMemberBadge />
            ))}
            {clubs.filter(c => isUserMember(c.id, currentUser.id)).length === 0 && (
              <div className="col-span-full text-center py-14">
                <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary/60" />
                </div>
                <h3 className="font-bold text-foreground mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>No clubs joined yet</h3>
                <p className="text-sm text-muted-foreground">Browse the All Clubs tab and join something!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Club Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md rounded-2xl" style={{ background: 'hsl(230,25%,7%)', border: '1px solid hsl(230,20%,14%)' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              Create New Club
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Club Name</label>
              <input value={newClub.name} onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                placeholder="e.g., Digital Art Enthusiasts" className="premium-input" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
              <select value={newClub.type} onChange={e => setNewClub({ ...newClub, type: e.target.value })}
                className="premium-input">
                {clubTypes.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
              <Textarea value={newClub.description} onChange={e => setNewClub({ ...newClub, description: e.target.value })}
                placeholder="Tell everyone what this club is about..." rows={3}
                className="premium-input resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowCreateDialog(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground border border-border/50 hover:text-foreground hover:border-border transition-all">
                Cancel
              </button>
              <button onClick={handleCreateClub}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                Create Club
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Club View Dialog */}
      {selectedClubData && (
        <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
            style={{ background: 'hsl(230,25%,7%)', border: '1px solid hsl(230,20%,14%)' }}>
            <DialogHeader>
              <DialogTitle className="text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{selectedClubData.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{selectedClubData.description}</p>
            </DialogHeader>
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/15 text-primary">
                  {selectedClubData.members.length} members
                </span>
                <span className="text-xs text-muted-foreground">{selectedClubData.posts.length} posts</span>
              </div>

              {/* Create Post */}
              <div className="rounded-2xl border border-border/50 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h4 className="font-semibold text-sm text-foreground mb-3">Share with the club</h4>
                <Textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?" rows={2}
                  className="premium-input resize-none mb-3" />
                <button onClick={() => handleAddPost(selectedClubData.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </div>

              {/* Posts */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Club Feed</h4>
                {selectedClubData.posts.map((post: any) => (
                  <div key={post.id} className="rounded-xl border border-border/40 p-4 hover:border-primary/25 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {post.userName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-foreground">{post.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(post.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed mb-3">{post.content}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border/30 pt-3">
                      <button onClick={() => likePost(selectedClubData.id, post.id, currentUser.id)}
                        className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                        <Heart className="w-3.5 h-3.5" />{post.likes.length}
                      </button>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.comments.length}</span>
                    </div>
                    {/* Comments */}
                    {post.comments.map((c: any) => (
                      <div key={c.id} className="mt-2 ml-4 text-xs text-muted-foreground flex gap-1.5">
                        <span className="font-semibold text-foreground/70">{c.userName}:</span>
                        <span>{c.content}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <input value={newComment} onChange={e => setNewComment(e.target.value)}
                        placeholder="Comment..." onKeyDown={e => e.key === 'Enter' && handleAddComment(selectedClubData.id, post.id)}
                        className="flex-1 bg-white/4 border border-border/40 rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 transition-colors" />
                      <button onClick={() => handleAddComment(selectedClubData.id, post.id)}
                        className="p-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedClubData.posts.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No posts yet — be the first to share!</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClubsSection;
