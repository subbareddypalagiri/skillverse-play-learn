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
  Crown, Sparkles, Rocket, Medal, Edit, Save, Plus, X,
  Lightbulb, Brain, Gauge, BarChart3
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
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        name: editData.name,
        bio: editData.bio,
        hobbies: editData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        skills: editData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setShowEditDialog(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
      {/* ========== CLEAN HERO SECTION ========== */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Left: Avatar */}
            <div className="flex flex-col items-center md:items-start gap-4">
              {/* Clean Avatar */}
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-800 dark:text-gray-100 text-5xl font-bold shadow-md">
                  {userProfile?.name?.[0] || 'S'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-2 border-2 border-gray-200 dark:border-gray-700">
                  <Crown className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Center: Profile Info */}
            <div className="space-y-6 text-center md:text-left">
              {/* Name & Bio */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {userProfile?.name || 'Amazing Student'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {userProfile?.bio || 'Learning, Growing, Achieving'}
                </p>
              </div>

              {/* Edit Button */}
              <Button
                onClick={handleOpenEdit}
                className="bg-gray-800 hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold py-2 px-6 gap-2 w-fit mx-auto md:mx-0"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPosts}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile?.followers || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile?.following || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLikes}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Likes</p>
                </div>
              </div>
            </div>

            {/* Right: Level Card - Clean Style */}
            <div className="flex justify-center md:justify-end">
              <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">Level 5</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">7-Day Streak 🔥</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* ========== CLEAN TABS SECTION ========== */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger value="overview" className="gap-2 rounded data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2 rounded data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2 rounded data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2 rounded data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Awards</span>
          </TabsTrigger>
          <TabsTrigger value="platforms" className="gap-2 rounded data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Platforms</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid - Clean */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Videos Completed */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Video className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">In Progress</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{completedVideos}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Videos</p>
              <Progress 
                value={(completedVideos / Math.max(totalVideosWatched, 1)) * 100} 
                className="mt-3"
              />
            </Card>

            {/* Learning Time */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{watchTimeHours}h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Learning Time</p>
            </Card>

            {/* Engagement */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Heart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Engaged</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalLikes + totalComments}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Interactions</p>
            </Card>

            {/* Courses */}
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Enrolled</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{enrolledCourses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Courses</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <div 
                  key={post.id} 
                  className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ❤️ {post.likes} • 💬 {post.comments.length}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* POSTS TAB */}
        <TabsContent value="posts" className="space-y-6">
          {/* Post stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(postsByType).map(([type, count]) => {
              const icons: Record<string, { icon: typeof Star; label: string }> = {
                artwork: { icon: Palette, label: 'Artwork' },
                music: { icon: Music, label: 'Music' },
                video: { icon: Video, label: 'Videos' },
                travel: { icon: MapPin, label: 'Travel' },
                achievement: { icon: Trophy, label: 'Awards' },
                project: { icon: Code, label: 'Projects' },
              };
              const config = icons[type] || { icon: Star, label: type };
              const Icon = config.icon;
              
              return (
                <Card key={type} className="p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{config.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">❤️ {post.likes}</span>
                  <span className="flex items-center gap-1">💬 {post.comments.length}</span>
                  <span className="flex items-center gap-1">📤 {post.shares}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LEARNING TAB */}
        <TabsContent value="learning" className="space-y-6">
          {/* Video Progress */}
          <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Video Progress</h3>
            <div className="space-y-3">
              {videoProgress.slice(0, 6).map((video) => (
                <div key={video.videoId} className="p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{video.videoTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{video.courseTitle}</p>
                    </div>
                    {video.completed && (
                      <Badge variant="secondary" className="ml-2 text-xs">Done</Badge>
                    )}
                  </div>
                  <Progress 
                    value={(video.watchedDuration / video.totalDuration) * 100}
                    className="h-1.5"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((video.watchedDuration / video.totalDuration) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Courses */}
          <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {enrolledCourses.map((course, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                    {typeof course === 'string' ? course : course.title}
                  </h4>
                  <Progress value={Math.random() * 100} className="h-1.5 mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(Math.random() * 100)}% complete</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Trophy, title: "First Post", earned: true },
              { icon: Star, title: "100 Likes", earned: totalLikes >= 100 },
              { icon: Video, title: "Video Master", earned: completedVideos >= 10 },
              { icon: Flame, title: "7-Day Streak", earned: false },
              { icon: Crown, title: "Top Creator", earned: totalPosts >= 5 },
              { icon: Rocket, title: "Rising Star", earned: true },
            ].map((achievement, idx) => (
              <Card 
                key={idx} 
                className={`p-6 border  shadow-sm text-center ${
                  achievement.earned 
                    ? 'border-gray-200 dark:border-gray-700' 
                    : 'border-gray-100 dark:border-gray-800 opacity-50'
                }`}
              >
                <div className="flex justify-center mb-3">
                  <achievement.icon className={`w-8 h-8 ${achievement.earned ? 'text-gray-600 dark:text-gray-400' : 'text-gray-300 dark:text-gray-700'}`} />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h4>
                {achievement.earned && (
                  <Badge variant="secondary" className="text-xs">Unlocked ✓</Badge>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PLATFORMS TAB */}
        <TabsContent value="platforms" className="space-y-6">
          {userProfile?.githubStats && (
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.githubStats.repos}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Repos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.githubStats.stars}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stars</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.githubStats.followers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Followers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.githubStats.contributions}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contributions</p>
                </div>
              </div>
            </Card>
          )}

          {userProfile?.leetcodeStats && (
            <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                LeetCode Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.leetcodeStats.solved}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Solved</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">#{userProfile.leetcodeStats.ranking}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rank</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.leetcodeStats.badges.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Badges</p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* EDIT DIALOG - Clean Minimal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Edit Your Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-900 dark:text-white">
                Full Name
              </Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Enter your name"
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-gray-900 dark:text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum 500 characters
              </p>
            </div>

            {/* Hobbies */}
            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-sm font-semibold text-gray-900 dark:text-white">
                Hobbies
              </Label>
              <Input
                id="hobbies"
                value={editData.hobbies}
                onChange={(e) => setEditData({ ...editData, hobbies: e.target.value })}
                placeholder="Separate with commas"
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-semibold text-gray-900 dark:text-white">
                Skills
              </Label>
              <Textarea
                id="skills"
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                placeholder="List your skills, separated by commas"
                rows={3}
                className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
