import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Trophy, TrendingUp, Clock, Target, Play, CheckCircle, Users, Star } from "lucide-react";
import { useCourseContext } from "../contexts/CourseContext";

const Dashboard = () => {
  const { enrolledCourses, updateProgress } = useCourseContext();
  
  const stats = [
    { label: "Courses in Progress", value: enrolledCourses.length.toString(), icon: BookOpen, color: "text-primary" },
    { label: "Upcoming Events", value: "5", icon: Calendar, color: "text-accent" },
    { label: "Achievements", value: "12", icon: Trophy, color: "text-success" },
    { label: "Study Streak", value: "7 days", icon: TrendingUp, color: "text-secondary" },
  ];

  const upcomingEvents = [
    { name: "Coding Hackathon", date: "Dec 15", type: "Competition" },
    { name: "Mountain Trek", date: "Dec 20", type: "Adventure" },
    { name: "Tech Talk: AI Trends", date: "Dec 22", type: "Learning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, Student! 👋</h1>
            <p className="text-muted-foreground text-lg">
              Ready to continue your learning adventure?
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-primary`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Courses in Progress */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Courses</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Users className="w-3 h-3 mr-1" />
                              by {course.instructor}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              Next: {course.nextLesson}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {course.completedLessons}/{course.totalLessons} lessons completed
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                            <div className="text-xs text-muted-foreground">
                              {course.level}
                            </div>
                          </div>
                        </div>
                        <Progress value={course.progress} className="h-2 mb-2" />
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play className="w-3 h-3 mr-1" />
                            Continue
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateProgress(course.title, course.progress + 10, course.completedLessons + 1)}
                          >
                            +1 Lesson
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No courses enrolled yet</p>
                      <p className="text-sm">Start by enrolling in a course from the Courses page</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Upcoming Events */}
            <div>
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Upcoming Events</h2>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{event.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-accent text-accent-foreground">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        {event.date}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90">
                  View All Events
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
