import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { fetchEventById, registerForEvent, isTourCategory, cancelEvent, deleteEvent, fetchEventRegistrants, fetchEventMemories, addEventMemory, uploadTempFile } from '@/lib/eventsApi';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, CheckCircle, Loader2,
  Bus, Utensils, User, Backpack, Route, Globe, Monitor, Building2, Shield,
  Trash2, XCircle, Edit, MessageCircle, Train, Car, Camera, Video, Plus, Play, Image, UploadCloud, Download
} from 'lucide-react';
import { EventChat } from '@/components/EventChat';
import AmbassadorEventForm from '@/components/AmbassadorEventForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const categoryColors: Record<string, string> = {
  cultural: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  technical: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'non-technical': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'fun-tours': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'industrial-tours': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hackathons: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrantsModal, setShowRegistrantsModal] = useState(false);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);
  const [registrants, setRegistrants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Memories & Stories State
  const [memories, setMemories] = useState<any[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'photo'>('photo');
  const [uploadUrl, setUploadUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleViewRegistrants = async () => {
    setShowRegistrantsModal(true);
    setLoadingRegistrants(true);
    try {
      const data = await fetchEventRegistrants(id!);
      setRegistrants(data || []);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch registrants');
    } finally {
      setLoadingRegistrants(false);
    }
  };

  const loadEventDetails = () => {
    if (!id) return;
    fetchEventById(id)
      .then(data => {
        setEvent(data);
        let isReg = !!data.isRegistered;
        try {
          const saved = localStorage.getItem('registeredEventIds');
          if (saved) {
            const ids = JSON.parse(saved);
            if (ids.includes(id) || (data._id && ids.includes(data._id)) || (data.id && ids.includes(data.id))) {
              isReg = true;
            }
          }
        } catch {}
        setRegistered(isReg);
      })
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false));
  };

  const isPast = event && new Date(event.endDate || event.startDate) < new Date();

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  useEffect(() => {
    if (event && isPast) {
      setLoadingMemories(true);
      fetchEventMemories(id!)
        .then(data => setMemories(data || []))
        .catch(err => console.error('Error fetching memories:', err))
        .finally(() => setLoadingMemories(false));
    }
  }, [event, id]);

  const storiesList = memories.filter(m => m.type === 'video');
  const photosList = memories.filter(m => m.type === 'photo');

  const handleJoin = async () => {
    if (!user) {
      navigate('/login?redirect=/events/' + id);
      return;
    }
    setRegistering(true);
    try {
      await registerForEvent(id!);
      setRegistered(true);
      setEvent((prev: any) => ({
        ...prev,
        attendees: (prev.attendees || 0) + 1,
        registeredCount: (prev.registeredCount || 0) + 1
      }));
      try {
        const saved = localStorage.getItem('registeredEventIds');
        const ids = saved ? JSON.parse(saved) : [];
        if (!ids.includes(id!)) {
          ids.push(id!);
          localStorage.setItem('registeredEventIds', JSON.stringify(ids));
        }
      } catch {}
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this event? Students will see it as cancelled.')) return;
    try {
      await cancelEvent(id!);
      setEvent((prev: any) => ({ ...prev, isCancelled: true }));
      alert('Event has been marked as cancelled.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel event');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await deleteEvent(id!);
      alert('Event deleted successfully.');
      navigate('/events');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleShareMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to share memories');
      return;
    }

    let urlToSave = uploadUrl.trim();

    if (selectedFile) {
      setUploadingFile(true);
      try {
        const uploadedUrl = await uploadTempFile(selectedFile);
        urlToSave = uploadedUrl;
      } catch (err: any) {
        alert(err.response?.data?.message || 'File upload failed');
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    if (!urlToSave) {
      alert('Please select a file or enter a URL link');
      return;
    }

    try {
      const result = await addEventMemory(id!, { type: uploadType, url: urlToSave });
      if (result.success) {
        setMemories(prev => [result.data.memory, ...prev]);
        setShowUploadModal(false);
        setUploadUrl('');
        setSelectedFile(null);
        alert('Memory shared successfully!');
      } else {
        alert('Failed to share memory');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to share memory');
    }
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return (
      url.includes('drive.google.com') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url)
    );
  };

  const formatPhotoUrl = (url: string) => {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
    }
    return url;
  };

  const getDirectDownloadUrl = (url: string) => {
    if (!url) return '#';
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    return url;
  };

  const renderStoryMedia = (url: string) => {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return (
        <iframe
          key={url}
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          className="w-full h-full border-0 min-h-[420px]"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
    if (ytMatch) {
      const videoId = ytMatch[1];
      return (
        <iframe
          key={url}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          className="w-full h-full border-0 min-h-[420px]"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video
        key={url}
        src={url}
        autoPlay
        playsInline
        controls
        className="w-full h-full object-contain max-h-[75vh]"
      />
    );
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error || !event) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <p className="text-muted-foreground mb-4">{error || 'Event not found'}</p>
          <button onClick={() => navigate('/events')} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>Back to Events</button>
        </div>
      </PageLayout>
    );
  }

  const isTour = isTourCategory(event.category);
  const tour = event.tourDetails;
  const spotsLeft = (event.maxAttendees || event.capacity || 0) - (event.attendees || event.registeredCount || 0);
  const catColor = categoryColors[event.category] || 'bg-primary/10 text-primary border-primary/20';

  const isCreator = user && (user.role === 'admin' || (event.organizer && event.organizer._id === user._id));

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        {/* Hero */}
        <div className="rounded-2xl border border-border/50 overflow-hidden mb-6"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className={`h-2 ${isTour ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`} />
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${catColor}`}>
                {event.category?.replace('-', ' ')}
              </span>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-border/50 text-muted-foreground flex items-center gap-1">
                {event.mode === 'online' ? <><Globe className="w-2.5 h-2.5" /> Online</> : <><Monitor className="w-2.5 h-2.5" /> Offline</>}
              </span>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-border/50 text-muted-foreground flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5" /> {event.location || event.campusLocation}
              </span>
              {event.isCancelled && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> CANCELLED
                </span>
              )}
            </div>

            {isCreator && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-xs font-semibold text-primary w-full mb-1 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5"/> Creator Controls</p>
                {/* Edit Button */}
                <button onClick={() => setShowEditModal(true)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                {/* View Registrations Button */}
                <button onClick={handleViewRegistrants} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 transition-colors">
                  <Users className="w-3.5 h-3.5" /> View Registrations
                </button>
                {!event.isCancelled && (
                  <button onClick={handleCancel} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Cancel Event
                  </button>
                )}
                <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Event
                </button>
              </div>
            )}

            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              {event.title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{event.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: Calendar, label: 'Date', value: event.date },
                { icon: Clock, label: 'Time', value: event.time },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Users, label: 'Spots', value: `${event.attendees}/${event.maxAttendees}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-border/40 p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Icon className="w-3.5 h-3.5 text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {event.collegeName && (
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Organized by <span className="text-foreground font-medium">{event.organizer?.name || 'Campus Ambassador'}</span>
                {event.collegeName && <> · {event.collegeName}</>}
              </p>
            )}

            {registered ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">You're registered!</span>
                </div>
                <button onClick={() => setShowChat(!showChat)}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-white/5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> {showChat ? 'Close Trip Chat' : 'Open Trip Chat'}
                </button>
              </div>
            ) : isCreator && !event.isCancelled ? (
              <button onClick={() => setShowChat(!showChat)}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-white/5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> {showChat ? 'Close Creator Chat' : 'Open Event Chat (Creator)'}
              </button>
            ) : (
              <button onClick={handleJoin} disabled={registering || spotsLeft <= 0}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                {registering ? 'Joining...' : spotsLeft <= 0 ? 'Event Full' : 'Join This Event'}
              </button>
            )}
          </div>
        </div>

        {/* Completed Event Memories Section */}
        {isPast && (
          <div className="rounded-2xl border border-border/50 p-6 mb-6 overflow-hidden animate-reveal-up"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            
            <div className="flex items-center justify-between mb-6 border-b border-border/20 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  <Camera className="w-5 h-5 text-violet-400" /> Event Memories & Stories
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Instagram-style stories & shared photos from this trip</p>
              </div>
              {user && (
                <button onClick={() => { setUploadUrl(''); setSelectedFile(null); setShowUploadModal(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 rounded-xl transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.2)]">
                  <Plus className="w-3.5 h-3.5" /> Share Memory
                </button>
              )}
            </div>

            {loadingMemories ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border/50 rounded-xl">
                <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-45" />
                <p className="text-xs text-muted-foreground">No memories shared yet. Be the first to share your trip moments!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Instagram-Style Stories Carousel */}
                {storiesList.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-violet-400" /> Video Memories
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                      {storiesList.map((story) => (
                        <div key={story._id || story.id} onClick={() => setSelectedMedia(story)}
                          className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group">
                          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 group-hover:scale-105 transition-transform duration-200">
                            <div className="w-full h-full rounded-full border-2 border-zinc-950 overflow-hidden bg-zinc-900 flex items-center justify-center relative">
                              {story.userAvatar ? (
                                <img src={story.userAvatar} alt={story.userName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold text-white uppercase">{story.userName[0]}</span>
                              )}
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-4 h-4 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground max-w-[70px] truncate">{story.userName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Photo & Media Gallery Grid */}
                {photosList.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Image className="w-3.5 h-3.5 text-emerald-400" /> Shared Photos & Videos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photosList.map((photo) => {
                        const isVid = photo.type === 'video' || isVideoUrl(photo.url);
                        return (
                          <div
                            key={photo._id || photo.id}
                            onClick={() => setSelectedMedia(photo)}
                            className="relative aspect-square rounded-xl overflow-hidden border border-border/40 bg-zinc-900 group cursor-pointer hover:border-primary/50 transition-all shadow-md"
                          >
                            <img
                              src={formatPhotoUrl(photo.url)}
                              alt="Trip memory"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Play button overlay if it's a video */}
                            {isVid && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end justify-between">
                              <div>
                                <p className="text-[10px] font-bold text-white truncate">{photo.userName}</p>
                                <p className="text-[8px] text-zinc-300 mt-0.5">{new Date(photo.createdAt).toLocaleDateString()}</p>
                              </div>
                              <a
                                href={getDirectDownloadUrl(photo.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-black/60 hover:bg-primary text-white text-xs transition-colors shadow-md flex items-center justify-center"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Floating Chat Window */}
        {showChat && (user && (registered || isCreator)) && (
          <EventChat eventId={id!} onClose={() => setShowChat(false)} />
        )}

        {/* Tour Journey */}
        {isTour && tour && (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
              <Route className="w-5 h-5 text-emerald-400" /> Journey Details
            </h2>

            {tour.destinations?.length > 0 && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Destinations
                </h3>
                <div className="space-y-3">
                  {tour.destinations.map((dest: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{dest.name}</p>
                        {dest.description && <p className="text-xs text-muted-foreground">{dest.description}</p>}
                        {dest.arrivalTime && <p className="text-[10px] text-primary mt-0.5">Arrival: {dest.arrivalTime}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tour.food && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" /> Food & Meals
                </h3>
                <div className="space-y-2 text-sm">
                  {tour.food.meals && <p><span className="text-muted-foreground">Meals:</span> {tour.food.meals}</p>}
                  {tour.food.snacks && <p><span className="text-muted-foreground">Snacks:</span> {tour.food.snacks}</p>}
                  {tour.food.dietaryOptions && <p><span className="text-muted-foreground">Dietary:</span> {tour.food.dietaryOptions}</p>}
                </div>
              </div>
            )}

            {tour.planner && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Event Planner
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {tour.planner.name?.[0] || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tour.planner.name}</p>
                    <p className="text-xs text-muted-foreground">{tour.planner.organization}</p>
                    {tour.planner.contact && <p className="text-xs text-primary">{tour.planner.contact}</p>}
                  </div>
                </div>
              </div>
            )}

            {tour.bus && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  {tour.bus.transportType === 'train' ? (
                    <Train className="w-4 h-4 text-sky-400" />
                  ) : tour.bus.transportType === 'auto' ? (
                    <Car className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <Bus className="w-4 h-4 text-blue-400" />
                  )}
                  {tour.bus.transportType === 'train' ? 'Train Details' : tour.bus.transportType === 'auto' ? 'Auto / Cab Details' : 'Bus & Transport'}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {tour.bus.busNumber && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {tour.bus.transportType === 'train' ? 'Train No.' : tour.bus.transportType === 'auto' ? 'Cab/Auto No.' : 'Bus No.'}
                      </p>
                      <p className="font-medium">{tour.bus.busNumber}</p>
                    </div>
                  )}
                  {tour.bus.pickupPoint && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {tour.bus.transportType === 'train' ? 'Station' : 'Pickup'}
                      </p>
                      <p className="font-medium">{tour.bus.pickupPoint}</p>
                    </div>
                  )}
                  {tour.bus.departureTime && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Departure</p>
                      <p className="font-medium">{tour.bus.departureTime}</p>
                    </div>
                  )}
                  {tour.bus.returnTime && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {tour.bus.transportType === 'train' ? 'Arrival' : 'Return'}
                      </p>
                      <p className="font-medium">{tour.bus.returnTime}</p>
                    </div>
                  )}
                  {tour.bus.driverName && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {tour.bus.transportType === 'train' ? 'Coach / Seat' : 'Driver'}
                      </p>
                      <p className="font-medium">{tour.bus.driverName}</p>
                    </div>
                  )}
                  {tour.bus.driverContact && (
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {tour.bus.transportType === 'train' ? 'Ticket/PNR' : 'Contact'}
                      </p>
                      <p className="font-medium text-primary">{tour.bus.driverContact}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tour.itinerary && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-2">Full Itinerary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tour.itinerary}</p>
              </div>
            )}

            {tour.thingsToCarry?.length > 0 && (
              <div className="rounded-2xl border border-border/50 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Backpack className="w-4 h-4 text-orange-400" /> Things to Carry
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tour.thingsToCarry.map((item: string, i: number) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/20">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Duration info for non-tour */}
        {!isTour && event.duration && (
          <div className="rounded-2xl border border-border/50 p-5 mb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="text-sm font-semibold text-foreground mb-2">Event Info</h3>
            <p className="text-sm text-muted-foreground">Duration: <span className="text-foreground">{event.duration}</span></p>
          </div>
        )}

        {/* Dynamic Custom Fields Display */}
        {event.customFields && event.customFields.length > 0 && (
          <div className="rounded-2xl border border-border/50 p-5 mb-6 animate-reveal-up" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" /> Additional Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {event.customFields.map((field: any, i: number) => (
                <div key={i} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <p className="text-[10px] text-muted-foreground uppercase">{field.label}</p>
                  <p className="font-medium mt-0.5 text-zinc-100">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registrants Modal */}
      {showRegistrantsModal && (
        <Dialog open={showRegistrantsModal} onOpenChange={setShowRegistrantsModal}>
          <DialogContent className="max-w-md w-full bg-zinc-950/95 backdrop-blur-xl border border-white/10 text-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Registered Attendees ({event?.attendees || 0})
              </DialogTitle>
            </div>

            {loadingRegistrants ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                <p className="text-xs text-zinc-400">Fetching registrants list...</p>
              </div>
            ) : registrants.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-sm">
                No one has registered for this event yet.
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                {registrants.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-bold text-violet-400 uppercase text-sm shrink-0">
                      {item.user?.name ? item.user.name[0] : '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-zinc-100">{item.user?.name || 'Unknown User'}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{item.user?.email || 'No email'}</p>
                      {item.user?.collegeName && (
                        <p className="text-[10px] text-violet-300 truncate mt-0.5">{item.user.collegeName}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] text-zinc-400">Joined</p>
                      <p className="text-[10px] font-medium text-zinc-300 mt-0.5">
                        {new Date(item.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setShowRegistrantsModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-colors">
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Event Modal */}
      {showEditModal && event && (
        <AmbassadorEventForm
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={loadEventDetails}
          eventToEdit={event}
        />
      )}

      {/* Media / Story Viewer Modal */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="sm:max-w-2xl w-full bg-zinc-950 border border-zinc-800 p-0 overflow-hidden rounded-2xl flex flex-col max-h-[90vh] relative shadow-2xl">
            <DialogTitle className="sr-only">Media Viewer</DialogTitle>
            
            {/* Header */}
            <div className="p-3 bg-zinc-900 border-b border-white/10 flex items-center justify-between z-30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-white/20 flex items-center justify-center">
                  {selectedMedia.userAvatar ? (
                    <img src={selectedMedia.userAvatar} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white uppercase">{selectedMedia.userName?.[0] || 'U'}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{selectedMedia.userName}</p>
                  <p className="text-[9px] text-zinc-400">{new Date(selectedMedia.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions: Download & Close */}
              <div className="flex items-center gap-2">
                <a
                  href={getDirectDownloadUrl(selectedMedia.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button type="button" onClick={() => setSelectedMedia(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors">
                  ✕
                </button>
              </div>
            </div>

            {/* Video / Embed Player OR Image */}
            <div className="w-full flex-1 min-h-[420px] max-h-[75vh] flex items-center justify-center bg-black relative">
              {selectedMedia.type === 'video' || isVideoUrl(selectedMedia.url) ? (
                renderStoryMedia(selectedMedia.url)
              ) : (
                <img src={formatPhotoUrl(selectedMedia.url)} alt="Memory" className="w-full h-full object-contain max-h-[75vh]" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload Memory Modal */}
      {showUploadModal && (
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <DialogTitle className="text-lg font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
              Share Your Trip Memory
            </DialogTitle>
            <form onSubmit={handleShareMemory} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Memory Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setUploadType('photo'); setSelectedFile(null); }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'photo'
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'border-zinc-800 text-muted-foreground hover:bg-zinc-900'
                    }`}>
                    <Image className="w-4 h-4" /> Trip Photo
                  </button>
                  <button type="button" onClick={() => { setUploadType('video'); setSelectedFile(null); }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'video'
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'border-zinc-800 text-muted-foreground hover:bg-zinc-900'
                    }`}>
                    <Video className="w-4 h-4" /> Video Story
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Upload File</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={uploadingFile}
                    className="hidden" id="file-upload" />
                  <label htmlFor="file-upload"
                    className="border border-dashed border-zinc-800 hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/50 transition-all">
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                        <span className="text-xs text-muted-foreground">Uploading to public host...</span>
                      </>
                    ) : selectedFile ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                        <span className="text-xs font-medium text-white max-w-[200px] truncate">{selectedFile.name}</span>
                        <span className="text-[10px] text-muted-foreground mt-1">Click to change file</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-zinc-500 mb-2" />
                        <span className="text-xs font-medium text-zinc-400">Select {uploadType === 'video' ? 'video' : 'photo'} file</span>
                        <span className="text-[10px] text-zinc-600 mt-1">Direct free upload, no cloud billing cost</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-900"></div>
                <span className="flex-shrink mx-4 text-zinc-600 text-[10px] font-bold uppercase">Or Paste Link</span>
                <div className="flex-grow border-t border-zinc-900"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Direct URL Link</label>
                <input type="url" placeholder="https://..." value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)}
                  disabled={uploadingFile || !!selectedFile}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 disabled:opacity-50" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-muted-foreground hover:bg-zinc-900 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={uploadingFile || (!selectedFile && !uploadUrl.trim())}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white transition-all bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50">
                  Share
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
};

export default EventDetailPage;
