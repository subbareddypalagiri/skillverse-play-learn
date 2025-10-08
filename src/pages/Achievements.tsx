import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Target, Zap, Medal } from "lucide-react";

const Achievements = () => {
  const achievements = [
    {
      icon: Trophy,
      title: "First Course Completed",
      description: "Complete your first course on SkillVerse",
      progress: 100,
      unlocked: true
    },
    {
      icon: Star,
      title: "5-Day Streak",
      description: "Study for 5 consecutive days",
      progress: 100,
      unlocked: true
    },
    {
      icon: Award,
      title: "Event Enthusiast",
      description: "Attend 3 SkillVerse events",
      progress: 66,
      unlocked: false
    },
    {
      icon: Target,
      title: "Goal Achiever",
      description: "Complete 5 courses",
      progress: 40,
      unlocked: false
    },
    {
      icon: Zap,
      title: "Speed Learner",
      description: "Complete a course in under 4 weeks",
      progress: 100,
      unlocked: true
    },
    {
      icon: Medal,
      title: "Hackathon Winner",
      description: "Win a SkillVerse hackathon",
      progress: 0,
      unlocked: false
    }
  ];

  const stats = [
    { label: "Total Achievements", value: "12/50" },
    { label: "Points Earned", value: "2,450" },
    { label: "Current Level", value: "7" },
    { label: "Rank", value: "#234" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Achievements</h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and celebrate your milestones
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center shadow-card">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={index} 
                  className={`p-6 shadow-card transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-card border-primary hover:shadow-elevated' 
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-primary' 
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        achievement.unlocked 
                          ? 'text-primary-foreground' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                  
                  {achievement.unlocked && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-success">✓ Unlocked!</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
