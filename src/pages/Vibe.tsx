import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialFeed from "@/components/SocialFeed";
import PlatformIntegrations from "@/components/PlatformIntegrations";
import { Users, Share2, Award, TrendingUp, Sparkles } from "lucide-react";

const Vibe = () => {
  const stats = [
    { label: "Active Students", value: "2,547", icon: Users },
    { label: "Posts Shared", value: "8,934", icon: Share2 },
    { label: "Achievements", value: "1,245", icon: Award },
    { label: "Engagement", value: "98%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Clean Header Section */}
          <div className="mb-10" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out forwards' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-primary">Community</p>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
              Your Vibe
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Share your talents, showcase your skills, and connect with creative minds
            </p>
          </div>

          {/* Stats Row - Minimal Design */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 100ms forwards' }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/15 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Tabs - Clean Design */}
          <div style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 200ms forwards' }}>
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="feed" 
                  className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  Feed
                </TabsTrigger>
                <TabsTrigger 
                  value="platforms" 
                  className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <Award className="w-4 h-4" />
                  Showcase Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                <SocialFeed />
              </TabsContent>

              <TabsContent value="platforms" className="space-y-6">
                <PlatformIntegrations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
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

      <Footer />
    </div>
  );
};

export default Vibe;
