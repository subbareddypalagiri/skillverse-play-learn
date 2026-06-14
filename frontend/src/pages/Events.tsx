import PageLayout from "@/components/PageLayout";
import ClubsSection from "@/components/ClubsSection";
import AmbassadorEventForm from "@/components/AmbassadorEventForm";
import { Calendar, MapPin, Users, Clock, Globe, Monitor, Sparkles, ArrowRight, Filter, Shield, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEvents, fetchMyRegistrations } from "@/lib/eventsApi";

const typeColors: Record<string, string> = {
  Competition: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Adventure: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Learning: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Workshop: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Social: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Cultural: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  default: "bg-primary/10 text-primary border-primary/20",
};

const categoryColors: Record<string, string> = {
  cultural: "text-pink-400",
  technical: "text-cyan-400",
  "non-technical": "text-amber-400",
  "fun-tours": "text-emerald-400",
  "industrial-tours": "text-blue-400",
  hackathons: "text-violet-400",
};

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAmbassadorForm, setShowAmbassadorForm] = useState(false);

  const isAmbassador = user?.role === 'campus_ambassador' || user?.role === 'admin';

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchEvents({ category: selectedCategory, location: selectedLocation });
      if (result.success) setEvents(result.data || []);
      else setError("Failed to load events");
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, [selectedCategory, selectedLocation]);

  useEffect(() => {
    if (user) {
      fetchMyRegistrations()
        .then(regs => setRegisteredIds(new Set(regs.map((r: any) => r._id || r.id))))
        .catch(() => {});
    }
  }, [user]);

  const handleAmbassadorClick = () => {
    if (!user) {
      navigate('/login?redirect=/events');
      return;
    }
    if (!isAmbassador) {
      alert('Only Campus Ambassadors can create events. Contact your college admin to become an ambassador.');
      return;
    }
    setShowAmbassadorForm(true);
  };

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
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              Events
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg">
              Cultural fests, hackathons, fun tours, industrial visits — planned by campus ambassadors from colleges across SkillVerse
            </p>
          </div>

          {/* Ambassador Portal — better than separate login */}
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleAmbassadorClick}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              style={{ background: isAmbassador ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'linear-gradient(135deg,#374151,#1f2937)' }}>
              {isAmbassador ? <Shield className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isAmbassador ? 'Plan Event' : 'Ambassador Portal'}
            </button>
            <p className="text-[10px] text-muted-foreground text-right max-w-[180px]">
              {isAmbassador
                ? `Posting as ${user?.collegeName || 'Ambassador'}`
                : 'Campus ambassadors login to plan events'}
            </p>
          </div>
        </div>
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

      <p className="text-xs text-muted-foreground mb-5">
        {loading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
      </p>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 p-5 animate-pulse h-52"
              style={{ background: 'rgba(255,255,255,0.015)' }} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button onClick={loadEvents} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {events.map((event, i) => {
            const typeColor = typeColors[event.type] || typeColors.default;
            const eventId = event._id || event.id;
            const isReg = registeredIds.has(eventId);
            const isTour = event.category === 'fun-tours' || event.category === 'industrial-tours';

            return (
              <div key={eventId}
                onClick={() => navigate(`/events/${eventId}`)}
                className="group relative rounded-2xl border border-border/50 hover:border-primary/30 overflow-hidden card-lift transition-all duration-300 cursor-pointer animate-reveal-up"
                style={{ background: 'rgba(255,255,255,0.02)', animationDelay: `${i * 0.05}s` }}>
                <div className={`h-1 ${isTour ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-violet-500/50 to-indigo-500/50'}`} />

                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${typeColor}`}>
                        {event.type}
                      </span>
                      <span className={`text-[10px] font-medium capitalize ${categoryColors[event.category] || 'text-muted-foreground'}`}>
                        {event.category?.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground mb-1.5 leading-snug group-hover:text-primary transition-colors line-clamp-2"
                    style={{ fontFamily: 'Sora, sans-serif' }}>
                    {event.title}
                  </h3>

                  {event.collegeName && (
                    <p className="text-[10px] text-primary/70 mb-1.5 flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> {event.collegeName}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {[
                      { icon: Calendar, text: `${event.date} · ${event.time}` },
                      { icon: MapPin, text: `${event.venue} · ${event.location}` },
                      { icon: Clock, text: event.duration },
                    ].map(({ icon: Icon, text }, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-2.5 h-2.5 text-primary/70" />
                        </div>
                        <span className="truncate">{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-border/50 text-muted-foreground flex items-center gap-1">
                      {event.mode === 'online' ? <><Globe className="w-2.5 h-2.5" /> Online</> : <><Monitor className="w-2.5 h-2.5" /> Offline</>}
                    </span>
                    {isReg && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Joined
                      </span>
                    )}
                    {isTour && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        Tour
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}

          {events.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>No events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting the filters above</p>
            </div>
          )}
        </div>
      )}

      <ClubsSection />

      <AmbassadorEventForm
        open={showAmbassadorForm}
        onClose={() => setShowAmbassadorForm(false)}
        onSuccess={loadEvents}
      />
    </PageLayout>
  );
};

export default Events;
