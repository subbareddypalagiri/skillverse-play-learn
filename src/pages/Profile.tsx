import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Calendar, Edit, BookOpen, Trophy, Users } from "lucide-react";

const Profile = () => {
  const userStats = [
    { label: "Courses Completed", value: 8, icon: BookOpen },
    { label: "Achievements", value: 12, icon: Trophy },
    { label: "Events Attended", value: 15, icon: Users }
  ];

  const skills = ["React", "TypeScript", "UI Design", "Python", "Data Analysis", "Public Speaking"];
  
  const recentActivity = [
    { type: "Course", title: "Completed Web Development Masterclass", date: "2 days ago" },
    { type: "Event", title: "Attended AI Tech Talk", date: "5 days ago" },
    { type: "Achievement", title: "Unlocked Speed Learner Badge", date: "1 week ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Profile Header */}
          <Card className="p-8 mb-6 shadow-card">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl font-bold">
                  JS
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">John Student</h1>
                  <Badge className="bg-gradient-accent text-accent-foreground w-fit mx-auto md:mx-0">
                    Level 7
                  </Badge>
                </div>
                
                <div className="space-y-2 text-muted-foreground mb-4">
                  <div className="flex items-center justify-center md:justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    john.student@raise.com
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    New York, USA
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined March 2024
                  </div>
                </div>
                
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 shadow-card text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills */}
            <Card className="p-6 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add More Skills
              </Button>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <Badge variant="outline" className="mb-2">{activity.type}</Badge>
                    <p className="font-semibold mb-1">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
