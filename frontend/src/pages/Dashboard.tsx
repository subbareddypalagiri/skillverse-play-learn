import PageLayout from "@/components/PageLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Trophy, TrendingUp, Clock, Target, Play, CheckCircle, Users, Star } from "lucide-react";
import { useCourseContext } from "../contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { enrolledCourses, updateProgress } = useCourseContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    <ErrorBoundary>
    <PageLayout>
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to continue your learning adventure?
            </p>
            {user && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-4 md:p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="p-2 md:p-3 rounded-xl bg-gradient-primary">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
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
                  <h2 className="text-xl md:text-2xl font-bold">Your Courses</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>View All</Button>
                </div>
                
                <div className="space-y-4">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                    <EmptyState
                      icon={BookOpen}
                      title="No courses enrolled yet"
                      description="Start by enrolling in a course from the Courses page"
                      actionLabel="Browse Courses"
                      onAction={() => navigate('/courses')}
                    />
                  )}
                </div>
              </Card>
            </div>

            {/* Upcoming Events */}
            <div>
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Upcoming Events</h2>
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
                
                <Button 
                  className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90"
                  onClick={() => navigate('/events')}
                >
                  View All Events
                </Button>
              </Card>
            </div>
          </div>
    </PageLayout>
    </ErrorBoundary>
  );
};

export default Dashboard;
