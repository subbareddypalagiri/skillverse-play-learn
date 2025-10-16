import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Music, Camera, BookOpen, Dumbbell, Code } from "lucide-react";

const Hobbies = () => {
  const hobbies = [
    {
      icon: Palette,
      title: "Art & Painting",
      members: 234,
      description: "Express yourself through colors and creativity"
    },
    {
      icon: Music,
      title: "Music Club",
      members: 456,
      description: "Learn instruments and perform with fellow musicians"
    },
    {
      icon: Camera,
      title: "Photography",
      members: 189,
      description: "Capture moments and tell stories through lenses"
    },
    {
      icon: BookOpen,
      title: "Book Club",
      members: 312,
      description: "Read, discuss, and explore new literary worlds"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Sports",
      members: 567,
      description: "Stay active with group workouts and sports"
    },
    {
      icon: Code,
      title: "Coding Club",
      members: 789,
      description: "Build projects and compete in coding challenges"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Hobbies & Clubs</h1>
            <p className="text-muted-foreground text-lg">
              Explore your interests and connect with like-minded students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hobbies.map((hobby, index) => {
              const Icon = hobby.icon;
              return (
                <Card key={index} className="p-8 text-center shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{hobby.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{hobby.description}</p>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    {hobby.members} members
                  </div>
                  
                  <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Join Club
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hobbies;
