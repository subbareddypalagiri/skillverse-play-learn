import PageLayout from "@/components/PageLayout";
import ClubsSection from "@/components/ClubsSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, CheckCircle, Globe, Monitor, Sparkles, ArrowRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

const typeColors: Record<string, string> = {
  Competition: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Adventure:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Learning:    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Workshop:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Social:      "bg-pink-500/10 text-pink-400 border-pink-500/20",
  default:     "bg-primary/10 text-primary border-primary/20",
};

const Events = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedLocation !== "all") params.append("location", selectedLocation);
      const response = await apiClient.get(`/events?${params}`);
      const result = response.data;
      if (result.status === "success") setEvents(result.data.events);
      else setError("Failed to load events");
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [selectedCategory, selectedLocation]);

  const handleRegister = (event: any) => {
    setSelectedEvent(event);
    setRegisteredEvents(prev => [...prev, event]);
    setShowSuccessDialog(true);
  };

  const isRegistered = (event: any) =>
    registeredEvents.some(r => r.title === event.title);

  const filteredEvents = events.filter(event => {
    const catMatch = selectedCategory === "all" || event.category === selectedCategory;
    const locMatch = selectedLocation === "all" || event.location === selectedLocation;
    return catMatch && locMatch;
  });

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'technical', label: 'Technical' },
    { value: 'non-technical', label: 'Non-Technical' },
    { value: 'fun-tours', label: 'Fun Tours' },
    { value: 'industrial-tours', label: 'Industrial Tours' },
    { value: 'hackathons', label: 'Hackathons' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'In Campus', label: 'In Campus' },
    { value: 'Out of Campus', label: 'Out of Campus' },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8 animate-reveal-up">
        <div className="badge-gradient inline-flex mb-4">
          <Sparkles className="w-3 h-3" />
          Discover & Join
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          Events
        </h1>
        <p className="text-muted-foreground">
          Hackathons, workshops, tours, and more — your next big experience awaits
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border/50 p-4 mb-6 animate-reveal-up delay-100"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter Events</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map(({ value, label }) => (
            <button key={value} onClick={() => setSelectedCategory(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 ${
                selectedCategory === value
                  ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                  : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
          <span className="text-xs text-muted-foreground mr-1">Location:</span>
          {locations.map(({ value, label }) => (
            <button key={value} onClick={() => setSelectedLocation(value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-200 ${
                selectedLocation === value
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-5 animate-reveal-fade delay-200">
        {loading ? 'Loading...' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Loading state */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 p-5 animate-pulse"
              style={{ background: 'rgba(255,255,255,0.015)' }}>
              <div className="h-4 w-24 bg-border/40 rounded-lg mb-3" />
              <div className="h-5 w-3/4 bg-border/40 rounded-lg mb-2" />
              <div className="h-3 w-full bg-border/30 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 w-2/3 bg-border/20 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button onClick={fetchEvents}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
            Try again
          </button>
        </div>
      )}

      {/* Events grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredEvents.map((event, i) => {
            const typeColor = typeColors[event.type] || typeColors.default;
            const registered = isRegistered(event);
            return (
              <div key={i}
                className="group relative rounded-2xl border border-border/50 hover:border-primary/30 overflow-hidden card-lift transition-all duration-300 animate-reveal-up"
                style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.05}s` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />

                <div className="relative z-10 p-5">
                  {/* Badges row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeColor}`}>
                        {event.type}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-border/50 text-muted-foreground flex items-center gap-1">
                        {event.mode === 'online'
                          ? <><Globe className="w-2.5 h-2.5 text-blue-400" /> Online</>
                          : <><Monitor className="w-2.5 h-2.5 text-emerald-400" /> Offline</>
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-1"
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

                  {/* Details */}
                  <div className="space-y-1.5 mb-4">
                    {[
                      { icon: Calendar, text: `${event.date} · ${event.time}` },
                      { icon: MapPin, text: event.venue },
                      { icon: Clock, text: event.duration },
                    ].map(({ icon: Icon, text }, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-6 h-6 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 text-primary/70" />
                        </div>
                        <span className="truncate">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {registered ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Registered!</span>
                    </div>
                  ) : (
                    <button onClick={() => handleRegister(event)}
                      className="relative w-full py-2.5 rounded-xl text-xs font-semibold text-white overflow-hidden group/btn transition-all duration-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                      <span className="relative z-10 flex items-center justify-center gap-1.5">
                        Register Now
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary/60" />
              </div>
              <h3 className="font-bold text-foreground mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>No events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting the filters above</p>
            </div>
          )}
        </div>
      )}

      <ClubsSection />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border/60"
          style={{ background: 'hsl(230,25%,7%)' }}>
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Registration Successful!</h2>
                <p className="text-sm text-muted-foreground mt-1">You're all set for this event</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h3 className="font-semibold text-sm text-foreground mb-3">{selectedEvent.title}</h3>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {[
                    { icon: Calendar, text: `${selectedEvent.date} · ${selectedEvent.time}` },
                    { icon: MapPin, text: selectedEvent.venue },
                    { icon: Clock, text: selectedEvent.duration },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                A confirmation will be sent to your email. Check your dashboard for updates.
              </p>
              <button onClick={() => setShowSuccessDialog(false)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                Done
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Events;
