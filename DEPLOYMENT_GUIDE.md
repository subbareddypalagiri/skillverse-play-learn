# Deployment Guide: Vercel + Railway

This guide covers deploying **Skillverse** frontend on Vercel and backend on Railway.

---

## 📋 Prerequisites

- Vercel account: https://vercel.com
- Railway account: https://railway.app
- MongoDB Atlas account: https://mongodb.com/cloud/atlas
- Git repository pushed to GitHub

---

## 🚀 Step 1: Frontend Deployment (Vercel)

### 1a. Connect to Vercel

```bash
npm install -g vercel
cd frontend
vercel login
```

### 1b. Deploy

```bash
vercel --prod
```

**Or deploy via GitHub:**
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Set root directory to `./frontend`
4. Framework: `Vite`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy

### 1c. Set Environment Variables in Vercel Dashboard

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - `VITE_API_URL`: `https://your-railway-backend.railway.app` (get this after deploying backend)
   - `VITE_GOOGLE_AI_KEY`: Your Google AI key

---

## 🚀 Step 2: Backend Deployment (Railway)

### 2a. Connect to Railway

```bash
npm install -g @railway/cli
cd backend
railway login
```

### 2b. Initialize and Deploy

```bash
railway init
railway up
```

**Or deploy via GitHub:**
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Railway auto-detects Node.js

### 2c. Set Environment Variables in Railway Dashboard

1. Go to your Railway project
2. Select "Variables" tab
3. Add the following:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/skillverse
CORS_ORIGINS=https://your-vercel-app.vercel.app
JWT_SECRET=generate_a_strong_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=100
```

### 2d. Get Your Railway Backend URL

After deployment:
1. Go to Railway project settings
2. Look for the generated domain (e.g., `railway-production-abc123.up.railway.app`)
3. Copy this URL

---

## 🗄️ Step 3: MongoDB Atlas Setup

### 3a. Create MongoDB Database

1. Go to https://mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for any IP)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/skillverse`

### 3b. Add to Railway Variables

Set `MONGO_URI` to your connection string in Railway dashboard.

---

## 🔄 Step 4: Connect Frontend to Backend

After backend is deployed and you have the Railway URL:

### 4a. Update Vercel Environment Variables

1. In Vercel dashboard, update `VITE_API_URL` to your Railway backend URL
2. Redeploy frontend

Or redeploy manually:
```bash
cd frontend
VITE_API_URL=https://your-railway-backend.railway.app vercel --prod
```

---

## ✅ Step 5: Verify Deployment

### Test Frontend
```
https://your-app.vercel.app
```

### Test Backend Health Check
```
curl https://your-railway-backend.railway.app/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is healthy",
  "environment": "production",
  "uptime": 123.45
}
```

### Test Database Connection
```
curl https://your-railway-backend.railway.app/ready
```

---

## 📊 Cost Breakdown (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Vercel Frontend** | ✅ Included | - |
| **Railway Backend** | $5 credit | $7-15 |
| **MongoDB Atlas** | Free | Based on usage |
| **Total** | ~$5/month | ~$12-20/month |

---

## 🐛 Troubleshooting

### CORS Errors
- Update `CORS_ORIGINS` in Railway to include your Vercel URL
- Restart the Railway service

### 502 Bad Gateway
- Check Railway logs: `railway logs`
- Verify MongoDB connection string
- Check if server is listening on `0.0.0.0` (not `localhost`)

### Environment Variables Not Loading
- Railway uses `.env` automatically
- Check Railway dashboard → Variables
- Restart deployment after adding variables

### Build Fails on Vercel
- Clear cache: Vercel Settings → Git → Clear Cache
- Check `build` script in `frontend/package.json`

---

## 📝 Local Environment Setup

Copy `.env.example` to `.env.local`:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local
# Update VITE_API_URL to http://localhost:5000

# Backend
cp backend/.env.example backend/.env.local
# Update MONGO_URI and other secrets
```

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGINS only includes trusted domains
- [ ] Database credentials are not in code
- [ ] S3 credentials are in environment variables
- [ ] Rate limiting is enabled
- [ ] SMTP password is app-specific (not main password)
- [ ] API keys are rotated regularly

---

## 📚 Useful Links

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express Deployment: https://expressjs.com/en/advanced/best-practice-performance.html

---

## 🆘 Support

For issues:
1. Check Railway logs: `railway logs`
2. Check Vercel deployment logs in dashboard
3. Monitor MongoDB Atlas status
4. Review CORS configuration

Happy deploying! 🚀
