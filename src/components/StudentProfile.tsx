import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Trophy, Star, Zap, Award, BookOpen, Video, Heart, 
  MessageCircle, Share2, CheckCircle, Code, Palette, 
  Music, MapPin, Github, Linkedin, ExternalLink, 
  TrendingUp, Clock, Calendar, Target, Flame, 
  Crown, Sparkles, Rocket, Medal, Edit, Save, Plus, X
} from "lucide-react";
import { useSocial } from "@/contexts/SocialContext";
import { useVideoProgress } from "@/contexts/VideoProgressContext";
import { useCourseContext } from "@/contexts/CourseContext";
import { useState } from "react";

const StudentProfile = () => {
  const { posts, userProfile, updateProfile } = useSocial();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: userProfile?.name || '',
    bio: userProfile?.bio || '',
    hobbies: userProfile?.hobbies?.join(', ') || '',
    skills: userProfile?.skills?.join(', ') || '',
  });
  const { videoProgress, getCourseProgress } = useVideoProgress();
  const { enrolledCourses } = useCourseContext();

  // Calculate stats
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  const completedVideos = videoProgress.filter(v => v.completed).length;
  const totalVideosWatched = videoProgress.length;
  const totalWatchTime = videoProgress.reduce((sum, v) => sum + v.watchedDuration, 0);
  const watchTimeHours = Math.floor(totalWatchTime / 3600);

  // Get post type distribution
  const postsByType = posts.reduce((acc, post) => {
    acc[post.type] = (acc[post.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveProfile = () => {
    updateProfile({
      name: editData.name,
      bio: editData.bio,
      hobbies: editData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
      skills: editData.skills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setShowEditDialog(false);
  };

  const handleOpenEdit = () => {
    setEditData({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      hobbies: userProfile?.hobbies?.join(', ') || '',
      skills: userProfile?.skills?.join(', ') || '',
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Profile Header */}
      <Card className="relative overflow-hidden border-2">
        {/* Simplified Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30" />
        
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {userProfile?.name?.[0] || 'S'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                <Crown className="w-5 h-5 text-yellow-900" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <h1 className="text-5xl font-black text-foreground">
                  {userProfile?.name || 'Amazing Student'}
                </h1>
                <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-lg mb-4">
                {userProfile?.bio || 'Hustling, Learning, Creating! 🔥'}
              </p>

              {/* Edit Profile Button */}
              <Button
                onClick={handleOpenEdit}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-4 gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile ⚡
              </Button>

              {/* Quick Stats */}
              <div className="flex gap-8 justify-center md:justify-start flex-wrap">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {totalPosts}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {userProfile?.followers || 0}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {userProfile?.following || 0}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {totalLikes}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Likes</p>
                </div>
              </div>
            </div>

            {/* Level Badge - Simplified */}
            <div className="text-center">
              <Card className="bg-yellow-400 border-2 border-yellow-500 p-6 shadow-lg">
                <Flame className="w-10 h-10 mx-auto mb-2 text-yellow-900" />
                <p className="text-yellow-900 font-bold text-2xl">Level 5</p>
                <p className="text-yellow-800 text-sm font-semibold">🔥 Streak</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Showcase Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <Zap className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <Share2 className="w-4 h-4" />
            Posts ({totalPosts})
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="platforms" className="gap-2">
            <Code className="w-4 h-4" />
            Platforms
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Activity Stats Grid - Simplified */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Videos Watched */}
            <Card className="p-6 border-2 hover:border-red-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Video className="w-8 h-8 text-red-500" />
                <Badge variant="secondary">✓</Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{completedVideos}</p>
              <p className="text-sm text-muted-foreground font-medium">Videos Completed</p>
              <Progress value={(completedVideos / Math.max(totalVideosWatched, 1)) * 100} className="mt-3" />
            </Card>

            {/* Watch Time */}
            <Card className="p-6 border-2 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-3xl font-bold mb-1">{watchTimeHours}h</p>
              <p className="text-sm text-muted-foreground font-medium">Learning Time</p>
              <p className="text-xs text-blue-600 mt-2 font-medium">+{Math.floor(watchTimeHours / 10)} badges 🎖️</p>
            </Card>

            {/* Engagement Score */}
            <Card className="p-6 border-2 hover:border-pink-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Heart className="w-8 h-8 text-pink-500" />
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold mb-1">{totalLikes + totalComments}</p>
              <p className="text-sm text-muted-foreground font-medium">Engagement</p>
              <p className="text-xs text-pink-600 mt-2 font-medium">Top 10%! 🌟</p>
            </Card>

            {/* Courses Enrolled */}
            <Card className="p-6 border-2 hover:border-green-400 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-8 h-8 text-green-500" />
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold mb-1">{enrolledCourses.length}</p>
              <p className="text-sm text-muted-foreground font-medium">Courses</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Keep going! 💪</p>
            </Card>
          </div>

          {/* Recent Activity Timeline */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-500" />
              Recent Activity 🔥
            </h3>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post, idx) => (
                <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{post.type}</Badge>
                      <p className="font-semibold">{post.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ❤️ {post.likes} • 💬 {post.comments.length} • {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* POSTS TAB */}
        <TabsContent value="posts" className="space-y-6">
          {/* Post Type Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(postsByType).map(([type, count]) => {
              const icons = {
                artwork: { icon: Palette, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                music: { icon: Music, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
                video: { icon: Video, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                travel: { icon: MapPin, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                achievement: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                project: { icon: Code, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              };
              const config = icons[type as keyof typeof icons];
              const Icon = config.icon;
              
              return (
                <Card key={type} className={`p-4 ${config.bg}`}>
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                  <p className="text-2xl font-bold text-center">{count}</p>
                  <p className="text-xs text-center text-muted-foreground capitalize">{type}</p>
                </Card>
              );
            })}
          </div>

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary">{post.type}</Badge>
                  <h4 className="font-semibold flex-1">{post.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" /> {post.comments.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-4 h-4 text-green-500" /> {post.shares}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LEARNING TAB */}
        <TabsContent value="learning" className="space-y-6">
          {/* Video Progress */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" />
              Video Watch Progress 📺
            </h3>
            <div className="space-y-3">
              {videoProgress.slice(0, 10).map((video) => (
                <div key={video.videoId} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {video.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-500" />
                      )}
                      <p className="font-semibold">{video.videoTitle}</p>
                    </div>
                    {video.completed && <Badge className="bg-green-500 text-white">Complete!</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{video.courseTitle}</p>
                  <Progress 
                    value={(video.watchedDuration / video.totalDuration) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((video.watchedDuration / video.totalDuration) * 100)}% watched
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Enrolled Courses */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              My Courses 📚
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course, idx) => (
                <div key={idx} className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <h4 className="font-bold mb-2">{typeof course === 'string' ? course : course.title}</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.random() * 100} className="flex-1" />
                    <span className="text-sm font-semibold">{Math.floor(Math.random() * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Achievement Cards */}
            {[
              { icon: Trophy, title: "First Post!", desc: "Created your first post", color: "from-yellow-500 to-orange-500", earned: true },
              { icon: Star, title: "100 Likes", desc: "Received 100+ likes", color: "from-pink-500 to-red-500", earned: totalLikes >= 100 },
              { icon: Video, title: "Video Master", desc: "Completed 10 videos", color: "from-red-500 to-pink-500", earned: completedVideos >= 10 },
              { icon: Flame, title: "7 Day Streak", desc: "Posted for 7 days straight", color: "from-orange-500 to-red-500", earned: false },
              { icon: Crown, title: "Top Creator", desc: "Top 10% creators", color: "from-purple-500 to-pink-500", earned: totalPosts >= 5 },
              { icon: Rocket, title: "Rising Star", desc: "Growing fast!", color: "from-blue-500 to-cyan-500", earned: true },
            ].map((achievement, idx) => (
              <Card 
                key={idx} 
                className={`p-6 relative overflow-hidden ${achievement.earned ? 'border-2 border-yellow-400' : 'opacity-50'}`}
              >
                {achievement.earned && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                {achievement.earned && (
                  <Badge className="mt-3 bg-green-500 text-white">Earned! 🎉</Badge>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PLATFORMS TAB */}
        <TabsContent value="platforms" className="space-y-6">
          {userProfile?.githubStats && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Github className="w-8 h-8" />
                <h3 className="text-xl font-bold">GitHub Stats 💻</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.githubStats.repos}</p>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.githubStats.stars}</p>
                  <p className="text-sm text-muted-foreground">Stars ⭐</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.githubStats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.githubStats.contributions}</p>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                </div>
              </div>
            </Card>
          )}

          {userProfile?.leetcodeStats && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-bold">LeetCode Stats 🏆</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.leetcodeStats.solved}</p>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <p className="text-3xl font-bold">#{userProfile.leetcodeStats.ranking}</p>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <p className="text-3xl font-bold">{userProfile.leetcodeStats.badges.length}</p>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
              </div>
            </Card>
          )}

          {/* Connected Platforms List */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">All Connected Platforms 🔗</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(userProfile || {}).filter(([key]) => key.includes('http')).map(([key, value]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => window.open(value as string, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="w-6 h-6 text-purple-500" />
              Edit Your Profile ⚡
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                👤 Full Name
              </Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Enter your amazing name..."
                className="text-lg"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base font-semibold flex items-center gap-2">
                ✨ Bio
              </Label>
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell everyone what makes you awesome! 🔥"
                rows={3}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Make it energetic! Add emojis! Show your vibe! 💪
              </p>
            </div>

            {/* Hobbies */}
            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-base font-semibold flex items-center gap-2">
                🎨 Hobbies
              </Label>
              <Input
                id="hobbies"
                value={editData.hobbies}
                onChange={(e) => setEditData({ ...editData, hobbies: e.target.value })}
                placeholder="coding, music, art, travel, gaming..."
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas. Example: coding, guitar, photography
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base font-semibold flex items-center gap-2">
                💪 Skills
              </Label>
              <Textarea
                id="skills"
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                placeholder="React, Python, Design, Leadership..."
                rows={3}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas. Show off your superpowers! 🚀
              </p>
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">💡 Pro Tip!</h4>
                  <p className="text-sm text-muted-foreground">
                    A complete profile gets more followers! Add your hobbies, skills, and a catchy bio. 
                    Connect your GitHub, LeetCode in the "Platforms" tab! 🔥
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
              >
                <Save className="w-4 h-4" />
                Save Profile 🔥
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
