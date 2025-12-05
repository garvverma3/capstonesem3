# URGENT: Fix for Vercel Signup Error

## The Problem
You're seeing: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5001"

This means the frontend is still trying to connect to localhost instead of `/api`.

## Root Cause
The frontend build on Vercel is using the old code that defaults to localhost. Even though we fixed the code, Vercel needs to rebuild with the new code.

## IMMEDIATE FIX (Do This Now)

### Step 1: Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your project: `capstonesem3`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `/api`
   - **Environment**: Check all (Production, Preview, Development)
6. Click **Save**

### Step 2: Force Redeploy

1. Still in Vercel Dashboard
2. Go to **Deployments** tab
3. Click the **three dots** (⋯) on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

### Step 3: Clear Browser Cache

1. Open https://capstonesem3-9bha.vercel.app/signup
2. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac) to hard refresh
3. Or open in Incognito/Private window

### Step 4: Verify It's Working

1. Open browser console (F12)
2. Look for: `[API Client] Base URL: /api`
3. If you see `localhost:5001`, the build hasn't updated yet - wait a few minutes and try again

## Alternative: Manual Override

If the above doesn't work, you can manually override in the browser console:

```javascript
// Open browser console (F12) and run:
localStorage.setItem('API_URL', '/api');
location.reload();
```

But this is temporary - the proper fix is setting the environment variable.

## Why This Happens

React apps need environment variables at **build time**, not runtime. So:
- The code checks `process.env.REACT_APP_API_URL` first
- If not set, it tries to auto-detect
- But the auto-detection might not work if the build was done before the fix

Setting `REACT_APP_API_URL=/api` ensures it always uses the correct URL.

## Still Not Working?

1. **Check Vercel Build Logs**:
   - Vercel Dashboard → Deployments → Latest → Build Logs
   - Look for errors

2. **Check Function Logs**:
   - Vercel Dashboard → Deployments → Latest → Functions tab
   - Click on `api/index.js`
   - Look for errors

3. **Test API Directly**:
   ```bash
   curl https://capstonesem3-9bha.vercel.app/api/health
   ```
   Should return JSON, not HTML

4. **Verify Environment Variables**:
   - Make sure `MONGODB_URI` is set
   - Make sure `JWT_SECRET` is set
   - Make sure `JWT_REFRESH_SECRET` is set

## Expected Result

After setting the environment variable and redeploying:
- Browser console shows: `[API Client] Base URL: /api`
- Signup form works
- No "localhost" errors

The code fix has been pushed - you just need to set the environment variable and redeploy!

