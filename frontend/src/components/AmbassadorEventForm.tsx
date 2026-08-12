import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createEvent, updateEvent, isTourCategory } from '@/lib/eventsApi';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Bus, MapPin, Utensils, User, CheckCircle, Train, Car } from 'lucide-react';

interface AmbassadorEventFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: any; // Added optional eventToEdit prop for editing events
}

const emptyTour = {
  destinations: [{ name: '', description: '', arrivalTime: '' }],
  food: { meals: '', snacks: '', dietaryOptions: '' },
  planner: { name: '', organization: '', contact: '' },
  bus: { transportType: 'bus', busNumber: '', pickupPoint: '', departureTime: '', returnTime: '', driverName: '', driverContact: '', capacity: 0 },
  itinerary: '',
  thingsToCarry: ['']
};

export default function AmbassadorEventForm({ open, onClose, onSuccess, eventToEdit }: AmbassadorEventFormProps) {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technical',
    customCategory: '',
    campusLocation: 'In Campus',
    mode: 'offline',
    eventLink: '',
    eventType: 'workshop',
    date: '',
    time: '',
    venue: '',
    duration: '',
    capacity: '100',
    collegeName: user?.collegeName || '',
    tourDetails: emptyTour
  });

  useEffect(() => {
    if (eventToEdit) {
      const eventDate = eventToEdit.startDate ? new Date(eventToEdit.startDate) : null;
      // Format to YYYY-MM-DD local time format
      const formattedDate = eventDate ? new Date(eventDate.getTime() - (eventDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
      const formattedTime = eventDate ? eventDate.toTimeString().split(' ')[0].slice(0, 5) : '';

      setForm({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || 'technical',
        customCategory: '',
        campusLocation: eventToEdit.campusLocation || 'In Campus',
        mode: eventToEdit.mode || 'offline',
        eventLink: eventToEdit.eventLink || '',
        eventType: eventToEdit.eventType || 'workshop',
        date: formattedDate,
        time: formattedTime,
        venue: eventToEdit.venue || '',
        duration: eventToEdit.duration || '',
        capacity: String(eventToEdit.capacity || 100),
        collegeName: eventToEdit.collegeName || user?.collegeName || '',
        tourDetails: eventToEdit.tourDetails ? {
          destinations: eventToEdit.tourDetails.destinations?.length > 0 
            ? eventToEdit.tourDetails.destinations 
            : [{ name: '', description: '', arrivalTime: '' }],
          food: eventToEdit.tourDetails.food || { meals: '', snacks: '', dietaryOptions: '' },
          planner: eventToEdit.tourDetails.planner || { name: '', organization: '', contact: '' },
          bus: eventToEdit.tourDetails.bus ? {
            transportType: eventToEdit.tourDetails.bus.transportType || 'bus',
            busNumber: eventToEdit.tourDetails.bus.busNumber || '',
            pickupPoint: eventToEdit.tourDetails.bus.pickupPoint || '',
            departureTime: eventToEdit.tourDetails.bus.departureTime || '',
            returnTime: eventToEdit.tourDetails.bus.returnTime || '',
            driverName: eventToEdit.tourDetails.bus.driverName || '',
            driverContact: eventToEdit.tourDetails.bus.driverContact || '',
            capacity: eventToEdit.tourDetails.bus.capacity || 0
          } : { transportType: 'bus', busNumber: '', pickupPoint: '', departureTime: '', returnTime: '', driverName: '', driverContact: '', capacity: 0 },
          itinerary: eventToEdit.tourDetails.itinerary || '',
          thingsToCarry: eventToEdit.tourDetails.thingsToCarry || ['']
        } : emptyTour
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: 'technical',
        customCategory: '',
        campusLocation: 'In Campus',
        mode: 'offline',
        eventLink: '',
        eventType: 'workshop',
        date: '',
        time: '',
        venue: '',
        duration: '',
        capacity: '100',
        collegeName: user?.collegeName || '',
        tourDetails: emptyTour
      });
    }
  }, [eventToEdit, open, user]);

  const showTourFields = isTourCategory(form.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const startDate = new Date(`${form.date}T${form.time}`);
      const finalCategory = form.category === 'custom' ? form.customCategory : form.category;
      const payload: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        category: finalCategory,
        campusLocation: form.campusLocation,
        mode: form.mode,
        eventType: showTourFields ? 'tour' : form.eventType,
        type: finalCategory.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        venue: form.venue,
        duration: form.duration,
        displayDate: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        displayTime: form.time,
        location: form.venue,
        isOnline: form.mode === 'online',
        eventLink: form.eventLink || undefined,
        startDate,
        endDate: new Date(startDate.getTime() + 3 * 60 * 60 * 1000),
        capacity: parseInt(form.capacity),
        collegeName: form.collegeName,
        visibility: 'public'
      };

      if (showTourFields) {
        payload.tourDetails = {
          ...form.tourDetails,
          destinations: form.tourDetails.destinations.filter(d => d.name.trim()),
          thingsToCarry: form.tourDetails.thingsToCarry.filter(t => t.trim()),
          bus: { ...form.tourDetails.bus, capacity: parseInt(String(form.tourDetails.bus.capacity)) || parseInt(form.capacity) }
        };
      }

      if (eventToEdit) {
        await updateEvent(eventToEdit._id, payload);
      } else {
        await createEvent(payload);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
        if (!eventToEdit) {
          setForm({ ...form, title: '', description: '', date: '', time: '', venue: '', duration: '', tourDetails: emptyTour });
        }
      }, 1800);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit event');
    } finally {
      setCreating(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm transition-all";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl rounded-2xl border border-border/60 max-h-[90vh] overflow-y-auto"
        style={{ background: 'hsl(230,25%,7%)' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            <Plus className="w-5 h-5 text-primary" />
            {success ? 'Event Saved!' : eventToEdit ? 'Edit Event Details' : 'Plan a New Event'}
          </DialogTitle>
          <p className="text-xs text-zinc-400">Campus Ambassador Portal — {form.collegeName || 'Your College'}</p>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-10">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="text-sm text-zinc-400">Students can now discover and join your event</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Event Title *</label>
                <input className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Ooty Fun Tour" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Description *</label>
                <textarea className={`${inputClass} resize-none`} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Category *</label>
                <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="cultural" className="bg-zinc-900">Cultural</option>
                  <option value="technical" className="bg-zinc-900">Technical</option>
                  <option value="non-technical" className="bg-zinc-900">Non-Technical</option>
                  <option value="fun-tours" className="bg-zinc-900">Fun Tours</option>
                  <option value="industrial-tours" className="bg-zinc-900">Industrial Tours</option>
                  <option value="hackathons" className="bg-zinc-900">Hackathons</option>
                  <option value="custom" className="bg-zinc-900">Custom (Type your own)</option>
                </select>
              </div>
              {form.category === 'custom' && (
                <div>
                  <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Custom Category *</label>
                  <input className={inputClass} value={form.customCategory} onChange={e => setForm({ ...form, customCategory: e.target.value })} required placeholder="e.g., Art & Design" />
                </div>
              )}
              <div className={form.category === 'custom' ? "col-span-2" : ""}>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Campus Location *</label>
                <select className={inputClass} value={form.campusLocation} onChange={e => setForm({ ...form, campusLocation: e.target.value })}>
                  <option value="In Campus" className="bg-zinc-900">In Campus</option>
                  <option value="Out of Campus" className="bg-zinc-900">Out of Campus</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Event Mode *</label>
                <select className={inputClass} value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                  <option value="offline" className="bg-zinc-900">Offline / In-person</option>
                  <option value="online" className="bg-zinc-900">Online / Virtual</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Event / Registration Link</label>
                <input type="url" className={inputClass} value={form.eventLink} onChange={e => setForm({ ...form, eventLink: e.target.value })} placeholder={form.mode === 'online' ? "Meeting URL (e.g., Zoom/Meet)" : "Registration URL (Optional)"} required={form.mode === 'online'} />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Event Type *</label>
                <select className={inputClass} value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
                  <option value="workshop" className="bg-zinc-900">Workshop</option>
                  <option value="webinar" className="bg-zinc-900">Webinar</option>
                  <option value="hackathon" className="bg-zinc-900">Hackathon</option>
                  <option value="meetup" className="bg-zinc-900">Meetup</option>
                  <option value="conference" className="bg-zinc-900">Conference</option>
                  <option value="seminar" className="bg-zinc-900">Seminar</option>
                  <option value="cultural" className="bg-zinc-900">Cultural</option>
                  <option value="competition" className="bg-zinc-900">Competition</option>
                  <option value="tour" className="bg-zinc-900">Tour</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Date *</label>
                <input type="date" className={inputClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Time *</label>
                <input type="time" className={inputClass} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Venue *</label>
                <input className={inputClass} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Duration *</label>
                <input className={inputClass} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required placeholder="e.g., 2 days" />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Capacity *</label>
                <input type="number" className={inputClass} value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">College Name</label>
                <input className={inputClass} value={form.collegeName} onChange={e => setForm({ ...form, collegeName: e.target.value })} placeholder="Your college name" />
              </div>
            </div>

            {showTourFields && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Tour Journey Details
                </h4>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Destinations</label>
                  {form.tourDetails.destinations.map((dest, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                      <input className={inputClass} placeholder="Place name" value={dest.name} onChange={e => {
                        const d = [...form.tourDetails.destinations];
                        d[i] = { ...d[i], name: e.target.value };
                        setForm({ ...form, tourDetails: { ...form.tourDetails, destinations: d } });
                      }} />
                      <input className={inputClass} placeholder="Description" value={dest.description} onChange={e => {
                        const d = [...form.tourDetails.destinations];
                        d[i] = { ...d[i], description: e.target.value };
                        setForm({ ...form, tourDetails: { ...form.tourDetails, destinations: d } });
                      }} />
                      <input className={inputClass} placeholder="Arrival time" value={dest.arrivalTime} onChange={e => {
                        const d = [...form.tourDetails.destinations];
                        d[i] = { ...d[i], arrivalTime: e.target.value };
                        setForm({ ...form, tourDetails: { ...form.tourDetails, destinations: d } });
                      }} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, tourDetails: { ...form.tourDetails, destinations: [...form.tourDetails.destinations, { name: '', description: '', arrivalTime: '' }] } })}
                    className="text-xs text-primary hover:underline">+ Add destination</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1"><Utensils className="w-3 h-3" /> Meals</label>
                    <input className={inputClass} value={form.tourDetails.food.meals} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, food: { ...form.tourDetails.food, meals: e.target.value } } })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Snacks</label>
                    <input className={inputClass} value={form.tourDetails.food.snacks} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, food: { ...form.tourDetails.food, snacks: e.target.value } } })} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1"><User className="w-3 h-3" /> Planner Name</label>
                    <input className={inputClass} value={form.tourDetails.planner.name} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, planner: { ...form.tourDetails.planner, name: e.target.value } } })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Organization</label>
                    <input className={inputClass} value={form.tourDetails.planner.organization} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, planner: { ...form.tourDetails.planner, organization: e.target.value } } })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Contact</label>
                    <input className={inputClass} value={form.tourDetails.planner.contact} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, planner: { ...form.tourDetails.planner, contact: e.target.value } } })} />
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      {form.tourDetails.bus.transportType === 'train' ? <Train className="w-3.5 h-3.5 text-sky-400" /> : form.tourDetails.bus.transportType === 'auto' ? <Car className="w-3.5 h-3.5 text-yellow-400" /> : <Bus className="w-3.5 h-3.5 text-blue-400" />}
                      Transport Details
                    </label>
                    <select 
                      value={form.tourDetails.bus.transportType} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, transportType: e.target.value } } })}
                      className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
                    >
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="auto">Auto / Cab</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input className={inputClass} 
                      placeholder={form.tourDetails.bus.transportType === 'train' ? "Train Number / Name" : form.tourDetails.bus.transportType === 'auto' ? "Auto / Cab Number" : "Bus number"} 
                      value={form.tourDetails.bus.busNumber} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, busNumber: e.target.value } } })} 
                    />
                    <input className={inputClass} 
                      placeholder={form.tourDetails.bus.transportType === 'train' ? "Station / Platform" : "Pickup point"} 
                      value={form.tourDetails.bus.pickupPoint} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, pickupPoint: e.target.value } } })} 
                    />
                    <input className={inputClass} 
                      placeholder="Departure time" 
                      value={form.tourDetails.bus.departureTime} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, departureTime: e.target.value } } })} 
                    />
                    <input className={inputClass} 
                      placeholder={form.tourDetails.bus.transportType === 'train' ? "Arrival time" : "Return time"} 
                      value={form.tourDetails.bus.returnTime} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, returnTime: e.target.value } } })} 
                    />
                    <input className={inputClass} 
                      placeholder={form.tourDetails.bus.transportType === 'train' ? "Coach / Seat Info" : "Driver name"} 
                      value={form.tourDetails.bus.driverName} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, driverName: e.target.value } } })} 
                    />
                    <input className={inputClass} 
                      placeholder={form.tourDetails.bus.transportType === 'train' ? "PNR / Ticket Info" : "Driver contact"} 
                      value={form.tourDetails.bus.driverContact} 
                      onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, bus: { ...form.tourDetails.bus, driverContact: e.target.value } } })} 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Itinerary</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} value={form.tourDetails.itinerary} onChange={e => setForm({ ...form, tourDetails: { ...form.tourDetails, itinerary: e.target.value } })} />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} disabled={creating} className="flex-1 py-2.5 rounded-lg text-sm border border-border/50 text-muted-foreground">Cancel</button>
              <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                {creating ? (eventToEdit ? 'Saving...' : 'Publishing...') : (eventToEdit ? 'Save Changes' : 'Publish Event')}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
