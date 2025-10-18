import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, CheckCircle, Globe, Monitor, Wifi } from "lucide-react";
import { useState } from "react";

const Events = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  const events = [
    {
      title: "Winter Coding Hackathon",
      date: "Dec 15-16, 2024",
      time: "9:00 AM - 9:00 PM",
      location: "Tech Hub, Campus",
      venue: "Main Conference Hall, Building A",
      attendees: 150,
      maxAttendees: 200,
      duration: "48 hours",
      type: "Competition",
      mode: "offline",
      description: "Join us for an intense 48-hour coding challenge where teams will build innovative solutions to real-world problems. Food and refreshments will be provided.",
      requirements: "Laptop, Programming knowledge, Team of 2-4 members",
      prizes: "1st Place: $5000, 2nd Place: $3000, 3rd Place: $1000",
      organizer: "Tech Society",
      contact: "tech@university.edu"
    },
    {
      title: "Mountain Adventure Trek",
      date: "Dec 20-22, 2024",
      time: "6:00 AM - 6:00 PM",
      location: "Blue Mountains",
      venue: "Blue Mountains National Park",
      attendees: 45,
      maxAttendees: 50,
      duration: "3 days",
      type: "Adventure",
      mode: "offline",
      description: "Experience nature while bonding with fellow students. This 3-day trek includes camping, hiking, and team-building activities.",
      requirements: "Hiking boots, Warm clothing, Sleeping bag",
      prizes: "Certificate of completion, Group photo, Adventure badge",
      organizer: "Adventure Club",
      contact: "adventure@university.edu"
    },
    {
      title: "AI & ML Tech Talk",
      date: "Dec 22, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      venue: "Zoom Meeting Room",
      attendees: 300,
      maxAttendees: 500,
      duration: "2 hours",
      type: "Learning",
      mode: "online",
      description: "Learn about latest trends in AI from industry experts. Interactive Q&A session included.",
      requirements: "Stable internet connection, Zoom app",
      prizes: "Certificate of participation, Networking opportunities",
      organizer: "AI Research Center",
      contact: "ai@university.edu"
    },
    {
      title: "Web Dev Workshop",
      date: "Jan 5, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Lab 204, Main Building",
      venue: "Computer Lab 204, Main Building, Floor 2",
      attendees: 80,
      maxAttendees: 100,
      duration: "4 hours",
      type: "Workshop",
      mode: "offline",
      description: "Hands-on workshop on modern web development covering React, Node.js, and database integration.",
      requirements: "Laptop, Basic programming knowledge",
      prizes: "Workshop completion certificate, Project portfolio",
      organizer: "Web Development Society",
      contact: "webdev@university.edu"
    },
    {
      title: "Beach Cleanup & Picnic",
      date: "Jan 12, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "Sunset Beach",
      venue: "Sunset Beach Park, Pavilion Area",
      attendees: 60,
      maxAttendees: 80,
      duration: "1 day",
      type: "Social",
      mode: "offline",
      description: "Make a difference while having fun at the beach. Environmental cleanup followed by picnic and games.",
      requirements: "Comfortable clothes, Sunscreen, Water bottle",
      prizes: "Environmental volunteer certificate, Group lunch",
      organizer: "Environmental Club",
      contact: "environment@university.edu"
    },
    {
      title: "Startup Pitch Competition",
      date: "Jan 18, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Innovation Center",
      venue: "Innovation Center Auditorium, Ground Floor",
      attendees: 100,
      maxAttendees: 150,
      duration: "6 hours",
      type: "Competition",
      mode: "offline",
      description: "Pitch your startup idea and win funding. Connect with investors and mentors from the industry.",
      requirements: "Business plan, Pitch deck, Team presentation",
      prizes: "1st Place: $10,000 funding, 2nd Place: $5,000, 3rd Place: $2,000",
      organizer: "Entrepreneurship Center",
      contact: "startup@university.edu"
    }
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Competition": return "default";
      case "Adventure": return "secondary";
      case "Learning": return "outline";
      case "Workshop": return "secondary";
      case "Social": return "outline";
      default: return "outline";
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === "online" ? <Globe className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
  };

  const getModeColor = (mode: string) => {
    return mode === "online" ? "text-blue-500" : "text-green-500";
  };

  const handleRegister = (event: any) => {
    setSelectedEvent(event);
    setRegisteredEvents(prev => [...prev, event]);
    setShowSuccessDialog(true);
  };

  const isRegistered = (event: any) => {
    return registeredEvents.some(registered => registered.title === event.title);
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
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50">
                {/* Event Mode Indicator */}
                <div className={`h-2 w-full ${event.mode === 'online' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <Badge variant={getBadgeVariant(event.type)} className="w-fit">
                        {event.type}
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs font-medium ${getModeColor(event.mode)}`}>
                        {getModeIcon(event.mode)}
                        {event.mode === 'online' ? 'Online Event' : 'Offline Event'}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-foreground">
                      <Calendar className="w-4 h-4 mr-3 text-primary/70" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-xs text-muted-foreground">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <MapPin className="w-4 h-4 mr-3 text-primary/70" />
                      <div>
                        <div className="font-medium">{event.venue}</div>
                        <div className="text-xs text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <Clock className="w-4 h-4 mr-3 text-primary/70" />
                      <span className="font-medium">{event.duration}</span>
                    </div>
                  </div>
                  
                  {/* Registration Status */}
                  {isRegistered(event) ? (
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event)}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-200"
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Success Registration Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Successfully Registered!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedEvent && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>{selectedEvent.date} at {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary/70" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getModeIcon(selectedEvent.mode)}
                      <span className={getModeColor(selectedEvent.mode)}>
                        {selectedEvent.mode === 'online' ? 'Online Event' : 'Offline Event'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">You have successfully registered for this event. Here are the important details:</p>
                  <div className="space-y-2">
                    <div><strong>Organizer:</strong> {selectedEvent.organizer}</div>
                    <div><strong>Contact:</strong> {selectedEvent.contact}</div>
                    <div><strong>Requirements:</strong> {selectedEvent.requirements}</div>
                    {selectedEvent.prizes && <div><strong>Prizes:</strong> {selectedEvent.prizes}</div>}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation email shortly with further instructions and event details.
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                Got it!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Events;
