import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { SignUp } from "@clerk/clerk-react";
import { Sparkles, Check } from "lucide-react";
import NeatGradientBackground from "@/components/NeatGradientBackground";

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`} />
);

const Signup = () => {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ learners: 0 });

  useEffect(() => {
    setMounted(true);
    apiClient.get('/courses/stats')
      .then(res => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch(() => {});
  }, []);

  const perks = [
    "Access expert-curated courses",
    "Build real-world projects",
    "Connect with active peer learners",
    "Track progress with AI insights",
  ];

  return (
    <div className="neat-gradient-layout min-h-screen flex overflow-hidden bg-[#E4E4E4] relative">
      <NeatGradientBackground />
      <div className="relative z-10 flex flex-1 w-full">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14">
          <div className="absolute inset-0 bg-grid opacity-100" />
          <FloatingOrb className="w-[500px] h-[500px] bg-violet-600/12 top-[-15%] right-[-5%] blur-[100px] animate-drift" />
          <FloatingOrb className="w-[400px] h-[400px] bg-cyan-500/8 bottom-0 left-[-5%] blur-[90px] animate-aurora" />
          <FloatingOrb className="w-[200px] h-[200px] bg-indigo-400/10 top-[55%] left-[50%] blur-[60px] animate-float-slow" />

          {/* Logo */}
          <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 flex items-center justify-center bg-gradient-to-br from-violet-500 to-pink-500">
                <span className="font-extrabold text-lg text-white">H</span>
              </div>
              <span className="text-2xl font-bold text-gradient bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent" style={{fontFamily:'Sora,sans-serif'}}>Haappy</span>
            </Link>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-8">
            <div>
              <div className="badge-gradient mb-6 animate-reveal-up">
                <Sparkles className="w-3 h-3" />
                Free to Get Started
              </div>
              <h1 className="text-5xl xl:text-[3.4rem] font-bold text-foreground leading-[1.1] mb-5 animate-reveal-up delay-100" style={{fontFamily:'Sora,sans-serif'}}>
                Your future starts
                <br />
                <span className="text-gradient">right here</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm animate-reveal-up delay-200">
                Create your free account and unlock a world-class learning experience built for career growth.
              </p>
            </div>

            {/* Perks list */}
            <ul className="space-y-3">
              {perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-3 animate-reveal-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-foreground/80">{perk}</span>
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="glass rounded-2xl p-5 max-w-sm animate-reveal-up delay-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {['A','B','C','D'].map((l,i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ['#7c3aed','#06b6d4','#6366f1','#8b5cf6'][i] }}>
                      {l}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">+{20 + stats.learners} learners already inside</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                <span className="text-xs text-muted-foreground ml-2">4.9 / 5 rating</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-muted-foreground/50 animate-reveal-fade delay-900">
            No credit card required · Cancel anytime
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 relative overflow-hidden">
          <FloatingOrb className="w-[300px] h-[300px] bg-primary/8 top-0 right-0 blur-[70px]" />

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
            <SignUp 
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
              signInUrl="/login"
              redirectUrl="/dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
