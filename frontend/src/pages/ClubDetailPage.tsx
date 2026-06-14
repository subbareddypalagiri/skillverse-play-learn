import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { useClubs } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";
import { getClubTypeConfig } from "@/lib/clubTypes";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Users, Search, Crown, Shield, UserPlus, LogOut,
  MessageCircle, Heart, Send, Info, Calendar, Hash
} from "lucide-react";

type ActiveView = 'feed' | 'members' | 'about';

const roleConfig = {
  admin: { label: 'Admin', icon: Crown, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  moderator: { label: 'Moderator', icon: Shield, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  member: { label: 'Member', icon: Users, color: 'text-white/50 bg-white/5 border-white/10' },
};

const ClubDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clubs, joinClub, leaveClub, addPost, likePost, addComment, isUserMember, isUserAdmin } = useClubs();

  const [activeView, setActiveView] = useState<ActiveView>('feed');
  const [memberSearch, setMemberSearch] = useState('');
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  const currentUser = {
    id: user?._id || 'guest',
    name: user?.name || 'Guest User',
  };

  const club = clubs.find(c => c.id === id);
  const typeConfig = club ? getClubTypeConfig(club.type) : null;
  const Icon = typeConfig?.icon;
  const isMember = club ? isUserMember(club.id, currentUser.id) : false;
  const isAdmin = club ? isUserAdmin(club.id, currentUser.id) : false;

  const filteredMembers = useMemo(() => {
    if (!club) return [];
    const q = memberSearch.toLowerCase().trim();
    if (!q) return club.members;
    return club.members.filter(m =>
      m.userName.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  }, [club, memberSearch]);

  const sortedMembers = useMemo(() => {
    const order = { admin: 0, moderator: 1, member: 2 };
    return [...filteredMembers].sort((a, b) => order[a.role] - order[b.role]);
  }, [filteredMembers]);

  if (!club) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Club not found</h2>
          <p className="text-muted-foreground mb-6">This club may have been removed or doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
          >
            Back to Events
          </button>
        </div>
      </PageLayout>
    );
  }

  const handleJoin = () => {
    joinClub(club.id, currentUser.id, currentUser.name);
  };

  const handleLeave = () => {
    leaveClub(club.id, currentUser.id);
    navigate('/events');
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    addPost(club.id, {
      clubId: club.id,
      userId: currentUser.id,
      userName: currentUser.name,
      content: newPost,
    });
    setNewPost('');
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) return;
    addComment(club.id, postId, {
      userId: currentUser.id,
      userName: currentUser.name,
      text: newComment,
    });
    setNewComment('');
    setCommentPostId(null);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-amber-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-violet-500',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        {/* WhatsApp-style header */}
        <div className="rounded-2xl overflow-hidden border border-border/50 mb-4"
          style={{ background: 'hsl(230,25%,7%)' }}>
          <div className={`h-28 relative bg-gradient-to-r ${typeConfig?.gradient || 'from-purple-500 to-indigo-500'}`}>
            <div className="absolute inset-0 bg-black/20" />
            <button
              onClick={() => navigate('/events')}
              className="absolute top-4 left-4 p-2 rounded-xl bg-black/30 backdrop-blur hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="px-5 pb-5 -mt-10 relative">
            <div className="flex items-end gap-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${typeConfig?.gradient || 'from-purple-500 to-indigo-500'} flex items-center justify-center border-4 border-[hsl(230,25%,7%)] shadow-xl flex-shrink-0`}>
                {Icon && <Icon className="w-9 h-9 text-white" />}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h1 className="text-xl font-bold text-foreground truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {club.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {club.members.length} members · {club.posts.length} posts
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{club.description}</p>

            <div className="flex gap-2 mt-4">
              {isMember ? (
                <>
                  <button
                    onClick={() => setActiveView('members')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    View Members
                  </button>
                  {!isAdmin && (
                    <button
                      onClick={handleLeave}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleJoin}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
                >
                  <UserPlus className="w-4 h-4" />
                  Join Club
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 rounded-xl mb-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid hsl(230,20%,14%)' }}>
          {([
            { id: 'feed' as ActiveView, label: 'Feed', icon: MessageCircle },
            { id: 'members' as ActiveView, label: 'Members', icon: Users },
            { id: 'about' as ActiveView, label: 'About', icon: Info },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === tab.id
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed view */}
        {activeView === 'feed' && (
          <div className="space-y-4">
            {!isMember ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-border/50">
                <UserPlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Join this club to see and post in the feed</p>
                <button onClick={handleJoin} className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  Join Now
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-border/50 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Textarea
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    placeholder="Share something with the group..."
                    rows={2}
                    className="premium-input resize-none mb-3"
                  />
                  <button onClick={handlePost}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </div>

                {club.posts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-border/40 p-4"
                    style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(post.userName)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {post.userName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{post.userName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/30 pt-3">
                      <button onClick={() => likePost(club.id, post.id)}
                        className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                        <Heart className="w-3.5 h-3.5" /> {post.likes}
                      </button>
                      <button onClick={() => setCommentPostId(commentPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {post.comments.length}
                      </button>
                    </div>

                    {post.comments.map((c, i) => (
                      <div key={i} className="mt-2 ml-12 flex gap-2 text-xs">
                        <span className="font-semibold text-foreground/80">{c.userName}:</span>
                        <span className="text-muted-foreground">{c.text}</span>
                      </div>
                    ))}

                    {commentPostId === post.id && (
                      <div className="flex gap-2 mt-3 ml-12">
                        <input
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                          className="flex-1 bg-white/4 border border-border/40 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/40"
                        />
                        <button onClick={() => handleComment(post.id)}
                          className="p-2 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {club.posts.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No posts yet — be the first to share!
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Members view — WhatsApp group style */}
        {activeView === 'members' && (
          <div className="rounded-2xl border border-border/50 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            {/* Search bar */}
            <div className="p-4 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/4 border border-border/40 text-sm outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {sortedMembers.length} of {club.members.length} members
              </p>
            </div>

            {/* Member list */}
            <div className="divide-y divide-border/30">
              {sortedMembers.map((member) => {
                const role = roleConfig[member.role];
                const RoleIcon = role.icon;
                const isYou = member.userId === currentUser.id;

                return (
                  <div
                    key={member.userId}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(member.userName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative`}>
                      {member.userName[0]}
                      {member.role === 'admin' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center border-2 border-[hsl(230,25%,7%)]">
                          <Crown className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          {member.userName}
                          {isYou && <span className="text-muted-foreground font-normal"> (You)</span>}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border ${role.color}`}>
                      <RoleIcon className="w-3 h-3" />
                      {role.label}
                    </span>
                  </div>
                );
              })}

              {sortedMembers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">No members match your search</p>
              )}
            </div>
          </div>
        )}

        {/* About view */}
        {activeView === 'about' && (
          <div className="rounded-2xl border border-border/50 p-5 space-y-5"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm leading-relaxed">{club.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Hash, label: 'Category', value: club.category },
                { icon: Icon || Users, label: 'Type', value: typeConfig?.label || club.type },
                { icon: Users, label: 'Members', value: String(club.members.length) },
                { icon: Calendar, label: 'Created', value: new Date(club.createdDate).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/40 p-3"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <item.icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Club Admin</h3>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(club.adminName)} flex items-center justify-center text-white font-bold text-sm`}>
                  {club.adminName[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{club.adminName}</p>
                  <p className="text-xs text-muted-foreground">Group Admin</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClubDetailPage;
