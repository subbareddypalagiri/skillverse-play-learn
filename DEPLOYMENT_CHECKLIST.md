# ✅ Deployment Checklist for Skillverse

Complete this checklist before deploying to production.

---

## 🔐 Security Preparation

- [ ] **Backend**
  - [ ] Change `JWT_SECRET` to a strong, random string
  - [ ] Change `JWT_REFRESH_SECRET` to a strong, random string
  - [ ] Update `CORS_ORIGINS` to only include your Vercel frontend URL
  - [ ] Generate new API keys for all third-party services
  - [ ] Remove all `console.log()` debug statements
  - [ ] Enable rate limiting in production
  - [ ] Set `NODE_ENV=production`

- [ ] **Frontend**
  - [ ] Remove all `console.log()` debug statements
  - [ ] Update `VITE_API_URL` to production Railway backend URL
  - [ ] Verify all API calls use environment variables
  - [ ] Test CORS requests work from production domain

---

## 📁 Database Preparation

- [ ] **MongoDB Atlas**
  - [ ] Create a dedicated database user (NOT admin)
  - [ ] Use strong password (32+ characters)
  - [ ] Whitelist Railway server IP (or use `0.0.0.0/0` temporarily)
  - [ ] Create proper database indexes for better performance
  - [ ] Run migrations: `npm run migrate`
  - [ ] Verify backups are enabled
  - [ ] Test connection string before deployment

---

## 🚀 Frontend Deployment (Vercel)

### Pre-Deployment
- [ ] Run `npm run build` locally and verify it succeeds
- [ ] Run `npm run lint` and fix all warnings
- [ ] Test locally: `npm run preview`
- [ ] Verify all environment variables are in `frontend/.env.example`
- [ ] Clear browser cache and test locally again

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Framework preset: `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables (Vercel)
- [ ] Add `VITE_API_URL` = `https://your-railway-backend.railway.app`
- [ ] Add `VITE_GEMINI_API_KEY` = your production key
- [ ] Add `VITE_RAPIDAPI_KEY` = your production key
- [ ] Add `VITE_TICKETMASTER_API_KEY` = your production key

### Post-Deployment
- [ ] Test homepage loads without errors
- [ ] Check browser console for errors
- [ ] Verify API calls reach the backend
- [ ] Test authentication flows (signup, login)
- [ ] Test file uploads if applicable
- [ ] Monitor Vercel analytics

---

## 🚀 Backend Deployment (Railway)

### Pre-Deployment
- [ ] Run `npm run lint` and fix all issues
- [ ] Run tests: `npm run test`
- [ ] Test locally: `npm run dev`
- [ ] Verify `server.js` listens on all interfaces (`0.0.0.0`, not `localhost`)
- [ ] Verify health check endpoint: `/health` returns 200

### Railway Setup
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Railway auto-detects Node.js
- [ ] Verify build command is `npm start`

### Environment Variables (Railway)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `MONGODB_URI` = your MongoDB Atlas connection string
- [ ] `CORS_ORIGINS` = your Vercel frontend URL
- [ ] `JWT_SECRET` = strong random string
- [ ] `JWT_REFRESH_SECRET` = strong random string
- [ ] `EMAIL_HOST` = your SMTP provider
- [ ] `EMAIL_USER` = your email
- [ ] `EMAIL_PASSWORD` = your app password
- [ ] `AWS_ACCESS_KEY_ID` = if using S3
- [ ] `AWS_SECRET_ACCESS_KEY` = if using S3
- [ ] `AWS_S3_BUCKET` = if using S3

### Post-Deployment
- [ ] Copy the Railway backend URL
- [ ] Test health endpoint: `curl https://your-railway-url/health`
- [ ] Test ready endpoint: `curl https://your-railway-url/ready`
- [ ] Check Railway logs for any errors
- [ ] Verify database connection is working
- [ ] Test a simple API endpoint manually

---

## 🔗 Integration Testing

After both are deployed:

- [ ] Update Vercel `VITE_API_URL` with Railway backend URL
- [ ] Redeploy frontend
- [ ] Test signup workflow end-to-end
- [ ] Test login workflow
- [ ] Test creating/viewing content
- [ ] Test file uploads
- [ ] Test WebSocket connections (if applicable)
- [ ] Test error handling (invalid inputs, 404s, 500s)

---

## 📊 Monitoring & Logging

### Set up monitoring
- [ ] Enable Railway health checks in settings
- [ ] Set up email notifications for deployment failures
- [ ] Monitor Vercel analytics dashboard
- [ ] Set up logging to external service if needed
- [ ] Create uptime monitoring (e.g., UptimeRobot)

### Regular checks
- [ ] Review Railway logs daily for errors
- [ ] Monitor MongoDB Atlas for performance
- [ ] Check Vercel build times
- [ ] Review error tracking (if set up)

---

## 🔄 Continuous Integration/Deployment

- [ ] Set up GitHub Actions for automated tests
- [ ] Set up branch protection rules
- [ ] Require passing tests before merging
- [ ] Set up automatic deployments on main branch
- [ ] Consider staging environment for testing

---

## 📝 Documentation

- [ ] Update README with production URLs
- [ ] Document all environment variables
- [ ] Create runbook for common issues
- [ ] Document how to rollback if needed
- [ ] Create incident response plan

---

## 💰 Cost Monitoring

- [ ] Set up billing alerts in Vercel
- [ ] Set up billing alerts in Railway
- [ ] Set up billing alerts in MongoDB Atlas
- [ ] Review costs monthly

---

## 🆘 Rollback Plan

- [ ] Document how to revert to previous version
- [ ] Keep git tags for releases
- [ ] Have list of critical environment variables backed up
- [ ] Know how to quickly redeploy if needed

---

## ✨ Final Checks

- [ ] All team members can access the dashboard
- [ ] DNS is configured correctly (if using custom domain)
- [ ] SSL certificate is valid (automatic with Vercel/Railway)
- [ ] Backup plan is in place
- [ ] Everyone knows the monitoring dashboard links

---

## 🎉 After Deployment

- [ ] Announce to team and users
- [ ] Monitor for first 24 hours
- [ ] Keep deployment terminal open for quick response
- [ ] Gather feedback from early users
- [ ] Plan optimization based on performance data

---

## 🚨 Emergency Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| DevOps Lead | | | |
| Backend Lead | | | |
| Frontend Lead | | | |

---

**Last Updated:** [Date]  
**Deployed By:** [Your Name]  
**Production URLs:**
- Frontend: https://your-vercel-app.vercel.app
- Backend: https://your-railway-backend.railway.app
