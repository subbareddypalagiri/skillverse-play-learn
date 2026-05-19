# Sync Registration System API

## Overview
Complete registration and management system for mentors and alumni experts. This allows users to:
1. Apply to become mentors
2. Apply to become alumni expert speakers
3. Create and manage their own talks (once approved)
4. Admin approval workflow for applications

## Registration Endpoints

### 📝 Apply as Mentor
```
POST /api/v1/sync/apply/mentor
Authorization: Bearer token required
```

**Request Body:**
```json
{
  "domain": "Web Development",
  "role": "Senior Software Engineer",
  "company": "Google",
  "yearsOfExperience": 5,
  "expertise": ["React", "Node.js", "System Design", "Career Guidance"],
  "bio": "Experienced full-stack developer with 5+ years building scalable web applications...",
  "intendedServices": [
    {
      "name": "1-on-1 Career Guidance",
      "description": "Personalized career advice and roadmap planning",
      "duration": 60,
      "price": 50,
      "category": "career"
    },
    {
      "name": "Technical Interview Prep",
      "description": "Mock interviews for FAANG companies",
      "duration": 90,
      "price": 75,
      "category": "technical"
    }
  ],
  "preferredTimeSlots": ["09:00-12:00", "14:00-17:00"],
  "languages": ["English", "Spanish"],
  "timezone": "America/New_York",
  "socialLinks": {
    "linkedIn": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "website": "https://johndoe.dev"
  },
  "motivation": "I want to help students transition into tech careers...",
  "portfolioItems": [
    {
      "title": "E-commerce Platform",
      "description": "Built a scalable e-commerce platform serving 1M+ users",
      "url": "https://github.com/johndoe/ecommerce",
      "image": "https://example.com/project1.png"
    }
  ],
  "references": [
    {
      "name": "Jane Smith",
      "role": "Engineering Manager at Google",
      "email": "jane.smith@google.com",
      "relationship": "Direct Manager"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mentor application submitted successfully",
  "data": {
    "_id": "60f7b...",
    "user": "60f7b...",
    "status": "pending",
    "submittedAt": "2023-07-20T10:00:00Z"
  }
}
```

### 📖 Get My Mentor Application
```
GET /api/v1/sync/apply/mentor/my-application
Authorization: Bearer token required
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b...",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "domain": "Web Development",
    "status": "approved",
    "submittedAt": "2023-07-20T10:00:00Z",
    "reviewedAt": "2023-07-21T15:30:00Z",
    "reviewedBy": {
      "name": "Admin User"
    },
    "reviewNotes": "Excellent experience and portfolio. Approved!"
  }
}
```

### 🎓 Apply as Alumni Expert
```
POST /api/v1/sync/apply/alumni-expert
Authorization: Bearer token required
```

**Request Body:**
```json
{
  "domain": "Artificial Intelligence",
  "currentRole": "Senior AI Research Scientist",
  "currentCompany": "OpenAI",
  "yearsOfExperience": 8,
  "expertise": ["Machine Learning", "NLP", "Computer Vision", "Research"],
  "bio": "AI researcher with 8+ years developing state-of-the-art ML models...",
  "previousSpeakingExperience": "Keynote at NeurIPS 2022, 15+ conference talks, university guest lectures",
  "proposedTopics": [
    {
      "title": "The Future of Large Language Models",
      "description": "Exploring the capabilities and limitations of modern LLMs",
      "estimatedDuration": 45,
      "targetAudience": "intermediate"
    },
    {
      "title": "Breaking into AI Research",
      "description": "Career paths and skills needed for AI research roles",
      "estimatedDuration": 60,
      "targetAudience": "beginner"
    }
  ],
  "socialLinks": {
    "linkedIn": "https://linkedin.com/in/airesearcher",
    "twitter": "https://twitter.com/airesearcher",
    "website": "https://airesearcher.com"
  },
  "portfolioItems": [
    {
      "title": "GPT-4 Architecture Paper",
      "description": "Co-authored the seminal paper on GPT-4 architecture",
      "url": "https://arxiv.org/abs/example",
      "type": "research"
    }
  ],
  "motivation": "I want to inspire the next generation of AI researchers...",
  "availabilityCommitment": "2-3 talks per month",
  "preferredFormats": ["virtual", "hybrid"],
  "references": [
    {
      "name": "Dr. Sarah Connor",
      "role": "Research Director at OpenAI",
      "email": "sarah@openai.com",
      "relationship": "Direct Supervisor"
    }
  ]
}
```

### 📚 Create Alumni Talk (Approved Experts Only)
```
POST /api/v1/sync/expert/create-talk
Authorization: Bearer token required (must be approved alumni expert)
```

**Request Body:**
```json
{
  "topic": "The Future of Large Language Models",
  "description": "An in-depth exploration of where LLMs are heading and what challenges lie ahead...",
  "scheduledAt": "2023-08-15T14:00:00Z",
  "duration": 90,
  "maxAttendees": 500,
  "tags": ["AI", "Machine Learning", "LLM", "Future Tech"],
  "meetingLink": "https://zoom.us/j/123456789"
}
```

### 📊 Get My Alumni Talks
```
GET /api/v1/sync/expert/my-talks
Authorization: Bearer token required
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60f7b...",
      "topic": "The Future of Large Language Models",
      "speaker": {
        "name": "Dr. AI Researcher",
        "role": "Senior AI Research Scientist",
        "company": "OpenAI"
      },
      "scheduledAt": "2023-08-15T14:00:00Z",
      "status": "upcoming",
      "registrations": [...],
      "attendeeCount": 234
    }
  ]
}
```

## Admin Endpoints

### 👥 Get All Mentor Applications (Admin)
```
GET /api/v1/sync/admin/mentor-applications
Authorization: Bearer admin-token
Query Parameters:
- status: pending|approved|rejected|under_review
- domain: filter by domain
- page: pagination (default: 1)
- limit: items per page (default: 10)
```

### ✅ Review Mentor Application (Admin)
```
PUT /api/v1/sync/admin/mentor-applications/:id/review
Authorization: Bearer admin-token
```

**Request Body:**
```json
{
  "action": "approve", // or "reject"
  "reviewNotes": "Excellent background and portfolio. Ready to be a mentor!",
  "rejectionReason": null // required if action is "reject"
}
```

**Response (Approve):**
```json
{
  "success": true,
  "message": "Mentor application approved successfully",
  "data": {
    "status": "approved",
    "mentorProfile": {
      "_id": "60f7b...",
      "user": "60f7b...",
      "name": "John Doe",
      "domain": "Web Development",
      "services": [...],
      "isActive": true
    }
  }
}
```

## Application Status Flow

### Mentor Application Lifecycle
1. **pending** → User submits application
2. **under_review** → Admin is reviewing (optional status)
3. **approved** → Application approved, Mentor profile created
4. **rejected** → Application rejected with reason

### Alumni Expert Application Lifecycle
1. **pending** → User submits application
2. **under_review** → Admin is reviewing (optional status)
3. **approved** → Application approved, can create talks
4. **rejected** → Application rejected with reason

## Features Implemented

### ✅ For Users:
- Apply to become mentor with detailed profile
- Apply to become alumni expert speaker
- Track application status
- Create and manage talks (once approved as expert)
- Professional portfolio and reference system

### ✅ For Admins:
- Review mentor applications with approval/rejection
- Review alumni expert applications
- Bulk application management with filtering
- Automatic mentor profile creation on approval
- Detailed application analytics

### ✅ System Features:
- Duplicate application prevention
- Reference validation system
- Portfolio item management
- Service pricing and scheduling
- Multi-language and timezone support
- Professional social media integration

## Error Handling

### Common Error Responses:
```json
{
  "success": false,
  "message": "You already have a pending mentor application"
}
```

```json
{
  "success": false,
  "message": "You must be an approved alumni expert to create talks"
}
```

## Next Steps for Frontend Integration

1. **Registration Forms**: Create multi-step forms for mentor/expert applications
2. **Dashboard**: Build user dashboard to track application status
3. **Admin Panel**: Create admin interface for reviewing applications
4. **Talk Creation**: Build interface for approved experts to create talks
5. **Notifications**: Add email/in-app notifications for status updates

This registration system transforms your Sync feature from a static showcase into a dynamic platform where real users can register as mentors and experts, creating authentic community-driven content!