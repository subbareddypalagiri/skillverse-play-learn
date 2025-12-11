import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Github, Linkedin, Trophy, Code, Terminal, Star, 
  GitBranch, Users, Heart, Award, Check, ExternalLink,
  Music, Palette, Camera, Briefcase
} from "lucide-react";
import { useSocial } from "@/contexts/SocialContext";

const PlatformIntegrations = () => {
  const { userProfile, updateProfile, importFromPlatform } = useSocial();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [username, setUsername] = useState('');

  const platforms = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      description: 'Import your repos, stars, and contributions',
      fields: ['repos', 'stars', 'followers', 'contributions'],
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Connect your professional profile',
      fields: ['experience', 'education', 'skills'],
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: Code,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Show your problem-solving skills',
      fields: ['solved', 'ranking', 'badges'],
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      icon: Terminal,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Display your competitive programming rating',
      fields: ['rating', 'max rating', 'contests'],
    },
    {
      id: 'codechef',
      name: 'CodeChef',
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      description: 'Import your cooking profile',
      fields: ['stars', 'rating', 'global rank'],
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Showcase your certifications',
      fields: ['badges', 'certificates', 'points'],
    },
    {
      id: 'kaggle',
      name: 'Kaggle',
      icon: Trophy,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      description: 'Display your data science achievements',
      fields: ['competitions', 'datasets', 'notebooks'],
    },
    {
      id: 'behance',
      name: 'Behance',
      icon: Palette,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Import your design portfolio',
      fields: ['projects', 'appreciations', 'views'],
    },
    {
      id: 'dribbble',
      name: 'Dribbble',
      icon: Camera,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      description: 'Showcase your design shots',
      fields: ['shots', 'likes', 'followers'],
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      icon: Music,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Import your music tracks',
      fields: ['tracks', 'followers', 'plays'],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Camera,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Connect your channel',
      fields: ['subscribers', 'videos', 'views'],
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      description: 'Link your Instagram profile',
      fields: ['posts', 'followers', 'following'],
    },
  ];

  const handleImport = async () => {
    if (!username.trim()) return;
    
    await importFromPlatform(selectedPlatform, username);
    setShowImportDialog(false);
    setUsername('');
  };

  const isConnected = (platformId: string) => {
    return userProfile && (userProfile as any)[platformId];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Connect Your Profiles</h2>
            <p className="text-muted-foreground">
              Import achievements from coding platforms, showcase your creative work, and build your complete digital portfolio
            </p>
          </div>
        </div>
      </Card>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const connected = isConnected(platform.id);
          
          return (
            <Card 
              key={platform.id}
              className={`p-6 relative overflow-hidden transition-all hover:shadow-lg ${
                connected ? 'border-2 border-green-500' : ''
              }`}
            >
              {/* Connected Badge */}
              {connected && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
              )}

              {/* Platform Icon */}
              <div className={`w-12 h-12 rounded-lg ${platform.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${platform.color}`} />
              </div>

              {/* Platform Info */}
              <h3 className="font-bold text-lg mb-2">{platform.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {platform.description}
              </p>

              {/* Stats Display (if connected) */}
              {connected && (userProfile as any)[platform.id + 'Stats'] && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries((userProfile as any)[platform.id + 'Stats']).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-muted-foreground text-xs capitalize">{key}</p>
                        <p className="font-semibold">{value as any}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  setShowImportDialog(true);
                }}
                variant={connected ? "outline" : "default"}
                className="w-full gap-2"
              >
                {connected ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Update
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4" />
                    Connect
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Stats Overview (if any platforms connected) */}
      {userProfile?.github || userProfile?.leetcode ? (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Your Achievement Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userProfile.githubStats && (
              <>
                <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                  <Github className="w-6 h-6 mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                  <p className="text-2xl font-bold">{userProfile.githubStats.repos}</p>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                  <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">{userProfile.githubStats.stars}</p>
                  <p className="text-sm text-muted-foreground">Stars Earned</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{userProfile.githubStats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <GitBranch className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">{userProfile.githubStats.contributions}</p>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                </div>
              </>
            )}
            
            {userProfile.leetcodeStats && (
              <>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <Code className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold">{userProfile.leetcodeStats.solved}</p>
                  <p className="text-sm text-muted-foreground">Problems Solved</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">#{userProfile.leetcodeStats.ranking}</p>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>
              </>
            )}
          </div>
        </Card>
      ) : null}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Connect {platforms.find(p => p.id === selectedPlatform)?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {platforms.find(p => p.id === selectedPlatform)?.description}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Enter your {platforms.find(p => p.id === selectedPlatform)?.name} username
              </label>
              <Input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleImport()}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">What will be imported:</h4>
              <ul className="space-y-1">
                {platforms.find(p => p.id === selectedPlatform)?.fields.map((field) => (
                  <li key={field} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} className="bg-gradient-primary">
                <GitBranch className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
              <strong>Note:</strong> In production, this would use OAuth authentication and official APIs. 
              Currently showing simulated data for demonstration.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlatformIntegrations;
