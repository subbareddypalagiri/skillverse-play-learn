import PageLayout from "@/components/PageLayout";
import { Trophy, Award, Star, Target, Zap, Medal, Lock, Sparkles } from "lucide-react";

const Achievements = () => {
  const achievements = [
    { icon: Trophy, title: "First Course Completed", description: "Complete your first course on Risee", progress: 100, unlocked: true, color: "from-amber-500/30 to-amber-500/5", iconColor: "text-amber-400 bg-amber-500/20" },
    { icon: Star, title: "5-Day Streak", description: "Study for 5 consecutive days", progress: 100, unlocked: true, color: "from-yellow-500/25 to-yellow-500/5", iconColor: "text-yellow-400 bg-yellow-500/20" },
    { icon: Award, title: "Event Enthusiast", description: "Attend 3 Risee events", progress: 66, unlocked: false, color: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400 bg-cyan-500/20" },
    { icon: Target, title: "Goal Achiever", description: "Complete 5 courses", progress: 40, unlocked: false, color: "from-violet-500/20 to-violet-500/5", iconColor: "text-violet-400 bg-violet-500/20" },
    { icon: Zap, title: "Speed Learner", description: "Complete a course in under 4 weeks", progress: 100, unlocked: true, color: "from-blue-500/25 to-blue-500/5", iconColor: "text-blue-400 bg-blue-500/20" },
    { icon: Medal, title: "Hackathon Winner", description: "Win a Risee hackathon", progress: 0, unlocked: false, color: "from-pink-500/15 to-pink-500/5", iconColor: "text-pink-400 bg-pink-500/20" },
  ];

  const stats = [
    { label: "Achievements", value: "12/50", icon: Trophy, color: "text-amber-400" },
    { label: "Points Earned", value: "2,450", icon: Star, color: "text-yellow-400" },
    { label: "Current Level", value: "7", icon: Zap, color: "text-violet-400" },
    { label: "Global Rank", value: "#234", icon: Award, color: "text-cyan-400" },
  ];

  return (
    <PageLayout>
      <div className="mb-8 animate-reveal-up">
        <div className="badge-gradient inline-flex mb-4">
          <Trophy className="w-3 h-3" />
          Your Progress
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          Achievements
        </h1>
        <p className="text-muted-foreground">Track your milestones and celebrate your growth</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="group rounded-2xl border border-border/50 p-5 text-center overflow-hidden card-lift animate-reveal-up"
            style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.1}s` }}>
            <Icon className={`w-5 h-5 ${color} mx-auto mb-2.5`} />
            <div className="text-2xl font-extrabold text-foreground mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(({ icon: Icon, title, description, progress, unlocked, color, iconColor }, i) => (
          <div key={i}
            className={`group relative rounded-2xl border overflow-hidden card-lift transition-all duration-500 animate-reveal-up ${
              unlocked ? 'border-border/50 hover:border-primary/30' : 'border-border/30 opacity-65 hover:opacity-85'
            }`}
            style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${0.2 + i * 0.08}s` }}>

            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

            {/* Lock overlay for locked */}
            {!unlocked && (
              <div className="absolute top-4 right-4 z-20">
                <div className="w-7 h-7 rounded-lg bg-border/60 flex items-center justify-center backdrop-blur-sm">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Unlocked badge */}
            {unlocked && (
              <div className="absolute top-4 right-4 z-20">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            )}

            <div className="relative z-10 p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{unlocked ? 'Completed!' : 'Progress'}</span>
                  <span className={`font-semibold ${unlocked ? 'text-emerald-400' : 'text-foreground'}`}>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: unlocked
                        ? 'linear-gradient(90deg, #22c55e, #10b981)'
                        : 'linear-gradient(90deg, #7c3aed, #06b6d4)'
                    }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Achievements;
