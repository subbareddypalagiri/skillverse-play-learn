import PageLayout from "@/components/PageLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Trophy, TrendingUp, Clock, Play, CheckCircle, Users, Star, Zap, ArrowRight, Target, Flame } from "lucide-react";
import { useCourseContext } from "../contexts/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, icon: Icon, color, delay }: any) => (
  <div
    className="relative group rounded-2xl p-5 border border-border/50 overflow-hidden card-lift cursor-default animate-reveal-up"
    style={{ animationDelay: delay, background: 'rgba(255,255,255,0.02)' }}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-60 animate-pulse" />
      </div>
      <div className="text-2xl font-bold text-foreground mb-1" style={{fontFamily:'Sora,sans-serif'}}>{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { enrolledCourses, updateProgress } = useCourseContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Courses in Progress", value: enrolledCourses.length.toString(), icon: BookOpen, color: "bg-violet-500/20 text-violet-400", delay: "0.1s" },
    { label: "Upcoming Events", value: "5", icon: Calendar, color: "bg-cyan-500/20 text-cyan-400", delay: "0.2s" },
    { label: "Achievements", value: "12", icon: Trophy, color: "bg-amber-500/20 text-amber-400", delay: "0.3s" },
    { label: "Study Streak", value: "7 days", icon: Flame, color: "bg-orange-500/20 text-orange-400", delay: "0.4s" },
  ];

  const upcomingEvents = [
    { name: "Coding Hackathon", date: "Dec 15", type: "Competition", color: "text-violet-400 bg-violet-500/10" },
    { name: "Mountain Trek", date: "Dec 20", type: "Adventure", color: "text-cyan-400 bg-cyan-500/10" },
    { name: "Tech Talk: AI Trends", date: "Dec 22", type: "Learning", color: "text-emerald-400 bg-emerald-500/10" },
  ];

  return (
    <ErrorBoundary>
      <PageLayout>
        {/* Welcome header */}
        <div className="mb-8 animate-reveal-up">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="badge-gradient mb-3">
                <Zap className="w-3 h-3" />
                Learning Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{fontFamily:'Sora,sans-serif'}}>
                Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Learner'}</span> 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to continue your journey? You're on a roll!
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3 border border-border/50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses */}
          <div className="lg:col-span-2 animate-reveal-up delay-200">
            <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between p-6 border-b border-border/40">
                <div>
                  <h2 className="text-lg font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>Your Courses</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{enrolledCourses.length} enrolled · keep the momentum</p>
                </div>
                <button onClick={() => navigate('/courses')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-primary border border-primary/20 hover:bg-primary/10 transition-all duration-200 group">
                  View All
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course, idx) => (
                    <div key={idx}
                      className="group p-4 rounded-xl border border-border/30 hover:border-primary/25 hover:bg-white/2 transition-all duration-300 cursor-pointer"
                      style={{ background: 'rgba(124,58,237,0.02)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="font-semibold text-sm text-foreground truncate">{course.title}</h3>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/15">
                              {course.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />by {course.instructor}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.nextLesson}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-lg font-bold text-gradient" style={{fontFamily:'Sora,sans-serif'}}>{course.progress}%</div>
                          <div className="text-[10px] text-muted-foreground">{course.level}</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="relative h-1.5 rounded-full bg-border/60 overflow-hidden mb-3">
                        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{ width: `${course.progress}%`, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }}>
                          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {course.completedLessons}/{course.totalLessons} lessons
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                            <Play className="w-3 h-3" />
                            Continue
                          </button>
                          <button
                            onClick={() => updateProgress(course.title, course.progress + 10, course.completedLessons + 1)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border/50 hover:border-primary/30 hover:text-primary transition-all duration-200">
                            +1 Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8">
                    <EmptyState
                      icon={BookOpen}
                      title="No courses enrolled yet"
                      description="Start by enrolling in a course from the Courses page"
                      actionLabel="Browse Courses"
                      onAction={() => navigate('/courses')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5 animate-reveal-up delay-300">
            {/* Upcoming Events */}
            <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center justify-between p-5 border-b border-border/40">
                <h2 className="font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>Upcoming Events</h2>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="p-4 space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-all duration-200 cursor-pointer group">
                    <div className="flex-shrink-0 text-center min-w-[36px]">
                      <div className="text-[10px] text-muted-foreground">{event.date.split(' ')[0]}</div>
                      <div className="text-lg font-bold text-foreground leading-none" style={{fontFamily:'Sora,sans-serif'}}>{event.date.split(' ')[1]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{event.name}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${event.color}`}>{event.type}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-0">
                <button onClick={() => navigate('/events')}
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-primary border border-primary/20 hover:bg-primary/10 transition-all duration-200 flex items-center justify-center gap-1.5 group">
                  View all events
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-border/50 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="p-5 border-b border-border/40">
                <h2 className="font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>Quick Actions</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {[
                  { label: "Browse Courses", icon: BookOpen, path: '/courses', color: 'text-violet-400' },
                  { label: "My Profile", icon: Users, path: '/profile', color: 'text-cyan-400' },
                  { label: "Achievements", icon: Trophy, path: '/achievements', color: 'text-amber-400' },
                  { label: "AI Tools", icon: Zap, path: '/ai-tools', color: 'text-pink-400' },
                ].map((action, i) => (
                  <button key={i} onClick={() => navigate(action.path)}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/30 hover:border-primary/25 hover:bg-white/3 transition-all duration-200 text-center">
                    <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform duration-200`} />
                    <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress summary */}
            <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>Weekly Goal</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Hours studied</span>
                    <span className="font-medium text-foreground">4.5 / 8 hrs</span>
                  </div>
                  <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                    <div className="h-full rounded-full w-[56%]" style={{ background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Lessons completed</span>
                    <span className="font-medium text-foreground">7 / 12</span>
                  </div>
                  <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                    <div className="h-full rounded-full w-[58%]" style={{ background: 'linear-gradient(90deg,#06b6d4,#7c3aed)' }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-primary/8 border border-primary/15">
                <div className="flex items-center gap-2 text-xs">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-foreground font-medium">You're ahead of 73% of learners this week!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
};

export default Dashboard;
