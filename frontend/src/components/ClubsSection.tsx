import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Plus, Palette, Music, Dumbbell, Code, Camera, 
  BookOpen, Gamepad2, Coffee, Heart, MessageCircle, Share2,
  Crown, UserPlus, Settings, Send
} from "lucide-react";
import { useClubs } from "@/contexts/ClubContext";

const ClubsSection = () => {
  const { clubs, createClub, joinClub, addPost, likePost, addComment, isUserMember, isUserAdmin } = useClubs();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '' });
  const [newComment, setNewComment] = useState('');

  const currentUser = { id: 'user123', name: 'John Student' };

  const [newClub, setNewClub] = useState({
    name: '',
    category: 'hobby' as 'hobby' | 'club',
    type: 'art',
    description: '',
    coverImage: '',
    isActive: true,
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
    createClub({
      ...newClub,
      adminId: currentUser.id,
      adminName: currentUser.name,
    });
    setShowCreateDialog(false);
    setNewClub({
      name: '',
      category: 'hobby',
      type: 'art',
      description: '',
      coverImage: '',
      isActive: true,
    });
  };

  const handleJoinClub = (clubId: string) => {
    joinClub(clubId, currentUser.id, currentUser.name);
  };

  const handleAddPost = (clubId: string) => {
    if (!newPost.content.trim()) return;
    
    addPost(clubId, {
      clubId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: newPost.content,
      mediaUrl: newPost.mediaUrl,
    });
    setNewPost({ content: '', mediaUrl: '' });
  };

  const handleAddComment = (clubId: string, postId: string) => {
    if (!newComment.trim()) return;
    
    addComment(clubId, postId, {
      userId: currentUser.id,
      userName: currentUser.name,
      text: newComment,
    });
    setNewComment('');
  };

  const selectedClubData = clubs.find(c => c.id === selectedClub);

  return (
    <div className="mt-12">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="mb-6 flex items-center justify-between" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out forwards' }}>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-1">Clubs & Communities</h2>
          <p className="text-muted-foreground text-sm">Join clubs and connect with like-minded students</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Club
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 transition-all duration-300">All Clubs</TabsTrigger>
          <TabsTrigger value="my-clubs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 transition-all duration-300">My Clubs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club, index) => {
              const typeConfig = clubTypes.find(t => t.type === club.type);
              const Icon = typeConfig?.icon || Coffee;
              const isMember = isUserMember(club.id, currentUser.id);
              const isAdmin = isUserAdmin(club.id, currentUser.id);

              return (
                <Card 
                  key={club.id} 
                  className="overflow-hidden bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                  style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${index * 40}ms forwards` }}
                >
                  <div className="h-20 bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">{club.name}</h3>
                      {isAdmin && <Crown className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{club.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{club.category}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground">{typeConfig?.label}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{club.members.length} members</span>
                      <span>{club.posts.length} posts</span>
                    </div>

                    {isMember ? (
                      <Button 
                        onClick={() => setSelectedClub(club.id)}
                        size="sm"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs h-8"
                      >
                        Open Club
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleJoinClub(club.id)}
                        size="sm"
                        variant="outline"
                        className="w-full border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 text-xs h-8"
                      >
                        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                        Join Club
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-clubs">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.filter(c => isUserMember(c.id, currentUser.id)).map((club, index) => {
              const typeConfig = clubTypes.find(t => t.type === club.type);
              const Icon = typeConfig?.icon || Coffee;
              const isAdmin = isUserAdmin(club.id, currentUser.id);

              return (
                <Card 
                  key={club.id} 
                  className="overflow-hidden bg-card rounded-xl border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
                  style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${index * 40}ms forwards` }}
                >
                  <div className="h-20 bg-primary/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">{club.name}</h3>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{club.description}</p>
                    
                    <div className="flex items-center justify-between text-xs mb-3 text-muted-foreground">
                      <span>{club.members.length} members</span>
                      <span>{club.posts.length} posts</span>
                    </div>

                    <Button 
                      onClick={() => setSelectedClub(club.id)}
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs h-8"
                    >
                      Open Club
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Club Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              Create New Club
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Club Name</label>
              <Input
                value={newClub.name}
                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                placeholder="e.g., Digital Art Enthusiasts"
                className="h-9 text-sm border-border/50 focus:border-primary/50"
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Type</label>
              <select
                value={newClub.type}
                onChange={(e) => setNewClub({ ...newClub, type: e.target.value })}
                className="w-full h-9 px-3 text-sm border border-border/50 rounded-lg bg-background focus:border-primary/50 focus:outline-none transition-colors duration-300"
              >
                {clubTypes.map((type) => (
                  <option key={type.type} value={type.type}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Description</label>
              <Textarea
                value={newClub.description}
                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                placeholder="Tell everyone what this club is about..."
                rows={3}
                className="text-sm border-border/50 focus:border-primary/50 resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCreateDialog(false)}
                className="border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateClub}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Create Club
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Club View Dialog */}
      {selectedClubData && (
        <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{selectedClubData.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{selectedClubData.description}</p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{selectedClubData.members.length} members</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground">{selectedClubData.posts.length} posts</span>
              </div>

              {/* Create Post */}
              <Card className="p-3 border-border/50">
                <h4 className="font-medium text-sm mb-2">Share with the club</h4>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={2}
                  className="mb-2 text-sm border-border/50 focus:border-primary/50 resize-none"
                />
                <Button 
                  onClick={() => handleAddPost(selectedClubData.id)}
                  size="sm"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-8 text-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Post
                </Button>
              </Card>

              {/* Posts */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Club Feed</h4>
                {selectedClubData.posts.map((post) => (
                  <Card key={post.id} className="p-3 border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {post.userName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-xs">{post.userName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm mb-2">{post.content}</p>

                    <div className="flex items-center gap-3 mb-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => likePost(selectedClubData.id, post.id)}
                        className="gap-1 h-7 px-2 hover:bg-primary/10 transition-all duration-300"
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.likes > 0 ? 'fill-primary text-primary' : ''}`} />
                        <span className="text-xs">{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 hover:bg-primary/10 transition-all duration-300">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">{post.comments.length}</span>
                      </Button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 mt-2 border-t border-border/30 pt-2">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
                              {comment.userName[0]}
                            </div>
                            <div className="flex-1 bg-muted/30 rounded-lg p-2">
                              <p className="font-medium text-[10px]">{comment.userName}</p>
                              <p className="text-xs">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(selectedClubData.id, post.id);
                          }
                        }}
                        className="h-8 text-xs border-border/50 focus:border-primary/50"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddComment(selectedClubData.id, post.id)}
                        className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClubsSection;
