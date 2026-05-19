import PageLayout from "@/components/PageLayout";
import { Palette, Music, Camera, BookOpen, Dumbbell, Code, Users, Sparkles, ArrowRight } from "lucide-react";

const Hobbies = () => {
  const hobbies = [
    { icon: Palette, title: "Art & Painting", members: 234, description: "Express yourself through colors and creativity", gradient: "from-pink-500/20 to-rose-500/5", iconBg: "bg-pink-500/15 text-pink-400" },
    { icon: Music, title: "Music Club", members: 456, description: "Learn instruments and perform with fellow musicians", gradient: "from-violet-500/20 to-violet-500/5", iconBg: "bg-violet-500/15 text-violet-400" },
    { icon: Camera, title: "Photography", members: 189, description: "Capture moments and tell stories through lenses", gradient: "from-amber-500/20 to-amber-500/5", iconBg: "bg-amber-500/15 text-amber-400" },
    { icon: BookOpen, title: "Book Club", members: 312, description: "Read, discuss, and explore new literary worlds", gradient: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-400" },
    { icon: Dumbbell, title: "Fitness & Sports", members: 567, description: "Stay active with group workouts and sports", gradient: "from-cyan-500/20 to-cyan-500/5", iconBg: "bg-cyan-500/15 text-cyan-400" },
    { icon: Code, title: "Coding Club", members: 789, description: "Build projects and compete in coding challenges", gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-400" },
  ];

  return (
    <PageLayout>
      <div className="mb-8 animate-reveal-up">
        <div className="badge-gradient inline-flex mb-4">
          <Sparkles className="w-3 h-3" />
          Find Your Tribe
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          Hobbies & Clubs
        </h1>
        <p className="text-muted-foreground">
          Explore your interests and connect with like-minded students
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hobbies.map(({ icon: Icon, title, members, description, gradient, iconBg }, i) => (
          <div key={i}
            className={`group relative rounded-2xl border border-border/50 overflow-hidden card-lift animate-reveal-up`}
            style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.08}s` }}>
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 p-7 text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
                <Users className="w-3.5 h-3.5" />
                <span>{members.toLocaleString()} members</span>
              </div>
              <button className="relative w-full py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group/btn transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  Join Club
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-600 skew-x-12" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Hobbies;
