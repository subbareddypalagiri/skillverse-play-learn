import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, Sparkles, BookOpen, Trophy, Zap, ChevronRight, ShieldAlert } from "lucide-react";
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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { login } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post('/auth/login', formData);
      if (response.data.success) {
        const { tokens, user } = response.data.data;
        login(tokens.accessToken, user, tokens.refreshToken);
        navigate(redirectTo.startsWith('/') ? redirectTo : '/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <StatPill icon={BookOpen} label="Expert Courses" value="500+" delay="0.4s" />
            <StatPill icon={Trophy} label="Success Rate" value="95%" delay="0.5s" />
            <StatPill icon={Zap} label="Active Learners" value="10K+" delay="0.6s" />
          </div>

          {/* Testimonial */}
          <div className={`glass rounded-2xl p-5 max-w-md transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
              "Haappy completely transformed how I learn. Within 3 months I went from beginner to landing my first dev job."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">P</div>
              <div>
                <div className="text-xs font-semibold text-foreground">Priya Sharma</div>
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

        <div className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily:'Sora,sans-serif'}}>
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5 animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="premium-input text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="premium-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 group disabled:opacity-70 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Risee
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground/60 font-medium">OR</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Demo notice */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>New to Risee? Create a free account and start learning within minutes.</span>
          </div>

          {/* Sign up link */}
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group">
              Create one free
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
