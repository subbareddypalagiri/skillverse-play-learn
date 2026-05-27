#!/bin/bash
# Quick Deployment Commands for Skillverse

# ============================================================
# FRONTEND DEPLOYMENT (Vercel)
# ============================================================

# Step 1: Install Vercel CLI (one-time)
# npm install -g vercel

# Step 2: Login to Vercel (one-time)
# vercel login

# Step 3: Deploy to production
cd frontend
vercel --prod

# Or deploy with build cache cleared
# vercel --prod --skip-build

# ============================================================
# BACKEND DEPLOYMENT (Railway)
# ============================================================

# Step 1: Install Railway CLI (one-time)
# npm install -g @railway/cli

# Step 2: Login to Railway (one-time)
# railway login

# Step 3: Initialize project (first time only)
# cd backend
# railway init

# Step 4: Deploy/update backend
cd backend
railway up

# Step 5: View logs
railway logs

# Step 6: Get production URL
railway link

# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

# Frontend dev
cd frontend
npm install
npm run dev
# Open http://localhost:8080

# Backend dev
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your local MongoDB connection
npm run dev
# Server runs on http://localhost:5000

# ============================================================
# TESTING
# ============================================================

# Frontend build test
cd frontend
npm run build
npm run preview
# Test at http://localhost:4173

# Backend tests
cd backend
npm run test
npm run lint

# ============================================================
# DATABASE OPERATIONS
# ============================================================

# Seed database (local only)
cd backend
npm run seed:all

# Create database indexes
npm run create:indexes

# Run migrations
npm run migrate

# ============================================================
# ENVIRONMENT SETUP
# ============================================================

# Copy env files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env.local

# Generate JWT secrets
# Use: https://generate-secret.now.sh/ or
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ============================================================
# USEFUL LINKS
# ============================================================

# Vercel Dashboard: https://vercel.com/dashboard
# Railway Dashboard: https://railway.app/dashboard
# MongoDB Atlas: https://cloud.mongodb.com
# GitHub: (your repo URL)

# ============================================================
# TROUBLESHOOTING
# ============================================================

# Clear Node modules and reinstall (if issues)
# rm -rf node_modules package-lock.json
# npm install

# Clear build cache
# rm -rf dist/
# npm run build

# Check environment variables are loaded
# Backend: curl http://localhost:5000/health
# Frontend: Check browser console

# View Railway logs
railway logs --tail

# View Vercel logs
vercel logs --follow

# ============================================================
# QUICK REFERENCE
# ============================================================

echo "Deployment Commands:"
echo "Frontend:  cd frontend && vercel --prod"
echo "Backend:   cd backend && railway up"
echo "Logs:      railway logs --tail"
echo "Health:    curl https://your-railway-url/health"
