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
    <div className="space-y-5">
      {/* Header - Clean Design */}
      <div className="relative bg-card rounded-2xl border border-border/50 p-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Connect Your Profiles</h2>
            <p className="text-sm text-muted-foreground">
              Import achievements and build your digital portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform, index) => {
          const Icon = platform.icon;
          const connected = isConnected(platform.id);
          
          return (
            <div 
              key={platform.id}
              className={`group relative bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md ${
                connected ? 'border-primary/50' : 'border-border/50 hover:border-primary/30'
              }`}
              style={{ opacity: 0, animation: `fadeInUp 0.4s ease-out ${index * 40}ms forwards` }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-5">
                {/* Connected Badge */}
                {connected && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  </div>
                )}

                {/* Platform Icon */}
                <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Platform Info */}
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{platform.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {platform.description}
                </p>

                {/* Stats Display (if connected) */}
                {connected && (userProfile as any)[platform.id + 'Stats'] && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
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
                size="sm"
                className={`w-full ${connected ? 'border-border/50 hover:border-primary hover:bg-primary/5' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              >
                {connected ? (
                  <>
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Update
                  </>
                ) : (
                  <>
                    <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                    Connect
                  </>
                )}
              </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Overview (if any platforms connected) */}
      {userProfile?.github || userProfile?.leetcode ? (
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Achievement Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userProfile.githubStats && (
              <>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <Github className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">{userProfile.githubStats.repos}</p>
                  <p className="text-xs text-muted-foreground">Repositories</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <Star className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">{userProfile.githubStats.stars}</p>
                  <p className="text-xs text-muted-foreground">Stars Earned</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">{userProfile.githubStats.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <GitBranch className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">{userProfile.githubStats.contributions}</p>
                  <p className="text-xs text-muted-foreground">Contributions</p>
                </div>
              </>
            )}
            
            {userProfile.leetcodeStats && (
              <>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <Code className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">{userProfile.leetcodeStats.solved}</p>
                  <p className="text-xs text-muted-foreground">Problems Solved</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/50">
                  <Trophy className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-xl font-semibold">#{userProfile.leetcodeStats.ranking}</p>
                  <p className="text-xs text-muted-foreground">Global Rank</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
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
                className="border-border/50"
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
              <h4 className="font-medium text-sm mb-2">What will be imported:</h4>
              <ul className="space-y-1">
                {platforms.find(p => p.id === selectedPlatform)?.fields.map((field) => (
                  <li key={field} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="w-3 h-3 text-primary" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowImportDialog(false)} className="border-border/50">
                Cancel
              </Button>
              <Button onClick={handleImport} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <GitBranch className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              <strong>Note:</strong> In production, this would use OAuth authentication and official APIs.
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PlatformIntegrations;