import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Trophy, Rocket, Star, TrendingUp, Award, Zap, CheckCircle2, Quote } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Curated courses designed for maximum engagement and retention"
    },
    {
      icon: Users,
      title: "Group Activities",
      description: "Exciting trips, hackathons, and collaborative learning experiences"
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Track your progress and celebrate your milestones"
    },
    {
      icon: Rocket,
      title: "Career Growth",
      description: "Access internships and real-world opportunities"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Learners", icon: Users },
    { value: "500+", label: "Expert Courses", icon: BookOpen },
    { value: "95%", label: "Success Rate", icon: TrendingUp },
    { value: "50+", label: "Industry Partners", icon: Award }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "Risee transformed my learning journey. The combination of structured courses and fun activities kept me motivated throughout.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content: "The hands-on projects and collaborative environment helped me land my dream job. Highly recommend!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Product Designer",
      content: "Best learning platform I've used. The community support and real-world projects made all the difference.",
      rating: 5
    }
  ];

  const benefits = [
    "Expert-led courses with industry insights",
    "Hands-on projects and real-world applications",
    "Vibrant community of learners and mentors",
    "Flexible learning paths tailored to your goals",
    "Career support and networking opportunities",
    "Regular events, hackathons, and workshops"
  ];

  return (
    <PageLayout noPadding fullWidth>
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/3 blur-3xl" />
        </div>

        {/* Falling Stars Animation */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-falling-star"
              style={{
                top: '-5%',
                right: `${5 + i * 8}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            >
              <div className="absolute inset-0 bg-white rounded-full blur-[1px]" />
            </div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`small-${i}`}
              className="absolute w-0.5 h-0.5 bg-white/80 rounded-full animate-falling-star-slow"
              style={{
                top: '-3%',
                right: `${10 + i * 10}%`,
                animationDelay: `${i * 1.2 + 0.5}s`,
                animationDuration: `${6 + (i % 2)}s`,
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes fallingstar {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.7;
            }
            90% {
              opacity: 0.5;
            }
            100% {
              transform: translate(-150px, 100vh) rotate(15deg);
              opacity: 0;
            }
          }
          @keyframes fallingstarslow {
            0% {
              transform: translate(0, 0);
              opacity: 0;
            }
            15% {
              opacity: 0.5;
            }
            85% {
              opacity: 0.3;
            }
            100% {
              transform: translate(-100px, 100vh);
              opacity: 0;
            }
          }
          .animate-falling-star {
            animation: fallingstar linear infinite;
          }
          .animate-falling-star-slow {
            animation: fallingstarslow linear infinite;
          }
          @keyframes orbitSlow1 {
            0% { transform: rotate(0deg) translateX(220px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
          }
          @keyframes orbitSlow2 {
            0% { transform: rotate(72deg) translateX(220px) rotate(-72deg); }
            100% { transform: rotate(432deg) translateX(220px) rotate(-432deg); }
          }
          @keyframes orbitSlow3 {
            0% { transform: rotate(144deg) translateX(220px) rotate(-144deg); }
            100% { transform: rotate(504deg) translateX(220px) rotate(-504deg); }
          }
          @keyframes orbitSlow4 {
            0% { transform: rotate(216deg) translateX(220px) rotate(-216deg); }
            100% { transform: rotate(576deg) translateX(220px) rotate(-576deg); }
          }
          @keyframes orbitSlow5 {
            0% { transform: rotate(288deg) translateX(220px) rotate(-288deg); }
            100% { transform: rotate(648deg) translateX(220px) rotate(-648deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentlePulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes cardHover {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-8px) scale(1.02); }
          }
          @keyframes bounceIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideInRight {
            0% { transform: translateX(-20px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInLeft {
            0% { transform: translateX(20px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes glowBorder {
            0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.2); }
            50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.4); }
          }
          .animate-orbit-1 { animation: orbitSlow1 40s linear infinite; }
          .animate-orbit-2 { animation: orbitSlow2 40s linear infinite; }
          .animate-orbit-3 { animation: orbitSlow3 40s linear infinite; }
          .animate-orbit-4 { animation: orbitSlow4 40s linear infinite; }
          .animate-orbit-5 { animation: orbitSlow5 40s linear infinite; }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-gentle-pulse { animation: gentlePulse 4s ease-in-out infinite; }
          .gesture-card-hover { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .gesture-card-hover:hover { animation: cardHover 0.6s ease-out forwards; }
          .gesture-icon-bounce { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .gesture-card-hover:hover .gesture-icon-bounce { transform: translateY(-4px) scale(1.1); }
          .gesture-glow { animation: glowBorder 2s ease-in-out infinite; }
          .gesture-text-slide { transition: transform 0.3s ease-out, color 0.3s ease-out; }
          .gesture-card-hover:hover .gesture-text-slide { transform: translateX(4px); }
        `}</style>

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Side - Content */}
            <div className="text-left space-y-8 lg:pl-8 xl:pl-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">10,000+ Active Learners</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
                  Rise like a
                </h1>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">Star</span>
                </h1>
              </div>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground font-normal max-w-md leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                Enjoy the journey with personalized courses, expert mentorship, and a community built for your success.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
                <Link to="/login">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-lg group px-8 py-6 text-base font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="ghost" className="text-foreground hover:bg-muted px-8 py-6 text-base font-medium rounded-full transition-all duration-300 group">
                    Explore Courses
                    <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 animate-fade-in-up" style={{ animationDelay: '0.8s', opacity: 0 }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Expert-led courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Hands-on projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Career support</span>
                </div>
              </div>
            </div>

            {/* Right Side - Orbital Cards Animation */}
            <div className="relative hidden lg:block h-[500px]">
              {/* Orbit center point */}
              <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2">
                {/* Subtle orbit path indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-primary/10" />
                
                {/* Main decorative gradient circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 blur-2xl animate-gentle-pulse" />

                {/* Orbiting Card 1 - Sarah Chen */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-1">
                  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">Sarah Chen</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Joined <span className="text-primary font-medium">Google</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Card 2 - 500+ Courses */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-2">
                  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">500+ Courses</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Industry recognized</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Card 3 - Raj Patel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-3">
                  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">Raj Patel</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Joined <span className="text-primary font-medium">Microsoft</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Card 4 - 95% Success */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-4">
                  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[10px] font-medium text-primary">A</div>
                        <div className="w-6 h-6 rounded-full bg-primary/30 border-2 border-card flex items-center justify-center text-[10px] font-medium text-primary">B</div>
                        <div className="w-6 h-6 rounded-full bg-primary/40 border-2 border-card flex items-center justify-center text-[10px] font-medium text-primary-foreground">+</div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">95% Success</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Placement rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbiting Card 5 - New Achievement */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-5">
                  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-elevated">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground whitespace-nowrap">10K+ Students</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">Learning daily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating dots */}
              <div className="absolute top-16 left-16 w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
              <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-primary/25 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            
            <div className="relative flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-3 group gesture-card-hover px-4 py-2 rounded-lg cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-300 gesture-icon-bounce">
                      <Icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    </div>
                    <div className="gesture-text-slide transition-all duration-300">
                      <div className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                    {index < stats.length - 1 && (
                      <div className="hidden md:block w-px h-10 bg-border/50 ml-6 group-hover:bg-border transition-colors duration-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Why Choose Us */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Subtle background accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mb-20">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Why Risee</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
              Everything you need to succeed
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              A platform designed with precision to accelerate your learning journey.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 rounded-2xl overflow-hidden">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group gesture-card-hover bg-background p-8 relative cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover indicator */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent rounded-lg transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300 gesture-icon-bounce">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 gesture-text-slide">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed gesture-text-slide">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits - Minimal List */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {benefits.slice(0, 6).map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 group gesture-card-hover p-4 rounded-lg cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary/30 flex items-center justify-center mt-0.5 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300 gesture-icon-bounce">
                  <CheckCircle2 className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-all duration-300 gesture-text-slide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <style>{`
          @keyframes testimonialFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmerBorder {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.1); }
            50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.2); }
          }
          .testimonial-card {
            animation: testimonialFloat 6s ease-in-out infinite;
          }
          .testimonial-card:nth-child(2) {
            animation-delay: 1s;
          }
          .testimonial-card:nth-child(3) {
            animation-delay: 2s;
          }
          .shimmer-border {
            background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
            background-size: 200% 100%;
            animation: shimmerBorder 3s ease-in-out infinite;
          }
          .glow-card {
            animation: glowPulse 4s ease-in-out infinite;
          }
        `}</style>

        <div className="container mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Student Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
              Loved by <span className="bg-gradient-primary bg-clip-text text-transparent">Learners</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-lg mx-auto">
              Join thousands of students who transformed their careers with Risee
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card group relative gesture-card-hover cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Gradient border effect - Enhanced */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 gesture-glow" />
                
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 lg:p-8 h-full glow-card group-hover:border-primary/50 transition-all duration-500">
                  {/* Rating Stars with stagger animation */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-primary text-primary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" 
                        style={{ 
                          transitionDelay: `${i * 80}ms`,
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                  </div>

                  {/* Quote with slide effect */}
                  <p className="text-sm md:text-base text-foreground/90 mb-6 leading-relaxed gesture-text-slide transition-all duration-300 group-hover:text-foreground">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm group-hover:scale-110 transition-transform duration-300">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="gesture-text-slide transition-all duration-300">
                      <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Decorative corner accent - Enhanced */}
                  <div className="absolute top-4 right-4 w-8 h-8 opacity-10 group-hover:opacity-40 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                    <Quote className="w-full h-full text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-8 border-t border-border/30">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex -space-x-2">
                {['S', 'M', 'E', 'R'].map((letter, i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm ml-2">10,000+ happy students</span>
            </div>
            <div className="h-4 w-px bg-border hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9/5 average rating</span>
            </div>
            <div className="h-4 w-px bg-border hidden md:block" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm">Top rated platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Purple Theme */}
      <section className="py-16 px-4">
        <style>{`
          @keyframes ctaShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes ctaPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          @keyframes ctaFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .cta-shimmer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: ctaShimmer 3s ease-in-out infinite;
          }
          .cta-glow {
            animation: ctaPulse 3s ease-in-out infinite;
          }
          .cta-float {
            animation: ctaFloat 4s ease-in-out infinite;
          }
        `}</style>
        <div className="container mx-auto max-w-4xl">
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-8 md:p-12 overflow-hidden group hover:border-primary/50 transition-all duration-500 cta-shimmer">
            {/* Animated glow orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl cta-glow" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/15 rounded-full blur-2xl cta-glow" style={{ animationDelay: '1s' }} />
            
            {/* Floating accent dots */}
            <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-primary/50 cta-float" />
            <div className="absolute bottom-8 left-12 w-1.5 h-1.5 rounded-full bg-primary/40 cta-float" style={{ animationDelay: '0.5s' }} />
            
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left - Text */}
              <div className="lg:max-w-md">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight">
                  Start your journey <span className="text-primary">today</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join 10,000+ learners building their future with Risee.
                </p>
              </div>
              
              {/* Right - CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 group/btn">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1 group/link">
                  Explore courses
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                </Link>
              </div>
            </div>

            {/* Bottom trust line */}
            <div className="relative z-10 flex items-center gap-4 mt-8 pt-6 border-t border-primary/20 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="text-primary">✓</span> Free trial</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span className="flex items-center gap-1"><span className="text-primary">✓</span> No credit card</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span className="flex items-center gap-1"><span className="text-primary">✓</span> Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
