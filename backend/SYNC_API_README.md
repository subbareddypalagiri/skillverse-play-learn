# Sync Feature - Backend API Integration

## Overview

The **Sync** feature connects students with alumni experts and mentors. It includes:
- **Alumni Expert Talks**: Live sessions with industry professionals
- **Mentor Connect**: 1:1 mentorship sessions with experienced professionals

## 🚀 Quick Start

### 1. Seed the Database

```bash
cd backend
node seeds/seedSyncData.js
```

This will populate your database with:
- 6 sample alumni talks across different domains
- 6 mentors with various expertise

### 2. Start the Server

```bash
npm run dev
```

The Sync API will be available at: `http://localhost:5000/api/v1/sync`

## 📋 API Endpoints

### Domains

#### Get All Domains
```
GET /api/v1/sync/domains
```
Returns list of all available domains (AI, Web, Mobile, Cloud, Data, Design)

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "ai", "name": "AI & Machine Learning", "icon": "🤖" },
    ...
  ]
}
```

---

### Alumni Talks

#### Get All Alumni Talks
```
GET /api/v1/sync/alumni-talks
```

**Query Parameters:**
- `domain` - Filter by domain (ai, web, mobile, cloud, data, design)
- `status` - Filter by status (upcoming, live, completed, cancelled)
- `upcoming` - Get only upcoming talks (true/false)
- `search` - Search in topic, description, speaker name

**Example:**
```
GET /api/v1/sync/alumni-talks?domain=ai&upcoming=true
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "domain": "ai",
      "speaker": {
        "name": "Priya Nair",
        "role": "Senior ML Engineer",
        "company": "OpenAI",
        "avatar": "...",
        "bio": "...",
        "linkedIn": "..."
      },
      "topic": "Practical LLM Finetuning in Production",
      "description": "...",
      "scheduledAt": "2024-04-15T17:00:00.000Z",
      "duration": 90,
      "attendeeCount": 128,
      "maxAttendees": 500,
      "tags": ["AI", "LLM", "Machine Learning"],
      "status": "upcoming",
      "meetingLink": "..."
    }
  ]
}
```

#### Get Single Alumni Talk
```
GET /api/v1/sync/alumni-talks/:id
```

#### Register for a Talk (Protected)
```
POST /api/v1/sync/alumni-talks/:id/register
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for the talk",
  "data": { ... }
}
```

#### Ask a Question (Protected)
```
POST /api/v1/sync/alumni-talks/:id/questions
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "question": "What are the best practices for prompt engineering?"
}
```

---

### Mentors

#### Get All Mentors
```
GET /api/v1/sync/mentors
```

**Query Parameters:**
- `domain` - Filter by domain
- `expertise` - Filter by expertise (e.g., "React", "Python")
- `minRating` - Filter by minimum rating (e.g., 4.5)
- `sortBy` - Sort by "rating" or "sessions"

**Example:**
```
GET /api/v1/sync/mentors?domain=web&minRating=4.5&sortBy=rating
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "user": {
        "name": "Rohan Das",
        "email": "...",
        "avatar": "..."
      },
      "domain": "ai",
      "role": "ML Mentor",
      "company": "Google AI",
      "expertise": ["Machine Learning", "Deep Learning", "PyTorch"],
      "bio": "...",
      "yearsOfExperience": 8,
      "services": [
        {
          "type": "Mock Interview",
          "duration": 60,
          "price": 50
        },
        {
          "type": "Resume Review",
          "duration": 30,
          "price": 25
        }
      ],
      "rating": {
        "average": 4.9,
        "count": 320
      },
      "totalSessions": 320,
      "languages": ["English", "Hindi"],
      "socialLinks": { ... }
    }
  ]
}
```

#### Get Single Mentor
```
GET /api/v1/sync/mentors/:id
```

#### Book a Session (Protected)
```
POST /api/v1/sync/mentors/:id/book
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "service": "Mock Interview",
  "scheduledAt": "2024-04-20T15:00:00.000Z",
  "duration": 60,
  "notes": "Preparing for Google interview, focus on system design"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session booked successfully",
  "data": {
    "mentee": "...",
    "service": "Mock Interview",
    "scheduledAt": "2024-04-20T15:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "meetingLink": "https://meet.example.com/..."
  }
}
```

#### Rate a Session (Protected)
```
PUT /api/v1/sync/mentors/:mentorId/sessions/:sessionId/rate
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 5,
  "feedback": "Excellent session! Very helpful with system design patterns."
}
```

---

## 📊 Data Models

### AlumniTalk Model
```javascript
{
  domain: String (enum),
  speaker: {
    name: String,
    role: String,
    company: String,
    avatar: String,
    bio: String,
    linkedIn: String,
    twitter: String
  },
  topic: String,
  description: String,
  scheduledAt: Date,
  duration: Number (minutes),
  meetingLink: String,
  registrations: [{ user, registeredAt }],
  maxAttendees: Number,
  tags: [String],
  status: String (enum),
  questions: [{ user, question, answer, askedAt, answeredAt }],
  likes: [ObjectId]
}
```

### Mentor Model
```javascript
{
  user: ObjectId (ref: User),
  domain: String (enum),
  role: String,
  company: String,
  expertise: [String],
  bio: String,
  yearsOfExperience: Number,
  services: [{
    type: String (enum),
    duration: Number,
    price: Number
  }],
  availability: [{
    day: String,
    slots: [{ startTime, endTime, isBooked }]
  }],
  sessions: [{
    mentee: ObjectId,
    service: String,
    scheduledAt: Date,
    duration: Number,
    status: String,
    rating: Number,
    feedback: String,
    meetingLink: String
  }],
  rating: { average, count },
  totalSessions: Number,
  languages: [String],
  socialLinks: { linkedIn, github, twitter, portfolio }
}
```

---

## 🎨 Frontend Integration

Update your Sync.tsx to fetch real data:

```typescript
// Create lib/syncApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const fetchDomains = async () => {
  const { data } = await axios.get(`${API_URL}/sync/domains`);
  return data.data;
};

export const fetchAlumniTalks = async (domain?: string) => {
  const params = new URLSearchParams();
  if (domain) params.append('domain', domain);
  params.append('upcoming', 'true');
  
  const { data } = await axios.get(`${API_URL}/sync/alumni-talks?${params}`);
  return data.data;
};

export const fetchMentors = async (domain?: string) => {
  const params = new URLSearchParams();
  if (domain) params.append('domain', domain);
  params.append('sortBy', 'rating');
  
  const { data } = await axios.get(`${API_URL}/sync/mentors?${params}`);
  return data.data;
};

export const registerForTalk = async (talkId: string, token: string) => {
  const { data } = await axios.post(
    `${API_URL}/sync/alumni-talks/${talkId}/register`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const bookMentorSession = async (
  mentorId: string,
  sessionData: any,
  token: string
) => {
  const { data } = await axios.post(
    `${API_URL}/sync/mentors/${mentorId}/book`,
    sessionData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
```

Then update Sync.tsx:

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchAlumniTalks, fetchMentors } from '@/lib/syncApi';

const Sync = () => {
  const [domain, setDomain] = useState('ai');
  
  const { data: talks, isLoading: talksLoading } = useQuery({
    queryKey: ['alumni-talks', domain],
    queryFn: () => fetchAlumniTalks(domain)
  });
  
  const { data: mentors, isLoading: mentorsLoading } = useQuery({
    queryKey: ['mentors', domain],
    queryFn: () => fetchMentors(domain)
  });
  
  // Rest of your component...
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Get all upcoming AI talks
curl http://localhost:5000/api/v1/sync/alumni-talks?domain=ai&upcoming=true

# Get all mentors sorted by rating
curl http://localhost:5000/api/v1/sync/mentors?sortBy=rating

# Register for a talk (requires authentication)
curl -X POST http://localhost:5000/api/v1/sync/alumni-talks/<TALK_ID>/register \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Using Postman

1. Import the collection from `/docs/postman/sync-api.json`
2. Set environment variable `base_url` to `http://localhost:5000/api/v1`
3. Set `auth_token` after logging in

---

## 🔐 Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get a token by logging in through `/api/v1/auth/login`

---

## 🌟 Features to Add

### Next Steps:
1. **Notifications**: Send email/SMS when registered for talk
2. **Calendar Integration**: Add to Google Calendar
3. **Payment Integration**: For paid mentor sessions
4. **Video Integration**: Zoom/Meet API integration
5. **Analytics Dashboard**: Track engagement metrics
6. **Recommendations**: AI-powered mentor/talk recommendations
7. **Chat Feature**: Direct messaging with mentors
8. **Reviews System**: Public reviews for mentors

---

## 📝 Notes

- All times are stored in UTC in the database
- Frontend should convert to user's timezone
- Mentor availability can be managed through a separate admin panel
- Session recordings can be stored in cloud storage (S3, etc.)

---

## 🐛 Troubleshooting

### Common Issues:

1. **"Mentor not found"**: Ensure you've run the seed script
2. **"Not authorized"**: Check if JWT token is valid and not expired
3. **"Talk is fully booked"**: Check maxAttendees limit
4. **"Service not offered"**: Verify the service type matches mentor's services

---

## 📧 Support

For issues or questions, please contact the development team or create an issue in the repository.
