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
  status?: string;
}) => {
  const search = new URLSearchParams();
  if (params?.category && params.category !== 'all') search.append('category', params.category);
  if (params?.location && params.location !== 'all') search.append('location', params.location);
  if (params?.status && params.status !== 'all') search.append('status', params.status);
  search.append('limit', String(params?.limit || 50));
  const response = await apiClient.get(`/events?${search}`);
  return response.data;
};

export const fetchEventMemories = async (id: string) => {
  const response = await apiClient.get(`/events/${id}/memories`);
  return response.data.data.memories;
};

export const addEventMemory = async (id: string, payload: { type: 'video' | 'photo'; url: string }) => {
  const response = await apiClient.post(`/events/${id}/memories`, payload);
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

export const fetchEventRegistrants = async (eventId: string) => {
  const response = await apiClient.get(`/events/${eventId}/registrants`);
  return response.data.data.registrants;
};

export const uploadTempFile = async (file: File): Promise<string> => {
  // 1. Attempt Direct Cloudinary Upload via Backend Signature (Bypasses Vercel limits completely)
  try {
    const sigResponse = await apiClient.get('/reels/upload-signature');
    if (sigResponse.data?.success) {
      const sigData = sigResponse.data;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', String(sigData.timestamp));
      formData.append('signature', sigData.signature);
      formData.append('folder', 'skillverse/memories');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        return result.secure_url;
      } else {
        console.warn('Cloudinary direct upload failed, trying fallback...', await res.text());
      }
    }
  } catch (err) {
    console.warn('Cloudinary config not available or failed:', err);
  }

  // 2. Fallback: Upload to our backend proxy (works on localhost, but has 4.5MB limit on Vercel)
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocal && file.size > 4.5 * 1024 * 1024) {
    throw new Error('Vercel hosting limits direct uploads to 4.5MB. Please configure CLOUDINARY credentials in your Vercel Dashboard env variables to allow large video/photo uploads.');
  }

  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/events/upload-temp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  if (response.data?.success && response.data.data?.url) {
    return response.data.data.url;
  }

  throw new Error('File upload failed. Ensure server is running or Cloudinary credentials are set.');
};
