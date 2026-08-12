import apiClient from '@/lib/apiClient';

export interface TourDetails {
  destinations?: { name: string; description?: string; arrivalTime?: string }[];
  food?: { meals?: string; snacks?: string; dietaryOptions?: string };
  planner?: { name?: string; organization?: string; contact?: string };
  bus?: {
    busNumber?: string;
    pickupPoint?: string;
    departureTime?: string;
    returnTime?: string;
    driverName?: string;
    driverContact?: string;
    capacity?: number;
  };
  itinerary?: string;
  thingsToCarry?: string[];
}

export interface EventItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  campusLocation?: string;
  location: string;
  mode: string;
  type: string;
  venue: string;
  duration: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  capacity?: number;
  registeredCount?: number;
  collegeName?: string;
  tourDetails?: TourDetails;
  isTour?: boolean;
  isRegistered?: boolean;
  organizer?: { name: string; collegeName?: string };
  startDate: string;
  endDate: string;
}

export const fetchEvents = async (params?: {
  category?: string;
  location?: string;
  limit?: number;
}) => {
  const search = new URLSearchParams();
  if (params?.category && params.category !== 'all') search.append('category', params.category);
  if (params?.location && params.location !== 'all') search.append('location', params.location);
  search.append('limit', String(params?.limit || 50));
  const response = await apiClient.get(`/events?${search}`);
  return response.data;
};

export const fetchEventById = async (id: string) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data.data.event as EventItem;
};

export const registerForEvent = async (id: string) => {
  const response = await apiClient.post(`/events/${id}/register`);
  return response.data;
};

export const createEvent = async (payload: Record<string, unknown>) => {
  const response = await apiClient.post('/events', payload);
  return response.data;
};

export const fetchMyRegistrations = async () => {
  const response = await apiClient.get('/events/my-registrations');
  return response.data.data.registrations as EventItem[];
};

export const updateEvent = async (id: string, payload: Record<string, unknown>) => {
  const response = await apiClient.patch(`/events/${id}`, payload);
  return response.data;
};

export const cancelEvent = async (id: string) => {
  const response = await apiClient.patch(`/events/${id}`, { isCancelled: true });
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};

export const isTourCategory = (category: string) =>
  category === 'fun-tours' || category === 'industrial-tours';

export const fetchEventMessages = async (eventId: string) => {
  const response = await apiClient.get(`/events/${eventId}/messages`);
  return response.data.data.messages;
};

export const sendEventMessage = async (eventId: string, text: string) => {
  const response = await apiClient.post(`/events/${eventId}/messages`, { text });
  return response.data.data.message;
};
