import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play, BookOpen, Trophy, Users, Zap, Star } from "lucide-react";

const FloatingCard = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={`absolute glass rounded-2xl px-4 py-3 border border-white/10 shadow-2xl pointer-events-none ${className}`}>
    {children}
  </div>
);

const TypewriterText = ({ phrases }: { phrases: string[] }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) { const t = setTimeout(() => setPause(false), 1200); return () => clearTimeout(t); }
    const current = phrases[idx];
    const timeout = deleting ? 40 : 80;
    const t = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) { setPause(true); setDeleting(true); }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setIdx((i) => (i + 1) % phrases.length); }
      }
    }, timeout);
    return () => clearTimeout(t);
  }, [text, deleting, pause, idx, phrases]);

  return (
    <span className="text-gradient">
      {text}<span className="cursor-blink text-violet-400">|</span>
    </span>
  );
};

export default function PremiumHero() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  const stats = [
    { icon: Users, value: "10K+", label: "Learners" },
    { icon: BookOpen, value: "500+", label: "Courses" },
    { icon: Trophy, value: "95%", label: "Success" },
    { icon: Zap, value: "50+", label: "Partners" },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Multi-layer background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Dynamic orbs that track mouse */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-25 transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
            left: `${mouse.x * 60 - 20}%`,
            top: `${mouse.y * 60 - 10}%`,
            transform: 'translate(-50%,-50%)',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 transition-all duration-1500 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 60%)',
            filter: 'blur(80px)',
            right: `${mouse.x * 40}%`,
            bottom: `${mouse.y * 40}%`,
          }}
        />
        {/* Static deep glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full opacity-30 animate-aurora"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 60%)', filter: 'blur(100px)' }} />
      </div>

      {/* Animated ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] rounded-full border border-primary/5 animate-spin-slow" />
        <div className="absolute w-[900px] h-[900px] rounded-full border border-primary/3 animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
      </div>

      {/* Floating decoration cards */}
      <FloatingCard className="top-[22%] left-[6%] animate-float-slow hidden xl:flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-bold text-foreground">Achievement Unlocked!</div>
          <div className="text-[10px] text-muted-foreground">React Mastery Certificate</div>
        </div>
      </FloatingCard>

      <FloatingCard className="top-[30%] right-[6%] animate-float-fast hidden xl:flex items-center gap-2.5" style={{animationDelay:'1.2s'}}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">P</div>
        <div>
          <div className="text-xs font-bold text-foreground">Priya just enrolled</div>
          <div className="text-[10px] text-muted-foreground">Advanced Python Course</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
      </FloatingCard>

      <FloatingCard className="bottom-[25%] left-[8%] animate-float-slow hidden xl:block" style={{animationDelay:'2s'}}>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-foreground">4.9 / 5 Rating</span>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-[28%] right-[8%] animate-float-fast hidden xl:block" style={{animationDelay:'0.8s'}}>
        <div className="text-[10px] text-muted-foreground mb-1">Learning Streak 🔥</div>
        <div className="flex items-end gap-1 h-8">
          {[3,5,4,7,6,8,9].map((h,i) => (
            <div key={i} className="w-3 rounded-t-sm transition-all"
              style={{ height: `${h*10}%`, background: i === 6 ? 'linear-gradient(#7c3aed,#06b6d4)' : 'rgba(124,58,237,0.3)' }} />
          ))}
        </div>
        <div className="text-xs font-bold text-foreground mt-1">7-day streak!</div>
      </FloatingCard>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-glow mb-8 animate-reveal-up">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-medium text-foreground/90">The Future of Learning is Here</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.0] mb-6 animate-reveal-up delay-200" style={{fontFamily:'Sora,sans-serif'}}>
          <span className="text-foreground block">Master Any</span>
          <span className="block mt-1">
            <TypewriterText phrases={["New Skill Fast", "Career You Want", "Tech Stack Now", "Future Together"]} />
          </span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-reveal-up delay-300">
          Risee gives you structured courses, real-world projects, community support, and AI-powered insights — everything you need to land your dream job.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-reveal-up delay-400">
          <Link to="/signup"
            className="relative group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all duration-500"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 60%, #06b6d4 100%)' }}>
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Start Learning Free</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          </Link>
          <Link to="/courses"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-foreground glass hover:border-primary/30 transition-all duration-300 hover:bg-white/5">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Play className="w-3 h-3 text-primary ml-0.5" />
            </div>
            Watch Demo
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto animate-reveal-up delay-500">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="group glass rounded-2xl px-4 py-4 border-glow text-center transition-all duration-300 hover:bg-white/5">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-xl font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>{value}</span>
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground/60 animate-reveal-fade delay-700">
          {['✓ Free to start', '✓ No credit card', '✓ Cancel anytime', '✓ Trusted by 10K+ learners'].map((item,i) => (
            <span key={i} className="flex items-center gap-1 hover:text-muted-foreground transition-colors">{item}</span>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, hsl(230,25%,5%))' }} />
    </section>
  );
}
