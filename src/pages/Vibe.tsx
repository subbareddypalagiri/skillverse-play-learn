import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SocialFeed from "@/components/SocialFeed";
import PlatformIntegrations from "@/components/PlatformIntegrations";
import { Users, Share2, Award, TrendingUp } from "lucide-react";

const Vibe = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Your Vibe 🔥
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your talents, flex your skills, and connect with the most creative minds! ⚡
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,547</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">8,934</p>
                <p className="text-sm text-muted-foreground">Posts Shared</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-muted-foreground">Engagement</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="feed" className="gap-2">
              <Share2 className="w-4 h-4" />
              Feed 🔥
            </TabsTrigger>
            <TabsTrigger value="platforms" className="gap-2">
              <Award className="w-4 h-4" />
              Flex Your Skills ⚡
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

      <Footer />
    </div>
  );
};

export default Vibe;
