# 🎯 Career Hub - Quick Integration Guide

## 5-Minute Setup

### What You Need
1. **RapidAPI Key** (FREE) - Get it here: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. **MongoDB running** (local or Atlas)
3. **Node.js 16+**

---

## Step-by-Step

### 1️⃣ Get RapidAPI Key
```
1. Go to: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. Sign up (FREE)
3. Copy your API Key
```

### 2️⃣ Update server/.env
```env
RAPIDAPI_KEY=paste_your_key_here
MONGODB_URI=mongodb://localhost:27017/skillverse
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3️⃣ Update src/.env
```env
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Install Dependencies
```bash
cd server
npm install
```

### 5️⃣ Start Backend
```bash
cd server
npm run dev
```

### 6️⃣ Start Frontend
```bash
npm run dev
```

### 7️⃣ Test It!
- Go to http://localhost:5173/career-hub
- Click "Refresh from API"
- ✨ See real jobs appear!

---

## 🏗️ Architecture

```
CareerHub UI (React)
       ↓
Backend API (Express)
       ↓
MongoDB Cache
       ↓
JSearch API (when needed)
```

---

## 📊 Database Schema (Job Model)

```javascript
{
  jobId: String (unique),
  title: String,
  company: String,
  location: String,
  city: String,
  country: String,
  type: String (Internship|Full-time|Part-time|Contract),
  duration: String,
  stipend: String,
  minSalary: Number,
  maxSalary: Number,
  description: String,
  skills: [String],
  benefits: [String],
  qualifications: [String],
  applyLink: String,
  postedDate: Date,
  remote: Boolean,
  apiSource: String (jsearch|manual),
  isActive: Boolean,
  lastUpdated: Date,
  createdAt: Date
}
```

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/jobs/all` | Get cached jobs |
| GET | `/api/jobs/:id` | Get job details |
| GET | `/api/jobs/stats` | Job statistics |
| POST | `/api/jobs/refresh` | Fetch from JSearch API |
| POST | `/api/jobs/search` | Advanced search |
| POST | `/api/jobs/add-manual` | Add job manually |
| POST | `/api/jobs/clear-old` | Delete old jobs |

---

## 💻 Frontend Integration

### Fetch Jobs
```javascript
const response = await fetch('http://localhost:5000/api/jobs/all?page=1&limit=12');
const { data } = await response.json();
```

### Refresh from API
```javascript
const response = await fetch('http://localhost:5000/api/jobs/refresh', {
  method: 'POST'
});
```

### Search Jobs
```javascript
const response = await fetch('http://localhost:5000/api/jobs/search', {
  method: 'POST',
  body: JSON.stringify({
    title: 'developer',
    location: 'San Francisco',
    skills: ['React']
  })
});
```

---

## 📁 Files Created/Modified

### New Files
- ✨ `server/models/Job.js` - Database schema
- ✨ `server/controllers/jobController.js` - Business logic
- ✨ `server/routes/jobs.js` - API routes
- ✨ `server/.env.example` - Environment template

### Modified Files
- 🔧 `server/server.js` - Added jobs route
- 🔧 `server/package.json` - Added axios dependency
- 🔧 `src/pages/CareerHub.tsx` - Now uses backend API

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Check if backend is running on port 5000 |
| "API key error" | Verify RAPIDAPI_KEY in server/.env |
| "No data returned" | First load takes 10-15s, wait longer |
| "Jobs not updating" | Click refresh button or check API quota |
| "CORS error" | Check CLIENT_URL in server/.env |

---

## 💡 Features Included

✅ Real-time job data from JSearch API
✅ MongoDB caching for speed
✅ Search by title, company, location
✅ Filter by type and location
✅ Pagination (show 6 per page)
✅ Skill-based search
✅ Remote job indicator
✅ Salary information
✅ Direct apply links
✅ Job statistics

---

## 🎓 How It Works

1. **User opens Career Hub**
   - Frontend requests jobs from backend
   
2. **Backend checks cache**
   - If data exists and < 30 days old → return it
   - If no data → fetch from JSearch API
   
3. **JSearch API call** (if needed)
   - Fetches 10+ real jobs
   - Saves to MongoDB
   - Returns to frontend
   
4. **Frontend displays**
   - Shows 6 jobs per page
   - User can search/filter
   - Click apply to go to real job posting

---

## 🔐 Security Notes

- API keys are stored server-side (safe)
- Frontend never touches RapidAPI key
- Rate limiting enabled (100 requests/15 min)
- MongoDB validates all data

---

## 📈 Scaling

To handle more users:
1. Add Redis cache layer
2. Implement job queue for API calls
3. Use CDN for faster delivery
4. Set up auto-scaling on backend

---

## 🚀 Next Features

- [ ] Save jobs (bookmark)
- [ ] Email alerts for new jobs
- [ ] Resume upload
- [ ] Interview prep
- [ ] Salary insights
- [ ] Company reviews

---

## 📞 Need Help?

See `CAREER_HUB_SETUP.md` for:
- Detailed troubleshooting
- API reference
- Customization guide
- Advanced features

---

## ✨ You're Ready!

1. Copy API key to server/.env
2. Run `npm install` in server folder
3. Run `npm run dev` in both frontend and backend
4. Visit http://localhost:5173/career-hub
5. Click refresh and see real jobs! 🎉

---

**Total Setup Time: 5 minutes ⏱️**
**Jobs Loading: 10-15 seconds (first time) ⚡**
**Subsequent Loads: <1 second 🚀**
