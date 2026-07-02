import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, Sparkles, Check, X, ChevronRight, User, Mail, Lock } from "lucide-react";
import NeatGradientBackground from "@/components/NeatGradientBackground";

const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < PASSWORD_RULES.minLength) errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
  if (!PASSWORD_RULES.hasUppercase.test(password)) errors.push('One uppercase letter');
  if (!PASSWORD_RULES.hasLowercase.test(password)) errors.push('One lowercase letter');
  if (!PASSWORD_RULES.hasNumber.test(password)) errors.push('One number');
  return errors;
};

const StrengthBar = ({ password }: { password: string }) => {
  const errors = validatePassword(password);
  const strength = password ? Math.max(0, 4 - errors.length) : 0;
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return password ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <span className="text-[10px] font-medium" style={{ color: strength ? colors[strength] : 'transparent' }}>
        {labels[strength]}
      </span>
    </div>
  ) : null;
};

const RuleCheck = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-1.5 text-[11px] transition-colors duration-300 ${met ? 'text-emerald-400' : 'text-muted-foreground/60'}`}>
    {met
      ? <Check className="w-3 h-3 text-emerald-400" />
      : <X className="w-3 h-3 text-muted-foreground/40" />
    }
    {label}
  </div>
);

const FloatingOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full pointer-events-none ${className}`} />
);

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ learners: 0 });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
    apiClient.get('/courses/stats')
      .then(res => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (id === 'password') setPasswordErrors(value ? validatePassword(value) : []);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const pwErrors = validatePassword(formData.password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/register', formData);
      if (response.data.success) {
        const { tokens, user } = response.data.data;
        login(tokens.accessToken, user, tokens.refreshToken);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.name && formData.email && formData.password && passwordErrors.length === 0;

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

        <div className={`w-full max-w-md transition-all duration-700 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2" style={{fontFamily:'Sora,sans-serif'}}>
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm">
              Free forever · No credit card needed
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-start gap-3 animate-reveal-up">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <input id="name" type="text" placeholder="Your full name" value={formData.name} onChange={handleChange} required
                  className="premium-input pl-10" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <input id="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} required
                  className="premium-input pl-10" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••"
                  value={formData.password} onChange={handleChange} required className="premium-input pl-10 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <>
                  <StrengthBar password={formData.password} />
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <RuleCheck met={formData.password.length >= 8} label="8+ characters" />
                    <RuleCheck met={PASSWORD_RULES.hasUppercase.test(formData.password)} label="Uppercase letter" />
                    <RuleCheck met={PASSWORD_RULES.hasLowercase.test(formData.password)} label="Lowercase letter" />
                    <RuleCheck met={PASSWORD_RULES.hasNumber.test(formData.password)} label="Number" />
                  </div>
                </>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !isValid}
              className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 group disabled:opacity-50 mt-2"
              style={{ background: isValid ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : 'rgba(124,58,237,0.4)' }}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                ) : (
                  <>Create free account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </span>
              {isValid && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />}
            </button>
          </form>

          <p className="text-xs text-muted-foreground/60 text-center mt-4">
            By creating an account, you agree to our{' '}
            <span className="text-primary/70 hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-primary/70 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          </p>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group">
              Sign in
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;
