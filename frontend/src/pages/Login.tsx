import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@clerk/clerk-react";
import { Sparkles, BookOpen, Trophy, Zap } from "lucide-react";
import NeatGradientBackground from "@/components/NeatGradientBackground";

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`} />
);

const StatPill = ({ icon: Icon, label, value, delay }: any) => (
  <div
    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass border-glow animate-reveal-up"
    style={{ animationDelay: delay }}
  >
    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div>
      <div className="text-xs font-bold text-foreground leading-none">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  </div>
);

const Login = () => {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ learners: 0, courses: 0, successRate: 100 });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    setMounted(true);
    // Fetch live stats from the backend stats api
    apiClient.get('/courses/stats')
      .then(res => {
        if (res.data?.data) {
          setStats(res.data.data);
        }
      })
      .catch(err => console.log('Error loading stats:', err));
  }, []);

  return (
    <div className="neat-gradient-layout min-h-screen flex overflow-hidden bg-[#E4E4E4] relative">
      <NeatGradientBackground />
      <div className="relative z-10 flex flex-1 w-full">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-[54%] relative overflow-hidden flex-col justify-between p-14">
          {/* Animated background */}
          <div className="absolute inset-0 bg-grid opacity-100" />
          <FloatingOrb className="w-[600px] h-[600px] bg-purple-600/15 top-[-10%] left-[-10%] blur-[120px] animate-drift" />
          <FloatingOrb className="w-[400px] h-[400px] bg-cyan-500/10 bottom-[5%] right-[-5%] blur-[100px] animate-aurora" />
          <FloatingOrb className="w-[300px] h-[300px] bg-indigo-500/10 top-[50%] left-[40%] blur-[80px] animate-float-slow" />

          {/* Logo */}
          <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
                <img src="/Risee.png" alt="Haappy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shine" />
              </div>
              <span className="text-2xl font-bold text-gradient bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent" style={{fontFamily:'Sora,sans-serif'}}>Haappy</span>
            </Link>
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex flex-col gap-8">
            <div>
              <div className="badge-gradient mb-6 animate-reveal-up">
                <Sparkles className="w-3 h-3" />
                AI-Powered Learning Platform
              </div>
              <h1
                className={`text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-5 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{fontFamily:'Sora,sans-serif'}}
              >
                Level up your
                <br />
                <span className="text-gradient">career journey</span>
              </h1>
              <p className={`text-muted-foreground text-lg leading-relaxed max-w-md transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Join thousands of learners mastering in-demand skills with structured courses, real projects, and a community that actually helps.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              <StatPill icon={BookOpen} label="Expert Courses" value={stats.courses > 0 ? `${stats.courses}` : "18"} delay="0.4s" />
              <StatPill icon={Trophy} label="Success Rate" value={`${stats.successRate}%`} delay="0.5s" />
              <StatPill icon={Zap} label="Active Learners" value={`${20 + stats.learners}+`} delay="0.6s" />
            </div>

            {/* Testimonial */}
            <div className={`glass rounded-2xl p-5 max-w-md transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
                "Haappy completely transformed how I learn. Within 3 months I went from beginner to landing my first dev job."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Ankit Pal</div>
                  <div className="text-[11px] text-muted-foreground">Full-Stack Developer</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="relative z-10 text-xs text-muted-foreground/50 animate-reveal-fade delay-700">
            © {new Date().getFullYear()} Haappy. Built for ambitious learners.
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 relative">
          <FloatingOrb className="w-[350px] h-[350px] bg-primary/8 top-0 right-0 blur-[80px] pointer-events-none" />
          <FloatingOrb className="w-[250px] h-[250px] bg-cyan-500/6 bottom-0 left-0 blur-[60px] pointer-events-none" />

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10">
                <img src="/Risee.png" alt="Haappy" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-gradient bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent" style={{fontFamily:'Sora,sans-serif'}}>Haappy</span>
            </Link>
          </div>

          <div className={`w-full max-w-md flex justify-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <SignIn 
              appearance={{
                variables: {
                  colorPrimary: "#7c3aed",
                  colorBackground: "#09090b",
                  colorText: "#f4f4f5",
                  colorTextSecondary: "#a1a1aa",
                  colorInputBackground: "#18181b",
                  colorInputText: "#f4f4f5",
                  colorBorder: "rgba(255,255,255,0.08)",
                },
                elements: {
                  card: "bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-2xl w-full",
                  headerTitle: "text-2xl font-bold text-white",
                  headerSubtitle: "text-zinc-400",
                  socialButtonsBlockButton: "border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white transition-all rounded-xl py-2.5",
                  formFieldLabel: "text-xs font-semibold text-zinc-300 uppercase tracking-wider",
                  formFieldInput: "bg-zinc-900 border border-white/10 text-white rounded-xl py-2.5 px-3.5 focus:border-violet-500 transition-colors w-full",
                  formButtonPrimary: "w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 transition-all",
                  footerActionLink: "text-violet-400 hover:text-violet-300 transition-colors font-semibold"
                }
              }}
              signUpUrl="/signup"
              redirectUrl={redirectTo.startsWith('/') ? redirectTo : '/dashboard'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
