# Vercel Deployment Guide

## Overview

This guide explains how to deploy the Pharmacy Management System on Vercel. The application consists of:
- **Frontend**: React app (deployed as static site)
- **Backend**: Express.js API (deployed as serverless functions)

## Prerequisites

1. Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (for production database)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` for Vercel)
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/pharmacy`)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (or set to project root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Required Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmacy
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
CLIENT_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

### Optional Variables

```
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=5001
```

**Important**: 
- Replace `your-app.vercel.app` with your actual Vercel deployment URL
- Use strong, random strings for JWT secrets (you can generate with: `openssl rand -base64 32`)
- After adding variables, redeploy your application

## Step 4: Update Frontend API URL

The frontend will automatically use the Vercel deployment URL for API calls. However, if you need to override:

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `REACT_APP_API_URL=https://your-app.vercel.app/api`
3. Redeploy

## Step 5: Verify Deployment

1. Check the deployment logs in Vercel Dashboard
2. Visit your deployed URL: `https://your-app.vercel.app`
3. Test the health endpoint: `https://your-app.vercel.app/api/health`
4. Try logging in with test credentials

## Troubleshooting

### Issue: "Cannot connect to server" error

**Solution**: 
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify environment variables are set for Production environment

### Issue: CORS errors

**Solution**:
- Ensure `CLIENT_ORIGIN` matches your Vercel deployment URL exactly
- Check that `VERCEL_URL` environment variable is available (Vercel sets this automatically)

### Issue: API routes return 404

**Solution**:
- Verify `vercel.json` is in the project root
- Check that `api/index.js` exists
- Ensure routes are prefixed with `/api` in frontend calls

### Issue: Database connection fails

**Solution**:
- Verify MongoDB connection string format
- Check database user has correct permissions
- Ensure network access is configured in MongoDB Atlas

## Alternative: Separate Backend Deployment

If you prefer to deploy the backend separately (recommended for production):

1. **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
   - Set environment variables
   - Get backend URL (e.g., `https://your-backend.onrender.com`)

2. **Frontend**: Deploy to Vercel
   - Set `REACT_APP_API_URL=https://your-backend.onrender.com/api`
   - Deploy frontend only

## Project Structure for Vercel

```
project-root/
├── api/
│   └── index.js          # Serverless function wrapper
├── backend/              # Backend source code
├── frontend/            # Frontend source code
├── vercel.json         # Vercel configuration
└── package.json        # Root package.json (optional)
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/pharmacy` |
| `JWT_SECRET` | Secret for access tokens | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-refresh-secret` |
| `CLIENT_ORIGIN` | Frontend URL | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment | `production` |
| `REACT_APP_API_URL` | Backend API URL (optional) | `https://your-app.vercel.app/api` |

## Next Steps

1. Set up MongoDB Atlas
2. Configure environment variables in Vercel
3. Deploy the application
4. Test all functionality
5. Set up custom domain (optional)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas connection logs
3. Verify all environment variables are set
4. Check browser console for frontend errors

