import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

const CareerHub = () => {
  const opportunities = [
    {
      title: "Frontend Developer Intern",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Internship",
      duration: "3 months",
      stipend: "$800/month",
      skills: ["React", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "UI/UX Design Intern",
      company: "Creative Studios",
      location: "New York, NY",
      type: "Internship",
      duration: "6 months",
      stipend: "$1000/month",
      skills: ["Figma", "UI Design", "Prototyping"]
    },
    {
      title: "Data Science Intern",
      company: "Analytics Pro",
      location: "San Francisco, CA",
      type: "Internship",
      duration: "4 months",
      stipend: "$1200/month",
      skills: ["Python", "Machine Learning", "SQL"]
    },
    {
      title: "Backend Developer",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      duration: "Permanent",
      stipend: "$60k/year",
      skills: ["Node.js", "PostgreSQL", "AWS"]
    },
    {
      title: "Mobile App Developer",
      company: "AppMakers Co.",
      location: "Boston, MA",
      type: "Internship",
      duration: "5 months",
      stipend: "$900/month",
      skills: ["React Native", "Firebase", "Redux"]
    },
    {
      title: "Marketing Coordinator",
      company: "Growth Labs",
      location: "Remote",
      type: "Internship",
      duration: "3 months",
      stipend: "$700/month",
      skills: ["SEO", "Content Writing", "Analytics"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Career Hub</h1>
            <p className="text-muted-foreground text-lg">
              Find internships and job opportunities to kickstart your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {opportunities.map((opp, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{opp.title}</h3>
                    <p className="text-muted-foreground">{opp.company}</p>
                  </div>
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    {opp.type}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {opp.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    Duration: {opp.duration}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-success" />
                    {opp.stipend}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {opp.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareerHub;
