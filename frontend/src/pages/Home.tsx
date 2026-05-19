import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Rocket, Star, TrendingUp, Award, Zap, CheckCircle2, Quote, Sparkles, Play, Code, Palette, BarChart3, Globe } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PremiumHero from "@/components/PremiumHero";

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const SectionWrapper = ({ children, className = "" }: any) => {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as any} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </section>
  );
};

const Home = () => {
  const features = [
    { icon: BookOpen, title: "Structured Learning", description: "Expert-curated paths designed for maximum retention and real-world application.", gradient: "from-violet-500/20 to-violet-500/5" },
    { icon: Users, title: "Group Activities", description: "Hackathons, collaborative sprints, and immersive group learning experiences.", gradient: "from-cyan-500/20 to-cyan-500/5" },
    { icon: Trophy, title: "Achievements", description: "Earn certificates, badges, and track your milestones as you grow.", gradient: "from-amber-500/20 to-amber-500/5" },
    { icon: Rocket, title: "Career Growth", description: "Access internships, mentors, and real opportunities from top companies.", gradient: "from-pink-500/20 to-pink-500/5" },
  ];

  const stats = [
    { value: "10K+", label: "Active Learners", icon: Users, color: "text-violet-400" },
    { value: "500+", label: "Expert Courses", icon: BookOpen, color: "text-cyan-400" },
    { value: "95%", label: "Success Rate", icon: TrendingUp, color: "text-emerald-400" },
    { value: "50+", label: "Industry Partners", icon: Award, color: "text-amber-400" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Software Engineer @ Google", avatar: "S", content: "Risee completely transformed my learning journey. The combination of structured courses and fun activities kept me motivated throughout.", rating: 5, gradient: "from-violet-500 to-cyan-500" },
    { name: "Michael Chen", role: "Data Scientist @ Meta", avatar: "M", content: "The hands-on projects and collaborative environment helped me land my dream job within 6 months. The AI-powered path was 🔥", rating: 5, gradient: "from-cyan-500 to-blue-500" },
    { name: "Emily Rodriguez", role: "Product Designer @ Stripe", avatar: "E", content: "Best learning platform I've used. The community support and real-world projects made all the difference. Highly recommend!", rating: 5, gradient: "from-pink-500 to-violet-500" },
  ];

  const benefits = [
    "Expert-led courses with industry insights",
    "Hands-on projects and real-world applications",
    "Vibrant community of learners and mentors",
    "Flexible learning paths tailored to your goals",
    "Career support and networking opportunities",
    "Regular events, hackathons, and workshops",
  ];

  const categories = [
    { icon: Code, name: "Development", courses: "120+", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { icon: Palette, name: "Design", courses: "85+", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { icon: BarChart3, name: "Data Science", courses: "95+", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { icon: Globe, name: "Marketing", courses: "65+", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { icon: Trophy, name: "Business", courses: "70+", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { icon: Zap, name: "AI & ML", courses: "55+", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ];

  return (
    <PageLayout noPadding fullWidth>
      {/* Hero */}
      <PremiumHero />

      {/* Stats */}
      <SectionWrapper>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ value, label, icon: Icon, color }, i) => (
              <div key={i} className="group relative rounded-2xl border border-border/40 p-6 text-center overflow-hidden card-lift cursor-default"
                style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i*0.1}s` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />
                <Icon className={`w-5 h-5 ${color} mx-auto mb-3 relative z-10`} />
                <div className="text-3xl font-extrabold text-foreground mb-1 relative z-10" style={{fontFamily:'Sora,sans-serif'}}>{value}</div>
                <div className="text-xs text-muted-foreground relative z-10">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Categories */}
      <SectionWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="badge-gradient inline-flex mb-4">
              <Sparkles className="w-3 h-3" />
              Explore by Category
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{fontFamily:'Sora,sans-serif'}}>
              Find your path
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(({ icon: Icon, name, courses, color }, i) => (
              <Link key={i} to="/courses"
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border ${color} hover:scale-105 transition-all duration-300 text-center card-lift`}>
                <Icon className={`w-6 h-6 ${color.split(' ')[0]}`} />
                <div>
                  <div className="text-sm font-semibold text-foreground">{name}</div>
                  <div className="text-xs text-muted-foreground">{courses} courses</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper>
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <div className="badge-gradient inline-flex mb-5">
                <Zap className="w-3 h-3" />
                Why Risee
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight" style={{fontFamily:'Sora,sans-serif'}}>
                Everything you need to <span className="text-gradient">succeed</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A platform designed with precision to accelerate your learning journey and unlock career opportunities.
              </p>
              <div className="space-y-2.5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{b}</span>
                  </div>
                ))}
              </div>
              <Link to="/courses" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] group"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                Explore Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, title, description, gradient }, i) => (
                <div key={i}
                  className={`group relative rounded-2xl p-6 border border-border/40 overflow-hidden card-lift cursor-default`}
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2" style={{fontFamily:'Sora,sans-serif'}}>{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper>
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-15 animate-aurora"
              style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.5) 0%, transparent 60%)', filter: 'blur(80px)' }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <div className="badge-gradient inline-flex mb-4">
                <Star className="w-3 h-3 fill-current" />
                Student Stories
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3" style={{fontFamily:'Sora,sans-serif'}}>
                Loved by <span className="text-gradient">Learners</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join thousands of students who transformed their careers with Risee
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
              {testimonials.map(({ name, role, avatar, content, rating, gradient }, i) => (
                <div key={i} className="group relative rounded-2xl border border-border/40 p-6 overflow-hidden card-lift animate-float-slow"
                  style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 1.5}s` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />

                  <div className="relative z-10">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(rating)].map((_,j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <Quote className="w-6 h-6 text-primary/30 mb-3" />
                    <p className="text-sm text-foreground/85 leading-relaxed mb-5 italic">
                      {content}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{name}</p>
                        <p className="text-xs text-muted-foreground">{role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-border/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex -space-x-2">
                  {['S','M','E','R'].map((l,i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ['#7c3aed','#06b6d4','#6366f1','#8b5cf6'][i] }}>{l}</div>
                  ))}
                </div>
                <span className="text-sm ml-1">10,000+ happy students</span>
              </div>
              <div className="h-4 w-px bg-border/50 hidden md:block" />
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-muted-foreground ml-1">4.9/5 average</span>
              </div>
              <div className="h-4 w-px bg-border/50 hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Top rated platform 2024</span>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper>
        <div className="container mx-auto px-4 py-16 pb-24">
          <div className="relative rounded-3xl border border-primary/20 overflow-hidden p-10 md:p-16"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(99,102,241,0.08) 50%, rgba(6,182,212,0.06) 100%)' }}>
            {/* Glow orbs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 60%)', filter: 'blur(50px)' }} />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 animate-pulse-glow"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 60%)', filter: 'blur(40px)', animationDelay:'1s' }} />

            {/* Top accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.8), transparent)' }} />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="lg:max-w-lg">
                <div className="badge-gradient inline-flex mb-5">
                  <Sparkles className="w-3 h-3" />
                  Ready to transform?
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight" style={{fontFamily:'Sora,sans-serif'}}>
                  Start your journey<br />
                  <span className="text-gradient">today — it's free</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Join 10,000+ learners building the future with Risee. No credit card required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link to="/signup"
                  className="relative group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_50px_rgba(124,58,237,0.55)]"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  <Sparkles className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </Link>
                <Link to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group">
                  <Play className="w-3.5 h-3.5" />
                  Explore courses
                </Link>
              </div>
            </div>

            {/* Bottom trust */}
            <div className="relative z-10 flex flex-wrap items-center gap-5 mt-8 pt-6 border-t border-border/30 text-xs text-muted-foreground">
              {['✓ Free forever plan', '✓ No credit card', '✓ Cancel anytime', '✓ 500+ expert courses'].map((t,i) => (
                <span key={i} className="flex items-center gap-1.5"><span className="text-primary font-medium">{t.split(' ')[0]}</span>{t.split(' ').slice(1).join(' ')}</span>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageLayout>
  );
};

export default Home;
