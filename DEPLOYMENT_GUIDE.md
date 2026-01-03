# Xoom Mart - Complete Deployment Guide

**Deploy all three apps to production**

---

## Overview

This guide will help you deploy:
1. **Backend API** (NestJS) - Railway/Render
2. **Customer App** (Next.js) - Vercel
3. **Admin Panel** (Next.js) - Vercel
4. **Rider App** (Next.js) - Vercel

---

## Prerequisites

- GitHub account
- Vercel account (free)
- Railway or Render account (free tier available)
- Domain name (optional)

---

## Part 1: Deploy Backend API

### Option A: Deploy to Railway (Recommended)

**Step 1: Create Account**
1. Go to https://railway.app
2. Sign up with GitHub

**Step 2: Create PostgreSQL Database**
1. New Project → "Provision PostgreSQL"
2. Copy the `DATABASE_URL` from the PostgreSQL service

**Step 3: Deploy Backend**
1. New Project → "Deploy from GitHub repo"
2. Select `xoom-mart` repository
3. Select `backend` directory as root
4. Add environment variables:
   ```
   DATABASE_URL=<from-step-2>
   JWT_SECRET=your-super-secret-key-min-32-chars
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://your-customer-app.vercel.app,https://your-admin-app.vercel.app,https://your-rider-app.vercel.app
   ```

**Step 4: Run Migrations**
1. In Railway, open the backend service
2. Go to "Settings" → "Deploy"
3. Add custom start command:
   ```
   npx prisma migrate deploy && npx prisma db seed && npm run start:prod
   ```

**Step 5: Get API URL**
- Copy the public URL (e.g., `https://your-backend.up.railway.app`)

### Option B: Deploy to Render

**Step 1: Create PostgreSQL Database**
1. Go to https://render.com
2. New → PostgreSQL
3. Copy the `Internal Database URL`

**Step 2: Create Web Service**
1. New → Web Service
2. Connect GitHub repository
3. Root Directory: `backend`
4. Build Command: `npm install && npx prisma generate`
5. Start Command: `npx prisma migrate deploy && npm run start:prod`
6. Add environment variables (same as Railway)

---

## Part 2: Deploy Frontend Apps to Vercel

### Deploy Customer App

**Step 1: Import Project**
1. Go to https://vercel.com
2. New Project → Import Git Repository
3. Select `xoom-mart`
4. Framework Preset: Next.js
5. Root Directory: `apps/customer`

**Step 2: Configure Environment**
Add environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
NEXT_PUBLIC_SITE_NAME=Xoom Mart
NEXT_PUBLIC_CURRENCY=PKR
```

**Step 3: Deploy**
- Click "Deploy"
- Copy the deployment URL (e.g., `https://xoom-mart.vercel.app`)

### Deploy Admin Panel

Repeat the same steps with:
- Root Directory: `apps/admin`
- Environment:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
  NEXT_PUBLIC_SITE_NAME=Xoom Mart Admin
  ```

### Deploy Rider App

Repeat the same steps with:
- Root Directory: `apps/rider`
- Environment:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
  NEXT_PUBLIC_SITE_NAME=Xoom Mart Rider
  ```

---

## Part 3: Update Backend CORS

1. Go back to Railway/Render
2. Update `CORS_ORIGIN` environment variable with your Vercel URLs:
   ```
   CORS_ORIGIN=https://xoom-mart.vercel.app,https://admin-xoom-mart.vercel.app,https://rider-xoom-mart.vercel.app
   ```
3. Redeploy backend

---

## Part 4: Custom Domains (Optional)

### Add Custom Domain to Vercel

**For Customer App:**
1. Go to Vercel project settings
2. Domains → Add Domain
3. Enter your domain (e.g., `shop.xoommart.pk`)
4. Follow DNS configuration instructions

**For Admin:**
- Use subdomain: `admin.xoommart.pk`

**For Rider:**
- Use subdomain: `rider.xoommart.pk`

---

## Part 5: Post-Deployment Setup

### Seed Database (Production)

If database is empty:
```bash
# Connect to Railway/Render
railway run npx prisma db seed

# Or via Render dashboard
# Go to Shell tab and run:
npx prisma db seed
```

### Verify Deployment

**Check Backend:**
```bash
curl https://your-backend.up.railway.app/api/v1/categories
```

Should return categories list.

**Check Customer App:**
- Visit your Vercel URL
- Should load home page
- Check if API calls work

**Test Admin Login:**
- Email: `admin@xoommart.com`
- Password: `Admin@123`

---

## Part 6: Monitoring & Maintenance

### Set Up Monitoring

**Sentry (Error Tracking):**
1. Create account at https://sentry.io
2. Add SDK to all apps
3. Monitor errors in real-time

**Vercel Analytics:**
- Automatically enabled
- View in Vercel dashboard

**Railway Metrics:**
- View in Railway dashboard
- Monitor CPU, memory, requests

### Database Backups

**Railway:**
- Automatic daily backups included
- Manual backup: Dashboard → PostgreSQL → Backups

**Render:**
- Automatic backups on paid plans
- Manual: Use pg_dump

---

## Part 7: Continuous Deployment

**Auto-Deploy on Git Push:**

1. All apps auto-deploy when you push to GitHub
2. Vercel deploys on push to `main` branch
3. Railway deploys on push to connected branch

**Production Branch Setup:**
```bash
git checkout -b production
git push origin production
```

Configure Railway/Vercel to deploy from `production` branch.

---

## Troubleshooting

### Backend Not Starting
- Check logs in Railway/Render dashboard
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### CORS Errors
- Verify CORS_ORIGIN includes all frontend URLs
- Check URLs don't have trailing slashes

### Database Connection Error
- Verify DATABASE_URL format
- Check if database is running
- Ensure Prisma client is generated

### Frontend Can't Reach Backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is deployed and running
- Test backend URL directly in browser

---

## Cost Breakdown

**Free Tier (MVP):**
- Railway: Free 500 hours/month
- Vercel: Unlimited personal projects
- PostgreSQL: Free on Railway
- **Total: $0/month**

**Paid Tier (Scale):**
- Railway Pro: $5/month (backend + database)
- Vercel Pro: $20/month (all 3 apps)
- Domain: ~$15/year
- **Total: ~$25/month**

---

## Production Checklist

Before going live:

- [ ] Backend deployed and accessible
- [ ] Database migrated and seeded
- [ ] All frontend apps deployed
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Admin login working
- [ ] Test order flow end-to-end
- [ ] Custom domains configured (optional)
- [ ] Monitoring set up
- [ ] Backups enabled
- [ ] SSL/HTTPS working (automatic on Vercel)

---

## Rolling Back

**Vercel:**
- Go to Deployments tab
- Click on previous deployment
- Click "Promote to Production"

**Railway:**
- Go to Deployments
- Select previous deployment
- Click "Redeploy"

---

## Support

- **Railway:** https://railway.app/help
- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs

---

**Your apps are now live!** 🎉

Customer App: https://your-app.vercel.app
Admin Panel: https://your-admin.vercel.app
API Docs: https://your-backend.up.railway.app/api
