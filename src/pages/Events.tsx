import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const Events = () => {
  const events = [
    {
      title: "Winter Coding Hackathon",
      date: "Dec 15-16, 2024",
      location: "Tech Hub, Campus",
      attendees: 150,
      duration: "48 hours",
      type: "Competition",
      description: "Join us for an intense 48-hour coding challenge"
    },
    {
      title: "Mountain Adventure Trek",
      date: "Dec 20-22, 2024",
      location: "Blue Mountains",
      attendees: 45,
      duration: "3 days",
      type: "Adventure",
      description: "Experience nature while bonding with fellow students"
    },
    {
      title: "AI & ML Tech Talk",
      date: "Dec 22, 2024",
      location: "Virtual Event",
      attendees: 300,
      duration: "2 hours",
      type: "Learning",
      description: "Learn about latest trends in AI from industry experts"
    },
    {
      title: "Web Dev Workshop",
      date: "Jan 5, 2025",
      location: "Lab 204, Main Building",
      attendees: 80,
      duration: "4 hours",
      type: "Workshop",
      description: "Hands-on workshop on modern web development"
    },
    {
      title: "Beach Cleanup & Picnic",
      date: "Jan 12, 2025",
      location: "Sunset Beach",
      attendees: 60,
      duration: "1 day",
      type: "Social",
      description: "Make a difference while having fun at the beach"
    },
    {
      title: "Startup Pitch Competition",
      date: "Jan 18, 2025",
      location: "Innovation Center",
      attendees: 100,
      duration: "6 hours",
      type: "Competition",
      description: "Pitch your startup idea and win funding"
    }
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Competition": return "default";
      case "Adventure": return "secondary";
      case "Learning": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
            <p className="text-muted-foreground text-lg">
              Join us for exciting trips, hackathons, and learning experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-gradient-accent text-accent-foreground">{event.type}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    {event.attendees}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {event.duration}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Register Now
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

export default Events;
