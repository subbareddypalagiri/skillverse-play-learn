# 🚀 Skillverse Deployment Guide — Vercel (Frontend) + Render (Backend)

A step-by-step guide to deploy the Skillverse project.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Project pushed to **GitHub**
- [ ] **MongoDB Atlas** account with a free cluster
- [ ] **Vercel** account — https://vercel.com (free)
- [ ] **Render** account — https://render.com (free)

---

## 🗄️ Step 1: MongoDB Atlas Setup (Database)

> Skip this step if you already have a MongoDB Atlas connection string.

1. Go to https://mongodb.com/cloud/atlas and sign up (free)
2. Click **"Build a Database"** → Choose **Free (M0 Sandbox)**
3. Select a cloud provider and region → Click **"Create"**
4. Create a **Database User**:
   - Username: `skillverse_user`
   - Password: (generate a strong password — save it!)
5. Under **Network Access** → Add IP Address → `0.0.0.0/0` (allow all — fine for now)
6. Click **Connect** → **Compass** → Copy the connection string:
   ```
   mongodb+srv://skillverse_user:<password>@cluster0.xxxxx.mongodb.net/skillverse?retryWrites=true&w=majority
   ```
   > Replace `<password>` with your actual password!

---

## ⚙️ Step 2: Backend Deployment on Render

### 2a. Connect GitHub to Render

1. Go to https://render.com and sign up / log in
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub account** and select your repository
4. Set the following settings:

   | Field | Value |
   |---|---|
   | **Name** | `skillverse-backend` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | **Free** |

5. Click **"Advanced"** to add environment variables (next step)

### 2b. Add Environment Variables in Render Dashboard

Click **"Add Environment Variable"** and add each of these:

#### 🔴 Required (Must Set)
| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://skillverse_user:<password>@cluster0.xxxxx.mongodb.net/skillverse?retryWrites=true&w=majority` |
| `JWT_SECRET` | (click "Generate" button in Render — or paste a 64-char random string) |
| `JWT_REFRESH_SECRET` | (click "Generate" button in Render — or paste a 64-char random string) |
| `CORS_ORIGINS` | `https://your-app.vercel.app` ← **Update AFTER Vercel deploy in Step 4** |

#### 🟡 Optional (Only if you use these features)
| Key | Value |
|---|---|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | your Gmail App Password |
| `EMAIL_FROM` | `noreply@skillverse.com` |
| `JSEARCH_API_KEY` | Your RapidAPI key |
| `GITHUB_API_TOKEN` | Your GitHub token |
| `AWS_ACCESS_KEY_ID` | Your AWS key (only if using S3 uploads) |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret |
| `AWS_S3_BUCKET` | Your S3 bucket name |
| `AWS_REGION` | `us-east-1` |

### 2c. Deploy the Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (takes ~2-3 minutes)
3. Once deployed, copy your backend URL:
   ```
   https://skillverse-backend.onrender.com
   ```
   > ⚠️ **Note:** On the free tier, your backend will sleep after 15 minutes of inactivity. The first request after sleep takes ~50 seconds to wake up. This is normal!

### 2d. Test the Backend

Open this in your browser — it should return a JSON response:
```
https://skillverse-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "environment": "production",
  "uptime": 12.34
}
```

---

## 🌐 Step 3: Frontend Deployment on Vercel

### 3a. Import Project into Vercel

1. Go to https://vercel.com and sign up / log in
2. Click **"Add New..."** → **"Project"**
3. Import your **GitHub repository**
4. Configure the project settings:

   | Field | Value |
   |---|---|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` (auto-detected) |
   | **Output Directory** | `dist` (auto-detected) |

### 3b. Add Environment Variables in Vercel Dashboard

Under **"Environment Variables"**, add:

#### 🔴 Required (Must Set)
| Key | Value |
|---|---|
| `VITE_API_URL` | `https://skillverse-backend.onrender.com` ← Your Render URL from Step 2c |

#### 🟡 Optional (Only if you use these features)
| Key | Value |
|---|---|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |
| `VITE_RAPIDAPI_KEY` | Your RapidAPI key (for job listings) |
| `VITE_TICKETMASTER_API_KEY` | Your Ticketmaster API key (for events) |
| `VITE_SUPABASE_URL` | Your Supabase URL (if using Supabase) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key |

### 3c. Deploy

1. Click **"Deploy"**
2. Wait ~2-3 minutes for the build
3. Your frontend will be live at:
   ```
   https://your-app-name.vercel.app
   ```

---

## 🔗 Step 4: Connect Frontend ↔ Backend (CORS Fix)

After both are deployed, you need to tell the backend to allow requests from your Vercel URL.

1. Go to your **Render Dashboard** → `skillverse-backend`
2. Click **"Environment"** tab
3. Update the `CORS_ORIGINS` variable:
   ```
   https://your-app-name.vercel.app
   ```
4. Click **"Save Changes"** → Render will automatically redeploy

---

## ✅ Step 5: Final Verification

Test your full deployment:

1. **Frontend loads:** Visit `https://your-app-name.vercel.app`
2. **Backend health:** Visit `https://skillverse-backend.onrender.com/health`
3. **Sign up / Log in:** Test user authentication
4. **Check browser console:** No CORS errors

---

## 🐛 Troubleshooting

### CORS Error in browser console
- Make sure `CORS_ORIGINS` in Render matches your exact Vercel URL (no trailing slash)
- Example: `https://skillverse-abc123.vercel.app` ✅
- Example: `https://skillverse-abc123.vercel.app/` ❌ (trailing slash)

### Backend returns 503 or times out
- The backend might be sleeping (cold start takes ~50 seconds on Render free tier)
- Wait 60 seconds and try again
- Check Render logs: Render Dashboard → Your Service → **Logs** tab

### Frontend shows blank page
- Check Vercel build logs for errors
- Make sure `VITE_API_URL` is set correctly (no trailing slash)
- Open browser DevTools → Console tab to see JavaScript errors

### MongoDB connection fails
- Verify your `MONGODB_URI` in Render environment variables
- Make sure you whitelisted `0.0.0.0/0` in MongoDB Atlas Network Access
- Check that you replaced `<password>` in the connection string

### Build fails on Vercel
- Check Vercel deploy logs
- Try adding `--legacy-peer-deps` to the install command (already set in `vercel.json`)

---

## 💰 Cost Summary (Free Tier)

| Service | What You Get Free |
|---|---|
| **Vercel** | 100 GB/month bandwidth, unlimited static requests |
| **Render** | 750 instance hours/month, 5 GB bandwidth |
| **MongoDB Atlas** | 512 MB storage, shared cluster |
| **Total** | **$0/month** 🎉 |

---

## 🔄 How to Redeploy After Code Changes

**Frontend (Vercel):** Push to your GitHub `main` branch → Vercel auto-deploys ✅

**Backend (Render):** Push to your GitHub `main` branch → Render auto-deploys ✅

---

## 📚 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
