import { useState } from "react";
import PageLayout from "@/components/PageLayout";
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
  Crown, UserPlus, Settings, Send, TrendingUp
} from "lucide-react";
import { useClubs } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";

const Clubs = () => {
  const { clubs, createClub, joinClub, leaveClub, addPost, likePost, addComment, isUserMember, isUserAdmin } = useClubs();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', mediaUrl: '' });
  const [newComment, setNewComment] = useState('');

  const currentUser = {
    id: user?._id || 'guest',
    name: user?.name || 'Guest User',
  };

  const [newClub, setNewClub] = useState({
    name: '',
    category: 'hobby' as 'hobby' | 'club',
    type: 'art',
    description: '',
    coverImage: '',
    isActive: true,
  });

  const clubTypes = [
    { type: 'art', icon: Palette, label: 'Art & Design', color: 'text-purple-500' },
    { type: 'music', icon: Music, label: 'Music', color: 'text-pink-500' },
    { type: 'sports', icon: Dumbbell, label: 'Sports & Fitness', color: 'text-green-500' },
    { type: 'tech', icon: Code, label: 'Technology', color: 'text-blue-500' },
    { type: 'photography', icon: Camera, label: 'Photography', color: 'text-orange-500' },
    { type: 'reading', icon: BookOpen, label: 'Reading & Books', color: 'text-indigo-500' },
    { type: 'gaming', icon: Gamepad2, label: 'Gaming', color: 'text-red-500' },
    { type: 'other', icon: Coffee, label: 'Other', color: 'text-gray-500' },
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

  const handleLeaveClub = (clubId: string) => {
    leaveClub(clubId, currentUser.id);
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
    <PageLayout>
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Hobbies & Clubs 🎨</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Join communities, share your passion, and connect with like-minded students!
          </p>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Club 🚀
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clubs.length}</p>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clubs.reduce((sum, c) => sum + c.members.length, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clubs.reduce((sum, c) => sum + c.posts.length, 0)}</p>
                <p className="text-sm text-muted-foreground">Posts Shared</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{clubs.filter(c => isUserMember(c.id, currentUser.id)).length}</p>
                <p className="text-sm text-muted-foreground">Your Clubs</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Clubs</TabsTrigger>
            <TabsTrigger value="my-clubs">My Clubs</TabsTrigger>
            <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((club) => {
                const typeConfig = clubTypes.find(t => t.type === club.type);
                const Icon = typeConfig?.icon || Coffee;
                const isMember = isUserMember(club.id, currentUser.id);
                const isAdmin = isUserAdmin(club.id, currentUser.id);

                return (
                  <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-32 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg">{club.name}</h3>
                        {isAdmin && <Crown className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{club.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{club.category}</Badge>
                        <Badge variant="outline">{typeConfig?.label}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{club.members.length} members</span>
                        <span>{club.posts.length} posts</span>
                      </div>

                      <div className="flex gap-2">
                        {isMember ? (
                          <>
                            <Button 
                              onClick={() => setSelectedClub(club.id)}
                              className="flex-1"
                            >
                              Open Club
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedClub(club.id);
                                  setShowAdminPanel(true);
                                }}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleJoinClub(club.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join Club
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-clubs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.filter(c => isUserMember(c.id, currentUser.id)).map((club) => {
                const typeConfig = clubTypes.find(t => t.type === club.type);
                const Icon = typeConfig?.icon || Coffee;
                const isAdmin = isUserAdmin(club.id, currentUser.id);

                return (
                  <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-all border-2 border-purple-200">
                    <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg">{club.name}</h3>
                        {isAdmin && (
                          <Badge className="bg-yellow-400 text-yellow-900">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{club.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span>{club.members.length} members</span>
                        <span>{club.posts.length} posts</span>
                      </div>

                      <Button 
                        onClick={() => setSelectedClub(club.id)}
                        className="w-full"
                      >
                        Open Club
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="hobbies">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.filter(c => c.category === 'hobby').map((club) => {
                const typeConfig = clubTypes.find(t => t.type === club.type);
                const Icon = typeConfig?.icon || Coffee;
                const isMember = isUserMember(club.id, currentUser.id);

                return (
                  <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-32 bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{club.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{club.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span>{club.members.length} members</span>
                        <span>{club.posts.length} posts</span>
                      </div>

                      {isMember ? (
                        <Button onClick={() => setSelectedClub(club.id)} className="w-full">
                          Open
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleJoinClub(club.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Club Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Create New Club 🚀
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Club Name</label>
                <Input
                  value={newClub.name}
                  onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="e.g., Digital Art Enthusiasts"
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Type</label>
                <select
                  value={newClub.type}
                  onChange={(e) => setNewClub({ ...newClub, type: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {clubTypes.map((type) => (
                    <option key={type.type} value={type.type}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Category</label>
                <div className="flex gap-4">
                  <Button
                    variant={newClub.category === 'hobby' ? 'default' : 'outline'}
                    onClick={() => setNewClub({ ...newClub, category: 'hobby' })}
                  >
                    Hobby
                  </Button>
                  <Button
                    variant={newClub.category === 'club' ? 'default' : 'outline'}
                    onClick={() => setNewClub({ ...newClub, category: 'club' })}
                  >
                    Club
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Description</label>
                <Textarea
                  value={newClub.description}
                  onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="Tell everyone what this club is about..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateClub}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Create Club 🎉
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Club View Dialog */}
        {selectedClubData && !showAdminPanel && (
          <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedClubData.name}</DialogTitle>
                <p className="text-muted-foreground">{selectedClubData.description}</p>
              </DialogHeader>

              <div className="space-y-6">
                {/* Member Count */}
                <div className="flex items-center gap-4">
                  <Badge>{selectedClubData.members.length} members</Badge>
                  <Badge variant="outline">{selectedClubData.posts.length} posts</Badge>
                </div>

                {/* Create Post */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Share with the club 🎉</h4>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="What's on your mind?"
                    rows={3}
                    className="mb-2"
                  />
                  <Button 
                    onClick={() => handleAddPost(selectedClubData.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </Card>

                {/* Posts */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Club Feed</h4>
                  {selectedClubData.posts.map((post) => (
                    <Card key={post.id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {post.userName[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{post.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <p className="mb-3">{post.content}</p>

                      <div className="flex items-center gap-4 mb-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => likePost(selectedClubData.id, post.id)}
                          className="gap-1"
                        >
                          <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments.length}
                        </Button>
                      </div>

                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 mt-3 border-t pt-3">
                          {post.comments.map((comment, idx) => (
                            <div key={idx} className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                                {comment.userName[0]}
                              </div>
                              <div className="flex-1 bg-muted rounded-lg p-2">
                                <p className="font-semibold text-sm">{comment.userName}</p>
                                <p className="text-sm">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="flex gap-2 mt-3">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(selectedClubData.id, post.id);
                            }
                          }}
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleAddComment(selectedClubData.id, post.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
    </PageLayout>
  );
};

export default Clubs;
