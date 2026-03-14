import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, MessageCircle, Share2, Send, Camera, Video, Music, 
  Image as ImageIcon, Palette, MapPin, Trophy, Code, Plus
} from "lucide-react";
import { useSocial, Post } from "@/contexts/SocialContext";

const SocialFeed = () => {
  const { posts, addPost, likePost, addComment, userProfile } = useSocial();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');

  const [newPost, setNewPost] = useState({
    type: 'artwork' as Post['type'],
    category: '',
    title: '',
    description: '',
    mediaUrl: '',
    mediaType: 'image' as Post['mediaType'],
    tags: [] as string[],
  });

  const postTypes = [
    { type: 'artwork', icon: Palette, label: 'Artwork', color: 'text-purple-500' },
    { type: 'music', icon: Music, label: 'Music', color: 'text-pink-500' },
    { type: 'video', icon: Video, label: 'Video', color: 'text-red-500' },
    { type: 'travel', icon: MapPin, label: 'Travel', color: 'text-green-500' },
    { type: 'achievement', icon: Trophy, label: 'Achievement', color: 'text-yellow-500' },
    { type: 'project', icon: Code, label: 'Project', color: 'text-blue-500' },
  ];

  const handleCreatePost = () => {
    if (!userProfile) {
      alert('Please create a profile first!');
      return;
    }

    addPost({
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      ...newPost,
    });

    setShowCreatePost(false);
    setNewPost({
      type: 'artwork',
      category: '',
      title: '',
      description: '',
      mediaUrl: '',
      mediaType: 'image',
      tags: [],
    });
  };

  const handleAddComment = (postId: string) => {
    if (!userProfile || !newComment.trim()) return;

    addComment(postId, {
      userId: userProfile.id,
      userName: userProfile.name,
      text: newComment,
    });

    setNewComment('');
  };

  const getTypeIcon = (type: Post['type']) => {
    const typeConfig = postTypes.find(t => t.type === type);
    if (!typeConfig) return null;
    const Icon = typeConfig.icon;
    return <Icon className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-5">
      {/* Create Post Button - Clean Design */}
      <div className="relative bg-card rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-0.5">Share Your Talent</h3>
            <p className="text-sm text-muted-foreground">
              Post artwork, music, travel stories, or achievements
            </p>
          </div>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Quick Post Types */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {postTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => {
                setNewPost({ ...newPost, type: type.type as Post['type'] });
                setShowCreatePost(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <type.icon className="w-3.5 h-3.5" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Be the first to share your talent with the community
            </p>
            <Button onClick={() => setShowCreatePost(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create First Post
            </Button>
          </div>
        ) : (
          posts.map((post, index) => (
            <div 
              key={post.id} 
              className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
              style={{ opacity: 0, animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards` }}
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {post.userName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{post.userName}</h4>
                      {getTypeIcon(post.type)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-muted/50 text-xs">{post.category || post.type}</Badge>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <h3 className="font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.description}</p>

                {/* Media Display */}
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden mb-4 bg-muted/30">
                    {post.mediaType === 'image' && (
                      <img 
                        src={post.mediaUrl} 
                        alt={post.title}
                        className="w-full max-h-96 object-contain"
                      />
                    )}
                    {post.mediaType === 'video' && (
                      <video controls className="w-full max-h-96">
                        <source src={post.mediaUrl} />
                      </video>
                    )}
                    {post.mediaType === 'audio' && (
                      <div className="p-8 flex items-center justify-center">
                        <audio controls className="w-full">
                          <source src={post.mediaUrl} />
                        </audio>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    onClick={() => likePost(post.id)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-primary text-primary' : ''}`} />
                    {post.likes}
                  </button>
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.length}
                  </button>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                    {post.shares}
                  </button>
                </div>
              </div>

              {/* Comments Preview */}
              {post.comments.length > 0 && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 bg-muted/20">
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Create New Post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Post Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Post Type</label>
              <div className="grid grid-cols-3 gap-2">
                {postTypes.map((type) => (
                  <Button
                    key={type.type}
                    variant={newPost.type === type.type ? "default" : "outline"}
                    onClick={() => setNewPost({ ...newPost, type: type.type as Post['type'] })}
                    className="gap-2"
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Give your post a catchy title..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Tell us about your work..."
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Media URL (In production, this would be file upload) */}
            <div>
              <label className="text-sm font-medium mb-2 block">Media URL</label>
              <Input
                placeholder="Paste image, video, or audio URL..."
                value={newPost.mediaUrl}
                onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                In production: Upload files directly
              </p>
            </div>

            {/* Category/Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Input
                placeholder="e.g., Digital Art, Guitar Cover, Paris Trip..."
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} className="bg-gradient-primary">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Post Preview */}
                <Card className="p-4 bg-muted/30">
                  <h4 className="font-semibold mb-2">{selectedPost.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedPost.description}</p>
                </Card>

                {/* Comments List */}
                <div className="space-y-3">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {comment.userName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="font-semibold text-sm mb-1">{comment.userName}</p>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 ml-3">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                  />
                  <Button onClick={() => handleAddComment(selectedPost.id)}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;
