import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Trophy, Rocket } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* soft gradient background aura */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-gradient-primary opacity-20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-primary/30 opacity-20 blur-2xl" />
        </div>

        <div className="container mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gradient-primary rounded-full animate-in fade-in slide-in-from-top-2 duration-700">
            <span className="text-sm font-semibold text-primary-foreground">
              Where Learning Meets Adventure
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-in fade-in-50 zoom-in-50 duration-700 delay-100">
            Welcome to Raise
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-in fade-in-50 duration-700 delay-200">
            The learning platform that gives equal priority to education and enjoyment.
            Learn, grow, and have fun - all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-300">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elevated group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose SkillVerse?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary border-0 shadow-elevated p-12 text-center">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are learning, growing, and having fun on Raise.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Join Raise Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
