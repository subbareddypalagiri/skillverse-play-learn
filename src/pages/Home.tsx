import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Trophy, Rocket, Star, TrendingUp, Award, Zap, CheckCircle2, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Enhanced gradient background aura */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-primary/30 opacity-20 blur-2xl" />
          <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-purple-500/20 opacity-10 blur-3xl" />
        </div>

        {/* Subtle 3D Floating Spheres - Professional Design */}
        <div className="pointer-events-none absolute inset-0 -z-5">
          {/* Large Sphere - Top Right */}
          <div 
            className="absolute top-24 right-[8%] w-32 h-32 rounded-full opacity-20"
            style={{
              animation: 'floatSubtle 8s ease-in-out infinite',
              background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0.1))',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2), inset -8px -8px 16px rgba(139, 92, 246, 0.1)',
            }}
          />

          {/* Medium Sphere - Left Side */}
          <div 
            className="absolute top-40 left-[10%] w-24 h-24 rounded-full opacity-15"
            style={{
              animation: 'floatSubtle 10s ease-in-out infinite 1s',
              background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))',
              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.15), inset -6px -6px 12px rgba(168, 85, 247, 0.1)',
            }}
          />

          {/* Small Sphere - Bottom Left */}
          <div 
            className="absolute bottom-32 left-[15%] w-20 h-20 rounded-full opacity-18"
            style={{
              animation: 'floatSubtle 9s ease-in-out infinite 2s',
              background: 'radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4), rgba(147, 51, 234, 0.1))',
              boxShadow: '0 6px 24px rgba(147, 51, 234, 0.15), inset -5px -5px 10px rgba(147, 51, 234, 0.1)',
            }}
          />

          {/* Medium Sphere - Right Side */}
          <div 
            className="absolute top-1/3 right-[15%] w-28 h-28 rounded-full opacity-16"
            style={{
              animation: 'floatSubtle 11s ease-in-out infinite 1.5s',
              background: 'radial-gradient(circle at 30% 30%, rgba(126, 34, 206, 0.4), rgba(126, 34, 206, 0.1))',
              boxShadow: '0 8px 32px rgba(126, 34, 206, 0.15), inset -7px -7px 14px rgba(126, 34, 206, 0.1)',
            }}
          />

          {/* Small Sphere - Bottom Right */}
          <div 
            className="absolute bottom-40 right-[20%] w-16 h-16 rounded-full opacity-20"
            style={{
              animation: 'floatSubtle 7s ease-in-out infinite 3s',
              background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0.1))',
              boxShadow: '0 6px 24px rgba(139, 92, 246, 0.2), inset -4px -4px 8px rgba(139, 92, 246, 0.1)',
            }}
          />

          {/* Tiny Accent Sphere - Top Left */}
          <div 
            className="absolute top-1/4 left-[22%] w-12 h-12 rounded-full opacity-12"
            style={{
              animation: 'floatSubtle 6s ease-in-out infinite 0.5s',
              background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.05))',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.1)',
            }}
          />

          {/* Tiny Accent Sphere - Middle Right */}
          <div 
            className="absolute top-1/2 right-[25%] w-14 h-14 rounded-full opacity-14"
            style={{
              animation: 'floatSubtle 8.5s ease-in-out infinite 2.5s',
              background: 'radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.3), rgba(147, 51, 234, 0.05))',
              boxShadow: '0 4px 16px rgba(147, 51, 234, 0.12)',
            }}
          />
        </div>

        <style>{`
          @keyframes floatSubtle {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-15px) translateX(8px);
            }
            50% {
              transform: translateY(-25px) translateX(-8px);
            }
            75% {
              transform: translateY(-12px) translateX(5px);
            }
          }
        `}</style>

        <div className="container mx-auto text-center">
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-700">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              4.9/5 Rating
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-1 text-orange-500" />
              10K+ Active Students
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Award className="w-4 h-4 mr-1 text-blue-500" />
              Industry Recognized
            </Badge>
          </div>

          <div className="inline-block mb-6 px-4 py-2 bg-gradient-primary rounded-full animate-in fade-in slide-in-from-top-2 duration-700 delay-100">
            <span className="text-sm font-semibold text-primary-foreground">
              🚀 Where Learning Meets Adventure
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-in fade-in-50 zoom-in-50 duration-700 delay-200 leading-tight">
            Welcome to Risee
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-in fade-in-50 duration-700 delay-300 leading-relaxed">
            The learning platform that gives equal priority to education and enjoyment.
            <span className="block mt-2 text-lg md:text-xl font-medium text-foreground">
              Learn, grow, and have fun - all in one place.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in duration-700 delay-400">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elevated group px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg">
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
            Join 10,000+ students already learning on Risee
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Risee?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey and achieve your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Benefits List */}
          <Card className="p-8 md:p-12 bg-gradient-card border-0 shadow-elevated">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">What You'll Get</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 group-hover:bg-green-500/30 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-base text-foreground/90">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              Student Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Learners</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our students have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary border-0 shadow-elevated p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                Start Your Journey Today
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Future?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who are learning, growing, and having fun on Risee.
                Start your free trial today - no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-lg group">
                    Join Risee Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg">
                    View Courses
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-6">
                ✓ Free 14-day trial · ✓ No credit card required · ✓ Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
