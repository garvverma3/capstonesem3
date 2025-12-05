# Quick Fix for Vercel Signup Error

## Problem
You're seeing: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5001"

## Root Cause
The frontend is trying to connect to localhost instead of the Vercel API endpoint.

## Solution

### Option 1: Set Environment Variable in Vercel (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `capstonesem3`
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `/api`
   - **Environment**: Production, Preview, Development (select all)
5. **Redeploy** your application

### Option 2: Verify Current Configuration

The code should auto-detect production, but if it's not working:

1. Check Vercel build logs to see if `NODE_ENV=production` is set
2. The frontend should automatically use `/api` when deployed on Vercel
3. Check browser console (F12) - you should see `[API Client] Production mode detected, using /api`

### Option 3: Manual Override

If auto-detection isn't working, explicitly set the environment variable as shown in Option 1.

## Verify It's Working

After redeploying:

1. Open browser console (F12)
2. Look for: `[API Client] Base URL: /api`
3. Try signing up again
4. Check Network tab - API requests should go to `/api/auth/register` (relative URL)

## Still Not Working?

1. **Check Vercel Function Logs**:
   - Vercel Dashboard → Your Project → Deployments → Latest → Functions tab
   - Look for errors

2. **Check Environment Variables**:
   - Verify `MONGODB_URI` is set
   - Verify `JWT_SECRET` is set
   - Verify `JWT_REFRESH_SECRET` is set

3. **Test API Directly**:
   ```bash
   curl https://capstonesem3-9bha.vercel.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

4. **Check Browser Console**:
   - Look for CORS errors
   - Look for 404 errors
   - Look for 500 errors

## Expected Behavior

✅ **Working**: API requests go to `/api/auth/register` (relative URL)
❌ **Not Working**: API requests go to `http://localhost:5001/api/auth/register`

The fix has been committed - just need to set the environment variable and redeploy!

