import PageLayout from "@/components/PageLayout";
import ClubsSection from "@/components/ClubsSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, CheckCircle, Globe, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/apiClient";

const Events = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedLocation !== "all") params.append("location", selectedLocation);

      const response = await apiClient.get(`/events?${params}`);
      const result = response.data;

      if (result.status === "success") {
        setEvents(result.data.events);
      } else {
        setError("Failed to load events");
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedLocation]);

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
    setShowSuccessDialog(true); // Show success dialog
  };

  const isRegistered = (event: any) => {
    return registeredEvents.some(registered => registered.title === event.title);
  };

  // Filter events based on selected category and location
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
    const locationMatch = selectedLocation === "all" || event.location === selectedLocation;
    return categoryMatch && locationMatch;
  });

  return (
    <PageLayout>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
          {/* Header */}
          <div className="mb-8" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out forwards' }}>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Events</h1>
            <p className="text-muted-foreground">
              Discover and join exciting events, hackathons, and learning experiences
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 space-y-4" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 50ms forwards' }}>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'technical', label: 'Technical' },
                { value: 'non-technical', label: 'Non-Technical' },
                { value: 'fun-tours', label: 'Fun Tours' },
                { value: 'industrial-tours', label: 'Industrial Tours' },
                { value: 'hackathons', label: 'Hackathons' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Location:</span>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'In Campus', label: 'In Campus' },
                  { value: 'Out of Campus', label: 'Out of Campus' },
                ].map((location) => (
                  <button
                    key={location.value}
                    onClick={() => setSelectedLocation(location.value)}
                    className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                      selectedLocation === location.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Count */}
          <div className="mb-4" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 100ms forwards' }}>
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
              <Card 
                key={index} 
                className="overflow-hidden bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${150 + index * 40}ms forwards` }}
              >
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {event.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        event.mode === 'online' 
                          ? 'bg-primary/5 text-primary' 
                          : 'bg-primary/5 text-primary'
                      }`}>
                        {event.mode === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-base font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Calendar className="w-3 h-3 text-primary" />
                      </div>
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <MapPin className="w-3 h-3 text-primary" />
                      </div>
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Clock className="w-3 h-3 text-primary" />
                      </div>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  
                  {/* Registration Button */}
                  {isRegistered(event) ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-primary/10 rounded-lg text-primary">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event)}
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs h-8"
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <ClubsSection />

      {/* Success Registration Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Registration Successful</h2>
                <p className="text-sm text-muted-foreground mt-1">You're all set for this event</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedEvent && (
              <div className="space-y-4">
                {/* Event Summary */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-sm mb-3">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.date} · {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.duration}</span>
                    </div>
                  </div>
                </Card>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Organizer</p>
                    <p className="text-xs font-medium">{selectedEvent.organizer}</p>
                  </Card>
                  <Card className="p-3 border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Mode</p>
                    <p className="text-xs font-medium">{selectedEvent.mode === 'online' ? 'Online' : 'Offline'}</p>
                  </Card>
                </div>

                {/* What's Next */}
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p className="font-medium text-foreground">What happens next:</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Confirmation email sent to your inbox</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reminder 24 hours before the event</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                variant="outline"
                size="sm"
                className="flex-1 border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                Close
              </Button>
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </PageLayout>
  );
};

export default Events;
